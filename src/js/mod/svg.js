/**
 * 引入所有svg图标，供 svg-sprite-loader 插件使用
 */

// requires and returns all modules that match
const requireAll = requireContext => requireContext.keys().map(requireContext);
// import all svg
const req = require.context('_assets/svg', true, /\.svg$/);
requireAll(req);

/**
 * use in html:
   
    <svg><use xlink:href="#target"/></svg>

    #target: svg name in '_assets/svg'

 */