import React from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ReportIcon from "@mui/icons-material/Report";
import AssignmentIcon from "@mui/icons-material/Assignment";

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Classes", icon: <ClassOutlinedIcon />, path: "/Admin/classes" },
  { text: "Subjects", icon: <AssignmentIcon />, path: "/Admin/subjects" },
  {
    text: "Teachers",
    icon: <SupervisorAccountOutlinedIcon />,
    path: "/Admin/teachers",
  },
  { text: "Students", icon: <PersonOutlineIcon />, path: "/Admin/students" },
  {
    text: "Notices",
    icon: <AnnouncementOutlinedIcon />,
    path: "/Admin/notices",
  },
  { text: "Complains", icon: <ReportIcon />, path: "/Admin/complains" },
];

const userItems = [
  {
    text: "Profile",
    icon: <AccountCircleOutlinedIcon />,
    path: "/Admin/profile",
  },
  { text: "Logout", icon: <ExitToAppIcon />, path: "/logout" },
];

const SideBar = () => {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const renderItem = ({ text, icon, path }) => {
    const active = isActive(path);
    return (
      <ListItemButton
        key={text}
        component={Link}
        to={path}
        sx={{
          borderLeft: active
            ? `4px solid ${theme.palette.primary.main}`
            : "4px solid transparent",
          backgroundColor: active
            ? theme.palette.action.selected
            : "transparent",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          pl: 3,
        }}
      >
        <ListItemIcon
          sx={{
            color: active
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            minWidth: 40,
          }}
        >
          {React.cloneElement(icon, { fontSize: "small" })}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontWeight: active ? "bold" : "normal",
            fontSize: "0.95rem",
          }}
        />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      <List
        subheader={
          <ListSubheader
            component="div"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "bold",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              pl: 3,
              pb: 1,
              backgroundColor: "transparent",
            }}
          >
            Main
          </ListSubheader>
        }
      >
        {menuItems.map(renderItem)}
      </List>

      <Divider sx={{ my: 2 }} />

      <List
        subheader={
          <ListSubheader
            component="div"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "bold",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              pl: 3,
              pb: 1,
              backgroundColor: "transparent",
            }}
          >
            User
          </ListSubheader>
        }
      >
        {userItems.map(renderItem)}
      </List>
    </Box>
  );
};

export default SideBar;
