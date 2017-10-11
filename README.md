# 脚手架工具

基于gulp + webpack创建的一套前端工作流脚手架工具。

## 目录结构

``` ruby
.
├── config                      #webpack配置目录
├── dist                        #最终生成目录
├── rev                         #存放版本号文件与webpack.DllPlugin插件的配置文件
├── spritesmith                 #修改雪碧图配置，具体修改下方有说明
├── src                         #源目录
|   ├── assets                  #资源目录
|   |   ├── base64              #存放小于8k的图片，用于生产base64
|   |   ├── data                #存放json数据，便于ajax使用，会被复制到dist目录下
|   |   ├── img                 #图片目录，存放未被处理的图片，会被复制到dist目录下
|   |   ├── sprites             #雪碧图目录，加工后的文件被生成到dist/img内
|   |   └── svg                 #svg目录，加工后的文件被生成到dist/img内
|   ├── css                    
|   |   ├── base                #sass库目录
|   |   ├── _config.scss        #sass配置文件
|   |   ├── _common.scss        #公共样式文件
|   |   ├── _sprites.scss       #雪碧图插件生成的样式文件
|   |   ├── _postcss.scss       #postcss代码参考写法
|   |   └── main.scss           #页面样式 可以有多个
|   ├── js                      
|   |   ├── lib                 #库目录
|   |   ├── mods                #模块目录
|   |   ├── index.js            #页面1入口文件
|   |   └── index2.js           #页面2入口文件
|   ├── index.html              #页面1
|   └── page2.html              #页面2
├── .gitignore     
├── gulpfile.js   
├── svg.html                    #svg图标预览查看页面                 
└── package.json
```

## 功能

- Sass转CSS
- Javascript合并压缩抽离
- 浏览器实时刷新
- 根据设计稿自由定制rem单位
- CSS雪碧图（图片后缀须为.png）
- SVG雪碧图（symbol标签）
- PostCSS
    - px2rem，直接书写px，会被转换为rem
    - 简短语法，见：_postcss.scss
    - 新变量命名方法
- 图标转换（base64）

## 使用方法

**1. 下载**

``` bash
git clone git@github.com:007sair/hero.git
```

**2. 修改npm镜像**

``` bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

**2. 安装插件**

``` bash
cnpm install
```

**3. 修改插件**

运行根目录下的`sprite.bat`。

**4. 启动任务**

``` bash
#开发环境
gulp dev

#生产环境
gulp build
```

## 配置问题

### 多页开发

`hero`使用了[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)插件。具体参考此插件用法。

打开`config/page.config.js`，一个页面对应一个`new HtmlWebpackPlugin`，`chunks`为这个页面需要添加的js文件。

``` javascript
new HtmlWebpackPlugin({ //页面1 项目开发请填写注释
    filename: 'page1.html',
    template: 'src/page1.html',
    chunks: ['page1'] //chunks代表当前页使用的入口文件 src/js/page1.js
}),
new HtmlWebpackPlugin({ //页面2
    filename: 'page2.html',
    template: 'src/page2.html',
    chunks: ['page2'] //chunks代表当前页使用的入口文件 src/js/page2.js
}),
... //更多页面
```

### 雪碧图配置

本脚手架对雪碧图插件(`gulp.spritesmith`)略做修改，使其支持`rem`单位（原插件只支持`px`），且`rem`基数为75，修改方法：

<del>将目录`spritesmith`下的文件复制到`node_modules\gulp.spritesmith\node_modules\spritesheet-templates\lib\`下替换原文件。</del>

运行`sprite.bat`自动复制即可。

#### 修改基数

打开`./spritesmith/spritesheet-templates.js`，174行：

```
['x', 'y', 'offset_x', 'offset_y', 'height', 'width', 'total_height', 'total_width'].forEach(function (key) {
    if (item[key] !== undefined) {
        // px[key] = item[key] + 'px';
        px[key] = fomatFloat(item[key]/75, 5) + 'rem'; //75为当前基数，5为小数点个数
    }
});
```

## TODO

- null

---

## 修改日志

### 2017-10-11

- 整体优化

### 2017-09-25

- 添加`base64`插件，使用方法见`main.scss`

### 2017-09-22

- 添加`px2rem`插件，支持直接将px转换为rem单位

### 2017-09-07

- 优化目录结构

### 2017-08-28

- 修改`README.md`

### 2017-08-22

- 增加`sprite.bat`批量处理工具，代替手动替换

### 2017-08-21

- 更新`node-sass`版本至`4.5.3`，支持`NodeJS（v8.4.0）`版本
- 最近发现`node-sass`能够成功安装，所以选择删除`node_modules`目录下的`node-sass`文件
