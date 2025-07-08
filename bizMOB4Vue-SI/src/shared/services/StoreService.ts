import { DispatchOptions, useStore } from 'vuex';
import store from '@/store';

export default class StoreService {
    private namespace: string;

    constructor(namespace: string) {
        this.namespace = namespace + '/';
    }

    /**
   * getters
   */
    public getters(type: string, param?: any): any {
        if (param !== undefined) {
            return store.getters[this.namespace + type](param);
        }
        else {
            const getter = store.getters[this.namespace + type];

            if (typeof getter === 'function') {
                return getter();
            }
            else {
                return store.getters[this.namespace + type];
            }
        }
    }

    /**
   * dispatch
   */
    public dispatch(type: string, payload?: any, options?: DispatchOptions | undefined): Promise<any> {
        return store.dispatch(this.namespace + type, payload, options);
    }
}