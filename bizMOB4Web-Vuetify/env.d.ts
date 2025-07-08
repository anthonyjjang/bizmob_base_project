/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_NODE_ENV: string;
    readonly VITE_APP_PROXY: string;
    readonly VITE_APP_PROXY_CONTEXT: string;
    readonly VITE_APP_SERVER_CONTEXT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}