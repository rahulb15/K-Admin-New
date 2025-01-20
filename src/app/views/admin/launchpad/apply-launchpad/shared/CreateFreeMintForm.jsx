// // CreateFreeMintForm.jsx
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
// } from "@mui/material";
// import useAuth from "app/hooks/useAuth";
// import { useSelector, useDispatch } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Swal from "sweetalert2";
// import { setRefresh } from "features/refreshSlice";
// import { setModalOpen } from "features/launchpadModalActionSlice";
// import { useCreateFreeMintMutation } from "services/launchpad.service";

// const schema = yup.object().shape({
//   collectionName: yup.string().required("Collection name is required"),
//   freeMintSupply: yup
//     .number()
//     .required("Free mint supply is required")
//     .positive("Supply must be positive")
//     .integer("Supply must be an integer"),
//   enableFreeMint: yup.boolean()
// });

// const CreateFreeMintForm = () => {
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
//   const [createFreeMint, { isLoading }] = useCreateFreeMintMutation();

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
//       enableFreeMint: true
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       const result = await createFreeMint({
//         collectionName: data.collectionName,
//         creator: user?.walletAddress,
//         freeMintSupply: data.freeMintSupply,
//         creatorGuard: true,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
//       }).unwrap();

//       if (result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Free mint created successfully",
//         });
//         dispatch(setRefresh(true));
//         dispatch(setModalOpen(false));
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

// export default CreateFreeMintForm;




// import React, { useState, useEffect } from 'react';
// import { Button, TextField, Typography, Box, CircularProgress, Alert } from '@/components/ui/alert';
// import { useDispatch } from 'react-redux';
// import useAuth from 'app/hooks/useAuth';
// import { setRefresh } from 'features/refreshSlice';
// import { setModalOpen } from 'features/launchpadModalActionSlice';
// import { 
//   useCreateFreeMintMutation,
//   useGetCollectionDataQuery
// } from 'services/launchpad.service';
// import Swal from 'sweetalert2';

// const CreateFreeMintForm = ({ collectionName }) => {
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const [createFreeMint, { isLoading: isCreating }] = useCreateFreeMintMutation();
//   const { data: collectionData, isLoading: isLoadingCollection } = useGetCollectionDataQuery(collectionName);
  
//   const [formData, setFormData] = useState({
//     freeMintSupply: '',
//   });

//   const validateSupply = (supply) => {
//     if (!collectionData) return false;
//     const numSupply = parseInt(supply);
//     return numSupply > 0 && numSupply <= collectionData.totalSupply;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Step 1: Initial validation
//       if (!validateSupply(formData.freeMintSupply)) {
//         throw new Error('Invalid supply amount');
//       }

//       // Step 2: Create free mint
//       const result = await createFreeMint({
//         collectionName,
//         creator: user?.walletAddress,
//         freeMintSupply: parseInt(formData.freeMintSupply),
//         creatorGuard: true,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
//       }).unwrap();

//       if (result?.result?.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Free mint created successfully",
//         });
//         dispatch(setRefresh(true));
//         dispatch(setModalOpen(false));
//       } else {
//         throw new Error(result?.result?.error || 'Failed to create free mint');
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to create free mint",
//       });
//     }
//   };

//   if (isLoadingCollection) {
//     return <CircularProgress />;
//   }

//   return (
//     <Box className="space-y-4 p-6 bg-white rounded-lg shadow">
//       <Typography variant="h6" className="mb-4">
//         Create Free Mint for {collectionName}
//       </Typography>

//       {collectionData && (
//         <Alert severity="info" className="mb-4">
//           Total Collection Supply: {collectionData.totalSupply}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <TextField
//           label="Free Mint Supply"
//           type="number"
//           value={formData.freeMintSupply}
//           onChange={(e) => setFormData({ freeMintSupply: e.target.value })}
//           error={!validateSupply(formData.freeMintSupply)}
//           helperText={!validateSupply(formData.freeMintSupply) && 
//             "Supply must be greater than 0 and less than total collection supply"}
//           fullWidth
//           required
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           disabled={isCreating || !validateSupply(formData.freeMintSupply)}
//           className="w-full"
//         >
//           {isCreating ? <CircularProgress size={24} /> : "Create Free Mint"}
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default CreateFreeMintForm;




import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, CircularProgress, Alert, Stack, Dialog } from '@/components/ui/alert';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import useAuth from 'app/hooks/useAuth';
import { setRefresh } from 'features/refreshSlice';
import { setModalOpen } from 'features/launchpadModalActionSlice';
import { 
  useCreateFreeMintMutation,
  useGetCollectionDataQuery,
  useCancelFreeMintMutation,
  useIsFreeMintActiveMutation
} from 'services/launchpad.service';
import Swal from 'sweetalert2';

const CreateFreeMintForm = ({ collectionName }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [createFreeMint, { isLoading: isCreating }] = useCreateFreeMintMutation();
  const [cancelFreeMint, { isLoading: isCancelling }] = useCancelFreeMintMutation();
  const { data: collectionData, isLoading: isLoadingCollection } = useGetCollectionDataQuery(collectionName);
  const [confirmDialog, setConfirmDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    freeMintSupply: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week from now
  });

  const validateForm = () => {
    const numSupply = parseInt(formData.freeMintSupply);
    return (
      numSupply > 0 && 
      numSupply <= collectionData?.totalSupply &&
      formData.startTime < formData.endTime
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!validateForm()) {
        throw new Error('Invalid form data');
      }

      const result = await createFreeMint({
        collectionName,
        creator: user?.walletAddress,
        freeMintSupply: parseInt(formData.freeMintSupply),
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        creatorGuard: true,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
      }).unwrap();

      if (result?.result?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Free mint created successfully",
        });
        dispatch(setRefresh(true));
        dispatch(setModalOpen(false));
      } else {
        throw new Error(result?.result?.error || 'Failed to create free mint');
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create free mint",
      });
    }
  };

  const handleCancel = async () => {
    try {
      const result = await cancelFreeMint({
        collectionName,
        creatorGuard: true,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
      }).unwrap();

      if (result?.result?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Free mint cancelled successfully",
        });
        dispatch(setRefresh(true));
        setConfirmDialog(false);
      } else {
        throw new Error(result?.result?.error || 'Failed to cancel free mint');
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to cancel free mint",
      });
    }
  };

  if (isLoadingCollection) {
    return <CircularProgress />;
  }

  return (
    <Box className="space-y-4 p-6 bg-white rounded-lg shadow">
      <Typography variant="h6" className="mb-4">
        Create Free Mint for {collectionName}
      </Typography>

      {collectionData && (
        <Alert severity="info" className="mb-4">
          Total Collection Supply: {collectionData.totalSupply}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Stack spacing={3}>
          <TextField
            label="Free Mint Supply"
            type="number"
            value={formData.freeMintSupply}
            onChange={(e) => setFormData(prev => ({ ...prev, freeMintSupply: e.target.value }))}
            error={!validateForm()}
            helperText="Supply must be greater than 0 and less than total collection supply"
            fullWidth
            required
          />

          <DateTimePicker
            label="Start Time"
            value={formData.startTime}
            onChange={(newValue) => setFormData(prev => ({ ...prev, startTime: newValue }))}
            minDateTime={new Date()}
            className="w-full"
          />

          <DateTimePicker
            label="End Time"
            value={formData.endTime}
            onChange={(newValue) => setFormData(prev => ({ ...prev, endTime: newValue }))}
            minDateTime={formData.startTime}
            className="w-full"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || !validateForm()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? <CircularProgress size={24} /> : "Create Free Mint"}
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmDialog(true)}
            disabled={isCancelling}
            className="w-full"
          >
            {isCancelling ? <CircularProgress size={24} /> : "Cancel Free Mint"}
          </Button>
        </Stack>
      </form>

      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <Box className="p-6">
          <Typography variant="h6" className="mb-4">
            Confirm Cancel Free Mint
          </Typography>
          <Typography className="mb-4">
            Are you sure you want to cancel the free mint? This action cannot be undone.
          </Typography>
          <Stack direction="row" spacing={2} className="justify-end">
            <Button onClick={() => setConfirmDialog(false)}>
              No, Keep Free Mint
            </Button>
            <Button 
              onClick={handleCancel}
              variant="contained" 
              color="error"
            >
              Yes, Cancel Free Mint
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CreateFreeMintForm;