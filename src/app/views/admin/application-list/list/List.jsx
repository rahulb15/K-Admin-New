import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Pagination,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";
import { Done, Close } from "@mui/icons-material";
import Swal from "sweetalert2";
import launchapadServices from "services/launchapadServices.tsx";
import {
  useAddPresaleAccountsMutation,
  useAddWlAccountsMutation,
} from "services/launchpad.service";
import useAuth from "app/hooks/useAuth";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const CardHeader = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
}));

const FilterBox = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "20px",
});

const LoaderWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
});

export default function StageApplicationsAdmin() {
  const { user } = useAuth();
  const [addPresaleAccounts] = useAddPresaleAccountsMutation();
  const [addWlAccounts] = useAddWlAccountsMutation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit] = useState(10);

  useEffect(() => {
    fetchApplications();
  }, [page, search, stageFilter, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await launchapadServices.getApplications({
        page: page,
        limit: limit,
        search: search,
        stage: stageFilter,
        status: statusFilter,
      });

      console.log(data);

      setApplications(data.data.data);
      setTotalPages(Math.ceil(data.data.total / limit));
    } catch (error) {
      console.error("Error fetching applications:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load applications",
      });
    }
    setLoading(false);
  };

  const handleBlockchainOperation = async (application) => {
    // Convert the wallet address to array format as expected by the blockchain functions
    const accounts = [application.walletAddress];

    try {
      const walletType =
        user?.walletName === "Ecko Wallet"
          ? "ecko"
          : user?.walletName === "Chainweaver"
          ? "CW"
          : user?.walletName;

      const params = {
        collectionName: application.collectionName,
        accounts,
        wallet: walletType,
      };

      let result;
      if (application.stage === "presale") {
        result = await addPresaleAccounts(params).unwrap();
      } else if (application.stage === "whitelist") {
        result = await addWlAccounts(params).unwrap();
      }

      if (result.error) {
        throw new Error(result.error.message || "Blockchain operation failed");
      }

      return true;
    } catch (error) {
      console.error("Blockchain operation error:", error);
      throw error;
    }
  };

  const handleApprove = async (application) => {
    const result = await Swal.fire({
      title: `Approve ${application.collectionName}'s ${application.stage} application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        // First, attempt the blockchain operation
        await handleBlockchainOperation(application);

        const data = await launchapadServices.applicationApproval({
          id: application._id,
        });

        console.log(data);

        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Application Approved",
            text: `Successfully approved ${application.stage} application`,
          });
          fetchApplications();
        }
      } catch (error) {
        console.error("Error approving application:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to approve application",
        });
      }
      setLoading(false);
    }
  };

  const handleReject = async (application) => {
    const result = await Swal.fire({
      title: `Reject ${application.collectionName}'s ${application.stage} application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const data = await launchapadServices.applicationRejection({
          id: application._id,
        });

        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Application Rejected",
            text: `Successfully rejected ${application.stage} application`,
          });
          fetchApplications();
        }
      } catch (error) {
        console.error("Error rejecting application:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reject application",
        });
      }
      setLoading(false);
    }
  };

  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader>
              <h2>Stage Applications</h2>
              <FilterBox>
                <TextField
                  label="Search Collection"
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FormControl size="small" style={{ minWidth: 120 }}>
                  <InputLabel>Stage</InputLabel>
                  <Select
                    value={stageFilter}
                    label="Stage"
                    onChange={(e) => setStageFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Stages</MenuItem>
                    <MenuItem value="presale">Presale</MenuItem>
                    <MenuItem value="whitelist">Whitelist</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" style={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </FilterBox>
            </CardHeader>

            {loading ? (
              <LoaderWrapper>
                <CircularProgress />
              </LoaderWrapper>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Collection Name</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Wallet Address</TableCell>
                      <TableCell>Applied On</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell>{app.collectionName}</TableCell>
                        <TableCell>
                          <Chip
                            label={app.stage.toUpperCase()}
                            color={
                              app.stage === "presale" ? "primary" : "secondary"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{app.walletAddress}</TableCell>
                        <TableCell>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={app.status.toUpperCase()}
                            color={
                              app.status === "approved"
                                ? "success"
                                : app.status === "rejected"
                                ? "error"
                                : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {app.status === "pending" && (
                            <>
                              <IconButton
                                color="success"
                                onClick={() => handleApprove(app)}
                                size="small"
                              >
                                <Done />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleReject(app)}
                                size="small"
                              >
                                <Close />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                  />
                </div>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </ContentBox>
  );
}
