// Import the theme creator from Chakra UI
import { ChakraProvider, theme as baseTheme } from '@chakra-ui/react';

// Create a custom theme by extending the base theme
const extendTheme = (overrides) => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...(overrides.colors || {}),
    },
    fonts: {
      ...baseTheme.fonts,
      ...(overrides.fonts || {}),
    },
    components: {
      ...baseTheme.components,
      ...(overrides.components || {}),
    },
    styles: {
      ...baseTheme.styles,
      ...(overrides.styles || {}),
    },
  };
};

const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e0ff',
    200: '#80caff',
    300: '#4db3ff',
    400: '#1a9dff',
    500: '#0080ff', // Primary brand color
    600: '#0066cc',
    700: '#004d99',
    800: '#003366',
    900: '#001a33',
  },
  accent: {
    50: '#fff0e6',
    100: '#ffd6b3',
    200: '#ffbd80',
    300: '#ffa34d',
    400: '#ff8a1a',
    500: '#ff7000', // Secondary accent color
    600: '#cc5a00',
    700: '#994300',
    800: '#662d00',
    900: '#331600',
  },
};

const fonts = {
  heading: '"Inter", sans-serif',
  body: '"Inter", sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'brand' ? 'brand.500' : 'accent.500',
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.600' : 'accent.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s ease-in-out',
      }),
      outline: (props) => ({
        borderColor: props.colorScheme === 'brand' ? 'brand.500' : 'accent.500',
        color: props.colorScheme === 'brand' ? 'brand.500' : 'accent.500',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.50' : 'accent.50',
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        },
        transition: 'all 0.2s ease-in-out',
      }),
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'lg',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        _hover: {
          boxShadow: 'xl',
          transform: 'translateY(-5px)',
        },
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800',
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
});

export default theme;
