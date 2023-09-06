function drawRoads(canvasInfo) {
  canvasInfo.ctx.fillStyle = "gray";
  canvasInfo.ctx.fillRect(
    0,
    canvasInfo.centerY - canvasInfo.LANE,
    canvasInfo.WIDTH,
    2 * canvasInfo.LANE
  );
  canvasInfo.ctx.fillRect(
    canvasInfo.centerX - canvasInfo.LANE,
    0,
    2 * canvasInfo.LANE,
    canvasInfo.HEIGHT
  );
}

function drawPath(canvasInfo) {
  /*
  canvasInfo.ctx.beginPath();
  canvasInfo.ctx.arc(
    canvasInfo.centerX + canvasInfo.ISLAND * (Math.sqrt(2) + 1),
    canvasInfo.centerY - canvasInfo.ISLAND * (Math.sqrt(2) + 1),
    canvasInfo.ISLAND * (Math.sqrt(2) + 1)-canvasInfo.LANE/2,
    Math.PI/2,
    Math.PI
  );
  canvasInfo.ctx.strokeStyle = "yellow";
  canvasInfo.ctx.lineWidth = 3;
  canvasInfo.ctx.stroke();
  canvasInfo.ctx.closePath();

  canvasInfo.ctx.beginPath();
  canvasInfo.ctx.arc(
    canvasInfo.centerX,
    canvasInfo.centerY,
    canvasInfo.ISLAND + canvasInfo.LANE / 2,
    Math.PI-Math.PI/4,
    2 * Math.PI-Math.PI/4
  );
  canvasInfo.ctx.strokeStyle = "orange";
  canvasInfo.ctx.lineWidth = 3;
  canvasInfo.ctx.stroke();
  canvasInfo.ctx.closePath();

  
  canvasInfo.ctx.beginPath();
  canvasInfo.ctx.arc(
    canvasInfo.centerX - canvasInfo.ISLAND * (Math.sqrt(2) + 1),
    canvasInfo.centerY + canvasInfo.ISLAND * (Math.sqrt(2) + 1),
    canvasInfo.ISLAND * (Math.sqrt(2) + 1)-canvasInfo.LANE/2,
    0,
    -Math.PI/4,true
  );
  canvasInfo.ctx.strokeStyle = "purple";
  canvasInfo.ctx.lineWidth = 3;
  canvasInfo.ctx.stroke();
  canvasInfo.ctx.closePath();*/
}

function drawCornerArc(canvasInfo, cadransValues) {
  for (const cadranValues of cadransValues) {
    const [signX, signY, startAngle, endAngle] = cadranValues;
    const offset = canvasInfo.ISLAND * (Math.sqrt(2) + 1);

    canvasInfo.ctx.beginPath();
    canvasInfo.ctx.arc(
      canvasInfo.centerX + signX * offset,
      canvasInfo.centerY + signY * offset,
      offset - canvasInfo.LANE,
      startAngle,
      endAngle
    );
    canvasInfo.ctx.lineTo(canvasInfo.centerX, canvasInfo.centerY);
    canvasInfo.ctx.fillStyle = "gray";
    canvasInfo.ctx.fill();
    canvasInfo.ctx.closePath();
  }
}

function drawDashLines(canvasInfo) {
  canvasInfo.ctx.beginPath();
  canvasInfo.ctx.setLineDash([
    canvasInfo.WIDTH / 2 - (3 * canvasInfo.LANE + canvasInfo.ISLAND),
    2 * (3 * canvasInfo.LANE + canvasInfo.ISLAND),
  ]);
  canvasInfo.ctx.moveTo(0, canvasInfo.HEIGHT / 2);
  canvasInfo.ctx.lineTo(canvasInfo.WIDTH, canvasInfo.HEIGHT / 2);
  canvasInfo.ctx.strokeStyle = "white";
  canvasInfo.ctx.lineWidth = 2;
  canvasInfo.ctx.stroke();
  canvasInfo.ctx.closePath();

  canvasInfo.ctx.beginPath();
  canvasInfo.ctx.setLineDash([
    canvasInfo.HEIGHT / 2 - (3 * canvasInfo.LANE + canvasInfo.ISLAND),
    2 * (3 * canvasInfo.LANE + canvasInfo.ISLAND),
  ]);
  canvasInfo.ctx.moveTo(canvasInfo.WIDTH / 2, 0);
  canvasInfo.ctx.lineTo(canvasInfo.WIDTH / 2, canvasInfo.HEIGHT);
  canvasInfo.ctx.strokeStyle = "white";
  canvasInfo.ctx.lineWidth = 2;
  canvasInfo.ctx.stroke();
  canvasInfo.ctx.closePath();

  canvasInfo.ctx.setLineDash([]);
}

function drawDiamond(canvasInfo) {
  canvasInfo.ctx.beginPath();
  canvasInfo.ctx.moveTo(
    canvasInfo.centerX - (canvasInfo.ISLAND + 3 * canvasInfo.LANE),
    canvasInfo.centerY
  );
  canvasInfo.ctx.lineTo(
    canvasInfo.centerX,
    canvasInfo.centerY - (canvasInfo.ISLAND + 3 * canvasInfo.LANE)
  );
  canvasInfo.ctx.lineTo(
    canvasInfo.centerX + (canvasInfo.ISLAND + 3 * canvasInfo.LANE),
    canvasInfo.centerY
  );
  canvasInfo.ctx.lineTo(
    canvasInfo.centerX,
    canvasInfo.centerY + (canvasInfo.ISLAND + 3 * canvasInfo.LANE)
  );
  canvasInfo.ctx.lineTo(
    canvasInfo.centerX - (canvasInfo.ISLAND + 3 * canvasInfo.LANE),
    canvasInfo.centerY
  );
  canvasInfo.ctx.fillStyle = "white";
  canvasInfo.ctx.fill();
  canvasInfo.ctx.closePath();
}

function drawIslands(canvasInfo, cadransValues) {
  for (const cadranValues of cadransValues) {
    const [signX, signY, startAngle, endAngle] = cadranValues;
    const offset = canvasInfo.R;
    canvasInfo.ctx.beginPath();
    canvasInfo.ctx.arc(
      canvasInfo.centerX + offset * signX,
      canvasInfo.centerY + offset * signY,
      offset,
      startAngle,
      endAngle
    );
    canvasInfo.ctx.lineTo(canvasInfo.centerX, canvasInfo.centerY);
    canvasInfo.ctx.fillStyle = "white";
    canvasInfo.ctx.fill();
    canvasInfo.ctx.closePath();
  }
}

function drawCircles(canvasInfo, circlesValues) {
  for (const circleValues of circlesValues) {
    canvasInfo.ctx.beginPath();
    if (circleValues.dash) {
      canvasInfo.ctx.setLineDash([10, 5]);
    }
    canvasInfo.ctx.arc(
      canvasInfo.centerX,
      canvasInfo.centerY,
      circleValues.radius,
      0,
      2 * Math.PI
    );
    if (!circleValues.fill) {
      canvasInfo.ctx.strokeStyle = circleValues.color;
      canvasInfo.ctx.lineWidth = 3;
      canvasInfo.ctx.stroke();
    } else {
      canvasInfo.ctx.fillStyle = circleValues.color;
      canvasInfo.ctx.fill();
    }
    canvasInfo.ctx.closePath();
    canvasInfo.ctx.setLineDash([]);
  }
}
