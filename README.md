# 脚手架工具

> 启动gulp后会生成`dist`目录

```
.
├── build                       
|   └── webpack.config.js       #webpack配置文件
├── dist                        #发布目录
├── node_modules                #包文件夹
|   ├── gulp.spritesmith        #css雪碧图需要的配置修改
│   └── node-sass               #解决node-sass在国内安装失败的问题
├── src                         #源文件
|   ├── css                    
|   |   ├── base                #sass库
|   |   ├── _config.scss        #sass配置文件
|   |   ├── _sprites.scss       #css雪碧图生成的sass文件
|   |   └── main.scss           #页面样式 可以有多个
|   ├── images                  
|   |   └── sprites             #雪碧图目录
|   ├── js                      
|   |   ├── lib                 #js库
|   |   ├── mods                #js模块
|   |   ├── index.js            #入口文件1
|   |   └── test.js             #入口文件2
|   ├── index.html              #页面1
|   └── test.html               #页面2
├── .gitignore     
├── gulpfile.js                 
└── package.json
```

## 功能

- sass转css
- js合并压缩
- 实时刷新
- 生产环境自动生成版本号
- 640/750的rem单位随时切换
- Css Sprite(图片必须为.png)

## 使用方法

**安装：**

```
# 有淘宝镜像使用cnpm  修改命令：npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install   

# 无则使用npm
npm install
```

**开发环境：**

```
gulp dev
```

**生产环境：**

```
gulp build
```

## 多页开发

修改build/webpack.config.js

```javascript
new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html',
    chunks: ['index'] //chunks代表当前页使用的入口文件 src/js/index.js
}),
new HtmlWebpackPlugin({
    filename: 'test.html',
    template: 'src/test.html',
    chunks: ['test'] //chunks代表当前页使用的入口文件 src/js/test.js
}),
```


## node_modules

**node-sass**

`node-sass`目录下包含经常安装不上的`vendor`

**gulp.spritesmith**

`gulp.spritesmith`默认生成`px`为单位的雪碧图样式，作者将其改为`rem`单位：

1、首先修改`gulp.spritesmith\node_modules\spritesheet-templates\lib\spritesheet-templates.js`

添加函数：
```javascript
//添加fomatFloat函数
function fomatFloat(src, pos) {
     if (!arguments.length) return -1;
     if (!isNaN(src)) {
          pos = (src > 0 && src < 1) ? 2 : pos || 1;
          return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
     }
     return src
}
```

```javascript
['x', 'y', 'offset_x', 'offset_y', 'height', 'width', 'total_height', 'total_width'].forEach(function (key) {
if (item[key] !== undefined) {
  // px[key] = item[key] + 'px';
  px[key] = fomatFloat(item[key]/75, 4) + 'rem'; //此处的75根据config.scss的$output值进行设置   750 -> 75   640 -> 40
}
});
```

2、修改`gulp.spritesmith\node_modules\spritesheet-templates\lib\templates\css.template.handlebars`

`rem`需要`background-size`支持

```css
{{{selector}}} {
  background-image: url({{{escaped_image}}});
  background-position: {{px.offset_x}} {{px.offset_y}};
  width: {{px.width}};
  height: {{px.height}};
  background-size: {{spritesheet.px.width}} {{spritesheet.px.height}}; //增加此行
}
```

3、修改`gulp.spritesmith\node_modules\spritesheet-templates\lib\templates\scss.template.handlebars`

抽离`background-image`和`background-size`

将如下代码：

```scss
@mixin sprite($sprite) {
  @include sprite-image($sprite);
  @include sprite-position($sprite);
  @include sprite-width($sprite);
  @include sprite-height($sprite);
}
```

改为：

```scss
@mixin sprite($sprite) {
  //@include sprite-image($sprite);
  @include sprite-position($sprite);
  @include sprite-width($sprite);
  @include sprite-height($sprite);
}

%sprite-common {
  background-image: url('{{{spritesheet.escaped_image}}}');
  background-size: {{spritesheet.px.width}} {{spritesheet.px.height}};
}
```

修改如下代码：

```scss
@mixin sprites($sprites) {
  @each $sprite in $sprites {
    $sprite-name: nth($sprite, 10);
    .#{$sprite-name} {
      @extend %sprite-common; //增加此行
      @include sprite($sprite);
    }
  }
}
```