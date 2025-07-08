import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import Vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 현재 작업 디렉터리의 `mode`를 기반으로 env 파일을 불러옴
    // 세 번째 매개변수를 ''로 설정하면 `VITE_` 접두사에 관계없이 모든 환경 변수를 불러옴
    const env = loadEnv(mode, process.cwd(), '');
    let cookie: string[] | undefined;

    return {
        plugins: [
            vue(),
            vueDevTools(),
            Vuetify({
                autoImport: true,
                styles: {
                    configFile: 'src/materialpro/scss/variables.scss',
                },
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        optimizeDeps: {
            exclude: ['vuetify'],
            entries: ['./src/**/*.vue']
        },
        server: {
            // POST 통신을 위한 프록시 서버 설정
            proxy: {
                ['/bizmob.filedownload']: {
                    target: env.VITE_APP_SERVER_URL,
                    rewrite: (path: string) =>
                        path.replace(new RegExp('^/bizmob.filedownload'), '/mvp-server-web/pcdownload/attach'),
                    https: true,
                    changeOrigin: true,
                    secure: false,
                },
                [env.VITE_APP_PROXY_CONTEXT as string]: {
                    target: env.VITE_APP_SERVER_URL,
                    rewrite: (path: string) =>
                        path.replace(new RegExp(`^${env.VITE_APP_PROXY_CONTEXT}`), env.VITE_APP_SERVER_CONTEXT as string),
                    https: true,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy, options) => {
                        proxy.on('proxyReq', (proxyReq, req, res) => {
                            const path = req.url?.split('/').pop();
                            if (path !== 'BM4001.json' && cookie) {
                                // 기존 쿠키값
                                const originCookie = proxyReq.getHeader('cookie') ? `${proxyReq.getHeader('cookie')}; ` : '';
                                const headerCookie = `${originCookie}${cookie.join('; ')}`;
                                // 프록시 req 쿠키 셋팅
                                proxyReq.setHeader('cookie', headerCookie);
                                console.log('[bizMOB] Cookie is set.', headerCookie);
                            }
                        });
                        proxy.on('proxyRes', (proxyRes, req, res) => {
                            const protocol = env.VITE_APP_SERVER_URL?.split('://')[0];
                            const path = req.url?.split('/').pop();
                            const cookieEnableTrCodes = ['LOGIN.json', 'BM4001.json', 'BM4002.json'];

                            // 로그인 전문인 경우 쿠키 저장
                            if (protocol?.trim() === 'http' && cookieEnableTrCodes.includes(path || '')) {
                                cookie = proxyRes.headers['set-cookie'];
                                console.log('[bizMOB] Cookie is saved.', cookie);
                            }
                            // ZZ0007 전문인 경우 쿠키 초기화
                            else if (protocol === 'http' && path === 'ZZ0007.json') {
                                cookie = undefined;
                                console.log('[bizMOB] Cookie is clear.', cookie);
                            }
                        });
                    },
                },
            },
        }
    };
});
