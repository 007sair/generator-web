/**
 * sprite的一些配置
 * svg：src/assets/svg 的压缩合并
 */

var config = {
    svg: {
        mode: "symbols",
        common: 'icon-svg',
        svgId: "svg-%f",
        svg: {
            symbols: 'images/icon-svg.svg'
        },
        cssFile: 'css/main.css'
    }
}

module.exports = config;