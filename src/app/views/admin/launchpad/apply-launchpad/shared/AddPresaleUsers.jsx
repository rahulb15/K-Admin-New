import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAddPresaleAccountsMutation } from "services/launchpad.service";
import { useSelector } from "react-redux";
import useAuth from "app/hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";

const addressesSchema = yup.object().shape({
  addresses: yup
    .string()
    .required("Addresses are required")
    .test(
      "valid-addresses",
      "Invalid address format or duplicate addresses",
      function (value) {
        if (!value) return false;
        const addresses = value.split(",").map((addr) => addr.trim());
        const uniqueAddresses = new Set(addresses);
        return (
          addresses.every((addr) => /^k:[a-zA-Z0-9]+$/.test(addr)) &&
          addresses.length === uniqueAddresses.size
        );
      }
    ),
});

const AddPresaleUsers = ({ handleClose }) => {
  const { user } = useAuth();
  const { control, handleSubmit, setError, clearErrors } = useForm({
    resolver: yupResolver(addressesSchema),
  });
  const [addPresaleAccounts, { isLoading }] = useAddPresaleAccountsMutation();
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );

  console.log("selection", selection);

  const onSubmit = async (data) => {
    clearErrors();
    const accounts = data.addresses.split(",").map((address) => address.trim());
    try {
      const result = await addPresaleAccounts({
        collectionName: selection.collectionName,
        accounts,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      }).unwrap();

      if (result.error) {
        throw new Error(
          result.error.message ||
            "An error occurred while adding presale accounts"
        );
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Presale accounts added successfully",
      });
      handleClose();
    } catch (error) {
      console.error("Error adding presale accounts:", error);
      handleClose();

      if (error.data && error.data.message) {
        setError("addresses", { type: "manual", message: error.data.message });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message ||
            "Failed to add presale accounts. Please try again.",
        });
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add Presale Users
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="addresses"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Presale Addresses"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={!!error}
              helperText={
                error
                  ? error.message
                  : "Enter addresses separated by commas (e.g., k:address1,k:address2)"
              }
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Add Presale Users"}
        </Button>
      </form>
    </Box>
  );
};

export default AddPresaleUsers;
