import m from 'mithril';

import { createStore, combineReducers, applyMiddleware } from "redux";
const ACTION_MUTATE = "ACTION_MUTATE";

let n = 100,
    N = n * n,
    u = 5;

let rndColor = () => Math.random() > 0.9 ? 1 : 0,
    periodic = i => {
        switch(i) {
        case -1: return (n - 1);
        //case (n - 1): return 0;
        case n: return 0;
        default: return i;
        }
    };

function randomState() {
    let s = [];
    for(let i = 0, len = n * n; i < len; i++) {
        s[i] = rndColor();
    }
    return s;
}

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

console.log('neig', neighbours);

function neighbourCount(index, state) {
    let count = neighbours[index]
        .map(i => state[i]).reduce((i, a) => i + a, 0);
 //   console.log(`count(${index}) = ${count}`);
    return count;
}

function conway([current, counts]) {
    switch(current) {
    case 1:
        if (counts <= 1) return 0;
        else if (counts === 2 || counts === 3) return 1;
        else if (counts >= 4) return 0;
    case 0:
        if (counts === 3) return 1;
        else return 0;
    }
}

const initialState = randomState();
console.log(initialState);

function reducer(state = initialState, action) {
    switch(action.type) {
    case ACTION_MUTATE:
        let counts = state.map((s, i) => [s, neighbourCount(i, state)]);
        let newState = counts.map(conway);
        //let newState = state.map(s => s == 1 ? 0 : 1);
        return newState;
    default:
        return state;
    }
}

function mutate() {
    return { type: ACTION_MUTATE };
}

const logger = store => next => action => {
    console.group(action.type);
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

let createStoreWithMiddleware = applyMiddleware(wrapComputation /*, logger*/)(createStore);
let store = createStoreWithMiddleware(reducer);

console.log('store created');


let colors = {
    1: '#000',
    0: '#fff'
};

let cell = {
    controller: function(indexes) {
        let { i, j } = indexes;
        function style() {
            let top = i * u,
                left = j * u,
                state = store.getState()[i * n + j],
                color = colors[state];
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

//loop();

function loop() {
    store.dispatch(mutate());
    setTimeout(loop, 1000);
}
loop();

//store.dispatch(mutate());
