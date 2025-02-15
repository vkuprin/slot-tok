/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_PEXELS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
