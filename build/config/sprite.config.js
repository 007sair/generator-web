/**
 * sprite的一些配置
 * svg：src/assets/svg 的压缩合并
 */

const fs = require('fs');
const path = require('path');

let dirVars = require('./dir-vars.config.js');

let config = {
    svg: {
        mode: "symbols",
        common: 'icon-svg',
        svgId: "svg-%f",
        svg: {
            symbols: 'images/icon-svg.svg'
        },
        templates: {
            previewSymbols: fs.readFileSync(path.resolve(dirVars.tmplDir, 'preview-symbol.html'), "utf-8")
        }
    }
}

module.exports = config;