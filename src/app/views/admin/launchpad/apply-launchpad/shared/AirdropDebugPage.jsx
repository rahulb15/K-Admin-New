import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import AirdropDebugPanel from './AirdropDebugPanel';
import { useSelector } from 'react-redux';

const AirdropDebugPage = () => {
 const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  
  console.log('selection', selection);
  
  if (!selection?.collectionName) {
    return (
      <Box p={3}>
        <Typography>Please select a collection first</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Airdrop Debug Interface
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Collection: {selection.collectionName}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <AirdropDebugPanel 
              collectionName={selection.collectionName} 
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AirdropDebugPage;