import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useAddRoleMutation } from "services/launchpad.service";
import useAuth from "app/hooks/useAuth";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";

const roles = ["discount", "prime"];

const RoleAssignmentForm = () => {
  const [addRole, { isLoading, isError, error }] = useAddRoleMutation();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedRole || !address) {
      alert("Please select a role and enter an address");
      return;
    }

    try {
      const result = await addRole({
        role: selectedRole,
        address,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      }).unwrap();
      console.log(result);
      if (result.result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Role Assigned Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setSelectedRole("");
        setAddress("");
        dispatch(setRefresh(true));
        dispatch(setModalOpen(false));
      } else {
        Swal.fire({
          icon: "error",
          title: "Role Assignment Failed",
          text: result.data.result.message,
          showConfirmButton: false,
          timer: 1500,
        });
        dispatch(setRefresh(false));
        dispatch(setModalOpen(false));
      }
    } catch (error) {
      dispatch(setRefresh(false));
      dispatch(setModalOpen(false));
      Swal.fire({
        icon: "error",
        title: "Role Assignment Failed",
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Assign Role to User
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRole}
              label="Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="User Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter k:address"
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Assign Role
        </Button>
      </form>
    </Paper>
  );
};

export { RoleAssignmentForm };
