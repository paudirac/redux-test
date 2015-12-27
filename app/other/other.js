var m = require('mithril');
import {row,panel, panelHeader, panelBody} from "../common-bootstrap/common.js";
let other = {};

var Timer = function() {
    function timefn() {
        var d = new Date();
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }
    this.time = m.prop(timefn());
    var self = this;
    var tick = function() {
        //console.info(`a: ${self.time()}`);
        self.time(timefn());
        //console.info(`b: ${self.time()}`);
        console.info('tick');
        m.redraw();
        setTimeout(tick, 1000);
    };
    setTimeout(tick, 4000);
};

other.controller = function() {
    let timer = new Timer();
    return {
        time: timer.time
    };
};

other.view = function(ctrl) {
    return [
        row(
            panel(
                { class: 'panel-info text-center' },
                panelHeader('Hora'),
                panelBody(ctrl.time())
            )
        )
    ];
};

module.exports = other;
