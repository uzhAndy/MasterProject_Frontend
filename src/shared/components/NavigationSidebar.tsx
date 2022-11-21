// import 
import React, { useState, useEffect, useContext, FC } from "react";
import { useNavigate, useLocation, useParams } from "react-router";

import { useReduxState, useSetReduxState } from "../../redux/hooks";
import { setRiskQuestionnaireCompleted, setSidebarOpen } from '../../redux/reducers/consultReducer';
import { removeData } from "../../redux/reducers/userReducers";
import URLContext, { baseURL } from "../../store/url-context";
import AuthContext from "../../store/auth-context";
import { Role } from '../models/loginform';

// import mui components
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SockContext from '../../store/socket-context';

// import mui icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import TranslateIcon from '@mui/icons-material/Translate';
import HomeIcon from '@mui/icons-material/Home';
import { Tooltip } from "@mui/material";


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));





const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
            ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);





// component for buttons/items in sidebar
interface Props {
    open: boolean,
    text: string,
    onClick: any,  // i left this as any, bc i didn't know what else to put here
    icon: any,  // i left this as any, bc i didn't know what else to put here
    selected: boolean,
};
const SidebarItem: FC<Props> = ({
    open,
    text,
    onClick,
    icon,
    selected,
}) => {

    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

    return (
        <Tooltip
            title={text}
            placement="right"
            open={tooltipIsOpen && !open}
            onOpen={() => setTooltipIsOpen(true)}
            onClose={() => setTooltipIsOpen(false)}
        >
        <ListItemButton
            key={text}
            sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
            onClick={onClick}
            selected={selected}
        >
        <ListItemIcon
            sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
            }}
        >
            {icon}
        </ListItemIcon>

                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </Tooltip>
    );
};



const LOGOUTAPI = `${baseURL}:5000/auth/logout`


interface DrawerProps {children: unknown, endSession?: any};
const MiniDrawer: FC<DrawerProps> = ({children, endSession}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);  // set to true to open by default
    const ctx = useContext(AuthContext)
    const navigate = useNavigate();
    const [adminView, setAdminView] = useState(false);
    const [vis, setVis] = useState("")  // visibility
    let location = useLocation();
    const [guestView, setGuestView] = useState(false);
    const user = useReduxState((state) => state.users);
    let consult = useReduxState((state) => state.consult)
    const dispatch = useSetReduxState();

    const url = useContext(URLContext);
    // Add context URLs below to categorize them into three visibility classes.
    // These classes determine what is displayed in the sidebar.
    // If a page is rendered that is not listed here, no sidebar is displayed.
    // If multiple versions exist, then only "base"-version must be listed, e.g. url.riskForm and url.riskFormBase
    const visibilities: any = {
        // anyone can see this (logged-in or logged-out): no sidebar is displayed
        anyone: [
            url.home,
            url.login,
            url.register
        ], 
        // client advisors can see this: serves for internal navigation of the pages
        clientAdvisorOnly: [
            url.user,
            url.clientManagement,
            url.editClient,
            url.editClientBase,
            url.addClient,
            url.editUser,
            url.editUserBase,
            url.addTerm,
            url.editTerm,
            url.termsOverview,
            url.transcriptBase,
            url.riskFormBase,
        ],
        // clients can see this: hide sensitive information and show session controls
        session: [
            url.consultationBase
        ]
    }




    useEffect(() => {
        // enable admin view if an admin is logged in
        if (user.role === Role.ADMIN) {
            setAdminView(true)
        } else {
            setAdminView(false)
        }

        setGuestView(user.role === Role.GUEST)

        determineVisibility();
    })



    const determineVisibility = () => {
    // sets the visibility variable, vis, based on the current url

        // iterate over all arrays of the visibility object
        for (let key in visibilities) {
            if (visibilities.hasOwnProperty(key)) {
                visibilities[key].forEach( function(element:any) {
                    // if current location is in the array, then set the vis variable
                    if (location.pathname.startsWith(element)) {
                        setVis(key)
                    }
                })
            }
        }
    }



    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const handleLogout = () => {
        const logoutRequest = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': ctx.token() },
        };

        fetch(LOGOUTAPI, logoutRequest)
            .then(r => r.json().then(data => ({ status: r.status, body: data })))
            .then(obj => {
                if (obj.status == 200) {
                    // props.handleClose()
                    localStorage.removeItem('access_token')
                    dispatch(removeData())
                    navigate(url.home)
                }
            })
        .catch((error) => {
            console.log("error")
            console.log(error)
            return false
        })
    }


    // drawer that is displayed in clientAdvisorOnly visibility
    const DefaultDrawer = () => {
        return (
            <Drawer variant="permanent" open={open}>

                {/* header of the drawer (chevron to close the sidebar) */}
                <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                </DrawerHeader>

                {/* main content of the sidebar */}
                <List>
                    <SidebarItem
                        open={open}
                        text="Edit User Profile"
                        onClick={() => navigate(`/edituser/${user.uuid}`)}
                        icon={<AccountBoxIcon/>}
                        selected={location.pathname.startsWith(url.editUserBase)}
                    />
                    {/* only display "user management" and "terms overview" if an admin is logged in */}
                    {adminView ? 
                    <>
                    <SidebarItem
                        open={open}
                        text="User Management"
                        onClick={() => navigate(url.accept)}
                        icon={<GroupIcon/>}
                        selected={location.pathname.startsWith(url.user)}
                    /> 
                    <SidebarItem
                        open={open}
                        text="Terms Overview"
                        onClick={() => navigate(url.termsOverview)}
                        icon={<TranslateIcon/>}
                        selected={location.pathname.startsWith(url.termsOverview)}
                    />
                    </>
                    : null}
                </List>
                <Divider />
                <List>
                    <SidebarItem
                        open={open}
                        text="Clients Overview"
                        onClick={() => navigate(url.clientManagement)}
                        icon={<HomeIcon/>}
                        selected={location.pathname.startsWith(url.clientManagement)}
                    />
                    <SidebarItem
                        open={open}
                        text="Transcripts Overview"
                        onClick={() => navigate(`${url.transcriptBase}/`+`${user.uuid}`)}
                        icon={<TextSnippetIcon/>}
                        selected={location.pathname.startsWith(url.transcriptBase)}
                    />
                </List>
                
                {/* "footer" of the sidebar. not technically different from main content, but visually separated */}
                {/* here used to separate logout from other links */}
                <Divider />
                <List>
                <SidebarItem
                    open={open}
                    text="Logout"
                    onClick={() => {handleLogout()}}
                    icon={<LogoutIcon/>}
                    selected={false}
                />
                </List>
            </Drawer>

        );
    }

    const toggleAssignment = () => {
      // sets consult.riskQuestionnaireCompleted to true if it was false, or vice versa
      if (consult.riskQuestionnaireCompleted) {
        dispatch(setRiskQuestionnaireCompleted(false));
      } else {
        dispatch(setRiskQuestionnaireCompleted(true));
      }
    }

    const endSessionWrapper = () => {
      // call endSession and navigate to clientManagement
      endSession();
      navigate(url.clientManagement);
    }

    // drawer that is displayed in session visibility
    const SessionDrawer = () => {
        const sockCtx = useContext(SockContext);
        const client = useReduxState((state) => state.client);
        const consult = useReduxState((state) => state.consult);
        

        return (
            <Drawer variant="permanent" open={open}>

                {/* header of the drawer (chevron to close the sidebar) */}
                <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                </DrawerHeader>

                {/* main content of the sidebar */}
                <List>
                    <SidebarItem
                        open={open}
                        text="Risk Questionnaire"
                        onClick={() => {
                          dispatch(setRiskQuestionnaireCompleted(!consult.riskQuestionnaireCompleted))}}
                        icon={<AssignmentIcon/>}
                        selected={!consult.riskQuestionnaireCompleted}
                    />
                </List>

                {/* "footer" of the sidebar. not technically different from main content, but visually separated */}
                {/* here used to separate logout from other links */}
                <Divider />
                <List>
                <SidebarItem
                    open={open}
                    text="End Session"
                    onClick={() => {
                      sockCtx.socket().emit('leave_consultation', {"user_id": user.uuid, "client_id": client.clientId }, (data: any) => {
                      })
                      navigate(url.clientManagement)
                    }}
                    icon={<LogoutIcon/>}
                    selected={false}
                />
                </List>
            </Drawer>

        );
    }


    const renderCorrectDrawer:any = (vis:string) => {
        /* display drawer not if visibility is "anyone" */
        if (vis === "anyone" || guestView) {
            return null
        } else if (vis === "clientAdvisorOnly") {
            return <DefaultDrawer />
        } else if (vis === "session") {
            return <SessionDrawer />
        } else {
            return null
        }
    }

    const renderCorrectSidebarButton:any = (vis:string) => {
    // render the sidebar button only if visibility is not "anyone"
        if (vis === "anyone" || guestView) {
            return null
        } else {
            return (<IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
            }}
            >
            <MenuIcon />
            </IconButton>)
        }
    }





    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Topbar/header of the app with button to open the sidebar */}
        {/* only displayed when logged out (visibility === "anyone") */}
        {(vis === "anyone") ? null :
            <AppBar position="fixed" open={open} style={{ backgroundColor: '#38288f' }}>
            <Toolbar>
                {/* display menu/sidebar button not if visibility is "anyone" */}
                {renderCorrectSidebarButton(vis)}

                {/* text in header */}
                <Typography variant="h6" noWrap component="div">
                    Groot
                </Typography>
            </Toolbar>
            </AppBar>
        }

        {/* actual sidebar */}
        {renderCorrectDrawer(vis)}

        {/* main page content gets rendered in this component (main content is "wrapped" by the sidebar and header) */}
        {/* adjust padding (p) here */}
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            {(vis === "anyone") ? null : <DrawerHeader />}
            {children}
        </Box>

        </Box>
    );
}

export default MiniDrawer;

