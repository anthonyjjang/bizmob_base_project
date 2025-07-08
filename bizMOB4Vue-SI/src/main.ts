import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from '@/bizMOB/i18n';
import store from '@/store';

/* Ionic basic Classes */
import { IonicVue, IonPage, IonHeader, IonContent, IonFooter, IonModal } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Custom CSS */
import '@/assets/css/global.scss';

/** bizMOB Initialize */
import Config from '@/bizMOB/Xross/Config';

Config.set('APP', 'App', {
    _bIsRelease: process.env.NODE_ENV === 'production', // 릴리즈 여부
    _sAppKey: process.env.VUE_APP_APPLICATION_KEY, // App Key
});

Config.set('WEB', 'App', {
    _bIsRelease: process.env.NODE_ENV === 'production', // 릴리즈 여부
    _sAppKey: process.env.VUE_APP_APPLICATION_KEY, // App Key
});

Config.set('WEB', 'Network', {
    _sBaseUrl: process.env.BASE_URL, // Client Base url
    _sApiContext: process.env.VUE_APP_SERVER_CONTEXT, // 서버 Context
    _sProxContext: process.env.VUE_APP_PROXY_CONTEXT, // 프록시 Context
    _bIsProxy: process.env.VUE_APP_PROXY === 'on', // 프록시 사용 여부
    _bIsCrypto: process.env.VUE_APP_ENCRYPTION_USE === 'true', // 암호화 사용 여부
});

/** Vue App Create */
const app = createApp(App)
    .use(IonicVue, {
        innerHTMLTemplatesEnabled: true,
        mode: 'md',
    })
    .use(i18n)
    .use(store)
    .use(router);

/** Global Components */
import { AppHeader } from '@/components';
app
    .component('IonPage', IonPage)
    .component('IonHeader', IonHeader)
    .component('IonContent', IonContent)
    .component('IonFooter', IonFooter)
    .component('IonModal', IonModal)
    .component('AppHeader', AppHeader);

/** App Ready */
router.isReady().then(() => {
    app.mount('#app');
});