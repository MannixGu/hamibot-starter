/*
 * @Author: BATU1579
 * @CreateDate: 2022-05-24 16:58:03
 * @LastEditor: BATU1579
 * @LastTime: 2022-09-23 17:45:32
 * @FilePath: \\src\\index.ts
 * @Description: 脚本入口
 */
import { } from "./global";
import { run } from "./kiwi/kiwi";
import { init } from "./lib/init";
import { sendToRemote } from "./lib/logger";
import { uploadImg } from "./util/nocheck";
import { unlock } from "./util/unlock";
import { check_set_env } from "./util/util";

init();

unlock()
check_set_env()
run()
sleep(4)
uploadImg()