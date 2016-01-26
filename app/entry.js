import m from 'mithril';

import { createStore, combineReducers } from "redux";

console.log('defining reducer');
function counter(state = 0, action) {
    switch(action.type) {
    case 'INCREMENT':
        return state + 1;
    case 'DECREMENT':
        return state - 1;
    default:
        return state;
    }
}

let increment = function() { store.dispatch({ type: 'INCREMENT' }); },
    decrement = function() { store.dispatch({ type: 'DECREMENT' }); };

function pathState(path) {
    return function() {
        return p.path(path)(store.getState());
    };
}

let n = 100,
    N = n * n,
    u = 5;

let cell = {
    controller: function(indexes) {
        let color = Math.random() > 0.5 ? '#fff' : '#000';
        let { i, j } = indexes;
        let top = i * u,
            left = j * u;
        return {
            i: i,
            j: j,
            style: () => `display: inline-block; background-color: ${color}; width: ${u}px; height: ${u}px; top:${top}px; left:${left}px; position: absolute`
        };
    },
    view: function(ctrl) {
        return m('div', {
            style: ctrl.style()
        });
    }
};

let matrix = [];
for (let i = 0; i < n; i++) {
    let r = [];
    for (let j = 0; j < n; j++) {
        r.push(m.component(cell, { i: i, j: j }));
    }
    //matrix.push(m('div.row', r));
    matrix.push(r);
}

let matrix_component = {
    controller: function() {
        let width = n * u,
            height = n * u;
        return {
            style: () => `background-color: #cdcdcd; width: ${width}px; height: ${height}px; border-width: 1px; border-style: solid; position: absolute`
        };
    },
    view: function(ctrl) {
        let row = matrix[0], row2 = matrix[1];
        return m('div', {
            style: ctrl.style()
        }, matrix); //[row, row2]);
    }
};

m.mount(document.getElementById('theBody'), matrix_component);
