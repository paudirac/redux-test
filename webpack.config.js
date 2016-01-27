// Refs:
// https://github.com/webpack/webpack/issues/1066
// http://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
// http://alexomara.com/blog/webpack-and-jquery-include-only-the-parts-you-need/

var path = require('path');
var webpack = require('webpack');

var appDir = path.join(__dirname, "app").replace(/\\/g, '/');
var buildDir = path.join(__dirname, "build").replace(/\\/g, '/');
var nodeModulesDir = path.join(__dirname, "node_modules").replace(/\\/g, '/');
var bowerModulesDir = path.join(__dirname, "bower_components").replace(/\\/g, '/');

console.log("appDir: " + appDir);
console.log("buidDir: " + buildDir);
console.log("nodeModulesDir: " + nodeModulesDir);
console.log("bowerModulesDir: " + bowerModulesDir);

module.exports = {
    entry: "./app/entry.js",
    output: {
        path: buildDir,
        filename: "bundle.js"
    },
    resolve: {
        root: [appDir, nodeModulesDir, bowerModulesDir]
        //alias: {
        //    jquery: "jquery/src/jquery"
        //}
    },
    resolveLoader: {
        root: nodeModulesDir
    },
    devtoool: 'inline-source-map',
    module: {
        loaders: [
            // ref: https://github.com/gowravshekar/bootstrap-webpack
            // {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            // {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            // {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            // {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},

            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.html$/, loader: 'html?name=[name]-[hash:6].[ext]', exclude: /node_modules/ },
            { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$/, loader: "url" },
            {
                test: /\.js$/,
                loaders: ['babel', 'jshint'],
                //loaders: ['babel', 'ng-annotate', 'jshint'],
                exclude: /node_modules|bower_components|jquery\.signalR.*|.*bootstrap.js/
            }
        ]
    }
}
