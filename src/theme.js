import { createTheme } from '@mui/material/styles';


//Light Theme variables
const lBackgroundColor = "#fff";
const lPrimaryDarkColor = '#303f9f';
const lWhiteColor = '#ffffff';
const lAppBarBackgroundColor = '#3f51b5';

//Dark Theme variables
const dBackgroundColor = "#03001C";
const dPrimaryDarkColor = '#303f9f';
const dWhiteColor = '#ffffff';
const dAppBarBackgroundColor = '#3f51b5';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: lBackgroundColor, // Remplace cette valeur par la couleur principale de ton choix
        },
        secondary: {
            main: '#f50057', // Remplace cette valeur par la couleur secondaire de ton choix
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Remplace cette valeur par la famille de polices de ton choix
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        borderBottom: '1px solid #303f9f',
                        color: lPrimaryDarkColor,
                        fontWeight : '900',
                    },
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: dBackgroundColor, // Remplace cette valeur par la couleur principale de ton choix
        },
        secondary: {
            main: '#f50057', // Remplace cette valeur par la couleur secondaire de ton choix
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Remplace cette valeur par la famille de polices de ton choix
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: dPrimaryDarkColor,
                        color: dWhiteColor,
                    },
                },
            },
        },
    },
});

export { lightTheme, darkTheme };
