(function() {
    var raf = window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(){};

    var last,
        distrib = [],
        status;

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
                '<textarea class="distrib" style="position: absolute; opacity: .4; width: 20px; background: green; height: 300px; top: 100px; right: 0; font-size: 8px;"></textarea></div>');

            // console.log('distrib', distrib);
            for (var i = 0 ; i < distrib.length ; i++) {
                var val = Math.round(typeof distrib[i] != 'undefined' ? distrib[i] : 0);

                $('#fps .distrib').append(i + "\t" + val + "\n");
            }
            reflow();
        } else {
            raf(tick);
        }
    };

    window.fps = function(params) {
        var delay = 0 || params.delay,
            repeat = params.repeat || 1,
            delta = 0 || params.delta,
            interval;

        function trigger() {
            function step() {
                params.step();
                repeat--;
                if (repeat <= 0) {
                    clearInterval(interval);
                    status = 'ended';
                }
            }

            interval = setInterval(step, delta);
        }

        setTimeout(function() {
            status = 'inProgress';
            trigger();
            tick(); // will invoke self while status != 'ended'
        }, delay);
    };
})();

fps({
    delay: 1000,
    step: function() {
        $('.dashboard__cityNameLink').trigger('click');
    },
    repeat: 50,
    delta: 600
});