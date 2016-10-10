function fixTime(date, interval) { //interval间隔秒数
	var minutes = date.format("mm", 0);
	var latelyMin = minutes - (minutes % (interval / 60));
	latelyMin < 10 ? (latelyMin = "0" + latelyMin) : latelyMin;
	var latelyTime = new Date(date).format("YYYY/MM/DD hh:" + latelyMin, 0)
	return new Date(latelyTime).getTime();
};

$(function() {
	
	var timer, timer2;
	var timer = setInterval(function() {
		var now = new Date();
		var date = new Date(fixTime(now, 15 * 60)).format("YYYY-MM-DD", 0);
		var time = new Date(fixTime(now, 15 * 60)).past("hh:mm", (1 / 24) * (45 / 60), 0);
		$(".lastUpdateTime>span").html(date);
		$(".lastUpdateTime>em").html(time);
		var difference = (15 * 60 * 1000) - (((now.format("mm", 0) % 15) * 60 * 1000 + now.format("ss", 0) * 1000));
	
		function differenceTime(dif) {
			var ss = Math.ceil((dif % (60 * 1000)) / 1000);
			var mm;
			if (ss == 0) {
				mm = Math.ceil(((dif - ss * 100) / 60) / 1000);
			} else {
				mm = Math.ceil(((dif - ss * 100) / 60) / 1000) - 1;
			}
			if (mm == -1) {
				mm = 15;
			}
			return "00:" + zeroize(mm) + ":" + zeroize(ss);
		};
		//剩余刷新时间
		difference -= 1000;
		$(".nextUpdateTime>span").html(differenceTime(difference));
	}, 1000)
})