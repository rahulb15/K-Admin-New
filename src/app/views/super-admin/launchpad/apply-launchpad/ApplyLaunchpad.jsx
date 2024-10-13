// import { Fragment } from "react";
// import { Card, Grid, styled, useTheme } from "@mui/material";
// import RowCards from "./shared/RowCards";
// import StatCards from "./shared/StatCards";
// import Campaigns from "./shared/Campaigns";
// import StatCards2 from "./shared/StatCards2";
// import DoughnutChart from "./shared/Doughnut";
// import UpgradeCard from "./shared/NotificationList";
// import TopSellingTable from "./shared/TopSellingTable";
// import launchapadServices from "services/launchapadServices.tsx";
// import useAuth from "app/hooks/useAuth";
// import { useNavigate } from "react-router-dom";

// import { useEffect, useState } from "react";
// // STYLED COMPONENTS
// const ContentBox = styled("div")(({ theme }) => ({
//   margin: "30px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" },
// }));

// const Title = styled("span")(() => ({
//   fontSize: "1rem",
//   fontWeight: "500",
//   marginRight: ".5rem",
//   textTransform: "capitalize",
// }));

// const SubTitle = styled("span")(({ theme }) => ({
//   fontSize: "0.875rem",
//   color: theme.palette.text.secondary,
// }));

// const H4 = styled("h4")(({ theme }) => ({
//   fontSize: "1rem",
//   fontWeight: "500",
//   marginBottom: "16px",
//   textTransform: "capitalize",
//   color: theme.palette.text.secondary,
// }));

// export default function ApplyLaunchpad() {
//   const { palette } = useTheme();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [search, setSearch] = useState("");
//   const [data, setData] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   // useEffect(() => {
//   //   if (user?.role === "superadmin") {
//   //     console.log("superadmin");
//   //   } else if (user?.role === "admin") {
//   //     navigate("/dashboard");
//   //   }
//   // }, [user?.role]);

//   useEffect(() => {
//     // if (user?.role === "superadmin") {
//       launchapadServices
//         .getAll(page, limit, search)
//         .then((response) => {
//           console.log(response.data);
//           setData(response.data[0].data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     // } else if (user?.role === "admin") {


//     // }
//   }, [page, limit, search, refresh]);

//   console.log(data);

//   return (
//     <Fragment>
//       <ContentBox className="analytics">
//         <Grid container spacing={3}>
//           {/* <Grid item lg={8} md={8} sm={12} xs={12}> */}
//           {/* <StatCards /> */}
//           {/* <StatCards2 /> */}

//           <TopSellingTable
//             data={data}
//             refresh={refresh}
//             setRefresh={setRefresh}
//           />

//           {/* <H4>Ongoing Projects</H4> */}
//           {/* <RowCards /> */}
//           {/* </Grid> */}

//           {/* <Grid item lg={4} md={4} sm={12} xs={12}> */}
//           {/* <UpgradeCard /> */}
//           {/* </Grid> */}
//         </Grid>
//       </ContentBox>
//     </Fragment>
//   );
// }
import React, { Fragment, useEffect, useState } from "react";
import { 
  Card, 
  Grid, 
  styled, 
  useTheme, 
  TextField, 
  Button, 
  Pagination, 
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import TopSellingTable from "./shared/TopSellingTable";
import launchapadServices from "services/launchapadServices.tsx";
import useAuth from "app/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const SearchBox = styled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
});

const FilterBox = styled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
  gap: "20px",
});

const LoaderWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
});

export default function ApplyLaunchpad() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, [page, limit, search, refresh, paymentFilter, approvalFilter]);

  const fetchData = () => {
    setLoading(true);
    launchapadServices
      .getAll(page, limit, search, paymentFilter, approvalFilter)
      .then((response) => {
        setData(response.data[0].data);
        setTotalPages(Math.ceil(response.data[0].metadata[0].total / limit));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePaymentFilterChange = (event) => {
    setPaymentFilter(event.target.value);
    setPage(1);
  };

  const handleApprovalFilterChange = (event) => {
    setApprovalFilter(event.target.value);
    setPage(1);
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SearchBox>
              <TextField
                label="Search"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                style={{ marginRight: '10px' }}
              />
              <Button variant="contained" onClick={() => setPage(1)}>
                Search
              </Button>
            </SearchBox>
           
            {loading ? (
              <LoaderWrapper>
                <CircularProgress />
              </LoaderWrapper>
            ) : (
              <>
                <TopSellingTable
                  data={data}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  paymentFilter={paymentFilter}
                  approvalFilter={approvalFilter}
                  setPaymentFilter={setPaymentFilter}
                  setApprovalFilter={setApprovalFilter}
                  handleApprovalFilterChange={handleApprovalFilterChange}
                  handlePaymentFilterChange={handlePaymentFilterChange}
                />
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                />
              </>
            )}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
}