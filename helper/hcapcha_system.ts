class CapchaListener {

    private static isHandling: Boolean = false;
    private static callbacks: Array<CallBackType> = [];

    static addListener(callbackFunction: CallBackType) {
     this.callbacks  = [callbackFunction];
    }

    static removeListener(callbackFunction: CallBackType) {
     this.callbacks = [];
    }

    static async notify(data: any): Promise<boolean> {
        if (!this.isHandling && this.callbacks.length) {
            this.isHandling = true;
            
            let result = await this.callbacks[0](data);

            this.isHandling = false;

            return Promise.resolve(Boolean(result));
        }
        return Promise.resolve(false);
    }
}
type CallBackType = (data: any) => void;

export default CapchaListener;