import React from "react";
import { Toolbar, Typography, Button, Link } from "@mui/material";

const AppToolbar = ({ toggleSwitch }) => {
  return (
    <Toolbar>
      <Link href="/">
        <img
          src={"/algorand.png"}
          alt="Err"
          width="35px"
          style={{
            paddingRight: "25px",
            cursor: "pointer",
          }}
        />
      </Link>
      <Link href="/" color="inherit" sx={{ flexGrow: 1 }} underline="none">
        <Typography variant="h6" component="div">
          Algo Vote
        </Typography>
      </Link>
      <Link href="/" color="inherit" underline="none">
        <Button color="inherit">Home</Button>
      </Link>
      <Link href="/about" color="inherit" underline="none">
        <Button color="inherit">About</Button>
      </Link>
      {/* <MUISwitch defaultChecked toggleSwitch={toggleSwitch} /> */}
    </Toolbar>
  );
};

export default AppToolbar;
