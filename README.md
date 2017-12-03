# 脚手架工具

基于gulp + webpack创建的一套前端工作流脚手架工具。

## 目录结构

``` ruby
.
├── config                      #webpack配置目录
├── dist                        #最终生成目录
|   └── symbols.html            #svg预览页面
├── src                         #源目录
|   ├── assets                  #资源目录
|   |   ├── base64              #存放小于4k的图片，用于生成base64
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
├── vendor.manifest.json        #第三方js的版本号管理配置
├── css.manifest.json           #css的版本号管理，只在build下生成
└── package.json
```

## 功能

- `SASS`转`CSS`
- `Javascript`合并压缩抽离
- 浏览器实时刷新
- 根据设计稿自由定制`rem`单位
- `CSS`雪碧图（图片后缀须为`.png`）
- `SVG`雪碧图（`symbol`标签）
- `PostCSS`
    - `pxtorem`，直接书写px，会被转换为rem
    - 简短写法，见：`_postcss.scss`
    - 新变量命名方法
- 图标转换（`base64`）

## 使用方法

``` bash
# 1.下载
git clone git@github.com:007sair/hero.git

# 2.修改npm镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org

# 3.安装插件
cnpm install

# 4.启动任务
gulp dev  #开发环境
gulp build  #生产环境
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

## TODO

- null

---

## 修改日志

### 2017-12-03

- 去掉`.bat`的繁琐操作，简化目录

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
