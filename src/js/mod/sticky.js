/**
 * 移动端平滑吸顶
 * --------------
 * 使用方法：$obj.sticky(options)
 */

function Sticky($elem, options) {
	this.$elem = $elem; 		//1个或多个
	this.opts = $.extend(true, {
		placeholderName: '__placeholder__',
		isUseSticky: true,		//默认使用sticky 核心
		top: 0, 				//元素距离顶部的悬浮距离
		zIndex: 1000
	}, options);

	this.isFixed = false; 	//页面至少有1个元素悬浮时为true，默认false

	this.arr_tops = [];		//所有$elem的offset().top值
	this.curIndex = -1;		//当前悬浮元素索引，默认-1
	this.newCurIndex = -1;	//切换后的新值

	this.isInitPlaceholder = false; //是否初始化过占位元素
	this.BODY_HEIGHT = $(document.body).height();

	this.init();
}

Sticky.prototype = {

	init: function () {
		if (!$ || !this.$elem.length) return false;
		var me = this;

		if (this.isSupport()) {
			me.$elem.addClass('sticky').css({
				'top': me.opts.top,
				'z-index': me.opts.zIndex
			});
		}

		this.getOffsetTop();

		window.addEventListener('scroll', function() {
			var st = $(this).scrollTop();

			// $(document.body).data('scroll-top', st);

			//当页面高度发生变化时，更新arr_tops
			if ($(document.body).height() !== me.BODY_HEIGHT) {
				me.getOffsetTop();
				me.BODY_HEIGHT = $(document.body).height();
			}

			if (me.arr_tops_len == 1) { //只有1个元素
				if (st >= me.arr_tops[0]) {
					me.curIndex = 0;
				} else {
					me.curIndex = -1;
				}
			} else { //多个元素
				for (var i = 0; i < me.arr_tops_len; i++) {
					if (st < me.arr_tops[0]) {
						me.curIndex = -1;
					} else if (st >= me.arr_tops[me.arr_tops_len - 1]) {
						me.curIndex = me.arr_tops_len - 1;
					} else {
						if (st >= me.arr_tops[i] && st < me.arr_tops[i+1]) {
							me.curIndex = i;
						}
					}
				}
			}

			if (me.curIndex !== me.newCurIndex) {
				me.newCurIndex = me.curIndex;
				me.$elem.each(function (index, el) {
					if (index == me.curIndex) {
						me.fixed($(this));
					} else {
						me.unfixed($(this));
					}
				});
				me.isFixed = (st >= me.arr_tops[0]) ? true : false;
			}
			// console.log('fire scroll');
		});
	},
	getOffsetTop: function() { //有待优化：当有tab悬浮时，找一个最优的获取top值的方法
		var me = this;
		var top;
		this.arr_tops = [];
		this.$elem.each(function(index, el) {
			var $elem = $(this);
			//初始化占位符
			if (!$(this).siblings('.' + me.opts.placeholderName).length) {
				if (me.isSupport()) {
					//插入一个不影响页面高度的1像素占位元素，便于后面获取其offsetTop
					$(this).after('<div class="' + me.opts.placeholderName + '" style="height:1px;margin-top:-1px;">');
				} else {
					$(this).after('<div class="' + me.opts.placeholderName + '" style="display:none;height:' + $(this).height() + 'px;">');
				}
			}
			
			if (me.isSupport()) { //支持sticky
				//sticky元素悬浮时比较特殊，不能直接获取offsetTop，
				//小技巧：变向获取其相邻占位元素的offsetTop
				$elem = $(this).siblings('.' + me.opts.placeholderName);
				top = $elem.offset().top - $(this).height() - parseInt(me.opts.top);
				me.arr_tops.push(top);
			} else { //不支持
				//元素悬浮时，获取到的offsetTop值不是实际想要的值，所以获取其占位元素的值
				if ($(this).data('isFixed')) {
					$elem = $(this).siblings('.' + me.opts.placeholderName);
				}
				top = $elem.offset().top - parseInt(me.opts.top); //减 parseInt(me.opts.top) 为相对当前悬浮位置
				me.arr_tops.push(top);
			}

			//将top值暴露给外界使用
			$(this).data('top', top);
		});
		this.arr_tops_len = this.arr_tops.length;
	},
	fixed: function ($obj) {
		var me = this;
		if (!me.isSupport()) {
			$obj.css({
				'position': 'fixed',
				'width': '100%',
				'left': 0,
				'top': me.opts.top,
				'z-index': me.opts.zIndex
			});
			me.placeHolderShow($obj); 
		}
		$obj.data('isFixed', 1);
	},
	unfixed: function ($obj) {
		var me = this;
		if(!me.isSupport()) {
			$obj.removeAttr('style');
			me.placeHolderHide($obj); 
		}
		$obj.data('isFixed', 0);
	},
	isSupport: function () {
		var prefixTestList = ['', '-webkit-'];
		var stickyText = '';
		for (var i = 0; i < prefixTestList.length; i++) {
			stickyText += 'position:' + prefixTestList[i] + 'sticky;';
		}
		// 创建一个dom来检查
		var div = document.createElement('div');
		var body = document.body;
		div.style.cssText = 'display:none;' + stickyText;
		body.appendChild(div);
		var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
		body.removeChild(div);
		div = null;
		return this.opts.isUseSticky ? isSupport : false;
	},
	placeHolderShow: function ($elem) {
		$elem.siblings('.' + this.opts.placeholderName).show();
	},
	placeHolderHide: function ($elem) {
		$elem.siblings('.' + this.opts.placeholderName).hide();
	}
};

$.fn.sticky = function (config) {
	return new Sticky(this, config)
};

if (typeof module != 'undefined' && module.exports) {
	module.exports = Sticky;
}
