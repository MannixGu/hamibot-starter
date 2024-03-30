import { gestureTouchPoint } from "./touch";

let { delay } = hamibot.env;
export const delay_time = Number(delay) * 1000;

/**
 * hash函数，6469通过从3967到5591中的质数，算出的最优值，具体可以看评估代码
 * @param string {String} 需要计算hash值的String
 * @return {int} string的hash值
 */
export function get_hash(string) {
	let hash = 0;
	for (let i = 0; i < string.length; i++) {
		hash += string.charCodeAt(i);
	}
	return hash % 6469;
}

/**
 * 检查和设置运行环境
 */
export function check_set_env() {
	// 检查Hamibot版本是否支持ocr
	if (app.versionName < "1.3.1") {
		toast("请将Hamibot更新至v1.3.1版本或更高版本");
		exit();
	}

	//请求横屏截图权限
	threads.start(function () {
		try {
			let beginBtn =
				selector().classNameContains("Button").textContains("START NOW").findOne(delay_time) ??
				selector().classNameContains("Button").textContains("开始").findOne(delay_time) ??
				selector().classNameContains("Button").textContains("允许").findOne(delay_time) ??
				selector().classNameContains("Button").textContains("ALLOW").findOne(delay_time) ??
				selector().classNameContains("Button").textContains("Start now").findOne(delay_time)

			beginBtn?.click();

		} catch (error) { }
	});

	requestScreenCapture(false);
}


export function random_float(l, r) {
	return l + Math.random() * (r - l)
}

export function random_int(l, r) {
	return Math.floor(random_float(l, r))
}

/**
 * 用于下面选择题
 * 获取2个字符串的相似度
 * @param {string} str1 字符串1
 * @param {string} str2 字符串2
 * @returns {number} 相似度
 */
export function getSimilarity(str1, str2) {
	let sameNum = 0;
	//寻找相同字符
	for (let i = 0; i < str1.length; i++) {
		for (let j = 0; j < str2.length; j++) {
			if (str1[i] === str2[j]) {
				sameNum++;
				break;
			}
		}
	}
	return sameNum / str2.length;
}

/**
 * 随机时间
 * @param {int} interval 间隔时间
 * @param {int} times 
 * @return {int} 
 */
export function random_time(times = 1.0, interval = 500) {
	let begin = delay_time * times;
	let end = begin + interval;
	return random(begin, end);
}

/**
 * 模拟点击不可以点击元素
 * @param {UiObject} target 控件或者是控件文本
 */
export function click_target(target: UiObject) {
	let tmp: Rect = target.bounds()
	let randomX = random(tmp.left, tmp.right);
	let randomY = random(tmp.top, tmp.bottom);
	click(randomX, randomY);
}

export function click_id(idText: string) {
	let target = id(idText).findOne()
	click_target(target)
}


/**
 * 模拟点击可点击元素, 对“我的”的控件单独处理
 * @param {string} target 控件文本
 */
export function click_text(target: string) {
	text(target).waitFor();
	click(target);
}

/**
 * 刷新页面
 * @param {boolean} orientation 方向标识 true表示从下至上 false表示从上至下
 */
export function refresh(orientation, pace = 2) {
	let startx = random(device.width * 0.7, device.width * 0.8)
	if (orientation) {
		let starty = random(device.height * 0.7, device.height * 0.8)
		gestureTouchPoint(startx, starty,
			startx + random(-5, 5), starty - random(500, 600), pace)
	} else {
		let starty = random(device.height * 0.4, device.height * 0.6)
		gestureTouchPoint(startx, starty,
			startx + + random(-5, 5), starty + random_int(500, 600), pace)
	}

	sleep(random_time(0.5));
}