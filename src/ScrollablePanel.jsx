import React, { useState } from "react";
import { Paper, Box, List, ListItem, ListItemText, Collapse, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const ScrollablePanel = () => {
  const [open, setOpen] = useState(false);

  const toggleCollapse = () => {
    setOpen(!open);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "90%",
        width: "100%",
        maxWidth: 500,
        // margin: "auto",
        mt: 2,
        bgcolor: "#333333", // Background color for the paper
        color: "whitesmoke", // Text color
      }}
    >
      <Typography variant='h6' sx={{ color: "whitesmoke", mb: 2, p: 1 }}>
        Floorplans
      </Typography>
      <List sx={{ bgcolor: "#333333", color: "whitesmoke" }}>
        <ListItem button onClick={toggleCollapse}>
          <ListItemText primary='Floor Group' />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem sx={{ pl: 4, "&:hover": { bgcolor: "darkgrey" } }}>
              <ListItemText primary='Floor 1' />
            </ListItem>
            <ListItem sx={{ pl: 4, "&:hover": { bgcolor: "darkgrey" } }}>
              <ListItemText primary='Floor 2' />
            </ListItem>
            <ListItem sx={{ pl: 4, "&:hover": { bgcolor: "darkgrey" } }}>
              <ListItemText primary='Floor 3' />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Paper>
  );
};

export default ScrollablePanel;
