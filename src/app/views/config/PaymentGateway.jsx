import React, { useState } from "react";
import { Card, Grid, Box, styled, useTheme, Button } from "@mui/material";
import { Span } from "app/components/Typography";
import Breadcrumb from "app/components/Breadcrumb";
import TextField from "@mui/material/TextField";

// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

const PaymentGateway = () => {
  const theme = useTheme();
  const [info, setInfo] = useState("");

  const handleChange = (event) => {
    event.persist();
    setInfo(event.target.value);
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Config", path: "/config" }, { name: "Payment Gateway" }]}
        />
      </Box>

      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Span fontSize="18px" fontWeight="700">
              Payment Gateway
            </Span>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="Stripe API Key"
              multiline
              rows={1}
              value={info}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
export default PaymentGateway;
