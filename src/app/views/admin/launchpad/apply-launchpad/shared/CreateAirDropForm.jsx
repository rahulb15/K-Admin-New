import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import { useCreateCustomAirdropMutation } from "services/launchpad.service";
import launchapadServices from "services/launchapadServices.tsx";

const schema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
  airdropAddresses: yup
    .string()
    .required("Airdrop addresses are required")
    .test("addresses", "Invalid addresses format", function (value) {
      if (!value) return false;
      // Split by commas and check if each address starts with 'k:'
      const addresses = value.split(",").map(addr => addr.trim());
      return addresses.every(addr => addr.startsWith("k:"));
    }),
});

const AirdropForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      airdropAddresses: "",
    },
  });

  const dispatch = useDispatch();
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  const [createAirdrop, { isLoading, error }] = useCreateCustomAirdropMutation();
  const { user } = useAuth();

  useEffect(() => {
    if (selection?.collectionName) {
      setValue("collectionName", selection.collectionName);
    }
  }, [selection, setValue]);

  const onSubmit = async (data) => {
    try {
      // Convert comma-separated addresses string to array
      const airdropAddresses = data.airdropAddresses
        .split(",")
        .map(addr => addr.trim())
        .filter(addr => addr);

      const result = await createAirdrop({
        collectionName: data.collectionName,
        creatorAddress: user?.walletAddress,
        airdropAddresses: airdropAddresses,
        wallet: user?.walletName === "Ecko Wallet" 
          ? "ecko" 
          : user?.walletName === "Chainweaver" 
          ? "CW" 
          : user?.walletName,
      }).unwrap();

      if (result?.status === "success") {
        // Call additional service if needed
        const launchapdResult = await launchapadServices.createAirdrop(
          data.collectionName,
          airdropAddresses,
          user?.walletAddress,
          user?.walletName
        );

        console.log("Airdrop result:", launchapdResult);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Airdrop created successfully",
        });
        dispatch(setRefresh(true));
        dispatch(setModalOpen(false));
      } else {
        throw new Error(result?.error?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error creating airdrop: ${error.message}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="collectionName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Collection Name"
            fullWidth
            margin="normal"
            error={!!errors.collectionName}
            helperText={errors.collectionName?.message}
            disabled={!!selection?.collectionName}
          />
        )}
      />
      <Controller
        name="airdropAddresses"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Airdrop Addresses"
            fullWidth
            margin="normal"
            error={!!errors.airdropAddresses}
            helperText={errors.airdropAddresses?.message || "Enter Kadena addresses separated by commas (k:...)"}
            multiline
            rows={4}
            placeholder="k:address1, k:address2, k:address3"
          />
        )}
      />
      {error && (
        <Typography color="error">
          {error?.data?.error?.message || "An error occurred"}
        </Typography>
      )}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} /> : "Create Airdrop"}
        </Button>
      </Box>
    </form>
  );
};

export default AirdropForm;