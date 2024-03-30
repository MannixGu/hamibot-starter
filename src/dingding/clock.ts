import { OcrResult } from "ocr"
import { Record } from "../lib/logger"
import { uploadImg } from "../util/nocheck"
import { click_target, findTargetTime } from "../util/util"
import { exitShell, getDateTime } from "./base"
import { account, accountPwd, companyName, holidayCfgName, jumpRules, leaveEarly, maxTime, punchLater, storage, waitTime } from "./config"

let waitTimeMillisecond = waitTime * 1000

export function run() {


	if (!maxTime) {
		Record.error('请设置打卡随机时间')
		exitShell()
	}


	if (!waitTime) {
		Record.error('请设置等待时间')
		exitShell()
	}

	Record.debug("maxTime:%s, waitTime:%s, waitTimeMillisecond:%s", maxTime, waitTime, waitTimeMillisecond)

	/* --------------------------------------预配置结束----------------------------------- */

	startProgram()
}

let myStr = ''


/**
 * 脚本流程
 */
function startProgram() {
	sleep(waitTimeMillisecond)
	// 1.检查权限
	checkMyPermission()
	// 3.获取操作并执
	var randTime = random(10, maxTime)
	Record.log(randTime + 's后开始打卡')
	sleep(randTime * 1000)
	// 2.进入页面
	goToPage()
	handleOrgDialog()
	punchTheClock()
	// 4.获取结果
	checkPunch()
	getReslt()

	sleep(1000);
}

function clickFindTarget(parent: boolean = false, ...list: [string, string][]) {
	let target: UiObject | null = findTargetTime(waitTimeMillisecond, ...list)
	if (parent) {
		target = target!!.parent()
	}

	Record.log('click %s, %s', target?.text(), target?.id())
	click_target(target!!)
	sleep(waitTimeMillisecond)
}

/**
 * 是否需要登录
 */
function loginIfNeed() {
	// if (text('密码登录').clickable(true).exists()) {
	// 	text('密码登录').clickable(true).findOne().click()
	// } else if (desc('密码登录').clickable(true).exists()) {
	// 	desc('密码登录').clickable(true).findOne().click()
	// }

	if (
		id('ic_edit_phone').exists() || textStartsWith('我已阅读并同意').exists()
	) {
		Record.log('需要登录')
		if (!account || !accountPwd) {
			Record.log('当前未登录，请输入钉钉登录账号及密码')
			exitShell()
		}

		// if (id('ic_edit_phone').exists()) {
		// 	id('ic_edit_phone').findOne().click()
		// }

		clickFindTarget(false, ['tv_next', 'id'])

		if (id('btn_privacy_dialog_confirm').exists()) {
			clickFindTarget(false, ['btn_privacy_dialog_confirm', 'id'])
		}

		clickFindTarget(true, ['密码登录', 'text'])

		if (id('et_pwd_input').exists()) {
			id('et_pwd_input').findOne().setText(accountPwd)
			sleep(waitTimeMillisecond)
		}

		clickFindTarget(false, ['btn_confirm', 'id'])

		// if (id('et_phone_input').exists() && id('et_pwd_login').exists()) {
		// 	id('et_phone_input').findOne().setText(account)
		// 	sleep(1000)
		// 	id('et_pwd_login').findOne().setText(accountPwd)
		// 	log('使用ID选择输入')
		// } else {
		// 	setText(0, account)
		// 	sleep(1000)
		// 	setText(1, accountPwd)
		// 	log('使用setText输入')
		// }
		// // 勾选协议
		// log('勾选协议')
		// if (id('cb_privacy').exists()) {
		// 	id('cb_privacy').findOne().click()
		// 	log('勾选协议成功')
		// }
		// // Android版本低于7.0
		// if (device.sdkInt < 24) {
		// 	let pageUIObj: any
		// 	if (id('btn_next').clickable(true).exists()) {
		// 		id('btn_next').clickable(true).findOne().click()
		// 	} else {
		// 		if (text('忘记密码').exists()) {
		// 			pageUIObj = text('忘记密码').findOne().parent()?.parent()?.children()
		// 		} else {
		// 			pageUIObj = desc('忘记密码').findOne().parent()?.parent()?.children()
		// 		}
		// 		if (pageUIObj.length == 5) {
		// 			let loginBtn = pageUIObj[3].children()[0]
		// 			loginBtn.click()
		// 		} else {
		// 			Record.log('找不到登录按钮，请联系脚本作者!')
		// 		}
		// 	}
		// } else {
		// 	//获取登录按钮坐标
		// 	if (text('忘记密码').clickable(true).exists()) {
		// 		var loginBtnY =
		// 			text('忘记密码').clickable(true).findOne().bounds().top - 10
		// 	} else {
		// 		var loginBtnY =
		// 			desc('忘记密码').clickable(true).findOne().bounds().top - 10
		// 	}

		// 	click(device.width / 2, loginBtnY)
		// }

		Record.log('登录成功')
	} else {
		Record.log('已登录')
	}
}


/**
 * 1.切换不常用公司会出现是否继续打卡提示，默认继续打卡
 * 2.判断是否早退打卡，迟到打卡
 * */
function checkPunch() {
	toastLog('等待10s，确保操作完毕')
	sleep(10000)
	toastLog('检查打卡')
	if (text('继续打卡').clickable(true).exists()) {
		text('继续打卡').clickable(true).findOne().click()
	} else if (desc('继续打卡').clickable(true).exists()) {
		desc('继续打卡').clickable(true).findOne().click()
	}
	try {
		if (leaveEarly) {
			if (
				textContains('早退打卡').exists() ||
				descContains('早退打卡').exists()
			) {
				Record.log('早退打卡,执行早退打卡')
				if (text('早退打卡').clickable(true).exists()) {
					text('早退打卡').clickable(true).findOne().click()
				} else if (desc('早退打卡').clickable(true).exists()) {
					desc('早退打卡').clickable(true).findOne().click()
				}
			}
		}
		if (punchLater) {
			if (
				textContains('迟到打卡').exists() ||
				descContains('迟到打卡').exists()
			) {
				Record.log('迟到打卡，执行迟到打卡')
				if (text('迟到打卡').clickable(true).exists()) {
					text('迟到打卡').clickable(true).findOne().click()
				} else if (desc('迟到打卡').clickable(true).exists()) {
					desc('迟到打卡').clickable(true).findOne().click()
				}
			}
		}
	} catch (error: any) {
		Record.error('检查打卡出错：' + '\n\n' + error.message)
	}
}

function recognizeScreen(): OcrResult {
	sleep(1000)
	toastLog('开始识别');
	return ocr.recognize(captureScreen());
}

/**
 * 获取打卡结果
 */
function getReslt() {
	toastLog('等待10s，确保打卡操作完毕')
	sleep(10000)
	toastLog('识别打卡结果')

	try {
		// if (
		// 	textContains('打卡成功').exists() ||
		// 	descContains('打卡成功').exists()
		// ) {
		// 	Record.log('普通识别结果：' + myStr + '成功!')
		// } else if (
		// 	textContains('已打卡').exists() ||
		// 	descContains('已打卡').exists()
		// ) {
		// 	Record.log('普通识别结果：' + myStr + '，重复打卡，请查看图片结果！')
		// } else if (
		// 	myStr === '上班打卡' &&
		// 	(textContains('下班打卡').exists() || descContains('下班打卡').exists())
		// ) {
		// 	// 打开App时触发了自动打卡
		// 	Record.log('普通识别结果：' + myStr + '成功!')
		// } else {
		// 	Record.log('普通识别结果：' + myStr + '失败!，扣你丫工资~')
		// }

		// uploadImg()

		let matchRule = /[\d:]*[已未]打卡|打卡成功|打卡时间/
		Record.warn("打卡结果：====================")
		let rest = recognizeScreen()
		// Record.log(rest.text)
		rest.results.forEach(obj => {
			if (matchRule.test(obj.text)) {
				Record.warn(obj.text)
			}
		})
		Record.warn("============================")

	} catch (error: any) {
		Record.error('识别打卡结果出错：' + '\n\n' + error.message)
	}
	sleep(waitTimeMillisecond)
	back()
	back()
}


/**
 * 打卡
 */
function punchTheClock() {
	toastLog('等待10s，确保打卡界面完成')
	sleep(10000)
	Record.info('开始打卡')

	let matchRule = /[上下]班打卡/
	let obj = recognizeScreen().results.find(obj => matchRule.test(obj.text))

	if (obj != undefined) {
		Record.info("点击:" + obj.text + " [%d %d %d %d] ",
			obj.bounds.left,
			obj.bounds.top,
			obj.bounds.right,
			obj.bounds.bottom)

		click(obj.bounds.left, obj.bounds.top)
	}
}

/**
 * 等待进入钉钉登录界面或者主界面
 */
function waitStart() {
	// let sTime = new Date().getTime()
	// let delay = 30000

	sleep(10 * waitTimeMillisecond)
	// while ((new Date().getTime() - sTime) < delay) {
	// 	if (
	// 		text('忘记密码').exists() ||
	// 		desc('忘记密码').exists() ||
	// 		text('工作台').exists() ||
	// 		desc('工作台').exists() ||
	// 		text('密码登录').exists() ||
	// 		desc('密码登录').exists()
	// 	) {
	// 		break
	// 	}
	// 	sleep(1000)
	// }
}


/**
 * 钉钉可能加入了多个公司，通过意图进入打卡页面会提示选择
 */
function handleOrgDialog() {
	if ('' == companyName || null == companyName) {
		return
	}
	let delay = 30000
	const flagStr = '请选择你要进入的考勤组织'
	let sTime = new Date().getTime()
	while (new Date().getTime() - sTime < delay) {
		if (text(flagStr).exists() || desc(flagStr).exists()) {
			if (text(companyName).clickable(true).exists()) {
				let company = text(companyName).findOne()
				click_target(company)
				Record.log('选择公司1' + company.text())
				return
			}
			if (textContains(companyName).clickable(true).exists()) {
				let company = textContains(companyName).findOne()
				click_target(company)
				Record.log('选择公司2' + company.text())
				return
			}
			if (descContains(companyName).clickable(true).exists()) {
				let company = descContains(companyName).findOne()
				click_target(company)
				Record.log('选择公司3' + company.text())
				return
			}
		} else {
			sleep(1000)
		}
	}
}

/**
 * 打开打卡页面
 */
function goToPage() {
	Record.log('打开钉钉中...')
	launch('com.alibaba.android.rimet')
	waitStart()
	sleep(waitTimeMillisecond)
	Record.log('启动完成')
	loginIfNeed()
	sleep(waitTimeMillisecond)
	Record.log('进入打卡页面')
	let a = app.intent({
		action: 'VIEW',
		data: 'dingtalk://dingtalkclient/page/link?url=https://attend.dingtalk.com/attend/index.html',
	})
	app.startActivity(a)
}

/**
 * 检查权限
 */
function checkMyPermission() {
	// 根据配置跳过节假日或周末
	if ('rule_1' == jumpRules) {
		let holidayArray = storage.get(holidayCfgName)
		if (holidayArray.indexOf(getDateTime(false)) != -1) {
			Record.log('今天是节假日, 不会打卡哦~')
			exitShell()
		}
	} else if ('rule_2' == jumpRules) {
		let week = new Date().getDay()
		if (week == 6 || week == 0) {
			Record.log('今天是周末, 不会打卡哦~')
			exitShell()
		}
	} else if ('rule_3' == jumpRules) {
		let week = new Date().getDay()
		let holidayArray = storage.get(holidayCfgName)
		if (
			holidayArray.indexOf(getDateTime(false)) != -1 ||
			week == 6 ||
			week == 0
		) {
			Record.log('今天是节假日, 不会打卡哦~')
			exitShell()
		}
	}
}
