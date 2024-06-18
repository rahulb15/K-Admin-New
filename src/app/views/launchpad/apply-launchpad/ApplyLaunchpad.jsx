import { Fragment } from "react";
import { Card, Grid, styled, useTheme } from "@mui/material";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import Campaigns from "./shared/Campaigns";
import StatCards2 from "./shared/StatCards2";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/NotificationList";
import TopSellingTable from "./shared/TopSellingTable";
import launchapadServices from "services/launchapadServices.tsx";
import useAuth from "app/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize"
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary
}));

export default function ApplyLaunchpad() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (user?.role === "superadmin") {
      console.log("superadmin");
    } else if (user?.role === "admin") {
      navigate("/dashboard");
    }
  }, [user?.role]);

  useEffect(() => {
    launchapadServices
      .getAll(page, limit, search)
      .then((response) => {
        setData(response.data[0].data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, limit, search, refresh]);

  console.log(data);

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          {/* <Grid item lg={8} md={8} sm={12} xs={12}> */}
            {/* <StatCards /> */}
            {/* <StatCards2 /> */}

            <TopSellingTable data={data} refresh={refresh} setRefresh={setRefresh} />

            {/* <H4>Ongoing Projects</H4> */}
            {/* <RowCards /> */}
          {/* </Grid> */}

          {/* <Grid item lg={4} md={4} sm={12} xs={12}> */}
          {/* <UpgradeCard /> */}
          {/* </Grid> */}
        </Grid>
      </ContentBox>
    </Fragment>
  );
}
