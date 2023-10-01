/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_LASTFM_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
