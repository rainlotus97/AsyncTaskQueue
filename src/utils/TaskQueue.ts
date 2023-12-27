import { CenterMessage } from "./CenterMessage";

export type CallbackFunction = (data?: any) => Promise<any>;

/* 
    队列状态 idle:空闲 pending:等待 fulfilled:完成 rejected:失败
*/
type IState = "idle" | "pending" | "fulfilled" | "rejected";

export class TaskQueue {
    private queues: CallbackFunction[] = [];
    private state: IState = "idle";
    private messageCenter: CenterMessage = CenterMessage.getInstance();
    constructor() {
        this.init();
    }

    private init() {
        this.messageCenter.register("push:handler", this.run)
        this.messageCenter.register("run:success:handler", this.run)
        this.messageCenter.register("run:error:handler", this.run)
    }

    public push = (queue: CallbackFunction) => {
        this.queues.push(queue);
        this.messageCenter.trigger("push:handler");
    }

    public clear = () => {
        this.queues = [];
        this.messageCenter.clear();
    }


    private run = async () => {
        if (this.stateProxy() === "pending") {
            return;
        }
        if (this.queues.length === 0) {
            return this.stateProxy("idle");
        }
        this.stateProxy("pending");
        const queue = this.queues.shift() as CallbackFunction;
        try {
            let res = await queue().catch(err => err);
            return this.handlerSuccess(res);
        } catch (error) {
            console.log(error);
            return this.handlerError(error)
        }
    }

    /* 
        设置、获取当前队列状态
    */
    private stateProxy(state?: IState) {
        state && (this.state = state);
        return this.state;
    }

    /**
     * 单次队列执行成功
     * @param data { res, queues }
     * @returns 
     */
    private handlerSuccess = (data: any) => {
        this.stateProxy("fulfilled")
        console.log(data, this.queues.length);
        Promise.resolve()
        return this.messageCenter.trigger("run:success:handler", data)
    }

    /**
     * 单次队列执行失败
     * @param data { res, queues, error }
     * @returns 
     */
    private handlerError = (data: any) => {
        this.stateProxy("rejected")
        console.log(data, "error");

        Promise.resolve(data);
        return this.messageCenter.trigger("run:error:handler", data)
    }
}