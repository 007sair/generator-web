# 脚手架工具

> 启动gulp后会生成`dist`目录

```
.
├── build 
|   ├── config.js               #多页面配置                      
|   └── webpack.config.js       #webpack配置文件
├── dist                        #生成目录
├── node_modules                #包文件夹
│   └── node-sass               #解决node-sass在国内安装失败的问题
├── spritesmith                 #修改雪碧图、px2rem的配置
├── src                         #源文件
|   ├── assets                  #此目录不会被生成到dist中
|   |   ├── sprites             #雪碧图碎片文件目录
|   |   └── svg                 #svg碎片文件目录
|   ├── css                    
|   |   ├── base                #sass库目录
|   |   ├── _config.scss        #sass配置文件
|   |   ├── _sprites.scss       #css雪碧图生成的sass文件
|   |   ├── svg.css             #svg预览页面调用样式，实际开发可忽略
|   |   └── main.scss           #页面样式 可以有多个
|   ├── images                  #图片目录，会被copy到dist目录
|   |   └── data                #存放一些json数据，便于被copy至dist
|   ├── js                      
|   |   ├── lib                 #库目录
|   |   ├── mods                #模块目录
|   |   ├── index.js            #页面1入口文件
|   |   └── page2.js            #页面2入口文件
|   ├── index.html              #页面1
|   └── page2.html              #页面2
├── .gitignore     
├── gulpfile.js                 
└── package.json
```

## 功能

- sass编译
- js合并压缩
- 浏览器实时刷新
- rem单位切换
- css雪碧图(图片后缀须为.png)
- svg合并(symbol)

## 使用方法

**安装插件：**

```
#有淘宝镜像使用cnpm
#修改命令：npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install

# 无则使用npm
npm install
```

**启动任务：**

```
#开发环境
gulp dev
```

## 多页开发

修改build/config.js，一个页面对应一个`new HtmlWebpackPlugin`、一个入口文件

```javascript
//页面1
new HtmlWebpackPlugin({
    filename: 'page1.html',
    template: 'src/page1.html',
    chunks: ['page1'] //chunks代表当前页使用的入口文件 src/js/page1.js
}),
//页面2
new HtmlWebpackPlugin({
    filename: 'page2.html',
    template: 'src/page2.html',
    chunks: ['page2'] //chunks代表当前页使用的入口文件 src/js/page2.js
}),
...
```

## spritesmith目录（px -> rem）

插件`gulp.spritesmith`默认生成`px`为单位的雪碧图样式，将其改为`rem`单位的方法：

将目录`spritesmith`下的文件复制到`node_modules\gulp.spritesmith\node_modules\spritesheet-templates\lib\`下替换原文件


## TODO

- `PostCss` 加入