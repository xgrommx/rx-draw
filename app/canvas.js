CanvasRenderingContext2D.prototype.drawLines = function (pen, points) {
    this.beginPath();
    this.strokeStyle = pen.color;
    this.lineWidth = pen.width;
    var i, x, y;
    x = points[0].x;
    y = points[0].y;
    for (i = 1; i < points.length; i++) {
        this.drawLine(pen, x, y, points[i].x, points[i].y);
        x = points[i].x;
        y = points[i].y;
    }
    this.save();
    this.stroke();
    this.closePath();
};

CanvasRenderingContext2D.prototype.drawRectangle = function (pen, x, y, width, height) {
    this.drawLine(pen, x, y, x + width, y, 1);
    this.drawLine(pen, x + width, y, x + width, y + height);
    this.drawLine(pen, x + width, y + height, x, y + height);
    this.drawLine(pen, x, y + height, x, y);

    this.beginPath();
    this.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.fillRect(x + 1, y + 1, width - 1, height - 1);
    this.fill();
    this.closePath();
};

CanvasRenderingContext2D.prototype.roundRect = function (pen, x, y, width, height, radius) {
    if (typeof radius === "undefined") {
        radius = 5;
    }
    this.beginPath();
    this.strokeStyle = 'red';
    this.lineWidth = 1;
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.save();
    this.stroke();
    this.closePath();
};

CanvasRenderingContext2D.prototype.drawLineWithArrow = function (pen, x1, y1, x2, y2) {
    this.beginPath();
    this.strokeStyle = pen.color;
    this.lineWidth = pen.width;
    var headlen = 5; // length of head in pixels
    var angle = Math.atan2(y2 - y1, x2 - x1);
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 9), y2 - headlen * Math.sin(angle - Math.PI / 9));
    this.moveTo(x2, y2);
    this.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 9), y2 - headlen * Math.sin(angle + Math.PI / 9));
    this.save();
    this.stroke();
    this.closePath();
};

CanvasRenderingContext2D.prototype.drawString = function (text, font, color, x, y) {
    this.font = `${font.size}px ${font.name}`;
    this.fillStyle = color;
    this.fillText(text, x, y);
    this.save();
};

CanvasRenderingContext2D.prototype.drawLine = function (pen, x1, y1, x2, y2) {
    this.beginPath();
    this.strokeStyle = pen.color;
    this.lineWidth = pen.width;
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.save();
    this.stroke();
    this.closePath();
};

CanvasRenderingContext2D.prototype.dashedLine = function (pen, x1, y1, x2, y2, dashLen) {
    this.beginPath();
    if (dashLen == undefined) dashLen = 2;
    this.moveTo(x1, y1);
    this.strokeStyle = pen.color;
    this.lineWidth = pen.width;

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
    this.stroke();
    this.closePath();
};