// frontend/src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // añade aquí otras VITE_ variables que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
