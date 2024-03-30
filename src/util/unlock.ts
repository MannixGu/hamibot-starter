const { gest } = hamibot.env;
const { password } = hamibot.env;
const { lock_type } = hamibot.env;

function numUnlcok(delay, pwd) {
	pwd.forEach(element => {
		log("click " + element);
		click(element[0], element[1]);
		sleep(delay);
	});
}

export function unlock() {
	device.wakeUpIfNeeded()
	let dwc = device.width / 2;
	let dhc = device.height / 2;
	let dw = device.width;
	let dh = device.height;

	log(dw + "-" + dh)
	sleep(2000)

	//手势
	switch (gest) {
		case "up":
			gesture(100, [dwc, dh / 10 * 9], [dwc, dh / 10]); break;
		case "down":
			gesture(100, [dwc, dh / 10], [dwc, dh / 10 * 9]); break;
		case "right":
			gesture(100, [dw / 8, dhc], [dw / 8 * 7, dhc]); break;
		case "left":
			gesture(100, [dw / 8 * 7, dhc], [dw / 8, dhc]); break;
	}

	sleep(800);

	//解析坐标构造解锁坐标数组
	let arr = password.split("-");
	let pwd: [number, number][] = [];

	for (let i = 0; i < arr.length; i++) {
		let temp = arr[i].split(",")
		let x = Number(temp[0])
		let y = Number(temp[1])
		pwd.push([x, y])
	}

	//解锁屏幕
	switch (lock_type) {
		case "pic":
			gesture(1500, ...pwd);
			break;
		case "num":
			numUnlcok(500, pwd);
			break;
	}
}

