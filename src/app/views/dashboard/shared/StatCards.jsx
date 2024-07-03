import {React, useEffect, useState} from "react";
import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import { AttachMoney, Group, ArrowRightAlt } from "@mui/icons-material";
import { Small } from "app/components/Typography";
import userServices from "services/userServices.tsx";
import useAuth from "app/hooks/useAuth";
import { Link } from "react-router-dom";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": { opacity: 0.6, fontSize: "44px", color: theme.palette.primary.main }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));

export default function StatCards() {
  const [totalUsers, setTotalUsers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    userServices.getTotalUsers(user?.role).then((res) => {
      console.log(res);
      setTotalUsers(res.data);
    });
  }
  , []);

  console.log("totalUsers", totalUsers);






  const cardList = [
    { name: "Total Users", amount: totalUsers || 0, Icon: Group, navigate: "/users" },
    { name: "This week Sales", amount: "$80,500", Icon: AttachMoney, navigate: "/sales" }
    // { name: "This month Sales", amount: "$200,000", Icon: AttachMoney }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name, navigate }) => (
        <Grid item xs={12} md={6} key={name}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon" />

              <Box ml="12px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton>
                {/* <ArrowRightAlt /> */}
                <Link to={navigate}>
                  <ArrowRightAlt />
                </Link>
              </IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
