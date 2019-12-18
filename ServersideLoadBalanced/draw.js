var socket = io();
var canvas = document.getElementsByClassName("canvas");
var rect = document.getElementById('canvas').getBoundingClientRect();
var clearButton = document.getElementsByClassName("clearButton");
var buttonRed = document.getElementsByClassName("buttonRed");
var buttonGreen = document.getElementsByClassName("buttonGreen");
var buttonBlack = document.getElementsByClassName("buttonBlack");
var buttonBlue = document.getElementsByClassName("buttonBlue");
var context = canvas[0].getContext("2d");
var drawing = false;
var clear = false;
var color = "black";

canvas.width = 700;
canvas.height = 500;

canvas[0].addEventListener("mousedown", onMouseDown, false);
canvas[0].addEventListener("mouseup", onMouseUp, false);
canvas[0].addEventListener("mousemove", onMouseMove, false);
clearButton[0].addEventListener("click", onButtonClick);
buttonRed[0].addEventListener("click", colorRed);
buttonBlack[0].addEventListener("click", colorBlack);
buttonBlue[0].addEventListener("click", colorBlue);
buttonGreen[0].addEventListener("click", colorGreen);
window.addEventListener("resize", handleResize);
// clearButton[0].addEventListener("click", clearCanvas, false);
// clearButton[0].addEventListener("click", clear);

socket.on("drawing", onDrawingEvent);
socket.on("clear", onClearEvent)

var current = { x: 0, y: 0 };

function getXandY(event) {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

}

function colorRed() {
    color = "red";
}

function colorBlack() {
    color = "black";
}

function colorBlue() {
    color = "#57a9d9";
}

function colorGreen() {
    color = "green";
}


function drawLine(x0, y0, x1, y1, color, emit) {
context.beginPath();
context.moveTo(x0, y0);
context.lineTo(x1, y1);
context.lineWidth = 3;
context.strokeStyle = color;
context.stroke();
context.closePath();

if (!emit) {
    return;
}

socket.emit("drawing", {
    x0: x0 / canvas.width,
    y0: y0 / canvas.height,
    x1: x1 / canvas.width,
    y1: y1 / canvas.height,
    color: color
});
}

function clearCanvas(emit) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!emit) {
        return;
    }
    socket.emit("clear");
}

function onDrawingEvent(data) {
    drawLine(
        data.x0 * canvas.width,
        data.y0 * canvas.height,
        data.x1 * canvas.width,
        data.y1 * canvas.height,
        data.color
    );
}

function onClearEvent(e) {
    clearCanvas();
}

function onButtonClick(e) {

    clearCanvas(true);
}

function onMouseDown(e) {
drawing = true;

data = getXandY(e)
current.x = data.x;
current.y = data.y;
}

function onMouseUp(e) {
if (!drawing) {
    return;
}
drawing = false;

data = getXandY(e)
drawLine(current.x, current.y, data.x, data.y, color, true);
current.x = data.x;
current.y = data.y;
}

function onMouseMove(e) {
if (!drawing) {
    return;
}
data = getXandY(e)

drawLine(current.x, current.y, data.x, data.y, color, true);
current.x = data.x;
current.y = data.y;
}

function handleResize() {
    canvas.width = rect.width - 10;
    canvas.height = rect.height - 10;
}
