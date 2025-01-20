import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import {useGetAirdropEnabledQuery,useGetAirdropHistoryQuery,useGetCollectionDataQuery } from "services/launchpad.service";


const AirdropDebugPanel = ({ collectionName }) => {
  // Queries for airdrop information
  const { data: airdropEnabled, isLoading: loadingEnabled } = 
    useGetAirdropEnabledQuery(collectionName);
  
  const { data: airdropHistory, isLoading: loadingHistory } = 
    useGetAirdropHistoryQuery();
  
  const { data: collectionData, isLoading: loadingCollection } = 
    useGetCollectionDataQuery(collectionName);

  if (loadingEnabled || loadingHistory || loadingCollection) {
    return <CircularProgress />;
  }

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Airdrop Debug Information
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Airdrop Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Enabled: {airdropEnabled ? "Yes" : "No"}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Airdrop History</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre>
            {JSON.stringify(airdropHistory, null, 2)}
          </pre>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Collection Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <pre>
            {JSON.stringify(collectionData, null, 2)}
          </pre>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AirdropDebugPanel;