/**
 * 公用工具库
 */

	var utils = {};

	/**
	 * 四舍五入小数点
	 * @param  {[number]} src [输入的数字]
	 * @param  {[number]} pos [精确到后几位]
	 * @return {[number]}
	 */
	utils.fomatFloat = function(src, pos) {
		if (!arguments.length) return -1;
		if (!isNaN(src)) {
			pos = (src > 0 && src < 1) ? 2 : pos || 1;
			return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
		}
		return src
	};

	/**
	 * var expireDays = 1;
	 * var data = new Date();
	 * date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000);
	 * setcookie(key, value, date.toGMTString());
	 */
	utils.setcookie = function(key, value, expire) {
		var host = window.location.host;
		host = host.replace('https://', '');
		host = host.replace('www', '');
		if (!host) host = '.miyabaobei.com';
		host = '';
		document.cookie = key + "=" + value + ";path=/;domain=" + host + ";expires=" + expire + ";";
	};

	utils.getcookie = function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) {
			return unescape(arr[2]);
		} else {
			return '';
		}
	};

	utils.removecookie = function(name) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	};

	utils.debounce = function(func, wait, immediate) { //防抖函数
		var timeout;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		}
	};

	utils.isApp = function() {
		var href = window.location.href;
		var re = href.indexOf('_app');
		if (navigator.userAgent.indexOf('miyabaobei_') > -1 || re !== -1) {
			return true;
		}
		return false;
	};

	utils.sku2link = function(sku) {
		if (this.isApp()) {
			return 'miyabaobei://productDetail?id=' + sku
		} 
		return '/item-'+ sku +'.html'
	};

	//打乱数组
	utils.shuffle = function (aArr) {
		var iLength = aArr.length,
			i = iLength,
			mTemp,
			iRandom;
		while (i--) {
			if (i !== (iRandom = Math.floor(Math.random() * iLength))) {
				mTemp = aArr[i];
				aArr[i] = aArr[iRandom];
				aArr[iRandom] = mTemp;
			}
		}
		return aArr;
	};

	//返回一个n到m（含n和m）的随机数
	utils.rnd = function (n, m) {
		return Math.floor(Math.random() * (m - n + 1) + n);
	};

	/**
	 * 金山云图片替换
	 * @param  {[string]} src     [图片链接]
	 * @param  {[number]} w       [图片宽度]
	 * @param  {[number]} q       [图片质量]
	 * @return {[string]}         [返回一个生成后的图片链接]
	 */
	utils.replaceSrc = function (src, w, q) {
		var reg = /img0[1-4]/;
		if (reg.test(src)) {
			src = src.replace(reg, 'img0' + this.rnd(5, 9));
			if (/img0[5-9]/.test(src) && src.indexOf('@base') < 0) { //@base@tag=imgScale&w=447&q=100
				src += '@base@tag=imgScale&w=' + (w || 100) + '&q=' + (q || 100);
			}
		}
		return src;
	};



	window.utils = utils;

	if (typeof module != 'undefined' && module.exports) {
		module.exports = utils;
	}