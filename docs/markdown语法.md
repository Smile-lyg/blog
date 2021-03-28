---
title: Markdown语法
date: 2021-03-26
tags:
 - markdown
categories:
 - 笔记
---

## Headers 标题


``` markdown
# h1
## h2
### h3
#### h4
##### h5
###### h6
```

## Emphasis 文本强调


``` markdown
*斜体* or _斜体_
**加粗** or __加粗__
***粗斜体*** or ___粗斜体___
```

## List 列表


Unorderd 无序列表
`-`， `+`， `*` 开头
- 无序列表
- 子项
- 子项

Ordered 有序列表
`1. 第一行`
1. 第一项
2. 第二项
3. 第三项

列表嵌套
1. 第一行
    - 你好啊
        1. hello
    - 我很好
2. 第二行

## Links 链接

``` markdown
[百度](https://www.baidu.com)
<1921243831@qq.com>
```
[百度](http://www.baidu.com)
<11@qq.com>

## Images 图片
``` markdown
![替代文字](https://www.baidu.com/favicon.ico)
```
![百度icon](https://www.baidu.com/favicon.ico)

## Table 表格
Markdown 制作表格使用 `|` 来分隔不同的单元格，使用 `-` 来分隔表头和其他行。

**对齐方式**
- `-:`设置内容和标题栏居右对齐。
- `:-`设置内容和标题栏居左对齐。
- `:-:`设置内容和标题栏居中对齐。

```markdown
| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
```
| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

## Code and Syntax Highlighting 代码和语法高亮
**标记一小段行内代码：** 使用反引号`` ` `` 包裹起来
<br>
**代码块语法高亮**
``` markdown
 ```html
 <div>123<div>
 \``` 
```
**Blockquotes 引用：** `>`
> 文字阿八八八

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: theorem 牛顿第一定律
假若施加于某物体的外力为零，则该物体的运动速度不变。

::: right
来自 [维基百科](https://zh.wikipedia.org/wiki/%E7%89%9B%E9%A1%BF%E8%BF%90%E5%8A%A8%E5%AE%9A%E5%BE%8B)
:::

::: details 点击查看
这是一个详情块，在 IE / Edge 中不生效
:::
