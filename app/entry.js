import m from 'mithril';

import { createStore, combineReducers, applyMiddleware } from "redux";
const ACTION_MUTATE = "ACTION_MUTATE";

let n = 100,
    N = n * n,
    u = 5;

let rndColor = () => Math.random() > 0.5 ? '#fff' : '#000',
    periodic = i => {
        switch(i) {
        case -1: return (n - 1);
        case (n - 1): return 0;
        default: return i;
        }
    },
    isBlack = (color) => color === '#000';

function logfn(fn) {
    return function(i) {
        let r = fn(i);
        //console.log(`${i} -> ${r}`);
        return r;
    };
}

periodic = logfn(periodic);

function neighboursOf(i, j) {
    let neig = [];
    for(let ii = -1; ii < 2; ii++) {
        for(let jj = -1; jj < 2; jj++) {
            if (!((ii === 0) && (jj === 0))) {
                let ni = periodic(i + ii),
                    nj = periodic(j + jj);
                neig.push(ni * n + nj);
            }
        }
    }
    return neig;
}

let neighbours = [];
for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        neighbours.push(neighboursOf(i,j)); 
    }
}

function neighbourCount(i,j, state) {
    let count = 0;
    for(let k = 0; k < n; k++) {
        count = count + (isBlack(state[neighbours[i * n + j][k]]) ? 1 : 0);
    }
    return count;
}

function createReducer(i,j) {
    let index = i * n + j,
        initialState = rndColor();
    return function reducer(state = initialState, action) {
        let aindex = action.i * n + action.j;
        switch(action.type) {
        case ACTION_MUTATE:
            let c = neighbourCount(i, j, store.getState());
            if (c > 4) { return '#fff'; }
            else if (c === 2 || c === 3) { return '#000'; }
            else { return state; }
            break;
        default:
            return state;
        }
    };
}

function mutateCell(i,j, color = '#000') {
    return { type: ACTION_MUTATE, i: i, j: j, color: color };
}

let reducers = [];
for (let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        reducers.push(createReducer(i,j));
    }
}
const logger = store => next => action => {
    console.group(action.type);
    if (action.type === ACTION_MUTATE) {
        console.log(`mutating: (${action.i}, ${action.j} ${action.color})`);
        console.log('[S]', store.getState());
    }
    let result = next(action);
    console.groupEnd(action.type);
    return result;
};

const wrapComputation = store => next => action => {
    m.startComputation();
    let result = next(action);
    m.endComputation();
    return result;
};

let reducer = combineReducers(reducers);
console.info('#reducers: ' + reducers.length);
let createStoreWithMiddleware = applyMiddleware(wrapComputation /*, logger*/)(createStore);
let store = createStoreWithMiddleware(reducer);

let rnd = () => Math.floor(Math.random() * n);

window.api = {};
window.api.mutate = (i, j, color) => store.dispatch(mutateCell(i, j, color));
window.api.started = false;

function loop(i, j, color) {
    store.dispatch(mutateCell(i, j, color));
    if (window.api.started) {
        setTimeout(function() {
            loop(rnd(), rnd(), color);
        }, 0);
    }
}

window.api.loop = function() {
    window.api.started = true;
    loop(rnd(), rnd(), '#f00');
};
window.api.stop = function() { window.api.started = false; };

let cell = {
    controller: function(indexes) {
        let { i, j } = indexes;
        let top = i * u,
            left = j * u;
            //color = state[i][j];
        function style() {
            let color = store.getState()[i * n + j];
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

api.loop();
