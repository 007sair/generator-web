/**
 * 上滑加载更多数据
 * ----------------------
 * 
 */

var Loading = require('./loading.js');


function ScrollLoad(options) {

	//配置项
	this.opts = $.extend({}, {
		$tab: null,
		delay: 500,
		startPage: 1,				//开始页数
		render: function(callback) {
			//触发渲染函数 callback回调函数，可以在ajax中调用
		},
		beforeLoad: function() {
			//渲染前的回调函数
		},
		afterRender: function() {
			//渲染结束后的回调函数
		},						
		scroll: function(scrollTop) {
			//scroll事件 scrollTop为滚动页面时的top值
		}		
	}, options);

	//数据模型，不存放实际数据
	this.model = {
		page: this.opts.startPage,
		isRender: false,
		isEnd: false,
		scroll: 0
	};

	//tab选项卡信息，存放一些由this.model生成的对象，没有选项卡时只有1组数据
	this.tabs = [];

	//当前选项卡索引，没有选项卡时默认为0
	this.curTabIndex = 0;

	this.WINDOW_HEIGHT = $(window).height();

	this.y = 0; //window.scrollTo(x, y)的第二个参数

	this.xhr = null;				//load ajax Object

	this.loader = new Loading(this.opts.loading);

	this.loadTimer = null; 			//load定时器
	this.isStopLoad = false; 		//是否禁止滚动事件，默认不禁止
	this.isAutoLoad = false; 		//是否停止自动加载，默认不停止

	this.init();
}

ScrollLoad.prototype = {
	constructor: ScrollLoad,
	init: function() {
		var me = this;

		if (me.opts.$tab) {
			//初始化dom和一些数据
			me.opts.$tab.find('li').each(function (index, el) {
				//根据数据模型初始化每个tab的数据
				me.tabs.push($.extend(true, {}, me.model));
			});
		} else {
			me.tabs.push($.extend(true, {}, me.model));
		}

		this.loader.init();  //初始化loading，插入loading需要的样式
		this.load();
		this.bindEvent();
	},
	/**
	 * 获取当前容器，把loading插入到这个容器下
	 * 多选项卡切换时，需要外部调用并传入当前容器(当前容器为jq对象),再执行load函数
	 * 非多选项卡切换时，可以不调用，loading默认被加到body容器下
	 */
	getContainer: function($container) {
		this.loader.container = $container || $(document.body);
	},
	/**
	 * 显示loading，调用外部render函数
	 * @param callback	{callback function}  回调函数，此函数需放入ajax.success内执行
	 */
	load: function(callback) {
		var me = this;
		if (me.isStopLoad) return false;
		me.opts.beforeLoad.call(me);
		me.loader.show();
		clearTimeout(me.loadTimer);
		me.loadTimer = setTimeout(function() {
			me.opts.render.call(me, function() {
				if (!me.isAutoLoad && !me.isOutScreen()) { //如果页面没有超过一屏，继续加载
					setTimeout(function() {
						me.load();
					}, 200);
				} else {
					callback && callback();
					me.opts.afterRender.call(me);
				}
			})
		}, me.opts.delay);
	},
	/**
	 * 绑定事件
	 */
	bindEvent: function() {
		var me = this;
		window.addEventListener('scroll', function () {
			var scrollTop = $(window).scrollTop();
			me.opts.scroll.call(me, scrollTop);

			if (me.loader.isLoading() || me.isStopLoad) return false;
			var docHeight = $(document.body).height();
			if (scrollTop >= docHeight - me.WINDOW_HEIGHT) { //满足到底部的条件
				me.load();
			}
		});
	},
	/**
	 * 阻止一次scroll时间，然后立即解除阻止
	 * window.scrollTo也会触发scroll事件，避免冲突，需要先阻止scroll
	 * 解决当前tab页面过长，切换到短页面时数据加载问题（触发了scroll事件）
	 */
	stopEventOnce: function() {
		var me = this;
		me.isStopLoad = true;
		setTimeout(function() {
			me.isStopLoad = false;
		}, 300)
	},
	stopEvent: function() {
		this.isStopLoad = true;
	},
	stopLoop: function() {
		this.isAutoLoad = true;
	},
	isOutScreen: function() {
		//如果当前容器的高度+距离顶部的距离 大于 屏幕高度 说明超过一屏
		if (this.loader.container.height() + this.loader.container.offset().top > this.WINDOW_HEIGHT) {
			return true
		}
		return false
	},
	/**
	 * 数据加载失败时出现重新加载按钮
	 */
	reload: function() {
		var me = this;
		me.loader.loading.html('<input value="重新加载" class="reloadBtn" type="button">');
		$(document.body).on('click', '.reloadBtn', function() {
			me.loader.inform(me.loader.opts.html);
			me.load();
		});
	}
};

if (typeof module != 'undefined' && module.exports) {
	module.exports = ScrollLoad;
}

window.ScrollLoad = ScrollLoad;