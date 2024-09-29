import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextField, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreatePresaleMutation,
  useCreateWlMutation,
  useCreateAirdropMutation,
  useCreateNgCollectionMutation,
  useUnrevealedTokensMutation,
  useSyncWithNgMutation,
} from "services/launchpad.service";
import moment from "moment";
import Swal from "sweetalert2";
import launchapadServices from "services/launchapadServices.tsx";
import collectionServices from "services/collectionServices.tsx";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { UnrevealedTokensModal } from "./Models";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";

const presaleSchema = yup.object().shape({
  startDateAndTime: yup.date().required("Start date and time is required"),
  endDateAndTime: yup
    .date()
    .required("End date and time is required")
    .min(yup.ref("startDateAndTime"), "End date must be after start date"),
  presaleMintPrice: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Presale mint price is required"),
  presaleAddress: yup
    .string()
    .required("Presale address is required")
    .matches(
      /^(k:[a-zA-Z0-9]+,?)+$/,
      "Invalid address format. Use 'k:address1,k:address2'"
    ),
});

const whitelistSchema = yup.object().shape({
  createWlAdd: yup
    .string()
    .required("Whitelist address is required")
    .matches(
      /^(k:[a-zA-Z0-9]+,?)+$/,
      "Invalid address format. Use 'k:address1,k:address2'"
    ),
  createWlPrice: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Whitelist price is required"),
  createWlStartTime: yup.date().nullable().required("Start time is required"),
});

const createNgCollectionSchema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
});

const unRevealedTokensSchema = yup.object().shape({
  unrevealedColName: yup.string().required("Collection name is required"),
});

const PreSaleForm = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(presaleSchema),
  });
  const dispatch = useDispatch();
  const [createPresale] = useCreatePresaleMutation();
  const { login, user } = useAuth();
  const [presaleStartDateAndTime, setPresaleStartDateAndTime] =
    React.useState(null);
  console.log("🚀 ~ file: Forms.jsx ~ line 108 ~ PreSaleForm ~ user", user);
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  console.log("selectionLaunchpad", selection);

  const onSubmit = async (data) => {
    console.log("Presale data:", data);

    console.log("🚀 ~ handlePreSaleSubmit ~ presaleData", data);

    const presaleStartDateNew = moment(data.startDateAndTime).format(
      "YYYY-MM-DD"
    );
    const presaleStartTimeNew = moment(data.startDateAndTime).format("HH:mm");
    const presaleEndDateNew = moment(data.endDateAndTime).format("YYYY-MM-DD");
    const presaleEndTimeNew = moment(data.endDateAndTime).format("HH:mm");
    console.log(
      "🚀 ~ handlePreSaleSubmit ~ presaleStartDateNew",
      presaleStartDateNew
    );
    console.log(
      "🚀 ~ handlePreSaleSubmit ~ presaleStartTimeNew",
      presaleStartTimeNew
    );

    console.log(
      moment(`${presaleStartDateNew} ${presaleStartTimeNew}`).utc().format()
    );

    const presaleStartTime = moment(
      `${presaleStartDateNew} ${presaleStartTimeNew}`
    )
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss");
    const formattedStartDate = `time "${presaleStartTime}Z"`;
    console.log("formattedDate", formattedStartDate);

    const presaleEndTime = moment(`${presaleEndDateNew} ${presaleEndTimeNew}`)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss");
    const formattedEndDate = `time "${presaleEndTime}Z"`;
    console.log("formattedEndDate", formattedEndDate);

    const kaddress = data.presaleAddress?.split(",");
    const kaddress1 = kaddress.map((address) => `'${address}'`);
    const kaddress2 = kaddress1.join(",");
    console.log("🚀 ~ handlePreSaleSubmit ~ kaddress2", kaddress2);

    try {
      const result = await createPresale({
        createPresaleCol: selection.collectionName,
        createPresalePrice: parseFloat(data.presaleMintPrice).toFixed(2),
        createPresaleStartDate: presaleStartDateNew,
        createPresaleStartTime: formattedStartDate,
        createPresaleEndDate: presaleEndDateNew,
        createPresaleEndTime: formattedEndDate,
        createPresaleAdd: kaddress2,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });

      console.log("🚀 ~ handlePreSaleSubmit ~ result", result);
      if (result.data.result.status === "success") {
        const body = {
          presaleStartDate: presaleStartDateNew,
          presaleStartTime: presaleStartTimeNew,
          presaleEndDate: presaleEndDateNew,
          presaleEndTime: presaleEndTimeNew,
          presaleStartDateAndTime: moment(
            `${presaleStartDateNew} ${presaleStartTimeNew}`
          )
            .utc()
            .format(),
          presaleEndDateAndTime: moment(
            `${presaleEndDateNew} ${presaleEndTimeNew}`
          )
            .utc()
            .format(),
          presalePrice: parseFloat(data.presaleMintPrice).toFixed(2),
          presaleAddressess: kaddress,
        };

        console.log("🚀 ~ handleSubmit ~ body", body);
        const response = await collectionServices.updateCollection(
          body,
          selection.collectionName
        );
        console.log("🚀 ~ handleSubmit ~ response", response);
        if (response?.data?.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Presale created successfully",
          });
          // setFinalizeModalOpen(false);
          dispatch(setRefresh(true));
          dispatch(setModalOpen(false));
        } else {
          console.error("Error creating presale", response.error);
          dispatch(setRefresh(false));
          dispatch(setModalOpen(false));
        }
      } else if (result.error) {
        console.error("Error creating presale", result.error);
        dispatch(setRefresh(false));
        dispatch(setModalOpen(false));
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(setRefresh(false));
      dispatch(setModalOpen(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <Controller
            name="startDateAndTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label="Presale Start Date"
                renderInput={(props) => (
                  <TextField
                    {...props}
                    error={!!errors.startDateAndTime}
                    helperText={errors.startDateAndTime?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="endDateAndTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label="Presale End Date"
                renderInput={(props) => (
                  <TextField
                    {...props}
                    error={!!errors.endDateAndTime}
                    helperText={errors.endDateAndTime?.message}
                  />
                )}
              />
            )}
          />
        </Stack>
      </LocalizationProvider>
      <Controller
        name="presaleMintPrice"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Presale Mint Price"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.presaleMintPrice}
            helperText={errors.presaleMintPrice?.message}
          />
        )}
      />
      <Controller
        name="presaleAddress"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Presale Address"
            fullWidth
            margin="normal"
            error={!!errors.presaleAddress}
            helperText={errors.presaleAddress?.message}
          />
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

const WhitelistForm = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(whitelistSchema),
  });
  const dispatch = useDispatch();
  const [createWl] = useCreateWlMutation();
  const { login, user } = useAuth();
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  console.log("selectionLaunchpad", selection);

  const onSubmit = async (data) => {
    console.log("Whitelist data:", data);

    console.log("🚀 ~ handleWhitelistSubmit ~ data", data);

    const whitelistStartTime = moment(data.createWlStartTime)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss");
    const formattedStartDate = `time "${whitelistStartTime}Z"`;
    console.log("formattedDate", formattedStartDate);

    try {
      const result = await createWl({
        createWlCol: selection.collectionName,
        createWlAdd: data.createWlAdd,
        createWlPrice: parseFloat(data.createWlPrice).toFixed(2),
        createWlStartTime: formattedStartDate,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });

      console.log("🚀 ~ handleWhitelistSubmit ~ result", result);
      if (result.data.result.status === "success") {
        const body = {
          whitelistAddresses: data.createWlAdd,
          whitelistStartDate: moment(data.createWlStartTime).format(
            "YYYY-MM-DD"
          ),
          whitelistStartTime: moment(data.createWlStartTime).format("HH:mm"),
          whitelistPrice: parseFloat(data.createWlPrice).toFixed(2),
          whitelistStartDateAndTime: moment(data.createWlStartTime)
            .utc()
            .format(),
        };

        console.log("🚀 ~ handleSubmit ~ body", body);
        const response = await collectionServices.updateCollection(
          body,
          selection.collectionName
        );
        console.log("🚀 ~ handleSubmit ~ response", response);

        if (response?.data?.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Whitelist created successfully",
          });
          dispatch(setRefresh(true));
          dispatch(setModalOpen(false));
        }
      } else if (result.error) {
        console.error("Error creating whitelist", result.error);
        dispatch(setRefresh(false));
        dispatch(setModalOpen(false));
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(setRefresh(false));
      dispatch(setModalOpen(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="createWlAdd"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Whitelist Addresses"
            fullWidth
            margin="normal"
            error={!!errors.createWlAdd}
            helperText={errors.createWlAdd?.message}
          />
        )}
      />
      <Controller
        name="createWlPrice"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Whitelist Price"
            fullWidth
            margin="normal"
            error={!!errors.createWlPrice}
            helperText={errors.createWlPrice?.message}
          />
        )}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name="createWlStartTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              label="Whitelist Start Time"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!errors.createWlStartTime}
                  helperText={errors.createWlStartTime?.message}
                />
              )}
            />
          )}
        />
      </LocalizationProvider>
      <Button type="submit">Submit</Button>
    </form>
  );
};

const CreateNGCollectionForm = (props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNgCollectionSchema),
  });
  const dispatch = useDispatch();
  const [createNgCollection] = useCreateNgCollectionMutation();
  const { login, user } = useAuth();
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  console.log("selectionLaunchpad", selection);

  useEffect(() => {
    reset({
      collectionName: selection.collectionName,
    });
  }, [selection.collectionName]);

  const onSubmit = async (data) => {
    console.log("NG Collection data:", data);
    console.log("🚀 ~ onAccept ~ data", data);
    try {
      const result = await createNgCollection({
        collectionName: selection.collectionName,
        wallet:
          user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName,
      });
      console.log("🚀 ~ onAccept ~ result", result);
      if (result.data.result.status === "success") {
        console.log("Collection launched successfully", result);
        launchapadServices
          .launchLaunchpad(selection?._id)
          .then((response) => {
            console.log(response);
            dispatch(setRefresh(true));
            dispatch(setModalOpen(false));

            if (response.data.isApproved) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Collection launched successfully",
              });

              const data = {
                collectionName: response.data.collectionName,
                applicationType: "launchpad",
              };

              collectionServices
                .createCollection(data)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              console.log("🚀 ~ onAccept ~ response", response);
            }
          })
          .catch((error) => {
            dispatch(setRefresh(false));
            dispatch(setModalOpen(false));
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error launching collection",
            });
          });
      } else if (result.error) {
        console.error("Error launching collection", result.error);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="collectionName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            error={!!errors.collectionName}
            helperText={errors.collectionName?.message}
            // value={selection.collectionName}
            disabled
          />
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

// useUnrevealedTokensMutation,
// const unrevealedTokens = async (unrevealedColName) => {

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
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    reset({
      unrevealedColName: selection.collectionName,
    });
  }, [selection.collectionName, reset]);

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

//   useSyncWithNgMutation,

export {
  PreSaleForm,
  WhitelistForm,
  CreateNGCollectionForm,
  UnrevealedTokensForm,
};
