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

const getColCreator = async (colName) => {
  console.log("colName", colName);
  const pactCode = `(free.lptest001.get-collection-creator ${JSON.stringify(
    colName
  )})`;

  const transaction = Pact.builder
    .execution(pactCode)
    .setMeta({ chainId: "1" })
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

export const launchpadApi = createApi({
  reducerPath: "launchpadApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_HOST }),
  endpoints: (builder) => ({
    collectionRequest: builder.mutation({
      async queryFn(args) {
        const {
          collectionRequestName,
          collectionRequestSymbol,
          collectionRequestCreator,
          collectionRequestDescription,
          collectionRequestCategory,
          collectionRequestSupply,
          collectionRequestUriList,
          collectionRequestMintPrice,
          collectionRequestRoyalityPerc,
          collectionRequestRoyalityAddress,
          collectionRequestCoverImgUrl,
          collectionRequestBannerImgUrl,
          collectionRequestStartDate,
          collectionRequesEndDate,
          collectionRequestEnableFreeMint,
          collectionRequestEnableWl,
          collectionRequestEnablePresale,
          collectionRequestEnableAirdrop,
          collectionRequestPolicy,
          walletName,
        } = args;
        console.log(args);

        const account = collectionRequestCreator;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.lptest001.nft-collection-request 
          ${JSON.stringify(collectionRequestName)}  
          ${JSON.stringify(collectionRequestSymbol)}  
          ${JSON.stringify(account)}        
          (read-keyset "guard")
          ${JSON.stringify(collectionRequestDescription)}
          ${JSON.stringify(collectionRequestCategory)}
          ${collectionRequestSupply}
          ${JSON.stringify(collectionRequestUriList)}
          ${collectionRequestMintPrice}
          ${collectionRequestRoyalityPerc}
          ${JSON.stringify(collectionRequestRoyalityAddress)}
          ${JSON.stringify(collectionRequestCoverImgUrl)}
          ${JSON.stringify(collectionRequestBannerImgUrl)}
          ${JSON.stringify(collectionRequestStartDate)}
          (time "2024-03-22T14:00:00Z")
          ${JSON.stringify(collectionRequesEndDate)}       
          (time "2025-03-22T14:00:00Z") 
          ${collectionRequestEnableFreeMint}                 
          ${collectionRequestEnableWl} 
          ${collectionRequestEnablePresale} 
          ${collectionRequestEnableAirdrop} 
          ${JSON.stringify(collectionRequestPolicy)}
        )`;

        console.log(pactCode);

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            withCapability("coin.TRANSFER", account, admin, 1.0),
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
            if (walletName === "EckoWallet") {
              console.log("ECKO");
              signedTx = await eckoWallet(txn);
            } else if (walletName === "Chainweaver") {
              console.log("Chainweaver");

              signedTx = await signWithChainweaver(txn);
            }

            const response = await signFunction(signedTx);
            console.log("response", response);

            return { data: response };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    launchCollection: builder.mutation({
      async queryFn(args) {
        const { launchCollectionName, wallet } = args;
        console.log("chainId", CHAIN_ID);
        console.log(args);
        const account = admin;
        console.log(account);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.lptest001.launch-collection ${JSON.stringify(
          launchCollectionName
        )})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            withCapability("free.lptest001.IS_ADMIN"),
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

        console.log("launch_collection", txn);

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
            if (response.result.status === "success") {
              console.log(
                `Collection: ${launchCollectionName} Has Launched Successfully`
              );
            }
            return { data: response };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    createNgCollection: builder.mutation({
      async queryFn(args) {
        const { collectionName, wallet } = args;
        console.log(collectionName);
        const account = await getColCreator(collectionName);
        const publicKey = account.slice(2, account.length);
        console.log(publicKey);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.lptest001.create-ng-collection ${JSON.stringify(
          collectionName
        )}
                                                                    ${JSON.stringify(
                                                                      account
                                                                    )}
                                                                    (read-keyset "guard"))`;

        const create_Ng_Collection = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey)
          .setMeta({
            creationTime: creationTime(),
            senderAccount: account,
            gasLimit: 150000,
            chainId: CHAIN_ID,
            ttl: 28800,
          })
          .setNetworkId(NETWORKID)
          .createTransaction();

        console.log("createNgCollection", create_Ng_Collection);

        try {
          const localResponse = await client.local(create_Ng_Collection, {
            preflight: false,
            signatureVerification: false,
          });

          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(create_Ng_Collection);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(create_Ng_Collection);
            }

            const response = await signFunction(signedTx);
            if (response.result.status === "success") {
              console.log(
                `Collection: ${collectionName} Successfully synced with NG`
              );
            }
            return { data: response };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    createPresale: builder.mutation({
      async queryFn(args) {
        const {
          createPresaleCol,
          createPresalePrice,
          createPresaleStartDate,
          createPresaleStartTime,
          createPresaleEndDate,
          createPresaleEndTime,
          createPresaleAdd,
          wallet,
        } = args;
        console.log("args", args);

        const account = await getColCreator(createPresaleCol);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.lptest001.create-presale 
          ${JSON.stringify(account)} 
          (read-keyset "guard")  
          ${JSON.stringify(createPresaleCol)} 
          ${createPresalePrice} 
          ${JSON.stringify(createPresaleStartDate)} 
          (${createPresaleStartTime}) 
          ${JSON.stringify(createPresaleEndDate)} 
          (${createPresaleEndTime})
          ["k:a2ff4689f89f0f3bb6a32fa35b8547c0cb4070f6b4af76fb53892f44fe1f9069"]
          )`;
        console.log("pactCode", pactCode);

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
        console.log("txn", txn);
        console.log("pactCode2", pactCode);

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });
          console.log("localResponse", localResponse);
          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              console.log("ecko1212");
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

    createWl: builder.mutation({
      async queryFn(args) {
        const {
          createWlCol,
          createWlAdd,
          createWlPrice,
          createWlStartTime,
          wallet,
        } = args;
        console.log("args", args);

        const account = await getColCreator(createWlCol);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.lptest001.create-whitelist 
          ${JSON.stringify(createWlCol)} 
          ${JSON.stringify(account)}
          (read-keyset "guard")    
          ["k:a2ff4689f89f0f3bb6a32fa35b8547c0cb4070f6b4af76fb53892f44fe1f9069"]              
          ${createWlPrice}
          (${createWlStartTime})
        )`;
        console.log("pactCode", pactCode);

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

    createAirdrop: builder.mutation({
      async queryFn(args) {
        const { createAirdropCol, createAirdropAdd, wallet } = args;

        const account = await getColCreator(createAirdropCol);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(free.lptest001.create-airdrop  
          ${JSON.stringify(createAirdropCol)} 
          (read-keyset "guard") 
          ${createAirdropAdd})`;

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
  }),
});

export const {
  useCollectionRequestMutation,
  useLaunchCollectionMutation,
  useCreateNgCollectionMutation,
  useCreatePresaleMutation,
  useCreateWlMutation,
  useCreateAirdropMutation,
} = launchpadApi;
