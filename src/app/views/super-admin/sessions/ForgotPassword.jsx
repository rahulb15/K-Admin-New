// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Card, Grid, styled, TextField } from "@mui/material";

// // STYLED COMPONENTS
// const StyledRoot = styled("div")(() => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: "#1A2038",
//   minHeight: "100vh !important",

//   "& .card": {
//     maxWidth: 800,
//     margin: "1rem",
//     borderRadius: 12
//   },

//   ".img-wrapper": {
//     display: "flex",
//     padding: "2rem",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// }));

// const ContentBox = styled("div")(({ theme }) => ({
//   padding: 32,
//   background: theme.palette.background.default
// }));

// export default function ForgotPassword() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("admin@example.com");

//   const handleFormSubmit = () => {
//     console.log(email);
//   };

//   return (
//     <StyledRoot>
//       <Card className="card">
//         <Grid container>
//           <Grid item xs={12}>
//             <div className="img-wrapper">
//               <img width="300" src="/assets/images/pact-img-dark.png" alt="" />
//             </div>

//             <ContentBox>
//               <form onSubmit={handleFormSubmit}>
//                 <TextField
//                   type="email"
//                   name="email"
//                   size="small"
//                   label="Email"
//                   value={email}
//                   variant="outlined"
//                   onChange={(e) => setEmail(e.target.value)}
//                   sx={{ mb: 3, width: "100%" }}
//                 />

//                 <Button fullWidth variant="contained" color="primary" type="submit">
//                   Reset Password
//                 </Button>

//                 <Button
//                   fullWidth
//                   color="primary"
//                   variant="outlined"
//                   onClick={() => navigate(-1)}
//                   sx={{ mt: 2 }}>
//                   Go Back
//                 </Button>
//               </form>
//             </ContentBox>
//           </Grid>
//         </Grid>
//       </Card>
//     </StyledRoot>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", isError: false });

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    setIsLoading(true);

    try {
      // const response = await axios.post("http://localhost:5000/api/v1/user/request-password-reset", { email });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/request-password-reset`, { email });
      setSnackbar({ open: true, message: "Password reset email sent. Please check your inbox.", isError: false });
      setEmail("");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setSnackbar({ open: true, message: "An error occurred. Please try again later.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
                Forgot Password
              </Typography>
              <Typography variant="body1" gutterBottom>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}
                >
                  Go Back
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

