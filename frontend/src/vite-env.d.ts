/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STREAM_API_KEY: string;
    readonly VITE_STREAM_USER_ID: string;
    readonly VITE_STREAM_USER_NAME: string;
    readonly VITE_BACKEND_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  