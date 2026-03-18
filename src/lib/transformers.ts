import { Shape } from '../types/review';

/**
 * Serializes an array of shapes to a clean, JSON-serializable structure,
 * stripping out any internal React/DOM state before sending to PocketBase.
 * Ensures the points remain strictly as relative ratios.
 */
export const serializeAnnotations = (shapes: Shape[] | null): object[] | null => {
  if (!shapes || shapes.length === 0) return null;
  // Deep clone and normalize to strictly ensure all coordinates are 0.0-1.0 ratios
  const normalizedShapes = shapes.map(shape => ({
    ...shape,
    points: shape.points.map(point => ({
      x: Math.max(0, Math.min(1, Number(point.x.toFixed(4)))),
      y: Math.max(0, Math.min(1, Number(point.y.toFixed(4))))
    }))
  }));
  return JSON.parse(JSON.stringify(normalizedShapes));
};

/**
 * Deserializes raw JSON from PocketBase back into typed Shape objects for the React client.
 */
export const deserializeAnnotations = (data: unknown): Shape[] => {
  if (!data || !Array.isArray(data)) return [];
  // Ensure we cast it safely. We assume data aligns with Shape[].
  return data as Shape[];
};
