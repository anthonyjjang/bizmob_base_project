const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const Webpack = require('webpack'); // webpack 라이브러리를 불러옵니다.
const { defineConfig } = require('@vue/cli-service');

// ProxyServer 쿠키제어
let cookie = undefined;

module.exports = defineConfig({
    // Bundle 파일 경로 설정
    outputDir: process.env.VUE_APP_BUILD_DIR,

    // 파일명 해싱 설정
    filenameHashing: false,

    // .map 파일 생성 여부 설정
    productionSourceMap: process.env.NODE_ENV === 'development',

    // 웹용 배포시 rootPath 설정시 public 경로 지정
    publicPath: process.env.BASE_URL,

    // CSS 관련 옵션 설정
    css: {
        sourceMap: process.env.NODE_ENV === 'development', // 개발모드인 경우 CSS 소스맵 On
        loaderOptions: {
            sass: {
                implementation: require('sass'), // This line must in sass option
            },
        },
    },

    // 개발용 Proxy 서버 설정
    devServer: {
    // 경고 overlay false
        client: {
            overlay: false,
        },
        // Client dev server https 셋팅 -- true인 경우 key와 cert를 셋팅해야 함
        https: false,
        // sock-js 오류로 인한 설정
        host: '0.0.0.0',
        // POST 통신을 위한 프록시 서버 설정
        proxy: {
            [process.env.VUE_APP_PROXY_CONTEXT]: {
                target: process.env.VUE_APP_SERVER_URL,
                pathRewrite: {
                    [`^${process.env.VUE_APP_PROXY_CONTEXT}`] : process.env.VUE_APP_SERVER_CONTEXT
                },
                https: true,
                changeOrigin: true,
                secure: false,
                historyApiFallback: true, // 프록시 로그 관련
                logLevel: 'debug', // 프록시 로그 관련
                onProxyReq: (proxyReq, req, res) => {
                    const path = req.url.split('/').pop();

                    if (path !== 'BM4001.json' && cookie) {
                        // 기존 쿠키값
                        const originCookie = proxyReq._headers.cookie ? `${proxyReq._headers.cookie}; ` : '';
                        const headerCookie = `${originCookie}${cookie.join('; ')}`;
                        // 프록시 req 쿠키 셋팅
                        proxyReq.setHeader('cookie', headerCookie);
                        console.log('[bizMOB] Cookie is set.', headerCookie);
                    }
                },
                onProxyRes: (proxyRes, req, res) => {
                    const protocol = process.env.VUE_APP_SERVER_URL.split('://')[0];
                    const path = req.url.split('/').pop();
                    const cookieEnableTrCodes = ['LOGIN.json' ,'BM4001.json' ,'BM4002.json' ];

                    // 로그인 전문인 경우 쿠키 저장
                    if (protocol.trim() === 'http' && (cookieEnableTrCodes.indexOf(path) > -1 ) ) {
                        cookie = proxyRes.headers['set-cookie'];
                        console.log('[bizMOB] Cookie is saved.', cookie);
                    }
                    // ZZ0007 전문인 경우 쿠키 초기화
                    else if (protocol === 'http' && path === 'ZZ0007.json') {
                        cookie = undefined;
                        console.log('[bizMOB] Cookie is clear.', cookie);
                    }
                }
            }
        }
    },

    // 웹팩 체이닝 설정
    chainWebpack: (config) => {
    // 웹팩 추가 옵션 설정
        config.plugins.store.delete('prefetch');

        // Copy 옵션 수정
        config.plugin('copy').tap(([ options ]) => {
            const ignoreDirs = (process.env.VUE_APP_IGNORE_DIRS || '').split(',').map(dir => dir.trim());

            // 빌드시 무시항 public 폴더
            ignoreDirs.forEach(path => {
                options.patterns[0].globOptions.ignore.push(path);
            });

            // 수정된 option 반환
            return [ options ];
        });

        // 분할된 청크
        config.optimization.splitChunks({
            chunks: 'all'
        });
    },

    // 웹팩 설정
    configureWebpack: {
    // 프록시 서버 로그 관련
        infrastructureLogging: {
            debug: [name => name.includes('webpack-dev-server')],
        },

        // 웹팩 플러그인 설정
        plugins: [
            // Webpack DefinePlugin 설정
            new Webpack.DefinePlugin({
                __VUE_OPTIONS_API__: JSON.stringify(true), // 옵션 API 지원 ON/OFF
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // 프로덕션 빌드에서 devtools 지원 ON/OFF
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // hydration mismatch 오류의 디테일을 제공 ON/OFF
            }),

            // 필수 리소스 사전 로드
            new PreloadWebpackPlugin({
                rel: 'preload',
                include: 'initial', // 초기 청크에 포함된 리소스
                as(entry) {
                    // 폰트 지원
                    if (entry.endsWith('.woff') || entry.endsWith('.woff2') || entry.endsWith('.ttf') || entry.endsWith('.otf')) {
                        return 'font';
                    }
                    // 이미지 지원
                    else if (entry.endsWith('.png') || entry.endsWith('.jpg') || entry.endsWith('.jpeg') || entry.endsWith('.svg') || entry.endsWith('.gif')) {
                        return 'image';
                    }
                    // CSS 파일
                    else if (entry.endsWith('.css')) {
                        return 'style';
                    }
                    // 기본적으로는 스크립트로 처리
                    else {
                        return 'script';
                    }
                },
                fileBlacklist: [/\.map$/, /\.hot-update\.js$/] // 불필요한 파일 제외
            }),

            // 나중에 필요할 가능성이 있는 리소스 미리 가져오기
            new PreloadWebpackPlugin({
                rel: 'prefetch',
                include: 'asyncChunks' // 비동기 청크
            })
        ],

        // 'globalObject' 속성은 웹팩이 번들을 생성할 때 사용할 전역 객체를 지정
        output: {
            globalObject: 'this' // 모든 환경에서의 호환성을 위해 'this'로 설정
        }
    },

    pluginOptions: {
        i18n: {
            locale: process.env.VUE_APP_I18N_LOCALE,
            fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
            localeDir: 'locales', // 로케일 파일이 저장되는 디렉토리의 경로
            enableLegacy: false, // 이전 버전과의 호환성 off
            runtimeOnly: false, // 번역 작업을 런타임에만 처리할지 여부 off
            compositionOnly: false, // Vue 3의 Composition API만을 사용하여 i18n 기능을 구현할지 여부 off
            fullInstall: true, // vue-i18n 라이브러리의 전체 기능을 설치할지 여부 on
        }
    }
});