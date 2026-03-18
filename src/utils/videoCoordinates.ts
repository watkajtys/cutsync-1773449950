export interface VideoRenderedDimensions {
  renderedWidth: number;
  renderedHeight: number;
  offsetX: number;
  offsetY: number;
  scale: number;
}

/**
 * Calculates the exact rendered dimensions and offset of a video element
 * considering its object-fit: contain scaling within its bounding box.
 */
export function getVideoRenderedDimensions(
  containerWidth: number,
  containerHeight: number,
  videoWidth: number,
  videoHeight: number
): VideoRenderedDimensions {
  if (!videoWidth || !videoHeight || !containerWidth || !containerHeight) {
    return { renderedWidth: containerWidth, renderedHeight: containerHeight, offsetX: 0, offsetY: 0, scale: 1 };
  }

  const scale = Math.min(containerWidth / videoWidth, containerHeight / videoHeight);
  const renderedWidth = videoWidth * scale;
  const renderedHeight = videoHeight * scale;
  const offsetX = (containerWidth - renderedWidth) / 2;
  const offsetY = (containerHeight - renderedHeight) / 2;

  return { renderedWidth, renderedHeight, offsetX, offsetY, scale };
}

/**
 * Converts screen coordinates (from a mouse/pointer event) into normalized (0.0 to 1.0)
 * coordinates relative strictly to the rendered video frame, ignoring letterboxing.
 */
export function getNormalizedCoordinates(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  videoWidth: number,
  videoHeight: number
): { x: number; y: number } {
  const { renderedWidth, renderedHeight, offsetX, offsetY } = getVideoRenderedDimensions(
    rect.width,
    rect.height,
    videoWidth,
    videoHeight
  );

  return {
    x: (clientX - rect.left - offsetX) / renderedWidth,
    y: (clientY - rect.top - offsetY) / renderedHeight
  };
}

/**
 * Converts a normalized coordinate (0.0 to 1.0) back into absolute canvas pixels
 * for drawing shapes over the correct mapped video coordinates.
 */
export function getAbsoluteCoordinates(
  normalizedX: number,
  normalizedY: number,
  canvasWidth: number,
  canvasHeight: number,
  videoWidth: number,
  videoHeight: number
): { x: number; y: number } {
  const { renderedWidth, renderedHeight, offsetX, offsetY } = getVideoRenderedDimensions(
    canvasWidth,
    canvasHeight,
    videoWidth,
    videoHeight
  );

  return {
    x: (normalizedX * renderedWidth) + offsetX,
    y: (normalizedY * renderedHeight) + offsetY
  };
}
