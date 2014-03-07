fps - util for measurement fps distribution on testcases.

## Demo

http://diokuz.github.com/fps/

## Features

- Uses requestAnimationFrame
- Can measure fps distribution (not just fps) on user-defined testcases

## Usage

To start using fps.js:

* Include either the development or minified version of fps.js:

```html
<script src="fps.js"></script>
```

fps will init itself after small delay and will measure fps permanently.

## Advanced usage

* Call fps with arguments

```js
fps({
    // Function that will be called right before first iteration
    before: function() {},

    // One measurement iteration
    // callback is optional (for complex async cases)
    iteration: function(callback) {
        $('.somediv').addClass('someclass');
        // Wait for forward CSS transition
        setTimeout(function() {
            // Wait for backward CSS transition
            $('.somediv').removeClass('someclass');
            callback();
        }, 500);
    },

    // The number of iterations (default 10)
    repeat: 100,

    // Time in ms from end of previous iteration till begin of next iteration (default 0)
    delta: 100,

    // Time in ms from fps init till first iteration (default 0)
    delay: 5000,

    // Function that will be called right after last iteration
    after: function() {},
});
```

If fps was called by user, permanent measurement will be prevented.

## Browsers support

Chrome 30+, Firefox 20+, Safari 5+, Opera 15+ on Windows, OS X and iOS.

## License

MIT.