// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Card,
//   Table,
//   Select,
//   Avatar,
//   styled,
//   TableRow,
//   useTheme,
//   MenuItem,
//   TableBody,
//   TableCell,
//   TableHead,
//   IconButton,
//   Grid,
//   Modal,
//   TextField,
//   Checkbox,
//   Button,
//   Stepper,
//   Step,
//   StepLabel,
//   Typography,
// } from "@mui/material";
// import { LoadingButton } from "@mui/lab";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import userServices from "services/userServices.tsx";

// import useAuth from "app/hooks/useAuth";
// import { Paragraph } from "app/components/Typography";

// // STYLED COMPONENTS
// const FlexBox = styled(Box)(() => ({
//   display: "flex",
// }));

// const ContentBox = styled("div")(() => ({
//   height: "100%",
//   padding: "32px",
//   position: "relative",
//   background: "rgba(0, 0, 0, 0.01)",
// }));

// const StyledRoot = styled("div")(() => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: "#1A2038",
//   minHeight: "100% !important",
//   "& .card": {
//     maxWidth: 800,
//     minHeight: 400,
//     margin: "1rem",
//     display: "flex",
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   ".img-wrapper": {
//     height: "100%",
//     minWidth: 320,
//     display: "flex",
//     padding: "2rem",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// }));

// // initial login credentials
// const initialValues = {
//   email: "superadmin@yopmail.com",
//   password: "superadmin",
//   remember: true,
// };

// // form field validation schema
// const validationSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(6, "Password must be 6 character length")
//     .required("Password is required!"),
//   email: Yup.string()
//     .email("Invalid Email address")
//     .required("Email is required!"),
// });

// export default function JwtLogin() {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [passowrdError, setPasswordError] = useState(false);
//   const [emailError, setEmailError] = useState(false);
//   const { superlogin, user, chainweaverConnect } = useAuth();
//   const [open2FAModal, setOpen2FAModal] = useState(false);
//   const [qrImage, setQrImage] = useState("");
//   const [twoFactorCode, setTwoFactorCode] = useState("");
//   const [secret, setSecret] = useState("");
//   const [token, setToken] = useState("");
//   const [isChainWeaverModalOpen, setIsChainWeaverModalOpen] = useState(false);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleFormSubmit = async (values) => {
//     // setLoading(true);
//     // try {
//     setEmailError(false);
//     setPasswordError(false);
//     setError(null);
//     setEmail(values.email);
//     setPassword(values.password);
//     setIsChainWeaverModalOpen(true);
//     console.log("values", values);

//     // const response = await superlogin(values.email, values.password);
//     // console.log(response, "login response");
//     // if (response.status === "success") {
//     //   console.log("login response", response.data.is2FAModalOpen);
//     //   if (response.data.is2FAModalOpen === true) {
//     //     setQrImage(response.data.qrCodeUrl);
//     //     setSecret(response.data.secret);
//     //     setOpen2FAModal(true);
//     //     setToken(response.token);
//     //   } else {
//     //     navigate("/dashboard");
//     //   }

//     //   // navigate("/dashboard");
//     // } else {
//     //   setLoading(false);
//     //   if (response.message === "Password not match") {
//     //     setError(response.message);
//     //     setPasswordError(true);
//     //     setEmailError(false);
//     //     return;
//     //   }
//     //   if (response.message === "User not found") {
//     //     setError(response.message);
//     //     setEmailError(true);
//     //     setPasswordError(false);
//     //     return;
//     //   }

//     //   setError(response.message);
//     //   setEmailError(false);
//     //   setPasswordError(false);
//     // }
//     // } catch (e) {
//     //   setLoading(false);
//     // }
//   };

//   const handleSubmitChainWeaverConnect = async () => {
//     try {
//       setLoading(true);
//       setEmailError(false);
//       setPasswordError(false);
//       setError(null);
//       const response = await chainweaverConnect(walletAddress);
//       console.log(response);
//       if (response && response.status === 'success') {  // Changed this line
//         setLoading(false);
//         setIsChainWeaverModalOpen(false);
//         console.log("login response", response);
//         const loginResponse = await superlogin(email, password, response);  // Changed 'values.email' to 'email'
//         console.log(loginResponse, "login response");
//         if (loginResponse.status === "success") {
//           console.log("login response", loginResponse.data.is2FAModalOpen);
//           if (loginResponse.data.is2FAModalOpen === true) {
//             setQrImage(loginResponse.data.qrCodeUrl);
//             setSecret(loginResponse.data.secret);
//             setOpen2FAModal(true);
//             setToken(loginResponse.token);
//           } else {
//             navigate("/dashboard");
//           }
//         } else {
//           handleLoginError(loginResponse);
//         }
//       } else {
//         console.log(response);
//         setLoading(false);
//         setError(response.error?.message || "An error occurred");
//         setEmailError(false);
//         setPasswordError(false);
//       }
//     } catch (e) {
//       console.error(e);
//       setLoading(false);
//       setError("An unexpected error occurred");
//     }
//   };
  
//   const handleLoginError = (response) => {
//     setLoading(false);
//     if (response.message === "Password not match") {
//       setError(response.message);
//       setPasswordError(true);
//       setEmailError(false);
//     } else if (response.message === "User not found") {
//       setError(response.message);
//       setEmailError(true);
//       setPasswordError(false);
//     } else {
//       setError(response.message);
//       setEmailError(false);
//       setPasswordError(false);
//     }
//   };



//   const handleChainWeaverConnect = async () => {
//     setIsChainWeaverModalOpen(true);
//   };

//   const handleChangeResetEmail = (e) => {
//     setEmailError(false);
//     setError(null);
//   };

//   const handleChangeResetPassword = (e) => {
//     setPasswordError(false);
//     setError(null);
//   };

//   const verify2FA = async () => {
//     if (twoFactorCode.trim() === "") {
//       setError("Please enter 2FA code");
//     }

//     const data = {
//       token: twoFactorCode.trim(),
//       secret,
//       jwtToken: token,
//     };

//     const response = await userServices.verify2FA(data);
//     console.log(response);

//     if (response?.data?.status === "success") {
//       localStorage.setItem("token", token);
//       setOpen2FAModal(false);
//       setTwoFactorCode("");
//       setQrImage("");
//       setSecret("");
//       navigate("/dashboard");
//     } else {
//       console.log(response);
//       setError("Invalid 2FA code");
//     }
//   };

//   return (
//     <StyledRoot>
//       <Card className="card">
//         <Grid container>
//           <Grid item sm={6} xs={12}>
//             <div className="img-wrapper">
//               <img
//                 src="/assets/images/pact-img-dark.png"
//                 width="100%"
//                 height="100%"
//                 alt="login"
//               />
//             </div>
//           </Grid>

//           {open2FAModal === false ? (
//             <Grid item sm={6} xs={12}>
//               <ContentBox>
//                 <Formik
//                   onSubmit={handleFormSubmit}
//                   initialValues={initialValues}
//                   validationSchema={validationSchema}
//                 >
//                   {({
//                     values,
//                     errors,
//                     touched,
//                     handleChange,
//                     handleBlur,
//                     handleSubmit,
//                   }) => (
//                     <form onSubmit={handleSubmit}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         type="email"
//                         name="email"
//                         label="Email"
//                         variant="outlined"
//                         onBlur={handleBlur}
//                         value={values.email}
//                         onChange={(e) => {
//                           handleChange(e);
//                           handleChangeResetEmail(e);
//                         }}
//                         helperText={touched.email && errors.email}
//                         error={Boolean(
//                           (errors.email && touched.email) || emailError
//                         )}
//                         sx={{ mb: 3 }}
//                       />

//                       <TextField
//                         fullWidth
//                         size="small"
//                         name="password"
//                         type="password"
//                         label="Password"
//                         variant="outlined"
//                         onBlur={handleBlur}
//                         value={values.password}
//                         onChange={(e) => {
//                           handleChange(e);
//                           handleChangeResetPassword(e);
//                         }}
//                         helperText={touched.password && errors.password}
//                         error={Boolean(
//                           (errors.password && touched.password) || passowrdError
//                         )}
//                         sx={{ mb: 1.5 }}
//                       />

//                       {error && (
//                         <Paragraph
//                           color="error"
//                           sx={{
//                             mb: 2,
//                             textAlign: "center",
//                             color: theme.palette.error.main,
//                           }}
//                         >
//                           {error}
//                         </Paragraph>
//                       )}

//                       <FlexBox justifyContent="space-between">
//                         <FlexBox gap={1}>
//                           <Checkbox
//                             size="small"
//                             name="remember"
//                             onChange={handleChange}
//                             checked={values.remember}
//                             sx={{ padding: 0 }}
//                           />

//                           <Paragraph>Remember Me</Paragraph>
//                         </FlexBox>

//                         <NavLink
//                           to="/session/forgot-password"
//                           style={{ color: theme.palette.primary.main }}
//                         >
//                           Forgot password?
//                         </NavLink>
//                       </FlexBox>

//                       <LoadingButton
//                         type="submit"
//                         color="primary"
//                         loading={loading}
//                         variant="contained"
//                         sx={{ my: 2 }}
//                       >
//                         Login
//                       </LoadingButton>
//                     </form>
//                   )}
//                 </Formik>
//               </ContentBox>
//             </Grid>
//           ) : (
//             <>
//               <Modal
//                 open={open2FAModal}
//                 onClose={() => setOpen2FAModal(false)}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//               >
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     width: 400,
//                     bgcolor: "background.paper",
//                     boxShadow: 24,
//                     p: 4,
//                   }}
//                 >
//                   <Typography
//                     id="modal-modal-title"
//                     variant="h6"
//                     component="h2"
//                   >
//                     Enable 2FA
//                   </Typography>

//                   <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                     {qrImage.length > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                         }}
//                       >
//                         <label htmlFor="address">Scan QR Code</label>
//                         <img src={qrImage} alt="qr code" />
//                       </div>
//                     )}

//                     <TextField
//                       fullWidth
//                       size="small"
//                       type="text"
//                       name="twoFactorCode"
//                       label="Key"
//                       variant="outlined"
//                       value={twoFactorCode}
//                       onChange={(e) => setTwoFactorCode(e.target.value)}
//                       sx={{ mt: 2 }}
//                     />

//                     {error && (
//                       <Paragraph
//                         color="error"
//                         sx={{
//                           mb: 2,
//                           textAlign: "center",
//                           color: theme.palette.error.main,
//                         }}
//                       >
//                         {error}
//                       </Paragraph>
//                     )}

//                     <FlexBox justifyContent="space-between" sx={{ mt: 2 }}>
//                       <Button
//                         variant="contained"
//                         // onClick={() => setOpen2FAModal(false)}
//                         onClick={() => {
//                           setOpen2FAModal(false);
//                           setTwoFactorCode("");
//                           setQrImage("");
//                           setSecret("");
//                           setError("Please verify 2FA to login");
//                           setLoading(false);
//                         }}
//                       >
//                         Close
//                       </Button>

//                       <Button variant="contained" onClick={() => verify2FA()}>
//                         Verify
//                       </Button>
//                     </FlexBox>
//                   </Typography>
//                 </Box>
//               </Modal>
//             </>
//           )}
//           <Modal
//             open={isChainWeaverModalOpen}
//             onClose={() => setIsChainWeaverModalOpen(false)}
//             aria-labelledby="chainweaver-modal-title"
//             aria-describedby="chainweaver-modal-description"
//           >
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 width: 400,
//                 bgcolor: "background.paper",
//                 boxShadow: 24,
//                 p: 4,
//               }}
//             >
//               <Typography
//                 id="chainweaver-modal-title"
//                 variant="h6"
//                 component="h2"
//               >
//                 Chainweaver Connect
//               </Typography>
//               <Typography id="chainweaver-modal-description" sx={{ mt: 2 }}>
//                 <TextField
//                   fullWidth
//                   label="Wallet Address"
//                   variant="outlined"
//                   value={walletAddress}
//                   onChange={(e) => setWalletAddress(e.target.value)}
//                   sx={{ mb: 2 }}
//                 />

//                 <Typography>
//                   Please enter your Chainweaver wallet address to connect
//                 </Typography>


//                 {error && (
//                   <Paragraph
//                     color="error"
//                     sx={{
//                       mb: 2,
//                       textAlign: "center",
//                       color: theme.palette.error.main,
//                     }}
//                   >
//                     {error}
//                   </Paragraph>
//                 )}





//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mt: 2,
//                   }}
//                 >
//                   <Button
//                     variant="contained"
//                     onClick={() => setIsChainWeaverModalOpen(false)}
//                   >
//                     Close
//                   </Button>
//                   {/* <Button
//                     variant="contained"
//                     onClick={() => {
//                       handleSubmitChainWeaverConnect();
//                     }}
//                   >
//                     Confirm
//                   </Button> */}

//                   { loading ? (
//                     <LoadingButton
//                       loading={loading}
//                       variant="contained"
//                       color="primary"
//                       // onClick={() => handleSubmitChainWeaverConnect()}
//                     >
//                       Connect
//                     </LoadingButton>
//                   ) : (
//                     <Button
//                       variant="contained"
//                       onClick={() => handleSubmitChainWeaverConnect()}
//                     >
//                       Connect
//                     </Button>
//                   )}



//                 </Box>
//               </Typography>
//             </Box>
//           </Modal>
//         </Grid>
//       </Card>
//     </StyledRoot>
//   );
// }



import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Modal,
  TextField,
  Checkbox,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled, useTheme } from "@mui/material/styles";
import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";
import userServices from "services/userServices.tsx";
// import TwoFactorVerification from "./TwoFactorVerification";
import TwoFactorVerification from "app/views/admin/sessions/TwoFactorVerification";

// Styled components (unchanged)
const FlexBox = styled(Box)(() => ({
  display: "flex",
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center",
  },
}));

// Initial values and validation schema
const initialValues = {
  email: "superadmin@yopmail.com",
  password: "superadmin",
  remember: true,
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string()
    .email("Invalid Email address")
    .required("Email is required!"),
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { superlogin, chainweaverConnect } = useAuth();
  const [open2FAModal, setOpen2FAModal] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [isChainWeaverModalOpen, setIsChainWeaverModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFAError, setTwoFAError] = useState("");

  const handleFormSubmit = async (values) => {
    setEmailError(false);
    setPasswordError(false);
    setError(null);
    setEmail(values.email);
    setPassword(values.password);
    setIsChainWeaverModalOpen(true);
  };

  const handleSubmitChainWeaverConnect = async () => {
    try {
      setLoading(true);
      setEmailError(false);
      setPasswordError(false);
      setError(null);
      const response = await chainweaverConnect(walletAddress);
      if (response && response.status === 'success') {
        setLoading(false);
        setIsChainWeaverModalOpen(false);
        const loginResponse = await superlogin(email, password, response);
        if (loginResponse.status === "success") {
          if (loginResponse.data.is2FAModalOpen === true) {
            setQrImage(loginResponse.data.qrCodeUrl);
            setSecret(loginResponse.data.secret);
            setOpen2FAModal(true);
            setToken(loginResponse.token);
          } else {
            navigate("/dashboard");
          }
        } else {
          handleLoginError(loginResponse);
        }
      } else {
        setLoading(false);
        setError(response.error?.message || "An error occurred");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("An unexpected error occurred");
    }
  };
  
  const handleLoginError = (response) => {
    setLoading(false);
    if (response.message === "Password not match") {
      setError(response.message);
      setPasswordError(true);
      setEmailError(false);
    } else if (response.message === "User not found") {
      setError(response.message);
      setEmailError(true);
      setPasswordError(false);
    } else {
      setError(response.message);
      setEmailError(false);
      setPasswordError(false);
    }
  };

  const handleChangeReset = (field) => {
    if (field === 'email') setEmailError(false);
    if (field === 'password') setPasswordError(false);
    setError(null);
  };

  const verify2FA = async (code) => {
    const data = {
      token: code,
      secret,
      jwtToken: token,
    };
  
    try {
      const response = await userServices.verify2FA(data);
      if (response?.data?.status === "success") {
        setTwoFAError('');
        return true;
      } else {
        setTwoFAError("Invalid 2FA code");
        return false;
      }
    } catch (error) {
      setTwoFAError("An error occurred during verification");
      return false;
    }
  };

  const handleSuccessfulVerification = () => {
    localStorage.setItem("token", token);
    setOpen2FAModal(false);
    navigate("/dashboard");
  };

  const handleClose2FAModal = () => {
    setOpen2FAModal(false);
    setTwoFAError('');
    setLoading(false);
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <div className="img-wrapper">
              <img
                src="/assets/images/pact-img-dark.png"
                width="100%"
                height="100%"
                alt="login"
              />
            </div>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={(e) => {
                        handleChange(e);
                        handleChangeReset('email');
                      }}
                      helperText={touched.email && errors.email}
                      error={Boolean(
                        (errors.email && touched.email) || emailError
                      )}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={(e) => {
                        handleChange(e);
                        handleChangeReset('password');
                      }}
                      helperText={touched.password && errors.password}
                      error={Boolean(
                        (errors.password && touched.password) || passwordError
                      )}
                      sx={{ mb: 1.5 }}
                    />

                    {error && (
                      <Paragraph
                        color="error"
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          color: theme.palette.error.main,
                        }}
                      >
                        {error}
                      </Paragraph>
                    )}

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />
                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>
                      <NavLink
                        to="/session/forgot-password-user"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>

      <Modal
        open={isChainWeaverModalOpen}
        onClose={() => setIsChainWeaverModalOpen(false)}
        aria-labelledby="chainweaver-modal-title"
        aria-describedby="chainweaver-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="chainweaver-modal-title" variant="h6" component="h2">
            Chainweaver Connect
          </Typography>
          <Typography id="chainweaver-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Wallet Address"
              variant="outlined"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography>
              Please enter your Chainweaver wallet address to connect
            </Typography>
            {error && (
              <Paragraph
                color="error"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  color: theme.palette.error.main,
                }}
              >
                {error}
              </Paragraph>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setIsChainWeaverModalOpen(false)}
              >
                Close
              </Button>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                onClick={() => handleSubmitChainWeaverConnect()}
              >
                Connect
              </LoadingButton>
            </Box>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={open2FAModal}
        onClose={handleClose2FAModal}
        aria-labelledby="2fa-modal-title"
        aria-describedby="2fa-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '12px',
        }}>
          {qrImage && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>Scan QR Code</Typography>
              <img src={qrImage} alt="QR Code" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </Box>
          )}
          <TwoFactorVerification 
            onVerify={verify2FA} 
            error={twoFAError}
            setError={setTwoFAError}
            onSuccess={handleSuccessfulVerification}
          />
        </Box>
      </Modal>
    </StyledRoot>
  );
}
