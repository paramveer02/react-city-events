import { useEffect, useRef } from "react";

export default function Galaxy({
  density = 1.5,
  glowIntensity = 0.5,
  mouseRepulsion = true,
  mouseInteraction = true,
  transparent = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let mouse = { x: null, y: null };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Star class
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 * density;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.brightness = Math.random();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.baseSize = this.size;
      }

      update() {
        // Pulse effect
        this.brightness += this.pulseSpeed;
        if (this.brightness > 1 || this.brightness < 0.2) {
          this.pulseSpeed *= -1;
        }

        // Mouse interaction
        if (mouseInteraction && mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            if (mouseRepulsion) {
              // Repulsion
              this.x += (dx / distance) * force * 5;
              this.y += (dy / distance) * force * 5;
            } else {
              // Attraction
              this.x -= (dx / distance) * force * 2;
              this.y -= (dy / distance) * force * 2;
            }
            this.size = this.baseSize * (1 + force * 2);
          } else {
            this.size = this.baseSize;
          }
        }

        // Move stars
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.save();

        // Glow effect
        if (glowIntensity > 0) {
          const gradient = ctx.createRadialGradient(
            this.x,
            this.y,
            0,
            this.x,
            this.y,
            this.size * 5
          );
          gradient.addColorStop(
            0,
            `rgba(255, 255, 255, ${this.brightness * glowIntensity})`
          );
          gradient.addColorStop(
            0.5,
            `rgba(147, 112, 219, ${this.brightness * glowIntensity * 0.5})`
          );
          gradient.addColorStop(1, "rgba(147, 112, 219, 0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(
            this.x - this.size * 5,
            this.y - this.size * 5,
            this.size * 10,
            this.size * 10
          );
        }

        // Star core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.fill();

        ctx.restore();
      }
    }

    // Initialize stars
    const initStars = () => {
      stars = [];
      const numStars = Math.floor(
        ((canvas.width * canvas.height) / 3000) * density
      );
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
      }
    };

    // Animation loop
    const animate = () => {
      // Clear with transparency or black
      if (transparent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw stars
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Draw connections between nearby stars
      if (density > 1) {
        stars.forEach((star, i) => {
          stars.slice(i + 1).forEach((otherStar) => {
            const dx = star.x - otherStar.x;
            const dy = star.y - otherStar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(147, 112, 219, ${
                (1 - distance / 100) * 0.2
              })`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(otherStar.x, otherStar.y);
              ctx.stroke();
            }
          });
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    // Initialize
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, glowIntensity, mouseRepulsion, mouseInteraction, transparent]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: transparent ? "transparent" : "#000" }}
    />
  );
}
