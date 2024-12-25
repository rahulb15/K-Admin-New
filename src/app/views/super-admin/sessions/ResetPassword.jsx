import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Grid, styled, TextField, Typography, Snackbar } from "@mui/material";
import axios from "axios";

// STYLED COMPONENTS
const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100vh !important",

  "& .card": {
    maxWidth: 800,
    margin: "1rem",
    borderRadius: 12
  },

  ".img-wrapper": {
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const ContentBox = styled("div")(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default
}));

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false
  });
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    // Verify token validity when component mounts
    const verifyToken = async () => {
      try {
        // REACT_APP_API_URL
        // const response = await axios.get(`http://localhost:5000/api/v1/user/verify-reset-token/${token}`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/verify-reset-token/${token}`);
        console.log(response.data);
        setIsTokenValid(response.data.status === "success");
      } catch (error) {
        setIsTokenValid(false);
        setSnackbar({
          open: true,
          message: "Invalid or expired reset link",
          isError: true
        });
      }
    };

    verifyToken();
  }, [token]);

  console.log(isTokenValid);

  const validateForm = () => {
    const newErrors = {
      password: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // const response = await axios.post("http://localhost:5000/api/v1/user/reset-password-user", {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/reset-password-user`, {
        token,
        password
      });

      if (response.data.status === "success") {
        setSnackbar({
          open: true,
          message: "Password reset successful! Redirecting to login...",
          isError: false
        });
        
        setTimeout(() => {
          navigate("/su");
        }, 2000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.description || "An error occurred. Please try again.",
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!isTokenValid) {
    return (
      <StyledRoot>
        <Card className="card">
          <ContentBox>
            <Typography variant="h5" align="center" color="error">
              Invalid or expired reset link
            </Typography>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={() => navigate("/forgot-password")}
              sx={{ mt: 2 }}
            >
              Request New Reset Link
            </Button>
          </ContentBox>
        </Card>
      </StyledRoot>
    );
  }

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <div className="img-wrapper">
              <img width="300" src="/assets/images/pact-img-dark.png" alt="Logo" />
            </div>

            <ContentBox>
              <Typography variant="h4" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body1" gutterBottom>
                Please enter your new password.
              </Typography>
              
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="password"
                  name="password"
                  size="small"
                  label="New Password"
                  value={password}
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 3, width: "100%" }}
                />

                <TextField
                  type="password"
                  name="confirmPassword"
                  size="small"
                  label="Confirm Password"
                  value={confirmPassword}
                  variant="outlined"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{ mt: 2 }}
                >
                  Back to Login
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          style: {
            backgroundColor: snackbar.isError ? '#f44336' : '#43a047',
          },
        }}
      />
    </StyledRoot>
  );
}