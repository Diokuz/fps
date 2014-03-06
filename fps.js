(function() {
    var raf = window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(){};

    var last,
        distrib = [],
        status,
        after;

    function max(arr) {
        var max = 0;

        for (var i = 0 ; i < arr.length ; i++) {
            if (max < arr[i] || 0) max = arr[i];
        }

        return max;
    }

    function reflow() {
        var str = '',
            M = max(distrib);

        for (var i = 0 ; i < distrib.length ; i++) {
            var size = 2,
                left = 4 * i,
                height = (distrib[i] || 0) / M * 100;

            str += '<div style="position: absolute; width: ' + size + 'px; left: ' + left + 'px; height: ' + size + 'px; bottom: ' + height + '%; background: red;"></div>';
        }

        $('#fps').append(str);
    }

    function tick(time) { // ms
        var delta;

        if (last) {
            delta = time - last;
        }

        if (delta > 0) {
            var fps = Math.round(1000 / delta);

            distrib[fps] = (distrib[fps] || 0) + delta;
        }

        last = time;

        if (status == 'ended') {
            $('body').append('<div id="fps" style="position: fixed; top: 0; right: 0; width: 400px; height: 100px; z-index: 10; background: rgba(255, 255, 255, .7); box-shadow: 0 0 5px rgba(0, 0, 0, .5);">' + 
                '<textarea class="distrib" style="position: absolute; opacity: .4; width: 50px; background: green; height: 300px; top: 100px; right: 0; font-size: 8px;"></textarea></div>');

            // console.log('distrib', distrib);
            var length = (distrib.length > 100) ? 100 : distrib.length;
            console.log('length', length);
            for (var i = 0 ; i < length ; i++) {
                var val = Math.round(typeof distrib[i] != 'undefined' ? distrib[i] : 0);

                $('#fps .distrib').append(i + "\t" + val + "\n");
            }
            reflow();

            after && after();
        } else {
            raf(tick);
        }
    };

    window.fps = function(params) {
        var delay = 0 || params.delay,
            repeat = params.repeat || 1,
            delta = 0 || params.delta,
            after = params.after;

        // One iteration
        function iteration() {
            // Async or sync iteration callback
            function callback() {
                repeat--;
                
                if (repeat <= 0) {
                    status = 'ended';
                } else {
                    setTimeout(iteration, delta);
                }
            }

            if (params.iteration.length > 0) {
                params.iteration(callback);
            } else {
                params.iteration();
                callback();
            }
        }

        setTimeout(function() {
            params.before && params.before();
            status = 'inProgress';
            iteration();
            tick(); // will invoke itself while status != 'ended'
        }, delay);
    };
})();