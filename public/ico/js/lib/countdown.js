/*
 * Countdown Timer.
 * 
 * Usage:
 * <p id="countdown"></p>
 * 
 */

(function(global) {
    'use strict';
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    var x = setInterval(function() {
        if (document.getElementById("icostart")) {
            // Set the date we're counting down to
            var countDownDate = new Date(document.getElementById("icostart").innerHTML || new Date()).getTime();
            var countUpDate = new Date(document.getElementById("icostop").innerHTML || new Date()).getTime();

            var now = new Date().getTime();
            var distance = Math.abs(countDownDate - now);

            var days = pad(Math.floor(distance / (1000 * 60 * 60 * 24)), 2);
            var hours = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 2);
            var minutes = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 2);
            var seconds = pad(Math.floor((distance % (1000 * 60)) / 1000), 2);

            // Display the result in the element with id="countdown"
            if (document.getElementById("countdown")) {
                // If the count down and up is finished, write some text 
                if ((countUpDate - now) < 0) {
                    clearInterval(x);
                    document.getElementById("countdown").innerHTML = '<div class="countdown"></div>';
                } else {
                    document.getElementById("countdown").innerHTML = '<div class="divTable"><div class="divTableBody"><div class="divTableRow">\
                    <div class="divTableCell countdown">' + days + '<span class="labels"><br />DAYS</span></div>\
                    <div class="divTableCell countdown">' + hours + '<span class="labels"><br />HOURS</span></div>\
                    <div class="divTableCell countdown">' + minutes + '<span class="labels"><br />MINS</span></div>\
                    <div class="divTableCell countdown">' + seconds + '<span class="labels"><br />SECS</span></div>\
                    </div></div></div>';
                }
            } else {
                if (document.getElementById("countdown-sm")) {
                    // If the count down and up is finished, write some text 
                    if ((countUpDate - now) < 0) {
                        clearInterval(x);
                        document.getElementById("countdown-sm").innerHTML = '<div class="countdown-sm"></div>';
                    } else {
                        document.getElementById("countdown-sm").innerHTML = '<div class="divTable"><div class="divTableBody"><div class="divTableRow">\
                        <div class="divTableCell countdown-sm">' + days + '<span class="labels-sm"><br />DAYS</span></div>\
                        <div class="divTableCell countdown-sm">' + hours + '<span class="labels-sm"><br />HOURS</span></div>\
                        <div class="divTableCell countdown-sm">' + minutes + '<span class="labels-sm"><br />MINS</span></div>\
                        <div class="divTableCell countdown-sm">' + seconds + '<span class="labels-sm"><br />SECS</span></div>\
                        </div></div></div>';
                    }
                }
            }
        }
    }, 1000);
})(this);
