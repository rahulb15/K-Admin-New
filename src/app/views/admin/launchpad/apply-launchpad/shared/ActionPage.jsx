import React, { useState } from "react";
import { Button, Modal, Box, Typography, Grid, Stack } from "@mui/material";
import { PreSaleForm, WhitelistForm, CreateNGCollectionForm, UnrevealedTokensForm } from "./Forms"; // Import forms
import { useSelector } from "react-redux";

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

const MintAndLaunch = () => {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  console.log("selection", selection);

  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
        PlayGround Area
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
        Welcome to the playground area. Here you can manage your NFT collections
        and configure your minting settings.
      </Typography>

      <Box sx={{ mb: 5 }}></Box>

      <Grid
        container
        spacing={4}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
              Launch Collection
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen("createNgCollection")}
              disabled={selection?.isLaunched}
            >
              Create NG Collection
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <hr
        style={{
          border: "1px solid #f0f0f0",
          width: "100%",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      />

      <Box sx={{ mb: 5 }}></Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom>
              Mint
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen("presale")}
                disabled={selection?.enablePresale === false || selection?.presaleStartDateAndTime}
              >
                Presale
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpen("whitelist")}
                disabled={selection?.enableWhitelist === false || selection?.whitelistStartDateAndTime}
              >
                Whitelist
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom>
              Launch
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen("unrevealedTokens")}
              >
                Unrevealed Tokens
              </Button>
            </Stack>
          </Stack>
          </Grid>


      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {formType === "presale" && <PreSaleForm />}
          {formType === "whitelist" && <WhitelistForm />}
          {formType === "createNgCollection" && <CreateNGCollectionForm />}
          {formType === "unrevealedTokens" && <UnrevealedTokensForm />}
        </Box>
      </Modal>
    </Box>
  );
};

export default MintAndLaunch;
