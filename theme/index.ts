'use client';
import { createTheme } from '@mui/material/styles';
import { navigationCustomizations } from './navigation';
import { colorSchemes, shadows, shape, typography } from './themePrimitives';
import { inputsCustomizations } from './customization/inputs';
import { surfacesCustomizations } from './customization/surfaces';
import { dataDisplayCustomizations } from './dataDisplay';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes,
  typography,
  shadows,
  shape,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    ...inputsCustomizations,
    ...navigationCustomizations,
    ...surfacesCustomizations,
    ...dataDisplayCustomizations
  },
});

export default theme;