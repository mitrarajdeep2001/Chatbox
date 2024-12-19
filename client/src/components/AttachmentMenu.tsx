import { Menu, MenuItem } from "@mui/material";
import React from "react";

interface CustomMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  menuItems: { label: string; onClick: () => void; icon: React.ReactNode }[];
  anchorOrigin?: {
    vertical: "top" | "bottom" | "center";
    horizontal: "left" | "right" | "center";
  };
  transformOrigin?: {
    vertical: "top" | "bottom" | "center";
    horizontal: "left" | "right" | "center";
  };
}

const AttachmentMenu: React.FC<CustomMenuProps> = ({
  anchorEl,
  open,
  onClose,
  menuItems,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  transformOrigin = { vertical: "top", horizontal: "left" },
}) => {
  return (
    <Menu
      id="custom-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "var(--bg-secondary)", // Apply dynamic colors
          color: "var(--text-primary)", // Adjust text color
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          minWidth: "150px",
          transform: "translateY(-30px) !important", // Lift the menu upwards
        },
      }}
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={item.onClick}
          sx={{
            display: "flex",
            gap: "10px",
            "&:hover": {
              backgroundColor: "var(--bg-hover)", // Hover effect
            },
          }}
        >
          {item.icon}
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default AttachmentMenu;
