import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Grid,
  Modal,
  TextField,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import userServices from "services/userServices.tsx";

import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";

// STYLED COMPONENTS
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

// initial login credentials
const initialValues = {
  email: "superadmin@yopmail.com",
  password: "superadmin",
  remember: true,
};

// form field validation schema
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
  const [passowrdError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { superlogin, user } = useAuth();
  const [open2FAModal, setOpen2FAModal] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [secret, setSecret] = useState("");
  const[token, setToken] = useState("");

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await superlogin(values.email, values.password);
      console.log(response, "login response");
      if (response.status === "success") {
        console.log("login response", response.data.is2FAModalOpen);
        if (response.data.is2FAModalOpen === true) {
          setQrImage(response.data.qrCodeUrl);
          setSecret(response.data.secret);
          setOpen2FAModal(true);
          setToken(response.token);
        } else {
          // navigate("/dashboard");
          navigate("/admin/launchpad/apply-launchpad");

        }

        // navigate("/dashboard");
      } else {
        setLoading(false);
        if (response.message === "Password not match") {
          setError(response.message);
          setPasswordError(true);
          setEmailError(false);
          return;
        }
        if (response.message === "User not found") {
          setError(response.message);
          setEmailError(true);
          setPasswordError(false);
          return;
        }

        setError(response.message);
        setEmailError(false);
        setPasswordError(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const handleChangeResetEmail = (e) => {
    setEmailError(false);
    setError(null);
  };

  const handleChangeResetPassword = (e) => {
    setPasswordError(false);
    setError(null);
  };

  const verify2FA = async () => {
    if (twoFactorCode.trim() === "") {
      setError("Please enter 2FA code");
    }
    
    const data = {
      token: twoFactorCode.trim(),
      secret,
      jwtToken: token,
    };

    const response = await userServices.verify2FA(data);
    console.log(response);

    if (response?.data?.status === "success") {
      localStorage.setItem("token", token);
      setOpen2FAModal(false);
      setTwoFactorCode("");
      setQrImage("");
      setSecret("");
      navigate("/dashboard");
    } else {
      console.log(response);
      setError("Invalid 2FA code");
    }
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

          {open2FAModal === false ? (
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
                          handleChangeResetEmail(e);
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
                          handleChangeResetPassword(e);
                        }}
                        helperText={touched.password && errors.password}
                        error={Boolean(
                          (errors.password && touched.password) || passowrdError
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
                          to="/session/forgot-password"
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
          ) : (
            <>
              {/* Two Factor Model */}
              {/* <Modal
                className="rn-popup-modal upload-modal-wrapper"
                show={isTwoFactorModalOpen}
                onHide={() => setIsTwoFactorModalOpen(false)}
                centered
              >
                {isTwoFactorModalOpen && (
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setIsTwoFactorModalOpen(false)}
                  >
                    <i className="feather-x" />
                  </button>
                )}
                <Modal.Body>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>Enable 2FA</h3>
                    </div>
                    <div className="modal-body">
                      {qrImage.length > 0 && (
                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <label htmlFor="address">Scan QR Code</label>
                          <img src={qrImage} alt="qr code" />
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="address">Key</label>
                        <input
                          type="text"
                          id="address"
                          placeholder="Enter your key"
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                        />
                      </div>
                      <div
                        className="modal-footer"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          type="button"
                          size="medium"
                          onClick={() => setIsTwoFactorModalOpen(false)}
                        >
                          Close
                        </Button>

                        <Button
                          type="button"
                          size="medium"
                          onClick={() => verify2FA()}
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal> */}

              <Modal
                open={open2FAModal}
                onClose={() => setOpen2FAModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
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
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Enable 2FA
                  </Typography>

                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {qrImage.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <label htmlFor="address">Scan QR Code</label>
                        <img src={qrImage} alt="qr code" />
                      </div>
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="twoFactorCode"
                      label="Key"
                      variant="outlined"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      sx={{ mt: 2 }}
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

                    <FlexBox justifyContent="space-between" sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        // onClick={() => setOpen2FAModal(false)}
                        onClick={() => {
                          setOpen2FAModal(false);
                          setTwoFactorCode("");
                          setQrImage("");
                          setSecret("");
                          setError("Please verify 2FA to login");
                          setLoading(false);
                        }}
                      >
                        Close
                      </Button>

                      <Button variant="contained" onClick={() => verify2FA()}>
                        Verify
                      </Button>
                    </FlexBox>
                  </Typography>
                </Box>
              </Modal>
            </>
          )}
        </Grid>
      </Card>
    </StyledRoot>
  );
}
