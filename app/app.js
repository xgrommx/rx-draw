import {Observable} from 'rx';
import $ from 'jquery';
import {Font, Point, Pen} from './utils';
import './canvas';

$(() => {
    var canvas = $('canvas');

    var a = -5,
        b = 5,
        yMin = -4,
        yMax = 4,
        step_x, step_y, x0, y0, count_dx = 10,
        count_dy = 8,
        dx, dy, begin_x, begin_y, abciss = "X",
        ordinate = "Y",
        graph = null,
        context = null;

    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

    graph = canvas[0];
    graph.height = canvas.height();
    graph.width = canvas.width();
    context = graph.getContext('2d');

    if (document.defaultView && document.defaultView.getComputedStyle) {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(graph, null)['paddingLeft'], 10) || 0;
        stylePaddingTop = parseInt(document.defaultView.getComputedStyle(graph, null)['paddingTop'], 10) || 0;
        styleBorderLeft = parseInt(document.defaultView.getComputedStyle(graph, null)['borderLeftWidth'], 10) || 0;
        styleBorderTop = parseInt(document.defaultView.getComputedStyle(graph, null)['borderTopWidth'], 10) || 0;
    }

    function toX(x) {
        return parseInt(Math.round(x0 + (x - begin_x) * dx), 10);
    }

    function toY(y) {
        return parseInt(Math.round(y0 - (y - begin_y) * dy), 10);
    }

    function Xto(x) {
        return ((x - x0) / dx + begin_x);
    }

    /**
     * @return {number}
     */
    function Yto(y) {
        return -((y - y0) / dy + begin_y);
    }

    function YtoDrag(y) {
        return ((y - y0) / dy + begin_y);
    }

    function draw(a, b, yMin, yMax) {
        var xMin = a;
        var xMax = b;
        step_x = (xMax - xMin) / count_dx;
        step_y = (yMax - yMin) / count_dy;
        dx = (graph.width - 40) / count_dx / step_x;
        dy = (graph.height - 35) / count_dy / step_y;
        if (xMin < 0) {
            begin_x = 0;
            x0 = 20 + parseInt(-xMin * dx, 10);
        }
        if (xMin >= 0 || xMax <= 0) {
            begin_x = xMin;
            x0 = 22;
        }
        if (yMin < 0) {
            begin_y = 0;
            y0 = graph.height - 20 - parseInt(-yMin * dy, 10);
        }
        if (yMin >= 0 || yMax <= 0) {
            begin_y = yMin;
            y0 = graph.height - 20;
        }
        var axisPen = new Pen(1, 'black');
        var gridPen = new Pen(1, 'black');
        var chartPen = new Pen(2, 'lime');
        var font = new Font(11, "Arial");

        context.clearRect(0, 0, graph.width, graph.height);
        //draw grid
        var gran_x = parseInt(Math.ceil(x0 / count_dx), 10);
        for (var i = -gran_x + parseInt(a, 10); i <= gran_x + parseInt(b, 10); i++) {
            context.dashedLine(gridPen, toX(i), graph.height - 10, toX(i), 3, 1);
            context.drawLine(axisPen, toX(i), y0 - 3, toX(i), y0 + 4);
            context.drawString(i.toString(), font, 'navy', toX(i) - 12, y0 + 15);
        }
        var gran_y = parseInt(Math.ceil(y0 / count_dy), 10);
        for (var j = -gran_y + parseInt(yMin, 10); j <= gran_y + parseInt(yMax, 10); j++) {
            if (j.toString() == "0") continue;
            context.dashedLine(gridPen, 4, toY(j), graph.width - 8, toY(j), 1);
            context.drawLine(axisPen, x0 - 3, toY(j), x0 + 4, toY(j));
            context.drawString(j.toString(), font, 'navy', x0 - 15, toY(j));
        }
        //draw axis
        context.drawLineWithArrow(axisPen, 4, y0, graph.width - 5, y0);
        context.drawString(abciss, font, 'navy', graph.width - 20, y0 - 20);
        context.drawLineWithArrow(axisPen, x0, graph.height - 10, x0, 2);
        context.drawString(ordinate, font, 'navy', x0 + 10, 20);
        var points = [];

        for (var x = a; x < b + step_x / 20; x += 0.008) {
            points.push(new Point(toX(x), toY(Math.tan(x) * Math.cos(x + 30))));
        }
        context.drawLines(chartPen, points);
    }

    draw(a, b, yMin, yMax);

    var mouseDown = Observable.fromEvent(canvas, 'mousedown');
    var mouseMove = Observable.fromEvent(canvas, 'mousemove');
    var mouseUp = Observable.fromEvent(canvas, 'mouseup');

    var font = new Font(10, "Arial");
    var pen = new Pen(1, 'black');

    mouseDown.flatMap(e => {
        var firstPoint = new Point(e.pageX, e.pageY);

        context.drawString(
            `${Xto(e.pageX).toFixed(2)} : ${Yto(e.pageY).toFixed(2)}`, font, 'navy', e.pageX + 8, e.pageY - 8);

        return mouseMove.filter(e => e.button === 0).do(e => {
            draw(a, b, yMin, yMax);
            context.strokeStyle = 'black';
            context.drawString(`${Xto(e.pageX).toFixed(2)} : ${Yto(e.pageY).toFixed(2)}`, font, 'navy', e.pageX + 8, e.pageY - 8);
            context.drawRectangle(pen, firstPoint.x, firstPoint.y, e.pageX - firstPoint.x, e.pageY - firstPoint.y);
        }).merge(mouseMove.filter(e => e.button === 2).do(e => {

            a = a + Xto(firstPoint.x) - Xto(e.pageX);
            b = b + Xto(firstPoint.x) - Xto(e.pageX);
            yMin = yMin + Yto(firstPoint.y) - Yto(e.pageY);
            yMax = yMax + Yto(firstPoint.y) - Yto(e.pageY);
            firstPoint = new Point(e.pageX, e.pageY);

            context.drawString(`${Xto(e.pageX).toFixed(2)} : ${Yto(e.pageY).toFixed(2)}`, font, 'navy', e.pageX + 8, e.pageY - 8);
            draw(a, b, yMin, yMax);
        })).merge(mouseUp.filter(e => e.button === 0).do(e => {
            if (e.pageX - firstPoint.x > 0) {
                a = Xto(firstPoint.x);
                b = Xto(e.pageX);
                yMin = Yto(e.pageY);
                yMax = Yto(firstPoint.y);
            }
        }).merge(mouseUp.filter(e => e.button === 2).do(e => {

            a = a + (Xto(firstPoint.x) - Xto(e.pageX));
            b = b - (YtoDrag(firstPoint.y) - YtoDrag(e.pageY));
            yMin = yMin + Yto(firstPoint.y) - Yto(e.pageY);
            yMax = yMax + Yto(firstPoint.y) - Yto(e.pageY);
        }))).takeUntil(mouseUp.do(e => {
            draw(a, b, yMin, yMax);
        }));
    }).merge(mouseDown).subscribe(e => {
        switch(e.type) {
            case 'mouseup': {
                canvas.css({
                    cursor: 'pointer'
                });
                break;
            }
            case 'mousedown': {
                canvas.css({
                    cursor: e.button === 0 && e.button !== 1 ? 'crosshair' : 'move'
                });
                if (e.button === 1) {
                    canvas.css({
                        cursor: 'pointer'
                    });
                    a = -5, b = 5, yMax = 4, yMin = -4;
                    draw(a, b, yMin, yMax);
                }
                break;
            }
        }
    });
});