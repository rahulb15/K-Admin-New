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

const API_HOST = NETWORK;
const client = createClient(API_HOST);
const signWithChainweaver = createSignWithChainweaver();
const eckoWallet = createEckoWalletQuicksign();

const admin =
  "k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf";

const signFunction = async (signedTx) => {
  const transactionDescriptor = await client.submit(signedTx);
  console.log("transactionDescriptor", transactionDescriptor);

  const response = await client.listen(transactionDescriptor, {});
  console.log("response", response);
  return response;
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
        const pactCode = `(free.kmpasstest002.create-collection 
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
            withCapability("free.kmpasstest002.IS_ADMIN"),
            withCapability("free.kmpasstest002.CREATE-COLLECTION"),
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

        const pactCode = `(free.kmpasstest002.get-unrevealed-tokens-for-collection)`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            withCapability("free.kmpasstest002.IS_ADMIN"),
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
  
    //   const pactCode = `(free.kmpasstest002.bulk-sync-with-ng ${accIds})`;
    //   // free.kmpasstest002.MINTPROCESS
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
        const { accIds } = args;
        const account = admin;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.kmpasstest002.bulk-sync-with-ng ${accIds})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            withCapability("free.kmpasstest002.IS_ADMIN"),
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



  }),
});

export const { useCreateCollectionMutation, useUnrevealedTokensMutation } =
  priorityPassApi;
