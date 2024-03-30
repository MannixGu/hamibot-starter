/**
 * 1. 手势 
 * 按理，应该没16ms 生成一个event
 * 但是辅助功能支持的 gesture 最多支持 20线段，也就是总共也就 21个坐标点
 * 那我们就除去起始坐标点，生成17-19个坐标点
 * 
 * 2. 配速v档位， 低/中/高
 * 参考值 0.3-0.4 0.65-0.75 1.65- 1.75
 * 
 * 3. 生成坐标点 x,y
 * 外界输入的起点（start）和终点（end）是确定的，随机配速，就已经决定了花费的时间(t)
 * 如何生成其中的坐标点
 * 
 * 前提：x,y与时间t的关系
 * 通过采集数据分析后
*/

import { random_float, random_int } from "./util";

class BezierPath {
	anchorpoints: [number, number][]

	constructor(anchorpoints: [number, number][]) {
		this.anchorpoints = anchorpoints
	}

	public getPoint(rate: number) {
		return BezierPath.multiPointBezier(this.anchorpoints, rate)
	}

	public static createBezierPoints(anchorpoints, pointsAmount): [number, number][] {
		var points: any = [];
		for (var i = 0; i <= pointsAmount; i++) {
			let point = this.multiPointBezier(anchorpoints, i / pointsAmount);
			points.push(point);
		}
		return points;
	}

	public static multiPointBezier(points, t): [number, number] {
		let len: number = points.length;
		let x: number = 0, y: number = 0;
		for (let i: number = 0; i < len; i++) {
			let point: any = points[i];
			x += point[0] * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (this.binomial(len - 1, i));
			y += point[1] * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (this.binomial(len - 1, i));
		}
		return [x, y];
	}

	private static binomial(start: number, end: number): number {
		let cs: number = 1, bcs: number = 1;
		while (end > 0) {
			cs *= start;
			bcs *= end;
			start--;
			end--;
		}
		return (cs / bcs);
	};
}

function getBasisAchorPoints(isMajor = true) {
	if (isMajor) {
		return [[0, 0], [random_float(0.3, 0.7), 0], [random_float(0.1, 0.6), 0], [1, 1]]
	} else {
		let rr = Math.random()
		if (rr <= 0.2) {
			//一直加速
			return [[0, 0], [random_float(0.5, 0.6), 0], [0.4, 0], [1, 1]]
		} else if (rr > 0.8) {
			//先加速后减速再加速
			return [[0, 0], [random_float(0.4, 0.6), random_float(-0.2, 0)], [0.5, -0.2], [1, 1]]
		} else {
			//快加速以后缓慢
			return [[0, 0], [random_float(0.4, 0.7), -0.2], [0, random_float(1.1, 1.3)], [1, 1]]
		}
	}
}

/**
 * 
 * @param x0 start.x
 * @param y0 start.y
 * @param x1 end.x
 * @param y1 end.y
 * @param pace 配速 1：慢速 2：中速 3：快速
 */
export function gestureTouchPoint(x0: number, y0: number, x1: number, y1: number, pace = random_int(1, 3)) {
	let v = Math.random() * 0.1
	switch (pace) {
		case 1:
			v += 0.2;
			break
		case 2:
			v += 0.65;
			break
		case 3:
			v += 1.65;
			break
	}

	let realDistX = x1 - x0
	let realDistY = y1 - y0

	let distX = Math.abs(realDistX);
	let distY = Math.abs(realDistY);

	let t = Math.floor(Math.max(Math.max(distX, distY) / v, random_int(300, 400)))

	let xMajor = distX > distY

	let xpoints = getBasisAchorPoints(xMajor)
	let ypoints = getBasisAchorPoints(!xMajor)

	let len = 19
	let xfun = BezierPath.createBezierPoints(xpoints, len)
	let yfun = BezierPath.createBezierPoints(ypoints, len)

	let points: [number, number][] = []
	for (let i: number = 0; i <= len; i++) {
		let rateX = 1
		let rateY = 1

		if (xMajor) {
			rateY = yfun[i][0] == 0 ? 1 : xfun[i][0] / yfun[i][0]
		} else {
			rateX = xfun[i][0] == 0 ? 1 : yfun[i][0] / xfun[i][0]
		}

		let x = xfun[i][1] * rateX * realDistX + x0;
		let y = yfun[i][1] * rateY * realDistY + y0;
		let point: [number, number] = [x, y]
		points.push(point)
	}

	gesture(t, ...points)
}
