import React from "react";
import { AppBar, Box } from "@mui/material";
import Toolbar from "components/base/Toolbar";

const TopAppBar = ({ dark, setDark }) => {
  // const toggleSwitch = () => {
  //   setDark(!dark);
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ height: "64px" }}>
        {/* <Toolbar toggleSwitch={toggleSwitch} /> */}
        <Toolbar />
      </AppBar>
    </Box>
  );
};

export default TopAppBar;
