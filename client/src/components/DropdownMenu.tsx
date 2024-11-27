import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ReactNode } from "react";

interface DropdownMenuProps {
  top?: number;
  left?: number;
  menuItems: Array<
    | {
        icon?: ReactNode;
        text?: string;
        component?: ReactNode;
        onClick?: () => void;
        isHeader?: false;
        isDivider?: false;
      }
    | { isDivider: true }
  >;
  className?: string;
  style?: React.CSSProperties;
}

export default function DropdownMenu({
  top,
  left,
  menuItems,
  className = "",
  style = {},
}: DropdownMenuProps) {
  return (
    <Paper
      sx={{
        width: 320,
        position: "absolute",
        top,
        left,
        zIndex: 2,
        zoom: 0.9,
        ...style, // Overriding default styles
      }}
      className={`dark:bg-dark-secondary bg-light-secondary dark:text-light-primary text-dark-primary ${className}`} // Overriding default classes
    >
      <MenuList dense>
        {menuItems.map((item, index) =>
          item.isDivider ? (
            <Divider
              className="dark:border-dark-primary border-light-primary border"
              key={`divider-${index}`}
            />
          ) : (
            <MenuItem key={index} onClick={item.onClick}>
              <div className="flex items-center gap-2">
                {item.icon}
                <p className={`${item.isHeader ? "text-lg" : ""}`}>
                  {item.text}
                </p>
              </div>
              {item.component && <>{item.component}</>}
            </MenuItem>
          )
        )}
      </MenuList>
    </Paper>
  );
}
