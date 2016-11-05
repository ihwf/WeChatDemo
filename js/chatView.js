(function($, doc) {
	var MIN_SOUND_TIME = 800;
	
	var touchSupport = ('ontouchstart' in document);
	var tapEventName = touchSupport ? 'tap' : 'click';
	var enterEventName = touchSupport ? 'tap' : 'click';
	var imageClassName = $.className('image');
	
	$.init({
		swipeBack:true,
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false
			swipe: true, //默认为true
			drag: true, //默认为true
			hold: true, //默认为false，不监听
			release: true //默认为false，不监听
		}
	});
	template.config('escape', false);
	//$.plusReady=function(fn){fn();};
	$.plusReady(function() {
		
		var header = plus.webview.currentWebview().chatHeader;
		var title = plus.webview.currentWebview().chatTitle;
		document.querySelector('.mui-title').innerHTML = title;
	
	plus.webview.currentWebview().setStyle({
		softinputMode: "adjustResize"
	});
	var showKeyboard = function() {
		if ($.os.ios) {
			var webView = plus.webview.currentWebview().nativeInstanceObject();
			webView.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		} else {
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
			//var view = ((ViewGroup)main.findViewById(android.R.id.content)).getChildAt(0);
			imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
			//alert("ll");
		}
	};
	var record = [{
		sender: 'zs',
		type: 'text',
		content: 'Hi，你是谁?'
	}];
	var ui = {
		body: doc.querySelector('body'),
		footer: doc.querySelector('footer'),
		footerRight: doc.querySelector('.footer-left'),
		footerLeft: doc.querySelector('.footer-right'),
		btnMsgImage: doc.querySelector('#msg-type'),
		boxMsgText: doc.querySelector('#msg-text'),
		boxMsgSound: doc.querySelector('#msg-sound'),
		btnMsgType: doc.querySelector('#msg-image'),
		areaMsgList: doc.querySelector('#msg-list'),
		boxSoundAlert: doc.querySelector('#sound-alert'),
		h: doc.querySelector('#h'),
		content: doc.querySelector('.mui-content')
	};
	ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
	//alert(ui.boxMsgText.offsetWidth );
	var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
	var msgItemTap = function(msgItem, event) {
		var msgType = msgItem.getAttribute('msg-type');
		var msgContent = msgItem.getAttribute('msg-content')
		if (msgType == 'sound') {
			player = plus.audio.createPlayer(msgContent);
			var playState = msgItem.querySelector('.play-state');
			playState.innerText = '正在播放...';
			player.play(function() {
				playState.innerText = '点击播放';
			}, function(e) {
				playState.innerText = '点击播放';
			});
		}
	};
	var imageViewer = new $.ImageViewer('.msg-content-image', {
		dbl: false
	});
	var bindMsgList = function() {
		//绑定数据:
		/*tp.bind({
			template: 'msg-template',
			element: 'msg-list',
			model: record
		});*/
	//						定义传递给模板的变量
		ui.areaMsgList.innerHTML = template('msg-template', {
			"record": record,
			"header":header
		});
		var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
		[].forEach.call(msgItems, function(item, index) {
			item.addEventListener('tap', function(event) {
				msgItemTap(item, event);
			}, false);
		});
		imageViewer.findAllImage();
		ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
	};
	bindMsgList();
	window.addEventListener('resize', function() {
		ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
	}, false);
	var send = function(msg) {
		record.push(msg);
		bindMsgList();
		toRobot(msg.content);
	};
	var toRobot = function(info) {
		var apiUrl = 'http://www.tuling123.com/openapi/api';
		$.getJSON(apiUrl, {
			"key": 'acfbca724ea1b5db96d2eef88ce677dc',
			"info": info,
			"userid": plus.device.uuid
		}, function(data) {
			//alert(JSON.stringify(data));
			record.push({
				sender: 'zs',
				type: 'text',
				content: data.text
			});
			bindMsgList();
		});
	};
	
	//选择表情
	mui('#selectFace').on('tap','img',function() {
		var faceImg = this.getAttribute('src');
			send({
				sender: 'self',
				type: 'image',
				content: faceImg
			});
	});
	//					
	
	function msgTextFocus() {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
		}
		//解决长按“发送”按钮，导致键盘关闭的问题；
	ui.footerLeft.addEventListener('touchstart', function(event) {
		if (ui.btnMsgImage.classList.contains('mui-icon-paperplane')) {
			msgTextFocus();
			event.preventDefault();
		}
	});
	//解决长按“发送”按钮，导致键盘关闭的问题；
	ui.footerLeft.addEventListener('touchmove', function(event) {
		if (ui.btnMsgImage.classList.contains('mui-icon-paperplane')) {
			msgTextFocus();
			event.preventDefault();
		}
	});
	//					ui.footerRight.addEventListener('touchcancel', function(event) {
	//						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
	//							msgTextFocus();
	//							event.preventDefault();
	//						}
	//					});
	//					ui.footerRight.addEventListener('touchend', function(event) {
	//						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
	//							msgTextFocus();
	//							event.preventDefault();
	//						}
	//					});
	//发送文字
		document.querySelector('.mui-icon-paperplane').addEventListener('click',function() {
	//							showKeyboard();
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
				document.querySelector('#Gallery').style.display = 'none';
				document.querySelector('#biaoqingbao').style.display = 'none';
				document.querySelector('footer').style.bottom = '0px';
			}, 150);
			//							event.detail.gesture.preventDefault();
			
			send({
				sender: 'self',
				type: 'text',
				content: ui.boxMsgText.innerHTML.replace(new RegExp('\n', 'gm'), '<br/>')
			});
			ui.boxMsgText.innerHTML = '';
			$.trigger(ui.boxMsgText, 'input', null);
		});
	//显示按住说话框
	ui.footerRight.addEventListener('release', function(event) {
		if (ui.btnMsgType.classList.contains('yuyin')) {
			ui.btnMsgType.classList.add('jianpan');
			ui.btnMsgType.classList.remove('yuyin');
			ui.boxMsgText.style.display = 'none';
			ui.boxMsgSound.style.display = 'block';
			
			document.querySelector('#biaoqing').classList.add('icon-biaoqing');
			document.querySelector('#biaoqing').classList.remove('jianpan');
			document.querySelector('#biaoqingbao').style.display = 'none';
			document.querySelector('#Gallery').style.display = 'none';
			document.querySelector('footer').style.bottom = '0px';
			
			document.body.focus();
			ui.boxMsgText.blur();
		} else if (ui.btnMsgType.classList.contains('jianpan')) {
			ui.btnMsgType.classList.add('yuyin');
			ui.btnMsgType.classList.remove('jianpan');
			ui.boxMsgSound.style.display = 'none';
			ui.boxMsgText.style.display = 'block';
			
			
			document.querySelector('#biaoqingbao').style.display = 'none';
			document.querySelector('#Gallery').style.display = 'none';
			document.querySelector('footer').style.bottom = '0px';
			//--
			//showKeyboard();
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
		}
	}, false);
	
	//相机功能 takePhoto
	document.querySelector('.takePhoto').addEventListener('tap', function(event) {
		var btnArray = [{
			title: "拍照"
		}, {
			title: "从相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "选择照片",
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			switch (index) {
				case 0:
					break;
				case 1:
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function(path) {
						send({
							sender: 'self',
							type: 'image',
							content: "file://" + plus.io.convertLocalFileSystemURL(path)
						});
					}, function(err) {});
					break;
				case 2:
					plus.gallery.pick(function(path) {
						send({
							sender: 'self',
							type: 'image',
							content: path
						});
					}, function(err) {}, null);
					break;
			}
		});
	}, false); 
	
	
	var setSoundAlertVisable=function(show){
		if(show){
			ui.boxSoundAlert.style.display = 'block';
			ui.boxSoundAlert.style.opacity = 1;
		}else{
			ui.boxSoundAlert.style.opacity = 0;
			//fadeOut 完成再真正隐藏
			setTimeout(function(){
				ui.boxSoundAlert.style.display = 'none';
			},200);
		}
	};
	var recordCancel = false;
	var recorder = null;
	var audio_tips = document.getElementById("audio_tips");
	var startTimestamp = null;
	var stopTimestamp = null;
	var stopTimer = null;
	ui.boxMsgSound.addEventListener('hold', function(event) {
		recordCancel = false;
		if(stopTimer)clearTimeout(stopTimer);
		audio_tips.innerHTML = "手指上划，取消发送";
		ui.boxSoundAlert.classList.remove('rprogress-sigh');
		setSoundAlertVisable(true);
		recorder = plus.audio.getRecorder();
		if (recorder == null) {
			plus.nativeUI.toast("不能获取录音对象");
			return;
		}
		startTimestamp = (new Date()).getTime();
		recorder.record({
			filename: "_doc/audio/"
		}, function(path) {
			if (recordCancel) return;
			send({
				sender: 'self',
				type: 'sound',
				content: path
			});
		}, function(e) {
			plus.nativeUI.toast("录音时出现异常: " + e.message);
		});
	}, false);
	ui.body.addEventListener('drag', function(event) {
		//console.log('drag');
		if (Math.abs(event.detail.deltaY) > 50) {
			if (!recordCancel) {
				recordCancel = true;
				if (!audio_tips.classList.contains("cancel")) {
					audio_tips.classList.add("cancel");
				}
				audio_tips.innerHTML = "松开手指，取消发送";
			}
		} else {
			if (recordCancel) {
				recordCancel = false;
				if (audio_tips.classList.contains("cancel")) {
					audio_tips.classList.remove("cancel");
				}
				audio_tips.innerHTML = "手指上划，取消发送";
			}
		}
	}, false);
	ui.boxMsgSound.addEventListener('release', function(event) {
		//console.log('release');
		if (audio_tips.classList.contains("cancel")) {
			audio_tips.classList.remove("cancel");
			audio_tips.innerHTML = "手指上划，取消发送";
		}
		//
		stopTimestamp = (new Date()).getTime();
		if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
			audio_tips.innerHTML = "录音时间太短";
			ui.boxSoundAlert.classList.add('rprogress-sigh');
			recordCancel = true;
			stopTimer=setTimeout(function(){
				setSoundAlertVisable(false);
			},800);
		}else{
			setSoundAlertVisable(false);
		}
		recorder.stop();
	}, false);
	ui.boxMsgSound.addEventListener("touchstart", function(e) {
		//console.log("start....");
		e.preventDefault();
	});
	//显示发送按钮
	ui.boxMsgText.addEventListener('input', function(event) {
	//						ui.btnMsgImage.classList[ui.boxMsgText.innerHTML == '' ? 'remove' : 'add']('mui-icon-paperplane');
		if(ui.boxMsgText.innerHTML != ''){
			document.querySelector('.mui-icon-paperplane').style.display = 'block';
			document.querySelector('.mui-icon-plus').style.display = 'none';
		}else{
			document.querySelector('.mui-icon-paperplane').style.display = 'none';
			document.querySelector('.mui-icon-plus').style.display = 'block';
		}
		ui.btnMsgImage.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
		ui.h.innerText = ui.boxMsgText.innerHTML.replace(new RegExp('\n', 'gm'), '\n-') || '-';
		ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
		ui.content.style.paddingBottom = ui.footer.style.height;
	});
	
	//显示键盘
	var focus = false;
	ui.boxMsgText.addEventListener('tap', function(event) {
		document.querySelector('#biaoqingbao').style.display = 'none';
		document.querySelector('#Gallery').style.display = 'none';
		document.querySelector('footer').style.bottom = '0px';
		
		document.querySelector('#biaoqing').classList.add('icon-biaoqing');
		document.querySelector('#biaoqing').classList.remove('jianpan');
		
		ui.content.style.paddingBottom = '50px';
		
		
		ui.boxMsgText.focus();
		setTimeout(function() {
			ui.boxMsgText.focus();
		}, 0);
		focus = true;
		setTimeout(function () {
			focus = false;
		},1000);
		event.detail.gesture.preventDefault();
	}, false);
	//点击消息列表，关闭键盘
	ui.areaMsgList.addEventListener('click',function (event) {
		if(!focus){
			ui.boxMsgText.blur();
		}
	})
	//显示更多
	document.querySelector('.mui-icon-plus').addEventListener('tap',function(){
		if(document.querySelector('#Gallery').style.display == 'none'){
			document.querySelector('footer').style.bottom = '237px';
			document.querySelector('#biaoqingbao').style.display = 'none';
			document.querySelector('#Gallery').style.display = 'block';
			ui.boxMsgText.blur();
		}else{
			document.querySelector('footer').style.bottom = '0px';
			document.querySelector('#Gallery').style.display = 'none';
			document.querySelector('#biaoqingbao').style.display = 'none';
			ui.boxMsgText.blur();
		}
	});
	//显示表情
	document.querySelector('#biaoqing').addEventListener('release', function(event) {
		if (this.classList.contains('icon-biaoqing')) {
			this.classList.add('jianpan');
			this.classList.remove('icon-biaoqing');
			document.querySelector('footer').style.bottom = '27%';
			document.querySelector('#biaoqingbao').style.display = 'block';
			document.querySelector('#Gallery').style.display = 'none';
			
			ui.content.style.paddingBottom = '60%';
			
			ui.boxMsgText.style.display = 'block';
			ui.boxMsgSound.style.display = 'none';
			
			ui.btnMsgType.classList.add('yuyin');
			ui.btnMsgType.classList.remove('jianpan');
			document.body.focus();
			ui.boxMsgText.blur();
		} else if (this.classList.contains('jianpan')) {
			this.classList.add('icon-biaoqing');
			this.classList.remove('jianpan');
			
			ui.boxMsgText.style.display = 'block';
			ui.boxMsgSound.style.display = 'none';
			
			ui.content.style.paddingBottom = '50px';
			
			document.querySelector('#biaoqingbao').style.display = 'none';
			document.querySelector('#Gallery').style.display = 'none';
			document.querySelector('footer').style.bottom = '0px';
			//--
			//showKeyboard();
					ui.boxMsgText.focus();
					setTimeout(function() {
						ui.boxMsgText.focus();
					}, 150);
				}
			}, false);
	});


//图片预览组件

	//创建DOM (此函数是否可放在 mui.js 中)
	$.dom = function(str) {
		if (!$.__create_dom_div__) {
			$.__create_dom_div__ = document.createElement('div');
		}
		$.__create_dom_div__.innerHTML = str;
		return $.__create_dom_div__.childNodes;
	};

	//图片预览组件类
	var ImageViewer = $.ImageViewer = $.Class.extend({
		//构造函数
		init: function(selector, options) {
			var self = this;
			self.options = options || {};
			self.selector = selector || 'img';
			if (self.options.dbl) {
				enterEventName = touchSupport ? 'doubletap' : 'dblclick';
			}
			self.findAllImage();
			self.createViewer();
			self.bindEvent();
		},
		//创建图片预览组件的整体 UI
		createViewer: function() {
			var self = this;
			self.viewer = $.dom("<div class='mui-imageviewer'><div class='mui-imageviewer-mask'></div><div class='mui-imageviewer-header'><i class='mui-icon mui-icon-closeempty mui-imageviewer-close'></i><span class='mui-imageviewer-state'></span></div><i class='mui-icon mui-icon-arrowleft  mui-imageviewer-left'></i><i class='mui-icon mui-icon-arrowright mui-imageviewer-right'></i></div>");
			self.viewer = self.viewer[0] || self.viewer;
			//self.viewer.style.height = screen.height;
			self.closeButton = self.viewer.querySelector('.mui-imageviewer-close');
			self.state = self.viewer.querySelector('.mui-imageviewer-state');
			self.leftButton = self.viewer.querySelector('.mui-imageviewer-left');
			self.rightButton = self.viewer.querySelector('.mui-imageviewer-right');
			self.mask = self.viewer.querySelector('.mui-imageviewer-mask');
			document.body.appendChild(self.viewer);
		},
		//查找所有符合的图片
		findAllImage: function() {
			var self = this;
			self.images = [].slice.call($(self.selector));
		},
		//检查图片是否为启动预览的图片
		checkImage: function(target) {
			var self = this;
			if (target.tagName !== 'IMG') return false;
			return self.images.some(function(image) {
				return image == target;
			});
		},
		//绑定事件
		bindEvent: function() {
			var self = this;
			//绑定图片 tap 事件
			document.addEventListener(enterEventName, function(event) {
				if (!self.viewer) return;
				var target = event.target;
				if (!self.checkImage(target)) return;
				self.viewer.style.display = 'block';
				setTimeout(function() {
					self.viewer.style.opacity = 1;
				}, 0);
				self.index = self.images.indexOf(target);
				self.currentItem = self.createImage(self.index);
			}, false);
			//关系按钮事件
			self.closeButton.addEventListener(tapEventName, function(event) {
				self.viewer.style.opacity = 0;
				setTimeout(function() {
					self.viewer.style.display = 'none';
					self.disposeImage(true);
				}, 600);
				event.preventDefault();
				event.cancelBubble = true;
			}, false);
			//处理左右按钮
			self.leftButton.addEventListener(tapEventName, function() {
				self.prev();
			}, false);
			self.rightButton.addEventListener(tapEventName, function() {
				self.next();
			}, false);
			//处理划动
			self.mask.addEventListener($.EVENT_MOVE, function(event) {
				event.preventDefault();
				event.cancelBubble = true;
			}, false);
			self.viewer.addEventListener('swipeleft', function(event) {
				if (self.scaleValue == 1) self.next();
				event.preventDefault();
				event.cancelBubble = true;
			}, false);
			self.viewer.addEventListener('swiperight', function(event) {
				if (self.scaleValue == 1) self.prev();
				event.preventDefault();
				event.cancelBubble = true;
			}, false);
			//处理缩放开始
			self.viewer.addEventListener($.EVENT_START, function(event) {
				var touches = event.touches;
				if (touches.length == 2) {
					var p1 = touches[0];
					var p2 = touches[1];
					var x = p1.pageX - p2.pageX; //x1-x2
					var y = p1.pageY - p2.pageY; //y1-y2
					self.scaleStart = Math.sqrt(x * x + y * y);
					self.isMultiTouch = true;
				} else if (touches.length = 1) {
					self.dragStart = touches[0];
				}
			}, false);
			self.viewer.addEventListener($.EVENT_MOVE, function(event) {
				var img = self.currentItem.querySelector('img');
				var touches = event.changedTouches;
				if (touches.length == 2) {
					event.preventDefault();
					event.cancelBubble = true;
					var p1 = touches[0];
					var p2 = touches[1];
					var x = p1.pageX - p2.pageX;
					var y = p1.pageY - p2.pageY;
					self.scaleEnd = Math.sqrt(x * x + y * y);
					self._scaleValue = (self.scaleValue * (self.scaleEnd / self.scaleStart));
					//self.state.innerText = self._scaleValue;
					img.style.webkitTransform = "scale(" + self._scaleValue + "," + self._scaleValue + ") "; // + " translate(" + self.dragX || 0 + "px," + self.dragY || 0 + "px)";
				} else if (!self.isMultiTouch && touches.length == 1 && self.scaleValue != 1) {
					event.preventDefault();
					event.cancelBubble = true;
					self.dragEnd = touches[0];
					self._dragX = self.dragX + (self.dragEnd.pageX - self.dragStart.pageX);
					self._dragY = self.dragY + (self.dragEnd.pageY - self.dragStart.pageY);
					img.style.marginLeft = self._dragX + 'px';
					img.style.marginTop = self._dragY + 'px';
					//img.style.transform = "translate(" + self._dragX + "px," + self._dragY + "px) " + " scale(" + self.scaleValue || 1 + "," + self.scaleValue || 1 + ")";
				}
			}, false);
			self.viewer.addEventListener($.EVENT_END, function() {
				self.scaleValue = self._scaleValue || self.scaleValue;
				self._scaleValue = null;
				self.dragX = self._dragX;
				self.dragY = self._dragY;
				self._dragX = null;
				self._dragY = null;
				var touches = event.touches;
				self.isMultiTouch = (touches.length != 0);
			});
			// doubletap 好像不能用
			self.viewer.addEventListener('doubletap', function() {
				var img = self.currentItem.querySelector('img');
				if (self.scaleValue === 1) {
					self.scaleValue = 2;
				} else {
					self.scaleValue = 1;
				}
				self.dragX = 0;
				self.dragY = 0;
				img.style.marginLeft = self.dragX + 'px';
				img.style.marginTop = self.dragY + 'px';
				img.style.webkitTransform = "scale(" + self.scaleValue + "," + self.scaleValue + ") "; //+ " translate(" + self.dragX || 0 + "px," + self.dragY || 0 + "px)";
				self.viewer.__tap_num = 0;
			}, false);
			//处理缩放结束
		},
		//下一张图片
		next: function() {
			var self = this;
			self.mask.style.display = 'block';
			self.index++;
			var newItem = self.createImage(self.index, 'right');
			setTimeout(function() {
				self.currentItem.classList.remove('mui-imageviewer-item-center');
				self.currentItem.classList.add('mui-imageviewer-item-left');
				newItem.classList.remove('mui-imageviewer-item-right');
				newItem.classList.add('mui-imageviewer-item-center');
				self.oldItem = self.currentItem;
				self.currentItem = newItem;
				// TODO: 临时,稍候将调整
				setTimeout(function() {
					self.disposeImage();
					self.mask.style.display = 'none';
				}, 600);
			}, 25);
		},
		//上一张图片
		prev: function() {
			var self = this;
			self.mask.style.display = 'block';
			self.index--;
			var newItem = self.createImage(self.index, 'left');
			setTimeout(function() {
				self.currentItem.classList.remove('mui-imageviewer-item-center');
				self.currentItem.classList.add('mui-imageviewer-item-right');
				newItem.classList.remove('mui-imageviewer-item-left');
				newItem.classList.add('mui-imageviewer-item-center');
				self.oldItem = self.currentItem;
				self.currentItem = newItem;
				// TODO: 临时,稍候将调整
				setTimeout(function() {
					self.disposeImage();
					self.mask.style.display = 'none';
				}, 600);
			}, 25);
		},
		//释放不显示的图片
		disposeImage: function(all) {
			var sel = '.mui-imageviewer-item-left,.mui-imageviewer-item-right';
			if (all) sel += ",.mui-imageviewer-item";
			var willdisposes = $(sel);
			willdisposes.each(function(i, item) {
				if (item.parentNode && item.parentNode.removeChild)
					item.parentNode.removeChild(item, true);
			});
		},
		//创建一个图片
		createImage: function(index, type) {
			var self = this;
			type = type || 'center';
			if (index < 0) index = self.images.length - 1;
			if (index > self.images.length - 1) index = 0;
			self.index = index;
			var item = $.dom("<div class='mui-imageviewer-item'></div>")[0];
			item.appendChild($.dom('<span><img src="' + self.images[self.index].src + '"/></span>')[0]);
			item.classList.add('mui-imageviewer-item-' + type);
			self.viewer.appendChild(item);
			self.state.innerText = (self.index + 1) + "/" + self.images.length;
			//重置初始缩放比例
			self.scaleValue = 1;
			self.dragX = 0;
			self.dragY = 0;
			return item;
		}
	});

	$.imageViewer = function(selector, options) {
		return new ImageViewer(selector, options);
	};

	$.ready(function() {
		$.imageViewer('.' + imageClassName);
	});
}(mui, document));