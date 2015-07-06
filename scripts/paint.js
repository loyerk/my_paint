/*jslint browser: true, node: true */
/*global $, jQuery, alert, google*/
/*jslint bitwise: true */
"use strict";

$(document).ready(function () {

    var canvas = document.getElementById('paintZone'),
        context = canvas.getContext('2d'),
        drawing = false,
        tool = $(".tool").attr('value'),
        option = $(".option").attr('value'),
        rect = {},
        arc = {},
        posLine = {},
        heart = {},
        hex,
        cropImage,
        bgColor = 'white',
        toolColor,
        toolColorFill,
        toolSize = 2,
        toolCap = 'round',
        fillVal = false,
        setShadow = false,
        tools,
        $this,
        tmp,
        eX,
        eY,
        aeroStartX,
        aeroStartY,
        aeroX,
        aeroY,
        picker,
        ctx,
        i,
        j,
        rgb = 0,
        pos,
        x,
        y,
        newCtx,
        color,
        resultatRGB,
        arr,
        sel,
        min,
        max,
        select;

    console.log(aeroStartX + aeroStartY + j);
    console.log(eX + eY);

    canvas.oncontextmenu = function () {

        return false;
    };

    $("#paintZone")
        .attr("width", 1000)
        .attr("height", 800);

    //coeur
    function drawHeart() {

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(heart.startX, heart.startY);
        context.scale((heart.w / canvas.width) * 1.5, (heart.h / canvas.height) * 1.5);

        context.beginPath();
        context.moveTo(heart.startX, heart.startY);
        context.bezierCurveTo(heart.startX, heart.startY - 3, heart.startX - 5, heart.startY - 14, heart.startX - 25, heart.startY - 14);
        context.bezierCurveTo(heart.startX - 60, heart.startY - 14, heart.startX - 60, heart.startY + 22, heart.startX - 60, heart.startY + 22);
        context.bezierCurveTo(heart.startX - 60, heart.startY + 40, heart.startX - 40, heart.startY + 62, heart.startX, heart.startY + 80);
        context.bezierCurveTo(heart.startX + 40, heart.startY + 62, heart.startX + 60, heart.startY + 40, heart.startX + 60, heart.startY + 22);
        context.bezierCurveTo(heart.startX + 60, heart.startY + 22, heart.startX + 60, heart.startY - 14, heart.startX + 25, heart.startY - 14);
        context.bezierCurveTo(heart.startX + 10, heart.startY - 14, heart.startX, heart.startY - 6, heart.startX, heart.startY);
        context.closePath();

        if (tools.Heart.shadow === true) {

            context.shadowBlur = 20;
            context.shadowColor = "black";

        } else {

            context.shadowBlur = 0;
            context.shadowColor = "black";

        }
        if (tools.Heart.fill === true) {

            context.fillStyle = tools.Heart.colorFill;
            context.fill();
            context.strokeStyle = tools.Heart.Color;
            context.stroke();

        } else {

            context.strokeStyle = tools.Heart.Color;
            context.stroke();
        }

        context.putImageData(tmp, 0, 0);
        context.stroke();
        context.restore();

    }

    function hearting() {

        if (tool === 'heart') {

            $("#paintZone").mousedown(function (e) {

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);
                heart.startX = e.pageX - this.offsetLeft;
                heart.startY = e.pageY - this.offsetTop;

                drawing = true;
            });

            $("#paintZone").mouseup(function () {

                drawing = false;
            });

            $("#paintZone").mousemove(function (e) {

                if (drawing === true) {

                    heart.w = (e.pageX - this.offsetLeft) - heart.startX;
                    heart.h = (e.pageY - this.offsetTop) - heart.startY;

                    eX = e.pageX;
                    eY = e.pageY;

                    drawHeart();
                }
            });
        }
    }

    //Brosse
    function brushing() {

        if (tool === 'brush') {

            $("#paintZone").mousedown(function (e) {

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);

                drawing = true;
                context.beginPath();

                context.lineWidth = tools.brush.siZe;
                context.lineJoin = context.lineCap = tools.brush.cap;
                context.moveTo(e.pageX, e.pageY);

            });

            $("#paintZone").mouseup(function () {

                drawing = false;
            });

            $("#paintZone").mousemove(function (e) {

                if (e.pageX >= canvas.width || e.pageY >= canvas.height) {

                    drawing = false;
                }

                if (drawing === true) {

                    if (tools.brush.shadow === true) {

                        context.shadowBlur = 20;
                        context.shadowColor = "black";
                    } else {

                        context.shadowBlur = 0;
                        context.shadowColor = "black";
                    }

                    context.lineTo(e.pageX, e.pageY);
                    context.putImageData(tmp, 0, 0);

                    context.strokeStyle = tools.brush.Color;
                    context.stroke();

                }
            });
        }
    }

    //Aerographe
    function drawAero() {

        context.beginPath();
        context.arc(aeroX + Math.cos(Math.random() * Math.PI * 2) * tools.aero.siZe * Math.random(), aeroY + Math.cos(Math.random() * Math.PI * 2) * tools.aero.siZe * Math.random(), 1, 0, 2 * Math.PI, false);
        //context.lineWidth = tools.aero.siZe;

        if (tools.aero.fill === true) {

            context.fillStyle = tools.aero.colorFill;
            context.fill();
            context.strokeStyle = tools.aero.Color;
            context.stroke();
        } else {

            context.strokeStyle = tools.aero.Color;
            context.stroke();
        }


    }
    function aerographing() {

        if (tool === 'aerograph') {

            $("#paintZone").mousedown(function (e) {

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);

                drawing = true;

                aeroStartX = e.pageX;
                aeroStartY = e.pageY;
            });

            $("#paintZone").mouseup(function () {

                drawing = false;
            });

            $("#paintZone").mousemove(function (e) {

                if (e.pageX >= canvas.width || e.pageY >= canvas.height) {

                    drawing = false;
                }

                if (drawing === true) {

                    aeroX = e.pageX;
                    aeroY = e.pageY;

                    drawAero();
                }
            });
        }
    }

    //Ligne
    function drawLine() {

        context.beginPath();
        context.lineWidth = tools.line.siZe;
        context.lineJoin = context.lineCap = tools.line.cap;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(tmp, 0, 0);

        context.moveTo(posLine.startX, posLine.startY);
        context.lineTo(posLine.endX, posLine.endY);

        context.strokeStyle = tools.line.Color;

        if (tools.line.shadow === true) {

            context.shadowBlur = 20;
            context.shadowColor = "black";
        } else {

            context.shadowBlur = 0;
            context.shadowColor = "black";
        }

        context.stroke();
    }
    function lineing() {

        if (tool === 'line') {

            $("#paintZone").mousedown(function (e) {

                drawing = true;

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);

                posLine.startX = e.pageX - this.offsetLeft;
                posLine.startY = e.pageY - this.offsetTop;
            });

            $("#paintZone").mouseup(function () {

                drawing = false;
            });

            $("#paintZone").mousemove(function (e) {

                if (e.pageX >= canvas.width || e.pageY >= canvas.height) {

                    drawing = false;
                }

                if (drawing === true) {

                    posLine.endX = e.pageX;
                    posLine.endY = e.pageY;

                    drawLine();
                }

            });
        }
    }


    //rectangle
    function drawRectangle() {

        context.beginPath();
        context.lineWidth = tools.rectangle.siZe;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(tmp, 0, 0);
        context.strokeStyle = tools.rectangle.Color;
        context.strokeRect(rect.startX, rect.startY, rect.w, rect.h);

        if (tools.rectangle.shadow === true) {

            context.shadowBlur = 20;
            context.shadowColor = "black";
        } else {

            context.shadowBlur = 0;
            context.shadowColor = "black";
        }

        if (tools.circle.fill === true) {

            context.fillStyle = tools.rectangle.colorFill;
            context.fillRect(rect.startX, rect.startY, rect.w, rect.h);

        }
    }
    function rectangleing() {

        if (tool === 'rectangle') {

            $("#paintZone").mousedown(function (e) {

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);
                rect.startX = e.pageX - this.offsetLeft;
                rect.startY = e.pageY - this.offsetTop;

                drawing = true;
            });

            $("#paintZone").mouseup(function () {

                drawing = false;
            });

            $("#paintZone").mousemove(function (e) {

                if (drawing === true) {

                    rect.w = (e.pageX - this.offsetLeft) - rect.startX;
                    rect.h = (e.pageY - this.offsetTop) - rect.startY;

                    drawRectangle();
                }
            });
        }
    }


    //cercle
    function drawCircle() {

        if (arc.w >= 0) {

            context.beginPath();
            context.lineWidth = tools.circle.siZe;
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.arc(arc.startX, arc.startY, arc.w, 0, 2 * Math.PI);
            context.putImageData(tmp, 0, 0);

            if (tools.circle.shadow === true) {

                context.shadowBlur = 20;
                context.shadowColor = "black";
            } else {

                context.shadowBlur = 0;
                context.shadowColor = "black";
            }


            if (tools.circle.fill === false) {

                context.strokeStyle = tools.circle.Color;
                context.stroke();

            } else {

                context.fillStyle = tools.circle.colorFill;
                context.fill();
                context.strokeStyle = tools.circle.Color;
                context.stroke();
            }
        }
    }
    function circleing() {

        if (tool === 'circle') {

            console.log('cercle');

            $("#paintZone").mousedown(function (e) {

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);

                arc.startX = e.pageX - this.offsetLeft;
                arc.startY = e.pageY - this.offsetTop;

                drawing = true;
            });

            $("#paintZone").mouseup(function () {

                drawing = false;
            });

            $("#paintZone").mousemove(function (e) {


                if (drawing === true) {

                    arc.w = (e.pageX - this.offsetLeft) - arc.startX;

                    drawCircle();
                }
            });
        }
    }

    function gommeing() {

        $("#paintZone").mousedown(function (e) {

            tmp = context.getImageData(0, 0, canvas.width, canvas.height);

            drawing = true;
            context.beginPath();
            context.lineWidth = tools.gomme.siZe;
            context.lineJoin = context.lineCap = tools.gomme.cap;
            context.moveTo(e.pageX, e.pageY);

        });

        $("#paintZone").mouseup(function () {

            drawing = false;
        });

        $("#paintZone").mousemove(function (e) {

            if (drawing === true) {


                context.putImageData(tmp, 0, 0);
                context.lineTo(e.pageX, e.pageY);
                context.strokeStyle = tools.gomme.Color;
                context.stroke();
            }
        });
    }

    function clearing() {

        context.clearRect(0, 0, canvas.width, canvas.height);
        tmp = context.getImageData(0, 0, canvas.width, canvas.height);
        context.putImageData(tmp, 0, 0);
        $("#paintZone")
            .attr("width", 1000)
            .attr("height", 800);
    }

    // set up some sample squares
    picker = document.getElementById('picker');
    ctx = picker.getContext('2d');
    j = 0;

    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + i + "," + i + "," + i + ")";
        ctx.fillRect(i, 40, 10, 10);
    }
    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + rgb + "," + i + "," + i + ")";
        ctx.fillRect(i, 50, 10, 10);
    }
    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + rgb + "," + rgb + "," + i + ")";
        ctx.fillRect(i, 30, 10, 10);
    }
    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + i + "," + i + "," + rgb + ")";
        ctx.fillRect(i, 0, 10, 10);
    }
    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + i + "," + rgb + "," + rgb + ")";
        ctx.fillRect(i, 10, 10, 10);
    }
    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + rgb + "," + i + "," + rgb + ")";
        ctx.fillRect(i, 20, 10, 10);
    }
    for (i = 0; i <= 255; i = i + 1) {
        ctx.fillStyle = "rgb(" + i + "," + rgb + "," + i + ")";
        ctx.fillRect(i, 60, 10, 10);
    }

    function findPos(e) {

        var cursorLeft = 0, cursorTop = 0;

        if (e.offsetParent) {

            do {
                cursorLeft += e.offsetLeft;
                cursorTop += e.offsetTop;

            } while (e === e.offsetParent);

            return { x: cursorLeft, y: cursorTop };
        }

        return undefined;
    }
    function rgbToHex(r, g, b) {

        if (r > 255 || g > 255 || b > 255) {

            throw "Invalid color component";

        }

        resultatRGB = ((r << 16) | (g << 8) | b).toString(16);
        return resultatRGB;
    }
    $('#picker').mousemove(function (e) {

        pos = findPos(this);
        x = e.pageX - pos.x;
        y = e.pageY - pos.y;
        newCtx = this.getContext('2d');
        color = newCtx.getImageData(x, y, 1, 1).data;
        hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
        $('#status').html(hex);

    });

    $('#statusR').height(20);
    $('#statusR').width(20);
    $('#statusL').height(20);
    $('#statusL').width(20);

    picker = document.getElementById('picker');

    picker.oncontextmenu = function () {

        return false;
    };

    arr = [
        {val : 1, text: 'One'},
        {val : 2, text: 'Two'},
        {val : 3, text: 'Three'}
    ];

    sel = $('<select>').appendTo('body.options');

    $(arr).each(function () {

        sel.append($("<option>").attr('value', this.val).text(this.text));
    });

    min = 1;
    max = 100;
    select = document.getElementById('size');

    for (i = min; i <= max; i = i + 1) {
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + " px";
        select.appendChild(option);
    }

    //crop
    function drawCrop() {

        context.beginPath();
        context.lineWidth = tools.crop.siZe;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(tmp, 0, 0);

        context.strokeStyle = tools.crop.Color;
        context.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
    }
    function crop() {

        if (tool === 'crop') {

            $("#paintZone").mousedown(function (e) {

                tmp = context.getImageData(0, 0, canvas.width, canvas.height);
                rect.startX = e.pageX - this.offsetLeft;
                rect.startY = e.pageY - this.offsetTop;

                drawing = true;
            });

            $("#paintZone").mouseup(function () {

                cropImage = context.getImageData(rect.startX, rect.startY, rect.w, rect.h);
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawing = false;

                $("#paintZone")
                    .attr("width", cropImage.width)
                    .attr("height", cropImage.height);

                context.putImageData(cropImage, 0, 0);


            });

            $("#paintZone").mousemove(function (e) {

                if (drawing === true) {

                    rect.w = (e.pageX - this.offsetLeft) - rect.startX;
                    rect.h = (e.pageY - this.offsetTop) - rect.startY;

                    drawCrop();
                }
            });
        }
    }

    function initTools(fillVal) {

        console.log('initTools');

        tools = {
            brush: {
                siZe: toolSize,
                Color: toolColor,
                colorFill: toolColorFill,
                fill: fillVal,
                cap: toolCap,
                shadow: setShadow
            },
            line: {
                siZe: toolSize,
                Color: toolColor,
                colorFill: toolColorFill,
                fill: fillVal,
                cap: toolCap,
                shadow: setShadow
            },
            rectangle: {
                siZe: toolSize,
                Color: toolColor,
                colorFill: toolColorFill,
                fill: fillVal,
                cap: toolCap,
                shadow: setShadow
            },
            circle: {
                siZe: toolSize,
                Color: toolColor,
                colorFill: toolColorFill,
                fill: fillVal,
                cap: toolCap,
                shadow: setShadow
            },
            Heart: {
                siZe: toolSize,
                Color: toolColor,
                colorFill: toolColorFill,
                fill: fillVal,
                cap: toolCap,
                shadow: setShadow
            },
            gomme: {
                siZe: toolSize,
                Color: bgColor,
                fill: fillVal,
                cap: toolCap
            },
            crop: {
                siZe: 1,
                Color: 'black',
                colorFill: 'black',
                fill: false
            },
            aero: {
                siZe: toolSize,
                Color: toolColor,
                colorFill: toolColorFill,
                fill: fillVal,
                cap: toolCap,
                shadow: setShadow
            }
        };

        brushing();
        lineing();
        rectangleing();
        circleing();
        hearting();
        aerographing();

        return tools;
    }

    $(".tool").click(function () {

        $this = $(this);
        tool = $this.attr('value');

        if (tool === 'brush') {

            $("#paintZone").unbind();
            brushing();
        }
        if (tool === 'line') {

            $("#paintZone").unbind();
            lineing();
        }
        if (tool === 'rectangle') {

            $("#paintZone").unbind();
            rectangleing();
        }
        if (tool === 'circle') {

            $("#paintZone").unbind();
            circleing();
        }
        if (tool === 'gomme') {

            $("#paintZone").unbind();
            gommeing();
        }
        if (tool === 'clear') {

            $("#paintZone").unbind();
            clearing();
        }
        if (tool === 'crop') {

            $("#paintZone").unbind();
            crop();
        }
        if (tool === 'heart') {

            $("#paintZone").unbind();
            hearting();
        }
        if (tool === 'aerograph') {

            $("#paintZone").unbind();
            aerographing();
        }
    });

    $(".option").click(function () {

        $this = $(this);
        option = $this.attr('value');

        if (option === 'fill') {

            fillVal = true;
            tools = {};
            initTools(fillVal);
            $("#paintZone").unbind();
            brushing();
            lineing();
            rectangleing();
            circleing();
            hearting();
            aerographing();
        }
        if (option === 'stroke') {

            fillVal = false;
            tools = {};
            initTools(fillVal);
            brushing();
            lineing();
            rectangleing();
            circleing();
            hearting();
            aerographing();
        }
        if (option === 'shadow') {

            setShadow = true;
            tools = {};
            initTools(fillVal);
            brushing();
            lineing();
            rectangleing();
            circleing();
            hearting();
            aerographing();
        }
        if (option === 'pashadow') {

            setShadow = false;
            tools = {};
            initTools(fillVal);
            brushing();
            lineing();
            rectangleing();
            circleing();
            hearting();
            aerographing();
        }
    });
    $('#picker').mousedown(function (e) {

        switch (e.which) {
        case 1:
            tools = {};
            toolColor = hex;
            $('#color').html(hex);
            initTools();
            $('#statusR').css("background-color", hex);
            break;

        case 3:
            tools = {};
            toolColorFill = hex;
            $('#color').html(hex);
            initTools();
            $('#statusL').css("background-color", hex);
            break;
        }
    });
    $('#size').on('click', function () {

        tools = {};
        toolSize = $('#size').val();
        initTools();
    });
    initTools(fillVal);
});