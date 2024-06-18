// import { Edit } from "@mui/icons-material";
import { Done, Close, Visibility } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  useTheme,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Grid
} from "@mui/material";
import UpgradeCard from "../shared/NotificationList";
import { Paragraph } from "app/components/Typography";
import launchapadServices from "services/launchapadServices.tsx";
import paymentServices from "services/paymentServices.tsx";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
}));

export default function TopSellingTable(props) {
  console.log("🚀 ~ TopSellingTable ~ props:", props);
  // data: [
  //   {
  //     _id: '66631e49257cac6d73591ac2',
  //     collectionName: 'Monkey',
  //     creatorName: 'rahul',
  //     creatorWallet: 'kjhjjjhhhjhjhj',
  //     creatorEmail: 'rahul@yopmil.com',
  //     projectDescription: 'sdfsd',
  //     projectCategory: 'art',
  //     expectedLaunchDate: '2024-06',
  //     createdAt: '2024-06-07T14:50:49.491Z',
  //     updatedAt: '2024-06-07T14:50:49.491Z',
  //     __v: 0,
  //     collectionBannerImage: 'C:\fakepath\wallet.png',
  //     collectionCoverImage: 'C:\fakepath\wallet.png',
  //     contractType: 'ng',
  //     mintPrice: '1',
  //     mintStartDate: '2024-06-07',
  //     mintStartTime: '20:25',
  //     royaltyPercentage: '1',
  //     totalSupply: '1'
  //   }
  // ]
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const [transactionData, setTransactionData] = useState({});

  const onAccept = (id) => {
    console.log("🚀 ~ onAccept ~ id", id);
    launchapadServices
      .approveLaunchpad(id)
      .then((response) => {
        console.log(response);
        props.setRefresh(!props.refresh);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onReject = (id) => {
    console.log("🚀 ~ onReject ~ id", id);
    launchapadServices
      .rejectLaunchpad(id)
      .then((response) => {
        console.log(response);
        props.setRefresh(!props.refresh);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClickRow = (id) => {
    console.log("🚀 ~ onClickRow ~ id", id);
    //getById
    paymentServices
      .getById(id)
      .then((response) => {
        console.log(response);
        setTransactionData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("🚀 ~ TopSellingTable ~ transactionData", transactionData);




  return (
    <>
              <Grid item lg={8} md={8} sm={12} xs={12}>

      <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
        <CardHeader>
          <Title>Launchpad Applications List</Title>
          <Select size="small" defaultValue="paid" variant="outlined">
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </CardHeader>

        <Box overflow="auto">
          <ProductTable>
            <TableHead>
              <TableRow>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Cover
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Banner
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 3 }}>
                  Name
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Creator
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  wallet
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Email
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Category
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  Launch Date
                </TableCell>
                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Payment Status
                </TableCell>
                <TableCell colSpan={1} sx={{ px: 0 }}>
                  View
                </TableCell>

                <TableCell colSpan={2} sx={{ px: 0 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* {nftsList.map((nft, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Avatar src={nft.imgUrl} />
                    <Paragraph>{nft.name}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  ${nft.price > 999 ? (nft.price / 1000).toFixed(1) + "k" : nft.price}
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {product.available ? (
                    product.available < 20 ? (
                      <Small bgcolor={bgSecondary}>{product.available} available</Small>
                    ) : (
                      <Small bgcolor={bgPrimary}>in stock</Small>
                    )
                  ) : (
                    <Small bgcolor={bgError}>out of stock</Small>
                  )}
                </TableCell>
                <TableCell align="left" colSpan={2} sx={{ px: 0 }}>
                  {nft.available}
                </TableCell>

                <TableCell sx={{ px: 0 }} colSpan={1}>
                  <IconButton>
                    <Edit color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))} */}

              {props?.data?.map(
                (product, index) => (
                  console.log("🚀 ~ TopSellingTable ~ product", product),
                  (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => onClickRow(product._id)}
                      sx={{ cursor: "pointer", "&:hover": { background: "#ddebf8" } }}
                    >
                      <TableCell colSpan={1} sx={{ px: 0 }}>
                        <Avatar src={product.collectionCoverImage} />
                      </TableCell>
                      <TableCell colSpan={1} sx={{ px: 0 }}>
                        <Avatar src={product.collectionBannerImage} />
                      </TableCell>
                      <TableCell colSpan={2} sx={{ px: 3 }}>
                        {product.collectionName}
                      </TableCell>

                      <TableCell colSpan={2} sx={{ px: 0 }}>
                        {product.creatorName}
                      </TableCell>

                      <TableCell colSpan={2} sx={{ px: 0 }}>
                        {product.creatorWallet}
                      </TableCell>
                      <TableCell colSpan={2} sx={{ px: 0 }}>
                        {product.creatorEmail}
                      </TableCell>
                      <TableCell colSpan={2} sx={{ px: 0 }}>
                        {product.projectCategory}
                      </TableCell>
                      <TableCell colSpan={1} sx={{ px: 0 }}>
                        {product.expectedLaunchDate}
                      </TableCell>
                      <TableCell colSpan={2} sx={{ px: 0 }}>
                        {product.isPaid ? (
                          <Small bgcolor={bgPrimary}>Paid</Small>
                        ) : (
                          <Small bgcolor={bgError}>Not Paid</Small>
                        )}
                      </TableCell>
                      <TableCell colSpan={1} sx={{ px: 0 }}>
                        <IconButton>
                          <Visibility color="primary" />
                        </IconButton>
                      </TableCell>

                      <TableCell colSpan={2} sx={{ px: 0 }}>
                        {/* //approve reject */}
                        {product.isApproved === false && product.isRejected === false ? (
                          <>
                            <IconButton onClick={() => onAccept(product._id)}>
                              <Done color="primary" />
                            </IconButton>
                            {/* //gap */}
                            &nbsp; &nbsp; &nbsp;
                            <IconButton onClick={() => onReject(product._id)}>
                              <Close color="error" />
                            </IconButton>
                          </>
                        ) : (
                          (product.isApproved === true && (
                            <Small bgcolor={bgPrimary}>Approved</Small>
                          )) ||
                          (product.isRejected === true && <Small bgcolor={bgError}>Rejected</Small>)
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </ProductTable>
        </Box>
      </Card>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <UpgradeCard transactionData={transactionData} />
      </Grid>
    </>
  );
}

const nftsList = [
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 1",
    price: 100,
    available: 15
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 2",
    price: 1500,
    available: 30
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 3",
    price: 1900,
    available: 35
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 4",
    price: 100,
    available: 0
  },
  {
    imgUrl: "/assets/nfts/nft1.png",
    name: "NFT 5",
    price: 1190,
    available: 5
  }
];
