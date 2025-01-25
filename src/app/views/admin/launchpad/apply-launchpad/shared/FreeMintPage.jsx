// // FreeMintPage.jsx
// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Button,
//   TextField,
//   Typography,
//   Box,
//   CircularProgress,
//   Grid,
//   Paper,
//   Switch,
//   FormControlLabel,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import useAuth from "app/hooks/useAuth";
// import { useSelector, useDispatch } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Swal from "sweetalert2";
// import { setRefresh } from "features/refreshSlice";
// import { setModalOpen } from "features/launchpadModalActionSlice";
// import {
//   useExecuteFreeMintMutation,
//   useCreateFreeMintMutation,
//   useGetFreeMintEnabledQuery,
//   useGetFreeMintClaimQuery,
//   useBeforeReservingTokenMutation,
// } from "services/launchpad.service";

// const schema = yup.object().shape({
//   collectionName: yup.string().required("Collection name is required"),
//   freeMintSupply: yup
//     .number()
//     .required("Free mint supply is required")
//     .positive("Supply must be positive")
//     .integer("Supply must be an integer"),
//   enableFreeMint: yup.boolean(),
// });

// const FreeMintPage = () => {
//   const [tabValue, setTabValue] = React.useState(0);
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const selection = useSelector(
//     (state) => state?.selectionLaunchpad?.selection
//   );

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Box>
//       <Tabs value={tabValue} onChange={handleTabChange}>
//         <Tab label="Create Free Mint" />
//         <Tab label="Claim Free Mint" />
//       </Tabs>

//       <Box mt={2}>
//         {tabValue === 0 && <CreateFreeMintTab />}
//         {tabValue === 1 && <ClaimFreeMintTab />}
//       </Box>
//     </Box>
//   );
// };

// const CreateFreeMintTab = () => {
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const selection = useSelector(
//     (state) => state?.selectionLaunchpad?.selection
//   );
//   const [createFreeMint, { isLoading }] = useCreateFreeMintMutation();
//     const [beforeReservingToken] = useBeforeReservingTokenMutation();

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       collectionName: selection?.collectionName || "",
//       freeMintSupply: 1,
//       enableFreeMint: true,
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       // First, initialize the free mint ledger
//       const result = await createFreeMint({
//         collectionName: data.collectionName,
//         creator: user?.walletAddress,
//         freeMintSupply: parseInt(data.freeMintSupply),
//         creatorGuard: true,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//       }).unwrap();
//       console.log("result", result);

//       if (result?.result?.status === "success") {
//         // Now initialize the account ledger for claiming
//         await beforeReservingToken({
//           collectionName: data.collectionName,
//           account: user?.walletAddress,
//           wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//         });

//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Free mint created successfully",
//         });
//         dispatch(setRefresh(true));
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to create free mint",
//       });
//     }
//   };

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Create Free Mint
//       </Typography>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Controller
//               name="collectionName"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Collection Name"
//                   fullWidth
//                   error={!!errors.collectionName}
//                   helperText={errors.collectionName?.message}
//                   disabled={!!selection?.collectionName}
//                 />
//               )}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <Controller
//               name="freeMintSupply"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Free Mint Supply"
//                   type="number"
//                   fullWidth
//                   error={!!errors.freeMintSupply}
//                   helperText={errors.freeMintSupply?.message}
//                 />
//               )}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Controller
//                   name="enableFreeMint"
//                   control={control}
//                   render={({ field }) => (
//                     <Switch {...field} checked={field.value} />
//                   )}
//                 />
//               }
//               label="Enable Free Mint"
//             />
//           </Grid>
//         </Grid>

//         <Box mt={3}>
//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             disabled={isLoading}
//             fullWidth
//           >
//             {isLoading ? <CircularProgress size={24} /> : "Create Free Mint"}
//           </Button>
//         </Box>
//       </form>
//     </Paper>
//   );
// };

// const ClaimFreeMintTab = () => {
//   const { user } = useAuth();
//   console.log("user", user);
//   const selection = useSelector(
//     (state) => state?.selectionLaunchpad?.selection
//   );
//   const [executeFreeMint, { isLoading }] = useExecuteFreeMintMutation();
// //   const [isReadyToClaim, setIsReadyToClaim] = useState(false);
//   const { data: isEnabled } = useGetFreeMintEnabledQuery(
//     selection?.collectionName
//   );

//   console.log("isEnabled", isEnabled);
//   const { data: hasClaimed } = useGetFreeMintClaimQuery({
//     collectionName: selection?.collectionName,
//     account: user?.walletAddress,
//   });
//   console.log("hasClaimed", hasClaimed);

//   const handleClaim = async () => {
//     try {
//       const result = await executeFreeMint({
//         collectionName: selection?.collectionName,
//         account: user?.walletAddress,
//         amount: 1,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//       }).unwrap();

//       if (result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Successfully claimed free mint!",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to claim free mint",
//       });
//     }
//   };

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Claim Free Mint
//       </Typography>

//       {!isEnabled && (
//         <Typography color="error" sx={{ mb: 2 }}>
//           Free mint is not enabled for this collection
//         </Typography>
//       )}

//       {hasClaimed && (
//         <Typography color="primary" sx={{ mb: 2 }}>
//           You have already claimed your free mint
//         </Typography>
//       )}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleClaim}
//         disabled={isLoading || !isEnabled || hasClaimed}
//         fullWidth
//       >
//         {isLoading ? <CircularProgress size={24} /> : "Claim Free Mint"}
//       </Button>
//     </Paper>
//   );
// };

// export default FreeMintPage;

// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Button,
//   TextField,
//   Typography,
//   Box,
//   CircularProgress,
//   Grid,
//   Paper,
//   Switch,
//   FormControlLabel,
//   Tabs,
//   Tab,
//   Alert,
// } from "@mui/material";
// import useAuth from "app/hooks/useAuth";
// import { useSelector, useDispatch } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Swal from "sweetalert2";
// import { setRefresh } from "features/refreshSlice";
// import { setModalOpen } from "features/launchpadModalActionSlice";
// import {
//   useExecuteFreeMintMutation,
//   useCreateFreeMintMutation,
//   useGetFreeMintEnabledQuery,
//   useGetFreeMintClaimQuery,
//   useBeforeReservingTokenMutation,
//   useGetFreeMintTotalSupplyQuery,
// } from "services/launchpad.service";

// import {
//   useGetCollectionDataQuery,
//   useGetCurrentIndexQuery,
//   useGetClaimStatusQuery,
// } from 'services/launchpad.service';
// import DebugPanel from "./DebugPanel";

// const schema = yup.object().shape({
//   collectionName: yup.string().required("Collection name is required"),
//   freeMintSupply: yup
//     .number()
//     .required("Free mint supply is required")
//     .positive("Supply must be positive")
//     .integer("Supply must be an integer")
//     .min(1, "Supply must be at least 1"),
// });

// const FreeMintPage = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const { user } = useAuth();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);

//   if (!selection?.allowFreeMints) {
//     return (
//       <Alert severity="warning" sx={{ mb: 2 }}>
//         Free minting is not enabled for this collection. Please enable it in collection settings.
//       </Alert>
//     );
//   }

//   return (
//     <Box>
//       <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
//         <Tab label="Create Free Mint" />
//         <Tab label="Claim Free Mint" />
//       </Tabs>

//       <Box mt={2}>
//         {tabValue === 0 && <CreateFreeMintTab />}
//         {tabValue === 1 && <ClaimFreeMintTab />}
//       </Box>
//         {/* Add debug panel */}
//         <DebugPanel
//         collectionName={selection?.collectionName}
//         userAccount={user?.walletAddress}
//       />
//     </Box>
//   );
// };

// const CreateFreeMintTab = () => {
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
//   const [createFreeMint, { isLoading: isCreating }] = useCreateFreeMintMutation();
//   const [beforeReservingToken, { isLoading: isInitializing }] = useBeforeReservingTokenMutation();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       collectionName: selection?.collectionName || "",
//       freeMintSupply: 1,
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       setIsProcessing(true);

//       // Step 1: Create free mint
//       const createResult = await createFreeMint({
//         collectionName: data.collectionName,
//         creator: user?.walletAddress,
//         freeMintSupply: parseInt(data.freeMintSupply),
//         creatorGuard: true,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//       }).unwrap();

//       if (!createResult?.result?.status === "success") {
//         throw new Error("Failed to create free mint");
//       }

//       // Step 2: Initialize account
//       const initResult = await beforeReservingToken({
//         collectionName: data.collectionName,
//         account: user?.walletAddress,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//       }).unwrap();

//       if (!initResult?.result?.status === "success") {
//         throw new Error("Failed to initialize account for free mint");
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Free mint created and initialized successfully",
//       });

//       dispatch(setRefresh(true));
//       dispatch(setModalOpen(false));
//     } catch (error) {
//       console.error("Free mint creation error:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to set up free mint",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Create Free Mint
//       </Typography>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Controller
//               name="collectionName"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Collection Name"
//                   fullWidth
//                   error={!!errors.collectionName}
//                   helperText={errors.collectionName?.message}
//                   disabled={!!selection?.collectionName}
//                   value={selection?.collectionName || field.value}
//                 />
//               )}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <Controller
//               name="freeMintSupply"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Free Mint Supply"
//                   type="number"
//                   fullWidth
//                   error={!!errors.freeMintSupply}
//                   helperText={errors.freeMintSupply?.message}
//                 />
//               )}
//             />
//           </Grid>
//         </Grid>

//         <Box mt={3}>
//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             disabled={isProcessing || isCreating || isInitializing}
//             fullWidth
//           >
//             {isProcessing ? <CircularProgress size={24} /> : "Create Free Mint"}
//           </Button>
//         </Box>
//       </form>
//     </Paper>
//   );
// };

// const ClaimFreeMintTab = () => {
//   const { user } = useAuth();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
//   const [executeFreeMint, { isLoading }] = useExecuteFreeMintMutation();
//   const [isClaimDisabled, setIsClaimDisabled] = useState(false);
//   const [beforeReservingToken, { isLoading: isInitializing }] = useBeforeReservingTokenMutation();
//   const dispatch = useDispatch();

//   const { data: isEnabled, isLoading: checkingEnabled } = useGetFreeMintEnabledQuery(
//     selection?.collectionName,
//     { skip: !selection?.collectionName }
//   );

//   const { data: hasClaimed, isLoading: checkingClaim } = useGetFreeMintClaimQuery(
//     {
//       collectionName: selection?.collectionName,
//       account: user?.walletAddress,
//     },
//     { skip: !selection?.collectionName || !user?.walletAddress }
//   );

//   const { data: totalSupply, isLoading: checkingSupply } = useGetFreeMintTotalSupplyQuery(
//     selection?.collectionName,
//     { skip: !selection?.collectionName }
//   );
//     const { data: collectionData, isLoading: loadingCollection } =
//       useGetCollectionDataQuery(selection?.collectionName, { skip: !selection?.collectionName });

//     const { data: currentIndex, isLoading: loadingIndex } =
//       useGetCurrentIndexQuery(selection?.collectionName, { skip: !selection?.collectionName });

//     const { data: claimStatus, isLoading: loadingClaim } =
//       useGetClaimStatusQuery({
//         collectionName: selection?.collectionName,
//         account: user?.walletAddress
//       }, { skip: !selection?.collectionName || !user?.walletAddress });

//   useEffect(() => {
//     // Combine all conditions that would disable claiming
//     setIsClaimDisabled(
//       isLoading ||
//       !isEnabled ||
//       hasClaimed ||
//       checkingEnabled ||
//       checkingClaim ||
//       checkingSupply ||
//       (totalSupply !== undefined && totalSupply <= 0)
//     );
//   }, [isEnabled, hasClaimed, totalSupply, isLoading, checkingEnabled, checkingClaim, checkingSupply]);

//   // const handleClaim = async () => {
//   //   try {

//   //     const claimerAddress = "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe";
//   //     const walletType = "ecko";

//   //     // Step 1: Initialize account for free mint
//   //     const initResult = await beforeReservingToken({
//   //       collectionName: selection?.collectionName,
//   //       account: claimerAddress,  // Use claimer's address
//   //       wallet: walletType
//   //     }).unwrap();

//   //     if (!initResult?.result?.status === "success") {
//   //       throw new Error("Failed to initialize account for free mint");
//   //     }

//   //     // Step 2: Execute free mint
//   //     const result = await executeFreeMint({
//   //       collectionName: selection?.collectionName,
//   //       account: claimerAddress, // Same claimer's address
//   //       amount: 3, // Changed from 2 to 1 as per your contract
//   //       wallet: walletType
//   //     }).unwrap();

//   //     if (result?.result?.status === "success") {
//   //       Swal.fire({
//   //         icon: "success",
//   //         title: "Success",
//   //         text: "Successfully claimed free mint!",
//   //       });
//   //       dispatch(setRefresh(true));
//   //     }

//   //     // const result = await executeFreeMint({
//   //     //   collectionName: selection?.collectionName,
//   //     //   account: user?.walletAddress,
//   //     //   amount: 1,
//   //     //   wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//   //     // }).unwrap();

//   //     // if (result?.result?.status === "success") {
//   //     //   Swal.fire({
//   //     //     icon: "success",
//   //     //     title: "Success",
//   //     //     text: "Successfully claimed free mint!",
//   //     //   });
//   //     //   // Refresh queries
//   //     //   dispatch(setRefresh(true));
//   //     // }
//   //   } catch (error) {
//   //     console.error("Claim error:", error);
//   //     Swal.fire({
//   //       icon: "error",
//   //       title: "Error",
//   //       text: error.message || "Failed to claim free mint",
//   //     });
//   //   }
//   // };

//   // const handleClaim = async () => {
//   //   try {
//   //     const claimerAddress = "k:073754b5ac73433099adf56fc1e896e005ac963fe0b97ae240fc5e14ff4fe5fb";
//   //     // wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"

//   //     const walletType = "ecko";

//   //     // // First check if already claimed
//   //     // const claimStatus = await getClaimStatus({
//   //     //   collectionName: selection?.collectionName,
//   //     //   account: claimerAddress
//   //     // });

//   //     // if (claimStatus?.data === true) {
//   //     //   throw new Error("Already claimed free mint");
//   //     // }

//   //     // // Then check supply
//   //     // const supplyData = await getFreeMintTotalSupply(selection?.collectionName);
//   //     // console.log("supplyData", supplyData);
//   //     // if (supplyData?.data <= 0) {
//   //     //   throw new Error("No free mints remaining");
//   //     // }

//   //     console.log("totalSupply", totalSupply);

//   //     // const initResult = await beforeReservingToken({
//   //     //   collectionName: selection?.collectionName,
//   //     //   account: claimerAddress,
//   //     //   wallet: walletType
//   //     // }).unwrap();

//   //     // if (!initResult?.result?.status === "success") {
//   //     //   throw new Error("Failed to initialize account for free mint");
//   //     // }

//   //     // Execute free mint
//   //     const result = await executeFreeMint({
//   //       collectionName: selection?.collectionName,
//   //       account: claimerAddress,
//   //       amount: 1, // Change to 1 as multiple mints might not be allowed
//   //       wallet: walletType
//   //     }).unwrap();

//   //     if (result?.result?.status === "success") {
//   //       Swal.fire({
//   //         icon: "success",
//   //         title: "Success",
//   //         text: "Successfully claimed free mint!",
//   //       });
//   //       dispatch(setRefresh(true));
//   //     }
//   //   } catch (error) {
//   //     console.error("Claim error:", error);
//   //     Swal.fire({
//   //       icon: "error",
//   //       title: "Error",
//   //       text: error.message || "Failed to claim free mint"
//   //     });
//   //   }
//   // };

//   const handleClaim = async () => {
//     try {
//       const claimerAddress = "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe";
//       const walletType = "ecko";

//       // Step 1: Check if collection exists and free mint is enabled
//       // const collectionData = await getCollectionData(selection?.collectionName).unwrap();
//       if (!collectionData) {
//         throw new Error("Collection not found");
//       }

//       // Step 2: Check if free mint is enabled
//       // const isEnabled = await getFreeMintEnabled(selection?.collectionName).unwrap();
//       if (!isEnabled) {
//         throw new Error("Free mint is not enabled for this collection");
//       }

//       // Step 3: Check remaining supply
//       // const totalSupply = await getFreeMintTotalSupply(selection?.collectionName).unwrap();
//       console.log("Total supply:", totalSupply);
//       if (totalSupply <= 0) {
//         throw new Error("No free mints remaining");
//       }

//       // Step 4: Check if already claimed
//       // const hasClaimed = await getFreeMintClaim({
//       //   collectionName: selection?.collectionName,
//       //   account: claimerAddress
//       // }).unwrap();
//       if (hasClaimed) {
//         throw new Error("Already claimed free mint");
//       }

//       // Step 5: Initialize user account
//       // const initResult = await beforeReservingToken({
//       //   collectionName: selection?.collectionName,
//       //   account: claimerAddress,
//       //   wallet: walletType
//       // }).unwrap();

//       // Step 6: Execute the free mint
//       const result = await executeFreeMint({
//         collectionName: selection?.collectionName,
//         account: claimerAddress,
//         creator: user?.walletAddress,
//         amount: 1,
//         wallet: walletType
//       }).unwrap();

//       if (result?.result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Successfully claimed free mint!",
//         });
//         dispatch(setRefresh(true));
//       }
//     } catch (error) {
//       console.error("Claim error:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to claim free mint"
//       });
//     }
//   };

//   if (checkingEnabled || checkingClaim || checkingSupply) {
//     return (
//       <Box display="flex" justifyContent="center" p={3}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Claim Free Mint
//       </Typography>

//       {!isEnabled && (
//         <Alert severity="warning" sx={{ mb: 2 }}>
//           Free mint is not enabled for this collection
//         </Alert>
//       )}

//       {hasClaimed && (
//         <Alert severity="info" sx={{ mb: 2 }}>
//           You have already claimed your free mint
//         </Alert>
//       )}

//       {totalSupply !== undefined && totalSupply <= 0 && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           No free mints remaining
//         </Alert>
//       )}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleClaim}
//         disabled={isClaimDisabled}
//         fullWidth
//       >
//         {isLoading ? <CircularProgress size={24} /> : "Claim Free Mint"}
//       </Button>
//     </Paper>
//   );
// };

// export default FreeMintPage;

// import React, { useEffect, useState } from "react";
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import { useForm, Controller } from "react-hook-form";
// import {
//   Button,
//   TextField,
//   Typography,
//   Box,
//   CircularProgress,
//   Grid,
//   Paper,
//   Tabs,
//   Tab,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { DateTimePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import useAuth from "app/hooks/useAuth";
// import { useSelector, useDispatch } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Swal from "sweetalert2";
// import { setRefresh } from "features/refreshSlice";
// import { setModalOpen } from "features/launchpadModalActionSlice";
// import {
//   useExecuteFreeMintMutation,
//   useCreateFreeMintMutation,
//   useGetFreeMintEnabledQuery,
//   useGetFreeMintClaimQuery,
//   useBeforeReservingTokenMutation,
//   useGetFreeMintTotalSupplyQuery,
//   useCancelFreeMintMutation,
//   useIsFreeMintActiveQuery,
//   useGetCollectionDataQuery,
//   useGetCurrentIndexQuery,
//   useGetClaimStatusQuery,
// } from 'services/launchpad.service';

// // Initialize dayjs plugins
// dayjs.extend(utc);
// dayjs.extend(timezone);

// // Helper function to format time for Kadena
// const formatTimeForKadena = (date) => {
//   return dayjs(date).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
// };

// const schema = yup.object().shape({
//   collectionName: yup.string().required("Collection name is required"),
//   freeMintSupply: yup
//     .number()
//     .required("Free mint supply is required")
//     .positive("Supply must be positive")
//     .integer("Supply must be an integer")
//     .min(1, "Supply must be at least 1"),
//   startTime: yup
//     .mixed()
//     .required("Start time is required")
//     .test("is-date", "Invalid date", value => dayjs.isDayjs(value)),
//   endTime: yup
//     .mixed()
//     .required("End time is required")
//     .test("is-date", "Invalid date", value => dayjs.isDayjs(value))
//     .test("min", "End time must be after start time", function(value) {
//       const { startTime } = this.parent;
//       return !startTime || !value || value.isAfter(startTime);
//     }),
// });

// const FreeMintPage = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const { user } = useAuth();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);

//   if (!selection?.allowFreeMints) {
//     return (
//       <Alert severity="warning" sx={{ mb: 2 }}>
//         Free minting is not enabled for this collection. Please enable it in collection settings.
//       </Alert>
//     );
//   }

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Box>
//       <Tabs value={tabValue} onChange={handleTabChange}>
//         <Tab label="Create Free Mint" />
//         <Tab label="Claim Free Mint" />
//       </Tabs>

//       <Box mt={2}>
//         {tabValue === 0 && <CreateFreeMintTab />}
//         {tabValue === 1 && <ClaimFreeMintTab />}
//         <DebugPanel
//         collectionName={selection?.collectionName}
//         userAccount={user?.walletAddress}
//       />
//       </Box>
//     </Box>
//   );
// };

// const CreateFreeMintTab = () => {
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
//   const [createFreeMint, { isLoading: isCreating }] = useCreateFreeMintMutation();
//   const [cancelFreeMint, { isLoading: isCancelling }] = useCancelFreeMintMutation();
//   const [confirmDialog, setConfirmDialog] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const defaultEndTime = dayjs().add(7, 'day');

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     reset
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       collectionName: selection?.collectionName || "",
//       freeMintSupply: 1,
//       startTime: dayjs(),
//       endTime: defaultEndTime,
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       setIsProcessing(true);
//       const startTimeFormatted = formatTimeForKadena(data.startTime);
//       const endTimeFormatted = formatTimeForKadena(data.endTime);

//       console.log("Creating free mint with:", {
//         collectionName: data.collectionName,
//         supply: data.freeMintSupply,
//         startTime: startTimeFormatted,
//         endTime: endTimeFormatted
//       });

//       const result = await createFreeMint({
//         collectionName: data.collectionName,
//         creator: user?.walletAddress,
//         freeMintSupply: parseInt(data.freeMintSupply),
//         startTime: startTimeFormatted,
//         endTime: endTimeFormatted,
//         creatorGuard: true,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//       }).unwrap();

//       if (result?.result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Free mint created successfully",
//         });
//         dispatch(setRefresh(true));
//         dispatch(setModalOpen(false));
//         reset(); // Reset form after successful creation
//       } else {
//         throw new Error(result?.result?.error || "Failed to create free mint");
//       }
//     } catch (error) {
//       console.error("Error creating free mint:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to create free mint",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       setIsProcessing(true);
//       const result = await cancelFreeMint({
//         collectionName: selection?.collectionName,
//         creatorGuard: true,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
//       }).unwrap();

//       if (result?.result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Free mint cancelled successfully",
//         });
//         setConfirmDialog(false);
//         dispatch(setRefresh(true));
//       } else {
//         throw new Error(result?.result?.error || "Failed to cancel free mint");
//       }
//     } catch (error) {
//       console.error("Error cancelling free mint:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to cancel free mint",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Create Free Mint
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Controller
//                 name="collectionName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Collection Name"
//                     fullWidth
//                     error={!!errors.collectionName}
//                     helperText={errors.collectionName?.message}
//                     disabled={!!selection?.collectionName}
//                     value={selection?.collectionName || field.value}
//                   />
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Controller
//                 name="freeMintSupply"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Free Mint Supply"
//                     type="number"
//                     fullWidth
//                     error={!!errors.freeMintSupply}
//                     helperText={errors.freeMintSupply?.message}
//                   />
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Controller
//                 name="startTime"
//                 control={control}
//                 render={({ field }) => (
//                   <DateTimePicker
//                     {...field}
//                     label="Start Time"
//                     views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
//                     ampm={false}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         error: !!errors.startTime,
//                         helperText: errors.startTime?.message
//                       }
//                     }}
//                   />
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Controller
//                 name="endTime"
//                 control={control}
//                 render={({ field }) => (
//                   <DateTimePicker
//                     {...field}
//                     label="End Time"
//                     views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
//                     ampm={false}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         error: !!errors.endTime,
//                         helperText: errors.endTime?.message
//                       }
//                     }}
//                     minDateTime={watch("startTime")}
//                   />
//                 )}
//               />
//             </Grid>
//           </Grid>

//           <Box mt={3} display="flex" gap={2}>
//             <Button
//               variant="contained"
//               color="primary"
//               type="submit"
//               disabled={isProcessing || isCreating}
//               fullWidth
//             >
//               {isCreating ? <CircularProgress size={24} /> : "Create Free Mint"}
//             </Button>

//             <Button
//               variant="outlined"
//               color="error"
//               onClick={() => setConfirmDialog(true)}
//               disabled={isProcessing || isCancelling}
//               fullWidth
//             >
//               {isCancelling ? <CircularProgress size={24} /> : "Cancel Free Mint"}
//             </Button>
//           </Box>
//         </form>

//         <Dialog
//           open={confirmDialog}
//           onClose={() => !isProcessing && setConfirmDialog(false)}
//           disableEscapeKeyDown={isProcessing}
//         >
//           <DialogTitle>Confirm Cancel Free Mint</DialogTitle>
//           <DialogContent>
//             <Typography>
//               Are you sure you want to cancel the free mint? This action cannot be undone.
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setConfirmDialog(false)}
//               disabled={isProcessing}
//             >
//               No, Keep Free Mint
//             </Button>
//             <Button
//               onClick={handleCancel}
//               color="error"
//               variant="contained"
//               disabled={isProcessing}
//             >
//               {isProcessing ? <CircularProgress size={20} /> : "Yes, Cancel Free Mint"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Paper>
//     </LocalizationProvider>
//   );
// };

// const ClaimFreeMintTab = () => {
//   const { user } = useAuth();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
//   const [executeFreeMint, { isLoading }] = useExecuteFreeMintMutation();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const dispatch = useDispatch();

//   // Get all the necessary data
//   const { data: isActive, isLoading: checkingStatus } = useIsFreeMintActiveQuery(
//     selection?.collectionName,
//     { pollingInterval: 10000 } // Poll every 10 seconds
//   );

//   const { data: isEnabled } = useGetFreeMintEnabledQuery(selection?.collectionName);
//   const { data: hasClaimed } = useGetFreeMintClaimQuery({
//     collectionName: selection?.collectionName,
//     account: user?.walletAddress,
//   });
//   const { data: totalSupply } = useGetFreeMintTotalSupplyQuery(selection?.collectionName);

//   // Handle the claim action
//   const handleClaim = async () => {
//     try {
//       setIsProcessing(true);

//       if (!isActive) {
//         throw new Error("Free mint is not currently active");
//       }

//       const result = await executeFreeMint({
//         collectionName: selection?.collectionName,
//         account: user?.walletAddress,
//         amount: 1,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
//       }).unwrap();

//       if (result?.result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Successfully claimed free mint!",
//         });
//         dispatch(setRefresh(true));
//       } else {
//         throw new Error(result?.result?.error || "Failed to claim free mint");
//       }
//     } catch (error) {
//       console.error("Error claiming free mint:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to claim free mint",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Show loading state
//   if (checkingStatus) {
//     return (
//       <Paper sx={{ p: 3 }}>
//         <Box display="flex" justifyContent="center">
//           <CircularProgress />
//         </Box>
//       </Paper>
//     );
//   }

//   // Show if already claimed
//   if (hasClaimed) {
//     return (
//       <Paper sx={{ p: 3 }}>
//         <Alert severity="info">
//           You have already claimed your free mint
//         </Alert>
//       </Paper>
//     );
//   }

//   // Show if not active
//   if (!isActive) {
//     return (
//       <Paper sx={{ p: 3 }}>
//         <Alert severity="info">
//           Free mint is currently not active
//         </Alert>
//       </Paper>
//     );
//   }

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Claim Free Mint
//       </Typography>

//       <Alert severity="info" sx={{ mb: 2 }}>
//         Free mint is active and available for claiming
//       </Alert>

//       {totalSupply !== undefined && (
//         <Alert severity={totalSupply > 0 ? "info" : "error"} sx={{ mb: 2 }}>
//           {totalSupply > 0
//             ? `Remaining supply: ${totalSupply}`
//             : "No free mints remaining"}
//         </Alert>
//       )}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleClaim}
//         disabled={isProcessing || isLoading || !isEnabled || hasClaimed || totalSupply <= 0}
//         fullWidth
//       >
//         {isProcessing || isLoading ? (
//           <Box display="flex" alignItems="center" gap={1}>
//             <CircularProgress size={20} />
//             <span>Processing...</span>
//           </Box>
//         ) : (
//           "Claim Free Mint"
//         )}
//       </Button>

//       {!isEnabled && (
//         <Alert severity="error" sx={{ mt: 2 }}>
//           Free minting is currently disabled for this collection
//         </Alert>
//       )}
//     </Paper>
//   );
// };
// const DebugPanel = ({ collectionName, userAccount }) => {
//   const { data: totalSupply, isLoading: loadingSupply } = useGetFreeMintTotalSupplyQuery(collectionName);
//   const { data: currentIndex, isLoading: loadingIndex } = useGetCurrentIndexQuery(collectionName);
//   const { data: claimStatus, isLoading: loadingClaim } = useGetClaimStatusQuery({
//     collectionName,
//     account: userAccount
//   });
//   const { data: freeMintStatus } = useIsFreeMintActiveQuery(collectionName);

//   if (loadingSupply || loadingIndex || loadingClaim) {
//     return (
//       <Box display="flex" justifyContent="center" p={3}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Paper sx={{ mt: 3, p: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Free Mint Status
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <Alert severity="info">
//             Total Supply: {totalSupply || 0}
//           </Alert>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Alert severity="info">
//             Current Index: {currentIndex || 0}
//           </Alert>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Alert severity={claimStatus ? "warning" : "success"}>
//             Claimed: {claimStatus ? "Yes" : "No"}
//           </Alert>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Alert severity={freeMintStatus?.isActive ? "success" : "warning"}>
//             Status: {freeMintStatus?.isActive ? "Active" : "Inactive"}
//           </Alert>
//         </Grid>

//         {freeMintStatus?.startTime && (
//           <Grid item xs={12}>
//             <Alert severity="info">
//               Time Window: {dayjs(freeMintStatus.startTime).format('YYYY-MM-DD HH:mm:ss')}
//               {" → "}
//               {dayjs(freeMintStatus.endTime).format('YYYY-MM-DD HH:mm:ss')}
//             </Alert>
//           </Grid>
//         )}
//       </Grid>
//     </Paper>
//   );
// };

// export default FreeMintPage;


// FreeMintPage.tsx
import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import DebugPanel from './DebugPanel';

// Blockchain operations import
import {
  useExecuteFreeMintMutation,
  useCreateFreeMintMutation,
  useGetFreeMintEnabledQuery,
  useGetFreeMintClaimQuery,
  useBeforeReservingTokenMutation,
  useGetFreeMintTotalSupplyQuery,
  useCancelFreeMintMutation,
  useIsFreeMintActiveQuery,
  useGetFreeMintTimeStatusQuery,
  useGetCollectionDataQuery,
  useGetCurrentIndexQuery,
  useGetClaimStatusQuery,
} from 'services/launchpad.service';

// Backend operations import
import {
  useUpdateAllowUsersMutation,
  useAddUsersMutation,
  useGetFreeMintUsersQuery,
  useMarkClaimedMutation,
  useGetAllowUserStatusQuery,
  useCreateFreeMintLocalMutation
} from 'services/freeMint.service';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to format time for Kadena
const formatTimeForKadena = (date) => {
  return dayjs(date).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
};

// Form validation schema
const schema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
  freeMintSupply: yup
    .number()
    .required("Free mint supply is required")
    .positive("Supply must be positive")
    .integer("Supply must be an integer")
    .min(1, "Supply must be at least 1"),
  startTime: yup
    .mixed()
    .required("Start time is required")
    .test("is-date", "Invalid date", value => dayjs.isDayjs(value)),
  endTime: yup
    .mixed()
    .required("End time is required")
    .test("is-date", "Invalid date", value => dayjs.isDayjs(value))
    .test("min", "End time must be after start time", function(value) {
      const { startTime } = this.parent;
      return !startTime || !value || value.isAfter(startTime);
    }),
  allowUsers: yup.boolean(),
  kAddresses: yup.string().when("allowUsers", {
    is: true,
    then: yup.string().required("K addresses are required when allowing users")
  })
});

const FreeMintPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);

  if (!selection?.allowFreeMints) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Free minting is not enabled for this collection. Please enable it in collection settings.
      </Alert>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Create Free Mint" />
        <Tab label="Claim Free Mint" />
      </Tabs>

      <Box mt={2}>
        {tabValue === 0 && <CreateFreeMintTab />}
        {tabValue === 1 && <ClaimFreeMintTab />}
        <DebugPanel
          collectionName={selection?.collectionName}
          userAccount={user?.walletAddress}
        />
      </Box>
    </Box>
  );
};

const CreateFreeMintTab = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);

  const [createFreeMintLocal, { isLoading: isCreatingLocal }] = useCreateFreeMintLocalMutation();

  // Blockchain mutations
  const [createFreeMint, { isLoading: isCreating }] = useCreateFreeMintMutation();
  const [cancelFreeMint, { isLoading: isCancelling }] = useCancelFreeMintMutation();
  const { data: isActive } = useIsFreeMintActiveQuery(selection?.collectionName);

  // useGetFreeMintTimeStatusQuery
  const { data: freeMintTimeStatus } = useGetFreeMintTimeStatusQuery(selection?.collectionName);
  console.log("Free mint time status:", freeMintTimeStatus);

  // const [isActive, setIsActive] = useState(false);
  const { data: allowUsersStatus } = useGetAllowUserStatusQuery(selection?.collectionName);
  console.log("Allow users:", allowUsersStatus);

  // const [isActive, setIsActive] = useState(false);
  
  // Backend mutations
  const [updateAllowUsers] = useUpdateAllowUsersMutation();
  const [addUsers] = useAddUsersMutation();
  
  // Local state
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [kAddressArray, setKAddressArray] = useState([]);

  const defaultEndTime = dayjs().add(7, 'day');

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: selection?.collectionName || "",
      freeMintSupply: 1,
      startTime: dayjs(),
      endTime: defaultEndTime,
      allowUsers: false,
      kAddresses: "",
    },
  });

  // const allowUsers = watch("allowUsers");
  const allowUsers = allowUsersStatus?.data
  console.log("Allow users:", allowUsers);


  // Handle adding K addresses
  const handleAddKAddress = (addresses) => {
    const newAddresses = addresses
      .split(',')
      .map(addr => addr.trim())
      .filter(addr => addr && !kAddressArray.includes(addr));

    if (newAddresses.length > 0) {
      setKAddressArray(prev => [...prev, ...newAddresses]);
    }
  };

  // Handle removing K addresses
  const handleRemoveKAddress = (address) => {
    setKAddressArray(prev => prev.filter(addr => addr !== address));
  };


  //toggle allow user update
  const handleAllowUserUpdate = async (e) => {
    try {
      e.preventDefault();
      console.log("Allow user update:", e.target.checked);
      await updateAllowUsers({
        collectionName: selection?.collectionName,
        allowUsers: e.target.checked
      });
    } catch (error) {
      console.error("Error updating allow users:", error);
      Swal.fire({
        icon: "error",  
        title: "Error",
        text: error.message || "Failed to update allow users",
      });
    }
  };
  





  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setIsProcessing(true);
      const startTimeFormatted = formatTimeForKadena(data.startTime);
      const endTimeFormatted = formatTimeForKadena(data.endTime);

      // Blockchain operation: Create free mint
      const result = await createFreeMint({
        collectionName: data.collectionName,
        creator: user?.walletAddress,
        freeMintSupply: parseInt(data.freeMintSupply),
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        creatorGuard: true,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
      }).unwrap();


      // const result  =  {
      //   gas: 900,
      //   result: {
      //     status: 'success',
      //     data: [
      //       'Write succeeded', 'Write succeeded', 'Write succeeded', 'Free mint created successfully'
      //     ]
      //   },
      //   reqKey: 'UUyI91rij55CoqJJR4f-hKw5003dirMn4GQGy1EeN6w',
      //   logs: 'ySYpLDxaAzcxj7PO3iDvBdKGZYmTuZ6bgmPTADIMBHM',
      //   events: [
      //     {
      //       params: [
      //         'k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe', 'k:4ba39bd19b9f3ecae0f03375f9bbe370b66e0101f1ffce5dbff0f3e9f9290967',
      //         0.000009
      //       ],
      //       name: 'TRANSFER',
      //       module: { namespace: null, name: 'coin' },
      //       moduleHash: 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s'
      //     }
      //   ],
      //   metaData: {
      //     blockTime: 1737361884703814,
      //     prevBlockHash: 'T-WfKRgbbnulGh_xZzeGnjp9QPRQcRdeEJxGj9CR_l8',
      //     blockHash: '7Lal3q9PDMhoNTDC3MMO6vkn59fRiHobcco6uF5LsVY',
      //     blockHeight: 5012247
      //   },
      //   continuation: null,
      //   txId: 6996971
      // }


      console.log("Create free mint result:", result);

      if (result?.result?.status === "success") {
        // If blockchain operation succeeds and allowUsers is enabled

        console.log("Allow users:", data.allowUsers);
        if (data.allowUsers) {
          // Update backend for user management
          await updateAllowUsers({
            collectionName: data.collectionName,
            allowUsers: true
          });

          if (kAddressArray.length > 0) {
            await addUsers({
              collectionName: data.collectionName,
              users: kAddressArray
            });
          }


          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Free mint created successfully",
          });
          dispatch(setRefresh(true));
          dispatch(setModalOpen(false));
          reset();
          setKAddressArray([]);





        } else {

          // Update backend for user management
          await updateAllowUsers({
            collectionName: data.collectionName,
            allowUsers: false
          });

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Free mint created successfully",
          });

          dispatch(setRefresh(true));
          dispatch(setModalOpen(false));
          reset();
          setKAddressArray([]);
        }

        // Swal.fire({
        //   icon: "success",
        //   title: "Success",
        //   text: "Free mint created successfully",
        // });
        // dispatch(setRefresh(true));
        // dispatch(setModalOpen(false));
        // reset();
        // setKAddressArray([]);
      } else {
        throw new Error(result?.result?.error || "Failed to create free mint");
      }
    } catch (error) {
      console.error("Error creating free mint:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create free mint",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel free mint handler
  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      
      // Blockchain operation: Cancel free mint
      const result = await cancelFreeMint({
        collectionName: selection?.collectionName,
        creatorGuard: true,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
      }).unwrap();

      if (result?.result?.status === "success") {
        // If blockchain operation succeeds
        if (allowUsers) {
          // Update backend
          await updateAllowUsers({
            collectionName: selection?.collectionName,
            allowUsers: false
          });
        }

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Free mint cancelled successfully",
        });
        setConfirmDialog(false);
        dispatch(setRefresh(true));
      } else {
        throw new Error(result?.result?.error || "Failed to cancel free mint");
      }
    } catch (error) {
      console.error("Error cancelling free mint:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to cancel free mint",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show user management interface if free mint is active
  if (isActive) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          A free mint is currently active. You can add allowed users or cancel the free mint.
        </Alert>

        <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="allowUsers"
                    control={control}
                    render={({ field }) => (
                      // <Switch {...field} checked={field.value}  onChange={(e) => { field.onChange(e); handleAllowUserUpdate(e); }} />
                      <Switch {...field} checked={allowUsers} onChange={(e) => handleAllowUserUpdate(e)} /> 
                    )}
                  />
                }
                label="Allow Specific Users Only"
              />
            </Grid>

        {allowUsers && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Allowed Users
            </Typography>
            
            <TextField
              label="K Addresses (comma-separated)"
              fullWidth
              multiline
              rows={3}
              onChange={(e) => handleAddKAddress(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {kAddressArray.map((address) => (
                <Chip
                  key={address}
                  label={address}
                  onDelete={() => handleRemoveKAddress(address)}
                />
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={() => addUsers({
                collectionName: selection?.collectionName,
                users: kAddressArray
              })}
              disabled={kAddressArray.length === 0 || isProcessing}
            >
              Add Users
            </Button>
          </Box>
        )}

        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmDialog(true)}
          disabled={isProcessing || isCancelling}
          fullWidth
        >
          {isCancelling ? <CircularProgress size={24} /> : "Cancel Free Mint"}
        </Button>

        <Dialog
          open={confirmDialog}
          onClose={() => !isProcessing && setConfirmDialog(false)}
          disableEscapeKeyDown={isProcessing}
        >
          <DialogTitle>Confirm Cancel Free Mint</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel the free mint? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog(false)}
              disabled={isProcessing}
            >
              No, Keep Free Mint
            </Button>
            <Button
              onClick={handleCancel}
              color="error"
              variant="contained"
              disabled={isProcessing}
            >
              {isProcessing ? <CircularProgress size={20} /> : "Yes, Cancel Free Mint"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }

  // Show create form if no active free mint
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create Free Mint
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="collectionName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Collection Name"
                    fullWidth
                    error={!!errors.collectionName}
                    helperText={errors.collectionName?.message}
                    disabled={!!selection?.collectionName}
                    value={selection?.collectionName || field.value}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="freeMintSupply"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Free Mint Supply"
                    type="number"
                    fullWidth
                    error={!!errors.freeMintSupply}
                    helperText={errors.freeMintSupply?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Start Time"
                    views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startTime,
                        helperText: errors.startTime?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="End Time"
                    views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endTime,
                        helperText: errors.endTime?.message
                      }
                    }}
                    minDateTime={watch("startTime")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="allowUsers"
                    control={control}
                    render={({ field }) => (
                      <Switch {...field} checked={allowUsers} onChange={(e) => handleAllowUserUpdate(e)} /> 
                    )}
                  />
                }
                label="Allow Specific Users Only"
              />
            </Grid>

            {allowUsers && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Added Addresses ({kAddressArray.length})
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {kAddressArray.map((address) => (
                    <Chip
                      key={address}
                      label={address}
                      onDelete={() => handleRemoveKAddress(address)}
                    />
                  ))}
                </Box>

                <Controller
                  name="kAddresses"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="K Addresses (comma-separated)"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.kAddresses}
                      helperText={errors.kAddresses?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        handleAddKAddress(e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isProcessing || isCreating}
              fullWidth
            >
              {isCreating ? <CircularProgress size={24} /> : "Create Free Mint"}
            </Button>
          </Box>
        </form>

        <Dialog 
          open={confirmDialog} 
          onClose={() => !isProcessing && setConfirmDialog(false)}
          disableEscapeKeyDown={isProcessing}
        >
          <DialogTitle>Confirm Cancel Free Mint</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel the free mint? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setConfirmDialog(false)}
              disabled={isProcessing}
            >
              No, Keep Free Mint
            </Button>
            <Button 
              onClick={handleCancel} 
              color="error" 
              variant="contained"
              disabled={isProcessing}
            >
              {isProcessing ? <CircularProgress size={20} /> : "Yes, Cancel Free Mint"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  );
};

const ClaimFreeMintTab = () => {
  const { user } = useAuth();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
  const [executeFreeMint, { isLoading }] = useExecuteFreeMintMutation();
  const [beforeReservingToken] = useBeforeReservingTokenMutation();
  const [markClaimed] = useMarkClaimedMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  // Get all the necessary data
  const { data: isActive, isLoading: checkingStatus } = useIsFreeMintActiveQuery(
    selection?.collectionName,
    { pollingInterval: 10000 } // Poll every 10 seconds
  );

  const { data: allowUsersStatus } = useGetAllowUserStatusQuery(selection?.collectionName, {pollingInterval: 10000});

  
  const { data: isEnabled } = useGetFreeMintEnabledQuery(selection?.collectionName);
  const { data: hasClaimed } = useGetFreeMintClaimQuery({
    collectionName: selection?.collectionName,
    account: user?.walletAddress,
  });
  const { data: totalSupply } = useGetFreeMintTotalSupplyQuery(selection?.collectionName);
  const { data: isAllowedUser } = useGetFreeMintUsersQuery(
    selection?.collectionName,
    { skip: !allowUsersStatus?.data }
  );

  console.log("Allow users status:", isAllowedUser);

  console.log("isAllowedUser:", !allowUsersStatus?.data || isAllowedUser);

  // Handle the claim action
  const handleClaim = async () => {
    try {
      setIsProcessing(true);

      if (!isActive) {
        throw new Error("Free mint is not currently active");
      }

      // First, execute blockchain operations
      await beforeReservingToken({
        collectionName: selection?.collectionName,
        account: user?.walletAddress,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
      }).unwrap();

      const result = await executeFreeMint({
        collectionName: selection?.collectionName,
        account: user?.walletAddress,
        amount: 1,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW",
      }).unwrap();

      if (result?.result?.status === "success") {
        // If blockchain operation succeeds, update backend
        await markClaimed({
          collectionName: selection?.collectionName,
          kAddress: user?.walletAddress,
        });

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Successfully claimed free mint!",
        });
        dispatch(setRefresh(true));
      } else {
        throw new Error(result?.result?.error || "Failed to claim free mint");
      }
    } catch (error) {
      console.error("Error claiming free mint:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to claim free mint",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state
  if (checkingStatus) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  // Show if already claimed
  if (hasClaimed) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          You have already claimed your free mint
        </Alert>
      </Paper>
    );
  }

  // Show if not active
  if (!isActive) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          Free mint is currently not active
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Claim Free Mint
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Free mint is active and available for claiming
      </Alert>

      {totalSupply !== undefined && (
        <Alert severity={totalSupply > 0 ? "info" : "error"} sx={{ mb: 2 }}>
          {totalSupply > 0 
            ? `Remaining supply: ${totalSupply}`
            : "No free mints remaining"}
        </Alert>
      )}

      {/* {allowUsersStatus?.data && !isAllowedUser && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your address is not on the allowed list for this free mint
        </Alert>
      )} */}

      <Button
        variant="contained"
        color="primary"
        onClick={handleClaim}
        disabled={
          isProcessing || 
          isLoading || 
          !isEnabled || 
          hasClaimed || 
          totalSupply <= 0 ||
          (isActive?.allowUsers && !isAllowedUser)
        }
        fullWidth
      >
        {isProcessing || isLoading ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <span>Processing...</span>
          </Box>
        ) : (
          "Claim Free Mint"
        )}
      </Button>

      {!isEnabled && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Free minting is currently disabled for this collection
        </Alert>
      )}
    </Paper>
  );
};

// const DebugPanel = ({ collectionName, userAccount }) => {
//   const { data: totalSupply, isLoading: loadingSupply } = useGetFreeMintTotalSupplyQuery(collectionName);
//   const { data: currentIndex, isLoading: loadingIndex } = useGetCurrentIndexQuery(collectionName);
//   const { data: claimStatus, isLoading: loadingClaim } = useGetClaimStatusQuery({
//     collectionName,
//     account: userAccount
//   });
//   const { data: freeMintStatus } = useIsFreeMintActiveQuery(collectionName);

//   if (loadingSupply || loadingIndex || loadingClaim) {
//     return (
//       <Box display="flex" justifyContent="center" p={3}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Paper sx={{ mt: 3, p: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Free Mint Status
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <Alert severity="info">
//             Total Supply: {totalSupply || 0}
//           </Alert>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Alert severity="info">
//             Current Index: {currentIndex || 0}
//           </Alert>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Alert severity={claimStatus ? "warning" : "success"}>
//             Claimed: {claimStatus ? "Yes" : "No"}
//           </Alert>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Alert severity={freeMintStatus?.isActive ? "success" : "warning"}>
//             Status: {freeMintStatus?.isActive ? "Active" : "Inactive"}
//           </Alert>
//         </Grid>

//         {freeMintStatus?.startTime && (
//           <Grid item xs={12}>
//             <Alert severity="info">
//               Time Window: {dayjs(freeMintStatus.startTime).format('YYYY-MM-DD HH:mm:ss')}
//               {" → "}
//               {dayjs(freeMintStatus.endTime).format('YYYY-MM-DD HH:mm:ss')}
//             </Alert>
//           </Grid>
//         )}
//       </Grid>
//     </Paper>
//   );
// };

export default FreeMintPage;