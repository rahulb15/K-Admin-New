import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextField, Typography, Box, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import { useAddPassUserMutation } from "services/prioritypass.service";
import useAuth from "app/hooks/useAuth";

const schema = yup.object().shape({
  users: yup
    .string()
    .required("Users are required")
    .test("valid-addresses", "Invalid address format", function (value) {
      if (!value) return true; // This is handled by the required check
      const addresses = value.split(',').map(addr => addr.trim());
      const validAddressRegex = /^k:[a-zA-Z0-9]{64}$/; // Adjust this regex as needed for your specific address format
      return addresses.every(addr => validAddressRegex.test(addr));
    })
    .test("unique-addresses", "Duplicate addresses are not allowed", function (value) {
      if (!value) return true;
      const addresses = value.split(',').map(addr => addr.trim());
      return new Set(addresses).size === addresses.length;
    }),
});

const AddUserForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      users: "",
    },
  });
  const dispatch = useDispatch();
  const [addPassUser, { isLoading, error }] = useAddPassUserMutation();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    const priorityUsers = data.users.split(',').map(user => user.trim());
    try {
      const result = await addPassUser({
        priorityUsers,
        admin: user?.walletAddress,
        wallet: user?.walletName === "Ecko Wallet"
          ? "ecko"
          : user?.walletName === "Chainweaver"
          ? "CW"
          : user?.walletName
      }).unwrap();

      console.log("result", result);

      if (result?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Successfully added ${priorityUsers.length} priority user(s)`,
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
        text: `Error adding priority users: ${error.message}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="users"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Priority Users"
            fullWidth
            margin="normal"
            error={!!errors.users}
            helperText={errors.users?.message || "Enter comma-separated user addresses (e.g., k:abc123..., k:def456...)"}
            multiline
            rows={4}
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
          {isLoading ? <CircularProgress size={24} /> : "Add Priority Users"}
        </Button>
      </Box>
    </form>
  );
};

export default AddUserForm;