"use client";
import React from "react";

export default function Home() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(window.devicePixelRatio || 1, 1);
    const config = {
      bgTop: "#030814",
      bgBottom: "#050b17",
      vignette: "rgba(0,0,0,0.35)",
      outline: "#22c55e",
      outlineGlow: "rgba(34,197,94,0.25)",
      textColor: "#fef9c3",
      textGlow: "rgba(254,249,195,0.55)",
      textFont: "38px 'Segoe Script', 'Pacifico', 'Great Vibes', cursive",
      snowCount: 620,
      snowMin: 1.4,
      snowMax: 4.2,
      snowSpeedMin: 26,
      snowSpeedMax: 70,
      snowDrift: 24,
      snowSway: 18,
      garlandColors: ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"],
      garlandCount: 95,
      garlandGlow: 1,
      garlandSizeMin: 2.2,
      garlandSizeMax: 4.4,
      outlineWidth: 4.2,
      swayAmplitude: 0.01,
      swaySpeed: 0.0016,
      starSize: 18,
      starColor: "#facc15",
      starGlow: "rgba(250, 204, 21, 0.75)",
      sleighSpeed: 0.04,
      sleighHeightRatio: 0.24,
      sleighTrailLength: 260,
      sleighColor: "#e5e7eb",
      sleighGlow: "rgba(248,250,252,0.6)",
    };

    const snowflakes = Array.from({ length: config.snowCount }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: config.snowMin + Math.random() * (config.snowMax - config.snowMin),
      vy: config.snowSpeedMin + Math.random() * (config.snowSpeedMax - config.snowSpeedMin),
      vx: (Math.random() - 0.5) * config.snowDrift,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      dpr = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const outlinePath = (time: number) => {
      const { innerWidth: w, innerHeight: h } = window;
      const cx = w / 2;
      const top = h * 0.11;
      const base = h * 0.86;
      const width = Math.min(w * 0.48, 520);
      const tiers = [
        { y: h * 0.18, spread: 0.20 },
        { y: h * 0.32, spread: 0.30 },
        { y: h * 0.46, spread: 0.40 },
        { y: h * 0.6, spread: 0.50 },
        { y: h * 0.74, spread: 0.56 },
      ];

      const branchBaseAmplitude = 16;

      ctx.beginPath();
      const apexOffset =
        Math.sin(time * config.swaySpeed) * branchBaseAmplitude * 0.35;
      ctx.moveTo(cx, top);

      tiers.forEach((t, idx) => {
        const localAmp =
          branchBaseAmplitude * (1 - idx / (tiers.length + 1));
        const swayOffset =
          Math.sin(time * config.swaySpeed + idx * 0.9) * localAmp;

        const xL = cx - width * t.spread + swayOffset;
        const xR = cx + width * t.spread + swayOffset;
        const lift = idx % 2 === 0 ? 28 : 18;
        ctx.quadraticCurveTo(
          cx + apexOffset * 0.6,
          t.y - lift,
          xL,
          t.y
        );
        ctx.quadraticCurveTo(
          cx + apexOffset * 0.4,
          t.y + lift,
          xR,
          t.y
        );
      });

      const baseOffset =
        Math.sin(time * config.swaySpeed + Math.PI / 3) *
        branchBaseAmplitude *
        0.3;

      ctx.quadraticCurveTo(
        cx + baseOffset,
        base - 10,
        cx + width * 0.2 + baseOffset,
        base
      );
      ctx.quadraticCurveTo(
        cx + baseOffset * 0.6,
        base + 12,
        cx - width * 0.2 + baseOffset,
        base
      );
      ctx.quadraticCurveTo(cx, base - 10, cx, base - 4);
      ctx.closePath();
    };

    const spiralPoints = () => {
      const points: { x: number; y: number; size: number; color: string; phase: number }[] = [];
      const { innerWidth: w, innerHeight: h } = window;
      const cx = w / 2;
      const top = h * 0.11;
      const base = h * 0.86;
      const height = base - top;

      for (let i = 0; i < config.garlandCount; i++) {
        const t = i / (config.garlandCount - 1);
        const y = top + t * height;
        const radius = (1 - t) * (Math.min(w * 0.22, 240)) + 12;
        const angle = t * Math.PI * 6 + t * 0.8;
        const x = cx + Math.cos(angle) * radius * (0.82 + 0.18 * t);
        const size = config.garlandSizeMin + (1 - t) * (config.garlandSizeMax - config.garlandSizeMin);
        const color = config.garlandColors[i % config.garlandColors.length];
        points.push({ x, y, size, color, phase: Math.random() * Math.PI * 2 });
      }
      return points;
    };

    const garland = spiralPoints();

    const drawStar = (cx: number, cy: number, size: number) => {
      const spikes = 5;
      const outer = size;
      const inner = size * 0.48;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - outer);
      for (let i = 0; i < spikes; i++) {
        const angle = ((Math.PI * 2) / spikes) * i - Math.PI / 2;
        const next = angle + Math.PI / spikes;
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.lineTo(cx + Math.cos(next) * inner, cy + Math.sin(next) * inner);
      }
      ctx.closePath();
      ctx.fillStyle = config.starColor;
      ctx.shadowColor = config.starGlow;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    };

    const startTime = performance.now();
    let lastTime = startTime;
    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      const drawProgress = Math.min((time - startTime) / 3500, 1);

      const { innerWidth: w, innerHeight: h } = window;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, config.bgTop);
      bg.addColorStop(1, config.bgBottom);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // vignette
      const rad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
      rad.addColorStop(0, "rgba(0,0,0,0)");
      rad.addColorStop(1, config.vignette);
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, w, h);

      // text
      ctx.save();
      const fontSize = Math.max(28, Math.min(w * 0.045, 52));
      ctx.font = `${fontSize}px 'Segoe Script', 'Pacifico', 'Great Vibes', cursive`;
      ctx.fillStyle = config.textColor;
      ctx.textAlign = "center";
      ctx.shadowColor = config.textGlow;
      ctx.shadowBlur = 16;
      ctx.fillText("Marry Christmas em Loan", w / 2, h * 0.07);
      ctx.restore();

      // tree sway transform
      const cx = w / 2;
      // tree outline
      ctx.save();
      ctx.shadowColor = config.outlineGlow;
      ctx.shadowBlur = 24;
      ctx.strokeStyle = config.outline;
      ctx.lineWidth = config.outlineWidth;
       // progressive draw
      const dashLen = 3200;
      if (drawProgress < 1) {
        ctx.setLineDash([dashLen, dashLen]);
        ctx.lineDashOffset = dashLen * (1 - drawProgress);
      } else {
        ctx.setLineDash([]);
      }
      outlinePath(time);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // snow
      ctx.fillStyle = "#ffffff";
      snowflakes.forEach((s) => {
        const swayDrift = Math.sin(time * 0.0012 + s.phase) * config.snowSway;
        s.y += (s.vy + s.r * 4) * dt;
        s.x += ((s.vx + swayDrift) * dt) / w;
        // keep snow infinitely looping with staggered respawn
        if (s.y * dpr > h + s.r * 6) {
          s.y = -Math.random() * 0.25;
          s.x = Math.random();
        }
        if (s.x < -0.1) s.x = 1 + Math.random() * 0.1;
        if (s.x > 1.1) s.x = -Math.random() * 0.1;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // garland lights
      garland.forEach((p, idx) => {
        const hueIdx = idx % config.garlandColors.length;
        const color = config.garlandColors[hueIdx];
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.002 + p.phase);
        const size = p.size * (0.75 + 0.3 * pulse);
        ctx.save();
        const alpha = 0.6 + 0.35 * Math.sin(time * 0.003 + p.phase + idx * 0.07);
        ctx.shadowColor = color;
        ctx.shadowBlur = 16 * config.garlandGlow;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.globalAlpha = Math.max(0.3, alpha);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      });

      // star
      ctx.save();
      drawStar(cx, h * 0.075, config.starSize);
      ctx.restore();

      // sleigh & reindeers
      const sleighT =
        ((time - startTime) * 0.001 * config.sleighSpeed + 0.15) % 1.4 - 0.2;
      if (sleighT > -0.2 && sleighT < 1.2) {
        const baseY =
          h * config.sleighHeightRatio +
          Math.sin(time * 0.0012) * h * 0.01;
        const xMain = w * sleighT;

        const drawReindeer = (x: number, y: number, scale: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);

          // body
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = "rgba(248,250,252,0.95)";
          ctx.fillStyle = "rgba(15,23,42,0.4)";

          ctx.beginPath();
          ctx.ellipse(0, -2, 11, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // neck & head
          ctx.beginPath();
          ctx.moveTo(4, -4);
          ctx.quadraticCurveTo(10, -10, 12, -14);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(13.5, -15, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // nose glow
          ctx.save();
          ctx.fillStyle = "rgba(248,113,113,0.85)";
          ctx.shadowColor = "rgba(248,113,113,0.9)";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(15.2, -15, 1.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // antlers
          ctx.beginPath();
          ctx.moveTo(12, -18);
          ctx.lineTo(10, -23);
          ctx.moveTo(10, -21);
          ctx.lineTo(7.5, -24);
          ctx.moveTo(10.5, -22.5);
          ctx.lineTo(12.5, -25);

          ctx.moveTo(15, -18.2);
          ctx.lineTo(17, -23);
          ctx.moveTo(17, -21);
          ctx.lineTo(19.5, -24);
          ctx.moveTo(17.3, -22.8);
          ctx.lineTo(15.8, -25);
          ctx.stroke();

          // legs
          ctx.beginPath();
          ctx.moveTo(-4, 2);
          ctx.lineTo(-6, 8);
          ctx.moveTo(-1, 3);
          ctx.lineTo(-2, 9);
          ctx.moveTo(3, 3);
          ctx.lineTo(4, 9);
          ctx.moveTo(7, 2);
          ctx.lineTo(9, 8);
          ctx.stroke();

          // tail
          ctx.beginPath();
          ctx.moveTo(-10, -4);
          ctx.quadraticCurveTo(-13, -7, -11, -1);
          ctx.stroke();

          // harness band
          ctx.beginPath();
          ctx.moveTo(-2, -4);
          ctx.lineTo(7, -5);
          ctx.stroke();

          // small bell
          ctx.save();
          ctx.fillStyle = "rgba(250,204,21,0.9)";
          ctx.beginPath();
          ctx.arc(6, -3, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          ctx.restore();
        };

        ctx.save();
        ctx.shadowColor = config.sleighGlow;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = config.sleighColor;
        ctx.fillStyle = "rgba(15,23,42,0.85)";
        ctx.lineWidth = 2.2;

        // sleigh body
        const sleighY = baseY + Math.sin(time * 0.0015) * h * 0.006;
        ctx.beginPath();
        ctx.moveTo(xMain - 26, sleighY + 2);
        ctx.quadraticCurveTo(
          xMain - 16,
          sleighY - 14,
          xMain + 4,
          sleighY - 12
        );
        ctx.quadraticCurveTo(
          xMain + 20,
          sleighY - 10,
          xMain + 26,
          sleighY + 4
        );
        ctx.quadraticCurveTo(
          xMain + 10,
          sleighY + 12,
          xMain - 20,
          sleighY + 10
        );
        ctx.closePath();
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();

        // seat highlight
        ctx.beginPath();
        ctx.strokeStyle = "rgba(248,250,252,0.9)";
        ctx.moveTo(xMain - 18, sleighY);
        ctx.quadraticCurveTo(
          xMain - 4,
          sleighY - 6,
          xMain + 14,
          sleighY - 4
        );
        ctx.stroke();

        // runners
        ctx.beginPath();
        ctx.moveTo(xMain - 20, sleighY + 9);
        ctx.quadraticCurveTo(
          xMain - 10,
          sleighY + 14,
          xMain,
          sleighY + 11
        );
        ctx.quadraticCurveTo(
          xMain + 10,
          sleighY + 8,
          xMain + 18,
          sleighY + 10
        );
        ctx.stroke();

        // rope to reindeers
        ctx.beginPath();
        ctx.moveTo(xMain + 20, sleighY - 4);
        ctx.quadraticCurveTo(
          xMain + 60,
          sleighY - 14,
          xMain + 98,
          sleighY - 10
        );
        ctx.stroke();

        ctx.restore();

        // reindeers (3 heads)
        const herdOffset =
          Math.sin(time * 0.0016) * h * 0.004;
        drawReindeer(xMain + 98, sleighY - 10 + herdOffset, 1.05);
        drawReindeer(xMain + 122, sleighY - 12 + herdOffset * 1.3, 0.95);
        drawReindeer(xMain + 146, sleighY - 14 + herdOffset * 1.6, 0.88);

        // trailing light arc
        ctx.save();
        const trailStartX = xMain - config.sleighTrailLength * 0.6;
        const trailEndX = xMain - 18;
        const grad = ctx.createLinearGradient(
          trailStartX,
          sleighY - 26,
          trailEndX,
          sleighY - 16
        );
        grad.addColorStop(0, "rgba(56,189,248,0)");
        grad.addColorStop(1, "rgba(248,250,252,0.7)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trailStartX, sleighY - 18);
        ctx.quadraticCurveTo(
          (trailStartX + trailEndX) / 2,
          sleighY - 38,
          trailEndX,
          sleighY - 20
        );
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(render);
    };

    const raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="scene flex min-h-screen items-center justify-center">
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
}
