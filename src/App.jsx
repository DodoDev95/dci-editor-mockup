import React, { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, ListSubheader, Collapse, Box, Typography, Divider, Paper, TextField } from "@mui/material";
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

const NestedList = ({ nestedItems, setItemInfo, searchTerm }) => {
  const [open, setOpen] = useState({});
  const toggleNestedOpen = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  return (
    <List component='div' disablePadding>
      {nestedItems.map((nestedItem, index) => {
        // Filter items based on the search term
        const filteredItems = nestedItem.items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

        // Show the nested item only if there are matches or no search term
        if (filteredItems.length > 0 || searchTerm === "") {
          return (
            <React.Fragment key={index}>
              <ListItem button onClick={() => toggleNestedOpen(index)} sx={{ pl: 4 }}>
                <ListItemText sx={{ color: "orange" }} primary={nestedItem.title} />
                {open[index] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open[index] || searchTerm !== ""} timeout='auto' unmountOnExit>
                <List
                  component='div'
                  disablePadding
                  sx={{
                    maxHeight: "200px", // Approximate height for 5 items
                    overflowY: "auto", // Enable scrolling
                    scrollbarWidth: "none", // Hide scrollbars for Firefox
                    "&::-webkit-scrollbar": {
                      display: "none", // Hide scrollbars for Chrome, Safari, Edge
                    },
                  }}
                >
                  {filteredItems.map((item, i) => (
                    <ListItem
                      onClick={() => setItemInfo(item)}
                      key={i}
                      sx={{
                        pl: 6,
                        cursor: "pointer",
                        bgcolor: "lightgray",
                        "&:hover": { bgcolor: "whitesmoke" },
                      }}
                    >
                      <ListItemText sx={{ color: "black" }} primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }
        return null;
      })}
    </List>
  );
};

const SidebarItem = ({ title, nestedItems, setItemInfo, searchTerm }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <ListItem button onClick={toggleOpen}>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open || searchTerm !== ""} timeout='auto' unmountOnExit>
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
      title: "Fire Alarm",
      nestedItems: [
        {
          title: "Zgrada : DSC NEO",
          items: [
            "Podrum",
            "Spremište robe",
            "Skladište za kupce",
            "Garderoba",
            "Stepenište",
            "Prizemlje",
            "Ulaz Sjever",
            "Ulaz Jug",
            "Info pult",
            "Garaža",
            "Stepenište",
            "Kat",
            "Ured A",
            "Ured B",
            "Ured C",
            "Garderoba",
            "Konferencijska dvorana",
            "Stepenište",
            "Krov",
            "Balkon",
            "Kuhinja",
          ],
        },
        {
          title: "INIM Prime",
          items: ["Vrtni objekt", "Hodnik", "Kuhinja", "Soba A", "Soba B"],
        },
      ],
    },
    {
      title: "Vatra",
      nestedItems: [
        {
          title: "Zgrada : INIM Smartloop",
          items: [
            "Podrum",
            "Senzor 1",
            "Senzor 2",
            "Senzor 3",
            "Senzor 4",
            "Senzor 5",
            "Senzor 6",
            "Senzor 7",
            "Senzor 8",
            "Senzor 9",
            "Senzor 10",
            // Add more sensors as needed...
            "Senzor 130",
            "Krov",
            "Senzor 131",
          ],
        },
      ],
    },
    {
      title: "Video",
      nestedItems: [
        {
          title: "VN1 - DVC",
          items: [
            "Kamera S1K1",
            "Kamera S1K2",
            "Kamera S1K3",
            "Kamera S1K4",
            "Kamera S1K5",
            "Kamera S1K6",
            "Kamera S1K7",
            "Kamera S1K8",
            "Kamera S1K9",
            "Kamera S1K10",
            // Add more cameras as needed...
            "Kamera S1K50",
          ],
        },
      ],
    },
    {
      title: "Kontrola pristupa",
      nestedItems: [
        {
          title: "KP : Jantar Codeks",
          items: [
            "Čitač 1",
            "Čitač 2",
            "Čitač 3",
            "Čitač 4",
            "Čitač 5",
            "Čitač 6",
            "Čitač 7",
            "Čitač 8",
            "Čitač 9",
            "Čitač 10",
            // Add more readers as needed...
            "Čitač 30",
          ],
        },
      ],
    },
  ];
  useEffect(() => {
    console.log("dasdas");
    const script = document.createElement("script");
    script.src = "/src/DxfViewer/MainViewer.js";
    script.defer = true;
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box display='flex' width='100vw' overflow='hidden'>
      <Box display='flex' bgcolor='#494949'>
        <Box sx={{ bgcolor: "#494949" }} height='100vh'>
          <Box width='240px' bgcolor='#494949' role='presentation'>
            <List
              sx={{ bgcolor: "#494949", color: "white" }}
              subheader={
                <ListSubheader sx={{ bgcolor: "#494949", color: "white" }} component='div'>
                  Explorer
                </ListSubheader>
              }
            >
              {/* Search Field */}
              <Box p={1}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Search...'
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
                <SidebarItem key={index} title={item.title} nestedItems={item.nestedItems} setItemInfo={setItemInfo} searchTerm={searchTerm} />
              ))}
            </List>
          </Box>
          <Box bgcolor='#494949' flexGrow={1} p={2}>
            <Box mb={2}>
              <Typography color='whitesmoke' variant='body1'>
                Draggable Symbols
              </Typography>
              <Divider sx={{ bgcolor: "whitesmoke" }} />
              <Box display='flex' mt={1} flexWrap='wrap' gap={2}>
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
      <Box display='flex' bgcolor='whitesmoke' width='100%' alignItems='top' justifyContent='center' overflow='hidden'>
        <div style={{ width: "100%", height: "100%" }} id='MainDxfViewerContainerDntDuplicate'></div>
      </Box>
      <Box display='column' rowGap={1}>
        <Box p={1} height={500} width={300} bgcolor='#494949'>
          <ScrollablePanel />
        </Box>
        <Box p={1} height={600} width={300} bgcolor='#494949'>
          <PaperWithTabs tabContent={itemInfo} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
