interface RawImportMetaEnv {
  readonly VITE_GL_API_BASE_URL?: string;
  readonly VITE_ESTATICO_BASE_URL?: string;
  readonly VITE_FEATURE_VIRTUAL_GALLERY?: string;
}

export interface AppEnv {
  readonly glApiBaseUrl: string;
  readonly estaticoBaseUrl: string;
  readonly featureVirtualGallery: boolean;
}

const rawEnv = import.meta.env as RawImportMetaEnv;

/**
 * Converts a raw environment variable value to a boolean.
 * Only the string 'true' (case-insensitive) is considered true.
 *
 * @param value Raw env value
 * @returns Parsed value
 */
function asBoolean(value?: string): boolean {
  if (!value) {
    return false;
  }

  return value.trim().toLowerCase() === 'true';
}

export const env: AppEnv = {
  glApiBaseUrl: rawEnv.VITE_GL_API_BASE_URL ?? '',
  estaticoBaseUrl: rawEnv.VITE_ESTATICO_BASE_URL ?? '',
  featureVirtualGallery: asBoolean(rawEnv.VITE_FEATURE_VIRTUAL_GALLERY),
};
