import React, { useState } from "react";
import { Paper } from "@mui/material";
import { StepperDiv } from "utils/Style/WorkflowStyle";

// Create workflow
import Stepper from "components/base/Stepper";
import Toolbar from "components/base/Toolbar";
import { AppBar, Box, Drawer, Divider } from "@mui/material";
import { styled } from "@mui/system";

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
  },
}));

const ContentDiv = styled("div")(({ theme }) => ({
  height: "100%",
  width: "100%",
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const WorkflowDrawer = ({ steps, stepInfo, content }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <AppBar style={{ height: "64px" }}>
        <Toolbar />
      </AppBar>
      <Divider />
      <StepperDiv>
        <Stepper steps={steps} stepInfo={stepInfo} />
      </StepperDiv>
    </div>
  );

  const container = window.document.body;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <StyledDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          {drawer}
        </StyledDrawer>
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100%",
        }}
      >
        <ContentDiv>{content}</ContentDiv>
      </Box>
    </Box>
  );
};

export default WorkflowDrawer;
