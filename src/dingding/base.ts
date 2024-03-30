
export function exitShell() {
	home()
	exit()
}


/**
 * 获取当前时间，格式:2019/11/26 15:32:27
 */
export function getDateTime(e) {
	var date = new Date()
	let year = date.getFullYear()
	let month: any = date.getMonth() + 1
	let day: any = date.getDate()
	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()
	if (month < 10) {
		month = '0' + month
	}
	if (day < 10) {
		day = '0' + month
	}
	if (e) {
		return (
			year +
			'年' +
			month +
			'月' +
			day +
			'日' +
			hour +
			':' +
			minute +
			':' +
			second
		)
	}
	return year + '-' + month + '-' + day
}
