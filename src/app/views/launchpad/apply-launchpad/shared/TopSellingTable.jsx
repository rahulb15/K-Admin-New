// import { Edit } from "@mui/icons-material";
import { Done, Close, Visibility } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
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
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import UpgradeCard from "../shared/NotificationList";
import { Paragraph } from "app/components/Typography";
import launchapadServices from "services/launchapadServices.tsx";
import paymentServices from "services/paymentServices.tsx";
import useAuth from "app/hooks/useAuth";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" },
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

export default function TopSellingTable(props) {
  console.log("🚀 ~ TopSellingTable ~ props:", props);
  const { login, user } = useAuth();
  console.log("🚀 ~ TopSellingTable ~ user:", user);
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [transactionData, setTransactionData] = useState({});
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [disable, setDisable] = useState(true);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    collectionName: "",
    creatorName: "",
    creatorEmail: "",
    creatorWallet: "",
    projectDescription: "",
    projectCategory: "",
    expectedLaunchDate: "",
    twitter: "",
    discord: "",
    instagram: "",
    website: "",
    contractType: "",
    totalSupply: "",
    mintPrice: "",
    mintPriceCurrency: "",
    royaltyPercentage: "",
  });

  const steps = ["Step 1", "Step 2"];

  const handleOpen = (data) => {
    console.log("🚀 ~ handleOpen ~ data", data);
    setFormData(data);
    setOpen(true);
  };
  const handleClose = () => {
    setFormData({});
    setOpen(false);
    setId("");
  };

  const handleAcceptModalOpen = () => {
    setAcceptModalOpen(true);
  };

  const handleAcceptModalClose = () => {
    setAcceptModalOpen(false);
    setId("");
  };

  const handleRejectModalOpen = () => {
    setRejectModalOpen(true);
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
    setId("");
  };

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const onAccept = (id) => {
    console.log("🚀 ~ onAccept ~ id", id);
    launchapadServices
      .approveLaunchpad(id)
      .then((response) => {
        console.log(response);
        props.setRefresh(!props.refresh);
        handleAcceptModalClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onReject = (id) => {
    console.log("🚀 ~ onReject ~ id", id);
    launchapadServices
      .rejectLaunchpad(id)
      .then((response) => {
        console.log(response);
        props.setRefresh(!props.refresh);
        handleRejectModalClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClickRow = (id) => {
    console.log("🚀 ~ onClickRow ~ id", id);
    //getById
    paymentServices
      .getById(id)
      .then((response) => {
        console.log(response);
        setTransactionData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("🚀 ~ TopSellingTable ~ transactionData", transactionData);

  console.log("user?.role", user?.role === "superadmin");
  const renderStage1Form = () => (
    <Box component="form" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Collection Name"
            name="collectionName"
            fullWidth
            margin="normal"
            value={formData?.collectionName}
            onChange={(e) =>
              setFormData({ ...formData, collectionName: e.target.value })
            }
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Creator's Name"
            name="creatorName"
            fullWidth
            margin="normal"
            value={formData?.creatorName}
            onChange={(e) =>
              setFormData({ ...formData, creatorName: e.target.value })
            }
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Creator's Email Address"
            name="creatorEmail"
            type="email"
            fullWidth
            margin="normal"
            value={formData?.creatorEmail}
            onChange={(e) =>
              setFormData({ ...formData, creatorEmail: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Creator's Wallet Address"
            name="creatorWallet"
            fullWidth
            margin="normal"
            value={formData?.creatorWallet}
            onChange={(e) =>
              setFormData({ ...formData, creatorWallet: e.target.value })
            }
            disabled={true}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Project Description"
            name="projectDescription"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            value={formData?.projectDescription}
            onChange={(e) =>
              setFormData({ ...formData, projectDescription: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Project Category</InputLabel>
            <Select
              name="projectCategory"
              value={formData?.projectCategory}
              onChange={(e) =>
                setFormData({ ...formData, projectCategory: e.target.value })
              }
              disabled={disable}
            >
              <MenuItem value="art">Art</MenuItem>
              <MenuItem value="photography">Photography</MenuItem>
              <MenuItem value="gaming">Gaming</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Expected Launch Date"
            name="expectedLaunchDate"
            type="month"
            fullWidth
            margin="normal"
            value={formData?.expectedLaunchDate}
            onChange={(e) =>
              setFormData({ ...formData, expectedLaunchDate: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Twitter"
            name="twitter"
            fullWidth
            margin="normal"
            value={formData?.twitter}
            onChange={(e) =>
              setFormData({ ...formData, twitter: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Discord"
            name="discord"
            fullWidth
            margin="normal"
            value={formData?.discord}
            onChange={(e) =>
              setFormData({ ...formData, discord: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Instagram"
            name="instagram"
            fullWidth
            margin="normal"
            value={formData?.instagram}
            onChange={(e) =>
              setFormData({ ...formData, instagram: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Website"
            name="website"
            fullWidth
            margin="normal"
            value={formData?.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            disabled={disable}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStage2Form = () => (
    <div>
      <h2>Step 2</h2>
      <form>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Contract Type</FormLabel>
          <RadioGroup
            row
            name="contractType"
            value={formData?.contractType}
            onChange={(e) =>
              setFormData({ ...formData, contractType: e.target.value })
            }
          >
            <FormControlLabel
              value="ng"
              control={<Radio />}
              label="NG"
              disabled={disable}
            />
            <FormControlLabel
              value="v2"
              control={<Radio />}
              label="V2"
              disabled={disable}
            />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Total Supply"
          name="totalSupply"
          type="number"
          fullWidth
          margin="normal"
          value={formData?.totalSupply}
          onChange={(e) =>
            setFormData({ ...formData, totalSupply: e.target.value })
          }
          disabled={true}
        />
        <TextField
          label="Mint Price"
          name="mintPrice"
          type="number"
          fullWidth
          margin="normal"
          value={formData?.mintPrice}
          onChange={(e) =>
            setFormData({ ...formData, mintPrice: e.target.value })
          }
          disabled={true}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Mint Price Currency</InputLabel>
          <Select
            name="mintPriceCurrency"
            value={formData?.mintPriceCurrency}
            onChange={(e) =>
              setFormData({ ...formData, mintPriceCurrency: e.target.value })
            }
            disabled={disable}
          >
            <MenuItem value="eth">ETH</MenuItem>
            <MenuItem value="matic">MATIC</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Royalty Address"
          name="royaltyAddress"
          fullWidth
          margin="normal"
          value={formData?.royaltyAddress}
          onChange={(e) =>
            setFormData({ ...formData, royaltyAddress: e.target.value })
          }
          disabled={disable}
        />

        <TextField
          label="Royalty Percentage"
          name="royaltyPercentage"
          type="number"
          fullWidth
          margin="normal"
          value={formData?.royaltyPercentage}
          onChange={(e) =>
            setFormData({ ...formData, royaltyPercentage: e.target.value })
          }
          disabled={disable}
        />
        <TextField
          label="Mint Start Date"
          name="mintStartDate"
          type="date"
          fullWidth
          margin="normal"
          value={formData?.mintStartDate}
          onChange={(e) =>
            setFormData({ ...formData, mintStartDate: e.target.value })
          }
          disabled={disable}
        />
        <TextField
          label="Mint Start Time"
          name="mintStartTime"
          type="time"
          fullWidth
          margin="normal"
          value={formData?.mintStartTime}
          onChange={(e) =>
            setFormData({ ...formData, mintStartTime: e.target.value })
          }
          disabled={disable}
        />
        <FormControlLabel
          control={<Checkbox name="allowFreeMints" />}
          label="Allow Free Mints"
        />
        <FormControlLabel
          control={<Checkbox name="enableWhitelist" />}
          label="Enable Whitelist"
        />
        <FormControlLabel
          control={<Checkbox name="enablePresale" />}
          label="Enable Presale"
        />
        <FormControlLabel
          control={<Checkbox name="enableAirdrop" />}
          label="Enable Airdrop"
        />
        <div>
          <Button onClick={handleBack}>Back</Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <Grid item lg={8} md={8} sm={12} xs={12}>
        <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
          <CardHeader>
            <Title>Launchpad Applications List</Title>
            <Select size="small" defaultValue="paid" variant="outlined">
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </CardHeader>

          <Box overflow="auto">
            <ProductTable>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={1} sx={{ px: 0 }}>
                    Cover
                  </TableCell>
                  <TableCell colSpan={1} sx={{ px: 0 }}>
                    Banner
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 3 }}>
                    Name
                  </TableCell>

                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Creator
                  </TableCell>

                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    wallet
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Email
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Category
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Launch Date
                  </TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Payment Status
                  </TableCell>
                  <TableCell colSpan={1} sx={{ px: 0 }}>
                    View
                  </TableCell>

                  {/* <TableCell colSpan={2} sx={{ px: 0 }}>
                    Action
                  </TableCell> */}
                  {user?.role === "superadmin" && (
                    <TableCell colSpan={2} sx={{ px: 0 }}>
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {/* {nftsList.map((nft, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Avatar src={nft.imgUrl} />
                    <Paragraph>{nft.name}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  ${nft.price > 999 ? (nft.price / 1000).toFixed(1) + "k" : nft.price}
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {product.available ? (
                    product.available < 20 ? (
                      <Small bgcolor={bgSecondary}>{product.available} available</Small>
                    ) : (
                      <Small bgcolor={bgPrimary}>in stock</Small>
                    )
                  ) : (
                    <Small bgcolor={bgError}>out of stock</Small>
                  )}
                </TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0 }}>
                  {nft.available}
                </TableCell>

                <TableCell sx={{ px: 0 }} colSpan={1}>
                  <IconButton>
                    <Edit color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))} */}

                {props?.data?.map(
                  (product, index) => (
                    console.log("🚀 ~ TopSellingTable ~ product", product),
                    (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => onClickRow(product._id)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { background: "#ddebf8" },
                        }}
                      >
                        <TableCell colSpan={1} sx={{ px: 0 }}>
                          <Avatar src={product.collectionCoverImage} />
                        </TableCell>
                        <TableCell colSpan={1} sx={{ px: 0 }}>
                          <Avatar src={product.collectionBannerImage} />
                        </TableCell>
                        <TableCell colSpan={2} sx={{ px: 3 }}>
                          {product.collectionName}
                        </TableCell>

                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.creatorName}
                        </TableCell>

                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.creatorWallet}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.creatorEmail}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.projectCategory}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.expectedLaunchDate}
                        </TableCell>
                        <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.isPaid ? (
                            <Small bgcolor={bgPrimary}>Paid</Small>
                          ) : (
                            <Small bgcolor={bgError}>Not Paid</Small>
                          )}
                        </TableCell>
                        <TableCell colSpan={1} sx={{ px: 0 }}>
                          <IconButton onClick={(e) => handleOpen(product)}>
                            <Visibility color="primary" />
                          </IconButton>
                        </TableCell>

                        {/* <TableCell colSpan={2} sx={{ px: 0 }}>
                          {product.isApproved === false &&
                          product.isRejected === false ? (
                            <>
                              <IconButton
                                onClick={() => {
                                  setId(product._id);
                                  handleAcceptModalOpen();
                                }}
                              >
                                <Done color="primary" />
                              </IconButton>
                              &nbsp; &nbsp; &nbsp;
                              <IconButton
                                onClick={() => {
                                  // onReject(product._id)
                                  setId(product._id);
                                  handleRejectModalOpen();
                                }}
                              >
                                <Close color="error" />
                              </IconButton>
                            </>
                          ) : (
                            (product.isApproved === true && (
                              <Small bgcolor={bgPrimary}>Approved</Small>
                            )) ||
                            (product.isRejected === true && (
                              <Small bgcolor={bgError}>Rejected</Small>
                            ))
                          )}
                        </TableCell> */}
                        {user?.role === "superadmin" && (
                          <TableCell colSpan={2} sx={{ px: 0 }}>
                            {product.isApproved === false &&
                            product.isRejected === false ? (
                              <>
                                <IconButton
                                  onClick={() => {
                                    setId(product._id);
                                    handleAcceptModalOpen();
                                  }}
                                >
                                  <Done color="primary" />
                                </IconButton>
                                &nbsp; &nbsp; &nbsp;
                                <IconButton
                                  onClick={() => {
                                    // onReject(product._id)
                                    setId(product._id);
                                    handleRejectModalOpen();
                                  }}
                                >
                                  <Close color="error" />
                                </IconButton>
                              </>
                            ) : (
                              (product.isApproved === true && (
                                <Small bgcolor={bgPrimary}>Approved</Small>
                              )) ||
                              (product.isRejected === true && (
                                <Small bgcolor={bgError}>Rejected</Small>
                              ))
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </ProductTable>
          </Box>
        </Card>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <UpgradeCard transactionData={transactionData} />
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 3, mb: 3, textAlign: "center", fontSize: 24 }}>
            <Button onClick={() => setDisable(!disable)}>Edit</Button>
          </Box>

          {activeStep === 0 ? renderStage1Form() : renderStage2Form()}
        </Box>
      </Modal>

      <Modal open={acceptModalOpen} onClose={handleAcceptModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid #000",
            borderRadius: 5,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            sx={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
            Are you sure you want to accept?
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={
                // handleAcceptModalClose
                () => {
                  onAccept(id);
                }
              }
              sx={{ float: "right", margin: "10px" }}
            >
              Yes
            </Button>

            <Button
              onClick={handleAcceptModalClose}
              sx={{ float: "right", margin: "10px" }}
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={rejectModalOpen} onClose={handleRejectModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid #000",
            borderRadius: 5,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            sx={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
            Are you sure you want to reject?
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => onReject(id)}
              sx={{ float: "right", margin: "10px" }}
            >
              Yes
            </Button>
            <Button
              onClick={handleRejectModalClose}
              sx={{ float: "right", margin: "10px" }}
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

const nftsList = [
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 1",
    price: 100,
    available: 15,
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 2",
    price: 1500,
    available: 30,
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 3",
    price: 1900,
    available: 35,
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 4",
    price: 100,
    available: 0,
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 5",
    price: 1190,
    available: 5,
  },
];
