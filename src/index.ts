// import { Observer } from './common/Observer'
// import { Subject } from './common/Subject'

import { AsyncTaskQueue } from "./utils/AsyncTaskQueue";


// class MyObserver extends Observer<number> {}
// class MySubject extends Subject<number> {}

// // 实例化两个观察者，同时对一个subject进行监听
// const observer = new MyObserver()
// const observer2 = new MyObserver()
// const subject = new MySubject()

// observer.subscribe(subject, (e:any) => {
//     console.log(e) //hello world
// })
// observer2.subscribe(subject, (e:any) => {
//     console.log(e) //hello world
// })

// // 延时激活观察者注册的函数，传递参数
// setTimeout(subject.fireEvent.bind(subject, 100), 1000)

import { TaskQueue } from "./utils/TaskQueue";
const taskQueue = new TaskQueue();

const basicPromise = (name: string, isSucess: boolean, time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(name, isSucess);
            isSucess ? resolve(name) : reject("error " + name);
        }, time);
    })
}

// const task1 = basicPromise('task1', true, 2000)
// const task2 = basicPromise('task2', false, 1000).catch(err => err)  
// const task3 = basicPromise('task3', true, 3000)

taskQueue.push(() => basicPromise('task1', true, 2000))
taskQueue.push(() => basicPromise('task2', false, 1000))
taskQueue.push(() => basicPromise('task3', true, 3000))
setTimeout(() => {
    taskQueue.push(() => basicPromise('task4', true, 3000))
}, 5000);

// // 使用示例
// const taskQueue = new AsyncTaskQueue();

// // 将任务加入队列
// taskQueue.enqueueTask(() => task1);
// taskQueue.enqueueTask(() => task2);
// taskQueue.enqueueTask(() => task3);