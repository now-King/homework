// 模块一：函数式编程与JS异步编程、手写Promise


/**
 一、简答题
答：（1）异步编程：不同于同步编程的请求-响应模式，其是一种事件驱动编程，
                  请求调用函数或方法后，无需立即等待响应，可以继续执行其他任务，
                  而之前任务响应返回后可以通过状态、通知和回调来通知调用者。
    （2）EventLoop:指的是计算机系统的一种运行机制。
                   例如JS为单线程语言，代码分为同步代码和异步代码，同步代码直接执行栈执行，
                   异步代码则需事件触发后，推入消息队列中等待主线程空闲时，
                   才能以先进先出的顺序执行事件回调，用于保证计算机能有序的处理代码
    （3）消息队列：用于存储等待处理的事件回调
    （4）宏任务：由宿主（Node、浏览器）发起，具体事件为	1. script (可以理解为外层同步代码)；
                2. setTimeout/setInterval；3. UI rendering/UI事件；
                4. postMessage，MessageChannel；5. setImmediate，I/O（Node.js），后运行
    （5）微任务：由JS引擎发起，具体事件为 1. Promise；2. MutaionObserver
                3. Object.observe（已废弃；Proxy 对象替代）；4. process.nextTick（Node.js），
                先运行
 * */

// 代码题

// 一、
let first = new Promise((resolve, reject) => {
    setTimeout(function () {
        var a = 'hello';
        resolve(a);
    }, 3000)
})
first.then((a) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            var b = 'lagou';
            resolve({ a: a, b: b });
        }, 3000)
    })
}).then((res) => {
    setTimeout(function () {
        var c = 'I LOVE U';
        console.log(res.a + res.b + c);
    }, 3000)
})


// 二

// 练习1：
fp.flowRight(fp.prop('in_stock'), fp.last(cars));

// 练习2：
fp.flowRight(fp.prop('name'), fp.first(cars));

// 练习3：
fp.flowRight(_average(), fp.map((car) => { return car.dollar_value }, cars))

// 练习4：
fp.flowRight(fp.join(''), fp.map(_underscore()), arr);


// 三

// 练习1：
let ex1 = () => {
    let x = 0;
    fp.map((elem) => { fp.add(x, elem) }, maybe._value)
    return x;
}

// 练习2：
let ex2 = () => {
    return fp.first(xs._value)
}

// 练习3：


// 练习4：
let ex4 = function (n) {
    return Maybe.of(n).isNothing() ? NaN : Maybe.of(n).map(parseInt);
}


// 四

/*
1.Promise是一个类，包含then方法，有三种状态
2.pending等待 fulfilled完成 rejected失败
    状态变化，一旦改变，不可修改
    只能 pending-->fulfilled , pending-->rejected
3.then方法返回Promise对象
4.传入执行器函数会立即执行
*/

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject);
    }
    status = PENDING;
    result;
    error;
    successQueen = [];
    failQueen = [];
    resolve = (res) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = res;
        while (this.successQueen.length > 0) { this.successQueen.shift()(res) }
    }
    reject = (err) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = err;
        while (this.failQueen.length > 0) { this.failQueen.shift()(err) };
    }
    
    then(successCallback, failCallback) {
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                successCallback(this.result)
            } else if (this.status === REJECTED) {
                failCallback(this.error)
            } else {
                this.successQueen.push(successCallback);
                this.failQueen.push(failCallback);
            }
        })

        return promise2;

    }
}

let promise1 = new MyPromise((resolve, reject) => {
    console.log(new Date().toLocaleTimeString());
    setTimeout(function () {
        console.log(new Date().toLocaleTimeString());
        resolve('成功');

    }, 3000)
    // resolve('成功');
    // reject('失败');
})

promise1.then((res) => {
    console.log('res1', res)
}, (err) => {
    console.log('err1', err)
})
