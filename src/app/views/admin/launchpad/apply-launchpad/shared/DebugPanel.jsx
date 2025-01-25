import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  useGetFreeMintTotalSupplyQuery,
  useGetCollectionDataQuery,
  useGetCurrentIndexQuery,
  useGetClaimStatusQuery,
  useGetFreeMintsUsedQuery,
  useGetAvailableNormalSupplyQuery,
  useGetTotalMintsQuery,
  useDebugFreeMintQuery,
} from 'services/launchpad.service';

const DebugPanel = ({ collectionName, userAccount }) => {
  const { data: totalSupply, isLoading: loadingSupply } = 
    useGetFreeMintTotalSupplyQuery(collectionName);
  
  const { data: collectionData, isLoading: loadingCollection } = 
    useGetCollectionDataQuery(collectionName);
  
  const { data: currentIndex, isLoading: loadingIndex } = 
    useGetCurrentIndexQuery(collectionName);

  const { data: freeMintsUsed, isLoading: loadingFreeMints } =
    useGetFreeMintsUsedQuery(collectionName);

    console.log(freeMintsUsed);

  const { data: availableNormalSupply, isLoading: loadingNormalSupply } =
    useGetAvailableNormalSupplyQuery(collectionName);


  const { data: debugData, isLoading: loadingDebugData } =
    useDebugFreeMintQuery(collectionName);

  const { data: totalMints, isLoading: loadingTotalMints } =
    useGetTotalMintsQuery(collectionName);

  
  
  const { data: claimStatus, isLoading: loadingClaim } = 
    useGetClaimStatusQuery({
      collectionName, 
      account: "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe"
    });

  const isAnyLoading = loadingSupply || loadingCollection || 
    loadingIndex || loadingClaim;

  if (isAnyLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  const formatData = (data) => {
    return (
      <pre style={{ 
        overflow: 'auto', 
        maxHeight: '200px',
        background: '#f5f5f5',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Free Mint Debug Information
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Debug Data</Typography> 
        </AccordionSummary>
        <AccordionDetails>
          {formatData(debugData)}
        </AccordionDetails>
      </Accordion>



      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Total Mints</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {formatData(totalMints)}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Free Mint Supply</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Total Supply: {totalSupply}</Typography>
          <Typography>Current Index: {currentIndex}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Claim Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Account: {userAccount}</Typography>
          <Typography>Has Claimed: {claimStatus ? "Yes" : "No"}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Collection Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {formatData(collectionData)}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Available Normal Supply</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {formatData(availableNormalSupply)}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Free Mint Usage</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {formatData(freeMintsUsed)}
        </AccordionDetails>
      </Accordion>

     

     




    </Box>
  );
};

export default DebugPanel;