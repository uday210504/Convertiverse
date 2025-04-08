import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Define custom colors
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

// Define custom fonts
const fonts = {
  heading: '"Inter", sans-serif',
  body: '"Inter", sans-serif',
};

// Define custom component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s ease-in-out',
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        },
        transition: 'all 0.2s ease-in-out',
      },
    },
  },
};

// Define global styles
const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800',
    },
  },
};

// Create a simple theme configuration
const themeConfig = {
  colors,
  fonts,
  components,
  styles,
};

// ThemeProvider component
const ThemeProvider = ({ children }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
