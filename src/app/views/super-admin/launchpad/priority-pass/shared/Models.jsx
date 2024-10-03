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
  CircularProgress,
} from "@mui/material";
import { useSyncWithNgMutation } from "services/prioritypass.service";
import useAuth from "app/hooks/useAuth";
import nftServices from "services/nftServices.tsx";
import Swal from "sweetalert2";

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
  const [syncWithNg, { isLoading, error }] = useSyncWithNgMutation();

  const toggleSelection = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((selectedId) => selectedId !== id)
        : [...prevIds, id]
    );
  };

  const handleSyncWithNg = async () => {
    // const syncColName = data[0]["collection-name"];
    const syncColName = "Priority Pass";
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

      // const response = {
      //   data: {
      //     gas: 45184,
      //     result: {
      //       status: "success",
      //       data: ["t:muTMGBxKvLRC8X8wVDciD-gNzlP73u7CtY95HYpgD6o"],
      //     },
      //     reqKey: "FTfDJQvHwM-_TRwPTTq7ud9mol6QohpAvDGMo5QF9TM",
      //     logs: "CeRGt08MXuGxhpJABw41vjLLJz-QtKk_if-F4b319TY",
      //     events:
      //       Array(6)[
      //         ({
      //           params: [
      //             "k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf",
      //             "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
      //             0.00045184,
      //           ],
      //           name: "TRANSFER",
      //           module: { namespace: null, name: "coin" },
      //           moduleHash: "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s",
      //         },
      //         {
      //           params: [
      //             "c_priority_pass_001_xJlF0Q0YUwQ9ReZ3NIEUPr8zGpJo2LtVMBWW_MSeEqA",
      //             "t:muTMGBxKvLRC8X8wVDciD-gNzlP73u7CtY95HYpgD6o",
      //           ],
      //           name: "ADD-TO-COLLECTION",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "policy-collection",
      //           },
      //           moduleHash: "OOsTKpL4F85MH-rq_kFvn3bZ4id-pJMP5ZSUrZTF46E",
      //         },
      //         {
      //           params: [
      //             "t:muTMGBxKvLRC8X8wVDciD-gNzlP73u7CtY95HYpgD6o",
      //             "https://arkade-prod.s3.amazonaws.com/looney-bulls-airdrop-NG-metadata/32.json",
      //             { int: 0 },
      //             [
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-instant-mint",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-collection",
      //             ],
      //           ],
      //           name: "TOKEN-CREATE",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "ledger",
      //           },
      //           moduleHash: "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU",
      //         },
      //         {
      //           params: [
      //             "t:muTMGBxKvLRC8X8wVDciD-gNzlP73u7CtY95HYpgD6o",
      //             "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
      //             1,
      //           ],
      //           name: "MINT",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "ledger",
      //           },
      //           moduleHash: "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU",
      //         },
      //         {
      //           params: ["t:muTMGBxKvLRC8X8wVDciD-gNzlP73u7CtY95HYpgD6o", 1],
      //           name: "SUPPLY",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "ledger",
      //           },
      //           moduleHash: "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU",
      //         },
      //         {
      //           params: [
      //             "t:muTMGBxKvLRC8X8wVDciD-gNzlP73u7CtY95HYpgD6o",
      //             1,
      //             { account: "", current: 0, previous: 0 },
      //             {
      //               account:
      //                 "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
      //               current: 1,
      //               previous: 0,
      //             },
      //           ],
      //           name: "RECONCILE",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "ledger",
      //           },
      //           moduleHash: "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU",
      //         })
      //       ],
      //     metaData: {
      //       blockTime: 1722841972514494,
      //       prevBlockHash: "6zkfdY9M9UnSyiXmF9MZrlt8rMhHmefXuHRM3fqffLA",
      //       blockHash: "q0sQDOm6e0R0ePpmVA0PVm4sxqBvOkxPZoYnHV029wM",
      //       blockHeight: 4528430,
      //     },
      //     continuation: null,
      //     txId: 6333654,
      //   },
      // };

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
        // {
        //   status: 'success',
        //   message: 'Updated',
        //   descripti
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "NFT created successfully",
          });

          handleClose();
        } else {
          console.log("Error in creating NFT");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `${
              result?.message || "Failed to create NFT"
            }. Please try again.`,
          });
          handleClose();
        }
        // handleClose();
      } else {
        console.log("Error in syncing with NG");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${
            response?.data?.result?.message || "Failed to sync with NG"
          }. Please try again.`,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error syncing:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${
          error?.message || "Failed to sync with NG"
        }. Please try again.`,
      });

      handleClose();
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
          <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
            Close
          </Button>
          {/* <Button
            onClick={handleSyncWithNg}
            variant="contained"
            color="primary"
            disabled={selectedIds.length === 0}
          >
            Bulk Sync ({selectedIds.length})
          </Button> */}

          <Button
            onClick={handleSyncWithNg}
            variant="contained"
            color="primary"
            disabled={selectedIds.length === 0 || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              `Bulk Sync (${selectedIds.length})`
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export { UnrevealedTokensModal };
