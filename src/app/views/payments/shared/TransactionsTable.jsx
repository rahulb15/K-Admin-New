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

export default function TopSellingTable() {
  const { login, user } = useAuth();
  console.log("🚀 ~ TopSellingTable ~ user:", user);
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  console.log("user?.role", user?.role === "superadmin");

  useEffect(() => {
    paymentServices
      .getAllTransactions(page, limit, search)
      .then((response) => {
        console.log(response);
        setData(response.data[0].transactions);
        setTotalPages(response.data[0].total[0].total); // Assuming the API returns the total number of pages
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, limit, search, refresh]);
  console.log(data);
  console.log("totalPages", totalPages);

  //   [
  //     {
  //       _id: '6682f47345ef3900f44f528a',
  //       user: '667a97f21bcaf624a85664b1',
  //       paymentId:
  //         'cs_test_a1wpZkfCes731apq3eoGSVYL83po3yhYJXi1Sgcl3nlPtF0BoEcAHisSZI',
  //       paymentStatus: 'paid',
  //       paymentAmount: 7.77,
  //       paymentCurrency: 'usd',
  //       paymentDate: '2024-07-01T18:24:51.000Z',
  //       paymentMethod: 'card',
  //       paymentUserRole: 'user',
  //       order_id: '6682f47345ef3900f44f528c',
  //       order_type: 'deposit',
  //       isRefunded: false,
  //       createdAt: '2024-07-01T18:24:51.707Z',
  //       updatedAt: '2024-07-01T19:24:22.933Z'
  //     }
  //   ]

  return (
    <>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
          <CardHeader>
            <Title>Transactions Table</Title>
            <Box display="flex" justifyContent="flex-start" px={2}>
              <TextField
                size="small"
                label="Search"
                variant="outlined"
                onChange={(e) => setSearch(e.target.value)}
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
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Payment Amount</TableCell>
                  <TableCell>Payment Currency</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Payment User Role</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Order Type</TableCell>
                  <TableCell>Is Refunded</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.paymentId}</TableCell>
                    <TableCell>
                      <Small
                        bgcolor={
                          item.paymentStatus === "paid" ? bgPrimary : bgError
                        }
                      >
                        {item.paymentStatus}
                      </Small>
                    </TableCell>
                    <TableCell>{item.paymentAmount}</TableCell>
                    <TableCell>{item.paymentCurrency}</TableCell>
                    <TableCell>
                      {moment(item.paymentDate).format("MMM DD, YYYY hh:mm A")}
                    </TableCell>
                    <TableCell>{item.paymentMethod}</TableCell>
                    <TableCell>{item.paymentUserRole}</TableCell>
                    <TableCell>{item.order_id}</TableCell>
                    <TableCell>{item.order_type}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={item.isRefunded}
                        icon={<Done />}
                        checkedIcon={<Done />}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ProductTable>
          </Box>

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Card>
      </Grid>
    </>
  );
}
