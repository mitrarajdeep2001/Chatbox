"use client";
import { MdMenuOpen } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { TbCircleDashed } from "react-icons/tb";
import { ImBlocked } from "react-icons/im";
import {
  IoSettingsOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";
import { IconButton } from "@mui/material";
import { useTheme } from "../context/ThemeProvider";
import { useState } from "react";
import Logo from "@/components/svgs/Logo";
import AccountMenu from "@/components/AccountMenu";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isCollapsible, setIsCollapsible] = useState(true);
  return (
    <div
      className={
        !isCollapsible
          ? "dark:bg-dark-secondary bg-light-secondary h-screen flex flex-col justify-between p-5 w-[10%]"
          : "w-[4%] dark:bg-dark-secondary bg-light-secondary h-screen flex flex-col justify-between p-5"
      }
    >
      <div className="flex flex-col justify-center items-center gap-5">
        <Logo width={30} height={30} />
        <IconButton onClick={() => setIsCollapsible(!isCollapsible)}>
          <MdMenuOpen />
        </IconButton>
        <IconButton>
          <BsChatText />
        </IconButton>
        <IconButton>
          <IoCallOutline />
        </IconButton>
        <IconButton>
          <TbCircleDashed />
        </IconButton>
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <IconButton>
          <ImBlocked />
        </IconButton>
        <IconButton onClick={toggleTheme}>
          {theme === "dark" ? <IoSunnyOutline /> : <IoMoonOutline />}
        </IconButton>
        <IconButton>
          <IoSettingsOutline />
        </IconButton>
        <AccountMenu />
      </div>
    </div>
  );
};

export default Sidebar;
