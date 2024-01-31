import { useState } from "react";
import PropTypes from "prop-types";

import {Tabs, Tab, Typography,Box} from "@mui/material";
import {
  Analytics,ContentsList, DailyData
} from "../components";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ContentsPage() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Analytics" {...a11yProps(0)} />
            <Tab label="Day by day tracker" {...a11yProps(1)} />
            <Tab label="Contents" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Analytics />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DailyData />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ContentsList />
        </CustomTabPanel>
      </Box>
    </>
  );
}

export default ContentsPage;
