import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import { useUpdatePriceMutation } from "services/prioritypass.service";
import launchapadServices from "services/launchapadServices.tsx";

const schema = yup.object().shape({
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
});

const UpdatePriceForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price: "",
    },
  });
  const dispatch = useDispatch();
  const [updatePrice, { isLoading, error }] = useUpdatePriceMutation();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    console.log("dataaaaaaaaaaaaaa", data);
    try {
      const result = await updatePrice({
        price: parseFloat(data.price),
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      }).unwrap();

      if (result?.status === "success") {
        const launchapdResult = await launchapadServices.updatePrice(
          // data.collectionName,
          "Priority Pass",
          parseFloat(data.price),
          user?.walletAddress,
          user?.walletName
        );
        console.log("launchapdResult", launchapdResult);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Price updated successfully",
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
        text: `Error updating price: ${error.message}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="New Price"
            fullWidth
            margin="normal"
            error={!!errors.price}
            helperText={errors.price?.message}
            type="number"
            inputProps={{ step: "0.01" }}
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
        >
          {isLoading ? <CircularProgress size={24} /> : "Update Price"}
        </Button>
      </Box>
    </form>
  );
};

export default UpdatePriceForm;
