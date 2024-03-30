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
import { unlock } from "./util/unlock";
import { check_set_env } from "./util/util";

init();

unlock();
check_set_env();
run();