require('../Content/bootstrap.min.css');
require('../Content/bootstrap-theme.min.css');
require('../Content/bootstrap.js');

let m = require('mithril'),
    pre = obj => m('pre', JSON.stringify(obj, null, 2)),
    globstate = {
        name: 'Pau',
        counter: 0
    };


console.log('importing redux');
import { createStore } from "redux";

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

console.log('creating store app');
// api: { subscribe, dispatch, getState }
let store = createStore(counter);
store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
store.dispatch({ type: 'INCREMENT' });

let increment = function() { store.dispatch({ type: 'INCREMENT' }); },
    decrement = function() { store.dispatch({ type: 'DECREMENT' }); };


let component = {
    controller: function() {
        return {
            counter: function() { return store.getState(); }
        };
    },
    view: function(ctrl) {
        console.log('component rendered');
        //let state = store.getState();
        return [
            m('h3', 'Hello world!'),
            pre(ctrl.counter()),
            m('button.btn.btn-default', { onclick: increment }, '+1'),
            m('button.btn.btn-default', { onclick: decrement }, '-1')
        ];
    }
};
m.mount(document.getElementById('theBody'), component);
