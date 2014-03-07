function first() {
    var dfd = $.Deferred();

    fps({
        iteration: function(cb) {
            $('.fps__test').addClass('_mod');

            setTimeout(function() {
                $('.fps__test').removeClass('_mod');
                setTimeout(cb, 300);
            }, 300);
        },
        repeat: 5,
        after: dfd.resolve
    });

    return dfd.promise();
}

function second() {
    var dfd = $.Deferred();

    fps({
        iteration: function(cb) {
            $('.fps__test').addClass('_mod');

            setTimeout(function() {
                $('.fps__test').removeClass('_mod');
                setTimeout(cb, 100);
            }, 100);
        },
        repeat: 20,
        after: dfd.resolve
    });

    return dfd.promise();
}

function result() {
    fps.result();
}

$.when().then(first).then(second).then(result);