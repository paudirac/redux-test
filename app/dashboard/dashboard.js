let m = require('mithril');
//import * as m from mithril;
import {row} from "../common-bootstrap/common.js";

let dash = {},
    headers = [
        { name: 'Name' },
        { name: 'Description' },
        { name: '' }
    ];

dash.EditableList = function(list) {
    this.list = list;
};

dash.controller = function() {
    let list = new dash.EditableList([]);
    return {
        list: list.list,
        add: function(item) {
            list.list.push(item);
        },
        remove: function(item) {
            var i = list.list.indexOf(item);
            if (i > -1) { list.list.splice(i, 1); }
        }
    };
};

dash.view = function(ctrl) {
    function addItem() {
        ctrl.add({ name: 'new name', desc: 'new desc' });
    }
    function removeItem(item) {
        ctrl.remove(item);
    }
    return [
        m('button.btn.btn-primary.pull-right', { onclick: addItem }, 'Add'),
        m('table.table.table-stripped.table-condensed',
          [
              m('thead',
                m('tr',
                  headers.map(h => m('th', h.name)))),
              m('tbody',
                ctrl.list.map(item => m('tr', m('td', item.name), m('td', item.desc), m('td', m('a', { href: '#', onclick: function() { removeItem(item); } }, 'Remove')))))])
    ]; 
};

module.exports = dash;
