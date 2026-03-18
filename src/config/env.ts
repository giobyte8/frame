interface RawImportMetaEnv {
  readonly VITE_GL_API_BASE_URL?: string;
  readonly VITE_ESTATICO_BASE_URL?: string;
}

export interface AppEnv {
  readonly glApiBaseUrl: string;
  readonly estaticoBaseUrl: string;
}

const rawEnv = import.meta.env as RawImportMetaEnv;

export const env: AppEnv = {
  glApiBaseUrl: rawEnv.VITE_GL_API_BASE_URL ?? '',
  estaticoBaseUrl: rawEnv.VITE_ESTATICO_BASE_URL ?? '',
};
