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
import { useUpdatePriceMutation } from "services/launchpad.service";

const schema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
});

const UpdatePriceForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      price: "",
    },
  });
  const dispatch = useDispatch();
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  const [updatePrice, { isLoading, error }] = useUpdatePriceMutation();
  const { user } = useAuth();

  useEffect(() => {
    if (selection?.collectionName) {
      setValue("collectionName", selection.collectionName);
    }
  }, [selection, setValue]);

  const onSubmit = async (data) => {
    console.log("dataaaaaaaaaaaaaa", data);
    try {
      const result = await updatePrice({
        collectionName: data.collectionName,
        wattetAddress: user?.walletAddress,
        price: parseFloat(data.price),
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      }).unwrap();

      if (result?.success) {
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
