import { config as v3Config } from '@tamagui/config/v3'
import { createFont, createTamagui, createTokens } from '@tamagui/core'

// ─── Fonts ────────────────────────────────────────────────────────────────────

const interFont = createFont({
  family: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  size:        { 1: 11, 2: 12, 3: 13, 4: 14, 5: 16, 6: 18, 7: 20, 8: 24, 9: 28, 10: 32, 11: 40, 12: 48 },
  lineHeight:  { 1: 16, 2: 18, 3: 20, 4: 20, 5: 24, 6: 28, 7: 28, 8: 32, 9: 36, 10: 40, 11: 48, 12: 56 },
  weight:      { 4: '400', 5: '500', 6: '600', 7: '700' },
  letterSpacing: { 4: 0, 5: -0.1, 6: -0.2, 7: -0.3 },
})

// ─── Tokens ───────────────────────────────────────────────────────────────────

const tokens = createTokens({
  zIndex: { ...v3Config.tokens.zIndex },

  // 4px base unit — matches Chakra spacing scale
  space: {
    0: 0,  1: 4,  2: 8,  3: 12, 4: 16,
    5: 20, 6: 24, 8: 32, 10: 40, 12: 48,
    16: 64, 20: 80, 24: 96,
    true: 16,
  },

  // Mirrors Chakra radii: xs→1, sm→2, md→3, lg→4, xl→5, full→10
  radius: {
    0: 0,  1: 4,  2: 6,  3: 10, 4: 14,
    5: 20, 10: 9999,
    true: 10,
  },

  // Control + icon sizes from Chakra
  size: {
    ...v3Config.tokens.size,
    controlSm: 36,  controlMd: 44,  controlLg: 52,
    iconSm: 16,     iconMd: 20,     iconLg: 24,
    iconXl: 28,     icon2xl: 32,    icon3xl: 36,     icon4xl: 40,
    boxSm: 380,     boxMd: 480,     boxLg: 580,
    true: 44,
  },

  // Brand color primitives + v3 palette
  color: {
    ...v3Config.tokens.color,
    brand:       '#88172C',
    brandDark:   '#5F0F1F',
    brandSubtle: '#EFEDEA',
    white:       '#ffffff',
    black:       '#000000',
    textPrimary: '#18181B',
    textMuted:   '#6B7280',
    divider:     '#E5E7EB',
    glass1:      'rgba(255,255,255,0.14)',
    glass2:      'rgba(255,255,255,0.22)',
    glass3:      'rgba(255,255,255,0.34)',
    overlay:     'rgba(0,0,0,0.4)',
  },
})

// ─── Light theme ──────────────────────────────────────────────────────────────

const lightTheme = {
  ...v3Config.themes.light,

  background:            '#ffffff',
  backgroundHover:       '#EFEDEA',
  backgroundPress:       '#EFEDEA',
  backgroundFocus:       '#ffffff',
  backgroundStrong:      '#EFEDEA',
  backgroundTransparent: 'rgba(255,255,255,0)',

  color:              '#18181B',
  colorHover:         '#18181B',
  colorPress:         '#18181B',
  colorFocus:         '#18181B',
  colorTransparent:   'rgba(24,24,27,0)',
  placeholderColor:   '#6B7280',

  borderColor:        '#E5E7EB',
  borderColorHover:   '#88172C',
  borderColorFocus:   '#88172C',
  borderColorPress:   '#5F0F1F',

  shadowColor:        'rgba(136,23,44,0.15)',
  shadowColorHover:   'rgba(136,23,44,0.22)',
  outlineColor:       'rgba(136,23,44,0.32)',

  brandColor:            '#88172C',
  brandColorDark:        '#5F0F1F',
  brandColorSubtle:      '#EFEDEA',
  textMuted:             '#6B7280',
  textInverse:           '#ffffff',
  cardBackground:        '#EFEDEA',
  dividerColor:          '#E5E7EB',
  overlayColor:          'rgba(0,0,0,0.4)',
  glassBackground:       'rgba(255,255,255,0.14)',
  glassBackgroundStrong: 'rgba(255,255,255,0.22)',
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const tamaguiConfig = createTamagui({
  ...v3Config,
  fonts: {
    heading: interFont,
    body:    interFont,
  },
  tokens,
  themes: {
    ...v3Config.themes,
    light: lightTheme,
  },
})

export type AppConfig = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
