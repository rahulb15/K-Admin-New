import { Box, styled } from "@mui/material";
import UsersTable from "./usersTable";
import { Breadcrumb, SimpleCard } from "app/components";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function AppTable() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Users", path: "/users" }, { name: "Users" }]} />
      </Box>

      <SimpleCard title="Users Table">
        <UsersTable />
      </SimpleCard>
    </Container>
  );
}
