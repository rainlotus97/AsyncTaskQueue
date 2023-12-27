import { CallbackFunction } from "../constant/constant";
export class CenterMessage {
    private observerList: Map<string, CallbackFunction<any>> = new Map<string, CallbackFunction<any>>();
    private static instance: CenterMessage;
    private constructor() { }

    public static getInstance(): CenterMessage {
        if (!CenterMessage.instance) {
            CenterMessage.instance = new CenterMessage();
        }
        return CenterMessage.instance;
    }

    trigger(key: string, data?: any) {
        this.observerList.forEach((item, observerKey) => {
            if (key === observerKey) {
                item(data);
            }
        });
    }

    register(key: string, observer: CallbackFunction<any>) {
        if (!this.observerList.has(key)) {
            this.observerList.set(key, observer);
        }
    }

    unregister(key: string) {
        if (this.observerList.has(key)) {
            this.observerList.delete(key);
        }
    }

    clear() {
        this.observerList.clear();
    }
}



