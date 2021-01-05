## 一、前言

在正式介绍这篇寻路算法文章之前，我想先简单讲讲两个经典的算法：深度优先搜索算法和广度优先搜索算法。

## 二、深度优先搜索

深度优先搜索(Depth-First-Search，DFS)，是一种用于遍历搜索树或图的算法。这个算法会尽可能深的搜索树的分支。我们一般使用堆数据结构来辅助实现 `DFS` 算法。

我们来看看 [wiki](https://zh.wikipedia.org/wiki/%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2) 上的定义：
> 这个算法会尽可能深的搜索树的分支。当节点 `v` 的所在边都已被探寻过，搜索将回溯到发现节点 `v` 的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。如果还存在未被发现的节点，则选择其中一个作为源节点并重复以上过程，整个进程反复进行直到所有节点都被访问为止。

简单来说，
1. 访问顶点 `v`
2. 依次从 `v` 的未被访问的邻接点出发，对图进行深度优先遍历；直至图中和 `v` 有路径相通的顶点都被访问
3. 若此时图中尚有顶点未被访问，则从一个未被访问的顶点出发，重新进行深度优先遍历，直到图中所有顶点均被访问过为止

如下：
```
        1  

   2         3  

4    5    6    7 

  8
```
根据搜索规则，我们首先访问顶点 `1`，然后寻找其邻接点 `2` ，再寻找 `2` 的邻接点 `4`，依次类推。当找到 `8` 时，没有邻接点，这时就返回到上一节点 `4` 查找是否还有未访问到的节点，没有则再往上查找 `2` 是否有未被访问的节点。`5` 则被访问到。最后的搜索路径为：1 —> 2 —> 4 —> 8 —> 5 —> 3 —> 6 —> 7。

如下图所示：

![DFS](https://github.com/syt-honey/study_picture/blob/master/album/DFS.png)

备注：上图中的箭头有一定的误导性，晚点再改一下（可以根据上面提供的数字顺序做对照）。

## 三、广度优先搜索 

广度优先搜索（Breadth-First-Search, BFS）,是一种图形搜索算法。根据它的特点，我们一般使用队列来辅助实现 `BFS` 算法。

它的主要实现思路为：

1. 将根节点放入队列中
2. 从队列中取出第一个节点，并检验它是否为目标。如果找到目标则返回搜索结果。否则将它所有尚未检验过的直接子节点加入到队列中
3. 若队列为空，则返回
4. 重复步骤 2

其实它就是我们熟知的横向优先搜索。它的搜索路径如下：

![BFS](https://github.com/syt-honey/study_picture/blob/master/album/BFS.png)

`BFS` 有非常多的应用，在 [这篇文章中](https://time.geekbang.org/column/article/80011?utm_source=u_nav_web&utm_medium=u_nav_web&utm_term=u_nav_web) ，winter 老师也使用它来搜索计算过浏览器中有多少 JavaScript 固有对象。

## 四、寻路算法

看完了前面两个算法的介绍相信你对深度和广度优先搜索算法已经有了大概的了解了。对于我们的寻路问题，我们需要"就近"的去查找是否有符合要求的点，所以我们选择的是广度优先搜索。

具体查找思路为：

1. 指定某一起始点 `v`，放入队列
2. 从队列中取出第一个节点，检验它是否为目标节点。如果是，则返回搜索结果。否则查找它的"上"、"下"、"左"、"右"节点是否为目标点。
3. 如果队列为空，则返回
4. 重复步骤 2

根据以上搜索方法，我们可以查询到指定目标节点。以下是查询到的路径图：

![BFS-Searching](https://github.com/syt-honey/study_picture/blob/master/album/BFS-searching.png)

从上图的路径中我们可以看出，这种广度优先搜索是一个非常"笨"的搜索方法。它不会去根据某种策略来规划路线，导致它总会花费非常多的时间搜索没有必要的区域。如果我们的搜索算法算法可以根据起始点和终止点之间的距离直接计算出路径路径就好了。

### （1）启发式（A*）寻路

我们在广度优先算法中进行改造一下：我们让`2. 从队列取出第一个节点` 这一步在取出时拿到的值为队列中最小的那个，每次拿值的时候都这样做。这样就能保证我们查询的路径能"有策略"的寻路。

如果你还没有明白，没关系，我们来举个栗子：

我们现在要从下图的 a 点走到 b 点。那寻路的步骤就是：

1. 首先，将 a 节点放入队列中
2. 取出 a 节点，a 不是目标节点，则将 a 的"子节点" "上" "下" "左" "右" 分别放入队列中
3. 取出某一节点，该节点为离 b 最近的节点。所以是图中的节点 "1"。
4. 重复上述步骤

最后的路径就如下图（绿色为其判断的子节点，紫色为路径）：

![ex-searching](https://github.com/syt-honey/study_picture/blob/master/album/ex-searching.png)

相比于广度优先搜索，其实启发式寻路就是在此基础上完善了一下获取值的方法：每次拿到的点都是给定两点最短距离的点。当然，代码中给出的方法仅仅是其中一条思路，我们还可以使用其它不同的方法来做最短路径判断，比如最小二叉堆。

好了，本文的核心的内容到这里就结束了。如果你还有时间，不妨和我一起来看看这次练习遇到的问题以及解决方法吧。如果你有更好的想法/方法，欢迎留言告诉我呀～

## 五、一些其它值得注意的知识点

### （1）块级元素转换为 `inline-block` 后产生的缝隙。

这个问题很经典，出现的原因是块级元素设置 `inline-block` 后成为行内块元素。它同时具备块级元素和行内元素的特点。而浏览器不会忽视 HTML 中行内元素间的空格或者换行，所以导致元素与元素之间会产生空隙。

```html
<ul>
  <li>第一</li>
  <li>第二</li>
  <li>第三</li>
  <li>第四</li>
</ul>
```

```css
li {
  display: inline-block;
  background: lightgreen;
}
```

最后显示出来是这样的：   

![inline-block](https://github.com/syt-honey/study_picture/blob/master/album/inline-block.png)

> 提示：你也可以在 [这里](https://codepen.io/honeysyt/pen/eYdMGJp) 实操一下。

那怎样才能去除这个让人讨厌的空白呢？[CSS-Tricks](https://css-tricks.com/fighting-the-space-between-inline-block-elements/) 给出了很多种方案。总结一下有：

1.直接去除 HTML 中多余的空格

```html
<!---- 第一种：直接一排显示。但是很显然，这很不直观……------>
<ul>
  <li>第一</li><li>第二</li><li>第三</li><li>第四</li>
</ul>

<!---- 第二种：将前一个结束标签作为第二个标签的开头。这……稍微好一丢丢吧 ------>
<ul>
  <li>第一
  </li><li>第二
  </li><li>第三
  </li><li>第四
  </li>
</ul>

<!---- 第三种：标签与标签之间放一个注释符号 ------>
<ul>
  <li>第一</li><!--
  --><li>第二</li><!--
  --><li>第三</li><!--
  --><li>第四</li>
</ul>
```

2.将父级元素的 `font-size` 设置为 0，自己的 `font-size` 正常设置

```css
ul {
  font-size: 0;
}

li {
  display: inline-block;
  background: lightgreen;
  font-size: 16px;
}
```
> 提示：在不同的机器上，这样设置可能会带来一些问题。具体请看：[Set the font size to zero](https://css-tricks.com/fighting-the-space-between-inline-block-elements/#set-the-font-size-to-zero)

3.设置一个负的外边距

```css
li {
  display: inline-block;
  background: lightgreen;
  margin-right: -4px;
}
```

> 这方法简直太尴尬了……，我在 `codepen` 上需要设置 -6px 才能遮住空隙。不同机型还不一样 :<

4.设置前面元素为 `float`。

```css
li {
  display: inline-block;
  background: lightgreen;
}

li:not(:last-child) {
  float: left;
}
```

可是，用了 `float` 我为什么还要设置 `display: inline-block;` 呢？

5.使用 `flexbox` 布局

都 2021 年了，相信没有人不熟悉它了。

```css
ul {
  display: flex;
}

li {
  list-style: none;
  background: lightgreen;
}
```

它的兼容性也非常好。除了 IE，市面上的浏览器基本都支持了。大家可以通过 [caniuse](https://caniuse.com/?search=flex) 来查看它的兼容性。

### （2）CSS 属性顺序

关于 CSS 的属性排序，大家可能都不太在意。前些天复习 CSS 时看了掘金上 [JowayYoung](https://juejin.cn/book/6850413616484040711) 写的小册，里面也特意的提到了 CSS 属性的书写顺序。那么好的 CSS 属性书写顺序有什么用呢？这里就用 JowayYoung 前辈总结的分享给大家：

* 防止属性重复编写
* 可快速定位到问题代码
* 可快速在脑海里构思出节点
* 可锻炼无视图架构页面能力
* 提高代码的可读性和可维护性

那我们的属性应该怎样来排序呢？

> 根据上述想法和理解，将属性排序按照 `布局` → `尺寸` → `界面` → `文字` → `交互` 的方式顺序定义。把交互属性放到后面是因为`transform` 和 `animation` 会让节点重新生成新图层，上述有提到新图层不会对其他图层造成影响。

具体属性有哪些这里就不再展开，有兴趣的可以去掘金上面看一下这部分内容。（第三章：回流重绘）

### （3）减少频繁的 DOM 操作，提高性能。

这节课和上节课，老师都使用了遍历来生成元素然后插入到父级元素上的这种方法。但是 JavaScript 操作 DOM 其实是非常慢的，尤其是当 DOM 节点很多的时候。我们使用时应该注意：
  * 缓存已经访问过的元素；
  * 使用 DocumentFragment 暂存 DOM，然后再插入 DOM 树；
  * 使用 className 来操纵元素的样式；
  * 避免使用 JavaScript 修复布局。
  
 我们在生成 DOM 树的时候就可以借助 `DocumentFragment` 来暂存一个 DOM，最后再一起插到父级元素上。
 
 ---
 OS：macOS Catalina 10.15.7  
 Browser Version: Chrome 87.0.4280.88（正式版本） (x86_64)