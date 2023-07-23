## Vuex4 概述

使用 Vue 进行开发的一种状态管理模式，采用集中式存储来管理应用的所有组件状态

其核心对象为 store，一个全局唯一的组件数据状态的提供和管理者，同时提供了组件数据状态改变的方法

<img src="C:\Users\ycx\AppData\Roaming\Typora\typora-user-images\image-20230722010102495.png" alt="image-20230722010102495" style="zoom:67%;" />

### 组成部分

- actions : 一个提供任何组件完成页面业务功能时需要调用的方法的对象，并且 actions 中的每一个方法都必须是异步访问后端数据 API 的方法

* mutations : 一个用于接收 actions 对象中的方法传递过来的数据的对象。mutations 将接收到的数据传递给 state
* state : 一个用于提供所有组件的数据的对象或函数。state 接收 mutations 传递的数据发生变化之后，会通知组件进行响应式的更新。组件只能读取 state，不能修改
* getters : 一个提供用于获取 state 中数据的方法的对象

配合过程：用户在页面上发出请求；组件通过`store.dispatch`访问 actons 中的异步方法，访问后端的 API 进行数据的获取；actions 中获取到数据之后 commit 给 mutations 对象中对应的方法，mutations 对象再把该数据传递给 state；state 通知组件，进行页面的响应式更新

### 源码架构

##### Store 类

属性

- modules：收集子模块的对象
- modulesNamespaceMap : 子模块和命名空间的映射
- dispatch : 访问 actions 中的异步方法，值为一个函数，调用 Store 类中的 `dispatch` 方法
- commit : 访问 mutations 中的方法，值为一个函数，调用 `Store` 类中的 `commit` 方法
- state : 一个提供所有组件数据的对象或函数

方法

- install : 将 store 中间件挂载到 app 上
- commit :
- dispatch
- reactiveState : 将根模块中的state变为响应式state

