//该组件依赖于jquery,加载该组件之前请先引入jquery文件

//深拷贝函数
function ObjCopy(obj) {
	var tmp_obj = {};
	for (var i in obj) {
		if (typeof obj[i] != 'object') {
			tmp_obj[i] = obj[i];
		} else if (obj[i] instanceof Array) {
			tmp_obj[i] = [];
			for (var j in obj[i]) {
				if (typeof obj[i][j] != 'object') {
					tmp_obj[i][j] = obj[i][j];
				} else {
					tmp_obj[i][j] = ObjCopy(obj[i][j]);
				}
			}
		} else {
			tmp_obj[i] = ObjCopy(obj[i]);
		}
	}
	return tmp_obj;
}

//slider对象
function Slider(dom) {
	//保存this变量，方便内部使用
	var _this = this;
	_this._dom = dom;
	//模拟jqeury事件委托，建立堆栈
	_this._handles1 = [];
	_this._handles2 = [];
	//slider设置函数
	_this.setOptin = function(option) {
		//setOption参数必须为obj类型
		if (option.toString() != '[object Object]') {
			throw new Error('please set a true option!');
		}
		//保存参数，避免修改实参
		var _option = ObjCopy(option);
		//option类型默认值
		_option.type = _option.type || 'normal';
		//根据默认值判断滑块类型，normal为数值类型，block为块级类型
		if (_option.type == 'normal') {
			console.log('it\'s a normal slider!');
			//设置滑块分段必须大于2
			if (!_option.class || _option.class.length < 2) {
				throw new Error('Option must have a class property, and class\'s length must be greater than 2!')
			}
			//排序滑块分段数值
			_option.class.sort(function(a, b) {
				return a.num > b.num;
			})
			//不允许滑块分段数值有两个相同值
			_option.class.sort(function(a, b) {
				if(a.num == b.num) {
					throw new Error('Num can not be the same size!')
				}
				return a.num > b.num;
			})
			
			//slider样式加载
			$(_this._dom).addClass('slider1');
			
			//重置组件内容
			$(_this._dom).html('');
			
			// 正式添加dom节点以及绑定事件
			var block_html = document.createElement('div');
			for(var i = 0; i < _option.class.length; i++) {
				var div = document.createElement('div');
				block_html.appendChild(div);
			}
			_this._dom.appendChild(block_html);
			
			for(var i = 0; i < _option.class.length; i++) {
				$(_this._dom).find('div > div').eq(i).css('background', _option.class[i].color);
			}
			_SetSlider(_option);
//			内部函数重置滑块事件
			function _SetSlider(s_option) {
				$(_this._dom).find('div > div').html('<span></span><em></em>');
				$(_this._dom).find('div > div:last-child').html('');
				
				for (var i = 0; i < s_option.class.length; i++) {
					$(_this._dom).find('div > div').eq(i).find('em').text(s_option.class[i].num);
					if(i) {
						$(_this._dom).find('div > div').eq(i).css('width', ((s_option.class[i].num - s_option.class[i-1].num) / s_option.class[s_option.class.length - 1].num) * 100 + '%');
					} else {
							$(_this._dom).find('div > div').eq(i).css('width', (s_option.class[i].num / s_option.class[s_option.class.length - 1].num) * 100 + '%');
						}
				}
			}
			
			
			//添加事件
			_this.mouseDwonHandler = function(event) {
				if(event.target.nodeName == 'SPAN') {
					//保存滑块布局位置
					var _this_left = $(_this._dom).offset().left;
					var span_this = event.target;
					var _index = $(span_this).parent().index();
					$(window).on('mousemove', function(e) {
						var num = Math.round((e.pageX - _this_left) / $(_this._dom).width() * _option.class[_option.class.length - 1].num);
						
						if (!_index && num < 1 || num >= _option.class[_index + 1].num) {
							
						} else if (_index && num <= _option.class[_index - 1].num || num >= _option.class[_index + 1].num) {
							
						} else {
							_option.class[_index].num = num;
							_SetSlider(_option);
						}
					})
					$(window).on('mouseup', function() {
						$(window).unbind('mousemove');
					})
				}
			};
			_this._handles1.forEach(function(v, i) {
				_this._dom.removeEventListener('mousedown', v, false);
			})
			_this._handles1.push(_this.mouseDwonHandler);
			_this._dom.addEventListener('mousedown', _this.mouseDwonHandler, false);
			
		} else if (_option.type == 'block') {
			console.log('it\'s a block slider!');
			if (!_option.class || _option.class.length < 2) {
				throw new Error('Option must have a class property, and class\'s length must be greater than 2!')
			}
			_option.class.sort(function(a, b) {
				return a.num > b.num;
			})
			_option.class.sort(function(a, b) {
				if(a.num == b.num) {
					throw new Error('Num can not be the same size!')
				}
				return a.num > b.num;
			})
			
			$(_this._dom).addClass('slider2');
			
			$(_this._dom).html('');
			
			// 正式添加dom节点以及绑定事件
			var block_html = document.createElement('div');
			for(var i = 0; i < _option.class.length; i++) {
				var div = document.createElement('div');
				block_html.appendChild(div);
			}
			_this._dom.appendChild(block_html);
			
			for(var i = 0; i < _option.class.length; i++) {
				$(_this._dom).find('div > div').eq(i).css('background', _option.class[i].color);
			}
			_SetSlider(_option);
//			内部函数重置滑块事件
			function _SetSlider(s_option) {
				$(_this._dom).children('div').children('div').html('<span></span>');
				$(_this._dom).children('div').children('div:last-child').html('');
				
				for (var i = 0; i < s_option.class[s_option.class.length-1].num; i++) {
					for(var j = 0; j < s_option.class.length; j++) {
						if(i < s_option.class[j].num) {
							$(_this._dom).children('div').children('div').eq(j).append($('<div>' + (i + 1) + '</div>'));
							break;
						}
					}
				}
			}
			
			
			//添加事件
			_this.mouseDwonHandler2 = function() {
				if(event.target.nodeName == 'SPAN') {
					var _this_left = $(_this._dom).offset().left;
					var span_this = event.target;
					var _index = $(span_this).parent().index();
					$(window).on('mousemove', function(e) {
						var num = Math.round((e.pageX - _this_left) / parseInt($(_this._dom).find('div > div > div').css('width')));
						if (!_index && num < 1 || num >= _option.class[_index + 1].num) {
							
						} else if (_index && num <= _option.class[_index - 1].num || num >= _option.class[_index + 1].num) {
							
						} else {
							_option.class[_index].num = num;
							_SetSlider(_option);
						}
					})
					$(window).on('mouseup', function() {
						$(window).unbind('mousemove');
					})
				}
			};

			_this._handles2.forEach(function(v, i) {
				_this._dom.removeEventListener('mousedown', v, false);
			})
			_this._handles2.push(_this.mouseDwonHandler2);
			_this._dom.addEventListener('mousedown', _this.mouseDwonHandler2, false);

		} else {
			throw new Error('please set a true option!');
		}
	}
}

//slider接口
window.slider = {
	init: function(dom) {
		if (!dom) {
			throw new Error('dom is not find!');
		}
		return new Slider(dom);
	}
}

/* option基础模型(该模型初始值都为0)
 * type:类型，normal为普通滑块类型，block为分块滑块，默认值为normal
 * class:根据num来进行分级，如果num出现一致，则初始化失败,每个区块有单独的颜色配置，最大值为上限，不设置max,min的原因在于每个区间可以自定义颜色
 * 默认两个滑块不能重叠和超出，距离至少为1
 * option = {
 * 		type: 'normal/block',
 * 		class: [
 * 			{
 * 				color: #fff,
 * 				num: 10
 * 			},...
 * 		]
 * }
 * */