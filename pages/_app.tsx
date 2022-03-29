import SignInDialog from "@/components/SignInDialog";
import SignOutDialog from "@/components/SignOutDialog";
import { useStore } from "@/lib/store";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import EventIcon from "@mui/icons-material/Event";
import FeedIcon from "@mui/icons-material/Feed";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../lib/store";
import "../styles/globals.css";

const drawerWidth = 180;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MyApp({ Component, pageProps }) {
  const props = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const user = supabase.auth.user();

  if (props === null) {
    return (
      <CircularProgress
        sx={{
          top: "calc(50% - 22px)",
          left: "calc(50% - 22px)",
          position: "fixed",
        }}
      />
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SignInDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
      />
      <SignOutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
      <Box sx={{ display: "flex" }}>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)}>
              {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            <ListItem
              button
              key="Papers"
              onClick={() =>
                router.push("/papers", undefined, { shallow: true })
              }
            >
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
              <ListItemText primary="Papers" />
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              key="Sessions"
              onClick={() =>
                router.push("/sessions", undefined, { shallow: true })
              }
            >
              <ListItemIcon>
                <CoPresentIcon />
              </ListItemIcon>
              <ListItemText primary="Sessions" />
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              key="Calendar"
              onClick={() =>
                router.push("/calendar", undefined, { shallow: true })
              }
            >
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItem>
          </List>
          {!user && (
            <List>
              <ListItem
                button
                key="Login"
                onClick={() => setLoginDialogOpen(true)}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItem>
            </List>
          )}
          {user && (
            <List>
              <ListItem
                button
                key="Logout"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          )}
        </Drawer>
        <Box sx={{ p: 1, flexGrow: 1 }}>
          <Component {...pageProps} {...props} />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
