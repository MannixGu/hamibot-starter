import { Record } from "../lib/logger";
import { getLoopTime } from "../util/nocheck"
import { exitShell } from "./base";

/* --------------------------------------预配置开始----------------------------------- */
export const {
	companyName,
	jumpRules,
	maxTime,
	account,
	accountPwd,
	leaveEarly,
	punchLater,
	waitTime,
	tokenUrl,
} = hamibot.env



const holidayUrl = 'http://timor.tech/api/holiday/year?week=Y'

export const holidayCfgName = 'HOLIDAY_ARRAY_' + new Date().getFullYear() + '_'

export const storage = storages.create('DingDing-SayNo');

/**
 * 获取今年的所有节假日
 */
function setholiday() {
	Record.info('获取当年节假日数据')
	let res = http.get(holidayUrl)
	let jsonObj = JSON.parse(res.body.string())
	if (jsonObj.code == -1) {
		Record.log('获取节假日数据失败')
		exitShell()
	}

	let holiday = jsonObj.holiday
	let holidayArray: any = []
	if (holiday) {
		for (let key in holiday) {
			if (holiday[key].holiday) {
				holidayArray.push(holiday[key].date)
			}
		}
		storage.put(holidayCfgName, holidayArray)
	} else {
		Record.log(
			'节假日数据接口变更，请联系开发者，并设置节假日规则为请选择或跳过周末'
		)
		exitShell()
	}
}

// 设置当年的节假日
if (
	('rule_1' == jumpRules || 'rule_3' == jumpRules) &&
	!storage.contains(holidayCfgName)
) {
	setholiday()
}