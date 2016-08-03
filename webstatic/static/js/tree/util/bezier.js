var arc_to_bezier, segment_to_bezier;

segment_to_bezier = function(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
  var a00, a01, a10, a11, t, th_half, x1, x2, x3, y1, y2, y3;
  a00 = cos_th * rx;
  a01 = -sin_th * ry;
  a10 = sin_th * rx;
  a11 = cos_th * ry;
  th_half = 0.5 * (th1 - th0);
  t = (8 / 3) * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half);
  x1 = cx + Math.cos(th0) - t * Math.sin(th0);
  y1 = cy + Math.sin(th0) + t * Math.cos(th0);
  x3 = cx + Math.cos(th1);
  y3 = cy + Math.sin(th1);
  x2 = x3 + t * Math.sin(th1);
  y2 = y3 - t * Math.cos(th1);
  return [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
};

arc_to_bezier = function(ox, oy, radx, rady, rotateX, large, sweep, x, y) {
  var a00, a01, a10, a11, cos_th, d, i, pl, px, py, result, rx, ry, segments, sfactor, sfactor_sq, sin_th, th, th0, th1, th2, th3, th_arc, x0, x1, xc, y0, y1, yc;
  th = rotateX * (Math.PI / 180);
  sin_th = Math.sin(th);
  cos_th = Math.cos(th);
  rx = Math.abs(radx);
  ry = Math.abs(rady);
  px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
  py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
  pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
  if (pl > 1) {
    pl = Math.sqrt(pl);
    rx *= pl;
    ry *= pl;
  }
  a00 = cos_th / rx;
  a01 = sin_th / rx;
  a10 = -sin_th / ry;
  a11 = cos_th / ry;
  x0 = a00 * ox + a01 * oy;
  y0 = a10 * ox + a11 * oy;
  x1 = a00 * x + a01 * y;
  y1 = a10 * x + a11 * y;
  d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  sfactor_sq = 1 / d - 0.25;
  if (sfactor_sq < 0) {
    sfactor_sq = 0;
  }
  sfactor = Math.sqrt(sfactor_sq);
  if (sweep === large) {
    sfactor = -sfactor;
  }
  xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
  yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
  th0 = Math.atan2(y0 - yc, x0 - xc);
  th1 = Math.atan2(y1 - yc, x1 - xc);
  th_arc = th1 - th0;
  if (th_arc < 0 && sweep === 1) {
    th_arc += 2 * Math.PI;
  } else if (th_arc > 0 && sweep === 0) {
    th_arc -= 2 * Math.PI;
  }
  segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
  result = (function() {
    var j, ref, results;
    results = [];
    for (i = j = 0, ref = segments; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      th2 = th0 + i * th_arc / segments;
      th3 = th0 + (i + 1) * th_arc / segments;
      results.push(segment_to_bezier(xc, yc, th2, th3, rx, ry, sin_th, cos_th));
    }
    return results;
  })();
  return result;
};

module.exports = {
  arc_to_bezier: arc_to_bezier,
  segment_to_bezier: segment_to_bezier
};
