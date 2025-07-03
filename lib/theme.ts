// Configuration du thème YORI
// Couleurs et styles centralisés pour cohérence design

export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    yellow: {
      50: '#fefce8',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },
  
  gradients: {
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-emerald-500 to-teal-500',
    accent: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-pink-500',
    success: 'from-emerald-500 to-green-500',
    warning: 'from-yellow-500 to-amber-500',
    info: 'from-blue-500 to-cyan-500',
    
    // Gradients de fond
    background: {
      light: 'from-slate-50 via-blue-50/30 to-indigo-50',
      dark: 'from-slate-950 via-slate-900 to-slate-800'
    },
    
    // Gradients pour les cartes
    card: {
      light: 'from-white/40 to-white/20',
      dark: 'from-slate-800/40 to-slate-700/20'
    }
  },
  
  effects: {
    glass: {
      backdrop: 'backdrop-blur-lg',
      bg: 'bg-white/40 dark:bg-slate-800/40',
      border: 'border-0',
      shadow: 'shadow-xl'
    },
    
    hover: {
      card: 'hover:shadow-2xl hover:scale-[1.02]',
      button: 'hover:shadow-lg hover:scale-105',
      icon: 'hover:scale-110'
    },
    
    animations: {
      fadeIn: 'animate-fade-in',
      slideUp: 'animate-slide-up',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce'
    }
  },
  
  typography: {
    heading: {
      primary: 'bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent',
      secondary: 'text-slate-700 dark:text-slate-300',
      accent: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
    },
    
    body: {
      primary: 'text-slate-900 dark:text-white',
      secondary: 'text-slate-600 dark:text-slate-400',
      muted: 'text-slate-500 dark:text-slate-500'
    }
  },
  
  spacing: {
    page: 'container mx-auto px-4 py-8',
    section: 'mb-8 lg:mb-12',
    card: 'p-6',
    cardSmall: 'p-4'
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// Classes utilitaires pour composants réutilisables
export const componentClasses = {
  // Boutons
  button: {
    primary: `
      bg-gradient-to-r ${theme.gradients.primary} 
      hover:from-blue-700 hover:to-purple-700 
      text-white shadow-lg hover:shadow-xl 
      transition-all duration-300 transform hover:scale-105
    `,
    secondary: `
      bg-gradient-to-r ${theme.gradients.secondary} 
      hover:from-emerald-600 hover:to-teal-600 
      text-white shadow-lg hover:shadow-xl 
      transition-all duration-300 transform hover:scale-105
    `,
    outline: `
      border-2 border-slate-200 dark:border-slate-700 
      hover:bg-slate-50 dark:hover:bg-slate-800 
      transition-all duration-300
    `,
    ghost: `
      hover:bg-slate-100 dark:hover:bg-slate-800 
      transition-all duration-300
    `
  },
  
  // Cartes
  card: {
    default: `
      ${theme.effects.glass.backdrop} 
      ${theme.effects.glass.bg} 
      ${theme.effects.glass.border} 
      ${theme.effects.glass.shadow} 
      rounded-xl transition-all duration-300 
      ${theme.effects.hover.card}
    `,
    simple: `
      bg-white dark:bg-slate-800 
      border border-slate-200 dark:border-slate-700 
      rounded-xl shadow-sm hover:shadow-md 
      transition-all duration-300
    `
  },
  
  // Badges
  badge: {
    primary: `
      bg-gradient-to-r ${theme.gradients.primary} 
      text-white px-3 py-1 rounded-full text-sm font-medium
    `,
    success: `
      bg-emerald-100 text-emerald-700 
      dark:bg-emerald-900/30 dark:text-emerald-300 
      px-3 py-1 rounded-full text-sm font-medium
    `,
    warning: `
      bg-yellow-100 text-yellow-700 
      dark:bg-yellow-900/30 dark:text-yellow-300 
      px-3 py-1 rounded-full text-sm font-medium
    `,
    danger: `
      bg-red-100 text-red-700 
      dark:bg-red-900/30 dark:text-red-300 
      px-3 py-1 rounded-full text-sm font-medium
    `
  },
  
  // Inputs
  input: {
    default: `
      bg-white/50 dark:bg-slate-700/50 
      border border-slate-200/50 dark:border-slate-600/50 
      rounded-lg px-4 py-2 
      focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-300
    `,
    large: `
      bg-white/50 dark:bg-slate-700/50 
      border border-slate-200/50 dark:border-slate-600/50 
      rounded-lg px-6 py-3 text-lg
      focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-300
    `
  }
};

// Animations personnalisées
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',
  rotateIn: 'animate-rotate-in'
};

// Utilitaires pour les effets de background
export const backgroundEffects = `
  fixed inset-0 overflow-hidden pointer-events-none
`;

export const createBackgroundBlobs = (positions: Array<{top?: string, bottom?: string, left?: string, right?: string, gradient: string}>) => {
  return positions.map((pos, index) => ({
    position: pos,
    gradient: pos.gradient,
    blur: 'blur-3xl',
    size: 'w-80 h-80',
    key: index
  }));
};

export default theme;
