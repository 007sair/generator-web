/**
 * sprite的一些配置
 * svg：src/assets/svg 的压缩合并
 * image：src/assets/sprites 图标的压缩合并
 */

var config = {
    svg: {
        mode: "symbols",
        common: 'icon-svg',
        svgId: "svg-%f",
        preview: {
            symbols: 'svg.html'
        },
        svg: {
            symbols: 'images/svg-icon.svg'
        },
        cssFile: 'css/svg.css'
    },
    image: {
        cssName: '_sprites.scss',
        cssFormat: 'scss',
        imgName: 'icon-sprite.png',
        imgPath: '../images/icon-sprite.png',
        padding: 20
    }
}

module.exports = config;