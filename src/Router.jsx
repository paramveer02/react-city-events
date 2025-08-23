import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetail, {
  eventDetailLoader,
} from "./components/events/EventDetail";
import CreateEventEntry, {
  createEventAction,
} from "./components/events/CreateEventEntry";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./layout/RootLayout";
import SignIn, { signinAction } from "./pages/authentication/SignIn";
import SignUp, { signupAction } from "./pages/authentication/SignUp";
import AuthContextProvider from "./contexts/AuthContext";
import MyEvents from "./pages/MyEvents";
import AIGuidePage from "./pages/AiGuidePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "myevents", element: <MyEvents /> },
      {
        path: "events/:id",
        element: <EventDetail />,
        loader: eventDetailLoader,
      },
      {
        path: "create",
        element: <CreateEventEntry />,
        action: createEventAction,
      },
      {
        path: "/signup",
        element: <SignUp />,
        action: signupAction,
      },
      {
        path: "/signin",
        element: <SignIn />,
        action: signinAction,
      },
      {
        path: "/ai-guide",
        element:<AIGuidePage />
      },
    ],
  },
]);

export default function Router() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />;
    </AuthContextProvider>
  );
}
