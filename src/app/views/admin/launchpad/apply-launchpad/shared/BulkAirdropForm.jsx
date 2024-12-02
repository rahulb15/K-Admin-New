import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import { useBulkAirdropMutation } from "services/launchpad.service";
import launchapadServices from "services/launchapadServices.tsx";

const schema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
  airdropItems: yup.array().of(
    yup.object().shape({
      account: yup
        .string()
        .required("Account is required")
        .matches(/^k:/, "Account must start with k:"),
      tokenId: yup
        .string()
        .required("Token ID is required")
        .matches(/^t:/, "Token ID must start with t:"),
    })
  ),
});

const BulkAirdropForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      airdropItems: [{ account: "", tokenId: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "airdropItems",
  });

  const dispatch = useDispatch();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
  const [bulkAirdrop, { isLoading, error }] = useBulkAirdropMutation();
  const { user } = useAuth();

  useEffect(() => {
    if (selection?.collectionName) {
      setValue("collectionName", selection.collectionName);
    }
  }, [selection, setValue]);

  const onSubmit = async (data) => {
    try {
      const result = await bulkAirdrop({
        collectionName: data.collectionName,
        airdropData: data.airdropItems,
        creatorAddress: user?.walletAddress,
        wallet: user?.walletName === "Ecko Wallet" 
          ? "ecko" 
          : user?.walletName === "Chainweaver" 
          ? "CW" 
          : user?.walletName,
      }).unwrap();

      if (result?.status === "success") {
        // Call additional service if needed
        const launchapdResult = await launchapadServices.bulkAirdrop(
          data.collectionName,
          data.airdropItems,
          user?.walletAddress,
          user?.walletName
        );

        console.log("Bulk airdrop result:", launchapdResult);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Bulk airdrop created successfully",
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
        text: `Error creating bulk airdrop: ${error.message}`,
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
      
      <Box mt={2}>
        <Typography variant="subtitle1" gutterBottom>
          Airdrop Items
        </Typography>
        {fields.map((field, index) => (
          <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5}>
                <Controller
                  name={`airdropItems.${index}.account`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Account"
                      fullWidth
                      error={!!errors.airdropItems?.[index]?.account}
                      helperText={errors.airdropItems?.[index]?.account?.message}
                      placeholder="k:address"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <Controller
                  name={`airdropItems.${index}.tokenId`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Token ID"
                      fullWidth
                      error={!!errors.airdropItems?.[index]?.tokenId}
                      helperText={errors.airdropItems?.[index]?.tokenId?.message}
                      placeholder="t:token-id"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
        
        <Button
          startIcon={<AddIcon />}
          onClick={() => append({ account: "", tokenId: "" })}
          variant="outlined"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        >
          Add Airdrop Item
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
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
          {isLoading ? <CircularProgress size={24} /> : "Create Bulk Airdrop"}
        </Button>
      </Box>
    </form>
  );
};

export default BulkAirdropForm;