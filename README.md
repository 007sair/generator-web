# 脚手架工具

> 启动gulp后会生成`dist`目录

```
.
├── build 
|   ├── config.js               #多页面配置                      
|   └── webpack.config.js       #webpack配置文件
├── dist                        #发布文件存放目录
├── node_modules                #包文件夹
│   └── node-sass               #解决node-sass在国内安装失败的问题
├── spritesmith                 #修改雪碧图px2rem的配置
├── src                         #源文件
|   ├── css                    
|   |   ├── base                #sass库目录
|   |   ├── _config.scss        #sass配置文件
|   |   ├── _sprites.scss       #css雪碧图生成的sass文件
|   |   └── main.scss           #页面样式 可以有多个
|   ├── images                  
|   |   └── sprites             #雪碧图目录
|   ├── js                      
|   |   ├── lib                 #js库目录
|   |   ├── mods                #js模块目录
|   |   ├── index.js            #页面1入口文件
|   |   └── page2.js            #页面2入口文件
|   ├── index.html              #页面1
|   └── page2.html              #页面2
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
- css sprite(图片必须为.png)

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

## node_modules目录

### node-sass

`node-sass`目录下包含经常安装不上的`vendor`

### gulp.spritesmith

**gulp.spritesmith**

`gulp.spritesmith`默认生成`px`为单位的雪碧图样式，将其改为`rem`单位，方法如下：

将根目录`spritesmith`下的文件复制到`node_modules\gulp.spritesmith\node_modules\spritesheet-templates\lib\`下替换原有文件