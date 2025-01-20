// // ClaimFreeMintForm.jsx
// import React from "react";
// import {
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   Paper,
// } from "@mui/material";
// import useAuth from "app/hooks/useAuth";
// import { useSelector } from "react-redux";
// import { 
//   useExecuteFreeMintMutation,
//   useGetFreeMintEnabledQuery,
//   useGetFreeMintClaimQuery
// } from "services/launchpad.service";
// import Swal from "sweetalert2";

// const ClaimFreeMintForm = () => {
//   const { user } = useAuth();
//   const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
//   const [executeFreeMint, { isLoading }] = useExecuteFreeMintMutation();

//   const { data: isEnabled } = useGetFreeMintEnabledQuery(selection?.collectionName);
//   const { data: hasClaimed } = useGetFreeMintClaimQuery({
//     collectionName: selection?.collectionName,
//     account: user?.walletAddress
//   });

//   const handleClaim = async () => {
//     try {
//       const result = await executeFreeMint({
//         collectionName: selection?.collectionName,
//         account: user?.walletAddress,
//         amount: 1,
//         wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
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

//   if (!isEnabled) {
//     return (
//       <Paper sx={{ p: 3 }}>
//         <Typography color="error">
//           Free mint is not enabled for this collection
//         </Typography>
//       </Paper>
//     );
//   }

//   if (hasClaimed) {
//     return (
//       <Paper sx={{ p: 3 }}>
//         <Typography color="primary">
//           You have already claimed your free mint
//         </Typography>
//       </Paper>
//     );
//   }

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Claim Free Mint
//       </Typography>

//       <Box mt={3}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleClaim}
//           disabled={isLoading}
//           fullWidth
//         >
//           {isLoading ? <CircularProgress size={24} /> : "Claim Free Mint"}
//         </Button>
//       </Box>
//     </Paper>
//   );
// };


// export default ClaimFreeMintForm;


import React from "react";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Alert,
} from '@/components/ui/alert';
import useAuth from "app/hooks/useAuth";
import { useSelector } from "react-redux";
import { 
  useExecuteFreeMintMutation,
  useGetFreeMintEnabledQuery,
  useGetFreeMintClaimQuery,
  useIsFreeMintActiveQuery
} from "services/launchpad.service";
import Swal from "sweetalert2";
import { format } from 'date-fns';

const ClaimFreeMintForm = () => {
  const { user } = useAuth();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
  const [executeFreeMint, { isLoading }] = useExecuteFreeMintMutation();

  const { data: isEnabled } = useGetFreeMintEnabledQuery(selection?.collectionName);
  const { data: hasClaimed } = useGetFreeMintClaimQuery({
    collectionName: selection?.collectionName,
    account: user?.walletAddress
  });
  const { data: freeMintStatus, isLoading: loadingStatus } = useIsFreeMintActiveQuery(selection?.collectionName);

  const handleClaim = async () => {
    try {
      if (!freeMintStatus?.isActive) {
        throw new Error("Free mint is not currently active");
      }
      
      const now = new Date();
      const startTime = new Date(freeMintStatus.startTime);
      const endTime = new Date(freeMintStatus.endTime);
      
      if (now < startTime) {
        throw new Error(`Free mint starts at ${format(startTime, 'PPPp')}`);
      }
      
      if (now > endTime) {
        throw new Error("Free mint has ended");
      }

      const result = await executeFreeMint({
        collectionName: selection?.collectionName,
        account: user?.walletAddress,
        amount: 1,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
      }).unwrap();

      if (result?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Successfully claimed free mint!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to claim free mint",
      });
    }
  };

  if (loadingStatus) {
    return <CircularProgress />;
  }

  if (!isEnabled) {
    return (
      <Paper className="p-4">
        <Alert severity="error">
          Free mint is not enabled for this collection
        </Alert>
      </Paper>
    );
  }

  if (!freeMintStatus?.isActive) {
    return (
      <Paper className="p-4">
        <Alert severity="warning">
          Free mint has been cancelled by the collection creator
        </Alert>
      </Paper>
    );
  }

  if (hasClaimed) {
    return (
      <Paper className="p-4">
        <Alert severity="info">
          You have already claimed your free mint
        </Alert>
      </Paper>
    );
  }

  const now = new Date();
  const startTime = new Date(freeMintStatus.startTime);
  const endTime = new Date(freeMintStatus.endTime);

  if (now < startTime) {
    return (
      <Paper className="p-4">
        <Alert severity="info">
          Free mint starts at {format(startTime, 'PPPp')}
        </Alert>
        <Typography className="mt-2 text-sm text-gray-600">
          Come back when the free mint period begins!
        </Typography>
      </Paper>
    );
  }

  if (now > endTime) {
    return (
      <Paper className="p-4">
        <Alert severity="warning">
          Free mint ended on {format(endTime, 'PPPp')}
        </Alert>
        <Typography className="mt-2 text-sm text-gray-600">
          The free mint period has ended. You can still mint through the regular minting process.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="p-4">
      <Box className="space-y-4">
        <Typography variant="h6">
          Claim Free Mint
        </Typography>

        <Alert severity="info" className="mb-4">
          Free mint ends on {format(endTime, 'PPPp')}
        </Alert>

        <Button
          variant="contained"
          color="primary"
          onClick={handleClaim}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <CircularProgress size={24} /> : "Claim Free Mint"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ClaimFreeMintForm;