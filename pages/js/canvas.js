$(function() {
  var pointY = 42;
  switch (Swindth) {
    case 1024:
      $(".animation").css({ transform: "scale(0.52) translateX(-240px)" });
      break;
    case 1280:
      $(".animation").css({ transform: "scale(0.65) translateX(-110px)" });
      break;
    case 1366:
      $(".animation").css({ transform: "scale(0.7) translateX(-70px)" });
      break;
    case 1440:
      $(".animation").css({ transform: "scale(0.74) translateX(-32px)" });
      break;
    case 1600:
      $(".animation").css({ transform: "scale(0.82) translateX(0px)" });
      break;
    case 1680:
      $(".animation").css({ transform: "scale(0.86) translateX(0px)" });
      break;
    case 1920:
      $(".animation").css({ transform: "scale(0.98) translateX(0px)" });
      break;
  }
  $("#loudou_hype_container").css({ transform: "scale(" + ((Swindth / 3840) * 7) / 5 + ")" });
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var offCanvas = document.createElement("canvas");
  var offContext = offCanvas.getContext("2d");
  var pointY0 = pointY + 141;
  var halfWidth = 390;
  var lines = [
    {
      start: {
        x: canvas.width / 2,
        y: pointY
      },
      end: {
        x: canvas.width / 2,
        y: pointY + 36
      }
    },
    {
      start: {
        x: canvas.width / 2,
        y: pointY + 36 + 130
      },
      end: {
        x: canvas.width / 2,
        y: pointY + 36 + 130 + 22
      }
    },
    {
      start: {
        x: canvas.width / 2 - 190,
        y: pointY0
      },
      end: {
        x: canvas.width / 2 - 190 - halfWidth,
        y: pointY0
      }
    },
    {
      start: {
        x: canvas.width / 2 - 190 - halfWidth,
        y: pointY0
      },
      end: {
        x: canvas.width / 2 - 190 - halfWidth,
        y: pointY0 + 46
      }
    },
    {
      start: {
        x: canvas.width / 2 + 190,
        y: pointY0
      },
      end: {
        x: canvas.width / 2 + 190 + halfWidth,
        y: pointY0
      }
    },
    {
      start: {
        x: canvas.width / 2 + 190 + halfWidth,
        y: pointY0
      },
      end: {
        x: canvas.width / 2 + 190 + halfWidth,
        y: pointY0 + 46
      }
    }
  ];
  var points = [
    {
      x: canvas.width / 2,
      y: pointY
    },
    {
      x: canvas.width / 2,
      y: pointY + 36 + 130 + 22
    },
    {
      x: canvas.width / 2 - 190 - halfWidth,
      y: pointY0 + 46
    },
    {
      x: canvas.width / 2 + 190 + halfWidth,
      y: pointY0 + 46
    }
  ];
  var imgs = {
    down: {
      src: "./canvas/down.png"
    },
    left: {
      src: "./canvas/left.png"
    },
    right: {
      src: "./canvas/right.png"
    },
    shortDown: {
      src: "./canvas/shortDown.png"
    }
  };

  var event0 = (function() {
    var listCache = {},
      listen,
      trigger,
      remove;

    listen = function(key, fn) {
      if (!listCache[key]) {
        listCache[key] = [];
      }
      listCache[key].push(fn);
    };

    trigger = function() {
      var key = Array.prototype.shift.call(arguments),
        fns = listCache[key];
      if (!fns || !fns.length) {
        return;
      }
      for (var i = 0, len = fns.length; i < len; i++) {
        fns[i].apply(this, arguments);
      }
    };

    remove = function(key, fn) {
      var fns = listCache[key];
      if (!fns) {
        return false;
      }
      if (!fn) {
        fns && (fns.length = 0);
      } else {
        for (var i = 0, len = fns.length; i < len; i++) {
          var _fn = fns[i];
          if (_fn === fn) {
            fns.splice(i, 1);
          }
        }
      }
    };

    return {
      listen: listen,
      trigger: trigger,
      remove: remove
    };
  })();

  /**
   * 预加载图片
   * @param images 期待数据格式{ img1:{src:''},img2:{src:''} }
   * @param callback
   */
  function loadImage(images, callback) {
    //加载完成图片的计数器
    var count = 0;
    //全部图片加载成功的标志位
    var success = true;
    //每个图片的ID生成
    var __id = 0;

    for (var key in images) {
      if (!images.hasOwnProperty(key)) continue;
      var item = images[key];
      count++;
      item.id = "_img_" + key + getId();
      item.img = new Image();
      doLoad(item);
    }

    function doLoad(item) {
      item.status = "loading";
      var img = item.img;

      img.onload = function() {
        item.status = "loaded";
        done();
      };
      img.onerror = function() {
        success = false;
        item.status = "error";
        done();
      };
      img.src = item.src;

      /*
       * 每张图片加载完成的回调函数
       * */
      function done() {
        img.onload = img.onerror = null;
        if (!--count) {
          callback(success);
        }
      }
    }

    function getId() {
      return ++__id;
    }
  }
  /**
   * 创造离屏canvas
   * @param img
   */
  function callback() {
    lineMove(
      context,
      [
        {
          line: lines[0],
          img: imgs["down"].img,
          bool: true
        }
      ],
      1000,
      step2
    );

    function step2() {
      var line1 = {
        start: {
          x: canvas.width / 2,
          y: pointY + 36 + 130
        },
        //这里让中线第二段动画执行3/4；
        end: {
          x: canvas.width / 2,
          y: pointY + 36 + 130 + (22 * 3) / 4
        }
      };
      lineMove(
        context,
        [
          {
            line: line1,
            img: imgs["down"].img,
            bool: true
          },
          {
            line: lines[2],
            img: imgs["left"].img
          },
          {
            line: lines[4],
            img: imgs["right"].img
          }
        ],
        2000,
        step3
      );
    }

    function step3() {
      var line1 = {
        start: {
          x: canvas.width / 2,
          y: pointY + 36 + 130 + (22 * 3) / 4
        },
        //这里让中线第二段动画执行1/4；
        end: {
          x: canvas.width / 2,
          y: pointY + 36 + 130 + 22
        }
      };
      var line2 = {
        start: {
          x: canvas.width / 2 - 190 - halfWidth,
          y: pointY0
        },
        end: {
          x: canvas.width / 2 - 190 - halfWidth - imgs["left"].img.width,
          y: pointY0
        }
      };
      var line4 = {
        start: {
          x: canvas.width / 2 + 190 + halfWidth,
          y: pointY0
        },
        end: {
          x: canvas.width / 2 + 190 + halfWidth + imgs["right"].img.width,
          y: pointY0
        }
      };

      lineMove(
        context,
        [
          {
            line: line1,
            img: imgs["down"].img,
            bool: true,
            cut: {
              x: canvas.width / 2,
              y: pointY + 36 + 130
            }
          },
          {
            line: lines[3],
            img: imgs["down"].img,
            bool: true
          },
          {
            line: lines[5],
            img: imgs["down"].img,
            bool: true
          }
        ],
        800,
        callback
      );
    }
  }
  loadImage(imgs, callback);

  //画背景图
  var bg = function(context, lines, points) {
    function drawLine(line) {
      context.beginPath();
      context.moveTo(line.start.x, line.start.y);
      context.lineTo(line.end.x, line.end.y);
      context.stroke();
      context.closePath();
    }

    function drawPoint(point) {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2, false);
      context.fill();
    }
    context.save();
    context.strokeStyle = "#65fff1";
    context.fillStyle = "#65fff1";
    context.lineWidth = 2;
    for (var j = 0, len = points.length; j < len; j++) {
      drawPoint(points[j]);
    }
    for (var i = 0, len = lines.length; i < len; i++) {
      drawLine(lines[i]);
    }

    context.restore();
  };

  var lineMove = function(context, arry, time, callback) {
    var lastTime = +new Date();
    var temline = [];
    var line = {};

    for (var i = 0, len = arry.length; i < len; i++) {
      line.sx = arry[i].line.start.x;
      line.sy = arry[i].line.start.y;
      line.dx = arry[i].line.end.x - arry[i].line.start.x;
      line.dy = arry[i].line.end.y - arry[i].line.start.y;
      line.angle = (180 * Math.atan2(line.dy, line.dx)) / Math.PI;
      line.img = arry[i].img;
      line.num = arry[i].num;
      line.bool = arry[i].bool;
      line.cut = arry[i].cut;

      temline.push($.extend(true, {}, line));
    }

    //用于绘制单独的point
    function drawPoint(obj, percent) {
      var x = obj.dx * percent;
      var y = obj.dy * percent;
      var res = {};
      switch (obj.angle) {
        case 0: //right
          res.x = x + obj.sx - obj.img.width + 8;
          res.y = y + obj.sy - obj.img.height / 2;
          break;
        case 90: //down
          res.x = x + obj.sx - obj.img.width / 2;
          res.y = y + obj.sy - obj.img.height + 8;
          break;
        case 180: //left
          res.x = x + obj.sx - 8;
          res.y = y + obj.sy - obj.img.height / 2;
          break;
      }
      if (obj.bool !== undefined) {
        cutPic(obj);
      } else {
        context.drawImage(obj.img, res.x, res.y);
      }

      function cutPic(obj, angle) {
        offCanvas.setAttribute("width", obj.img.width);
        offCanvas.setAttribute("height", obj.img.height);
        offContext.drawImage(obj.img, 0, 0);
        var cx = obj.sx - res.x;
        var cy = obj.sy - res.y;
        if (obj.cut !== undefined) {
          //如果cut点不为undefined的话就用配置好的cut，为undefined就用运动起始点
          cx = obj.cut.x - res.x;
          cy = obj.cut.y - res.y;
        }
        switch (obj.angle) {
          case 0: //right
            offContext.clearRect(0, 0, cx, obj.img.height);
            break;
          case 90: //down
            offContext.clearRect(0, 0, obj.img.width, Math.floor(cy));
            break;
          case 180: //left
            offContext.clearRect(0, 0, cx, obj.img.height);
            break;
        }
        var imgData = offContext.getImageData(0, 0, offCanvas.width, offCanvas.height);

        context.putImageData(imgData, res.x + 1, res.y);
      }
    }

    function move() {
      var now = +new Date();
      var percent = (now - lastTime) / time;
      if (percent < 1) {
        window.requestAnimationFrame(move);
      } else {
        if (callback) callback();
      }

      //清空画布
      context.clearRect(0, 0, canvas.width, canvas.height);

      //绘制运动部分线条
      for (var i = 0, len = temline.length; i < len; i++) {
        context.save();
        drawPoint(temline[i], percent);
        context.restore();
      }

      //重绘背景
      bg(context, lines, points);
    }
    move();
  };
});
