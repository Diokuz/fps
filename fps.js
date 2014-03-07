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
        after,
        num = 0; // The call number in series

    function max(arr) {
        var max = 0;

        for (var i = 0 ; i < arr.length ; i++) {
            if (max < arr[i] || 0) max = arr[i];
        }

        return max;
    }

    // Only last distribution for now
    function reflow() {
        var str = '',
            M = max(distrib[num]);

        $('body').append('<div id="fps" style="position: fixed; top: 0; right: 0; width: 400px; height: 100px; z-index: 10; background: rgba(255, 255, 255, .7); box-shadow: 0 0 5px rgba(0, 0, 0, .5);">' + 
            '<textarea class="distrib" style="position: absolute; opacity: .4; width: 150px; background: green; height: 300px; top: 100px; right: 0; font-size: 8px;"></textarea></div>');

        for (var i = 0 ; i < distrib[num].length ; i++) {
            var size = 2,
                left = 4 * i,
                height = (distrib[num][i] || 0) / M * 100;

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

            distrib[num] = distrib[num] || [];
            distrib[num][fps] = (distrib[num][fps] || 0) + delta;
        }

        last = time;

        if (status == 'ended') {
            after && after();
            num++;
        } else {
            raf(tick);
        }
    };

    var fps = function(params) {
        var delay = 0 || params.delay,
            repeat = params.repeat || 1,
            delta = 0 || params.delta;

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
            function callback() {
                status = 'inProgress';
                iteration();
                tick(); // will invoke itself while status != 'ended'
            };

            params.before && params.before();
            if (params.before && params.before.length > 0) {
                params.before(callback);
            } else {
                if (params.before) {
                    params.before();
                }

                callback();
            }
        }, delay);
    };

    fps.result = function() {
        var str = '';

        reflow();

        for (var i = 0 ; i < 100 ; i++) {
            str += i;

            for (var k = 0 ; k <= num ; k++) {
                str += "\t" + Math.round(typeof distrib[k][i] != 'undefined' ? distrib[k][i] : 0);
            }

            str += "\n";
        }

        $('#fps .distrib').val(str);
    };

    window.fps = fps;
})();