# pointer.js

Normalizes mouse/touch events into 'pointer' events.

## Types of Events

The following events are generated:

* `pointerdown`: based on mousedown/touchstart
* `pointerup`: based on mouseup/touchend
* `pointermove`: based on mousemove/touchmove
* `pointerlave`: based on mouseout/touchleave
* `pointerclick`: a 'fast click' event based on a sequence of the above events. Additional heuristics are applied to determine whether or not to generate a `pointerclick`.

## Event Objects

`pointer` events have the following custom properties:

* `maskedEvent`: the event that triggered the pointer event.
* `touch`: boolean- is maskedEvent a touch event?
* `mouse`: boolean- is maskedEvent a mouse event?
* `x`: page-normalized x coordinate of the event.
* `y`: page-normalized y coordinate of the event.