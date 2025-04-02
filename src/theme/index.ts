import { createTheme } from "@shopify/restyle";

// Define the color palette
const palette = {
  primary50: "#f0f9ff",
  primary100: "#e0f2fe",
  primary200: "#bae6fd",
  primary300: "#7dd3fc",
  primary400: "#38bdf8",
  primary500: "#0ea5e9",
  primary600: "#0284c7",
  primary700: "#0369a1",
  primary800: "#075985",
  primary900: "#0c4a6e",

  secondary50: "#f8fafc",
  secondary100: "#f1f5f9",
  secondary200: "#e2e8f0",
  secondary300: "#cbd5e1",
  secondary400: "#94a3b8",
  secondary500: "#64748b",
  secondary600: "#475569",
  secondary700: "#334155",
  secondary800: "#1e293b",
  secondary900: "#0f172a",

  success50: "#f0fdf4",
  success500: "#10b981",
  success700: "#047857",

  error50: "#fef2f2",
  error500: "#ef4444",
  error700: "#b91c1c",

  info50: "#eff6ff",
  info500: "#3b82f6",
  info700: "#1d4ed8",

  warning50: "#fffbeb",
  warning500: "#f59e0b",
  warning700: "#b45309",

  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
};

// Define spacing scale
const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  "2xl": 48,
  "3xl": 64,
};

// Define border radius scale
const borderRadii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Define typography
const textVariants = {
  defaults: {
    fontFamily: "System",
    fontSize: 16,
    color: "secondary800",
  },
  header: {
    fontFamily: "System",
    fontWeight: "bold",
    fontSize: 24,
    color: "secondary900",
  },
  subheader: {
    fontFamily: "System",
    fontWeight: "600",
    fontSize: 20,
    color: "secondary800",
  },
  body: {
    fontFamily: "System",
    fontSize: 16,
    color: "secondary800",
  },
  bodySmall: {
    fontFamily: "System",
    fontSize: 14,
    color: "secondary600",
  },
  caption: {
    fontFamily: "System",
    fontSize: 12,
    color: "secondary500",
  },
  button: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  buttonSmall: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
};

// Create the theme
const theme = createTheme({
  colors: {
    ...palette,
    // Semantic colors
    background: palette.white,
    backgroundDark: palette.secondary900,
    foreground: palette.secondary800,
    foregroundMuted: palette.secondary500,
    primary: palette.primary500,
    primaryLight: palette.primary300,
    primaryDark: palette.primary700,
    secondary: palette.secondary500,
    secondaryLight: palette.secondary300,
    secondaryDark: palette.secondary700,
    success: palette.success500,
    error: palette.error500,
    info: palette.info500,
    warning: palette.warning500,
    border: palette.secondary200,
    borderDark: palette.secondary700,
    card: palette.white,
    cardDark: palette.secondary800,
  },
  spacing,
  borderRadii,
  textVariants,
  breakpoints: {
    phone: 0,
    tablet: 768,
    largeTablet: 1024,
  },
});

export type Theme = typeof theme;
export default theme;
