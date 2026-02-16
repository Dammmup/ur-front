/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_API_URL: string;
    // другие переменные окружения, если они есть
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
