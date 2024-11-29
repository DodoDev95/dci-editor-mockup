import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Collapse,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CameraIcon from "@mui/icons-material/Camera";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import LockIcon from "@mui/icons-material/Lock";
import svg from "./assets/tiger.svg";
import PaperWithTabs from "./PaperWithTabs";
import ScrollablePanel from "./ScrollablePanel";

const NestedList = ({ nestedItems, setItemInfo }) => {
  const [open, setOpen] = useState({});
  const toggleNestedOpen = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  return (
    <List component="div" disablePadding>
      {nestedItems.map((nestedItem, index) => (
        <React.Fragment key={index}>
          <ListItem button onClick={() => toggleNestedOpen(index)} sx={{ pl: 4 }}>
            <ListItemText sx={{ color: "orange" }} primary={nestedItem.title} />
            {open[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {nestedItem.items.map((item, i) => (
                <ListItem
                  onClick={() => setItemInfo(item)}
                  key={i}
                  sx={{ pl: 6, cursor: "pointer", bgcolor: "lightgray", "&:hover": { bgcolor: "whitesmoke" } }}>
                  <ListItemText sx={{ color: "black" }} primary={item} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

const SidebarItem = ({ title, nestedItems, setItemInfo }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <ListItem button onClick={toggleOpen}>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <NestedList nestedItems={nestedItems} setItemInfo={setItemInfo} />
      </Collapse>
    </>
  );
};

const App = ({}) => {
  const [itemInfo, setItemInfo] = useState("");
  const sidebarItems = [
    {
      title: "Fire Alarm",
      nestedItems: [{ title: "DSC NEO", items: ["Device 1", "Device 2"] }],
    },
    {
      title: "Alarm",
      nestedItems: [{ title: "Panel 1", items: ["Room A", "Room B", "Room C", "Room D"] }],
    },
    {
      title: "Access Control",
      nestedItems: [{ title: "Entrance 1", items: ["Door 1", "Door 2", "Door 3", "Door 4"] }],
    },
  ];
  useEffect(() => {
    console.log("dasdas");
    const script = document.createElement("script");
    script.src = "/src/DxfViewer/MainViewer.js";
    script.async = true;
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box display="flex" width="100vw" overflow="hidden">
      <Box display="flex" bgcolor="#494949">
        <Box sx={{ bgcolor: "#494949" }} height="100vh">
          <Box width="240px" bgcolor="#494949" role="presentation">
            <List
              sx={{ bgcolor: "#494949", color: "white" }}
              subheader={
                <ListSubheader sx={{ bgcolor: "#494949", color: "white" }} component="div">
                  Explorer
                </ListSubheader>
              }>
              {sidebarItems.map((item, index) => (
                <SidebarItem key={index} title={item.title} nestedItems={item.nestedItems} setItemInfo={setItemInfo} />
              ))}
            </List>
          </Box>
          <Box bgcolor="#494949" flexGrow={1} p={2}>
            <Box mb={2}>
              <Typography color="whitesmoke" variant="body1">
                Draggable Symbols
              </Typography>
              <Divider sx={{ bgcolor: "whitesmoke" }} />
              <Box display="flex" mt={1} flexWrap="wrap" gap={2}>
                <CameraIcon sx={{ color: "white" }} />
                <LocalFireDepartmentIcon sx={{ color: "white" }} />
                <SensorsIcon sx={{ color: "white" }} />
                <SensorDoorIcon sx={{ color: "white" }} />
                <LockIcon sx={{ color: "white" }} />
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Main Content */}
        {/* Image */}
      </Box>
      <Box display="flex" bgcolor="whitesmoke" width="100%" alignItems="top" justifyContent="center" overflow="hidden">
        <div style={{ width: "100%", height: "100%" }} id="MainDxfViewerContainerDntDuplicate"></div>
      </Box>
      <Box display="column" rowGap={1}>
        <Box p={1} height={500} width={300} bgcolor="#494949">
          <ScrollablePanel />
        </Box>
        <Box p={1} height={600} width={300} bgcolor="#494949">
          <PaperWithTabs tabContent={itemInfo} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
