// import React, { useState } from "react";
// import { Button, Modal, Box, Typography, Grid, Stack } from "@mui/material";
// import {
//   PreSaleForm,
//   WhitelistForm,
//   CreateNGCollectionForm,
//   UnrevealedTokensForm,
// } from "./Forms"; // Import forms
// import AddPresaleUsers from "./AddPresaleUsers";
// import AddWhitelistUsers from "./AddWhitelistUsers";
// import PolicyManagementForm from "./PolicyForm";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import launchapadServices from "services/launchapadServices.tsx";
// import { setSelection } from "features/selectionLaunchpadSlice";
// import { setModalOpen } from "features/launchpadModalActionSlice";
// import UpdatePriceForm from "./UpdatePriceForm";
// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: "90%", sm: 400 }, // Responsive width
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
// };

// const MintAndLaunch = () => {
//   const [open, setOpen] = useState(false);
//   const [formType, setFormType] = useState("");
//   const dispatch = useDispatch();
//   const selection = useSelector(
//     (state) => state?.selectionLaunchpad?.selection
//   );
//   console.log("selection", selection);

//   const refresh = useSelector((state) => state?.refresh?.isRefresh);
//   console.log("refresh", refresh);

//   const launchpadModalAction = useSelector(
//     (state) => state?.launchpadModalAction?.isModalOpen
//   );
//   console.log("launchpadModalAction", launchpadModalAction);

//   useEffect(() => {
//     if (!selection?._id) return;

//     const getLaunchpadById = async (id) => {
//       try {
//         await launchapadServices.getLaunchpadById(id).then((res) => {
//           console.log("res", res.data);
//           dispatch(setSelection(res.data));
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getLaunchpadById(selection?._id);
//   }, [refresh, launchpadModalAction]);

//   const handleOpen = (type) => {
//     setFormType(type);
//     setOpen(true);
//     dispatch(setModalOpen(true));
//   };

//   const handleClose = () => {
//     setOpen(false);
//     dispatch(setModalOpen(false));
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
//         PlayGround Area
//       </Typography>
//       <hr
//         style={{
//           border: "2px solid #f0f0f0",
//           width: "100%",
//           marginBottom: "20px",
//           marginTop: "20px",
//         }}
//       />

//       <Typography variant="h6" gutterBottom>
//         Welcome to the playground area. Here you can manage your NFT collections
//         and configure your minting settings.
//       </Typography>

//       <Box sx={{ mb: 5 }}></Box>

//       <Grid
//         container
//         spacing={4}
//         sx={{ display: "flex", justifyContent: "center" }}
//       >
//         <Grid item xs={12} sm={6} md={4}>
//           <Stack spacing={3}>
//             <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
//               Launch Collection
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleOpen("createNgCollection")}
//               disabled={selection?.isLaunched}
//             >
//               Create NG Collection
//             </Button>
//           </Stack>
//         </Grid>
//       </Grid>

//       <hr
//         style={{
//           border: "1px solid #f0f0f0",
//           width: "100%",
//           marginBottom: "20px",
//           marginTop: "20px",
//         }}
//       />

//       <Box sx={{ mb: 5 }}></Box>

//       <Grid container spacing={4}>
//         <Grid item xs={12} sm={6} md={4}>
//           <Stack spacing={3}>
//             <Typography variant="h5" gutterBottom>
//               Mint
//             </Typography>
//             <Stack spacing={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleOpen("presale")}
//                 disabled={
//                   selection?.enablePresale === true
//                   // selection?.presaleStartDateAndTime
//                 }
//               >
//                 Presale
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => handleOpen("whitelist")}
//                 disabled={
//                   selection?.enableWhitelist === true
//                   // selection?.whitelistStartDateAndTime
//                 }
//               >
//                 Whitelist
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleOpen("addPresaleUsers")}
//                 disabled={selection?.enablePresale === false}
//               >
//                 Add Presale Users
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => handleOpen("addWhitelistUsers")}
//                 disabled={selection?.enableWhitelist === false}
//               >
//                 Add Whitelist Users
//               </Button>
//             </Stack>
//           </Stack>
//         </Grid>

//         <Grid item xs={12} sm={6} md={4}>
//           <Stack spacing={3}>
//             <Typography variant="h5" gutterBottom>
//               Launch
//             </Typography>
//             <Stack spacing={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleOpen("unrevealedTokens")}
//               >
//                 Unrevealed Tokens
//               </Button>
//             </Stack>
//           </Stack>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <Stack spacing={3}>
//             <Typography variant="h5" gutterBottom>
//               Policy Management
//             </Typography>
//             <Stack spacing={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleOpen("policyManagement")}
//               >
//                 Manage Policies
//               </Button>
//             </Stack>
//           </Stack>
//         </Grid>
//         {/* <Grid item xs={12} sm={6} md={4}>
//           <Stack spacing={3}>
//             <Typography variant="h5" gutterBottom>
//               Price Management
//             </Typography>
//             <Stack spacing={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleOpen("updatePrice")}
//               >
//                 Update Price
//               </Button>
//             </Stack>
//           </Stack>
//         </Grid> */}
//       </Grid>

//       <Modal open={launchpadModalAction} onClose={handleClose}>
//         <Box sx={modalStyle}>
//           {formType === "presale" && <PreSaleForm />}
//           {formType === "whitelist" && <WhitelistForm />}
//           {formType === "addPresaleUsers" && <AddPresaleUsers handleClose={handleClose} />}
//           {formType === "addWhitelistUsers" && <AddWhitelistUsers handleClose={handleClose} />}
//           {formType === "createNgCollection" && <CreateNGCollectionForm />}
//           {formType === "unrevealedTokens" && <UnrevealedTokensForm />}
//           {formType === "policyManagement" && <PolicyManagementForm />}
//           {formType === "updatePrice" && <UpdatePriceForm />}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default MintAndLaunch;





import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, Grid, Stack } from "@mui/material";
import moment from "moment";
import {
  PreSaleForm,
  WhitelistForm,
  CreateNGCollectionForm,
  UnrevealedTokensForm,
} from "./Forms";
import AddPresaleUsers from "./AddPresaleUsers";
import AddWhitelistUsers from "./AddWhitelistUsers";
import PolicyManagementForm from "./PolicyForm";
import { useSelector, useDispatch } from "react-redux";
import launchapadServices from "services/launchapadServices.tsx";
import { setSelection } from "features/selectionLaunchpadSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MintAndLaunch = () => {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const dispatch = useDispatch();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
  const refresh = useSelector((state) => state?.refresh?.isRefresh);
  const launchpadModalAction = useSelector((state) => state?.launchpadModalAction?.isModalOpen);

  useEffect(() => {
    if (!selection?._id) return;

    const getLaunchpadById = async (id) => {
      try {
        const res = await launchapadServices.getLaunchpadById(id);
        dispatch(setSelection(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    getLaunchpadById(selection?._id);
  }, [refresh, launchpadModalAction]);

  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
    dispatch(setModalOpen(true));
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setModalOpen(false));
  };

  const isPresaleActive = () => {
    const now = moment();
    const presaleStart = moment(selection?.presaleStartDateAndTime);
    const presaleEnd = moment(selection?.presaleEndDateAndTime);
    return now.isBetween(presaleStart, presaleEnd, null, '[]');
  };

  const isWhitelistActive = () => {
    const now = moment();
    const whitelistStart = moment(selection?.whitelistStartDateAndTime);
    const presaleEnd = moment(selection?.presaleEndDateAndTime);
    return now.isAfter(presaleEnd) && now.isAfter(whitelistStart);
  };

  const canAddPresaleUsers = () => {
    return selection?.enablePresale && moment().isBefore(moment(selection?.presaleStartDateAndTime));
  };

  const canAddWhitelistUsers = () => {
    return selection?.enableWhitelist && moment().isBefore(moment(selection?.whitelistStartDateAndTime));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
        PlayGround Area
      </Typography>
      <hr style={{ border: "2px solid #f0f0f0", width: "100%", marginBottom: "20px", marginTop: "20px" }} />

      <Typography variant="h6" gutterBottom>
        Welcome to the playground area. Here you can manage your NFT collections and configure your minting settings.
      </Typography>

      <Box sx={{ mb: 5 }}></Box>

      <Grid container spacing={4} sx={{ display: "flex", justifyContent: "center" }}>
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

      <hr style={{ border: "1px solid #f0f0f0", width: "100%", marginBottom: "20px", marginTop: "20px" }} />

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
                disabled={!selection?.enablePresale || isPresaleActive()}
              >
                Presale
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpen("whitelist")}
                disabled={!selection?.enableWhitelist || !isWhitelistActive()}
              >
                Whitelist
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen("addPresaleUsers")}
                disabled={!canAddPresaleUsers()}
              >
                Add Presale Users
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpen("addWhitelistUsers")}
                disabled={!canAddWhitelistUsers()}
              >
                Add Whitelist Users
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
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom>
              Policy Management
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen("policyManagement")}
              >
                Manage Policies
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Modal open={launchpadModalAction} onClose={handleClose}>
        <Box sx={modalStyle}>
          {formType === "presale" && <PreSaleForm />}
          {formType === "whitelist" && <WhitelistForm />}
          {formType === "addPresaleUsers" && <AddPresaleUsers handleClose={handleClose} />}
          {formType === "addWhitelistUsers" && <AddWhitelistUsers handleClose={handleClose} />}
          {formType === "createNgCollection" && <CreateNGCollectionForm />}
          {formType === "unrevealedTokens" && <UnrevealedTokensForm />}
          {formType === "policyManagement" && <PolicyManagementForm />}
        </Box>
      </Modal>
    </Box>
  );
};

export default MintAndLaunch;