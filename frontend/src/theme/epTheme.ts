export interface EduPulseTheme {
  id: string;
  name: string;
  tagline: string;
  primary: string;
  secondary: string;
  background: string;
  sidebar: string;
  card: string;
  cardSub: string;
  cardHover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  gradientStart: string;
  gradientEnd: string;
  glow: string;
  button: string;
  buttonHover: string;
  inputBackground: string;
  previewGradient: string;
  light: {
    background: string;
    sidebar: string;
    card: string;
    cardSub: string;
    cardHover: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    button: string;
    buttonHover: string;
    inputBackground: string;
    glow: string;
  };
}

export interface ThemeConfig {
  themeId: string;
  mode: 'dark' | 'light';
  accentColor: string;
  accentName: string;
  sidebarPosition: 'left' | 'top' | 'right';
  compactDensity: boolean;
  backgroundId?: string;
  primary?: string;
  secondary?: string;
  gradientStart?: string;
  gradientEnd?: string;
  glow?: string;
}

export const EDU_PULSE_THEMES: EduPulseTheme[] = [
  {
    id: 'midnight-emerald',
    name: 'Midnight Emerald',
    tagline: 'Deep Slate with Emerald & Cyan Radiance',
    primary: '#10B981',
    secondary: '#06B6D4',
    background: '#080D19',
    sidebar: '#0B1220',
    card: '#172235',
    cardSub: '#1D2B40',
    cardHover: '#1E2F48',
    border: 'rgba(16, 185, 129, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#10B981',
    gradientEnd: '#06B6D4',
    glow: 'rgba(16, 185, 129, 0.35)',
    button: '#10B981',
    buttonHover: '#059669',
    inputBackground: 'rgba(11, 18, 32, 0.75)',
    previewGradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    light: {
      background: '#F0FDF4',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#F0FDF4',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#10B981',
      buttonHover: '#059669',
      inputBackground: '#FFFFFF',
      glow: 'rgba(16, 185, 129, 0.2)'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    tagline: 'Deep Maritime Navy with Electric Blue & Cyan',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    background: '#080E1C',
    sidebar: '#0B1426',
    card: '#172640',
    cardSub: '#1E3152',
    cardHover: '#1E355C',
    border: 'rgba(59, 130, 246, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#3B82F6',
    gradientEnd: '#06B6D4',
    glow: 'rgba(59, 130, 246, 0.35)',
    button: '#3B82F6',
    buttonHover: '#2563EB',
    inputBackground: 'rgba(11, 20, 38, 0.75)',
    previewGradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    light: {
      background: '#EFF6FF',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#EFF6FF',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#3B82F6',
      buttonHover: '#2563EB',
      inputBackground: '#FFFFFF',
      glow: 'rgba(59, 130, 246, 0.2)'
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    tagline: 'Imperial Midnight with Violet & Magenta Glow',
    primary: '#8B5CF6',
    secondary: '#D946EF',
    background: '#100B1D',
    sidebar: '#150F27',
    card: '#211934',
    cardSub: '#2A2044',
    cardHover: '#2E224D',
    border: 'rgba(139, 92, 246, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#8B5CF6',
    gradientEnd: '#D946EF',
    glow: 'rgba(139, 92, 246, 0.35)',
    button: '#8B5CF6',
    buttonHover: '#7C3AED',
    inputBackground: 'rgba(21, 15, 39, 0.75)',
    previewGradient: 'linear-gradient(135deg, #8B5CF6, #D946EF)',
    light: {
      background: '#FAF5FF',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#FAF5FF',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#8B5CF6',
      buttonHover: '#7C3AED',
      inputBackground: '#FFFFFF',
      glow: 'rgba(139, 92, 246, 0.2)'
    }
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    tagline: 'Warm Dark Espresso with Amber & Tangerine Fire',
    primary: '#F59E0B',
    secondary: '#F97316',
    background: '#130E0A',
    sidebar: '#1B130C',
    card: '#292016',
    cardSub: '#362A1E',
    cardHover: '#3C2E21',
    border: 'rgba(245, 158, 11, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#F59E0B',
    gradientEnd: '#F97316',
    glow: 'rgba(245, 158, 11, 0.35)',
    button: '#F59E0B',
    buttonHover: '#D97706',
    inputBackground: 'rgba(27, 19, 12, 0.75)',
    previewGradient: 'linear-gradient(135deg, #F59E0B, #F97316)',
    light: {
      background: '#FFFBEB',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#FFFBEB',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#F59E0B',
      buttonHover: '#D97706',
      inputBackground: '#FFFFFF',
      glow: 'rgba(245, 158, 11, 0.2)'
    }
  },
  {
    id: 'arctic-cyan',
    name: 'Arctic Cyan',
    tagline: 'Glacial Abyssal Blue with Cyan & Sky Auroras',
    primary: '#06B6D4',
    secondary: '#0EA5E9',
    background: '#071219',
    sidebar: '#0A1822',
    card: '#142936',
    cardSub: '#1B3647',
    cardHover: '#1E3C4E',
    border: 'rgba(6, 182, 212, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#06B6D4',
    gradientEnd: '#0EA5E9',
    glow: 'rgba(6, 182, 212, 0.35)',
    button: '#06B6D4',
    buttonHover: '#0891B2',
    inputBackground: 'rgba(10, 24, 34, 0.75)',
    previewGradient: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
    light: {
      background: '#ECFEFF',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#ECFEFF',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#06B6D4',
      buttonHover: '#0891B2',
      inputBackground: '#FFFFFF',
      glow: 'rgba(6, 182, 212, 0.2)'
    }
  },
  {
    id: 'ruby-rose',
    name: 'Ruby Rose',
    tagline: 'Velvet Midnight with Ruby Rose & Hot Pink Sparks',
    primary: '#F43F5E',
    secondary: '#EC4899',
    background: '#160B13',
    sidebar: '#1D101B',
    card: '#2A1726',
    cardSub: '#371E32',
    cardHover: '#3D2138',
    border: 'rgba(244, 63, 94, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#F43F5E',
    gradientEnd: '#EC4899',
    glow: 'rgba(244, 63, 94, 0.35)',
    button: '#F43F5E',
    buttonHover: '#E11D48',
    inputBackground: 'rgba(29, 16, 27, 0.75)',
    previewGradient: 'linear-gradient(135deg, #F43F5E, #EC4899)',
    light: {
      background: '#FFF1F2',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#FFF1F2',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#F43F5E',
      buttonHover: '#E11D48',
      inputBackground: '#FFFFFF',
      glow: 'rgba(244, 63, 94, 0.2)'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    tagline: 'Deep Canopy Evergreen with Lime Foliage Highlights',
    primary: '#22C55E',
    secondary: '#84CC16',
    background: '#09130D',
    sidebar: '#0D1B12',
    card: '#17291D',
    cardSub: '#1E3726',
    cardHover: '#203D2A',
    border: 'rgba(34, 197, 94, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#22C55E',
    gradientEnd: '#84CC16',
    glow: 'rgba(34, 197, 94, 0.35)',
    button: '#22C55E',
    buttonHover: '#16A34A',
    inputBackground: 'rgba(13, 27, 18, 0.75)',
    previewGradient: 'linear-gradient(135deg, #22C55E, #84CC16)',
    light: {
      background: '#F0FDF4',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F8FAFC',
      cardHover: '#F0FDF4',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#22C55E',
      buttonHover: '#16A34A',
      inputBackground: '#FFFFFF',
      glow: 'rgba(34, 197, 94, 0.2)'
    }
  },
  {
    id: 'silver-graphite',
    name: 'Silver Graphite',
    tagline: 'Executive Monochromatic Slate with Metallic Silver',
    primary: '#94A3B8',
    secondary: '#CBD5E1',
    background: '#0B0F16',
    sidebar: '#111827',
    card: '#1C2635',
    cardSub: '#263345',
    cardHover: '#29374B',
    border: 'rgba(148, 163, 184, 0.22)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradientStart: '#94A3B8',
    gradientEnd: '#CBD5E1',
    glow: 'rgba(148, 163, 184, 0.35)',
    button: '#64748B',
    buttonHover: '#475569',
    inputBackground: 'rgba(17, 24, 39, 0.75)',
    previewGradient: 'linear-gradient(135deg, #94A3B8, #CBD5E1)',
    light: {
      background: '#F8FAFC',
      sidebar: '#FFFFFF',
      card: '#FFFFFF',
      cardSub: '#F1F5F9',
      cardHover: '#F1F5F9',
      border: '#CBD5E1',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      button: '#64748B',
      buttonHover: '#475569',
      inputBackground: '#FFFFFF',
      glow: 'rgba(148, 163, 184, 0.2)'
    }
  }
];

export const DEFAULT_THEME_ID = 'midnight-emerald';

export const DEFAULT_THEME: ThemeConfig = {
  themeId: 'midnight-emerald',
  mode: 'dark',
  accentColor: '#10B981',
  accentName: 'Midnight Emerald',
  sidebarPosition: 'left',
  compactDensity: false,
  backgroundId: 'midnight',
  primary: '#10B981',
  secondary: '#06B6D4',
  gradientStart: '#10B981',
  gradientEnd: '#06B6D4',
  glow: 'rgba(16, 185, 129, 0.35)'
};

export function getThemeById(themeId?: string): EduPulseTheme {
  if (!themeId) return EDU_PULSE_THEMES[0];
  const found = EDU_PULSE_THEMES.find(t => t.id === themeId);
  return found || EDU_PULSE_THEMES[0];
}

// Backwards compatibility for preset backgrounds
export interface ThemeBackgroundPreset {
  id: string;
  name: string;
  category: 'Dark' | 'Light';
  bgBody: string;
  bgCard: string;
  bgCardSub: string;
  bgHeader: string;
  bgSidebar: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  previewHex: string;
}

export const PRESET_BACKGROUNDS: ThemeBackgroundPreset[] = EDU_PULSE_THEMES.map(t => ({
  id: t.id,
  name: t.name,
  category: 'Dark',
  bgBody: t.background,
  bgCard: t.card,
  bgCardSub: t.cardSub,
  bgHeader: t.sidebar,
  bgSidebar: t.sidebar,
  borderColor: t.border,
  textPrimary: t.textPrimary,
  textSecondary: t.textSecondary,
  previewHex: t.background
}));

export const PRESET_ACCENTS = EDU_PULSE_THEMES.map(t => ({
  name: t.name,
  color: t.primary,
  textClass: 'text-primary',
  bgClass: 'bg-primary'
}));

export function getThemeBackground(bgId?: string, mode?: 'dark' | 'light'): ThemeBackgroundPreset {
  const theme = getThemeById(bgId);
  const isLight = mode === 'light';
  return {
    id: theme.id,
    name: theme.name,
    category: isLight ? 'Light' : 'Dark',
    bgBody: isLight ? theme.light.background : theme.background,
    bgCard: isLight ? theme.light.card : theme.card,
    bgCardSub: isLight ? theme.light.cardSub : theme.cardSub,
    bgHeader: isLight ? theme.light.sidebar : theme.sidebar,
    bgSidebar: isLight ? theme.light.sidebar : theme.sidebar,
    borderColor: isLight ? theme.light.border : theme.border,
    textPrimary: isLight ? theme.light.textPrimary : theme.textPrimary,
    textSecondary: isLight ? theme.light.textSecondary : theme.textSecondary,
    previewHex: isLight ? theme.light.background : theme.background
  };
}
