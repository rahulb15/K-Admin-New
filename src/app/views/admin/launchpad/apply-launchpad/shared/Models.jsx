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

    //   {
    //     "gas": 4756,
    //     "result": {
    //         "status": "success",
    //         "data": [
    //             "t:xUmWBEXxw7nQ8XCBxibx7PwBwHTfu9LWAx_Z7x0TJJc"
    //         ]
    //     },
    //     "reqKey": "WjrHQ3EqVjd1eC1JkpuSvRq8ad-5jk54UsjE8v4nRes",
    //     "logs": "xunkhU3YmU31C3zifXAI9RoFuvZhU4cOAy7-wnH2Vlo",
    //     "events": [
    //         {
    //             "params": [
    //                 "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
    //                 "k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",
    //                 0.00004756
    //             ],
    //             "name": "TRANSFER",
    //             "module": {
    //                 "namespace": null,
    //                 "name": "coin"
    //             },
    //             "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"
    //         },
    //         {
    //             "params": [
    //                 "c_monkeyaz14_Qn1d3vjQIbMqXlQclpaqbQ3eV0qkgmYkiBZj919UwnE",
    //                 "t:xUmWBEXxw7nQ8XCBxibx7PwBwHTfu9LWAx_Z7x0TJJc"
    //             ],
    //             "name": "ADD-TO-COLLECTION",
    //             "module": {
    //                 "namespace": "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
    //                 "name": "policy-collection"
    //             },
    //             "moduleHash": "OOsTKpL4F85MH-rq_kFvn3bZ4id-pJMP5ZSUrZTF46E"
    //         },
    //         {
    //             "params": [
    //                 "t:xUmWBEXxw7nQ8XCBxibx7PwBwHTfu9LWAx_Z7x0TJJc",
    //                 "ipfs://QmZkL6KYygEKeWfwSfcKBqXc8SgXJF2qPjczzD7p1x5KmC",
    //                 {
    //                     "int": 0
    //                 },
    //                 [
    //                     "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-collection",
    //                     "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-instant-mint",
    //                     "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-marketplace",
    //                     "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-fixed-sale"
    //                 ]
    //             ],
    //             "name": "TOKEN-CREATE",
    //             "module": {
    //                 "namespace": "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
    //                 "name": "ledger"
    //             },
    //             "moduleHash": "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU"
    //         },
    //         {
    //             "params": [
    //                 "t:xUmWBEXxw7nQ8XCBxibx7PwBwHTfu9LWAx_Z7x0TJJc",
    //                 "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
    //                 1
    //             ],
    //             "name": "MINT",
    //             "module": {
    //                 "namespace": "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
    //                 "name": "ledger"
    //             },
    //             "moduleHash": "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU"
    //         },
    //         {
    //             "params": [
    //                 "t:xUmWBEXxw7nQ8XCBxibx7PwBwHTfu9LWAx_Z7x0TJJc",
    //                 1
    //             ],
    //             "name": "SUPPLY",
    //             "module": {
    //                 "namespace": "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
    //                 "name": "ledger"
    //             },
    //             "moduleHash": "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU"
    //         },
    //         {
    //             "params": [
    //                 "t:xUmWBEXxw7nQ8XCBxibx7PwBwHTfu9LWAx_Z7x0TJJc",
    //                 1,
    //                 {
    //                     "account": "",
    //                     "current": 0,
    //                     "previous": 0
    //                 },
    //                 {
    //                     "account": "k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe",
    //                     "current": 1,
    //                     "previous": 0
    //                 }
    //             ],
    //             "name": "RECONCILE",
    //             "module": {
    //                 "namespace": "n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db",
    //                 "name": "ledger"
    //             },
    //             "moduleHash": "u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU"
    //         }
    //     ],
    //     "metaData": {
    //         "blockTime": 1722842450152826,
    //         "prevBlockHash": "U146WmcYUnicF8iCC39DQ7BvqF7KGl-z1T1JCdC0UoU",
    //         "blockHash": "PZiGN0HVDmXiFOTML6p2oXpoGasODR4PWPe1YSj4hMg",
    //         "blockHeight": 4528446
    //     },
    //     "continuation": null,
    //     "txId": 6333679
    // }



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
