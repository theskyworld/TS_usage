## Vuex4 概述

使用 Vue 进行开发的一种状态管理模式，采用

- 集中式
- 存储

来管理应用的所有组件状态

其核心原理为将多个组件的共享状态抽取出来，然后通过一个全局的单例模式来进行管理。无论哪个组件（无论在任何位置、嵌套多深）都能够访问到共享的状态并进行操作

其核心对象为 store，一个全局唯一的组件数据状态的提供和管理者，同时提供了组件数据状态改变的方法

<img src="C:\Users\ycx\AppData\Roaming\Typora\typora-user-images\image-20230722010102495.png" alt="image-20230722010102495" style="zoom:67%;" />

### store 对象

每一个 Vuex 的核心为 store，其中包含了共享状态 state 和各种对 state 进行操作的方法

- 其中的状态存储是响应式的
- 不能直接对状态进行修改，只能通过 commit mutation，以便跟踪每个状态的变化

一个最基本的 store，以及对其的操作：

```js
import { createStore } from "vuex";

// 传入一个storeOptions配置对象来创建一个store对象
const store = createStore({
  // state状态
  // 可以使用对象或者函数（返回一个对象）形式
  //   state: {
  //     count: 0,
  //   },
  state() {
    return {
      count: 0,
    };
  },
  // mutations
  // 包含多个对state中的状态进行修改的方法
  // 外部通过commit来对其中的方法进行调用
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

// 访问count
console.log("count:", store.state.count); // 0
// 在组件内使用该方法获取的count将不具备响应式

// 修改count
store.commit("increment");
console.log("count:", store.state.count); // 1
```

在组件中可以通过`this.$store`对 store 对象进行访问：

```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

或者，也可以通过`useStore()`函数的快捷方式

```js
const store = useStore();
// 或者导入后直接使用
import { store } from "vuex";
console.log(store);
```

以上对 store 中 state 状态的修改都是通过 commit mutation 的方式来实现的，而并非直接进行修改。这样，可以对每次的修改操作进行追踪

### 组成部分

#### `state`

一个包含全部应用层级状态的对象。Vuex 使用单一状态树，使得 state 成为唯一的数据源，每个应用中只包含一个 store 对象

在组件中访问 state 中的状态：

```js
import { store } from "./store/index";
//或者
import { useStore } from "vuex";
const store = useStore();
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  // 通过使用计算属性，使得count是响应式的，当store.state.count发生改变时，count跟着改变
  computed: {
    count() {
      return store.state.count;
    },
  },
};
```

为了避免在每个组件中单独为 store 进行导入，现在将 store 添加到 vue 的实例上，通过`this.$store`进行访问

```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
```

使用 `mapState` 来获取 state 中的多个状态值，避免多次使用 `computed`

```js
import { mapState } from "vuex";
import { ref } from "vue";
export default {
  setup() {
    const localCount = ref(1);
    return {
      localCount,
    };
  },

  // 使用mapState来获取state中的多个状态
  // 同时使用computed使其都具有响应式
  computed: mapState({
    // 以下三个变量获取的都是state中的count值
    // 使用箭头函数获取state中的count值，将其赋值给count变量
    count: (state) => state.count,

    // 更简洁的写法
    // 'count' 等同于 `state => state.count`
    countAlias: "count",

    // 与当前组件中的值结合使用
    countPlusLocalState(state) {
      return state.count + this.localCount;
    },

    // 获取age值
    // age : 'age',
    // 等价于
    'age',
    ageCom: "age",
    // 获取name值
    nameCom: "name",
  }),

  // 或者使用数组的写法
  // 分别获取count age name值
  computed: mapState(["count", "age", "name"]),
};
```

#### `getters`

类似于 vue 中的 computed 计算属性，将 state 中的状态进行例如过滤等操作后进行返回（或者直接返回），然后供组件中进行读取

##### 定义`getters`:

```js
import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      todos: [
        { id: 1, text: "text1", done: false },
        { id: 2, text: "text2", done: true },
      ],
    };
  },
  // 创建getters
  getters: {
    doneTodos(state) {
      return state.todos.filter((todo) => todo.done);
    },
    // 在getters内部访问getter
    doneTodosLength(state, getters) {
      return getters.doneTodos.length;
    },
    // 返回一个函数，在组件中调用
    // 实现通过传入id来返回对应的todo
    getTodoById(state) {
      return (id: number) => {
        return state.todos.find((todo) => todo.id === id);
      };
    },
  },
});
```

##### 访问`getters`:

- 通过`getters`属性进行访问
  ```js
  export default {
    setup() {
      const store = useStore();
      const doneTodos = store.getters.doneTodos;
      const doneTodosLength = store.getters.doneTodosLength;
      const firstTodo = store.getters.getTodoById(1);
      return {
        doneTodos,
        // doneTodosLength,
        firstTodo,
      };
    },
    // 使用计算属性
    computed: {
      doneTodosLength() {
        return this.$store.getters.doneTodosLength;
      },
    },
  };
  ```

* 通过`mapGetters()`访问

  ```js
  computed: mapGetters({
      doneTodos: "doneTodos",
      doneTodosLength: "doneTodosLength",
    }),
  ```

#### `mutations`

更改 store 中状态对唯一方法为通过 commit mutation

一个`mutations`对象中包含多个 mutation 方法，每个 mutation 由事件类型（type）和回调函数（handler）组成

**每个 mutation 中的回调函数必须为同步函数**

通过回调函数来对状态进行修改，并且每个回调函数都接收`state`作为其第一个参数

##### 定义`mutations`

```js
const store = createStore({
  state: {
    count: 1,
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++;
    },
  },
});
```

##### 触发 mutation 中的回调函数

```js
// 传入mutation中的type值作为参数
store.commit("increment");
```

##### 传递参数 payload

回调函数还接收 payload 作为其第二个参数，一般为一个对象，以便包含多个参数字段

```js
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

调用`increment()`，传入参数`10`

```js
store.commit("increment", 10);
```

或者

```js
mutations: {
  increment (state, payload) {
    state.count += payload.n
  }
}
```

```js
store.commit("increment", {
  n: 10,
});
// 或者将'increment'和n放在一个对象中
store.commit({
  type: "increment",
  n: 10,
});
```

mutation 的 type 值一般都是固定不变且唯一的，故传递时使用常量或者 symbol 来进行代替:

```js
// mutation-types.js
export enum MutationsTypes {
  INCREMENT = 'increment',
}
```

```js
 mutations: {
    [MutationsTypes.INCREMENT](state, payload) {
      state.count += payload.n
    }
  }
```

```js
store.commit({
  type: MutationsTypes.INCREMENT,
  n: 10,
});
```

##### 使用`mapMutations()`

```js
methods: {
    // 使用对象
    // ...mapMutations({
    //   // 将mutations中的increment()方法映射为add属性，在此处进行使用
    //   add : MutationsTypes.INCREMENT,
    // }),
    // 使用数组
    // 获取mutations中的increment()方法
    ...mapMutations(["increment"]),
    clickFn() {
      this.add({ n: 10 });
      this.increment({ n: 10 });
    },
  },
```

#### `actions`

通过`actions`中定义的方法来 commit mutation，解决`mutations`中无异步操作的问题，将异步操作定义在`actions`中

`actions`中的函数接收一个`context`对象作为其第一个参数，该对象与`store`对象具有相同的属性和方法

通过`context.commit()`来 commit 一个 mutation，类似于在组件中使用`store.commit()`来 commit 一个 mutation

还可以通过`contexty.state`和`context.getters`来访问当前`store`对象中的`state`和`getters`

##### 定义`actions`

```js
export const store = createStore({
  state() {
    return {
      count: 1,
    };
  },
  // 创建getters
  getters: {
    countGetter(state) {
      return state.count * 10;
    },
  },
  mutations: {
    [StoreTypes.INCREMENT](state, payload) {
      state.count += payload.n;
    },
  },
  actions: {
    [StoreTypes.INCREMENT](context) {
      // 获取state和getters
      console.log(context.state.count);
      console.log(context.getters.countGetter);
      // commit mutation
      context.commit(StoreTypes.INCREMENT);
    },
    // 也可以使用对象的解构语法
    [StoreTypes.INCREMENT]({ commit }) {
      commit(StoreTypes.INCREMENT);
    },
    // 传递参数给mutation
    [StoreTypes.INCREMENT]({ commit }, payload) {
      commit(StoreTypes.INCREMENT, payload);
    },
  },
});
```

##### 触发`actions`中的方法

通过 dispatch action 实现：

```js
store.dispatch(StoreTypes.INCREMENT);
//传递参数
store.dispatch(StoreTypes.INCREMENT, {
  n: 10,
});
// 或者
commit({
  type: StoreTypes.INCREMENT,
  n: 10,
});
```

##### 异步操作

```js
actions: {
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 模拟异步操作
      setTimeout(() => {
        commit(StoreTypes.INCREMENT, payload);
      }, payload.timeout);
    },
},

// dispatch
store.dispatch(StoreTypes.INCREMENTASYNC, {
        n: 10,
        timeout: 3000,
});
```

##### 使用`mapActions()`

```js
methods: {
    ...mapActions(['incrementAsync']),
    clickFn() {
      this.incrementAsync({
        n: 10,
        timeout : 1000,
      })
    },
```

##### 对 promise 的处理

`store.dispatch`可以对那个被触发的 action 返回的 promise 进行处理，并且仍旧返回一个 promise:

```js
actions: {
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 返回一个promise
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit(StoreTypes.INCREMENT, payload);
          // 成功，则传递success value
          resolve("success value");
        }, payload.timeout);
      });
    },
  },
```

进行 dispatch

```js
methods: {
    ...mapActions(["incrementAsync"]),
    clickFn() {
      this.incrementAsync({
        n: 10,
        timeout: 1000,
      }).then((value) => {
        console.log("value : ", value); // 'value :  success value'
      });
    },
  },
```

`store.dispatch`的结果返回一个 promise：

```js
actions: {
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 返回一个promise
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit(StoreTypes.INCREMENT, payload);
          // 成功，则传递success value
          resolve("success value");
        }, payload.timeout);
      });
    },

    anotherAction({ dispatch, commit }, payload) {
      return dispatch(StoreTypes.INCREMENTASYNC, payload).then((value) => {
        commit("");
        console.log(value); // 'success value'
      })
    }
  },
```

使用 async/await

```js
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

配合过程：用户在页面上发出请求；组件通过`store.dispatch()`调用 `actons` 中的异步方法，访问后端的 API 进行数据的获取；`actions` 中获取到数据之后通过`store.commit()`commit 给 `mutations` 对象中对应的方法，`mutations` 对象再把该数据传递给`state`,对`state`中的对应状态进行修改；state 通知组件，进行页面的响应式更新

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
- reactiveState : 将根模块中的 state 变为响应式 state
