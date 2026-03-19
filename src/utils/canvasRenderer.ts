import { Shape } from '../types/review';
import { getVideoRenderedDimensions } from './videoCoordinates';

export const renderShapes = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  allShapes: Shape[],
  video: HTMLVideoElement | null
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3;

  let renderedWidth = canvas.width;
  let renderedHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (video && video.videoWidth && video.videoHeight) {
    const dimensions = getVideoRenderedDimensions(
      canvas.width,
      canvas.height,
      video.videoWidth,
      video.videoHeight
    );
    renderedWidth = dimensions.renderedWidth;
    renderedHeight = dimensions.renderedHeight;
    offsetX = dimensions.offsetX;
    offsetY = dimensions.offsetY;
  }

  const toX = (x: number) => (x * renderedWidth) + offsetX;
  const toY = (y: number) => (y * renderedHeight) + offsetY;

  allShapes.forEach(shape => {
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.beginPath();
    
    if (shape.points.length === 0) return;

    if (shape.tool === 'freehand') {
      ctx.moveTo(toX(shape.points[0].x), toY(shape.points[0].y));
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(toX(shape.points[i].x), toY(shape.points[i].y));
      }
      ctx.stroke();
    } else if (shape.tool === 'rect') {
      if (shape.points.length < 2) return;
      const p1 = shape.points[0];
      const p2 = shape.points[1];
      ctx.strokeRect(toX(p1.x), toY(p1.y), toX(p2.x) - toX(p1.x), toY(p2.y) - toY(p1.y));
    } else if (shape.tool === 'arrow') {
      if (shape.points.length < 2) return;
      const p1 = shape.points[0];
      const p2 = shape.points[1];
      
      ctx.moveTo(toX(p1.x), toY(p1.y));
      ctx.lineTo(toX(p2.x), toY(p2.y));
      ctx.stroke();

      const angle = Math.atan2(toY(p2.y) - toY(p1.y), toX(p2.x) - toX(p1.x));
      const headlen = 15;
      ctx.beginPath();
      ctx.moveTo(toX(p2.x), toY(p2.y));
      ctx.lineTo(toX(p2.x) - headlen * Math.cos(angle - Math.PI / 6), toY(p2.y) - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX(p2.x) - headlen * Math.cos(angle + Math.PI / 6), toY(p2.y) - headlen * Math.sin(angle + Math.PI / 6));
      ctx.lineTo(toX(p2.x), toY(p2.y));
      ctx.fill();
    }
  });
};
