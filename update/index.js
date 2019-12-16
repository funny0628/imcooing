const shell = require("shelljs");
const path = require("path");
const chalk = require("chalk");
// ssh 公钥
const publicKey = path.resolve(__dirname, "./publicKey");
// 要上传的目录
const srcPath = path.resolve(__dirname, "../dist");
// 目标目录
const destPath = "/data/www/web-pc/";
// 上传命令
const updateCommand = `sudo rsync -avzp --delete --partial -e "ssh -i ${publicKey} -p 6656" ${srcPath}/ root@47.91.228.223:${destPath}`;
// 打包命令
const buildCommand = `npm run build`;
console.log(chalk.yellow("[Process] 开始打包"));
// 打包进程
const buildProcess = shell.exec(buildCommand);
console.log(buildProcess);
// 打包成功上传
if (buildProcess.code === 0) {
  console.log(chalk.yellow("[Success] 打包成功"));
  console.log(chalk.yellow("[Process] 开始上传"));
  // 上传进程
  const updateProcess = shell.exec(updateCommand);
  console.log(
    updateProcess.code === 0
      ? chalk.yellow("[Success] 上传成功")
      : chalk.white.bgRed.bold("[Failed] 上传失败")
  );
} else {
  console.log(`${chalk.white.bgRed.bold("[Failed] 打包失败")} `);
  shell.exit(1);
}
