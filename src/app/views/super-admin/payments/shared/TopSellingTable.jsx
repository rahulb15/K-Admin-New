// import { Edit } from "@mui/icons-material";
import { Done } from "@mui/icons-material";
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
  Grid,
  Modal,
  TextField,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Pagination,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import UpgradeCard from "../shared/NotificationList";
import { Paragraph } from "app/components/Typography";
import paymentServices from "services/paymentServices.tsx";
import useAuth from "app/hooks/useAuth";
import moment from "moment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Swal from "sweetalert2";

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

  const onClickRow = (id) => {
    console.log("🚀 ~ onClickRow ~ id", id);
    //getById
    paymentServices
      .get(id)
      .then((response) => {
        console.log(response);
        setTransactionData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("user?.role", user?.role === "superadmin");
  console.log("transactionData", transactionData);

  const copyWalletAddress = (address) => {
    navigator.clipboard.writeText(address);
    Swal.fire({
      icon: "success",
      title: "Copied",
      text: "Wallet address copied to clipboard",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <>
      <Grid item lg={8} md={8} sm={12} xs={12}>
        <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
          <CardHeader>
            <Title>Deposits Table</Title>
            <Box display="flex" justifyContent="flex-start" px={2}>
              <TextField
                size="small"
                label="Search"
                variant="outlined"
                onChange={(e) => props.setSearch(e.target.value)}
              />
            </Box>
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
                  {/* <TableCell>Transaction ID</TableCell> */}
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    User Email
                  </TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell colSpan={2} sx={{ px: 0 }}>
                    Address
                  </TableCell>
                  <TableCell>Priority Fee</TableCell>
                  <TableCell>%</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Deposit Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {props?.data?.map((row) => (
                  <TableRow
                    key={row?._id}
                    hover
                    onClick={() => onClickRow(row.transaction._id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { background: "#ddebf8" },
                    }}
                  >
                    {/* <TableCell>{row?.transaction._id}</TableCell> */}
                    <TableCell colSpan={2} sx={{ px: 0 }}>
                      {row?.user.email}
                    </TableCell>
                    <TableCell>{row?.amount}</TableCell>
                    <TableCell>{row?.cryptoCurrency}</TableCell>

                    {/* <TableCell>{row?.address}</TableCell> */}
                    <TableCell colSpan={2} sx={{ px: 0 }}>
                      {row?.address.slice(0, 6)}...{row?.address.slice(-4)}
                      <ContentCopyIcon
                        fontSize="small"
                        sx={{ cursor: "pointer", marginLeft: 1 }}
                        onClick={() => copyWalletAddress(row?.address)}
                      />
                    </TableCell>
                    <TableCell>{row?.priorityFee}</TableCell>
                    <TableCell>{row?.percentage} %</TableCell>
                    <TableCell>{row?.totalAmount}</TableCell>
                    <TableCell>
                      {moment(row?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Small
                        bgcolor={
                          row?.transaction?.paymentStatus === "pending"
                            ? bgError
                            : "green"
                        }
                      >
                        {row?.transaction?.paymentStatus}
                      </Small>
                    </TableCell>

                    <TableCell>
                      <Small
                        bgcolor={
                          row?.status === "pending" ? bgError : bgPrimary
                        }
                      >
                        {row?.status}
                      </Small>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          // onClickRow(row._id);
                          setOpen(true);
                        }}
                        variant="contained"
                        color="primary"
                        size="small"
                        // startIcon={<Done />}
                      >
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ProductTable>
          </Box>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={props?.totalPages}
              page={props?.page}
              onChange={(event, value) => props?.setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Card>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <UpgradeCard transactionData={transactionData} />
      </Grid>
    </>
  );
}
