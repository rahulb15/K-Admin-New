import { useState, useEffect } from "react";
import {
  Box,
  Icon,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination
} from "@mui/material";
import userServices from "services/userServices.tsx";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState([]);

  //   const handleChangePage = (_, newPage) => {
  //     setPage(newPage);
  //   };

  //   const handleChangeRowsPerPage = (event) => {
  //     setRowsPerPage(+event.target.value);
  //     setPage(0);
  //   };

  const fetchUserList = async () => {
    try {
      const response = await userServices.getUsers(page, rowsPerPage, search);
      console.log(response, "response");
      setUserList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  console.log(userList, "userList");

  //   [
  //     {
  //         "_id": "6639d2e1452d8c20b1954a62",
  //         "name": "rahul",
  //         "email": "marvelengineer09@gmail.com",
  //         "bio": "vfdgvfdgff",
  //         "gender": "male",
  //         "walletAddress": "k:a1a5cc2c40ce6e96906426314998cd1c639f6a24ea96dc512d369d2e6dcb170a",
  //         "walletBalance": 0,
  //         "walletName": "Ecko Wallet",
  //         "isWalletConnected": true,
  //         "coverImage": "https://res.cloudinary.com/dh187xay8/image/upload/v1715432505/cover/coverImage-1715432501390-532854250pexels-vincent-pelletier-113252-908713.jpg",
  //         "profileImage": "https://res.cloudinary.com/dh187xay8/image/upload/v1715784930/profile/profileImage-1715784920646-232716586happy-face-1.png",
  //         "role": "user",
  //         "status": "active",
  //         "verified": false,
  //         "followers": [],
  //         "following": [],
  //         "posts": [],
  //         "comments": [],
  //         "likes": [],
  //         "address": {
  //             "address1": "",
  //             "address2": "",
  //             "country": {
  //                 "id": 101,
  //                 "name": "India",
  //                 "iso3": "IND",
  //                 "iso2": "IN",
  //                 "numeric_code": "356",
  //                 "phone_code": 91,
  //                 "capital": "New Delhi",
  //                 "currency": "INR",
  //                 "currency_name": "Indian rupee",
  //                 "currency_symbol": "₹",
  //                 "tld": ".in",
  //                 "native": "भारत",
  //                 "region": "Asia",
  //                 "subregion": "Southern Asia",
  //                 "latitude": "20.00000000",
  //                 "longitude": "77.00000000",
  //                 "emoji": "🇮🇳"
  //             },
  //             "state": {
  //                 "id": 4022,
  //                 "name": "Uttar Pradesh",
  //                 "state_code": "UP"
  //             },
  //             "city": {
  //                 "id": 133230,
  //                 "name": "Noida",
  //                 "latitude": "28.58000000",
  //                 "longitude": "77.33000000"
  //             },
  //             "zip": null
  //         },
  //         "phone": "09717806407",
  //         "isEmailVerified": false,
  //         "isPhoneVerified": false,
  //         "isSocialLogin": false,
  //         "isActive": true,
  //         "isDeleted": false,
  //         "createdAt": "2024-05-07T07:06:09.765Z",
  //         "updatedAt": "2024-05-15T14:57:51.603Z"
  //     },
  //     {
  //         "_id": "6639d350452d8c20b1954a67",
  //         "name": "rahul11",
  //         "email": "rahul11@yopmail.com",
  //         "walletAddress": "u:025fbb7b14b2244d36a64a24c3cf6647e5df4db3f047f3632be428a2166d9762",
  //         "walletBalance": 0,
  //         "isWalletConnected": false,
  //         "role": "user",
  //         "status": "active",
  //         "verified": false,
  //         "followers": [],
  //         "following": [],
  //         "posts": [],
  //         "comments": [],
  //         "likes": [],
  //         "isEmailVerified": false,
  //         "isPhoneVerified": false,
  //         "isSocialLogin": false,
  //         "isActive": true,
  //         "isDeleted": false,
  //         "createdAt": "2024-05-07T07:08:00.103Z",
  //         "updatedAt": "2024-05-07T07:08:00.103Z"
  //     },
  //     {
  //         "_id": "663a28cf1476956d2a31000f",
  //         "name": "Rahul Baghel",
  //         "email": "rahul.baghel1508@gmail.com",
  //         "walletAddress": "u:4dedf77c1b8d9422094f59c58e30a844290964aca305e5e564117b5ba3446c6d",
  //         "walletBalance": 0,
  //         "isWalletConnected": false,
  //         "profileImage": "https://lh3.googleusercontent.com/a/ACg8ocJL6Y-1XEvUXAvpg_0uLN3pqHzhQp_uXd7ZBdnqiu9-o33G4gDg=s96-c",
  //         "role": "user",
  //         "status": "active",
  //         "verified": false,
  //         "followers": [],
  //         "following": [],
  //         "posts": [],
  //         "comments": [],
  //         "likes": [],
  //         "socialLogin": {
  //             "google": "104260585173695498459"
  //         },
  //         "isEmailVerified": true,
  //         "isPhoneVerified": false,
  //         "isSocialLogin": true,
  //         "isActive": true,
  //         "isDeleted": false,
  //         "createdAt": "2024-05-07T13:12:47.489Z",
  //         "updatedAt": "2024-05-08T14:48:43.344Z"
  //     },
  //     {
  //         "_id": "663a32ecf9262c191e0a8df3",
  //         "name": "rahul",
  //         "email": "rahulzel@yopmail.com",
  //         "walletAddress": "k:be8f86f55b1eb1114b273709af2c39e7376a4e3eab101b4f5abe7e85088fce1a",
  //         "walletBalance": 0,
  //         "walletName": "Zelcore Wallet",
  //         "isWalletConnected": true,
  //         "role": "user",
  //         "status": "active",
  //         "verified": false,
  //         "followers": [],
  //         "following": [],
  //         "posts": [],
  //         "comments": [],
  //         "likes": [],
  //         "isEmailVerified": false,
  //         "isPhoneVerified": false,
  //         "isSocialLogin": false,
  //         "isActive": true,
  //         "isDeleted": false,
  //         "createdAt": "2024-05-07T13:55:56.397Z",
  //         "updatedAt": "2024-05-07T13:55:56.397Z"
  //     }
  // ]

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Wallet Address</TableCell>
            <TableCell align="center">Phone</TableCell>
            <TableCell align="center"> Email Verified</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {subscribarList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscriber, index) => (
              <TableRow key={index}>
                <TableCell align="left">{subscriber.name}</TableCell>
                <TableCell align="center">{subscriber.company}</TableCell>
                <TableCell align="center">{subscriber.date}</TableCell>
                <TableCell align="center">{subscriber.status}</TableCell>
                <TableCell align="center">${subscriber.amount}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <Icon color="error">close</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))} */}

          {userList?.map((user, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <img
                  src={user.profileImage}
                  alt="user"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              </TableCell>

              <TableCell align="left">{user.name}</TableCell>
              <TableCell align="center">{user.email}</TableCell>
              <TableCell align="center">{user.walletAddress}</TableCell>
              <TableCell align="center">{user.phone}</TableCell>
              <TableCell align="center">{user.isEmailVerified ? "Yes" : "No"}</TableCell>
              <TableCell align="center">{user.status}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <Icon color="error">close</Icon>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>

      {/* <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={subscribarList.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      /> */}
    </Box>
  );
}
