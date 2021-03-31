---
title: 常用pm2命令
date: 2021-03-26
tags:
 - pm2
---

## 使用pm2管理应用

- 使用pm2启动项目，在终端中输入命令：`pm2 start app.js --name 自定义名称`
- 查看项目列表命令：`pm2 ls`
- 重启项目：`pm2 restart 自定义名称`
- 停止项目：`pm2 stop 自定义名称`
- 删除项目：`pm2 delete 自定义名称`
