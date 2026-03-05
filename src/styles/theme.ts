export const zIndexes = [
  'normal',
  'header',
  'dropdown',
  'overlay',
  'modal',
  'toast',
] as const;

type ZIndexToken = (typeof zIndexes)[number];

const zIndexMap = Object.fromEntries(
  zIndexes.map((token, index) => [token, index]),
) as Record<ZIndexToken, number>;

export const theme = {
  colors: {
    background: '#f9fafb',
    surface: '#ffffff',
    surfaceSubtle: '#f3f4f6',
    border: '#e5e7eb',
    text: '#111827',
    textMuted: '#6b7280',
    primary: '#4f46e5',
    primarySoft: '#eef2ff',
    danger: '#dc2626',
    dangerSoft: '#fef2f2',
    success: '#16a34a',
    successSoft: '#ecfdf3',
    badgeNeutralBg: '#e5e7eb',
    badgeNeutralText: '#374151',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    pill: '999px',
  },
  shadows: {
    card: '0 10px 15px -3px rgba(15,23,42,0.08)',
  },
  zIndexes: zIndexMap,
} as const;

export type AppTheme = typeof theme;

