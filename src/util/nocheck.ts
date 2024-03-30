import { Record, sendToRemote } from "../lib/logger"

// @ts-ignore
importClass(android.provider.Settings)
// @ts-ignore
importClass(android.content.Context)

/**
 * 手机是否锁屏
 */
export function isLocked() {
	// @ts-ignore
	var km = context.getSystemService(Context.KEYGUARD_SERVICE)
	return km.isKeyguardLocked() && km.isKeyguardSecure()
}


/**
 * 根据当前自动息屏时间获取循环时间
 */
export function getLoopTime() {
	// @ts-ignore
	let lockTime = Settings.System.getInt(
		// @ts-ignore
		context.getContentResolver(),
		// @ts-ignore
		Settings.System.SCREEN_OFF_TIMEOUT
	)
	if (null == lockTime || '' == lockTime || 'undefined' == lockTime) {
		return 8000
	}
	return lockTime / 2
}

/**
 * 上传截图至SMMS
 */
export function uploadImg(title: string = '截图') {
	const url = 'https://imgbb.com/json'
	const fileName = '/sdcard/' + new Date().getTime() + '.png'
	captureScreen(fileName)
	try {
		let res = http.postMultipart(
			url,
			// @ts-ignore
			{
				source: open(fileName),
				type: 'file',
				action: 'upload',
				auth_token: '2bf04f5cbe67dbe44a90ded6bbdcddfe',
				expiration: 'PT5M',
			},
			{
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
				},
			}
		)
		let jsonObj = JSON.parse(res.body.string())
		let isSuc = jsonObj.success.code == 200
		let imgUrl = jsonObj.image.url
		if (isSuc) {
			Record.log(
				'手机截图删除结果：' + (files.remove(fileName) ? '成功' : '失败')
			)
			sendToRemote(title, "![url](" + imgUrl + ")", "markdown")
		} else {
			Record.error('图片上传失败~', false)
		}
	} catch (e: any) {
		Record.error('图片上传失败~', e.message)
	}
}