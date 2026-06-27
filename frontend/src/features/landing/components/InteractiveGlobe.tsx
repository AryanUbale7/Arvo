import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
}

interface Arc3D {
  p1Idx: number;
  p2Idx: number;
  progress: number;
  speed: number;
  color: string;
}

export const InteractiveGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // 1. Generate Points on a Sphere (Fibonacci Sphere Algorithm)
    const points: Point3D[] = [];
    const numPoints = 180;
    const radius = 220; // sphere radius

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      // Distribute brand colors (cyan and purple) with high-end whites
      let color = 'rgba(255, 255, 255, 0.4)';
      const rand = Math.random();
      if (rand < 0.35) {
        color = 'rgba(0, 194, 255, 0.65)'; // Cyan
      } else if (rand < 0.65) {
        color = 'rgba(124, 58, 237, 0.6)'; // Purple
      }

      points.push({ x, y, z, baseX: x, baseY: y, baseZ: z, color });
    }

    // 2. Generate Networking Arcs
    const arcs: Arc3D[] = [];
    const numArcs = 30;

    for (let i = 0; i < numArcs; i++) {
      const p1Idx = Math.floor(Math.random() * numPoints);
      let p2Idx = Math.floor(Math.random() * numPoints);
      while (p1Idx === p2Idx) {
        p2Idx = Math.floor(Math.random() * numPoints);
      }

      const isCyan = Math.random() > 0.5;
      const color = isCyan ? 'rgba(0, 194, 255, 0.5)' : 'rgba(124, 58, 237, 0.45)';

      arcs.push({
        p1Idx,
        p2Idx,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        color
      });
    }

    // 3. Track Mouse Coordinates for Rotation and Perspective Shift
    let rotX = 0.4; // Initial pitch
    let rotY = 0;   // Initial yaw
    let targetRotX = 0.4;
    let targetRotY = 0;
    
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Adjust target yaw and pitch based on cursor position relative to center
      const centerX = width / 2;
      const centerY = height / 2;
      
      if (isMouseDown) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        targetRotY += deltaX * 0.007;
        targetRotX += deltaY * 0.007;
      } else {
        // Soft responsive drift
        targetRotY = (x - centerX) * 0.0006;
        targetRotX = 0.4 + (y - centerY) * 0.0004;
      }
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // 4. Main Animation Frame Loop
    let animFrameId = 0;
    const focalLength = 480;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate rotation angles for smooth organic inertia
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.055;

      // Slowly auto-drift yaw when user is not actively dragging
      if (!isMouseDown) {
        targetRotY += 0.0012; 
      }

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Rotate points in 3D Space
      const projectedPoints = points.map((p) => {
        // Rotate around Y Axis (Yaw)
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate around X Axis (Pitch)
        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Perspective Projection
        const scale = focalLength / (focalLength + z2);
        const projX = width / 2 + x1 * scale;
        // Shift globe down slightly to resemble the horizon arc in the image
        const projY = height * 0.65 + y2 * scale;

        return { projX, projY, scale, z: z2, color: p.color };
      });

      // Depth Sort points so we render back elements, then planet sphere gradient, then front elements
      const sortedIndexes = Array.from({ length: numPoints }, (_, i) => i)
        .sort((a, b) => projectedPoints[b].z - projectedPoints[a].z);

      // Find split point between back points (z > 0) and front points (z <= 0)
      const midPointIdx = sortedIndexes.findIndex(idx => projectedPoints[idx].z <= 0);

      const backIndexes = sortedIndexes.slice(0, midPointIdx === -1 ? numPoints : midPointIdx);
      const frontIndexes = sortedIndexes.slice(midPointIdx === -1 ? numPoints : midPointIdx);

      // Draw Back Particles
      backIndexes.forEach((idx) => {
        const p = projectedPoints[idx];
        const r = Math.max(0.5, 2.2 * p.scale);
        
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 0;
        ctx.fill();
      });

      // Draw Atmospheric Planet Glow (OLED Space Horizon Style)
      const glowCenterY = height * 0.65;
      const gradient = ctx.createRadialGradient(
        width / 2, glowCenterY, radius * 0.6,
        width / 2, glowCenterY, radius * 1.15
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.4, 'rgba(7, 11, 20, 0.15)');
      gradient.addColorStop(0.7, 'rgba(0, 194, 255, 0.15)');  // Cyan atmosphere rim
      gradient.addColorStop(0.88, 'rgba(124, 58, 237, 0.08)'); // Purple glow rim
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(width / 2, glowCenterY, radius * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Update and Draw Network Arcs
      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        if (arc.progress > 1) {
          arc.progress = 0;
          arc.speed = 0.003 + Math.random() * 0.005;
        }

        const p1 = projectedPoints[arc.p1Idx];
        const p2 = projectedPoints[arc.p2Idx];

        // Draw connecting curves only if at least one point is on the front hemisphere to avoid clutter
        if (p1.z < 60 || p2.z < 60) {
          ctx.beginPath();
          ctx.moveTo(p1.projX, p1.projY);

          // Control point pulled outwards from sphere center to form curved arches
          const ctrlX = (p1.projX + p2.projX) / 2 + (p1.projX + p2.projX - width) * 0.12;
          const ctrlY = (p1.projY + p2.projY) / 2 + (p1.projY + p2.projY - glowCenterY) * 0.12 - 40;

          ctx.quadraticCurveTo(ctrlX, ctrlY, p2.projX, p2.projY);
          
          // Set gradient for arc
          const arcGrad = ctx.createLinearGradient(p1.projX, p1.projY, p2.projX, p2.projY);
          arcGrad.addColorStop(0, arc.color);
          arcGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

          ctx.strokeStyle = arcGrad;
          ctx.lineWidth = Math.max(0.3, 0.85 * ((p1.scale + p2.scale) / 2));
          ctx.stroke();

          // Draw shooting data packet node along the curve
          const t = arc.progress;
          const packetX = (1 - t) * (1 - t) * p1.projX + 2 * (1 - t) * t * ctrlX + t * t * p2.projX;
          const packetY = (1 - t) * (1 - t) * p1.projY + 2 * (1 - t) * t * ctrlY + t * t * p2.projY;

          ctx.beginPath();
          ctx.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#00C2FF';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // Reset shadow
        }
      });

      // Draw Front Particles
      frontIndexes.forEach((idx) => {
        const p = projectedPoints[idx];
        const r = Math.max(0.5, 3.2 * p.scale);
        
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, r, 0, Math.PI * 2);
        
        // Front particles have a subtle glow
        ctx.fillStyle = p.color;
        if (p.color !== 'rgba(255, 255, 255, 0.4)') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
export default InteractiveGlobe;
