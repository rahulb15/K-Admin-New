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
import launchpadPactFunctions from "utils/pactAdminLaunchpadFunctions";

const API_HOST = NETWORK;
const client = createClient(API_HOST);
const signWithChainweaver = createSignWithChainweaver();
const eckoWallet = createEckoWalletQuicksign();
const coin_fungible = {
  refSpec: [{ namespace: null, name: "fungible-v2" }],
  refName: { namespace: null, name: "coin" },
};
// const admin =
//   "k:56609bf9d1983f0c13aaf3bd3537fe00db65eb15160463bb641530143d4e9bcf";
const admin = process.env.REACT_APP_ADMIN_ADDRESS || "";

const signFunction = async (signedTx) => {
  const transactionDescriptor = await client.submit(signedTx);
  console.log("transactionDescriptor", transactionDescriptor);

  const response = await client.listen(transactionDescriptor, {});
  console.log("response", response);
  return response;
};

let uriRndList = [
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/1.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/2.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/3.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/4.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/5.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/6.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/7.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/8.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/9.json",
  "https://gateway.pinata.cloud/ipfs/QmUUidPw6CaANMidfF6ZmU6B5AHqwzpG6qRXGBxapzZj5Z/10.json",
];

// Function to select random URIs for the given token IDs
function selectRandomUris(uriArray, tokenIds) {
  const selectedUris = [];
  for (let i = 0; i < tokenIds.length; i++) {
    if (uriArray.length === 0) {
      console.error("No URIs available for selection.");
      break; // Exit if there are no more URIs
    }
    const randomIndex = Math.floor(Math.random() * uriArray.length);
    selectedUris.push(uriArray[randomIndex]);
    uriArray.splice(randomIndex, 1); // Remove selected URI from the array
  }
  return selectedUris;
}

const getColCreator = async (colName) => {
  console.log("colName", colName);
  // const pactCode = `(free.lptest001.get-collection-creator ${JSON.stringify(
  //   colName
  // )})`;
  const pactCode = `(${
    launchpadPactFunctions.getCollectionCreator
  } ${JSON.stringify(colName)})`;

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

const collectionId = async (colNameId) => {
  // const pactCode = `(free.lptest001.get-collection-id ${JSON.stringify(
  //   colNameId
  // )})`;
  const pactCode = `(${launchpadPactFunctions.getCollectionId} ${JSON.stringify(
    colNameId
  )})`;

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

const getRoyaltyAddress = async (colName) => {
  // const colName = "K/C-CW-105";
  // const pactCode = `(free.lptest001.get-royalty-info ${JSON.stringify(colName)} "account")`;
  const pactCode = `(${launchpadPactFunctions.getRoyaltyInfo} ${JSON.stringify(
    colName
  )} "account")`;

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
    // console.log(response.result.data);
    return response.result.data;
  } else {
    console.log(response.result.error);
  }
};

// const getRoyaltyPerc = async (colName) => {
const getRoyaltyPerc = async (colName) => {
  // const colName = "K/C-CW-105";

  // const pactCode = `(free.lptest001.get-royalty-info ${JSON.stringify(colName)} "rate")`;
  const pactCode = `(${launchpadPactFunctions.getRoyaltyInfo} ${JSON.stringify(
    colName
  )} "rate")`;

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
    // console.log(response.result.data);
    return response.result.data;
  } else {
    console.log(response.result.error);
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

        // const pactCode = `(free.lptest001.nft-collection-request
        const pactCode = `(${launchpadPactFunctions.nftCollectionRequest}
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

        // const pactCode = `(free.lptest001.launch-collection ${JSON.stringify(
        //   launchCollectionName
        // )})`;
        const pactCode = `(${
          launchpadPactFunctions.launchCollection
        } ${JSON.stringify(launchCollectionName)})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            // withCapability("free.lptest001.IS_ADMIN"),
            withCapability(launchpadPactFunctions.isAdmin),
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

    denyCollection: builder.mutation({
      async queryFn(args) {
        const { launchCollectionName, wallet } = args;
        console.log("denyCollection args:", args);
        
        const account = admin;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        const pactCode = `(${launchpadPactFunctions.denyCollection} ${JSON.stringify(launchCollectionName)})`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            withCapability(launchpadPactFunctions.isAdmin),
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

        console.log("denyCollection transaction:", txn);

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          console.log("localResponse", localResponse);

          if (localResponse?.result?.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            } else {
              throw new Error("Unsupported wallet");
            }

            const response = await signFunction(signedTx);
            if (response?.result?.status === "success") {
              console.log(`Collection ${launchCollectionName} has been successfully denied`);
            }
            return { data: response };
          } else {
            return { error: localResponse?.result?.error };
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

        // const pactCode = `(free.lptest001.create-ng-collection ${JSON.stringify(
        //   collectionName
        // )}
        const pactCode = `(${
          launchpadPactFunctions.createNgCollection
        } ${JSON.stringify(collectionName)}
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

    collectionId: builder.mutation({
      async queryFn(args) {
        const { colNameId } = args;
        console.log("colNameId", colNameId);
        // const pactCode = `(free.lptest001.get-collection-id ${JSON.stringify(
        //   colNameId
        // )})`;
        const pactCode = `(${
          launchpadPactFunctions.getCollectionId
        } ${JSON.stringify(colNameId)})`;

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
          console.log(colId);
          return colId;
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

        // const pactCode = `(free.lptest001.create-presale
        const pactCode = `(${launchpadPactFunctions.createPresale}
          ${JSON.stringify(account)} 
          (read-keyset "guard")  
          ${JSON.stringify(createPresaleCol)} 
          ${createPresalePrice} 
          ${JSON.stringify(createPresaleStartDate)} 
          (${createPresaleStartTime}) 
          ${JSON.stringify(createPresaleEndDate)} 
          (${createPresaleEndTime})
          ${createPresaleAdd}
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

        // const pactCode = `(free.lptest001.create-whitelist
        const pactCode = `(${launchpadPactFunctions.createWhitelist}
          ${JSON.stringify(createWlCol)} 
          ${JSON.stringify(account)}
          (read-keyset "guard")    
          ${createWlAdd}              
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

    addWlAccounts: builder.mutation({
      async queryFn(args) {
        const { collectionName, accounts, wallet } = args;
        console.log("args", args);
        const account = await getColCreator(collectionName);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.add-wl-accounts ${JSON.stringify(collectionName)}
        //                   ${JSON.stringify(accounts)}
        //                   (read-keyset "guard"))`;
        const pactCode = `(${
          launchpadPactFunctions.addWlAccounts
        } ${JSON.stringify(collectionName)}
                          ${JSON.stringify(accounts)}
                          (read-keyset "guard"))`;

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
          console.log("localResponse.result.status", localResponse);

          if (localResponse.result.status === "success") {
            let signedTx;
            if (wallet === "ecko") {
              signedTx = await eckoWallet(txn);
            } else if (wallet === "CW") {
              signedTx = await signWithChainweaver(txn);
            }

            const response = await signFunction(signedTx);
            console.log("response580", response);
            return { data: response };
          } else {
            return { error: localResponse.result.error };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    addPresaleAccounts: builder.mutation({
      async queryFn(args) {
        const { collectionName, accounts, wallet } = args;
        console.log("args", args);
        const account = await getColCreator(collectionName);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.add-presale-accounts ${JSON.stringify(collectionName)}
        const pactCode = `(${
          launchpadPactFunctions.addPresaleAccounts
        } ${JSON.stringify(collectionName)} 
                          ${JSON.stringify(accounts)} 
                          (read-keyset "guard"))`;

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

        // const pactCode = `(free.lptest001.create-airdrop
        const pactCode = `(${launchpadPactFunctions.createAirdrop}  
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
    unrevealedTokens: builder.mutation({
      async queryFn(args) {
        const { unrevealedColName } = args;
        console.log("unrevealedColName", unrevealedColName);
        const account = await getColCreator(unrevealedColName);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.get-unrevealed-tokens-for-collection ${JSON.stringify(
        const pactCode = `(${
          launchpadPactFunctions.getUnrevealedTokensForCollection
        } ${JSON.stringify(unrevealedColName)} (read-keyset  "guard"))`;

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

        console.log("unrevealedTokens", txn);

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

    syncWithNg: builder.mutation({
      async queryFn(args, api, extraOptions, baseQuery) {
        const { syncColName, syncTkns, wallet, selectedUris } = args;
        console.log("args", args);

        // {
        //   syncColName: 'KM-Monkey-Test001',
        //   syncTkns: '1',
        //   selectedUris: [

        //       'https://ipfs.filebase.io/ipfs/QmSM2kTZ9ZG9UZi9sL8bnWwbse6iKqX6c1iijZCW4GW6Xs/1.json'
        //   ],
        //   wallet: 'ecko'
        // }
        // const colId = await api
        //   .dispatch(
        //     launchpadApi.endpoints.collectionId.initiate({
        //       colNameId: syncColName,
        //     })
        //   )
        //   .unwrap();
        //   console.log("colId", colId);
        const colId = await collectionId(syncColName);
        const account = await getColCreator(syncColName);
        console.log("account", account);

        const royaltyAddress = await getRoyaltyAddress(syncColName);
        const royaltyPerc = await getRoyaltyPerc(syncColName);

        console.log(
          `royaltyAddress: ${royaltyAddress}, royaltyPerc: ${royaltyPerc}`
        );

        const publicKey = account.slice(2, account.length);
        const publicKeyRoyalty = royaltyAddress.slice(2, royaltyAddress.length);
        const guard = { keys: [publicKey], pred: "keys-all" };
        const guardRoyalty = { keys: [publicKeyRoyalty], pred: "keys-all" };
        const formattedSyncTkns = `[${syncTkns}]`;
        const formattedUris = selectedUris.map((uri) => `"${uri}"`).join(" ");

        // const pactCode = `(free.lptest001.bulk-sync-with-ng ${JSON.stringify(
        const pactCode = `(${
          launchpadPactFunctions.bulkSyncWithNg
        } ${JSON.stringify(syncColName)} ${formattedSyncTkns}
        [${formattedUris}]
        )`;

        console.log(pactCode);

        let txn;

        if (royaltyAddress != "" && royaltyPerc > 0.0 && royaltyPerc <= 1.0) {
          txn = Pact.builder
            .execution(pactCode)
            .addData("guard", guard)
            .addData("marmalade_collection", { id: colId })
            .addData("marmalade_royalty", {
              creator_acct: royaltyAddress,
              creator_guard: guardRoyalty,
              rate: royaltyPerc,
              currencies: [coin_fungible],
            })
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
        } else {
          txn = Pact.builder
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
        }

        console.log("syncWithNg", txn);
        console.log("sign");

        try {
          const localResponse = await client.local(txn, {
            preflight: false,
            signatureVerification: false,
          });

          console.log("response", localResponse.result.data);

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
    balance: builder.mutation({
      async queryFn(args) {
        try {
          const { account } = args;
          console.log("account", account);

          // const pactCode = `(coin.get-balance (read-string "account"))`;
          // const pactCode = `(${launchpadPactFunctions.getBalance} (read-string ${JSON.stringify(account)}))`;
          const pactCode = `(${launchpadPactFunctions.getBalance} (read-string "account"))`;
          const transaction = Pact.builder
            .execution(pactCode)
            .setMeta({ chainId: CHAIN_ID })
            .addData("account", account)
            .setNetworkId(NETWORKID)
            .createTransaction();

          const staticClient = createClient(API_HOST);

          const response = await staticClient.local(transaction, {
            preflight: false,
            signatureVerification: false,
          });

          console.log(response);
          return { data: response.result.data };
        } catch (error) {
          return { error: error.toString() };
        }
      },
    }),

    transfer: builder.mutation({
      async queryFn(args) {
        const { receiver, amount, wallet } = args;
        console.log("receiver", receiver);
        console.log("amount", amount);
        const sender = admin;
        const receiverKey = receiver.slice(2, receiver.length);
        const senderKey = sender.slice(2, receiver.length);
        const guard = { keys: [receiverKey], pred: "keys-all" };

        // const pactCode = `(coin.transfer-create (read-string "sender") (read-string "receiver") (read-keyset "guard") ${parseFloat(
        const pactCode = `(${
          launchpadPactFunctions.transferCreate
        } (read-string "sender") (read-string "receiver") (read-keyset "guard") ${parseFloat(
          amount
        ).toFixed(1)})`;
        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addData("sender", admin)
          .addData("receiver", receiver)
          .addSigner(senderKey, (withCapability) => [
            withCapability("coin.GAS"),
            withCapability("coin.TRANSFER", sender, receiver, amount),
          ])
          .setMeta({ chainId: CHAIN_ID, sender })
          .setNetworkId(NETWORKID)
          .createTransaction();

        console.log("transaction", txn);

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

    addRole: builder.mutation({
      async queryFn(args) {
        const { role, address, wallet } = args;
        console.log("Adding role:", role, "to address:", address);

        const account = admin;
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.add-roles "${role}" ["${address}"])`;
        const pactCode = `(${launchpadPactFunctions.addRoles} "${role}" ["${address}"])`;

        const txn = Pact.builder
          .execution(pactCode)
          .addData("guard", guard)
          .addSigner(publicKey, (withCapability) => [
            withCapability("coin.GAS"),
            // withCapability("free.lptest001.IS_ADMIN"),
            withCapability(launchpadPactFunctions.isAdmin),
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

        console.log("addRole transaction:", txn);

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
            } else {
              throw new Error("Unsupported wallet");
            }

            const response = await signFunction(signedTx);
            if (response.result.status === "success") {
              console.log(`Role ${role} successfully added to ${address}`);
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

    addPolicies: builder.mutation({
      async queryFn(args) {
        const { collectionName, collectionRequestPolicy, wallet } = args;
        console.log("addPolicies args:", args);
        const account = await getColCreator(collectionName);
        const publicKey = account.slice(2, account.length);
        const guard = { keys: [publicKey], pred: "keys-all" };

        // const pactCode = `(free.lptest001.add-policies ${JSON.stringify(collectionName)} (read-keyset 'guard) ${JSON.stringify(collectionRequestPolicy)})`;
        const pactCode = `(${
          launchpadPactFunctions.addPolicies
        } ${JSON.stringify(
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

        // const pactCode = `(free.lptest001.replace-policies ${JSON.stringify(collectionName)} (read-keyset 'guard) ${JSON.stringify(collectionRequestPolicy)})`;
        const pactCode = `(${
          launchpadPactFunctions.replacePolicies
        } ${JSON.stringify(
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
        // const pactCode = `(free.lptest001.get-policy-of-collection ${JSON.stringify(
        const pactCode = `(${
          launchpadPactFunctions.getPolicyOfCollection
        } ${JSON.stringify(collectionName)})`;

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

          if (response.result.status === "success") {
            let policies = response.result.data;
            console.log("Policies in service:", policies);
            return { data: policies }; // Return the policies data
          } else {
            throw new Error(response.result.error);
          }
        } catch (error) {
          console.error("Error in getPolicies:", error);
          return { error: { message: error.message } };
        }
      },
    }),

    // updatePrice: builder.mutation({
    //   async queryFn(args) {
    //     const { collectionName, wattetAddress,price, wallet } = args;
    //     console.log("updatePrice args:", args);
    //     // const account = await getColCreator(collectionName);
    //     const account = wattetAddress;
    //     console.log("account", account);
    //     const publicKey = account.slice(2, account.length);
    //     const guard = { keys: [publicKey], pred: "keys-all" };

    //     // const pactCode = `(free.kmpasstest003.update-price ${price})`;
    //     const pactCode = `(${launchpadPactFunctions.updatePrice} ${price})`;

    //     const txn = Pact.builder
    //       .execution(pactCode)
    //       .addData("guard", guard)
    //       .addSigner(publicKey, (withCapability) => [
    //         withCapability("coin.GAS"),
    //       ])
    //       .setMeta({
    //         creationTime: creationTime(),
    //         sender: account,
    //         gasLimit: 150000,
    //         chainId: CHAIN_ID,
    //         ttl: 28800,
    //       })
    //       .setNetworkId(NETWORKID)
    //       .createTransaction();

    //     console.log("updatePrice txn", txn);

    //     try {
    //       const client = new Pact.Pact(NETWORKID);
    //       const localResponse = await client.local(txn, {
    //         preflight: false,
    //         signatureVerification: false,
    //       });

    //       if (localResponse.result.status === "success") {
    //         let signedTx;
    //         if (wallet === "ecko") {
    //           signedTx = await eckoWallet(txn);
    //         } else if (wallet === "CW") {
    //           signedTx = await signWithChainweaver(txn);
    //         }

    //         const response = await signFunction(signedTx);

    //         return { data: response.result };
    //       } else {
    //         return { error: localResponse.result.error };
    //       }
    //     } catch (error) {
    //       return { error: error.message };
    //     }
    //   },
    // }),

    updatePrice: builder.mutation({
      async queryFn(args) {
        const { collectionName, wattetAddress,price, wallet } = args;
    console.log("updatePrice args:", args);
        const account = wattetAddress;
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

        const pactCode = `(free.lptest003.update-public-price ${JSON.stringify(collectionName)} (read-keyset 'guard) ${decimalPrice})`;
        // const pactCode = `(${launchpadPactFunctions.updatePrice} ${price})`;

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
  useCollectionRequestMutation,
  useLaunchCollectionMutation,
  useDenyCollectionMutation,
  useCreateNgCollectionMutation,
  useCollectionIdMutation,
  useCreatePresaleMutation,
  useCreateWlMutation,
  useAddWlAccountsMutation,
  useAddPresaleAccountsMutation,
  useCreateAirdropMutation,
  useUnrevealedTokensMutation,
  useSyncWithNgMutation,
  useBalanceMutation,
  useTransferMutation,
  useAddRoleMutation,
  useAddPoliciesMutation,
  useReplacePoliciesMutation,
  useGetPoliciesMutation,
  useUpdatePriceMutation,
} = launchpadApi;
