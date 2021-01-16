import React, { useMemo } from 'react';
import { create } from 'jss';
import {
  StylesProvider,
  jssPreset,
  ThemeProvider,
} from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import createTheme from './styles/theme';
import { useGlobalStyles } from './styles/global';
import './styles/vendor/reset.css';
import BaseEditorContainer from './components/BaseEditor/BaseEditorContainer';


const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});


function App() {
  useGlobalStyles();

  const theme = useMemo(() => {
    return createTheme();
  }, []);


  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <BaseEditorContainer />
        </SnackbarProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default App;
