# ![Yaw](https://rawgit.com/CHEPROXIMITY/Yaw/master/yaw-logo.svg)

Yaw turns a figure into a horizontally pannable scene using canvas and an image sequence.

Try the [demo](https://rawgit.com/CHEPROXIMITY/Yaw/master/demo/demo.html).

## Browser support

Evergreen browsers and IE9.

Be sure to include [a polyfill](https://gist.github.com/paulirish/1579671) for [`Window.requestAnimationFrame()`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame).

## Usage

1. Add [*yaw.js*](https://github.com/CHEPROXIMITY/Yaw/blob/master/yaw.js) and [required polyfills](https://github.com/CHEPROXIMITY/Yaw#browser-support).
2. Add core styles from [*yaw.css*](https://github.com/CHEPROXIMITY/Yaw/blob/master/yaw.css).
3. Add customization styles. See [*demo.scss*](https://github.com/CHEPROXIMITY/Yaw/blob/master/demo/demo.scss) for inspiration.
4. Add your optimized image sequence to a folder, with the files named as a plain number sequence.
5. Add Yaw markup as per [*demo.html*](https://github.com/CHEPROXIMITY/Yaw/blob/master/demo/demo.html) (perhaps minus the custom progress bar). Set the `data-path`, `data-format`, `data-frames` and `data-frame` attributes according to the sequence. Be sure the image source matches the initial frame number set in `data-frame`.
6. Follow the example JS in [*demo.js*](https://github.com/CHEPROXIMITY/Yaw/blob/master/demo/demo.js) for how to initialize Yaw.

### Constructor

```js
var yaw = new Yaw(element, options);
```

Parameter | Type | Description
--- | --- | ---
`element` | `HTMLElement` | An element containing Yaw components.
`options` | `Object` | An options object.
`options.onLoadProgress` | `function` | A callback to run when a frame is loaded. Passed the percent loaded as a decimal.

### Load & enable

`yaw.preload()` preloads all frames, updates the loading state and enables interactions. Although this happens when the load button is clicked you can call it manually.

### Set frame

`yaw.setFrame(frame)` renders a frame, accepting an integer matching a position in the image sequence.
