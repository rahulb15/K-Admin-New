// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Button,
//   TextField,
//   Box,
//   Chip,
//   MenuItem,
//   Select,
//   OutlinedInput,
//   Typography,
//   Grid,
//   Paper,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   Card,
//   CardMedia,
//   IconButton,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   useCreateCollectionMutation,
//   useUnrevealedTokensMutation,
// } from "services/prioritypass.service";
// import Swal from "sweetalert2";
// import useAuth from "app/hooks/useAuth";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import { setRefresh } from "features/refreshSlice";
// import { setModalOpen } from "features/launchpadModalActionSlice";
// import { UnrevealedTokensModal } from "./Models";
// import launchapadServices from "services/launchapadServices.tsx";
// import collectionService from "services/collectionServices.tsx";

// // const createCollectionSchema = yup.object().shape({
// //   totalSupply: yup.number().required("Total supply is required"),
// //   creator: yup.string().required("Creator is required"),
// //   mintPrice: yup.number().required("Mint price is required"),
// //   collectionRequestUriList: yup
// //     .string()
// //     .required("URI list is required")
// //     .test("valid-uri-list", "Please enter a valid URI list", (value) => {
// //       if (!value) return false;

// //       // Split the input by commas and newlines, then trim each URI
// //       const uris = value
// //         .split(/[\n,]+/)
// //         .map((uri) => uri.trim())
// //         .filter((uri) => uri.length > 0);

// //       // Simplified regex to allow common URI formats
// //       const uriRegex = /^https?:\/\/[^\s]+$|^[^\s]+$/;

// //       // Validate that each URI is a valid URL or string
// //       return uris.every((uri) => uriRegex.test(uri));
// //     }),

// //   policy: yup
// //     .array()
// //     .of(yup.string())
// //     .min(1, "At least one policy is required"),
// // });

// const createCollectionSchema = yup.object().shape({
//   totalSupply: yup.number().required("Total supply is required"),
//   creator: yup.string().required("Creator is required"),
//   mintPrice: yup.number().required("Mint price is required"),
//   collectionRequestUriList: yup
//     .string()
//     .required("URI list is required")
//     .test("valid-uri-list", "Please enter a valid URI list", (value) => {
//       if (!value) return false;
//       const uris = value
//         .split(/[\n,]+/)
//         .map((uri) => uri.trim())
//         .filter((uri) => uri.length > 0);
//       const uriRegex = /^https?:\/\/[^\s]+$|^[^\s]+$/;
//       return uris.every((uri) => uriRegex.test(uri));
//     }),
//   policy: yup
//     .array()
//     .of(yup.string())
//     .min(1, "At least one policy is required"),
//   collectionBannerImage: yup.mixed().required("Banner image is required"),
//   collectionCoverImage: yup.mixed().required("Cover image is required"),
// });

// const unRevealedTokensSchema = yup.object().shape({
//   unrevealedColName: yup.string().required("Collection name is required"),
// });

// // const policies = ["COLLECTION", "INSTANT-MINT", "MARKETPLACE", "FIXED-SALE"];
// const policies = [
//   "COLLECTION",
//   "INSTANT-MINT",
//   "MARKETPLACE",
//   "FIXED-SALE",
//   "AUCTION-SALE",
//   "BLACKLIST",
//   "DISABLE-BURN",
//   "DISABLE-TRANSFER",
//   "DISABLE-SALE",
//   "DUTCH-AUCTION-SALE",
//   "EXTRA-POLICIES",
//   "FIXED-ISSUANCE",
//   "GUARDS",
//   "NON-FUNGIBLE",
//   "ROYALTY",
//   "TRUSTED-CUSTODY",
// ];

// const CreateCollectionForm = (props) => {
//   const [bannerPreview, setBannerPreview] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     trigger,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(createCollectionSchema),
//     defaultValues: {
//       policy: [],
//     },
//     mode: "onChange",
//   });

//   const dispatch = useDispatch();
//   const [createCollection] = useCreateCollectionMutation();
//   const { user } = useAuth();

//   const collectionRequestUriList = watch("collectionRequestUriList");

//   useEffect(() => {
//     reset({
//       creator: user.walletAddress,
//     });
//   }, [user.walletAddress, reset]);

//   useEffect(() => {
//     const uris = collectionRequestUriList
//       ?.split(/[\s,]+/)
//       ?.map((uri) => uri.trim().replace(/^"(.*)"$/, "$1"))
//       ?.filter((uri) => uri.length > 0);

//     setValue("totalSupply", uris?.length || 0);
//     trigger("totalSupply");
//   }, [collectionRequestUriList, setValue, trigger]);

//   const handleImageUpload = async (file, type) => {
//     const formData = new FormData();
//     formData.append(type === "banner" ? "profileImage" : "coverImage", file);

//     try {
//       const response = await launchapadServices.uploadImage(formData);
//       console.log("🚀 ~ handleImageUpload ~ response", response);
//       // {
//       //   status: 'success',
//       //   message: 'Success',
//       //   description: 'The request has succeeded.',
//       //   data: {
//       //     collectionBannerImage:
//       //       'https://res.cloudinary.com/dh187xay8/image/upload/v1722575910/collectionBannerImage/file.jpg',
//       //     collectionCoverImage: ''
//       //   }
//       // }
//       if (response.status === "success") {
//         const imageUrl =
//           response.data[
//             type === "banner" ? "collectionBannerImage" : "collectionCoverImage"
//           ];
//         setValue(
//           type === "banner" ? "collectionBannerImage" : "collectionCoverImage",
//           imageUrl
//         );
//         if (type === "banner") {
//           setBannerPreview(imageUrl);
//         } else {
//           setCoverPreview(imageUrl);
//         }
//       } else {
//         throw new Error("Image upload failed");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to upload image",
//       });
//     }
//   };

//   const createCollectionRequest = async (
//     totalSupply,
//     creator,
//     mintPrice,
//     collectionRequestUriList,
//     policy,
//     wallet,
//     collectionCoverImage,
//     collectionBannerImage
//   ) => {
//     try {
//       const body = {
//         collectionName: "Priority Pass",
//         creatorName: "Priority Pass",
//         creatorEmail: "Priority Pass",
//         creatorWallet: user.walletAddress,
//         projectDescription: "Priority Pass",
//         projectCategory: "Priority Pass",
//         expectedLaunchDate: "",
//         twitter: "",
//         discord: "",
//         instagram: "",
//         website: "",
//         contractType: "ng",
//         totalSupply: totalSupply,
//         mintPrice: mintPrice,
//         mintPriceCurrency: "KDA",
//         royaltyPercentage: 0,
//         mintStartDate: new Date(),
//         mintStartTime: "",
//         mintEndDate: new Date(2030, 0, 1),
//         mintEndTime: "",
//         allowFreeMints: false,
//         enableWhitelist: false,
//         enablePresale: false,
//         enableAirdrop: false,
//         isApproved: true,
//         isPaid: true,
//         isLaunched: true,
//         royaltyAddress: "",
//         policy: policy,
//         tokenList: collectionRequestUriList,
//         collectionCoverImage: collectionCoverImage,
//         collectionBannerImage: collectionBannerImage,
//       };

//       console.log("🚀 ~ createCollectionRequest ~ body", body);

//       const response = await collectionService.launchCollection(body);
//       if (response?.data?.status === "success") {
//         console.log("🚀 ~ createCollectionRequest ~ response", response);
//         return response;
//       } else {
//         if (response?.data?.message === "Conflict") {
//           // toast.error("Collection with this name already exists");
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: "Collection with this name already exists",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error creating collection", error);
//     }
//   };

//   const onSubmit = async (data) => {
//     console.log("Collection data:", data);
//     try {
//       const uris = data.collectionRequestUriList
//         .split(/[\s,]+/)
//         .map((uri) => uri.trim().replace(/^"(.*)"$/, "$1"))
//         .filter((uri) => uri.length > 0);

//       console.log("URIs:", uris);

//       //       const resultApi = await createCollectionRequest(
//       //         data.totalSupply,
//       //         data.creator,
//       //         data.mintPrice,
//       //         uris,
//       //         data.policy,
//       //         user?.walletName === "Ecko Wallet" ? "ecko" : user?.walletName === "Chainweaver" ? "CW" : user?.walletName,
//       //         data.collectionCoverImage,
//       //         data.collectionBannerImage
//       //       );

//       //       console.log("🚀 ~ onSubmit ~ result", resultApi);

//       // return;

//       const result = await createCollection({
//         totalSupply: data.totalSupply,
//         creator: data.creator,
//         mintPrice: data.mintPrice,
//         collectionRequestUriList: uris,
//         policy: data.policy.join(" "),
//         wallet:
//           user?.walletName === "Ecko Wallet"
//             ? "ecko"
//             : user?.walletName === "Chainweaver"
//             ? "CW"
//             : user?.walletName,
//       });
//       console.log("🚀 ~ onSubmit ~ result", result);

//       // {
//       //   data: {
//       //     gas: 3550,
//       //     result: {
//       //       status: 'success',
//       //       data: 'c_priority_pass_001_xJlF0Q0YUwQ9ReZ3NIEUPr8zGpJo2LtVMBWW_MSeEqA'
//       //     },
//       //     reqKey: 'tWqXstwGvyiLWEKAm_rNSVK1U2w7xLi_-eb9sAKr-0M',
//       //     logs: 'Ek8Mf5q1wY1QLKdRbeydmW6lSX31rgEnktcY7lVG6bc',
//       //     events: [
//       //       {
//       //         params: [
//       //           'k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf', 'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
//       //           0.0000355
//       //         ],
//       //         name: 'TRANSFER',
//       //         module: { namespace: null, name: 'coin' },
//       //         moduleHash: 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s'
//       //       },
//       //       {
//       //         params: [],
//       //         name: 'CREATE-COLLECTION',
//       //         module: { namespace: 'free', name: 'kmpasstest002' },
//       //         moduleHash: 'H2O5imRX2on4mHXmQL3eP8-XWPLGZhaFTIIpO98mvYg'
//       //       },
//       //       {
//       //         params: [
//       //           'c_priority_pass_001_xJlF0Q0YUwQ9ReZ3NIEUPr8zGpJo2LtVMBWW_MSeEqA', 'priority_pass_001',
//       //           { int: 50 },
//       //           'k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf'
//       //         ],
//       //         name: 'CREATE-COLLECTION',
//       //         module: {
//       //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
//       //           name: 'policy-collection'
//       //         },
//       //         moduleHash: 'OOsTKpL4F85MH-rq_kFvn3bZ4id-pJMP5ZSUrZTF46E'
//       //       },
//       //       {
//       //         params: [
//       //           'priority_pass_001', { int: 50 },
//       //           {
//       //             pred: 'keys-all',
//       //             keys: [
//       //               '56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf'
//       //             ]
//       //           },
//       //           'k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf'
//       //         ],
//       //         name: 'COLLECTION_CREATED',
//       //         module: { namespace: 'free', name: 'kmpasstest002' },
//       //         moduleHash: 'H2O5imRX2on4mHXmQL3eP8-XWPLGZhaFTIIpO98mvYg'
//       //       }
//       //     ],
//       //     metaData: {
//       //       blockTime: 1722771412171163,
//       //       prevBlockHash: 'xxwa4ZEo3WPAr8crm6noo_NqNaK9p52JOq_7kGhjaro',
//       //       blockHash: '2adjZt13Lp_kpvMg-CEHQj6_D4_mmITXJugHYA4K4U0',
//       //       blockHeight: 4526080
//       //     },
//       //     continuation: null,
//       //     txId: 6330953
//       //   }
//       // }

//       if (result.data) {
//         const resultApi = await createCollectionRequest(
//           data.totalSupply,
//           data.creator,
//           data.mintPrice,
//           uris,
//           data.policy,
//           user?.walletName === "Ecko Wallet"
//             ? "ecko"
//             : user?.walletName === "Chainweaver"
//             ? "CW"
//             : user?.walletName,
//           data.collectionCoverImage,
//           data.collectionBannerImage
//         );

//         console.log("🚀 ~ onSubmit ~ result", resultApi);

//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Collection launched successfully",
//         });
//         dispatch(setRefresh(true));
//         dispatch(setModalOpen(false));
//       } else if (result.error) {
//         console.error("Error launching collection", result.error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Error launching collection",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error launching collection",
//       });
//     }
//   };

//   const handleRemoveImage = (type) => {
//     if (type === "banner") {
//       setBannerPreview(null);
//       setValue("collectionBannerImage", "");
//     } else {
//       setCoverPreview(null);
//       setValue("collectionCoverImage", "");
//     }
//   }
  

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Create Priority Pass Collection
//       </Typography>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <Controller
//               name="totalSupply"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Total Supply"
//                   variant="outlined"
//                   fullWidth
//                   error={!!errors.totalSupply}
//                   helperText={errors.totalSupply?.message}
//                   disabled
//                 />
//               )}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Controller
//               name="creator"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Creator"
//                   variant="outlined"
//                   fullWidth
//                   error={!!errors.creator}
//                   helperText={errors.creator?.message}
//                   onChange={(e) => {
//                     field.onChange(e);
//                     trigger("creator");
//                   }}
//                 />
//               )}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Controller
//               name="mintPrice"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Mint Price"
//                   variant="outlined"
//                   fullWidth
//                   error={!!errors.mintPrice}
//                   helperText={errors.mintPrice?.message}
//                   onChange={(e) => {
//                     field.onChange(e);
//                     trigger("mintPrice");
//                   }}
//                 />
//               )}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth error={!!errors.policy}>
//               <InputLabel id="policy-label">Policy</InputLabel>
//               <Controller
//                 name="policy"
//                 control={control}
//                 render={({ field: { value, onChange } }) => (
//                   <Select
//                     labelId="policy-label"
//                     multiple
//                     value={value}
//                     onChange={(e) => {
//                       onChange(e);
//                       trigger("policy");
//                     }}
//                     input={<OutlinedInput label="Policy" />}
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip key={value} label={value} />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     {policies.map((policy) => (
//                       <MenuItem key={policy} value={policy}>
//                         {policy}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 )}
//               />
//               {errors.policy && (
//                 <FormHelperText>{errors.policy.message}</FormHelperText>
//               )}
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <Controller
//               name="collectionRequestUriList"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="URI List"
//                   variant="outlined"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   error={!!errors.collectionRequestUriList}
//                   helperText={errors.collectionRequestUriList?.message}
//                   placeholder='Example: "https://example.com/1","https://example.com/2","https://example.com/3"'
//                   onChange={(e) => {
//                     field.onChange(e);
//                     trigger("collectionRequestUriList");
//                   }}
//                 />
//               )}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Controller
//               name="collectionBannerImage"
//               control={control}
//               render={({ field }) => (
//                 <Card>
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     image={
//                       bannerPreview ||
//                       "https://via.placeholder.com/400x140?text=Banner+Image"
//                     }
//                     alt="Banner Preview"
//                   />
//                   <Box
//                     sx={{
//                       p: 2,
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <input
//                       accept="image/*"
//                       type="file"
//                       id="banner-image-upload"
//                       style={{ display: "none" }}
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           handleImageUpload(file, "banner");
//                         }
//                       }}
//                     />
//                     <label htmlFor="banner-image-upload">
//                       <Button
//                         variant="contained"
//                         component="span"
//                         startIcon={<CloudUploadIcon />}
//                       >
//                         Upload Banner
//                       </Button>
//                     </label>
//                     {bannerPreview && (
//                       <IconButton
//                         onClick={() => handleRemoveImage("banner")}
//                         color="error"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     )}
//                   </Box>
//                   {errors.collectionBannerImage && (
//                     <FormHelperText error>
//                       {errors.collectionBannerImage.message}
//                     </FormHelperText>
//                   )}
//                 </Card>
//               )}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Controller
//               name="collectionCoverImage"
//               control={control}
//               render={({ field }) => (
//                 <Card>
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     image={
//                       coverPreview ||
//                       "https://via.placeholder.com/400x140?text=Cover+Image"
//                     }
//                     alt="Cover Preview"
//                   />
//                   <Box
//                     sx={{
//                       p: 2,
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <input
//                       accept="image/*"
//                       type="file"
//                       id="cover-image-upload"
//                       style={{ display: "none" }}
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           handleImageUpload(file, "cover");
//                         }
//                       }}
//                     />
//                     <label htmlFor="cover-image-upload">
//                       <Button
//                         variant="contained"
//                         component="span"
//                         startIcon={<CloudUploadIcon />}
//                       >
//                         Upload Cover
//                       </Button>
//                     </label>
//                     {coverPreview && (
//                       <IconButton
//                         onClick={() => handleRemoveImage("cover")}
//                         color="error"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     )}
//                   </Box>
//                   {errors.collectionCoverImage && (
//                     <FormHelperText error>
//                       {errors.collectionCoverImage.message}
//                     </FormHelperText>
//                   )}
//                 </Card>
//               )}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="large"
//               fullWidth
//             >
//               Create Collection
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   );
// };

// const UnrevealedTokensForm = (props) => {
//   // console.log("CreateNGCollectionForm", props?.handleClose());
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(unRevealedTokensSchema),
//   });
//   const dispatch = useDispatch();
//   const [unRevealedTokens] = useUnrevealedTokensMutation();
//   const { user } = useAuth();
//   const [tableData, setTableData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     reset({
//       unrevealedColName: "Priority Pass",
//     });
//   }, [reset]);

//   const onSubmit = async (data) => {
//     console.log("Unrevealed Tokens data:", data);

//     try {
//       const result = await unRevealedTokens({
//         unrevealedColName: data.unrevealedColName,
//         wallet:
//           user?.walletName === "Ecko Wallet"
//             ? "ecko"
//             : user?.walletName === "Chainweaver"
//             ? "CW"
//             : user?.walletName,
//       });
//       console.log("🚀 ~ onSubmit ~ result", result);
//       if (result?.data?.length > 0) {
//         console.log("Unrevealed Tokens created successfully", result);
//         setTableData(result.data);
//         setIsModalOpen(true);
//         // dispatch(setRefresh(true));
//         // dispatch(setModalOpen(false));
//         // Swal.fire({
//         //   icon: "success",
//         //   title: "Success",
//         //   text: "Unrevealed Tokens created successfully",
//         // });
//       } else if (result.error) {
//         console.error("Error creating unrevealed tokens", result.error);
//         dispatch(setRefresh(false));
//         dispatch(setModalOpen(false));
//       } else {
//         Swal.fire({
//           icon: "warning",
//           title: "Warning",
//           text: "No Data Found",
//         });
//         dispatch(setRefresh(false));
//         dispatch(setModalOpen(false));
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       dispatch(setRefresh(false));
//       dispatch(setModalOpen(false));
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     dispatch(setRefresh(true));
//     dispatch(setModalOpen(false));
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Controller
//           name="unrevealedColName"
//           control={control}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               fullWidth
//               margin="normal"
//               error={!!errors.unrevealedColName}
//               helperText={errors.unrevealedColName?.message}
//               disabled
//             />
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>

//       <UnrevealedTokensModal
//         open={isModalOpen}
//         handleClose={handleCloseModal}
//         data={tableData}
//       />
//     </>
//   );
// };

// export { CreateCollectionForm, UnrevealedTokensForm };




import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Box,
  Chip,
  MenuItem,
  Select,
  OutlinedInput,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  FormHelperText,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreateCollectionMutation,
  useUnrevealedTokensMutation,
} from "services/prioritypass.service";
import Swal from "sweetalert2";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import { UnrevealedTokensModal } from "./Models";
import launchapadServices from "services/launchapadServices.tsx";
import collectionService from "services/collectionServices.tsx";

// const createCollectionSchema = yup.object().shape({
//   totalSupply: yup.number().required("Total supply is required"),
//   creator: yup.string().required("Creator is required"),
//   mintPrice: yup.number().required("Mint price is required"),
//   collectionRequestUriList: yup
//     .string()
//     .required("URI list is required")
//     .test("valid-uri-list", "Please enter a valid URI list", (value) => {
//       if (!value) return false;

//       // Split the input by commas and newlines, then trim each URI
//       const uris = value
//         .split(/[\n,]+/)
//         .map((uri) => uri.trim())
//         .filter((uri) => uri.length > 0);

//       // Simplified regex to allow common URI formats
//       const uriRegex = /^https?:\/\/[^\s]+$|^[^\s]+$/;

//       // Validate that each URI is a valid URL or string
//       return uris.every((uri) => uriRegex.test(uri));
//     }),

//   policy: yup
//     .array()
//     .of(yup.string())
//     .min(1, "At least one policy is required"),
// });

const cleanUri = (uri) => {
  return uri.trim().replace(/,$/, ''); // Remove trailing comma if present
};

const formatUris = (uris) => {
  return uris
    .map(cleanUri)
    .filter(uri => uri.length > 0)
    .join(',\n');
};

const splitUris = (value) => {
  return value.split(/,\s*|\n/).filter(uri => uri.trim().length > 0);
};


const createCollectionSchema = yup.object().shape({
  totalSupply: yup.number().required("Total supply is required"),
  creator: yup.string().required("Creator is required"),
  mintPrice: yup.number().required("Mint price is required"),
  collectionRequestUriList: yup
  .string()
  .required("URI list is required")
  .test("valid-uri-list", "Please enter valid URIs", (value) => {
    if (!value) return false;
    const uris = splitUris(value);
    const uriRegex = /^(https?:\/\/)?[^\s,]+$/; // More lenient regex
    return uris.every((uri) => uriRegex.test(cleanUri(uri)));
  }),
  policy: yup
    .array()
    .of(yup.string())
    .min(1, "At least one policy is required"),
  collectionBannerImage: yup.mixed().required("Banner image is required"),
  collectionCoverImage: yup.mixed().required("Cover image is required"),
});

const unRevealedTokensSchema = yup.object().shape({
  unrevealedColName: yup.string().required("Collection name is required"),
});

// const policies = ["COLLECTION", "INSTANT-MINT", "MARKETPLACE", "FIXED-SALE"];
const policies = [
  "COLLECTION",
  "INSTANT-MINT",
  "MARKETPLACE",
  "FIXED-SALE",
  "AUCTION-SALE",
  "BLACKLIST",
  "DISABLE-BURN",
  "DISABLE-TRANSFER",
  "DISABLE-SALE",
  "DUTCH-AUCTION-SALE",
  "EXTRA-POLICIES",
  "FIXED-ISSUANCE",
  "GUARDS",
  "NON-FUNGIBLE",
  "ROYALTY",
  "TRUSTED-CUSTODY",
];

const CreateCollectionForm = (props) => {
  const [bannerPreview, setBannerPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCollectionSchema),
    defaultValues: {
      policy: [],
    },
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const [createCollection] = useCreateCollectionMutation();
  const { user } = useAuth();

  const collectionRequestUriList = watch("collectionRequestUriList");

  useEffect(() => {
    reset({
      creator: user.walletAddress,
    });
  }, [user.walletAddress, reset]);

  useEffect(() => {
    const uris = collectionRequestUriList
      ?.split(/[\s,]+/)
      ?.map((uri) => uri.trim().replace(/^"(.*)"$/, "$1"))
      ?.filter((uri) => uri.length > 0);

    setValue("totalSupply", uris?.length || 0);
    trigger("totalSupply");
  }, [collectionRequestUriList, setValue, trigger]);

  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append(type === "banner" ? "profileImage" : "coverImage", file);

    try {
      const response = await launchapadServices.uploadImage(formData);
      console.log("🚀 ~ handleImageUpload ~ response", response);
      // {
      //   status: 'success',
      //   message: 'Success',
      //   description: 'The request has succeeded.',
      //   data: {
      //     collectionBannerImage:
      //       'https://res.cloudinary.com/dh187xay8/image/upload/v1722575910/collectionBannerImage/file.jpg',
      //     collectionCoverImage: ''
      //   }
      // }
      if (response.status === "success") {
        const imageUrl =
          response.data[
            type === "banner" ? "collectionBannerImage" : "collectionCoverImage"
          ];
        setValue(
          type === "banner" ? "collectionBannerImage" : "collectionCoverImage",
          imageUrl
        );
        if (type === "banner") {
          setBannerPreview(imageUrl);
        } else {
          setCoverPreview(imageUrl);
        }
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload image",
      });
    }
  };

  const createCollectionRequest = async (
    totalSupply,
    creator,
    mintPrice,
    collectionRequestUriList,
    policy,
    wallet,
    collectionCoverImage,
    collectionBannerImage
  ) => {
    try {
      const body = {
        collectionName: "Priority Pass",
        creatorName: "Priority Pass",
        creatorEmail: "Priority Pass",
        creatorWallet: user.walletAddress,
        projectDescription: "Priority Pass",
        projectCategory: "Priority Pass",
        expectedLaunchDate: "",
        twitter: "",
        discord: "",
        instagram: "",
        website: "",
        contractType: "ng",
        totalSupply: totalSupply,
        mintPrice: mintPrice,
        mintPriceCurrency: "KDA",
        royaltyPercentage: 0,
        mintStartDate: new Date(),
        mintStartTime: "",
        mintEndDate: new Date(2030, 0, 1),
        mintEndTime: "",
        allowFreeMints: false,
        enableWhitelist: false,
        enablePresale: false,
        enableAirdrop: false,
        isApproved: true,
        isPaid: true,
        isLaunched: true,
        royaltyAddress: "",
        policy: policy,
        tokenList: collectionRequestUriList,
        collectionCoverImage: collectionCoverImage,
        collectionBannerImage: collectionBannerImage,
      };

      console.log("🚀 ~ createCollectionRequest ~ body", body);

      const response = await collectionService.launchCollection(body);
      if (response?.data?.status === "success") {
        console.log("🚀 ~ createCollectionRequest ~ response", response);
        return response;
      } else {
        if (response?.data?.message === "Conflict") {
          // toast.error("Collection with this name already exists");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Collection with this name already exists",
          });
        }
      }
    } catch (error) {
      console.error("Error creating collection", error);
    }
  };

  const onSubmit = async (data) => {
    console.log("Collection data:", data);
    try {
      const uris = data.collectionRequestUriList
        .split(/,\s*|\n/)  // Split on comma followed by optional whitespace, or newline
        .map((uri) => uri.trim())
        .filter((uri) => uri.length > 0);
  
      console.log("URIs:", uris);


      //       const resultApi = await createCollectionRequest(
      //         data.totalSupply,
      //         data.creator,
      //         data.mintPrice,
      //         uris,
      //         data.policy,
      //         user?.walletName === "Ecko Wallet" ? "ecko" : user?.walletName === "Chainweaver" ? "CW" : user?.walletName,
      //         data.collectionCoverImage,
      //         data.collectionBannerImage
      //       );

      //       console.log("🚀 ~ onSubmit ~ result", resultApi);

      // return;

      const result = await createCollection({
        totalSupply: data.totalSupply,
        creator: data.creator,
        mintPrice: data.mintPrice,
        collectionRequestUriList: uris,
        policy: data.policy.join(" "),
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });
      console.log("🚀 ~ onSubmit ~ result", result);

      // {
      //   data: {
      //     gas: 3550,
      //     result: {
      //       status: 'success',
      //       data: 'c_priority_pass_001_xJlF0Q0YUwQ9ReZ3NIEUPr8zGpJo2LtVMBWW_MSeEqA'
      //     },
      //     reqKey: 'tWqXstwGvyiLWEKAm_rNSVK1U2w7xLi_-eb9sAKr-0M',
      //     logs: 'Ek8Mf5q1wY1QLKdRbeydmW6lSX31rgEnktcY7lVG6bc',
      //     events: [
      //       {
      //         params: [
      //           'k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf', 'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
      //           0.0000355
      //         ],
      //         name: 'TRANSFER',
      //         module: { namespace: null, name: 'coin' },
      //         moduleHash: 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s'
      //       },
      //       {
      //         params: [],
      //         name: 'CREATE-COLLECTION',
      //         module: { namespace: 'free', name: 'kmpasstest002' },
      //         moduleHash: 'H2O5imRX2on4mHXmQL3eP8-XWPLGZhaFTIIpO98mvYg'
      //       },
      //       {
      //         params: [
      //           'c_priority_pass_001_xJlF0Q0YUwQ9ReZ3NIEUPr8zGpJo2LtVMBWW_MSeEqA', 'priority_pass_001',
      //           { int: 50 },
      //           'k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf'
      //         ],
      //         name: 'CREATE-COLLECTION',
      //         module: {
      //           namespace: 'n_442d3e11cfe0d39859878e5b1520cd8b8c36e5db',
      //           name: 'policy-collection'
      //         },
      //         moduleHash: 'OOsTKpL4F85MH-rq_kFvn3bZ4id-pJMP5ZSUrZTF46E'
      //       },
      //       {
      //         params: [
      //           'priority_pass_001', { int: 50 },
      //           {
      //             pred: 'keys-all',
      //             keys: [
      //               '56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf'
      //             ]
      //           },
      //           'k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf'
      //         ],
      //         name: 'COLLECTION_CREATED',
      //         module: { namespace: 'free', name: 'kmpasstest002' },
      //         moduleHash: 'H2O5imRX2on4mHXmQL3eP8-XWPLGZhaFTIIpO98mvYg'
      //       }
      //     ],
      //     metaData: {
      //       blockTime: 1722771412171163,
      //       prevBlockHash: 'xxwa4ZEo3WPAr8crm6noo_NqNaK9p52JOq_7kGhjaro',
      //       blockHash: '2adjZt13Lp_kpvMg-CEHQj6_D4_mmITXJugHYA4K4U0',
      //       blockHeight: 4526080
      //     },
      //     continuation: null,
      //     txId: 6330953
      //   }
      // }

      if (result.data) {
        const resultApi = await createCollectionRequest(
          data.totalSupply,
          data.creator,
          data.mintPrice,
          uris,
          data.policy,
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
          data.collectionCoverImage,
          data.collectionBannerImage
        );

        console.log("🚀 ~ onSubmit ~ result", resultApi);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Collection launched successfully",
        });
        dispatch(setRefresh(true));
        dispatch(setModalOpen(false));
      } else if (result.error) {
        console.error("Error launching collection", result.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error launching collection",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error launching collection",
      });
    }
  };


  const handleRemoveImage = (type) => {
    if (type === "banner") {
      setBannerPreview(null);
      setValue("collectionBannerImage", "");
    } else {
      setCoverPreview(null);
      setValue("collectionCoverImage", "");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Create Priority Pass Collection
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="totalSupply"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total Supply"
                  variant="outlined"
                  fullWidth
                  error={!!errors.totalSupply}
                  helperText={errors.totalSupply?.message}
                  disabled
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="creator"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Creator"
                  variant="outlined"
                  fullWidth
                  error={!!errors.creator}
                  helperText={errors.creator?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("creator");
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="mintPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mint Price"
                  variant="outlined"
                  fullWidth
                  error={!!errors.mintPrice}
                  helperText={errors.mintPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger("mintPrice");
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.policy}>
              <InputLabel id="policy-label">Policy</InputLabel>
              <Controller
                name="policy"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    labelId="policy-label"
                    multiple
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      trigger("policy");
                    }}
                    input={<OutlinedInput label="Policy" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {policies.map((policy) => (
                      <MenuItem key={policy} value={policy}>
                        {policy}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.policy && (
                <FormHelperText>{errors.policy.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <Controller
  name="collectionRequestUriList"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      label="URI List"
      variant="outlined"
      fullWidth
      multiline
      rows={4}
      error={!!errors.collectionRequestUriList}
      helperText={errors.collectionRequestUriList?.message}
      placeholder='Example: https://example.com/1.json,\nhttps://example.com/2.json,\nhttps://example.com/3.json'
      onChange={(e) => {
        const inputValue = e.target.value;
        const lastChar = inputValue.slice(-1);
        
        if (lastChar === ',') {
          // If the last character is a comma, format the URIs
          const uris = splitUris(inputValue);
          const formattedValue = formatUris(uris) + ',\n';
          field.onChange(formattedValue);
        } else {
          // Otherwise, just update the value as is
          field.onChange(inputValue);
        }
        
        trigger("collectionRequestUriList");
      }}
      onBlur={(e) => {
        // Format URIs on blur
        const uris = splitUris(e.target.value);
        const formattedValue = formatUris(uris);
        field.onChange(formattedValue);
        trigger("collectionRequestUriList");
      }}
    />
  )}
/>
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="collectionBannerImage"
              control={control}
              render={({ field }) => (
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      bannerPreview ||
                      "https://via.placeholder.com/400x140?text=Banner+Image"
                    }
                    alt="Banner Preview"
                  />
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id="banner-image-upload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file, "banner");
                        }
                      }}
                    />
                    <label htmlFor="banner-image-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Banner
                      </Button>
                    </label>
                    {bannerPreview && (
                      <IconButton
                        onClick={() => handleRemoveImage("banner")}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  {errors.collectionBannerImage && (
                    <FormHelperText error>
                      {errors.collectionBannerImage.message}
                    </FormHelperText>
                  )}
                </Card>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="collectionCoverImage"
              control={control}
              render={({ field }) => (
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      coverPreview ||
                      "https://via.placeholder.com/400x140?text=Cover+Image"
                    }
                    alt="Cover Preview"
                  />
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id="cover-image-upload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file, "cover");
                        }
                      }}
                    />
                    <label htmlFor="cover-image-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Cover
                      </Button>
                    </label>
                    {coverPreview && (
                      <IconButton
                        onClick={() => handleRemoveImage("cover")}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  {errors.collectionCoverImage && (
                    <FormHelperText error>
                      {errors.collectionCoverImage.message}
                    </FormHelperText>
                  )}
                </Card>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Create Collection
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const UnrevealedTokensForm = (props) => {
  // console.log("CreateNGCollectionForm", props?.handleClose());
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(unRevealedTokensSchema),
  });
  const dispatch = useDispatch();
  const [unRevealedTokens] = useUnrevealedTokensMutation();
  const { user } = useAuth();
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    reset({
      unrevealedColName: "Priority Pass",
    });
  }, [reset]);

  const onSubmit = async (data) => {
    console.log("Unrevealed Tokens data:", data);

    try {
      const result = await unRevealedTokens({
        unrevealedColName: data.unrevealedColName,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });
      console.log("🚀 ~ onSubmit ~ result", result);
      if (result?.data?.length > 0) {
        console.log("Unrevealed Tokens created successfully", result);
        setTableData(result.data);
        setIsModalOpen(true);
        // dispatch(setRefresh(true));
        // dispatch(setModalOpen(false));
        // Swal.fire({
        //   icon: "success",
        //   title: "Success",
        //   text: "Unrevealed Tokens created successfully",
        // });
      } else if (result.error) {
        console.error("Error creating unrevealed tokens", result.error);
        dispatch(setRefresh(false));
        dispatch(setModalOpen(false));
      } else {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "No Data Found",
        });
        dispatch(setRefresh(false));
        dispatch(setModalOpen(false));
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(setRefresh(false));
      dispatch(setModalOpen(false));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setRefresh(true));
    dispatch(setModalOpen(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="unrevealedColName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              error={!!errors.unrevealedColName}
              helperText={errors.unrevealedColName?.message}
              disabled
            />
          )}
        />
        <Button type="submit">Submit</Button>
      </form>

      <UnrevealedTokensModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        data={tableData}
      />
    </>
  );
};

export { CreateCollectionForm, UnrevealedTokensForm };

