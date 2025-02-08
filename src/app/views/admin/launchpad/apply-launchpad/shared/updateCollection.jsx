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
import { useUpdateCollectionDetailsMutation } from "services/launchpad.service";
import launchapadServices from "services/launchapadServices.tsx";

const schema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  coverImageUrl: yup.string().url("Must be a valid URL").required("Cover image URL is required"),
  bannerImageUrl: yup.string().url("Must be a valid URL").required("Banner image URL is required"),
});

const UpdateCollectionForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      description: "",
      category: "",
      coverImageUrl: "",
      bannerImageUrl: "",
    },
  });

  const dispatch = useDispatch();
  const selection = useSelector((state) => state?.selectionLaunchpad?.selection);
  const [updateCollectionDetails, { isLoading, error }] = useUpdateCollectionDetailsMutation();
  const { user } = useAuth();

  useEffect(() => {
    if (selection) {
      setValue("collectionName", selection.collectionName);
      setValue("description", selection.description);
      setValue("category", selection.category);
      setValue("coverImageUrl", selection.coverImageUrl);
      setValue("bannerImageUrl", selection.bannerImageUrl);
    }
  }, [selection, setValue]);

  const onSubmit = async (data) => {
    try {
      const result = await updateCollectionDetails({
        creator: user?.walletAddress,
        collectionName: data.collectionName,
        description: data.description,
        category: data.category,
        coverImageUrl: data.coverImageUrl,
        bannerImageUrl: data.bannerImageUrl,
        wallet: user?.walletName === "Ecko Wallet" ? "ecko" : 
               user?.walletName === "Chainweaver" ? "CW" : user?.walletName
      }).unwrap();

      if (result?.status === "success") {
        // Call the service if needed
        const launchapdResult = await launchapadServices.updateCollectionDetails(
          data.collectionName,
          data.description,
          data.category,
          data.coverImageUrl,
          data.bannerImageUrl,
          user?.walletAddress,
          user?.walletName
        );

        console.log("launchapdResult", launchapdResult);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Collection details updated successfully",
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
        text: `Error updating collection details: ${error.message}`,
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
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Category"
            fullWidth
            margin="normal"
            error={!!errors.category}
            helperText={errors.category?.message}
          />
        )}
      />

      <Controller
        name="coverImageUrl"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Cover Image URL"
            fullWidth
            margin="normal"
            error={!!errors.coverImageUrl}
            helperText={errors.coverImageUrl?.message}
          />
        )}
      />

      <Controller
        name="bannerImageUrl"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Banner Image URL"
            fullWidth
            margin="normal"
            error={!!errors.bannerImageUrl}
            helperText={errors.bannerImageUrl?.message}
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
          {isLoading ? <CircularProgress size={24} /> : "Update Collection"}
        </Button>
      </Box>
    </form>
  );
};

export default UpdateCollectionForm;