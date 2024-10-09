import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createClient,
  Pact,
  createSignWithChainweaver,
  createEckoWalletQuicksign,
} from "@kadena/client";
import {
  NETWORKID,
  GAS_PRICE,
  GAS_LIMIT,
  creationTime,
  CHAIN_ID,
  NETWORK,
} from "../constants/contextConstants";
import priorityPassPactFunctions from "utils/pactAdminPriorityPassFunctions";

const API_HOST = NETWORK;
const client = createClient(API_HOST);
const signWithChainweaver = createSignWithChainweaver();
const eckoWallet = createEckoWalletQuicksign();

// const admin =
//   "k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf";
const admin = process.env.REACT_APP_ADMIN_ADDRESS || "";


  const getColCreator = async (colName) => {
    console.log("colName", colName);
    // const pactCode = `(free.lptest001.get-collection-creator ${JSON.stringify(
    //   colName
    // )})`;
    const pactCode = `(${priorityPassPactFunctions.getCollectionCreator} ${JSON.stringify(colName)})`;

  
    const transaction = Pact.builder
      .execution(pactCode)
      .setMeta({ chainId: CHAIN_ID })
      .createTransaction();
  
    const response = await client.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });
  
    if (response.result.status == "success") {
      // alert(`Sale is live`);
      console.log(response.result.data);
      return response.result.data;
    } else {
      alert(`CHECK CONSOLE`);
    }
  };

const signFunction = async (signedTx) => {
  const transactionDescriptor = await client.submit(signedTx);
  console.log("transactionDescriptor", transactionDescriptor);

  const response = await client.listen(transactionDescriptor, {});
  console.log("response", response);
  return response;
};
const collection_id = async () => {
  // const pactCode = `(free.kmpasstest003.get-collection-id)`;
  const pactCode = `(${priorityPassPactFunctions.getCollectionId})`;
  const transaction = Pact.builder
    .execution(pactCode)
    .setMeta({ chainId: CHAIN_ID })
    .setNetworkId(NETWORKID)
    .createTransaction();

  const response = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  if (response.result.status == "success") {
    let colId = response.result.data;
    // alert(`Collection Id: ${colId}`);
    console.log(colId);
    return colId;
  }
};

export const priorityPassApi = createApi({
  reducerPath: "priorityPassApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_HOST }),
  endpoints: (builder) => ({
    createCollection: builder.mutation({
      async queryFn(args) {
        const {
          totalSupply,
          creator,
          collectionRequestUriList,
          mintPrice,
          policy,
          wallet,
        } = args;
        console.log("Total Supply", totalSupply);
        console.log("Creator", creator);
        console.log("URI List", collectionRequestUriList);
        console.log("Mint Price", mintPrice);
        console.log("Policy", policy);

        const account = creator;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };
        // const pactCode = `(free.kmpasstest003.create-collection 
        const pactCode = `(${priorityPassPactFunctions.createCollection}
                            ${totalSupply}
                            (read-keyset 'guard)
                            ${JSON.stringify(account)}
                            ${JSON.stringify(collectionRequestUriList)}
                            ${parseFloat(mintPrice).toFixed(1)}
                                  ${JSON.stringify(policy)}
)`;
        console.log("pactCode", pactCode);
        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            // withCapability("free.kmpasstest003.IS_ADMIN"),
            // withCapability("free.kmpasstest003.CREATE-COLLECTION"),
            withCapability(priorityPassPactFunctions.isAdmin),
            withCapability(priorityPassPactFunctions.createCollectionCapability),
          ])
          .setMeta({
            creationTime: creationTime(),
            sender: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        console.log("create_collection", txn);
        console.log("sign");

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }
            console.log("sign1");
            const response = await signFunction(signedTx);
            if (response.result.data === true) {
              console.log(
                `Collection: ${args.collectionRequestName} Created Successfully`
              );
            }
            console.log("response", response);
            return { data: response };
          } else {
            console.log("Error in local response", localResponse.result.error);
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    unrevealedTokens: builder.mutation({
      async queryFn(args) {
        console.log("args", args);
        const account = admin;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.kmpasstest003.get-unrevealed-tokens-for-collection)`;
        const pactCode = `(${priorityPassPactFunctions.getUnrevealedTokensForCollection})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            // withCapability("free.kmpasstest003.IS_ADMIN"),
            withCapability(priorityPassPactFunctions.isAdmin),
          ])
          .setMeta({
            creationTime: creationTime(),
            sender: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        console.log("unrevealedTokens", txn);
        console.log("sign");

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          if (localResponse.result.status === "success") {
            console.log(localResponse.result.data);
            return { data: localResponse.result.data };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    // const sync_with_ng = async (accIds) => {
    //   const colId = await collection_id();
    //   console.log(colId);
    //   console.log("Account IDs", accIds);
    //   const account = admin;
    //   const publicKey = account.slice(2, account.length);
    //   const guard = { keys: [publicKey], pred: "keys-all" };

    //   const pactCode = `(free.kmpasstest003.bulk-sync-with-ng ${accIds})`;
    //   // free.kmpasstest003.MINTPROCESS
    //   const txn = Pact.builder
    //     .execution(pactCode)
    //     .addData("guard", guard)
    //     .addData("marmalade_collection", { id: colId })
    //     .addSigner(publicKey)
    //     // .addSigner(publicKey, (withCapability) => [
    //     //   withCapability("coin.GAS"),
    //     //   withCapability("free.lptest001.MINTPROCESS", syncColName),
    //     // ])
    //     .setMeta({
    //       creationTime: creationTime(),
    //       sender: account,
    //       gasLimit: 150000,
    //       chainId: CHAIN_ID,
    //       ttl: 28800,
    //     })
    //     .setNetworkId(NETWORK_ID)
    //     .createTransaction();

    //   console.log("syncWithNg", txn);
    //   console.log("sign");

    //   const localResponse = await client.local(txn, {
    //     preflight: false,
    //     signatureVerification: false,
    //   });

    //   if (localResponse.result.status == "success") {
    //     let signedTx;
    //     if (wallet == "ecko") {
    //       signedTx = await eckoWallet(txn);
    //     }
    //     if (wallet == "CW") {
    //       signedTx = await signWithChainweaver(txn);
    //     }
    //     console.log("sign1");
    //     const response = await signFunction(signedTx);
    //     console.log("response", response);
    //   } else {
    //     console.log("Error in local response", localResponse.result.error);
    //   }
    // };
    syncWithNg: builder.mutation({
      async queryFn(args) {
        console.log("args", args);

        const { syncTkns } = args;
        console.log("syncTkns", syncTkns);
        const colId = await collection_id();
        console.log(colId);
        const account = admin;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };
        const formattedSyncTkns = `[${syncTkns}]`;
        const accIds = formattedSyncTkns;
        console.log("Account IDs", accIds);
        // const pactCode = `(free.kmpasstest003.bulk-sync-with-ng ${accIds})`;
        const pactCode = `(${priorityPassPactFunctions.bulkSyncWithNg} ${accIds})`;
        console.log("pactCode", pactCode);

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addData("marmalade_collection", { id: colId })
          .addSigner(publicKey)
          // .addSigner(publicKey, (withCapability) => [
          //   withCapability("coin.GAS"),
          //   withCapability("free.lptest001.MINTPROCESS", syncColName),
          // ])
          .setMeta({
            creationTime: creationTime(),
            sender: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        console.log("syncWithNg", txn);
        console.log("sign");

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          if (localResponse.result.status === "success") {
            let signedTx;
            if (args.wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (args.wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }
            console.log("sign1");
            const response = await signFunction(signedTx);
            console.log("response", response);
            return { data: response };
          } else {
            console.log("Error in local response", localResponse.result.error);
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    addPolicies: builder.mutation({
      async queryFn(args) {
        const { collectionName, collectionRequestPolicy, wallet } = args;
        console.log("addPolicies args:", args);
        const account = await getColCreator(collectionName);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.add-policies ${JSON.stringify(
        const pactCode = `(${priorityPassPactFunctions.addPolicies} ${JSON.stringify(
          collectionName
        )} (read-keyset 'guard) ${JSON.stringify(collectionRequestPolicy)})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
          ])
          .setMeta({
            creationTime: creationTime(),
            sender: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }

            const response = await signFunction(signedTx);
            return { data: response };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    replacePolicies: builder.mutation({
      async queryFn(args) {
        const { collectionName, collectionRequestPolicy, wallet } = args;
        console.log("replacePolicies args:", args);
        const account = await getColCreator(collectionName);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.replace-policies ${JSON.stringify(
        const pactCode = `(${priorityPassPactFunctions.replacePolicies} ${JSON.stringify(
          collectionName
        )} (read-keyset 'guard) ${JSON.stringify(collectionRequestPolicy)})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
          ])
          .setMeta({
            creationTime: creationTime(),
            sender: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }

            const response = await signFunction(signedTx);
            return { data: response.result };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    getPolicies: builder.mutation({
      async queryFn(args) {
        const { collectionName } = args;
        console.log("collectionName", collectionName);
        const colId = await collection_id();
        console.log(colId);
        // const pactCode = `(free.kmpasstest003.get-policies-of-collection)`;
        const pactCode = `(${priorityPassPactFunctions.getPoliciesOfCollection})`;


        const transaction = Pact.builder
          .execution(pactCode)
          .setMeta({ chainId: CHAIN_ID })
          .setNetworkId(NETWORKID)
          .createTransaction();

        try {
          const response = await client.local(transaction, {
            preflight: false,
            signatureVerification: false,
          });

          console.log("response", response.result);

          if (response.result.status === "success") {
            let policies = response.result.data;
            console.log("Policies in service:", policies);
            return { data: policies };
          } else {
            throw new Error(response.result.error);
          }
        } catch (error) {
          console.error("Error in getPolicies:", error);
          return { error: { message: error.message } };
        }
      },
    }),

    addPassUser: builder.mutation({
      async queryFn(args) {
        const { priorityUsers, admin, wallet } = args;
        console.log("args", args);
        const publicKey = admin.slice(2);
        const guard = { keys: [publicKey], pred: "keys-all" };
        
        // Modified part: Format priorityUsers with quotes and without commas
        const formattedUsers = priorityUsers.map(user => `"${user}"`).join(" ");
        // const pactCode = `(free.lptest001.add-priority-users [${formattedUsers}])`;
        const pactCode = `(${priorityPassPactFunctions.addPriorityUsers} [${formattedUsers}])`;
        console.log("pactCode", pactCode);
    
        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            // withCapability("free.lptest001.PRIORITY"),
            withCapability(priorityPassPactFunctions.priorityCapability),
          ])
          .setMeta({
            creationTime: creationTime(),
            sender: admin,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();
    
        console.log("Transaction details:", txn);
    
        try {
          console.log("sign");
    
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });
    
          console.log("localResponse", localResponse.result);
    
          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }
    
            const response = await signFunction(signedTx);
    
            return { data: response.result };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    updatePrice: builder.mutation({
      async queryFn(args) {
        const { price, wallet } = args;
        console.log("updatePrice args:", args);
        const account = admin;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        let decimalPrice;
        const calculateDecimal = (price) => {
          const priceString = price.toString();
          const priceArray = priceString.split(".");
          if (priceArray.length === 1) {
            decimalPrice = `${priceArray[0]}.0`;
          } else {
            decimalPrice = priceString;
          }
        };
        calculateDecimal(price);

        // const pactCode = `(free.kmpasstest003.update-price ${decimalPrice})`;
        const pactCode = `(${priorityPassPactFunctions.updatePrice} ${decimalPrice})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey)
          .setMeta({
            creationTime: creationTime(),
            sender: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        console.log("updatePrice txn", txn);

        try {
          console.log("sign");

          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          console.log("localResponse", localResponse.result);

          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }

            const response = await signFunction(signedTx);

            return { data: response.result };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const {
  useCreateCollectionMutation,
  useUnrevealedTokensMutation,
  useSyncWithNgMutation,
  useAddPoliciesMutation,
  useReplacePoliciesMutation,
  useGetPoliciesMutation,
  useAddPassUserMutation,
  useUpdatePriceMutation,
} = priorityPassApi;
