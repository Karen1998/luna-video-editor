import { createMuiTheme } from '@material-ui/core/styles';


const createTheme = () => {
  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1140,
        xl: 1440,
      },
    },
  });

  return theme;
};

export default createTheme;
