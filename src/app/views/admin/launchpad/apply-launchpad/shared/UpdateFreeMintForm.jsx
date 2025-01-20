// UpdateFreeMintForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import { useUpdateFreeMintMutation } from "services/launchpad.service";


const schema = yup.object().shape({
  freeMintSupply: yup
    .number()
    .required("Free mint supply is required")
    .positive("Supply must be positive")
    .integer("Supply must be an integer"),
  enableFreeMint: yup.boolean()
});

const UpdateFreeMintForm = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
  const [updateFreeMint, { isLoading }] = useUpdateFreeMintMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      freeMintSupply: selection?.freeMintSupply || 1,
      enableFreeMint: selection?.enableFreeMint || false
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await updateFreeMint({
        collectionName: selection?.collectionName,
        creator: user?.walletAddress,
        freeMintSupply: data.freeMintSupply,
        enableFreeMint: data.enableFreeMint,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : "CW"
      }).unwrap();

      if (result?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Free mint updated successfully",
        });
        dispatch(setRefresh(true));
        dispatch(setModalOpen(false));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update free mint",
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Update Free Mint
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
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

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="enableFreeMint"
                  control={control}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} />
                  )}
                />
              }
              label="Enable Free Mint"
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Free Mint"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UpdateFreeMintForm;