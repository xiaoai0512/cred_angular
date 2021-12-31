/*
Design:liangguichang
Date:2017-07-05
Use to:public page;
*/

$(function () {
    var box = $('.serverpeople .servercontent');
    $('.serverpeople').hover(function () {
        box.stop().show(300);
    }, function () {
        box.stop().hide(150);
    })
});

$(function () {
    var box = document.getElementById('people');
    box.onmousedown = function (event) {
        var e = event || window.event,
        t = e.target || e.srcElement,
        x1 = e.clientX,
        y1 = e.clientY,
        dragLeft = this.offsetLeft,
        dragTop = this.offsetTop;
        document.onmousemove = function (event) {
            var e = event || window.event,
            t = e.target || e.srcElement,
            x2 = e.clientX,
            y2 = e.clientY,
            x = x2 - x1,
            y = y2 - y1;
            box.style.left = (dragLeft + x) + 'px';
            box.style.top = (dragTop + y) + 'px';
        };
        document.onmouseup = function () {
            this.onmousemove = null;
        }
    }
});