import { Record, sendMessage } from "../lib/logger";
import { click_id, click_text, random_time } from "../util/util"

function back_track(wait_time = 1.5) {
	do {
		if (!className("FrameLayout").packageName("cn.xuexi.android").exists()) {
			app.launchApp("学习强国");

			sleep(random_time(wait_time));
			if (text("新用户注册").exists()) {
				device.cancelKeepingAwake();
				//震动一秒
				device.vibrate(1000);
				sendMessage("Error", "请先登录学习强国");
				toast("请先登录学习强国");
				exit();
			}
			if (text("立即升级").exists()) {
				log("点击:" + "取消");
				text("取消").findOne().click();
			}
		}

		let while_count = 0;
		while (!id("comm_head_title").exists() && while_count < 5) {
			while_count++;
			back();
			sleep(random_time());
		}
		sleep(random_time());

		// 当由于未知原因退出学习强国，则重新执行
	} while (!className("FrameLayout").packageName("cn.xuexi.android").exists());
}

function exitKiwi() {
	launchApp("Kiwi Browser")
	id("menu_button_wrapper").waitFor()
	click_id("menu_button_wrapper")
	sleep(random_time())
	click_text("打开新的标签页")
	sleep(random_time())
	click_id("menu_button_wrapper")
	sleep(random_time())
	click_text("退出")
}

function startKiwi() {
	launchApp("Kiwi Browser")
	id("menu_button_wrapper").waitFor()
	click_id("menu_button_wrapper")
	sleep(random_time())
	click_text("打开新的标签页")
}


export function run() {
	Record.log("exit kiwi")
	exitKiwi()
	sleep(random_time())

	Record.log("start kiwi")
	startKiwi()

	sleep(random_time())
	click_id("menu_button_wrapper")
	sleep(random_time())
	click_text("学习")
	sleep(random_time())

	click_text("开始学习")

	sleep(random_time(5))

	if (!id("url_bar").findOne().text().match("pc.xuexi.cn/points/login.html")) {
		Record.log("无需扫码登录")
		return
	}

	Record.log("准备扫码登录")
	do {
		if (id("menu_row_text").text("下载图片").exists()) {
			back()
		}
		sleep(random_time(2))
		longClick(555, 1670)
		sleep(random_time(2))
	} while (id("menu_row_text").depth(5).text("下载图片").exists() && id("menu_header_title").exists() && id("menu_header_title").findOnce()?.text().endsWith(".bin"))

	sleep(random_time(1.5))
	click_text("下载图片")

	back_track(5)

	id("comm_head_title").waitFor()
	click_id("img_search_right")
	sleep(random_time())
	click_text("相册")
	sleep(random_time())
	click_text("下载")
	sleep(random_time())

	id("base_album_item_img").find().get(0).click()
	text("二维码登录").waitFor()

	sleep(random_time())
	click_text("登录网页版学习强国")
	sleep(random_time())
	launchApp("Kiwi Browser")
	Record.log("完成启动")
}