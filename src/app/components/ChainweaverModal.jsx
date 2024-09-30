import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const ChainweaverModal = ({ open, onClose, onSubmit }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    onSubmit(address);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="chainweaver-modal-title"
      aria-describedby="chainweaver-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="chainweaver-modal-title" variant="h6" component="h2">
          Enter Chainweaver Address
        </Typography>
        <TextField
          fullWidth
          label="Chainweaver Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default ChainweaverModal;