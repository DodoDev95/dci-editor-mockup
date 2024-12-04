import React, { useState, useEffect } from "react";
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
  TextField,
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
import DxfViewerComponent from "./DxfViewer/MainViewerJSX";

const NestedList = ({ nestedItems, setItemInfo, searchTerm }) => {
  const [open, setOpen] = useState({});
  const toggleNestedOpen = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  return (
    <List component="div" disablePadding>
      {nestedItems.map((nestedItem, index) => {
        // Check if the current nestedItem or its children match the search term
        const isMatch =
          nestedItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (nestedItem.items &&
            nestedItem.items.some(
              (child) =>
                typeof child === "string"
                  ? child.toLowerCase().includes(searchTerm.toLowerCase()) // String child
                  : child.title.toLowerCase().includes(searchTerm.toLowerCase()) // Nested object child
            ));

        // If there's no match and searchTerm is not empty, skip rendering this item
        if (!isMatch && searchTerm !== "") {
          return null;
        }

        return (
          <React.Fragment key={index}>
            <ListItem
              button
              onClick={() => {
                toggleNestedOpen(index);
                setItemInfo(nestedItem.title);
              }}
              sx={{ pl: 4 }}>
              <ListItemText sx={{ color: "orange" }} primary={nestedItem.title} />
              {open[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open[index] || searchTerm !== ""} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                }}>
                {nestedItem.items &&
                  nestedItem.items
                    .filter(
                      (child) =>
                        typeof child === "string"
                          ? child.toLowerCase().includes(searchTerm.toLowerCase()) // String child
                          : child.title.toLowerCase().includes(searchTerm.toLowerCase()) // Nested object child
                    )
                    .map((child, i) => {
                      console.log(child);
                      if (typeof child === "string") {
                        // Render string items
                        return (
                          <ListItem
                            key={i}
                            onClick={() => setItemInfo(child)}
                            sx={{
                              pl: 6,
                              cursor: "pointer",
                              bgcolor: "lightgray",
                              "&:hover": { bgcolor: "whitesmoke" },
                            }}>
                            <ListItemText sx={{ color: "black" }} primary={child} />
                          </ListItem>
                        );
                      } else {
                        // Recursively render nested objects
                        return (
                          <React.Fragment key={i}>
                            <ListItem
                              button
                              onClick={() => {
                                toggleNestedOpen(`${index}-${i}`);
                                setItemInfo(child.title);
                              }}
                              sx={{ pl: 6 }}>
                              <ListItemText primary={child.title} />
                              {open[`${index}-${i}`] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={open[`${index}-${i}`]} timeout="auto" unmountOnExit>
                              {Array.isArray(child.items) && typeof child.items[0] === "string" ? (
                                // If child.items is an array of strings, display them as individual ListItem components
                                child.items.map((item, j) => (
                                  <ListItem
                                    key={j}
                                    onClick={() => setItemInfo(item)}
                                    sx={{
                                      pl: 8, // Indent further for nested items
                                      cursor: "pointer",
                                      bgcolor: "lightgray",
                                      "&:hover": { bgcolor: "whitesmoke" },
                                    }}>
                                    <ListItemText sx={{ color: "black" }} primary={item} />
                                  </ListItem>
                                ))
                              ) : (
                                // Otherwise, recursively render the NestedList for deeper nesting
                                <NestedList
                                  nestedItems={child.items}
                                  setItemInfo={setItemInfo}
                                  searchTerm={searchTerm}
                                />
                              )}
                            </Collapse>
                          </React.Fragment>
                        );
                      }
                    })}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

const SidebarItem = ({ title, nestedItems, setItemInfo, searchTerm }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <ListItem
        button
        onClick={() => {
          toggleOpen();
          setItemInfo(title);
        }}>
        <ListItemText primary={title} sx={{ color: "lightgreen" }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open || searchTerm !== ""} timeout="auto" unmountOnExit>
        <NestedList nestedItems={nestedItems} setItemInfo={setItemInfo} searchTerm={searchTerm} />
      </Collapse>
    </>
  );
};

const App = ({}) => {
  const [itemInfo, setItemInfo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarItems = [
    {
      title: "Alarm",
      nestedItems: [
        {
          title: "Zgrada : DSC NEO",
          items: [
            {
              title: "Podrum",
              items: ["Spremište robe", "Skladište za kupce", "Garderoba", "Stepenište"],
            },
            {
              title: "Prizemlje",
              items: ["Ulaz Sjever", "Ulaz Jug", "Info pult", "Garaža", "Stepenište"],
            },
            {
              title: "Kat",
              items: ["Ured A", "Ured B", "Ured C", "Garderoba", "Konferencijska dvorana", "Stepenište"],
            },
            {
              title: "Krov",
              items: ["Balkon", "Kuhinja"],
            },
          ],
        },
      ],
    },
    {
      title: "Vatra",
      nestedItems: [
        {
          title: "Zgrada : INIM Smartloop",
          items: [
            {
              title: "Podrum",
              items: Array.from({ length: 20 }, (_, i) => `Senzor ${i + 1}`), // Generates Senzor 1 to Senzor 20
            },
            {
              title: "Prizemlje",
              items: Array.from({ length: 40 }, (_, i) => `Senzor ${i + 21}`), // Generates Senzor 21 to Senzor 60
            },
            {
              title: "Kat",
              items: Array.from({ length: 40 }, (_, i) => `Senzor ${i + 61}`), // Generates Senzor 61 to Senzor 100
            },
            {
              title: "Krov",
              items: Array.from({ length: 31 }, (_, i) => `Senzor ${i + 101}`), // Generates Senzor 101 to Senzor 131
            },
          ],
        },
      ],
    },
    {
      title: "VIDEO",
      nestedItems: [
        {
          title: "VN1 - DVC",
          items: Array.from({ length: 50 }, (_, i) => `Kamera S1K${i + 1}`), // Generates Kamera S1K1 to Kamera S1K50
        },
      ],
    },
    {
      title: "Kontrola pristupa",
      nestedItems: [
        {
          title: "KP : Jantar Codeks",
          items: Array.from({ length: 30 }, (_, i) => `Čitač ${i + 1}`), // Generates Čitač 1 to Čitač 30
        },
      ],
    },
  ];

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
              {/* Search Field */}
              <Box p={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                    "& .MuiInputBase-input": { color: "black" },
                  }}
                />
              </Box>

              {/* Sidebar Items */}
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  title={item.title}
                  nestedItems={item.nestedItems}
                  setItemInfo={setItemInfo}
                  searchTerm={searchTerm}
                />
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
        <DxfViewerComponent height={500} width={500} />
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
