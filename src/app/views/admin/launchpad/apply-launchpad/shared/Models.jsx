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
  const sampleData = 
  [
    {
      'collection-name': 'monkeyaz8',
      guard: {
        pred: 'keys-all',
        keys: [ 'd1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe' ]
      },
      account: 'k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe',
      accountId: { int: 4 },
      marmToken: '',
      revealed: false
    }
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

      // {
      //   data: {
      //     gas: 4730,
      //     result: {
      //       status: 'success',
      //       data: [ 't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q' ]
      //     },
      //     reqKey: 'Pj1Sq8NQAns42C7W1L6i1gwY08Kov83GT7C7Yd29n0E',
      //     logs: 'SneY3SHYwBZWdxMEyEEe8AEWRU_QCIW0WUeHwxp6rdw',
      //     events: Array(6) [
      //       {
      //         params: [
      //           'k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe', 'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
      //           0.0000473
      //         ],
      //         name: 'TRANSFER',
      //         module: { namespace: null, name: 'coin' },
      //         moduleHash: 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s'
      //       },
      //       {
      //         params: [
      //           'c_monkeyaz8_8-1Q9nui6dpUpAxaWRfqQoJOhbWIiL1NMl1u_UxTsI8', 't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q'
      //         ],
      //         name: 'ADD-TO-COLLECTION',
      //         module: {
      //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
      //           name: 'policy-collection'
      //         },
      //         moduleHash: 'OOsTKpL4F85MH-rq_kFvn3bZ4id-pJMP5ZSUrZTF46E'
      //       },
      //       {
      //         params: [
      //           't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q', 'ipfs://QmRPqajKGNCtKyA7oE5Lx3H8YijyfopS8oaVcdZCSUDyEP',
      //           { int: 0 },
      //           [
      //             'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-instant-mint', 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-collection',
      //             'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-marketplace', 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db.policy-fixed-sale'
      //           ]
      //         ],
      //         name: 'TOKEN-CREATE',
      //         module: {
      //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
      //           name: 'ledger'
      //         },
      //         moduleHash: 'u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU'
      //       },
      //       {
      //         params: [
      //           't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q', 'k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe',
      //           1
      //         ],
      //         name: 'MINT',
      //         module: {
      //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
      //           name: 'ledger'
      //         },
      //         moduleHash: 'u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU'
      //       },
      //       {
      //         params: [ 't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q', 1 ],
      //         name: 'SUPPLY',
      //         module: {
      //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
      //           name: 'ledger'
      //         },
      //         moduleHash: 'u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU'
      //       },
      //       {
      //         params: [
      //           't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q', 1, { account: '', current: 0, previous: 0 },
      //           {
      //             account:
      //               'k:d1d47937b0ec42efa859048d0fb5f51707639ddad991e58ae9efcff5f4ff9dbe',
      //             current: 1,
      //             previous: 0
      //           }
      //         ],
      //         name: 'RECONCILE',
      //         module: {
      //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
      //           name: 'ledger'
      //         },
      //         moduleHash: 'u3XErq-f8U12FRw8T_MdEZo7kOVzoWsowH89HgLzTFU'
      //       }
      //     ],
      //     metaData: {
      //       blockTime: 1721982707449700,
      //       prevBlockHash: 'GD1QfDhZUsi3hFSSXEZEhvSaHmDtL4uWu3qnzJ0rHak',
      //       blockHash: 'r931ltuLSRKHQRqxZcuixE9h_YJX2ZjUpwZTCwI0h1U',
      //       blockHeight: 4499804
      //     },
      //     continuation: null,
      //     txId: 6300400
      //   }
      // }

      if (response.data.result.status === "success") {
        // createNFT
        const data = {
          collectionName: syncColName,
          tokenId: response.data.result.data[0],
          wallet: user?.walletName,
        };

        // const data = {
        //   collectionName: syncColName,
        //   tokenId: 't:VjGG8oUD4t_Z73IrS8dAKGeuxV_A-4T0IzYBaDNiP3Q',
        //   wallet: user?.walletName,
        // };
        console.log("data", data);
        const createNFT = await nftServices.createNFT(data);
        console.log("createNFT", createNFT);
        if (createNFT) {
          handleClose();
        } else {
          console.log("Error in creating NFT");
        }
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
