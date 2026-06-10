import { useRef, useEffect } from 'react';
import { useKartStore } from './store';
import { trackCurve } from './trackCurve';

export default function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Track rendering scale
    // Map bounds are roughly X: [0, 180], Z: [-150, 150]
    // We will scale everything down to fit a 200x200 canvas
    const scale = 0.5;
    const offsetX = 100 - (90 * scale); // Center X (180/2 = 90)
    const offsetZ = 100; // Center Z (0)

    let animationFrameId: number;

    const renderMinimap = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'; // slate-900 with opacity
      ctx.beginPath();
      ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
      ctx.fill();

      // Draw Track Loop
      ctx.lineWidth = 15 * scale;
      ctx.strokeStyle = '#334155'; // road color
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      const points = trackCurve.getPoints(50);
      ctx.beginPath();
      points.forEach((p, i) => {
        const drawX = p.x * scale + offsetX;
        const drawZ = p.z * scale + offsetZ;
        if (i === 0) ctx.moveTo(drawX, drawZ);
        else ctx.lineTo(drawX, drawZ);
      });
      ctx.closePath();
      ctx.stroke();

      // Draw Finish Line
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0 * scale + offsetX - 10, 0 * scale + offsetZ);
      ctx.lineTo(0 * scale + offsetX + 10, 0 * scale + offsetZ);
      ctx.stroke();

      // Get Positions from Store
      const { position, opponentPosition, rotation, opponentRotation } = useKartStore.getState();

      // Draw Opponent (Red Dot with direction)
      const oppDrawX = opponentPosition.x * scale + offsetX;
      const oppDrawZ = opponentPosition.z * scale + offsetZ;
      ctx.save();
      ctx.translate(oppDrawX, oppDrawZ);
      ctx.rotate(-opponentRotation.y); // ThreeJS Y rotation vs Canvas 2D rotation
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(4, -4);
      ctx.lineTo(-4, -4);
      ctx.fill();
      ctx.restore();

      // Draw Local Player (Cyan Dot with direction)
      const myDrawX = position.x * scale + offsetX;
      const myDrawZ = position.z * scale + offsetZ;
      ctx.save();
      ctx.translate(myDrawX, myDrawZ);
      ctx.rotate(-rotation.y); 

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(5, -5);
      ctx.lineTo(-5, -5);
      ctx.fill();
      
      // Halo for local player
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(renderMinimap);
    };

    renderMinimap();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute top-6 right-6 border-2 border-slate-600 rounded-2xl overflow-hidden shadow-2xl z-40 backdrop-blur-sm">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200} 
        className="w-[200px] h-[200px]"
      />
    </div>
  );
}
