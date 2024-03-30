/*
 * @Author: BATU1579
 * @CreateDate: 2022-05-24 16:58:03
 * @LastEditor: BATU1579
 * @LastTime: 2022-09-23 17:45:32
 * @FilePath: \\src\\index.ts
 * @Description: 脚本入口
 */
import { run } from "./dingding/clock";
import { } from "./global";
import { init } from "./lib/init";
import { Record } from "./lib/logger";
import { unlock } from "./util/unlock";
import { check_set_env } from "./util/util";

function lock_screen() {
	Record.log("lock screen...");
	// shell("input keyevent 26", true);

	press(500, 1600, 1)
	sleep(50)
	press(510, 1601, 1)
}


events.on("exit", () => {
	device.cancelKeepingAwake()

	home()
	lock_screen()
});

try {
	device.keepScreenDim()
	init();

	unlock();
	check_set_env();
	run()
} catch (error: any) {
	Record.error("Run Error:" + error.message);
}