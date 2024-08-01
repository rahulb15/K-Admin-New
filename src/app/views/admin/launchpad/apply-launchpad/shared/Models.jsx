import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { useSyncWithNgMutation } from "services/launchpad.service";
import useAuth from "app/hooks/useAuth";
import nftServices from "services/nftServices.tsx";

const UnrevealedTokensModal = ({ open, handleClose, data }) => {
  const { login, user } = useAuth();
  const sampleData = [
    {
      "collection-name": "monkeyaz8",
      guard: {
        pred: "keys-all",
        keys: [
          "d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
        ],
      },
      account:
        "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
      accountId: { int: 4 },
      marmToken: "",
      revealed: false,
    },
  ];

  console.log("data", data);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [syncWithNg] = useSyncWithNgMutation();

  const toggleSelection = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((selectedId) => selectedId !== id)
        : [...prevIds, id]
    );
  };

  const handleSyncWithNg = async () => {
    const syncColName = data[0]["collection-name"];
    console.log("syncColName", syncColName);
    try {
      const response = await syncWithNg({
        syncColName: syncColName,
        syncTkns: selectedIds.sort((a, b) => a - b).join(" "), // Sort and convert to space-separated string
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });
      console.log("response", response);

      if (response.data.result.status === "success") {
        // createNFT
        const data = {
          collectionName: syncColName,
          tokenId: response.data.result.data,
          wallet: user?.walletAddress,
        };
        console.log("data", data);
        const result = await nftServices.updateNFT(data);
        console.log("result", result);
        if (result) {
          handleClose();
        } else {
          console.log("Error in creating NFT");
        }
        // handleClose();
      } else {
        console.log("Error in syncing with NG");
      }
    } catch (error) {
      console.error("Error syncing:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Unrevealed Tokens</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Collection Name</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Account ID</TableCell>
                <TableCell>Revealed</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.accountId.int}>
                  <TableCell>{row["collection-name"]}</TableCell>
                  <TableCell>{row.account}</TableCell>
                  <TableCell>{row.accountId.int}</TableCell>
                  <TableCell>{row.revealed ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <button
                      style={{
                        backgroundColor: selectedIds.includes(row.accountId.int)
                          ? "blue"
                          : "white",
                        color: selectedIds.includes(row.accountId.int)
                          ? "white"
                          : "black",
                        border: "1px solid blue",
                        padding: "5px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleSelection(row.accountId.int)}
                    >
                      {selectedIds.includes(row.accountId.int)
                        ? "Selected"
                        : "Select"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleSyncWithNg}
            variant="contained"
            color="primary"
            disabled={selectedIds.length === 0}
          >
            Bulk Sync ({selectedIds.length})
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export { UnrevealedTokensModal };
