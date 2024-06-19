import React, { useState } from "react";
import { RepoWithFiles } from "../../../types";
import MarkDown from "./MarkDown";

import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab'
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

const RepoDisplay = ({content}:{content: RepoWithFiles | null}):React.ReactElement => {

  const [tab, setTab] = useState(0);

  const handleChange = (e: React.SyntheticEvent, newTab: number):void => {
    setTab(newTab);
  };
  if (content === null) { return <></>}

  return (
    <Box>
      <TabContext value={tab}>
        <TabList onChange={handleChange}>
          {content.files.map((file, index) => <Tab key={file.path + index} label={file.path} value={index + ''} />)}
        </TabList>
        {content.files.map((file, index) => <TabPanel value={index + ''}><MarkDown text={file.contents}/></TabPanel> )}
      </TabContext>
    </Box>
  )
}

export default RepoDisplay;