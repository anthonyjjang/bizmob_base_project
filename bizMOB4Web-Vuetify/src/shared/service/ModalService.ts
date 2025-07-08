// src/services/ModalService.ts
import { createApp, h, ref } from 'vue';
import vuetify from '@/plugins/vuetify';
import ModalLayout from '@/layouts/modal/ModalLayout.vue';

interface ModalOptions<T> {
  props: T;
}

const modalComponent = ref<null | InstanceType<typeof ModalLayout>>(null);

const mountModal = async <T>(ModalComponent: any, options: ModalOptions<T>): Promise<void> => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    return new Promise<void>((resolve) => {
        const app = createApp({
            render() {
                return h(ModalComponent, {
                    ...options.props,
                    onClose: (result: any) => {
                        resolve(result);
                        app.unmount();
                    }
                });
            }
        });

        app.use(vuetify);
        app.mount(container);

        // vuetify 렌더링 이후 div 컨테이너는 필요가 없음
        document.body.removeChild(container);
    });
};

const showModal = (modal: any, options: any): Promise<any> => {
    return new Promise((resolve) => {
        if (modalComponent.value) {
            modalComponent.value.showModal(resolve, modal, options);
        }
    });
};

export default {
    mountModal,
    showModal
};
