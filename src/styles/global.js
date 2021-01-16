import { makeStyles } from '@material-ui/core';

const useGlobalStyles = makeStyles(() => ({
  '@global': {
    html: {
      fontSize: '16px',
      fontWeight: 400,
      boxSizing: 'border-box',
    },

    body: {
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      color: '#00043C',
      backgroundColor: '#fff',
    },

    a: {
      textDecoration: 'none',
    },

    '[hidden]': {
      display: 'none !important',
    },

    strong: {
      fontWeight: 600,
    },

    em: {
      fontStyle: 'italic',
    },

    img: {
      userSelect: 'none',
    },

    button: {
      font: 'inherit',
    },
  },
}));

export { useGlobalStyles };
