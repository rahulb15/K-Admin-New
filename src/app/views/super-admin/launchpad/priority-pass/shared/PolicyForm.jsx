import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { setRefresh } from "features/refreshSlice";
import { setModalOpen } from "features/launchpadModalActionSlice";
import {
  useAddPoliciesMutation,
  useReplacePoliciesMutation,
  useGetPoliciesMutation,
} from "services/prioritypass.service";



// * "INSTANT-MINT NON-FUNGIBLE COLLECTION DISABLE-BURN DISABLE-TRANSFER DISABLE-SALE"
const policyList = [
  "INSTANT-MINT",
  "NON-FUNGIBLE",
  "COLLECTION",
  "DISABLE-BURN",
  "DISABLE-TRANSFER",
  "DISABLE-SALE",
];

const schema = yup.object().shape({
  collectionName: yup.string().required("Collection name is required"),
  policies: yup
    .array()
    .of(yup.string())
    .min(1, "At least one policy must be selected"),
});

const PolicyManagementForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: "",
      policies: [],
    },
  });
  const dispatch = useDispatch();
  const selection = useSelector(
    (state) => state?.selectionLaunchpad?.selection
  );
  console.log("selection", selection);
  const [action, setAction] = useState("add");
  const [addPolicies, { isLoading: isAddLoading, error: addError }] = useAddPoliciesMutation();
  const [replacePolicies, { isLoading: isReplaceLoading, error: replaceError }] = useReplacePoliciesMutation();
  const [getPolicies, { isLoading: isGetLoading, error: getError }] = useGetPoliciesMutation();
  const { user } = useAuth();
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);

  useEffect(() => {
    const fetchPolicies = async () => {
      // if (selection?.collectionName) {
        // setValue("collectionName", selection.collectionName);
        setIsLoadingPolicies(true);
        try {
          const result = await getPolicies({
            collectionName: selection?.collectionName || "priority_pass_006"
          });
          
          console.log("Result from getPolicies:", result);

          if (result.data) {
            const policiesString = result.data;
            console.log("Policies string:", policiesString);
            
            if (typeof policiesString === 'string') {
              const policiesArray = policiesString.split(' ').filter(policy => policyList.includes(policy));
              console.log("Filtered policies array:", policiesArray);
              setValue("policies", policiesArray);
            } else {
              console.error("Unexpected policies data type:", typeof policiesString);
            }
          } else if (result.error) {
            throw new Error(result.error.message);
          } else {
            console.error("Unexpected result structure:", result);
          }
        } catch (error) {
          console.error("Error fetching policies:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Failed to fetch policies: ${error.message}`,
          });
        } finally {
          setIsLoadingPolicies(false);
        }
      // }
    };

    fetchPolicies();
  }, [selection, setValue, getPolicies]);
  const onSubmit = async (data) => {
    const collectionRequestPolicy = data.policies.join(" ");
    try {
      let result;
      if (action === "add") {
        result = await addPolicies({
          collectionName: data.collectionName,
          collectionRequestPolicy,
          wallet: user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName
        }).unwrap();
      } else {
        result = await replacePolicies({
          collectionName: data.collectionName,
          collectionRequestPolicy,
          wallet: user?.walletName === "Ecko Wallet"
            ? "ecko"
            : user?.walletName === "Chainweaver"
            ? "CW"
            : user?.walletName
        }).unwrap();
      }

      if (result?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Policies ${action === "add" ? "added" : "replaced"} successfully`,
        });
        dispatch(setRefresh(true));
        dispatch(setModalOpen(false));
      } else {
        throw new Error(result?.error?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error ${action === "add" ? "adding" : "replacing"} policies: ${
          error.message
        }`,
      });
    }
  };

  const watchPolicies = watch("policies");
  const isLoading = isAddLoading || isReplaceLoading;
  const error = addError || replaceError || getError;

  if (isLoadingPolicies) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="collectionName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Collection Name"
            fullWidth
            margin="normal"
            error={!!errors.collectionName}
            helperText={errors.collectionName?.message}
            disabled={true}
          />
        )}
      />
      <Typography variant="subtitle1" gutterBottom>
        Select Policies:
      </Typography>
      <FormGroup>
        {policyList.map((policy) => (
          <FormControlLabel
            key={policy}
            control={
              <Controller
                name="policies"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value.includes(policy)}
                    onChange={(e) => {
                      const updatedPolicies = e.target.checked
                        ? [...field.value, policy]
                        : field.value.filter((val) => val !== policy);
                      field.onChange(updatedPolicies);
                    }}
                    disabled={isLoading}
                  />
                )}
              />
            }
            label={policy}
          />
        ))}
      </FormGroup>
      {errors.policies && (
        <Typography color="error">{errors.policies.message}</Typography>
      )}
      {error && (
        <Typography color="error">
          {error?.data?.error?.message || "An error occurred"}
        </Typography>
      )}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAction("add")}
          type="submit"
          sx={{ mr: 1 }}
          disabled={isLoading}
        >
          {isLoading && action === "add" ? <CircularProgress size={24} /> : "Add Policies"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setAction("replace")}
          type="submit"
          disabled={isLoading}
        >
          {isLoading && action === "replace" ? <CircularProgress size={24} /> : "Replace Policies"}
        </Button>
      </Box>
    </form>
  );
};

export default PolicyManagementForm;