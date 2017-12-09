/**
 * sprite的一些配置
 * svg：src/assets/svg 的压缩合并
 */

const fs = require('fs');

let config = {
    svg: {
        mode: "symbols",
        common: 'icon-svg',
        svgId: "svg-%f",
        svg: {
            symbols: 'images/icon-svg.svg'
        },
        templates: {
            previewSymbols: fs.readFileSync(__dirname + '/preview-symbol.html', "utf-8")
        }
    }
}

module.exports = config;