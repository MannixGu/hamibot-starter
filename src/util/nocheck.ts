
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