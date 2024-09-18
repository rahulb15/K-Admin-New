import React, { useState } from "react";
import { Button, Modal, Box, Typography, Grid, Stack } from "@mui/material";
import {
  RoleAssignmentForm
} from "./shared/Forms"; // Import forms
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import launchapadServices from "services/launchapadServices.tsx";
import { setSelection } from "features/selectionLaunchpadSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 }, // Responsive width
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const LaunchpadFunction = () => {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state?.refresh?.isRefresh);
  console.log("refresh", refresh);

  const launchpadModalAction = useSelector(
    (state) => state?.launchpadModalAction?.isModalOpen
  );
  console.log("launchpadModalAction", launchpadModalAction);

  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
    dispatch(setModalOpen(true));
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setModalOpen(false));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
        Launchpad Functions
      </Typography>
      <hr
        style={{
          border: "2px solid #f0f0f0",
          width: "100%",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      />

      <Typography variant="h6" gutterBottom>
        Launchpad Functions allow you to create and manage collections, mint and launch tokens, and more. Select an option below to get started.
      </Typography>

      <Box sx={{ mb: 5 }}></Box>

 

    


      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom>
              Assign Role
            </Typography>
            <Stack spacing={2}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen("assignRole")}
              >
                Assign Role
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>


      <Modal open={launchpadModalAction} onClose={handleClose}>
        <Box sx={modalStyle}>
          {formType === "assignRole" && <RoleAssignmentForm />}
        </Box>
      </Modal>
    </Box>
  );
};

export default LaunchpadFunction;
