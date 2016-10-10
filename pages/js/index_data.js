//index界面数据处理文件

//缓存用户数数据(2/3/4G)
var active_user_num = [0, 0, 0];
//2/3/4G请求是否完成flag,只有全部渲染完成，才会执行饼状图渲染
var flag2 = false;
var flag3 = false;
var flag4 = false;
var circle_init = [];
var circle_init2 = [];
//初始化饼状图默认配置项
var pie_option = {
	tooltip: {
		trigger: 'item',
		formatter: "{d}%",
		textStyle: {
			fontSize: 0.18 * REM,
			fontFamily: 'HelveticaNeueLTStd-Lt',
			color: '#c8fef9'
		}
	},
	color: ['#8d5e9e', '#52c7ac', '#5191c7'],
	title: {
		text: '用户数',
		left: 'center',
		top: 0.1 * REM,
		textStyle: {
			color: '#c8fef9',
			fontSize: 0.2 * REM,
			fontFamily: '方正兰亭',
			fontWeight: 'normal'
		}
	},
	series: [{
		name: '访问来源',
		type: 'pie',
		radius: ['45%', '65%'],
		hoverAnimation: false,
		avoidLabelOverlap: false,
		legendHoverLink: true,
		center: ['50%', '60%'],
		itemStyle: {
			normal: {
				borderColor: '#16191b',
				borderWidth: 0.03 * REM,
			}
		},
		labelLine: {
			normal: {
				show: false
			}
		},
		data: null
	}]
};
//初始化折线图默认配置项
var line_option = {
	tooltip: {
		trigger: 'axis',
		//		formatter: '{b}<br/>{c}',
		formatter: function(params) {
			if(params[0].data !== '') {
				return `${params[0].name}<br/>${params[0].data}`;
			}
		},
		textStyle: {
			fontSize: 0.18 * REM,
			fontFamily: 'HelveticaNeueLTStd-Lt',
		}
	},
	grid: {
		//		left: -0.15 * (140 - REM),
		left: -10,
		right: 0.25 * REM,
		bottom: -14 + 0.1 * REM,
		top: 0.825 * REM,
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		boundaryGap: false,
		data: null,
		axisLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		axisLabel: {
			show: false
		}
	}],
	yAxis: [{
		type: 'value',
		axisLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		axisLabel: {
			show: false
		},
		splitLine: {
			show: false
		}
	}],
	series: [{
		type: 'line',
		lineStyle: {
			normal: {
				color: 'rgba(67, 168, 161, 1)'
			}
		},
		symbol: 'none',
		areaStyle: {
			normal: {
				color: 'rgba(67, 168, 161, 0.2)'
			}
		},
		data: null
	}]
};

/**
 * 渲染折线图
 * @param {String} type 刷新折线图类型（'2/3/4G'）
 * @param {Object} data 需要渲染的数据
 */
function SetLineOption(type, data) {
	var option = ObjCopy(line_option);
	var time_data = [];
	var user_data = [];
	var up_or_down = 0;
	var line = null;
	var _dom = null;
	data.data.forEach(function(v, i) {
		time_data.push(new Date(v.startTime).format('hh:mm', 0));
		user_data.push(v.value);
	});
	if(data.data.length < 96) {
		var temp = new Array(96 - data.data.length);
		for(var i = 0; i < 96 - data.data.length; i++) {
			temp[i] = '';
		}
		time_data = time_data.concat(temp);
		user_data = user_data.concat(temp);
	}
	option.xAxis[0].data = time_data;
	option.series[0].data = user_data;
	switch(type) {
		case '2G':
			option.series[0].lineStyle.normal.color = 'rgba(141, 94, 158, 0.8)';
			option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(141, 94, 158, 0.2)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(141, 94, 158, 0.1)' // 100% 处的颜色
			}], false);
			line = echarts.init(document.getElementsByClassName('user2')[0]);
			_dom = $('.user_violet > .font_chart');
			break;
		case '3G':
			option.series[0].lineStyle.normal.color = 'rgba(81, 145, 199, 0.8)';
			option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(81, 145, 199, 0.2)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(81, 145, 199, 0.1)' // 100% 处的颜色
			}], false);
			line = echarts.init(document.getElementsByClassName('user3')[0]);
			_dom = $('.user_blue > .font_chart');
			break;
		case '4G':
			option.series[0].lineStyle.normal.color = 'rgba(82, 199, 172, 0.8)';
			option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(82, 199, 172, 0.2)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(82, 199, 172, 0.1)' // 100% 处的颜色
			}], false);
			line = echarts.init(document.getElementsByClassName('user4')[0]);
			_dom = $('.user_green > .font_chart');
			break;
		default:
			console.error('SetLineOption params is error!');
			break;
	}
	_dom.find('font').text(formatNumber(data.data[data.data.length - 1].value));
	_dom.find('span').removeClass('up').removeClass('down');
	if(data.data.length <= 1) {
		up_or_down = 0;
		_dom.find('span').addClass('up');
	} else if(data.data[data.data.length - 1].value >= data.data[data.data.length - 2].value) {
		up_or_down = round((data.data[data.data.length - 1].value - data.data[data.data.length - 2].value) / data.data[data.data.length - 2].value * 100, 2);
		_dom.find('span').addClass('up');
	} else {
		up_or_down = round((data.data[data.data.length - 2].value - data.data[data.data.length - 1].value) / data.data[data.data.length - 2].value * 100, 2);
		_dom.find('span').addClass('down');
	}
	_dom.find('span').html(`<i></i>${up_or_down}%`);
	option.tooltip.formatter = function(params) {
		if(params[0].data !== '') {
			return `${params[0].name}<br/>${params[0].data}(人)`;
		}
	}
	line.setOption(option, true);
}

/**
 * 渲染折线图
 * @param {String} type 刷新折线图类型（'2/3/4G'）
 * @param {Object} data 需要渲染的数据
 */
function SetFlowerOption(type, data) {
	var option = ObjCopy(line_option);
	var time_data = [];
	var user_data = [];
	var up_or_down = 0;
	var line = null;
	var _dom = null;
	data.data.forEach(function(v, i) {
		time_data.push(new Date(v.startTime).format('hh:mm', 0));
		user_data.push(v.value);
	});
	if(data.data.length < 96) {
		var temp = new Array(96 - data.data.length);
		for(var i = 0; i < 96 - data.data.length; i++) {
			temp[i] = '';
		}
		time_data = time_data.concat(temp);
		user_data = user_data.concat(temp);
	}
	option.xAxis[0].data = time_data;
	option.series[0].data = user_data;
	switch(type) {
		case '4G':
			line = echarts.init(document.getElementsByClassName('flower4')[0]);
			_dom = $('.flower_first > .font_chart');
			break;
		case '3G':
			line = echarts.init(document.getElementsByClassName('flower3')[0]);
			_dom = $('.flower_last > .font_chart');
			break;
		default:
			console.error('SetLineOption params is error!');
			break;
	}
	option.series[0].lineStyle.normal.color = 'rgba(67, 168, 161, 0.8)';
	option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0.1)' // 100% 处的颜色
	}], false);
	option.grid.right = 0.3 * REM;
	_dom.find('font').text(formatNumber(data.data[data.data.length - 1].value));
	_dom.find('span').removeClass('up').removeClass('down');
	if(data.data.length <= 1) {
		_dom.find('span').addClass('up');
		_dom.find('span').html(`<i></i>0%`);
	} else if(data.data[data.data.length - 1].value >= data.data[data.data.length - 2].value) {
		up_or_down = round((data.data[data.data.length - 1].value - data.data[data.data.length - 2].value) / data.data[data.data.length - 2].value * 100, 2);
		_dom.find('span').addClass('up');
		_dom.find('span').html(`<i></i>${up_or_down}%`);
	} else {
		up_or_down = round((data.data[data.data.length - 2].value - data.data[data.data.length - 1].value) / data.data[data.data.length - 2].value * 100, 2);
		_dom.find('span').addClass('down');
		_dom.find('span').html(`<i></i>${up_or_down}%`);
	}
	option.tooltip.formatter = function(params) {
		if(params[0].data !== '') {
			return `${params[0].name}<br/>${params[0].data}(GB)`;
		}
	}
	line.setOption(option, true);
}

/**
 * 渲染底部折线图
 * @param {Object} data 需要渲染的数据
 */
function SetBottomOption(data) {
	$('.foot_line').removeClass('line_show');
	//重置折线图
	$('.data_line').html('');
	data.data.forEach(function(v, i) {
		var _dom = $('.foot_line').eq(i);
		var option = ObjCopy(line_option);
		var up_or_down = 0;
		var time_data = [];
		var user_data = [];
		var data_arr = v.kqiArray;
		var unit = null;
		var line = echarts.init(document.getElementsByClassName('data_line')[i]); //循环初始化各位置
		option.series[0].lineStyle.normal.color = 'rgba(67, 168, 161, 0.8)';
		option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			offset: 0,
			color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
		}, {
			offset: 1,
			color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
		}], false);
		data_arr.forEach(function(vv, ii) {
			time_data.push(new Date(vv.startTime).format('hh:mm', 0));
			user_data.push(vv.value);
		})
		if(data_arr.length < 96) {
			var temp = new Array(96 - data.data.length);
			for(var j = 0; j < 96 - data.data.length; j++) {
				temp[j] = '';
			}
			time_data = time_data.concat(temp);
			user_data = user_data.concat(temp);
		}
		option.xAxis[0].data = time_data;
		option.series[0].data = user_data;
		option.grid.top = 0.5 * REM;
		option.grid.bottom = -20;
		line.setOption(option, true);
		_dom.addClass('line_show');
		_dom.find('.line_name').text(v.describle);
		if(/频次/.test(v.describle)) {
			unit = '次数/每分钟';
		} else if(/时延/.test(v.describle)) {
			unit = 'ms';
		} else if(/速率/.test(v.describle)) {
			unit = 'Kbps';
		} else {
			unit = '%';
		}
		_dom.find('.line_last').text(v.kqiArray[v.kqiArray.length - 1].value + unit);
		var grade = null;
		switch(data_arr[data_arr.length - 1].thresholdStatu) {
			case 0:
				grade = '优';
				break;
			case 1:
				grade = '良';
				break;
			case 2:
				grade = '中';
				break;
			case 3:
				grade = '差';
				break;
			default:
				break;
		}
		_dom.find('.line_last').removeClass().addClass('line_last').addClass(`grade${v.kqiArray[v.kqiArray.length - 1].thresholdStatu}`);
		_dom.find('.line_grade').text(grade);
		if(data_arr.length <= 1 || data_arr[data_arr.length - 2].value == 0) {
			up_or_down = 0;
			_dom.find('.font_chart_up_down').addClass('up');
		} else if(data_arr[data_arr.length - 1].value >= data_arr[data_arr.length - 2].value) {
			up_or_down = round((data_arr[data_arr.length - 1].value - data_arr[data_arr.length - 2].value) / data_arr[data_arr.length - 2].value * 100, 2);
			_dom.find('.font_chart_up_down').addClass('up');
		} else {
			up_or_down = round((data_arr[data_arr.length - 2].value - data_arr[data_arr.length - 1].value) / data_arr[data_arr.length - 2].value * 100, 2);
			_dom.find('.font_chart_up_down').addClass('down');
		}
		_dom.find('.font_chart_up_down').html(`<i></i>${up_or_down}%`);
	});
}

/**
 * 渲染饼状图
 */
function SetPieOption() {
	pie_option.series[0].data = active_user_num;
	var pie = echarts.init(document.getElementsByClassName('user_pie')[0]);
	pie.setOption(pie_option, true);
}

/**
 * 环形进度条渲染
 * @param {Object} index 当前渲染环形进度条index
 * @param {Object} data	渲染数据
 */
function SetACircle(index, data) {
	var _dom = $('.front_main').eq(index);
	var grade = '';
	var grade_num = data.data.kqi.value / data.data.thresholdValues[3] * 75;
	var grade_color = '#2fc085';
	if(!circle_init[index]) {
		circle_init[index] = _dom.find('.circle_main').radialIndicator({
			radius: 0.75 * REM,
			barWidth: 0.22 * REM,
			roundCorner: true,
			initValue: 75,
			maxValue: 100,
			displayNumber: false,
			barBgColor: 'transparent',
			barColor: '#202b2d'
		}).data('radialIndicator');
	} else {
		circle_init[index].animate(75);
	}
	_dom.find('h4').text(data.data.kqi.describle);
	_dom.find('.circle_data .font_chart').text(data.data.kqi.value);
	switch(true) {
		case data.data.kqi.value >= data.data.thresholdValues[3]:
			grade = '优';
			grade_num = 75;
			break;
		case data.data.kqi.value >= data.data.thresholdValues[2]:
			grade = '优';
			break;
		case data.data.kqi.value >= data.data.thresholdValues[1]:
			grade = '良';
			grade_color = '#4b86b7';
			break;
		case data.data.kqi.value >= data.data.thresholdValues[0]:
			grade = '中';
			grade_color = '#bcb849';
			break;
		default:
			grade = '差';
			grade_color = '#bc5449';
			break;
	}
	_dom.find('.circle_data .circle_grade').text(grade);
	var num1 = data.data.thresholdValues[0] / data.data.thresholdValues[3] * 75;
	var num2 = data.data.thresholdValues[1] / data.data.thresholdValues[3] * 75;
	var num3 = data.data.thresholdValues[2] / data.data.thresholdValues[3] * 75;
	var colors = '{"0" : "#bc5449","' + (num1 - 0.01).toFixed(2) + '":"#bc5449","' + (num1).toFixed(2) + '": "#bcb849","' + (num2 - 0.01).toFixed(2) + '":"#bcb849","' + (num2).toFixed(2) + '": "#4b86b7","' + (num3 - 0.01).toFixed(2) + '":"#4b86b7","' + (num3).toFixed(2) + '": "#2fc085","' + (75).toFixed(2) + '":"#2fc085"}';
	colors = JSON.parse(colors);
	if(!circle_init2[index]) {
		circle_init2[index] = _dom.find('.circle_main2').radialIndicator({
			radius: 0.75 * REM,
			barWidth: 0.22 * REM,
			roundCorner: true,
			initValue: grade_num,
			maxValue: 100,
			displayNumber: false,
			barBgColor: 'transparent',
			barColor: colors
		}).data('radialIndicator');
	} else {
		circle_init2[index].animate(grade_num);
	}
}

/**
 * 展示a面受影响用户数
 * @param {Object} index 需要展示的index
 * @param {Object} data 需要展示的data
 */
function SetAffectedUserNum(index, data) {
	$('.front_bot_l p').eq(index).text(data.data.value);
	$('.back').eq(index).find('.userCount > span').text(data.data.value);
}

/**
 * 展示a面工单数据
 * @param {Object} index 需要展示的index
 * @param {Object} data 需要展示的data
 */
function SetAffectedWorkOrder(index, data) {
	var _dom = $('.front_bot_r ul').eq(index);
	var data_arr = [];
	data.data.forEach(function(v, i) {
		_dom.find('li').eq(v.statuDescrible).find('font').text(v.value);
		data_arr[v.statuDescrible] = v.value;
	});
	$('.back').eq(index).find('.processing > span').text(data_arr[0]);
	$('.back').eq(index).find('.bnsRepaire > span').text(data_arr[1]);
	if(data_arr[0] > data[1]) {
		_dom.find('li').eq(1).find('span').css('width', 0.955 * data_arr[1] / data_arr[0] + 'rem');
	} else {
		_dom.find('li').eq(0).find('span').css('width', 0.955 * data_arr[0] / data_arr[1] + 'rem');
	}
}

/**
 * 设置3/4G告警状态
 * @param {Object} data
 */
function setWarn(data) {
	$('footer ul .font_chart_up_down').removeClass("warn");
	if(data.data.Alert3GValue) {
		$('footer ul .font_chart_up_down').eq(1).addClass('warn');
		$('footer ul .font_chart_up_down').eq(1).find('span').text(data.data.Alert3GValue);
	}
	if(data.data.Alert4GValue) {
		$('footer ul .font_chart_up_down').eq(0).addClass('warn');
		$('footer ul .font_chart_up_down').eq(0).find('span').text(data.data.Alert4GValue);
	}
}

//B面

/**
 * 设置B面大场景用户数
 * @param {Object} data 用户数数据
 */
function setSceneUserNum(data) {
	$('.itemDetail > ul').html('');
	data.data.forEach(function(v, i) {
		var temp = `<li>
			<ul>
				<li class="placeIcon" style="background-image: url(${basePath + "pages/" + v.icon})"></li>
				<li class="placePercent">
					<p><span>${v.senceName}</span></p>
	
					<div class="percent">
						<div class="totalCount">
							<p class="actualCount"></p>
						</div>
	
						<p><span>12</span>/<span>15</span></p>
					</div>
	
					<div class="userCount">
						<p>
							<i></i>
							<span>${v.userNum}</span>
						</p>
					</div>
				</li>
			</ul>
		</li>`;
		$('.itemDetail > ul').append($(temp));
	});
	$('.zdcj .itemDetail .itemDetailUl').css('height', Math.ceil(data.data.length / 2) * 1.09 - 0.4 + 'rem');
	$('.cityMainPlace').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 10,
		verticalDragMaxHeight: 1.2 * REM
	});
	$('.cityMainPlace .scroll_vertical_bar .scroll_drag').html(`共${data.data.length}类`);
	$('.cityMainPlace .scroll_vertical_bar .scroll_drag').css('padding', '0.4rem 0.05rem');
}

/**
 * 设置B面子场景用户数
 * @param {Object} data 子场景用户数数据
 */
function setChildSceneUserNum(data) {
	$('.station > ul').html('');
	data.data.forEach(function(v, i) {
		var temp = `<li data-id="${v.sceneCode}">
			<b class="cancel"></b>
			<div class="stationDetail">
				<div class="stationName">
					<i></i>
					<b style="background-image: url(${basePath + "pages/" + v.icon})"></b>
					<p>${v.sceneName}</p>
				</div>
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount"></p>
					</div>

					<p><span>12</span>/<span>15</span></p>
				</div>
				<div class="userCount">
					<p>
						<i></i>
						<span>${v.userNum}</span>
					</p>
				</div>
			</div>
		</li>`;
		$('.station > ul').append($(temp));
	})
}

/**
 * 网元TOP3用户数
 * @param {Object} data 网元TOP3用户数数据
 */
function setTop3UserNum(data) {
	$('.zdwy .zdwyTop3> table > tbody').html('');
	data.data.forEach(function(v, i) {
		var temp = `<tr>
			<td>${v.netElementName}</td>
			<td>
				<p data-name="${v.netElementCode}">
					<i></i>
					<span>${v.userNum}</span>
				</p>
				<!--占比-->
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount"></p>
					</div>

					<p><span>12</span>/<span>15</span></p>
				</div>
			</td>
		</tr>`;
		$('.zdwy .zdwyTop3> table > tbody').append($(temp));
	})
}

/**
 * 设置B面SP用户数
 * @param {Object} data SP用户数数据
 */
function setSpUserNum(data) {
	$('.media > ul').html('');
	data.data.forEach(function(v, i) {
		var temp = `<li data-id="${v.spCode}">
			<b class="cancel"></b>
			<div class="mediaDetail">
				<div class="mediaName">
					<i></i>
					<b style="background-image: url(${basePath + "pages/" + v.icon})"></b>
					<p>${v.spName}</p>
				</div>
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount"></p>
					</div>

					<p><span>12</span>/<span>15</span></p>
				</div>
				<div class="userCount">
					<p>
						<i></i>
						<span>${v.userNum}</span>
					</p>
				</div>

			</div>
		</li>`;
		$('.media > ul').append($(temp));
	})
}

/**
 * 协议小类用户数
 * @param {Object} data 协议小类用户数
 */
function setProtocalUserNum(data) {
	var num = 0;
	$('.spDetail > ul').html('');
	data.data.forEach(function(v, i) {
		var li = `<li>
			<h5 class="vedioName">
				<i></i>
				<span>${v.bigSpName}</span>
			</h5>
			<ul>
			</ul>
		</li>`;
		li = $(li);
		v.spList.forEach(function(value, index) {
			var temp = `<li data-id="${value.spCode}">
				<span class="newsIcon">
					<i style="background-image: url(${basePath + "pages/" + value.icon})"></i>
				</span>
				<div class="placePercent">
					<p>${value.spName}</p>
					<div class="percent">
						<div class="totalCount">
							<p class="actualCount"></p>
						</div>
						<p><span>12</span>/<span>15</span></p>
					</div>
					<div class="userCount">
						<p>
							<i></i>
							<span>${value.userNum}</span>
						</p>
					</div>
				</div>
			</li>`;
			li.find('ul').append($(temp));
			num++;
		});
		$('.spDetail > ul').append(li);
	});
	$('.zdsp .spDetail> ul').css('height', Math.ceil(data.data.length) * 1.09 - 0.25 + 'rem');
	$('.mainVedio').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 10,
		verticalDragMaxHeight: 1.2 * REM
	});
	$('.mainVedio .scroll_vertical_bar .scroll_drag').html(`共${num}类`);
	$('.mainVedio .scroll_vertical_bar .scroll_drag').css('padding', '0.4rem 0.05rem');
}

/**
 * 处理动画中显示的告警
 * @param {Object} type 判断告警类型
 * @param {Object} data 告警数据
 */
function setAlarmNum(type, data) {
	var _dom = null;
	switch(type) {
		case 0:
			_dom = $('.all_data');
			break;
		case 1:
			_dom = $('.cj_data');
			break;
		case 2:
			_dom = $('.sp_data');
			break;
		case 3:
			_dom = $('.wy_data');
			break;
		default:
			break;
	}
	_dom.find('span').text(formatNumber(data.data));
}

//事件绑定
function EventBind() {
	$(document).off();
	$(document).on('click', 'footer ul li', function(e) {
		$(this).addClass('sel').siblings().removeClass('sel');
		var num = null;
		switch($(this).index()) {
			case 0:
				num = 0;
				break;
			case 1:
				num = 3;
				break;
			case 2:
				num = 4;
				break;
			default:
				num = 0;
				break;
		}
		SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
			ratType: num
		}, function(data) {
			if(data.statuCode === '200') {
				SetBottomOption(data);
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.allNetAlertInformation, {
			importantType: num
		}, function(data) {
			if(data.statuCode === '200') {
				setWarn(data);
			}
		});
	});

	var interval = null;
	$(document).on('click', '.controll', function(e) {
		if($(this).hasClass('play')) {
			$(this).removeClass('play').addClass('stop');
			if(!$('.container').hasClass('flap')) {
				$('.container').removeClass('flap2');
				$('.container').addClass('flap');
				$('.container').css({
					transform: 'rotateY(0deg)'
				})
			} else {
				$('.container').removeClass('flap');
				$('.container').addClass('flap2');
				$('.container').css({
					transform: 'rotateY(180deg)'
				})
			}
			if(interval == null) {
				interval = setInterval(function() {
					if(!$('.container').hasClass('flap')) {
						$('.container').removeClass('flap2');
						$('.container').addClass('flap');
						$('.container').css({
							transform: 'rotateY(0deg)'
						})
					} else {
						$('.container').removeClass('flap');
						$('.container').addClass('flap2');
						$('.container').css({
							transform: 'rotateY(180deg)'
						})
					}
				}, 5000);
			}
		} else {
			$(this).addClass('play').removeClass('stop');
			if(interval) {
				clearInterval(interval);
				interval = null;
			}
		}
	});
}

//页面初始化接口
function PageInit() {
	//重置flag
	flag2 = flag3 = flag4 = false;
	//舆情数据处理
	SEQAjax(window.pageConfig.ajaxUrl.alertInformation, {}, function(data) {
		if(data.statuCode === '200') {
			$('header > .f_left > .information').text(data.data);
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeUserNumber, {
		ratType: '2'
	}, function(data) {
		if(data.statuCode === '200') {
			flag2 = true;
			SetLineOption('2G', data);
			active_user_num[0] = data.data[data.data.length - 1].value;
			if(flag2 && flag3 && flag4) {
				SetPieOption();
			}
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeUserNumber, {
		ratType: '3'
	}, function(data) {
		if(data.statuCode === '200') {
			flag3 = true;
			SetLineOption('3G', data);
			active_user_num[1] = data.data[data.data.length - 1].value;
			if(flag2 && flag3 && flag4) {
				SetPieOption();
			}
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeUserNumber, {
		ratType: '4'
	}, function(data) {
		if(data.statuCode === '200') {
			flag4 = true;
			SetLineOption('4G', data);
			active_user_num[2] = data.data[data.data.length - 1].value;
			if(flag2 && flag3 && flag4) {
				SetPieOption();
			}
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeFlower, {
		ratType: '4'
	}, function(data) {
		if(data.statuCode === '200') {
			flag4 = true;
			SetFlowerOption('4G', data);
			active_user_num[2] = data.data[data.data.length - 1].value;
			if(flag2 && flag3 && flag4) {
				SetPieOption();
			}
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeFlower, {
		ratType: '3'
	}, function(data) {
		if(data.statuCode === '200') {
			flag4 = true;
			SetFlowerOption('3G', data);
			active_user_num[2] = data.data[data.data.length - 1].value;
			if(flag2 && flag3 && flag4) {
				SetPieOption();
			}
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
		ratType: '0'
	}, function(data) {
		if(data.statuCode === '200') {
			SetBottomOption(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantKqi, {
		importantType: '0'
	}, function(data) {
		if(data.statuCode === '200') {
			SetACircle(0, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantKqi, {
		importantType: '1'
	}, function(data) {
		if(data.statuCode === '200') {
			SetACircle(1, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantKqi, {
		importantType: '2'
	}, function(data) {
		if(data.statuCode === '200') {
			SetACircle(2, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedUserNum, {
		importantType: '0'
	}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedUserNum(0, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedUserNum, {
		importantType: '1'
	}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedUserNum(1, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedUserNum, {
		importantType: '2'
	}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedUserNum(2, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedWorkOrder, {
		importantType: '0'
	}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedWorkOrder(0, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedWorkOrder, {
		importantType: '1'
	}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedWorkOrder(1, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedWorkOrder, {
		importantType: '2'
	}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedWorkOrder(2, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.allNetAlertInformation, {}, function(data) {
		if(data.statuCode === '200') {
			setWarn(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneSceneUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setSceneUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneChildSceneUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setChildSceneUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.netElementTop3UserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setTop3UserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneSpUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setSpUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneProtocalUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setProtocalUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 0
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(0, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 1
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(1, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 2
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(2, data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 3
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(3, data);
		}
	});
	EventBind();
}

PageInit();