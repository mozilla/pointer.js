
// pointer.js, version 1.0

// Synthesize 'pointer' events using mouse/touch events.

// (c) 2013 Copyright (c) 2013, Mozilla Corporation
// project located at https://github.com/mozilla/pointer.js.
// Licenced under the BSD license (see LICENSE file)

// Pointer events have the following custom properties:
// * maskedEvent: the event that triggered the pointer event.
// * touch: boolean- is maskedEvent a touch event?
// * mouse: boolean- is maskedEvent a mouse event?
// * x: page-normalized x coordinate of the event.
// * y: page-normalized y coordinate of the event.

(function() {
    var body = document.body;

    var isScrolling = false;
    var timeout = false;
    var sDistX = 0;
    var sDistY = 0;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            sDistX = window.pageXOffset;
            sDistY = window.pageYOffset;
        }
        isScrolling = true;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            isScrolling = false;
            sDistX = 0;
            sDistY = 0;
        }, 100);
    });

    body.addEventListener('mousedown', pointerDown);
    body.addEventListener('touchstart', pointerDown);
    body.addEventListener('mouseup', pointerUp);
    body.addEventListener('touchend', pointerUp);
    body.addEventListener('mousemove', pointerMove);
    body.addEventListener('touchmove', pointerMove);
    body.addEventListener('mouseout', pointerLeave);
    body.addEventListener('touchleave', pointerLeave);

    // 'pointerdown' event, triggered by mousedown/touchstart.
    function pointerDown(e) {
        var evt = makePointerEvent('down', e);
        // don't maybeClick if more than one touch is active.
        var singleFinger = evt.mouse || (evt.touch && e.touches.length === 1);
        if (!isScrolling && singleFinger) {
            e.target.maybeClick = true;
            e.target.maybeClickX = evt.x;
            e.target.maybeClickY = evt.y;
        }
    }

    // 'pointerdown' event, triggered by mouseout/touchleave.
    function pointerLeave(e) {
        e.target.maybeClick = false;
        makePointerEvent('leave', e);
    }

    // 'pointermove' event, triggered by mousemove/touchmove.
    function pointerMove(e) {
        var evt = makePointerEvent('move', e);
    }

    // 'pointerup' event, triggered by mouseup/touchend.
    function pointerUp(e) {
        var evt = makePointerEvent('up', e);
        // Does our target have maybeClick set by pointerdown?
        if (e.target.maybeClick) {
            // Have we moved too much?
            if (Math.abs(e.target.maybeClickX - evt.x) < 5 &&
                Math.abs(e.target.maybeClickY - evt.y) < 5) {
                // Have we scrolled too much?
                if (!isScrolling ||
                    (Math.abs(sDistX - window.pageXOffset) < 5 &&
                     Math.abs(sDistY - window.pageYOffset) < 5)) {
                    makePointerEvent('click', e);
                }
            }
        }
        e.target.maybeClick = false;
    }

    function makePointerEvent(type, e) {
        var tgt = e.target;
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent('pointer' + type, true, true, {});
        evt.touch = e.type.indexOf('touch') === 0;
        evt.mouse = e.type.indexOf('mouse') === 0;
        if (evt.touch) {
            evt.x = e.changedTouches[0].pageX;
            evt.y = e.changedTouches[0].pageY;
        }
        if (evt.mouse) {
            evt.x = e.clientX + window.pageXOffset;
            evt.y = e.clientY + window.pageYOffset;
        }
        evt.maskedEvent = e;
        tgt.dispatchEvent(evt);
        return evt;
    }

})();
