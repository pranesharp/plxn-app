export interface Point {
  x: number;
  y: number;
}

function sign(p1: Point, p2: Point, p3: Point): number {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

export function isPointInTriangle(pt: Point, v1: Point, v2: Point, v3: Point): boolean {
  const d1 = sign(pt, v1, v2);
  const d2 = sign(pt, v2, v3);
  const d3 = sign(pt, v3, v1);

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNeg && hasPos);
}

export function isPointInPredictionCone(
  currentPos: Point,
  originPos: Point,
  targetRect: DOMRect
): boolean {
  if (!targetRect || targetRect.width === 0 || targetRect.height === 0) {
    return false;
  }

  if (
    currentPos.x >= targetRect.left &&
    currentPos.x <= targetRect.right &&
    currentPos.y >= targetRect.top &&
    currentPos.y <= targetRect.bottom
  ) {
    return true;
  }

  const topLeft: Point = { x: targetRect.left, y: targetRect.top };
  const topRight: Point = { x: targetRect.right, y: targetRect.top };
  const bottomLeft: Point = { x: targetRect.left, y: targetRect.bottom };
  const bottomRight: Point = { x: targetRect.right, y: targetRect.bottom };

  const inTopTriangle = isPointInTriangle(currentPos, originPos, topLeft, topRight);
  const inBottomTriangle = isPointInTriangle(currentPos, originPos, bottomLeft, bottomRight);
  const inLeftTriangle = isPointInTriangle(currentPos, originPos, topLeft, bottomLeft);
  const inRightTriangle = isPointInTriangle(currentPos, originPos, topRight, bottomRight);

  return inTopTriangle || inBottomTriangle || inLeftTriangle || inRightTriangle;
}
