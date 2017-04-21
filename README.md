# 脚手架工具

> 最终文件生成到dist目录

## 功能

- sass转css
- js合并压缩
- 实时刷新
- 生产环境自动生成版本号
- 640/750的rem单位随时切换
- Css Sprite

## 使用方法

**安装：**

```
#有淘宝镜像使用cnpm  修改命令：npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install   
#无则使用npm
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

## node_modules

**node-sass**

`node-sass`目录下包含经常安装不上的`vendor`

**gulp.spritesmith**

gulp.spritesmith默认生成px为单位的雪碧图样式，作者将其改为rem单位：

1、首先修改gulp.spritesmith\node_modules\spritesheet-templates\lib\spritesheet-templates.js

```javascript
// For each of the x, y, offset_x, offset_y, height, width, add a px after that
  ['x', 'y', 'offset_x', 'offset_y', 'height', 'width', 'total_height', 'total_width'].forEach(function (key) {
    if (item[key] !== undefined) {
      // px[key] = item[key] + 'px';
      px[key] = fomatFloat(item[key]/75, 2) + 'rem'; //此处的75根据config.scss的$output值进行设置   750 -> 75   640 -> 40
    }
  });
```

2、修改gulp.spritesmith\node_modules\spritesheet-templates\lib\templates\css.template.handlebars

rem需要background-size支持

```
{{{selector}}} {
  background-image: url({{{escaped_image}}});
  background-position: {{px.offset_x}} {{px.offset_y}};
  width: {{px.width}};
  height: {{px.height}};
  background-size: {{spritesheet.px.width}} {{spritesheet.px.height}}; //增加此行
}
```

3、修改gulp.spritesmith\node_modules\spritesheet-templates\lib\templates\scss.template.handlebars

87行后新增如下代码：

```
%sprite-common {
  background-image: url('{{{spritesheet.escaped_image}}}');
  background-size: {{spritesheet.px.width}} {{spritesheet.px.height}};
}
```

修改如下代码：

```
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

目的：生成的雪碧图每个class都带有相同的url，修改后将url抽离为公共代码
