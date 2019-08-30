const normalize = (point) => {
  if (!Array.isArray(point)) return point;
  return {
    x: point[0],
    y: point[1]
  }
};

export default (points, signed) => {
  const l = points.length;
  let det = 0;
  const isSigned = signed || false;

  points = points.map(normalize);

  if (points[0] !== points[points.length - 1]) {
    points = points.concat(points[0]);
  }

  for (let i = 0; i < l; i++) {
    det += points[i].x * points[i + 1].y - points[i].y * points[i + 1].x;
  }

  if (isSigned) {
    return det / 2;
  }

  return Math.abs(det) / 2;
};

