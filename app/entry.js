import m from 'mithril';

import { createStore, combineReducers } from "redux";

let n = 100,
    N = n * n,
    u = 5,
    state = [];

let value = () => Math.random() > 0.5 ? '#fff' : '#000';

for (let i = 0; i < n; i++) {
    let rs = [];
    for (let j = 0; j < n; j++) {
        rs.push(value());
    }
    state.push(rs);
}

// function createReducer(i,j) {
//     return function reducer(state = [], action) {
//         if (action.i === i && action.j === j) {
//             let newState = Object.assign({}, state, )
//             return ();
//         }
//         return state;
//     };
// }

// for(let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
        
//     }
// }

let cell = {
    controller: function(indexes) {
        let { i, j } = indexes;
        let top = i * u,
            left = j * u;
            //color = state[i][j];
        function style() {
            let color = value();
            return `display: inline-block; background-color: ${color}; width: ${u}px; height: ${u}px; top:${top}px; left:${left}px; position: absolute`;
        }
        return {
            style: style
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
function loop() {
    m.redraw();
    setTimeout(loop, 1000);
}
//loop();
