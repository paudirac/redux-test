/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _mithril = __webpack_require__(1);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _redux = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ACTION_MUTATE = "ACTION_MUTATE";

	var n = 100,
	    N = n * n,
	    u = 5;

	var rndColor = function rndColor() {
	    return Math.random() > 0.5 ? '#fff' : '#000';
	},
	    periodic = function periodic(i) {
	    switch (i) {
	        case -1:
	            return n - 1;
	        case n - 1:
	            return 0;
	        default:
	            return i;
	    }
	},
	    isBlack = function isBlack(color) {
	    return color === '#000';
	};

	function logfn(fn) {
	    return function (i) {
	        var r = fn(i);
	        //console.log(`${i} -> ${r}`);
	        return r;
	    };
	}

	periodic = logfn(periodic);

	function neighboursOf(i, j) {
	    var neig = [];
	    for (var ii = -1; ii < 2; ii++) {
	        for (var jj = -1; jj < 2; jj++) {
	            if (!(ii === 0 && jj === 0)) {
	                var ni = periodic(i + ii),
	                    nj = periodic(j + jj);
	                neig.push(ni * n + nj);
	            }
	        }
	    }
	    return neig;
	}

	var neighbours = [];
	for (var i = 0; i < n; i++) {
	    for (var j = 0; j < n; j++) {
	        neighbours.push(neighboursOf(i, j));
	    }
	}

	function neighbourCount(i, j, state) {
	    var count = 0;
	    for (var k = 0; k < n; k++) {
	        count = count + (isBlack(state[neighbours[i * n + j][k]]) ? 1 : 0);
	    }
	    return count;
	}

	function createReducer(i, j) {
	    var index = i * n + j,
	        initialState = rndColor();
	    return function reducer() {
	        var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	        var action = arguments[1];

	        var aindex = action.i * n + action.j;
	        switch (action.type) {
	            case ACTION_MUTATE:
	                var c = neighbourCount(i, j, store.getState());
	                if (c > 4) {
	                    return '#fff';
	                } else if (c === 2 || c === 3) {
	                    return '#000';
	                } else {
	                    return state;
	                }
	                break;
	            default:
	                return state;
	        }
	    };
	}

	function mutateCell(i, j) {
	    var color = arguments.length <= 2 || arguments[2] === undefined ? '#000' : arguments[2];

	    return { type: ACTION_MUTATE, i: i, j: j, color: color };
	}

	var reducers = [];
	for (var i = 0; i < n; i++) {
	    for (var j = 0; j < n; j++) {
	        reducers.push(createReducer(i, j));
	    }
	}
	var logger = function logger(store) {
	    return function (next) {
	        return function (action) {
	            console.group(action.type);
	            if (action.type === ACTION_MUTATE) {
	                console.log("mutating: (" + action.i + ", " + action.j + " " + action.color + ")");
	                console.log('[S]', store.getState());
	            }
	            var result = next(action);
	            console.groupEnd(action.type);
	            return result;
	        };
	    };
	};

	var wrapComputation = function wrapComputation(store) {
	    return function (next) {
	        return function (action) {
	            _mithril2.default.startComputation();
	            var result = next(action);
	            _mithril2.default.endComputation();
	            return result;
	        };
	    };
	};

	var reducer = (0, _redux.combineReducers)(reducers);
	console.info('#reducers: ' + reducers.length);
	var createStoreWithMiddleware = (0, _redux.applyMiddleware)(wrapComputation /*, logger*/)(_redux.createStore);
	var store = createStoreWithMiddleware(reducer);

	var rnd = function rnd() {
	    return Math.floor(Math.random() * n);
	};

	window.api = {};
	window.api.mutate = function (i, j, color) {
	    return store.dispatch(mutateCell(i, j, color));
	};
	window.api.started = false;

	function loop(i, j, color) {
	    store.dispatch(mutateCell(i, j, color));
	    if (window.api.started) {
	        setTimeout(function () {
	            loop(rnd(), rnd(), color);
	        }, 0);
	    }
	}

	window.api.loop = function () {
	    window.api.started = true;
	    loop(rnd(), rnd(), '#f00');
	};
	window.api.stop = function () {
	    window.api.started = false;
	};

	var cell = {
	    controller: function controller(indexes) {
	        var i = indexes.i;
	        var j = indexes.j;

	        var top = i * u,
	            left = j * u;
	        //color = state[i][j];
	        function style() {
	            var color = store.getState()[i * n + j];
	            return "display: inline-block; background-color: " + color + "; width: " + u + "px; height: " + u + "px; top:" + top + "px; left:" + left + "px; position: absolute";
	        }
	        return {
	            style: style
	        };
	    },
	    view: function view(ctrl) {
	        return (0, _mithril2.default)('div', {
	            style: ctrl.style()
	        });
	    }
	};

	var matrix = [];
	for (var i = 0; i < n; i++) {
	    var r = [];
	    for (var j = 0; j < n; j++) {
	        r.push(_mithril2.default.component(cell, { i: i, j: j }));
	    }
	    matrix.push(r);
	}

	var matrix_component = {
	    controller: function controller() {
	        var width = n * u,
	            height = n * u;
	        return {
	            style: function style() {
	                return "background-color: #cdcdcd; width: " + width + "px; height: " + height + "px; border-width: 1px; border-style: solid; position: absolute";
	            }
	        };
	    },
	    view: function view(ctrl) {
	        var row = matrix[0],
	            row2 = matrix[1];
	        return (0, _mithril2.default)('div', {
	            style: ctrl.style()
	        }, matrix); //[row, row2]);
	    }
	};

	_mithril2.default.mount(document.getElementById('theBody'), matrix_component);

	api.loop();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {var m = (function app(window, undefined) {
		"use strict";
	  	var VERSION = "v0.2.2-rc.1";
		function isFunction(object) {
			return typeof object === "function";
		}
		function isObject(object) {
			return type.call(object) === "[object Object]";
		}
		function isString(object) {
			return type.call(object) === "[object String]";
		}
		var isArray = Array.isArray || function (object) {
			return type.call(object) === "[object Array]";
		};
		var type = {}.toString;
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
		var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
		var noop = function () {};

		// caching commonly used variables
		var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

		// self invoking function needed because of the way mocks work
		function initialize(window) {
			$document = window.document;
			$location = window.location;
			$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
			$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
		}

		initialize(window);

		m.version = function() {
			return VERSION;
		};

		/**
		 * @typedef {String} Tag
		 * A string that looks like -> div.classname#id[param=one][param2=two]
		 * Which describes a DOM node
		 */

		/**
		 *
		 * @param {Tag} The DOM node tag
		 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
		 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
		 *
		 */
		function m(tag, pairs) {
			for (var args = [], i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
			if (isObject(tag)) return parameterize(tag, args);
			var hasAttrs = pairs != null && isObject(pairs) && !("tag" in pairs || "view" in pairs || "subtree" in pairs);
			var attrs = hasAttrs ? pairs : {};
			var classAttrName = "class" in attrs ? "class" : "className";
			var cell = {tag: "div", attrs: {}};
			var match, classes = [];
			if (!isString(tag)) throw new Error("selector in m(selector, attrs, children) should be a string");
			while ((match = parser.exec(tag)) != null) {
				if (match[1] === "" && match[2]) cell.tag = match[2];
				else if (match[1] === "#") cell.attrs.id = match[2];
				else if (match[1] === ".") classes.push(match[2]);
				else if (match[3][0] === "[") {
					var pair = attrParser.exec(match[3]);
					cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true);
				}
			}

			var children = hasAttrs ? args.slice(1) : args;
			if (children.length === 1 && isArray(children[0])) {
				cell.children = children[0];
			}
			else {
				cell.children = children;
			}

			for (var attrName in attrs) {
				if (attrs.hasOwnProperty(attrName)) {
					if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
						classes.push(attrs[attrName]);
						cell.attrs[attrName] = ""; //create key in correct iteration order
					}
					else cell.attrs[attrName] = attrs[attrName];
				}
			}
			if (classes.length) cell.attrs[classAttrName] = classes.join(" ");

			return cell;
		}
		function forEach(list, f) {
			for (var i = 0; i < list.length && !f(list[i], i++);) {}
		}
		function forKeys(list, f) {
			forEach(list, function (attrs, i) {
				return (attrs = attrs && attrs.attrs) && attrs.key != null && f(attrs, i);
			});
		}
		// This function was causing deopts in Chrome.
		function dataToString(data) {
			//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
			try {
				if (data == null || data.toString() == null) return "";
			} catch (e) {
				return "";
			}
			return data;
		}
		// This function was causing deopts in Chrome.
		function injectTextNode(parentElement, first, index, data) {
			try {
				insertNode(parentElement, first, index);
				first.nodeValue = data;
			} catch (e) {} //IE erroneously throws error when appending an empty text node after a null
		}

		function flatten(list) {
			//recursively flatten array
			for (var i = 0; i < list.length; i++) {
				if (isArray(list[i])) {
					list = list.concat.apply([], list);
					//check current index again and flatten until there are no more nested arrays at that index
					i--;
				}
			}
			return list;
		}

		function insertNode(parentElement, node, index) {
			parentElement.insertBefore(node, parentElement.childNodes[index] || null);
		}

		var DELETION = 1, INSERTION = 2, MOVE = 3;

		function handleKeysDiffer(data, existing, cached, parentElement) {
			forKeys(data, function (key, i) {
				existing[key = key.key] = existing[key] ? {
					action: MOVE,
					index: i,
					from: existing[key].index,
					element: cached.nodes[existing[key].index] || $document.createElement("div")
				} : {action: INSERTION, index: i};
			});
			var actions = [];
			for (var prop in existing) actions.push(existing[prop]);
			var changes = actions.sort(sortChanges), newCached = new Array(cached.length);
			newCached.nodes = cached.nodes.slice();

			forEach(changes, function (change) {
				var index = change.index;
				if (change.action === DELETION) {
					clear(cached[index].nodes, cached[index]);
					newCached.splice(index, 1);
				}
				if (change.action === INSERTION) {
					var dummy = $document.createElement("div");
					dummy.key = data[index].attrs.key;
					insertNode(parentElement, dummy, index);
					newCached.splice(index, 0, {
						attrs: {key: data[index].attrs.key},
						nodes: [dummy]
					});
					newCached.nodes[index] = dummy;
				}

				if (change.action === MOVE) {
					var changeElement = change.element;
					var maybeChanged = parentElement.childNodes[index];
					if (maybeChanged !== changeElement && changeElement !== null) {
						parentElement.insertBefore(changeElement, maybeChanged || null);
					}
					newCached[index] = cached[change.from];
					newCached.nodes[index] = changeElement;
				}
			});

			return newCached;
		}

		function diffKeys(data, cached, existing, parentElement) {
			var keysDiffer = data.length !== cached.length;
			if (!keysDiffer) {
				forKeys(data, function (attrs, i) {
					var cachedCell = cached[i];
					return keysDiffer = cachedCell && cachedCell.attrs && cachedCell.attrs.key !== attrs.key;
				});
			}

			return keysDiffer ? handleKeysDiffer(data, existing, cached, parentElement) : cached;
		}

		function diffArray(data, cached, nodes) {
			//diff the array itself

			//update the list of DOM nodes by collecting the nodes from each item
			forEach(data, function (_, i) {
				if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes);
			})
			//remove items from the end of the array if the new array is shorter than the old one. if errors ever happen here, the issue is most likely
			//a bug in the construction of the `cached` data structure somewhere earlier in the program
			forEach(cached.nodes, function (node, i) {
				if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]]);
			})
			if (data.length < cached.length) cached.length = data.length;
			cached.nodes = nodes;
		}

		function buildArrayKeys(data) {
			var guid = 0;
			forKeys(data, function () {
				forEach(data, function (attrs) {
					if ((attrs = attrs && attrs.attrs) && attrs.key == null) attrs.key = "__mithril__" + guid++;
				})
				return 1;
			});
		}

		function maybeRecreateObject(data, cached, dataAttrKeys) {
			//if an element is different enough from the one in cache, recreate it
			if (data.tag !== cached.tag ||
					dataAttrKeys.sort().join() !== Object.keys(cached.attrs).sort().join() ||
					data.attrs.id !== cached.attrs.id ||
					data.attrs.key !== cached.attrs.key ||
					(m.redraw.strategy() === "all" && (!cached.configContext || cached.configContext.retain !== true)) ||
					(m.redraw.strategy() === "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && isFunction(cached.configContext.onunload)) cached.configContext.onunload();
				if (cached.controllers) {
					forEach(cached.controllers, function (controller) {
						if (controller.unload) controller.onunload({preventDefault: noop});
					});
				}
			}
		}

		function getObjectNamespace(data, namespace) {
			return data.attrs.xmlns ? data.attrs.xmlns :
				data.tag === "svg" ? "http://www.w3.org/2000/svg" :
				data.tag === "math" ? "http://www.w3.org/1998/Math/MathML" :
				namespace;
		}

		function unloadCachedControllers(cached, views, controllers) {
			if (controllers.length) {
				cached.views = views;
				cached.controllers = controllers;
				forEach(controllers, function (controller) {
					if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old;
					if (pendingRequests && controller.onunload) {
						var onunload = controller.onunload;
						controller.onunload = noop;
						controller.onunload.$old = onunload;
					}
				});
			}
		}

		function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
			//schedule configs to be called. They are called after `build`
			//finishes running
			if (isFunction(data.attrs.config)) {
				var context = cached.configContext = cached.configContext || {};

				//bind
				configs.push(function() {
					return data.attrs.config.call(data, node, !isNew, context, cached);
				});
			}
		}

		function buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers) {
			var node = cached.nodes[0];
			if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
			cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
			cached.nodes.intact = true;

			if (controllers.length) {
				cached.views = views;
				cached.controllers = controllers;
			}

			return node;
		}

		function handleNonexistentNodes(data, parentElement, index) {
			var nodes;
			if (data.$trusted) {
				nodes = injectHTML(parentElement, index, data);
			}
			else {
				nodes = [$document.createTextNode(data)];
				if (!parentElement.nodeName.match(voidElements)) insertNode(parentElement, nodes[0], index);
			}

			var cached = typeof data === "string" || typeof data === "number" || typeof data === "boolean" ? new data.constructor(data) : data;
			cached.nodes = nodes;
			return cached;
		}

		function reattachNodes(data, cached, parentElement, editable, index, parentTag) {
			var nodes = cached.nodes;
			if (!editable || editable !== $document.activeElement) {
				if (data.$trusted) {
					clear(nodes, cached)
					nodes = injectHTML(parentElement, index, data)
				} else if (parentTag === "textarea") {
					// <textarea> uses `value` instead of `nodeValue`.
					parentElement.value = data
				} else if (editable) {
					// contenteditable nodes use `innerHTML` instead of `nodeValue`.
					editable.innerHTML = data
				} else {
					// was a trusted string
					if (nodes[0].nodeType === 1 || nodes.length > 1 || (nodes[0].nodeValue.trim && !nodes[0].nodeValue.trim())) {
						clear(cached.nodes, cached)
						nodes = [$document.createTextNode(data)]
					}
					injectTextNode(parentElement, nodes[0], index, data);
				}
			}
			cached = new data.constructor(data);
			cached.nodes = nodes;
			return cached;
		}

		function handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) {
			//handle text nodes
			return cached.nodes.length === 0 ? handleNonexistentNodes(data, parentElement, index) :
				cached.valueOf() !== data.valueOf() || shouldReattach === true ?
					reattachNodes(data, cached, parentElement, editable, index, parentTag) :
				(cached.nodes.intact = true, cached);
		}

		function getSubArrayCount(item) {
			if (item.$trusted) {
				//fix offset of next element if item was a trusted string w/ more than one html element
				//the first clause in the regexp matches elements
				//the second clause (after the pipe) matches text nodes
				var match = item.match(/<[^\/]|\>\s*[^<]/g);
				if (match != null) return match.length;
			}
			else if (isArray(item)) {
				return item.length;
			}
			return 1;
		}

		function buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) {
			data = flatten(data);
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var existing = {}, shouldMaintainIdentities = false;
			forKeys(cached, function (attrs, i) {
				shouldMaintainIdentities = true;
				existing[cached[i].attrs.key] = {action: DELETION, index: i};
			});

			buildArrayKeys(data);
			if (shouldMaintainIdentities) cached = diffKeys(data, cached, existing, parentElement);
			//end key algorithm

			var cacheCount = 0;
			//faster explicitly written
			for (var i = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);

				if (item !== undefined) {
					intact = intact && item.nodes.intact;
					subArrayCount += getSubArrayCount(item);
					cached[cacheCount++] = item;
				}
			}

			if (!intact) diffArray(data, cached, nodes);
			return cached
		}

		function makeCache(data, cached, index, parentIndex, parentCache) {
			if (cached != null) {
				if (type.call(cached) === type.call(data)) return cached;

				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex, end = offset + (isArray(data) ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
				} else if (cached.nodes) {
					clear(cached.nodes, cached);
				}
			}

			cached = new data.constructor();
			//if constructor creates a virtual dom element, use a blank object
			//as the base cached node instead of copying the virtual el (#277)
			if (cached.tag) cached = {};
			cached.nodes = [];
			return cached;
		}

		function constructNode(data, namespace) {
			return namespace === undefined ?
				data.attrs.is ? $document.createElement(data.tag, data.attrs.is) : $document.createElement(data.tag) :
				data.attrs.is ? $document.createElementNS(namespace, data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag);
		}

		function constructAttrs(data, node, namespace, hasKeys) {
			return hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs;
		}

		function constructChildren(data, node, cached, editable, namespace, configs) {
			return data.children != null && data.children.length > 0 ?
				build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
				data.children;
		}

		function reconstructCached(data, attrs, children, node, namespace, views, controllers) {
			var cached = {tag: data.tag, attrs: attrs, children: children, nodes: [node]};
			unloadCachedControllers(cached, views, controllers);
			if (cached.children && !cached.children.nodes) cached.children.nodes = [];
			//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
			if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
			return cached
		}

		function getController(views, view, cachedControllers, controller) {
			var controllerIndex = m.redraw.strategy() === "diff" && views ? views.indexOf(view) : -1;
			return controllerIndex > -1 ? cachedControllers[controllerIndex] :
				typeof controller === "function" ? new controller() : {};
		}

		function updateLists(views, controllers, view, controller) {
			if (controller.onunload != null) unloaders.push({controller: controller, handler: controller.onunload});
			views.push(view);
			controllers.push(controller);
		}

		function checkView(data, view, cached, cachedControllers, controllers, views) {
			var controller = getController(cached.views, view, cachedControllers, data.controller);
			//Faster to coerce to number and check for NaN
			var key = +(data && data.attrs && data.attrs.key);
			data = pendingRequests === 0 || forcing || cachedControllers && cachedControllers.indexOf(controller) > -1 ? data.view(controller) : {tag: "placeholder"};
			if (data.subtree === "retain") return cached;
			if (key === key) (data.attrs = data.attrs || {}).key = key;
			updateLists(views, controllers, view, controller);
			return data;
		}

		function markViews(data, cached, views, controllers) {
			var cachedControllers = cached && cached.controllers;
			while (data.view != null) data = checkView(data, data.view.$original || data.view, cached, cachedControllers, controllers, views);
			return data;
		}

		function buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) {
			var views = [], controllers = [];
			data = markViews(data, cached, views, controllers);
			if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.");
			data.attrs = data.attrs || {};
			cached.attrs = cached.attrs || {};
			var dataAttrKeys = Object.keys(data.attrs);
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
			maybeRecreateObject(data, cached, dataAttrKeys);
			if (!isString(data.tag)) return;
			var isNew = cached.nodes.length === 0;
			namespace = getObjectNamespace(data, namespace);
			var node;
			if (isNew) {
				node = constructNode(data, namespace);
				//set attributes first, then create children
				var attrs = constructAttrs(data, node, namespace, hasKeys)
				var children = constructChildren(data, node, cached, editable, namespace, configs);
				cached = reconstructCached(data, attrs, children, node, namespace, views, controllers);
			}
			else {
				node = buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers);
			}
			if (isNew || shouldReattach === true && node != null) insertNode(parentElement, node, index);
			//schedule configs to be called. They are called after `build`
			//finishes running
			scheduleConfigsToBeCalled(configs, data, node, isNew, cached);
			return cached
		}

		function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
			//`build` is a recursive function that manages creation/diffing/removal
			//of DOM elements based on comparison between `data` and `cached`
			//the diff algorithm can be summarized as this:
			//1 - compare `data` and `cached`
			//2 - if they are different, copy `data` to `cached` and update the DOM
			//    based on what the difference is
			//3 - recursively apply this algorithm for every array and for the
			//    children of every virtual element

			//the `cached` data structure is essentially the same as the previous
			//redraw's `data` data structure, with a few additions:
			//- `cached` always has a property called `nodes`, which is a list of
			//   DOM elements that correspond to the data represented by the
			//   respective virtual element
			//- in order to support attaching `nodes` as a property of `cached`,
			//   `cached` is *always* a non-primitive object, i.e. if the data was
			//   a string, then cached is a String instance. If data was `null` or
			//   `undefined`, cached is `new String("")`
			//- `cached also has a `configContext` property, which is the state
			//   storage object exposed by config(element, isInitialized, context)
			//- when `cached` is an Object, it represents a virtual element; when
			//   it's an Array, it represents a list of elements; when it's a
			//   String, Number or Boolean, it represents a text node

			//`parentElement` is a DOM element used for W3C DOM API calls
			//`parentTag` is only used for handling a corner case for textarea
			//values
			//`parentCache` is used to remove nodes in some multi-node cases
			//`parentIndex` and `index` are used to figure out the offset of nodes.
			//They're artifacts from before arrays started being flattened and are
			//likely refactorable
			//`data` and `cached` are, respectively, the new and old nodes being
			//diffed
			//`shouldReattach` is a flag indicating whether a parent node was
			//recreated (if so, and if this node is reused, then this node must
			//reattach itself to the new parent)
			//`editable` is a flag that indicates whether an ancestor is
			//contenteditable
			//`namespace` indicates the closest HTML namespace as it cascades down
			//from an ancestor
			//`configs` is a list of config functions to run after the topmost
			//`build` call finishes running

			//there's logic that relies on the assumption that null and undefined
			//data are equivalent to empty strings
			//- this prevents lifecycle surprises from procedural helpers that mix
			//  implicit and explicit return statements (e.g.
			//  function foo() {if (cond) return m("div")}
			//- it simplifies diffing code
			data = dataToString(data);
			if (data.subtree === "retain") return cached;
			cached = makeCache(data, cached, index, parentIndex, parentCache);
			return isArray(data) ? buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) :
				data != null && isObject(data) ? buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) :
				!isFunction(data) ? handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) :
				cached;
		}
		function sortChanges(a, b) { return a.action - b.action || a.index - b.index; }
		function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
			for (var attrName in dataAttrs) {
				var dataAttr = dataAttrs[attrName];
				var cachedAttr = cachedAttrs[attrName];
				if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
					cachedAttrs[attrName] = dataAttr;
					try {
						//`config` isn't a real attributes, so ignore it
						if (attrName === "config" || attrName === "key") continue;
						//hook event handlers to the auto-redrawing system
						else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
							node[attrName] = autoredraw(dataAttr, node);
						}
						//handle `style: {...}`
						else if (attrName === "style" && dataAttr != null && isObject(dataAttr)) {
							for (var rule in dataAttr) {
								if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule];
							}
							for (var rule in cachedAttr) {
								if (!(rule in dataAttr)) node.style[rule] = "";
							}
						}
						//handle SVG
						else if (namespace != null) {
							if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
							else node.setAttribute(attrName === "className" ? "class" : attrName, dataAttr);
						}
						//handle cases that are properties (but ignore cases where we should use setAttribute instead)
						//- list and form are typically used as strings, but are DOM element references in js
						//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
						else if (attrName in node && attrName !== "list" && attrName !== "style" && attrName !== "form" && attrName !== "type" && attrName !== "width" && attrName !== "height") {
							//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
							if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr;
						}
						else node.setAttribute(attrName, dataAttr);
					}
					catch (e) {
						//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
						if (e.message.indexOf("Invalid argument") < 0) throw e;
					}
				}
				//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
				else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
					node.value = dataAttr;
				}
			}
			return cachedAttrs;
		}
		function clear(nodes, cached) {
			for (var i = nodes.length - 1; i > -1; i--) {
				if (nodes[i] && nodes[i].parentNode) {
					try { nodes[i].parentNode.removeChild(nodes[i]); }
					catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					cached = [].concat(cached);
					if (cached[i]) unload(cached[i]);
				}
			}
			//release memory if nodes is an array. This check should fail if nodes is a NodeList (see loop above)
			if (nodes.length) nodes.length = 0;
		}
		function unload(cached) {
			if (cached.configContext && isFunction(cached.configContext.onunload)) {
				cached.configContext.onunload();
				cached.configContext.onunload = null;
			}
			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (isFunction(controller.onunload)) controller.onunload({preventDefault: noop});
				});
			}
			if (cached.children) {
				if (isArray(cached.children)) forEach(cached.children, unload);
				else if (cached.children.tag) unload(cached.children);
			}
		}
		function injectHTML(parentElement, index, data) {
			var nextSibling = parentElement.childNodes[index];
			if (nextSibling) {
				var isElement = nextSibling.nodeType !== 1;
				var placeholder = $document.createElement("span");
				if (isElement) {
					parentElement.insertBefore(placeholder, nextSibling || null);
					placeholder.insertAdjacentHTML("beforebegin", data);
					parentElement.removeChild(placeholder);
				}
				else nextSibling.insertAdjacentHTML("beforebegin", data);
			}
			else {
				if (window.Range && window.Range.prototype.createContextualFragment) {
					parentElement.appendChild($document.createRange().createContextualFragment(data));
				}
				else parentElement.insertAdjacentHTML("beforeend", data);
			}
			var nodes = [];
			while (parentElement.childNodes[index] !== nextSibling) {
				nodes.push(parentElement.childNodes[index]);
				index++;
			}
			return nodes;
		}
		function autoredraw(callback, object) {
			return function(e) {
				e = e || event;
				m.redraw.strategy("diff");
				m.startComputation();
				try { return callback.call(object, e); }
				finally {
					endFirstComputation();
				}
			};
		}

		var html;
		var documentNode = {
			appendChild: function(node) {
				if (html === undefined) html = $document.createElement("html");
				if ($document.documentElement && $document.documentElement !== node) {
					$document.replaceChild(node, $document.documentElement);
				}
				else $document.appendChild(node);
				this.childNodes = $document.childNodes;
			},
			insertBefore: function(node) {
				this.appendChild(node);
			},
			childNodes: []
		};
		var nodeCache = [], cellCache = {};
		m.render = function(root, cell, forceRecreation) {
			var configs = [];
			if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
			var id = getCellCacheKey(root);
			var isDocumentRoot = root === $document;
			var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
			if (isDocumentRoot && cell.tag !== "html") cell = {tag: "html", attrs: {}, children: cell};
			if (cellCache[id] === undefined) clear(node.childNodes);
			if (forceRecreation === true) reset(root);
			cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
			forEach(configs, function (config) { config(); });
		};
		function getCellCacheKey(element) {
			var index = nodeCache.indexOf(element);
			return index < 0 ? nodeCache.push(element) - 1 : index;
		}

		m.trust = function(value) {
			value = new String(value);
			value.$trusted = true;
			return value;
		};

		function gettersetter(store) {
			var prop = function() {
				if (arguments.length) store = arguments[0];
				return store;
			};

			prop.toJSON = function() {
				return store;
			};

			return prop;
		}

		m.prop = function (store) {
			//note: using non-strict equality check here because we're checking if store is null OR undefined
			if ((store != null && isObject(store) || isFunction(store)) && isFunction(store.then)) {
				return propify(store);
			}

			return gettersetter(store);
		};

		var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, topComponent, unloaders = [];
		var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
		function parameterize(component, args) {
			var controller = function() {
				return (component.controller || noop).apply(this, args) || this;
			};
			if (component.controller) controller.prototype = component.controller.prototype;
			var view = function(ctrl) {
				var currentArgs = arguments.length > 1 ? args.concat([].slice.call(arguments, 1)) : args;
				return component.view.apply(component, currentArgs ? [ctrl].concat(currentArgs) : [ctrl]);
			};
			view.$original = component.view;
			var output = {controller: controller, view: view};
			if (args[0] && args[0].key != null) output.attrs = {key: args[0].key};
			return output;
		}
		m.component = function(component) {
			for (var args = [], i = 1; i < arguments.length; i++) args.push(arguments[i]);
			return parameterize(component, args);
		};
		m.mount = m.module = function(root, component) {
			if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
			var index = roots.indexOf(root);
			if (index < 0) index = roots.length;

			var isPrevented = false;
			var event = {preventDefault: function() {
				isPrevented = true;
				computePreRedrawHook = computePostRedrawHook = null;
			}};

			forEach(unloaders, function (unloader) {
				unloader.handler.call(unloader.controller, event);
				unloader.controller.onunload = null;
			});

			if (isPrevented) {
				forEach(unloaders, function (unloader) {
					unloader.controller.onunload = unloader.handler;
				});
			}
			else unloaders = [];

			if (controllers[index] && isFunction(controllers[index].onunload)) {
				controllers[index].onunload(event);
			}

			var isNullComponent = component === null;

			if (!isPrevented) {
				m.redraw.strategy("all");
				m.startComputation();
				roots[index] = root;
				var currentComponent = component ? (topComponent = component) : (topComponent = component = {controller: noop});
				var controller = new (component.controller || noop)();
				//controllers may call m.mount recursively (via m.route redirects, for example)
				//this conditional ensures only the last recursive m.mount call is applied
				if (currentComponent === topComponent) {
					controllers[index] = controller;
					components[index] = component;
				}
				endFirstComputation();
				if (isNullComponent) {
					removeRootElement(root, index);
				}
				return controllers[index];
			}
			if (isNullComponent) {
				removeRootElement(root, index);
			}
		};

		function removeRootElement(root, index) {
			roots.splice(index, 1);
			controllers.splice(index, 1);
			components.splice(index, 1);
			reset(root);
			nodeCache.splice(getCellCacheKey(root), 1);
		}

		var redrawing = false, forcing = false;
		m.redraw = function(force) {
			if (redrawing) return;
			redrawing = true;
			if (force) forcing = true;
			try {
				//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
				//lastRedrawID is null if it's the first redraw and not an event handler
				if (lastRedrawId && !force) {
					//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
					//when rAF: always reschedule redraw
					if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
						if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
						lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
					}
				}
				else {
					redraw();
					lastRedrawId = $requestAnimationFrame(function() { lastRedrawId = null; }, FRAME_BUDGET);
				}
			}
			finally {
				redrawing = forcing = false;
			}
		};
		m.redraw.strategy = m.prop();
		function redraw() {
			if (computePreRedrawHook) {
				computePreRedrawHook();
				computePreRedrawHook = null;
			}
			forEach(roots, function (root, i) {
				var component = components[i];
				if (controllers[i]) {
					var args = [controllers[i]];
					m.render(root, component.view ? component.view(controllers[i], args) : "");
				}
			});
			//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
			if (computePostRedrawHook) {
				computePostRedrawHook();
				computePostRedrawHook = null;
			}
			lastRedrawId = null;
			lastRedrawCallTime = new Date;
			m.redraw.strategy("diff");
		}

		var pendingRequests = 0;
		m.startComputation = function() { pendingRequests++; };
		m.endComputation = function() {
			if (pendingRequests > 1) pendingRequests--;
			else {
				pendingRequests = 0;
				m.redraw();
			}
		}

		function endFirstComputation() {
			if (m.redraw.strategy() === "none") {
				pendingRequests--;
				m.redraw.strategy("diff");
			}
			else m.endComputation();
		}

		m.withAttr = function(prop, withAttrCallback, callbackThis) {
			return function(e) {
				e = e || event;
				var currentTarget = e.currentTarget || this;
				var _this = callbackThis || this;
				withAttrCallback.call(_this, prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop));
			};
		};

		//routing
		var modes = {pathname: "", hash: "#", search: "?"};
		var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
		m.route = function(root, arg1, arg2, vdom) {
			//m.route()
			if (arguments.length === 0) return currentRoute;
			//m.route(el, defaultRoute, routes)
			else if (arguments.length === 3 && isString(arg1)) {
				redirect = function(source) {
					var path = currentRoute = normalizeRoute(source);
					if (!routeByValue(root, arg2, path)) {
						if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route");
						isDefaultRoute = true;
						m.route(arg1, true);
						isDefaultRoute = false;
					}
				};
				var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
				window[listener] = function() {
					var path = $location[m.route.mode];
					if (m.route.mode === "pathname") path += $location.search;
					if (currentRoute !== normalizeRoute(path)) redirect(path);
				};

				computePreRedrawHook = setScroll;
				window[listener]();
			}
			//config: m.route
			else if (root.addEventListener || root.attachEvent) {
				root.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
				if (root.addEventListener) {
					root.removeEventListener("click", routeUnobtrusive);
					root.addEventListener("click", routeUnobtrusive);
				}
				else {
					root.detachEvent("onclick", routeUnobtrusive);
					root.attachEvent("onclick", routeUnobtrusive);
				}
			}
			//m.route(route, params, shouldReplaceHistoryEntry)
			else if (isString(root)) {
				var oldRoute = currentRoute;
				currentRoute = root;
				var args = arg1 || {};
				var queryIndex = currentRoute.indexOf("?");
				var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {};
				for (var i in args) params[i] = args[i];
				var querystring = buildQueryString(params);
				var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute;
				if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

				var shouldReplaceHistoryEntry = (arguments.length === 3 ? arg2 : arg1) === true || oldRoute === root;

				if (window.history.pushState) {
					computePreRedrawHook = setScroll;
					computePostRedrawHook = function() {
						window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					};
					redirect(modes[m.route.mode] + currentRoute);
				}
				else {
					$location[m.route.mode] = currentRoute;
					redirect(modes[m.route.mode] + currentRoute);
				}
			}
		};
		m.route.param = function(key) {
			if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()");
			if( !key ){
				return routeParams;
			}
			return routeParams[key];
		};
		m.route.mode = "search";
		function normalizeRoute(route) {
			return route.slice(modes[m.route.mode].length);
		}
		function routeByValue(root, router, path) {
			routeParams = {};

			var queryStart = path.indexOf("?");
			if (queryStart !== -1) {
				routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
				path = path.substr(0, queryStart);
			}

			// Get all routes and check if there's
			// an exact match for the current path
			var keys = Object.keys(router);
			var index = keys.indexOf(path);
			if(index !== -1){
				m.mount(root, router[keys [index]]);
				return true;
			}

			for (var route in router) {
				if (route === path) {
					m.mount(root, router[route]);
					return true;
				}

				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

				if (matcher.test(path)) {
					path.replace(matcher, function() {
						var keys = route.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						forEach(keys, function (key, i) {
							routeParams[key.replace(/:|\./g, "")] = decodeURIComponent(values[i]);
						})
						m.mount(root, router[route]);
					});
					return true;
				}
			}
		}
		function routeUnobtrusive(e) {
			e = e || event;

			if (e.ctrlKey || e.metaKey || e.which === 2) return;

			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;

			var currentTarget = e.currentTarget || e.srcElement;
			var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
			while (currentTarget && currentTarget.nodeName.toUpperCase() !== "A") currentTarget = currentTarget.parentNode;
			// clear pendingRequests because we want an immediate route change
			pendingRequests = 0;
			m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args);
		}
		function setScroll() {
			if (m.route.mode !== "hash" && $location.hash) $location.hash = $location.hash;
			else window.scrollTo(0, 0);
		}
		function buildQueryString(object, prefix) {
			var duplicates = {};
			var str = [];
			for (var prop in object) {
				var key = prefix ? prefix + "[" + prop + "]" : prop;
				var value = object[prop];

				if (value === null) {
					str.push(encodeURIComponent(key));
				} else if (isObject(value)) {
					str.push(buildQueryString(value, key));
				} else if (isArray(value)) {
					var keys = [];
					duplicates[key] = duplicates[key] || {};
					forEach(value, function (item) {
						if (!duplicates[key][item]) {
							duplicates[key][item] = true;
							keys.push(encodeURIComponent(key) + "=" + encodeURIComponent(item));
						}
					});
					str.push(keys.join("&"));
				} else if (value !== undefined) {
					str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
				}
			}
			return str.join("&");
		}
		function parseQueryString(str) {
			if (str === "" || str == null) return {};
			if (str.charAt(0) === "?") str = str.slice(1);

			var pairs = str.split("&"), params = {};
			forEach(pairs, function (string) {
				var pair = string.split("=");
				var key = decodeURIComponent(pair[0]);
				var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null;
				if (params[key] != null) {
					if (!isArray(params[key])) params[key] = [params[key]];
					params[key].push(value);
				}
				else params[key] = value;
			});

			return params;
		}
		m.route.buildQueryString = buildQueryString;
		m.route.parseQueryString = parseQueryString;

		function reset(root) {
			var cacheKey = getCellCacheKey(root);
			clear(root.childNodes, cellCache[cacheKey]);
			cellCache[cacheKey] = undefined;
		}

		m.deferred = function () {
			var deferred = new Deferred();
			deferred.promise = propify(deferred.promise);
			return deferred;
		};
		function propify(promise, initialValue) {
			var prop = m.prop(initialValue);
			promise.then(prop);
			prop.then = function(resolve, reject) {
				return propify(promise.then(resolve, reject), initialValue);
			};
			prop["catch"] = prop.then.bind(null, null);
			return prop;
		}
		//Promiz.mithril.js | Zolmeister | MIT
		//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
		//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
		//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
		function Deferred(successCallback, failureCallback) {
			var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
			var self = this, state = 0, promiseValue = 0, next = [];

			self.promise = {};

			self.resolve = function(value) {
				if (!state) {
					promiseValue = value;
					state = RESOLVING;

					fire();
				}
				return this;
			};

			self.reject = function(value) {
				if (!state) {
					promiseValue = value;
					state = REJECTING;

					fire();
				}
				return this;
			};

			self.promise.then = function(successCallback, failureCallback) {
				var deferred = new Deferred(successCallback, failureCallback)
				if (state === RESOLVED) {
					deferred.resolve(promiseValue);
				}
				else if (state === REJECTED) {
					deferred.reject(promiseValue);
				}
				else {
					next.push(deferred);
				}
				return deferred.promise
			};

			function finish(type) {
				state = type || REJECTED;
				next.map(function(deferred) {
					state === RESOLVED ? deferred.resolve(promiseValue) : deferred.reject(promiseValue);
				});
			}

			function thennable(then, successCallback, failureCallback, notThennableCallback) {
				if (((promiseValue != null && isObject(promiseValue)) || isFunction(promiseValue)) && isFunction(then)) {
					try {
						// count protects against abuse calls from spec checker
						var count = 0;
						then.call(promiseValue, function(value) {
							if (count++) return;
							promiseValue = value;
							successCallback();
						}, function (value) {
							if (count++) return;
							promiseValue = value;
							failureCallback();
						});
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						failureCallback();
					}
				} else {
					notThennableCallback();
				}
			}

			function fire() {
				// check if it's a thenable
				var then;
				try {
					then = promiseValue && promiseValue.then;
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					state = REJECTING;
					return fire();
				}

				if (state === REJECTING) {
					m.deferred.onerror(promiseValue)
				}

				thennable(then, function () {
					state = RESOLVING
					fire()
				}, function () {
					state = REJECTING
					fire()
				}, function () {
					try {
						if (state === RESOLVING && isFunction(successCallback)) {
							promiseValue = successCallback(promiseValue);
						}
						else if (state === REJECTING && isFunction(failureCallback)) {
							promiseValue = failureCallback(promiseValue);
							state = RESOLVING;
						}
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						return finish();
					}

					if (promiseValue === self) {
						promiseValue = TypeError();
						finish();
					} else {
						thennable(then, function () {
							finish(RESOLVED);
						}, finish, function () {
							finish(state === RESOLVING && RESOLVED);
						});
					}
				});
			}
		}
		m.deferred.onerror = function(e) {
			if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) {
				pendingRequests = 0;
				throw e;
			}
		};

		m.sync = function(args) {
			var method = "resolve";

			function synchronizer(pos, resolved) {
				return function(value) {
					results[pos] = value;
					if (!resolved) method = "reject";
					if (--outstanding === 0) {
						deferred.promise(results);
						deferred[method](results);
					}
					return value;
				};
			}

			var deferred = m.deferred();
			var outstanding = args.length;
			var results = new Array(outstanding);
			if (args.length > 0) {
				forEach(args, function (arg, i) {
					arg.then(synchronizer(i, true), synchronizer(i, false));
				});
			}
			else deferred.resolve([]);

			return deferred.promise;
		};
		function identity(value) { return value; }

		function ajax(options) {
			if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
				var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36)
				var script = $document.createElement("script");

				window[callbackKey] = function(resp) {
					script.parentNode.removeChild(script);
					options.onload({
						type: "load",
						target: {
							responseText: resp
						}
					});
					window[callbackKey] = undefined;
				};

				script.onerror = function() {
					script.parentNode.removeChild(script);

					options.onerror({
						type: "error",
						target: {
							status: 500,
							responseText: JSON.stringify({
								error: "Error making jsonp request"
							})
						}
					});
					window[callbackKey] = undefined;

					return false;
				}

				script.onload = function() {
					return false;
				};

				script.src = options.url
					+ (options.url.indexOf("?") > 0 ? "&" : "?")
					+ (options.callbackKey ? options.callbackKey : "callback")
					+ "=" + callbackKey
					+ "&" + buildQueryString(options.data || {});
				$document.body.appendChild(script);
			}
			else {
				var xhr = new window.XMLHttpRequest();
				xhr.open(options.method, options.url, true, options.user, options.password);
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
						else options.onerror({type: "error", target: xhr});
					}
				};
				if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				}
				if (options.deserialize === JSON.parse) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (isFunction(options.config)) {
					var maybeXhr = options.config(xhr, options);
					if (maybeXhr != null) xhr = maybeXhr;
				}

				var data = options.method === "GET" || !options.data ? "" : options.data;
				if (data && (!isString(data) && data.constructor !== window.FormData)) {
					throw new Error("Request data should be either be a string or FormData. Check the `serialize` option in `m.request`");
				}
				xhr.send(data);
				return xhr;
			}
		}

		function bindData(xhrOptions, data, serialize) {
			if (xhrOptions.method === "GET" && xhrOptions.dataType !== "jsonp") {
				var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
				var querystring = buildQueryString(data);
				xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "");
			}
			else xhrOptions.data = serialize(data);
			return xhrOptions;
		}

		function parameterizeUrl(url, data) {
			var tokens = url.match(/:[a-z]\w+/gi);
			if (tokens && data) {
				forEach(tokens, function (token) {
					var key = token.slice(1);
					url = url.replace(token, data[key]);
					delete data[key];
				});
			}
			return url;
		}

		m.request = function(xhrOptions) {
			if (xhrOptions.background !== true) m.startComputation();
			var deferred = new Deferred();
			var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp"
			var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
			var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
			var extract = isJSONP ? function(jsonp) { return jsonp.responseText } : xhrOptions.extract || function(xhr) {
				if (xhr.responseText.length === 0 && deserialize === JSON.parse) {
					return null
				} else {
					return xhr.responseText
				}
			};
			xhrOptions.method = (xhrOptions.method || "GET").toUpperCase();
			xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
			xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
			xhrOptions.onload = xhrOptions.onerror = function(e) {
				try {
					e = e || event;
					var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
					var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
					if (e.type === "load") {
						if (isArray(response) && xhrOptions.type) {
							forEach(response, function (res, i) {
								response[i] = new xhrOptions.type(res);
							});
						} else if (xhrOptions.type) {
							response = new xhrOptions.type(response);
						}
						deferred.resolve(response)
					} else {
						deferred.reject(response)
					}

					deferred[e.type === "load" ? "resolve" : "reject"](response);
				}
				catch (e) {
					deferred.reject(e);
				}
				finally {
					if (xhrOptions.background !== true) m.endComputation()
				}
			}

			ajax(xhrOptions);
			deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
			return deferred.promise;
		};

		//testing API
		m.deps = function(mock) {
			initialize(window = mock || window);
			return window;
		};
		//for internal testing only, do not use `m.deps.factory`
		m.deps.factory = app;

		return m;
	})(typeof window !== "undefined" ? window : {});

	if (typeof module === "object" && module != null && module.exports) module.exports = m;
	else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return m }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createStore = __webpack_require__(5);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _combineReducers = __webpack_require__(7);

	var _combineReducers2 = _interopRequireDefault(_combineReducers);

	var _bindActionCreators = __webpack_require__(10);

	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

	var _applyMiddleware = __webpack_require__(11);

	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

	var _compose = __webpack_require__(12);

	var _compose2 = _interopRequireDefault(_compose);

	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}

	if (isCrushed.name !== 'isCrushed' && process.env.NODE_ENV !== 'production') {
	  /*eslint-disable no-console */
	  console.error('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	  /*eslint-enable */
	}

	exports.createStore = _createStore2['default'];
	exports.combineReducers = _combineReducers2['default'];
	exports.bindActionCreators = _bindActionCreators2['default'];
	exports.applyMiddleware = _applyMiddleware2['default'];
	exports.compose = _compose2['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createStore;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsIsPlainObject = __webpack_require__(6);

	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */

	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	    var isSubscribed = true;

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};
	var objStringValue = fnToString(Object);

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */

	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

	  if (proto === null) {
	    return true;
	  }

	  var constructor = proto.constructor;

	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
	}

	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports['default'] = combineReducers;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createStore = __webpack_require__(5);

	var _utilsIsPlainObject = __webpack_require__(6);

	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

	var _utilsMapValues = __webpack_require__(8);

	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

	var _utilsPick = __webpack_require__(9);

	var _utilsPick2 = _interopRequireDefault(_utilsPick);

	/* eslint-disable no-console */

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!_utilsIsPlainObject2['default'](inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */

	function combineReducers(reducers) {
	  var finalReducers = _utilsPick2['default'](reducers, function (val) {
	    return typeof val === 'function';
	  });
	  var sanityError;

	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  return function combination(state, action) {
	    if (state === undefined) state = {};

	    if (sanityError) {
	      throw sanityError;
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        console.error(warningMessage);
	      }
	    }

	    var hasChanged = false;
	    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	      return nextStateForKey;
	    });

	    return hasChanged ? finalState : state;
	  };
	}

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Applies a function to every key-value pair inside an object.
	 *
	 * @param {Object} obj The source object.
	 * @param {Function} fn The mapper function that receives the value and the key.
	 * @returns {Object} A new object that contains the mapped values for the keys.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = mapValues;

	function mapValues(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    result[key] = fn(obj[key], key);
	    return result;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Picks key-value pairs from an object where values satisfy a predicate.
	 *
	 * @param {Object} obj The object to pick from.
	 * @param {Function} fn The predicate the values must satisfy to be copied.
	 * @returns {Object} The object with the values that satisfied the predicate.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = pick;

	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key];
	    }
	    return result;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = bindActionCreators;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsMapValues = __webpack_require__(8);

	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */

	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
	    return bindActionCreator(actionCreator, dispatch);
	  });
	}

	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = applyMiddleware;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _compose = __webpack_require__(12);

	var _compose2 = _interopRequireDefault(_compose);

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */

	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return function () {
	    if (funcs.length === 0) {
	      return arguments[0];
	    }

	    var last = funcs[funcs.length - 1];
	    var rest = funcs.slice(0, -1);

	    return rest.reduceRight(function (composed, f) {
	      return f(composed);
	    }, last.apply(undefined, arguments));
	  };
	}

	module.exports = exports["default"];

/***/ }
/******/ ]);