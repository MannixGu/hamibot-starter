import { click_target, random_time } from "./util";

export function stopApp(appName: string) {
	let packageName = getPackageName(appName);
	if (packageName) {
		stopPackge(packageName);
	}
}

export function stopPackge(packageName: string) {
	sleep(random_time(2));
	app.openAppSetting(packageName);
	sleep(2000);
	text("应用信息").findOne(3000) ??
		text('App info').findOne(3000);
	sleep(1500);
	let stopbb = textMatches(/(强.停止$|.*停止$|结束运行|停止运行|[Ff][Oo][Rr][Cc][Ee] [Ss][Tt][Oo][Pp])/).findOne();
	click_target(stopbb);
	sleep(1000);
	let surebb = textMatches(/(确定|.*停止.*|[Ff][Oo][Rr][Cc][Ee] [Ss][Tt][Oo][Pp]|O[Kk])/).clickable().findOne(1500);
	if (!surebb) {
		back();
	} else {
		click_target(surebb);
	}
	sleep(1500);
	back();
}
