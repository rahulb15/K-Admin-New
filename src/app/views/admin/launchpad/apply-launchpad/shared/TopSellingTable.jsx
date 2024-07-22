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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import UpgradeCard from "../shared/NotificationList";
import { Paragraph } from "app/components/Typography";
import launchapadServices from "services/launchapadServices.tsx";
import collectionServices from "services/collectionServices.tsx";
import paymentServices from "services/paymentServices.tsx";
import useAuth from "app/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreatePresaleMutation,
  useCreateWlMutation,
  useCreateAirdropMutation,
  useCreateNgCollectionMutation,
} from "services/launchpad.service";
import Swal from "sweetalert2";
import moment from "moment";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
  const [selectedRow, setSelectedRow] = useState({});
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
  const [createNgCollection] = useCreateNgCollectionMutation();
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);
  const [finaliiizeSteps, setFinalizeSteps] = useState([]);
  const [activeFinalizeStep, setActiveFinalizeStep] = useState(0);
  const [startDateAndTime, setStartDateAndTime] = useState(null);
  const [endDateAndTime, setEndDateAndTime] = useState(null);
  const [presaleData, setPresaleData] = useState({
    presaleStartDate: "",
    presaleStartTime: "",
    presaleEndDate: "",
    presaleEndTime: "",
    presaleMintPrice: "",
  });
  const [whitelistData, setWhitelistData] = useState({
    createWlAdd: "",
    createWlPrice: "",
    createWlStartTime: "",
  });

  const [createPresale] = useCreatePresaleMutation();
  const [createWl] = useCreateWlMutation();
  const [createAirdrop] = useCreateAirdropMutation();

  const steps = ["Step 1", "Step 2"];

  const presaleSchema = yup.object().shape({
    startDateAndTime: yup.date().required("Start date and time is required"),
    endDateAndTime: yup
      .date()
      .required("End date and time is required")
      .min(yup.ref('startDateAndTime'), "End date must be after start date"),
    presaleMintPrice: yup
      .number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Presale mint price is required"),
    presaleAddress: yup
      .string()
      .required("Presale address is required")
      .matches(/^(k:[a-zA-Z0-9]+,?)+$/, "Invalid address format. Use 'k:address1,k:address2'"),
  });

  const whitelistSchema = yup.object().shape({
    createWlAdd: yup
      .string()
      .required("Whitelist address is required")
      .matches(/^(k:[a-zA-Z0-9]+,?)+$/, "Invalid address format. Use 'k:address1,k:address2'"),
    createWlPrice: yup
      .number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Whitelist price is required"),
    createWlStartTime: yup
      .date()
      .nullable()
      .required("Start time is required"),
  });


  const presaleForm = useForm({
    mode: "onChange",
    defaultValues: {
      startDateAndTime: null,
      endDateAndTime: null,
      presaleMintPrice: "",
      presaleAddress: "",
    },
    resolver: yupResolver(presaleSchema),
  });

  const whitelistForm = useForm({
    mode: "onChange",
    defaultValues: {
      createWlAdd: '',
      createWlPrice: '',
      createWlStartTime: null, 
    },
    resolver: yupResolver(whitelistSchema),
  });

  const handleOpen = (data) => {
    console.log("🚀 ~ handleOpen ~ data", data);
    setFormData(data);
    setOpen(true);
  };
  const handleClose = () => {
    setFormData({});
    setOpen(false);
    setId("");
    setActiveStep(0);
    setSelectedRow({});
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

  const handleFinalizeModalOpen = (data) => {
    console.log("🚀 ~ handleFinalizeModalOpen ~ data", data);

    // allowFreeMints: false,
    // enableWhitelist: true,
    // enablePresale: true,
    // enableAirdrop: false,
    //check true condition if those condition is true then add to the array step count and then setFinalizeSteps
    const steps = [];
    if (data.enablePresale) {
      steps.push("Enable Presale");
    }
    if (data.enableWhitelist) {
      steps.push("Enable Whitelist");
    }
    if (data.enableAirdrop) {
      steps.push("Enable Airdrop");
    }
    if (data.allowFreeMints) {
      steps.push("Allow Free Mints");
    }

    console.log("🚀 ~ handleFinalizeModalOpen ~ steps", steps);
    setFinalizeSteps(steps);
    setActiveFinalizeStep(0);

    setFinalizeModalOpen(true);
  };
  console.log("🚀 ~ TopSellingTable ~ finaliiizeSteps", finaliiizeSteps);

  const handleFinalizeModalClose = () => {
    setFinalizeModalOpen(false);
    setId("");
    setActiveFinalizeStep(0);
    setFinalizeSteps([]);
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
    setId("");
  };

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  console.log("🚀 ~ onAccept ~ selectedRow", selectedRow);

  const onAccept = async (id) => {
    console.log("🚀 ~ onAccept ~ id", id);
    console.log("🚀 ~ onAccept ~ selectedRow", selectedRow);
    console.log("🚀 ~ onAccept ~ selectedRow", selectedRow.collectionName);
    try {
      const result = await createNgCollection({
        collectionName: selectedRow.collectionName,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });
      console.log("🚀 ~ onAccept ~ result", result);
      if (result.data.result.status === "success") {
        console.log("Collection launched successfully", result);
        launchapadServices
          .launchLaunchpad(id)
          .then((response) => {
            console.log(response);

            if (response.data.isApproved) {
              const data = {
                collectionName: response.data.collectionName,
                applicationType: "launchpad",
              };

              collectionServices
                .createCollection(data)
                .then((response) => {
                  console.log(response);
                  props.setRefresh(!props.refresh);
                  handleAcceptModalClose();
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("🚀 ~ onAccept ~ response", response);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (result.error) {
        console.error("Error launching collection", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

  const handlePreSaleSubmit = async (data) => {
    console.log("🚀 ~ handlePreSaleSubmit ~ presaleData", data);

    const presaleStartDateNew = moment(data.startDateAndTime).format(
      "YYYY-MM-DD"
    );
    const presaleStartTimeNew = moment(data.startDateAndTime).format("HH:mm");
    const presaleEndDateNew = moment(data.endDateAndTime).format("YYYY-MM-DD");
    const presaleEndTimeNew = moment(data.endDateAndTime).format("HH:mm");

    const presaleStartTime = moment(
      `${presaleStartDateNew} ${presaleStartTimeNew}`
    ).format("YYYY-MM-DDTHH:mm:ss");
    const formattedStartDate = `time "${presaleStartTime}Z"`;
    console.log("formattedDate", formattedStartDate);

    const presaleEndTime = moment(
      `${presaleEndDateNew} ${presaleEndTimeNew}`
    ).format("YYYY-MM-DDTHH:mm:ss");
    const formattedEndDate = `time "${presaleEndTime}Z"`;
    console.log("formattedEndDate", formattedEndDate);


    const kaddress = data.presaleAddress.split(",");
    const kaddress1 = kaddress.map((address) => `'${address}'`);
    const kaddress2 = kaddress1.join(",");
    console.log("🚀 ~ handlePreSaleSubmit ~ kaddress2", kaddress2);

//     const mintPriceNew = parseFloat(data.presaleMintPrice).toFixed(2);
//     console.log("🚀 ~ handlePreSaleSubmit ~ mintPriceNew", mintPriceNew);
//     return;

    try {
      const result = await createPresale({
        createPresaleCol: selectedRow.collectionName,
        createPresalePrice: parseFloat(data.presaleMintPrice).toFixed(2),
        createPresaleStartDate: presaleStartDateNew,
        createPresaleStartTime: formattedStartDate,
        createPresaleEndDate: presaleEndDateNew,
        createPresaleEndTime: formattedEndDate,
        createPresaleAdd: kaddress2,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });

      console.log("🚀 ~ handlePreSaleSubmit ~ result", result);
      if (result.data.result.status === "success") {
        const body = {
          presaleStartDate: presaleStartDateNew,
          presaleStartTime: presaleStartTimeNew,
          presaleEndDate: presaleEndDateNew,
          presaleEndTime: presaleEndTimeNew,
          presalePrice: parseFloat(data.presaleMintPrice).toFixed(2),
          presaleAddressess: kaddress,
        };

        console.log("🚀 ~ handleSubmit ~ body", body);
        const response = await collectionServices.updateCollection(
          body,
          selectedRow.collectionName
        );
        console.log("🚀 ~ handleSubmit ~ response", response);
        if (response?.data?.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Presale created successfully",
          });
          setFinalizeModalOpen(false);
        } else {
          console.error("Error creating presale", response.error);
        }

        // Swal.fire({
        //   icon: "success",
        //   title: "Success",
        //   text: "Presale created successfully",
        // });
        // setFinalizeModalOpen(false);
      } else if (result.error) {
        console.error("Error creating presale", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // presaleStartDate: { type: String },
    // presaleStartTime: { type: String },
    // presaleEndDate: { type: String },
    // presaleEndTime: { type: String },
    // presalePrice: { type: String },
    // presaleAddressess: { type: [String] },
  };

  // const handleWhitelistSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("🚀 ~ handleWhitelistSubmit ~ whitelistData", whitelistData);

  //   const today = moment().format("YYYY-MM-DD");
  //   const presaleStartTime = moment(
  //     `${today} ${presaleData.presaleStartTime}`
  //   ).format("YYYY-MM-DDTHH:mm:ss");
  //   const formattedStartDate = `time "${presaleStartTime}Z"`;
  //   console.log("formattedDate", formattedStartDate);

  //   try {
  //     const result = await createWl({
  //       createWlCol: selectedRow.collectionName,
  //       createWlAdd: whitelistData.createWlAdd,
  //       createWlPrice: parseFloat(whitelistData.createWlPrice),
  //       createWlStartTime: formattedStartDate,
  //       wallet:
  //         user?.walletName === "Ecko Wallet"
  //           ? "ecko"
  //           : user?.walletName === "Chainweaver"
  //           ? "CW"
  //           : user?.walletName,
  //     });

  //     console.log("🚀 ~ handleWhitelistSubmit ~ result", result);
  //     if (result.data.result.status === "success") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Whitelist created successfully",
  //       });
  //       setFinalizeModalOpen(false);
  //     } else if (result.error) {
  //       console.error("Error creating whitelist", result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };


  const handleWhitelistSubmit = async (data) => {
    console.log("🚀 ~ handleWhitelistSubmit ~ data", data);
  
    const whitelistStartTime = moment(data.createWlStartTime).format("YYYY-MM-DDTHH:mm:ss");
    const formattedStartDate = `time "${whitelistStartTime}Z"`;
    console.log("formattedDate", formattedStartDate);
  
    try {
      const result = await createWl({
        createWlCol: selectedRow.collectionName,
        createWlAdd: data.createWlAdd,
        createWlPrice: parseFloat(data.createWlPrice).toFixed(2),
        createWlStartTime: formattedStartDate,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });
  
      console.log("🚀 ~ handleWhitelistSubmit ~ result", result);
      if (result.data.result.status === "success") {
        const body = {
          whitelistAddresses: data.createWlAdd,
          whitelistStartDate: moment(data.createWlStartTime).format("YYYY-MM-DD"),
          whitelistStartTime: moment(data.createWlStartTime).format("HH:mm"),
          whitelistPrice: parseFloat(data.createWlPrice).toFixed(2),
        };

        console.log("🚀 ~ handleSubmit ~ body", body);
        const response = await collectionServices.updateCollection(
          body,
          selectedRow.collectionName
        );
        console.log("🚀 ~ handleSubmit ~ response", response);

        if (response?.data?.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Whitelist created successfully",
          });
          setFinalizeModalOpen(false);
        }
      } else if (result.error) {
        console.error("Error creating whitelist", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onPresaleSubmit = (data) => {
    console.log("Presale data:", data);
    handlePreSaleSubmit(data);
  };

  const onWhitelistSubmit = (data) => {
    console.log("Whitelist data:", data);
    handleWhitelistSubmit(data);
  };

  // const PreSaleForm = () => (
  //   <form onSubmit={presaleForm.handleSubmit(onPresaleSubmit)}>
  //     <LocalizationProvider dateAdapter={AdapterDayjs}>
  //       <Stack spacing={3}>
  //         <Controller
  //           name="startDateAndTime"
  //           control={presaleForm.control}
  //           render={({ field }) => (
  //             <DateTimePicker
  //               {...field}
  //               label="Presale Start Date"
  //               renderInput={(props) => <TextField {...props} />}
  //             />
  //           )}
  //         />
  //         <Controller
  //           name="endDateAndTime"
  //           control={presaleForm.control}
  //           render={({ field }) => (
  //             <DateTimePicker
  //               {...field}
  //               label="Presale End Date"
  //               renderInput={(props) => <TextField {...props} />}
  //             />
  //           )}
  //         />
  //       </Stack>
  //     </LocalizationProvider>

  //     <Controller
  //       name="presaleMintPrice"
  //       control={presaleForm.control}
  //       rules={{
  //         validate: (value) => value >= 0 || "Negative values are not allowed",
  //       }}
  //       render={({ field }) => (
  //         <TextField
  //           {...field}
  //           label="Presale Mint Price"
  //           type="number"
  //           fullWidth
  //           margin="normal"
  //           error={!!presaleForm.formState.errors.presaleMintPrice}
  //           helperText={presaleForm.formState.errors.presaleMintPrice?.message}
  //         />
  //       )}
  //     />

  //     <Controller
  //       name="presaleAddress"
  //       control={presaleForm.control}
  //       rules={{
  //         pattern: {
  //           value: /^(k:[a-zA-Z0-9]+,?)+$/,
  //           message: "Invalid address format. Use 'k:address1,k:address2'",
  //         },
  //       }}
  //       render={({ field }) => (
  //         <TextField
  //           {...field}
  //           label="Presale Address"
  //           fullWidth
  //           margin="normal"
  //           error={!!presaleForm.formState.errors.presaleAddress}
  //           helperText={presaleForm.formState.errors.presaleAddress?.message}
  //         />
  //       )}
  //     />

  //     <Button onClick={handleFinalizeModalClose}>Close</Button>
  //     <Button type="submit">Submit</Button>
  //   </form>
  // );


  const PreSaleForm = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = presaleForm;
  
    return (
      <form onSubmit={handleSubmit(onPresaleSubmit)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <Controller
              name="startDateAndTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Presale Start Date"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      error={!!errors.startDateAndTime}
                      helperText={errors.startDateAndTime?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="endDateAndTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Presale End Date"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      error={!!errors.endDateAndTime}
                      helperText={errors.endDateAndTime?.message}
                    />
                  )}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
  
        <Controller
          name="presaleMintPrice"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Presale Mint Price"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.presaleMintPrice}
              helperText={errors.presaleMintPrice?.message}
            />
          )}
        />
  
        <Controller
          name="presaleAddress"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Presale Address"
              fullWidth
              margin="normal"
              error={!!errors.presaleAddress}
              helperText={errors.presaleAddress?.message}
            />
          )}
        />
  
        <Button onClick={handleFinalizeModalClose}>Close</Button>
        <Button type="submit">Submit</Button>
      </form>
    );
  };





  // const WhitelistForm = () => (
  //   <form onSubmit={whitelistForm.handleSubmit(onWhitelistSubmit)}>
  //     <TextField
  //       label="Create Whitelist Collection"
  //       name="createWlCol"
  //       fullWidth
  //       margin="normal"
  //       value={selectedRow.collectionName}
  //       disabled={true}
  //     />

  //     <Controller
  //       name="createWlAdd"
  //       control={whitelistForm.control}
  //       render={({ field }) => (
  //         <TextField
  //           {...field}
  //           label="Create Whitelist Address"
  //           fullWidth
  //           margin="normal"
  //           error={!!whitelistForm.formState.errors.createWlAdd}
  //           helperText={whitelistForm.formState.errors.createWlAdd?.message}
  //         />
  //       )}
  //     />

  //     <Controller
  //       name="createWlPrice"
  //       control={whitelistForm.control}
  //       render={({ field }) => (
  //         <TextField
  //           {...field}
  //           label="Create Whitelist Price"
  //           fullWidth
  //           margin="normal"
  //           error={!!whitelistForm.formState.errors.createWlPrice}
  //           helperText={whitelistForm.formState.errors.createWlPrice?.message}
  //         />
  //       )}
  //     />

  //     <Controller
  //       name="createWlStartTime"
  //       control={whitelistForm.control}
  //       render={({ field }) => (
  //         <TextField
  //           {...field}
  //           label="Create Whitelist Start Time"
  //           type="time"
  //           fullWidth
  //           margin="normal"
  //           error={!!whitelistForm.formState.errors.createWlStartTime}
  //           helperText={
  //             whitelistForm.formState.errors.createWlStartTime?.message
  //           }
  //         />
  //       )}
  //     />

  //     <Button onClick={handleFinalizeModalClose}>Close</Button>
  //     <Button type="submit">Submit</Button>
  //   </form>
  // );


const WhitelistForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = whitelistForm;

  return (
    <form onSubmit={handleSubmit(onWhitelistSubmit)}>
      <TextField
        label="Collection Name"
        name="createWlCol"
        fullWidth
        margin="normal"
        value={selectedRow.collectionName}
        disabled={true}
      />

      <Controller
        name="createWlAdd"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Whitelist Addresses"
            fullWidth
            margin="normal"
            error={!!errors.createWlAdd}
            helperText={errors.createWlAdd?.message}
          />
        )}
      />

      <Controller
        name="createWlPrice"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Whitelist Price"
            fullWidth
            margin="normal"
            error={!!errors.createWlPrice}
            helperText={errors.createWlPrice?.message}
          />
        )}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name="createWlStartTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              label="Whitelist Start Time"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!errors.createWlStartTime}
                  helperText={errors.createWlStartTime?.message}
                />
              )}
            />
          )}
        />
      </LocalizationProvider>

      <Button onClick={handleFinalizeModalClose}>Close</Button>
      <Button type="submit">Submit</Button>
    </form>
  );
};


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
                  {/* {user?.role === "superadmin" && ( */}
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Action
                  </TableCell>
                  {/* )} */}
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
                          {product.creatorWallet.slice(0, 5) +
                            "..." +
                            product.creatorWallet.slice(-5)}
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
                        {console.log("🚀 ~ TopSellingTable ~ product", product)}
                        {product?.isLaunched === false ? (
                          <TableCell colSpan={2} sx={{ px: 0 }}>
                            <IconButton
                              onClick={() => {
                                setId(product._id);
                                setSelectedRow(product);
                                handleAcceptModalOpen();
                              }}
                            >
                              <Done color="primary" />
                            </IconButton>
                          </TableCell>
                        ) : (
                          <TableCell colSpan={2} sx={{ px: 0 }}>
                            {/* <IconButton
                              onClick={() => {
                                setId(product._id);
                                setSelectedRow(product);
                                handleRejectModalOpen();
                              }}
                            >
                              <Close color="error" />
                            </IconButton> */}
                            {/* <Button
                              onClick={() => {
                                setId(product._id);
                                setSelectedRow(product);
                                handleFinalizeModalOpen(product);
                              }}
                              variant="contained"
                              color="success"
                            >
                              <span style={{ fontSize: 10 }}>
                                Click to Finish
                              </span>
                            </Button> */}
                            {/* mintStartDate: 'time "2024-07-21T23:48:00Z"',
mintStartTime: 'time "2024-07-21T23:48:00Z"', */}

                            {product?.mintStartDate
                              .split(" ")[1]
                              .split('"')[1] >
                            moment().format("YYYY-MM-DDTHH:mm:ss") ? (
                              // <span style={{ color: "red" }}>Minting not started</span>
                              <Button
                                onClick={() => {
                                  setId(product._id);
                                  setSelectedRow(product);
                                  handleFinalizeModalOpen(product);
                                }}
                                variant="contained"
                                color="success"
                              >
                                <span style={{ fontSize: 10 }}>
                                  Click to Finish
                                </span>
                              </Button>
                            ) : (
                              <span style={{ color: "green" }}>
                                Minting started
                              </span>
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

      {/* modal make */}

      {/* <Modal open={finalizeModalOpen} onClose={handleFinalizeModalClose}>
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
          {console.log("🚀 ~ handleFinalizeModalOpen ~ finaliiizeSteps", finaliiizeSteps)}
          <AppBar position="static">
            <Tabs
              value={finaliiizeSteps}
              onChange={(e, newValue) => {console.log("🚀 ~ onChange ~ newValue", newValue); setActiveFinalizeStep(newValue)}}
              indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
            >
               {finaliiizeSteps.map((step, index) => (
                <Tab key={index} label={step} {...a11yProps(index)} />
              ))}
            </Tabs>
          </AppBar>

          {finaliiizeSteps.map((step, index) => (
            <TabPanel key={index} value={activeFinalizeStep} index={index} dir={palette.direction}>
              <Typography>{step}</Typography>
            </TabPanel>
          ))}

             
        </Box>
      </Modal> */}
      {/* <Modal open={finalizeModalOpen} onClose={handleFinalizeModalClose}>
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
          <AppBar position="static">
            <Tabs
              value={activeFinalizeStep}
              onChange={(e, newValue) => setActiveFinalizeStep(newValue)}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              {finaliiizeSteps.map((step, index) => (
                <Tab key={index} label={step} {...a11yProps(index)} />
              ))}
            </Tabs>
          </AppBar>

          {finaliiizeSteps.map((step, index) => (
            <TabPanel key={index} value={activeFinalizeStep} index={index}>
              {step === "Enable Presale" && preSaleForm()}
              {step === "Enable Whitelist" && whitelistForm()}
            </TabPanel>
          ))}
        </Box>
      </Modal> */}
      <Modal open={finalizeModalOpen} onClose={handleFinalizeModalClose}>
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
          <AppBar position="static">
            <Tabs
              value={activeFinalizeStep}
              onChange={(e, newValue) => setActiveFinalizeStep(newValue)}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              {finaliiizeSteps.map((step, index) => (
                <Tab key={index} label={step} {...a11yProps(index)} />
              ))}
            </Tabs>
          </AppBar>

          {finaliiizeSteps.map((step, index) => (
            <TabPanel key={index} value={activeFinalizeStep} index={index}>
              {step === "Enable Presale" && <PreSaleForm />}
              {step === "Enable Whitelist" && <WhitelistForm />}
            </TabPanel>
          ))}
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
