var m = require('mithril');
var app = {};

app.PageList = function() {
    //return m.request({method: "GET", url: "pages.json"});
    let pages = [
        { href: 'http://www.google.com', title: 'Google' },
        { href: 'http://www.greenpowermonitor.com', title: 'GPM' }
    ];
    return () => pages;
};

app.controller = function() {
    var pages = app.PageList();
    return {
        pages: pages,
        rotate: function() {
            pages().push(pages().shift());
        },
        add: function() {
            pages().push({ href: 'kk', title: 'nova' });
        }
    };
};

app.view = function(ctrl) {
    return [
        m('div', {class: 'list-group'}, [
            ctrl.pages().map(function(page) {
                return m("a", { href: page.href, class: 'list-group-item' }, page.title);
            })
        ]),
        m("button", {onclick: ctrl.rotate, class: 'btn btn-main'}, "Rotate links"),
        m("button", {onclick: ctrl.add, class: 'btn btn-default'}, "Add")
    ];
};

module.exports = app;
