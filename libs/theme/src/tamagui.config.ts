import { defaultConfig } from '@tamagui/config/v4'
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
// In Tamagui v4: colors live in themes, not tokens.
// Tokens hold space, size, radius, zIndex — and static color primitives.

const tokens = createTokens({
  // Keep defaults for zIndex; override the rest
  zIndex: { ...defaultConfig.tokens.zIndex },

  // 4px base unit — matches Chakra spacing scale exactly
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
    ...defaultConfig.tokens.size,
    controlSm: 36,  controlMd: 44,  controlLg: 52,
    iconSm: 16,     iconMd: 20,     iconLg: 24,
    iconXl: 28,     icon2xl: 32,    icon3xl: 36,     icon4xl: 40,
    boxSm: 380,     boxMd: 480,     boxLg: 580,
    true: 44,
  },

  // Static brand color primitives (theme-independent)
  color: {
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
// Overrides Tamagui's built-in light theme with the app's semantic palette.
// Keys prefixed with $ will be usable as token references in components.

const lightTheme = {
  // Spread Tamagui default light values first, then override
  ...(defaultConfig.themes as Record<string, object>).light,

  // Backgrounds
  background:            '#ffffff',
  backgroundHover:       '#EFEDEA',
  backgroundPress:       '#EFEDEA',
  backgroundFocus:       '#ffffff',
  backgroundStrong:      '#EFEDEA',
  backgroundTransparent: 'rgba(255,255,255,0)',

  // Text
  color:              '#18181B',
  colorHover:         '#18181B',
  colorPress:         '#18181B',
  colorFocus:         '#18181B',
  colorTransparent:   'rgba(24,24,27,0)',
  placeholderColor:   '#6B7280',

  // Borders
  borderColor:        '#E5E7EB',
  borderColorHover:   '#88172C',
  borderColorFocus:   '#88172C',
  borderColorPress:   '#5F0F1F',

  // Shadows (brand-tinted, from Chakra shadow tokens)
  shadowColor:        'rgba(136,23,44,0.15)',
  shadowColorHover:   'rgba(136,23,44,0.22)',
  outlineColor:       'rgba(136,23,44,0.32)',

  // App-specific semantic tokens (accessible as $brandColor, $cardBackground, etc.)
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
  ...defaultConfig,
  fonts: {
    heading: interFont,
    body:    interFont,
  },
  tokens,
  themes: {
    ...defaultConfig.themes,
    light: lightTheme,
  },
})

export type AppConfig = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
