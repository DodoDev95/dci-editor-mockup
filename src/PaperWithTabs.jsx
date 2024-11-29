import React, { useState } from "react";
import { Paper, Tabs, Tab, Box, Typography } from "@mui/material";

const TabPanel = ({ value, index, children }) => {
  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      p={2}
      sx={{
        bgcolor: "#333333", // Background color
        color: "whitesmoke", // Text color
        minHeight: "150px", // Optional height for better visuals
      }}
    >
      {value === index && <Typography>{children}</Typography>}
    </Box>
  );
};

const PaperWithTabs = ({ tabContent }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: "80%",
        width: "100%",
        maxWidth: 500,
        // margin: "auto",
        mt: 2,
        bgcolor: "#333333", // Background color for the paper
        color: "whitesmoke", // Text color
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor='inherit'
        indicatorColor='primary'
        sx={{
          bgcolor: "#333333", // Background color for tabs
          color: "whitesmoke", // Text color for tabs
          p: 1,
        }}
      >
        <Tab label='Properties' />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <Typography>{tabContent}</Typography>
      </TabPanel>
    </Paper>
  );
};

export default PaperWithTabs;
