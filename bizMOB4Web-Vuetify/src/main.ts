import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import persistedState from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import messages from '@/locales';
import vuetify from '@/plugins/vuetify';

/* Custom CSS */
import '@/assets/css/global.scss';

/** bizMOB Initialize */
import Config from '@/bizMOB/Xross/Config';

Config.set('APP', 'App', {
    _bIsRelease: import.meta.env.NODE_ENV === 'production', // 릴리즈 여부
    _sAppKey: import.meta.env.VITE_APP_APPLICATION_KEY, // App Key
});

Config.set('WEB', 'App', {
    _bIsRelease: import.meta.env.NODE_ENV === 'production', // 릴리즈 여부
    _sAppKey: import.meta.env.VITE_APP_APPLICATION_KEY, // App Key
});

Config.set('WEB', 'Network', {
    _sBaseUrl: import.meta.env.BASE_URL, // Client Base url
    _sApiContext: import.meta.env.VITE_APP_SERVER_CONTEXT, // 서버 Context
    _sProxContext: import.meta.env.VITE_APP_PROXY_CONTEXT, // 프록시 Context
    _bIsProxy: import.meta.env.VITE_APP_PROXY === 'on', // 프록시 사용 여부
    _bIsCrypto: import.meta.env.VITE_APP_ENCRYPTION_USE === 'true', // 암호화 사용 여부
});

import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

import VueScrollTo from 'vue-scrollto';

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(createPinia().use(persistedState));
app.use(PerfectScrollbarPlugin);
app.use(VueScrollTo, {
    duration: 1000,
    easing: 'ease'
});
app.use(createI18n({
    locale: 'en',
    messages: messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true
}));
app.mount('#app');

export default app;