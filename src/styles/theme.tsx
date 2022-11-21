// import { createTheme } from '@material-ui/core'
import { createTheme } from '@mui/material/styles'

// custom theme: overwrites default
const theme = createTheme({
    palette: {
        primary: {
            light:'#9CA9BE',
            main:'#7C6D91',
            dark:'#2A2B33',
            contrastText:'#F7F6F6',
        },
        secondary: {
            main:'#907E9E',
        },
    },
});

export default theme;
