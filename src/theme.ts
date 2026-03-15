export const theme = {
  colors: {
    background: '#f5f7fa',
    surface: '#ffffff',
    border: '#d9d9d9',
    textPrimary: '#111827',
    textMuted: '#6b7280',
    dangerBg: '#fff1f0',
    dangerBorder: '#ffa39e',
    dangerText: '#cf1322',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
  },
  radius: {
    sm: '8px',
    md: '12px',
  },
  layout: {
    maxContentWidth: '1200px',
  },
};

export type AppTheme = typeof theme;
