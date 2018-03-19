/**
 * 思路：
 * 1、画背景：背景圆，背景数字，背景刻度点
 * 2、画时针，分针，秒针，中心点
 * 3、让指针针动起来
 * 4、实现按比例适配动态画布大小
 */

var clock = document.getElementById("clock")
var ctx = clock.getContext('2d')
// 画布宽高
var width = clock.width;
var height = clock.height;
// 背景圆的半径
var r = clock.width / 2;
// 和基准（width300）设计的比例
var rem = width / 300

// 画背景
function drawBackground() {
    // 先保存基础点为左上角的状态
    ctx.save()
    // 把基础点定义为圆心位置
    ctx.translate(r, r)
    // 画背景圆
    ctx.beginPath()
    ctx.lineWidth = 10 * rem
    ctx.arc(0, 0, r - 5 * rem, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()

    // 小时数组（从3开始时因为画圆的基础点从3的位置开始）
    var hourNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]
    // 设置文本字体和居中
    ctx.font = 18 * rem + 'px arial'
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    hourNumbers.forEach(function (num, i) {
        // 计算小时数字坐标
        var rad = 2 * Math.PI / 12 * i
        var x = Math.cos(rad) * (r - 30 * rem)
        var y = Math.sin(rad) * (r - 30 * rem)
        // 填充文本
        ctx.fillText(num, x, y);
    })

    for (var i = 0; i < 60; i++) {
        // 计算分针刻度坐标
        var rad = 2 * Math.PI / 60 * i
        var x = Math.cos(rad) * (r - 18 * rem)
        var y = Math.sin(rad) * (r - 18 * rem)
        // 画分针刻度
        ctx.beginPath()
        // 小时刻度为黑色，其他刻度为灰色
        ctx.fillStyle = i % 5 === 0 ? "#000" : "#ccc"
        ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}

/**
 * 画时针
 * @param {number} hour 小时数
 * @param {number} min 分针数
 */
function drawHour(hour, min) {
    // 保存画时针之前的未旋转状态
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 10 * rem
    ctx.lineCap = "round"
    // 计算所需旋转弧度并旋转
    var rad = 2 * Math.PI / 12 * hour
    var mrad = 2 * Math.PI / 12 / 60 * min
    ctx.rotate(rad + mrad)
    ctx.moveTo(0, 10 * rem)
    ctx.lineTo(0, -r / 2)
    ctx.stroke()
    // 返回之前保存的未旋转状态
    ctx.restore()
}

/**
 * 画分针
 * @param {number} min 分针数
 */
function drawMinute(min) {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 6 * rem
    ctx.lineCap = "round"
    var rad = 2 * Math.PI / 60 * min
    ctx.rotate(rad)
    ctx.moveTo(0, 10 * rem)
    ctx.lineTo(0, -r + 42 * rem)
    ctx.stroke()
    ctx.restore()
}

/**
 * 画秒针
 * @param {number} sec 秒针数
 */
function drawSecond(sec) {
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = "#c14543"
    var rad = 2 * Math.PI / 60 * sec
    ctx.rotate(rad)
    ctx.moveTo(-2 * rem, 20 * rem)
    ctx.lineTo(2 * rem, 20 * rem)
    ctx.lineTo(1 * rem, -r + 18 * rem)
    ctx.lineTo(-1 * rem, -r + 18 * rem)
    ctx.fill()
    ctx.restore()
}

// 画中心点
function drawDot() {
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(0, 0, 3 * rem, 0, 2 * Math.PI)
    ctx.fill()
}

// 重绘方法
function draw() {
    ctx.clearRect(0, 0, width, height)
    // 用下面这个方法清楚画布，不行，为什么？
    // ctx.width = ctx.width
    var now = new Date()
    var hour = now.getHours()
    var min = now.getMinutes()
    var sec = now.getSeconds()
    drawBackground()
    drawHour(hour, min)
    drawMinute(min)
    drawSecond(sec)
    drawDot()
    ctx.restore()
}

// 初始化先重绘一次
draw()
// 走你
setInterval(draw, 1000)