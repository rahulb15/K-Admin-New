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

      // const response = {
      //   data: {
      //     gas: 9310,
      //     result: {
      //       status: "success",
      //       data: [
      //         "t:6wb9Iw3tS7LDFXq1aOqMJ7L5kBSa58EdnfQG0Dps8Wk",
      //         "t:rrh0qZKVH23Vh3iWPINRo8Jcgp_7ChWgGK1mdhMgbVk",
      //       ],
      //     },
      //     reqKey: "egAi1WM_xb7otL0SF07a3deAMY3MtKPJ-2-7_06o4Do",
      //     logs: "lzTg5GKU_p1TWDxwleeBfbxbF2svX666NSOPdd0YZVU",
      //     events:
      //       Array(11)[
      //         ({
      //           params: [
      //             "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
      //             "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
      //             0.0000931,
      //           ],
      //           name: "TRANSFER",
      //           module: { namespace: null, name: "coin" },
      //           moduleHash: "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s",
      //         },
      //         {
      //           params: [
      //             "c_monkeyaz9_jFJXachO_oLhg80VTD-yVTU749uITjIjJZkKIlD-Wbg",
      //             "t:6wb9Iw3tS7LDFXq1aOqMJ7L5kBSa58EdnfQG0Dps8Wk",
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
      //             "t:6wb9Iw3tS7LDFXq1aOqMJ7L5kBSa58EdnfQG0Dps8Wk",
      //             "ipfs://bafkreicm7uen4kb3y7nwoexrsx7sre6ckfmtbfufslidbesfsbzfi2lguy",
      //             { int: 0 },
      //             [
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-instant-mint",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-collection",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-marketplace",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-fixed-sale",
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
      //             "t:6wb9Iw3tS7LDFXq1aOqMJ7L5kBSa58EdnfQG0Dps8Wk",
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
      //           params: ["t:6wb9Iw3tS7LDFXq1aOqMJ7L5kBSa58EdnfQG0Dps8Wk", 1],
      //           name: "SUPPLY",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "ledger",
      //           },
      //           moduleHash: "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU",
      //         },
      //         {
      //           params: [
      //             "t:6wb9Iw3tS7LDFXq1aOqMJ7L5kBSa58EdnfQG0Dps8Wk",
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
      //         },
      //         {
      //           params: [
      //             "c_monkeyaz9_jFJXachO_oLhg80VTD-yVTU749uITjIjJZkKIlD-Wbg",
      //             "t:rrh0qZKVH23Vh3iWPINRo8Jcgp_7ChWgGK1mdhMgbVk",
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
      //             "t:rrh0qZKVH23Vh3iWPINRo8Jcgp_7ChWgGK1mdhMgbVk",
      //             "ipfs://bafkreifabzsykcr23o2xyzovys6olid63oaxrb3i3byzz32caklymlvm5u",
      //             { int: 0 },
      //             [
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-instant-mint",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-collection",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-marketplace",
      //               "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-fixed-sale",
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
      //             "t:rrh0qZKVH23Vh3iWPINRo8Jcgp_7ChWgGK1mdhMgbVk",
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
      //           params: ["t:rrh0qZKVH23Vh3iWPINRo8Jcgp_7ChWgGK1mdhMgbVk", 1],
      //           name: "SUPPLY",
      //           module: {
      //             namespace: "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
      //             name: "ledger",
      //           },
      //           moduleHash: "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU",
      //         },
      //         {
      //           params: [
      //             "t:rrh0qZKVH23Vh3iWPINRo8Jcgp_7ChWgGK1mdhMgbVk",
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
      //       blockTime: 1722362996660645,
      //       prevBlockHash: "PJnN1jXODlL8OhbXyEaoi3mvGoWQtbNYNaVK0Hlc8zI",
      //       blockHash: "qokEZHGunff00757q14s_V8XmhLiQn-wyZbQetOGuXA",
      //       blockHeight: 4512476,
      //     },
      //     continuation: null,
      //     txId: 6315536,
      //   },
      // };

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
