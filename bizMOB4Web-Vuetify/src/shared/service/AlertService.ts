// src/services/AlertService.ts
import { createApp, defineComponent, h, reactive } from 'vue';
import { VDialog, VCard, VCardTitle, VCardText, VSpacer, VCardActions, VBtn } from 'vuetify/components';
import vuetify from '@/plugins/vuetify';

interface AlertOptions {
    title?: string;
    message: string;
    buttons: { text: string, value: any }[];
}

interface AlertState {
    visible: boolean;
    resolve: ((value: any) => void) | null;
    options: AlertOptions | null;
}

const alertState: AlertState = reactive({
    visible: false,
    resolve: null,
    options: null,
});

const AlertComponent = defineComponent({
    setup() {
        const closeAlert = (value: any) => {
            if (alertState.resolve) {
                alertState.resolve(value);
            }
            alertState.visible = false;
        };

        return () => alertState.visible && h(
            VDialog,
            {
                modelValue: alertState.visible,
                'onUpdate:modelValue': (val: boolean) => alertState.visible = val,
                persistent: true,
                class: 'dialog-mw'
            },
            () => h(VCard, {
                class: 'pa-6'
            }, () => [
                alertState.options?.title && h(VCardTitle, {
                    class: 'text-h5'
                }, () => alertState.options?.title),
                h(VCardText, {}, () => alertState.options?.message),
                h(VCardActions, {}, () => [
                    h(VSpacer),
                    ...(alertState.options?.buttons ?? []).map(button =>
                        h(VBtn, {
                            color: 'green darken-1',
                            variant: 'text',
                            flat: true,
                            onClick: () => closeAlert(typeof button.value === 'function' ? button.value() : button.value)
                        }, () => button.text))
                ]),
            ])
        );
    },
});

const mountAlert = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const app = createApp(AlertComponent);
    app.use(vuetify);
    app.mount(container);
};

let alertMounted = false;

const show = (options: AlertOptions): Promise<any> => {
    if (!alertMounted) {
        mountAlert();
        alertMounted = true;
    }

    return new Promise<any>((resolve) => {
        alertState.options = options;
        alertState.resolve = resolve;
        alertState.visible = true;
    });
};

export default {
    show
};
