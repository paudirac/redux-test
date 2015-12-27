function deepFind(obj, path) {
    let paths = path.split('.'),
        current = obj;
    for(let i = 0, len = paths.length; i < len; i++) {
        if (current[paths[i]] == void 0) {
            return void 0;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

function path(propPath) {
    return function(item) {
        return deepFind(item, propPath);
    };
}

let pathmodule = {
    path: path
};

module.exports = pathmodule;
