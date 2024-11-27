import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { signOutUser } from "@/lib/utils";
import { useAuth } from "@/context/AuthProvider";

export default function AccountMenu() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserLogout = async () => {
    await signOutUser();
    handleClose();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 24, height: 24 }}
              alt="Remy Sharp"
              src={user?.photoURL as string}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            className:
              "dark:bg-dark-primary bg-light-primary dark:text-light-primary text-dark-primary",
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              ml: 0.5, // Add 5px margin to the left
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: "83%",
                left: 0,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translate(-50%, -50%) rotate(45deg)",
                zIndex: 0,
                backgroundColor: "inherit",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider className="dark:border-dark-secondary border-light-secondary border" />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IoSettingsOutline />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleUserLogout}>
          <ListItemIcon>
            <MdLogout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
