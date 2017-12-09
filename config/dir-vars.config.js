var path = require('path');
var dirs = {};

dirs.rootDir = path.resolve(__dirname, '../'); //根目录
dirs.srcDir = path.resolve(dirs.rootDir, 'src'); //源代码目录
dirs.distDir = path.resolve(dirs.rootDir, 'dist'); //生成目录
dirs.configDir = path.resolve(dirs.rootDir, 'config'); //配置目录

// console.log(dirs);

module.exports = dirs;