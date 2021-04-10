---
title: git常用命令
date: 2021-03-25
tags:
 - git
categories:
 - 笔记
# sticky: 1
---
:::tip
Git（读音为/gɪt/）是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。
:::
<!-- more -->
## git 基本操作流程

<img src="./imgs/git.jpg" alt="images" title="Git基本流程">

- 创建本地仓库
:::tip
**git init**
:::

- 提交到缓存区
:::tip
**git add . 全部上传到缓存区**<br>
**git add 指定文件**
:::

- 提交到本地仓库
:::tip
**git commit -m 'some message'**
:::

- 链接本地仓库与远端仓库，远程库名一般写成：**origin**
:::tip
**ssh：git remote add 远程库名 git@gitee.com:用户名/仓库名.git**<br>
**https：git remote add 远程库名 https://gitee.com/用户名/仓库名.git**
:::

- 提交远程仓库
:::tip
**第一次推送加上-u命令，之后推送可简写成：git push**<br>
**git push -u 远程库名 分支名**
:::


- 查看远端仓库信息
:::tip
**git remote -v**
:::

- 远端仓库重新命名
:::tip
**git remote rename oldName newName**
:::

- 移除远端仓库
:::tip
**git remote rm 远程库名**
:::

- 查看分支
:::tip
**git branch**
:::

- 创建分支并切换
:::tip
**git checkout -b xxx**
:::

- 切换分支
:::tip
**git checkout xxx**
:::

- 删除分支
:::tip
**git branch -d xxx**
:::

- 删除远程分支
:::tip
**git push -d xxx**
:::

- 合并分支
:::tip
**git merge xxx**
:::

## 配置

全局配置用户信息

```
git config --global user.name "xxx"
git config --global user.email "email address"
```

## 推送

- git推送的完整写法如下：
  - `git push @remoteName  @localBranch:@remoteBranch`
```git
  // eg.remoteName:origin  localBranch:ceshi  remoteBranch:test
  git push origin ceshi:test
```

- 如果本地分支与远程分支名字一样的话，可以简写。例如本地和远程的分支名都是master
```git
  git push origin master
```
- 指令 **-f** 为强制推送

## 克隆分支

1. **普通克隆方式**
``` 
git clone <远程仓库地址>
```

这种方式默认克隆主分支`master`，克隆后本地只有一个分支

2. **克隆指定分支**

```
git clone -b <指定分支名> <远程仓库地址>
```

会自动在克隆该分支在本地，同样克隆后本地只有这一个分支。

## 分支

- 查看本地所有分支

```
git branch
```
- 查看远程所有分支

```
git branch -r
```

- 查看本地和远程分支

```
git branch -a
```

- 切换分支

```
git checkout 分支名
```

- 创建并切换到新建分支

```
git checkout -b 新建分支名
```

- 删除分支
```
git branch -d 分支名
```
- 删除远程分支
```
git push origin -d 分支名
```
- 重命名分支
```
git branch -m 旧名字 新名字
```
- 将当前分支重命名
```
git branch -m 新名字
```

- 推送本地分支到远程库分支

```
1.先切换到要推送的分支上
git checkout login

2.初次推送，会在云端创建，远程库分支名和本地名称相同可简写
git push -u origin login
```

- 查看各个分支最后一个提交对象的信息
```
git branch -v
```
- 拉取远程分支并创建本地分支
```
git checkout -b 本地分支名 origin/远程分支名

git fetch origin <branch-name>:<local-branch-name>
```
## 合并分支

- 1.先使用`git status`查看工作区状态，保证`working tree clean`

- 2.先使用`git checkout 分支名`切换到要合并的分支上

- 3.使用`git merge 分支名`合并分支

```
git checkout master
git merge login
```
- 查看哪些分支已经合并到当前分支
```
git branch --merged
```
- 查看哪些分支没有合并到当前分支
```
git branch --no-merged
```

## 状态查询
- 查看状态
  - `git status`
- 查看历史操作记录
  - `git reflog`
- 查看日志
  - `git log`

##  撤销更改

- 撤销工作区修改
  - `git checkout -- <file>`
- 暂存区文件撤销 (不覆盖工作区)
  - `git reset HEAD`
- 版本回退
  - `git reset --(soft | mixed | hard ) < HEAD ~(num) >|commitID`

  |指令|作用范围|
  |----|-------|
  |--hard|回退全部，包括HEAD，index，working tree|
  |--mixed|回退部分,包括HEAD，index|
  |--soft|只回退HEAD|

## 分支命名规范

**master 分支**
1. 主分支，用于部署生产环境的分支，确保稳定性。
2. master分支一般由develop以及hotfix分支合并，任何情况下都不能直接修改代码。

**develop 分支**
1. develop为开发分支，通常情况下，保存最新完成以及bug修复后的代码。
2. 开发新功能时，feature分支都是基于develop分支下创建的。

**feature 分支**
1. 开发新功能，基本上以develop为基础创建feature分支。
2. 分支命名：feature/ 开头的为特性分支， 命名规则: feature/user_module、 feature/cart_module。

**release分支**
1. release 为预上线分支，发布提测阶段，会release分支代码为基准提测。

**hotfix分支**
1. 分支命名：hotfix/ 开头的为修复分支，它的命名规则与 feature 分支类似。
2. 线上出现紧急问题时，需要及时修复，以master分支为基线，创建hotfix分支，修复完成后，需要合并到master分支和develop分支。

## 忽略文件 .gitignore

这个文件的作用，会去忽略一些不需要纳入Git管理这种，我们也不希望出现在未跟踪文件列表。

那么我们来看看如何配置该文件信息。
:::tip
\# 此行为注释 会被Git忽略

\# 忽略 node_modules/ 目录下所有的文件<br>
node_modules


\# 忽略所有.vscode结尾的文件<br>
.vscode

\# 忽略所有.md结尾的文件<br>
*.md

\# 但README.md 除外<br>
!README.md

\# 会忽略 doc/something.txt 但不会忽略doc/images/arch.txt<br>
doc/*.txt

\# 忽略 doc/ 目录下所有扩展名为txt文件<br>

doc/**/*.txt
:::

