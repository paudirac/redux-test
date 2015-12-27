let m = require('mithril'),
    common = {};

// Creates a bootstrap div row
common.row = function(...args) { return m('div.row', ...args); };

// Creates a panel
common.panel = function(...args) { return m('div.panel.panel-default', ...args); };
common.panelHeader = function(...args) { return m('div.panel-heading', ...args); };
common.panelBody = function(...args) { return m('div.panel-body', ...args); };

module.exports = common;
