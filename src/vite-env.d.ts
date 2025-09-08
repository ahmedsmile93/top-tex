interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEFAULT_USER_ID: string;
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
