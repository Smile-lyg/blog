---
title: 常用git命令
date: 2021-03-25
tags:
 - git
categories:
 - 笔记
---

## 配置

全局配置

```
git config --global user.name "赖尹钢"
git config --global user.email "1921243831@qq.com
```

## 关联远程仓库

### 方法1、本地初始化一个仓库，设置远程仓库地址后再做push
```
进入目录，初始化仓库
git init 

添加目录下所有文件到暂存区
git add .      

将暂存区内容提交到本地仓库中，引号内部为提交信息
git commit -m "xxxxx"    

关联远程仓库，远程库名一般写成：origin
ssh：git remote add 远程库名 git@gitee.com:用户名/仓库名.git
https：git remote add 远程库名 https://gitee.com/用户名/仓库名.git

第一次推送加上-u命令，会在云端自动创建该分支，之后推送可简写：git push，-f为强制推送
git push -u 远程库名 分支名
```
### 方法2、先将仓库clone到本地，修改后再push到 Gitee 的仓库仓库
- `git clone 远程库地址`
## 远程仓库

```
拉取远程库
git pull 远程库名 master

查看关联的远程库信息
git remote -v

删除已有的远程库
git remote rm 远程库名
```

## 克隆分支

1. ### 普通克隆方式

  ```
  git clone <远程仓库地址>
  ```

这种方式默认克隆主分支`master`，克隆后本地只有一个分支

2. ### 克隆指定分支

  ```
  git clone -b <指定分支名> <远程仓库地址>
  ```

会自动在克隆该分支在本地，同样克隆后本地只有这一个分支。

## 分支

- 查看所有分支

```
git branch
```

- 切换分支

```
git checkout 分支名
```

- 在`master`上创建并切换到`login`分支

```
git checkout -b login
```

- 推送本地其他分支到远程库其他分支

```
1.先切换到要推送的分支上
git checkout login

2.初次推送，会在云端创建
git push -u origin login
```
## 合并分支

- 1.先使用`git status`查看工作区状态，保证`working tree clean`

- 2.先使用`git checkout 分支名`切换到要合并的分支上

- 3.使用`git merge 分支名`合并分支

```
git checkout master
git merge login
```

##  版本回退

显示日志

```
git log
```

```
将 git 仓库中指定的更新记录恢复出来，并且覆盖暂存区和工作目录
git reset --hard commitID
```


  