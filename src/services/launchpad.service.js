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
    }),
});

export const { useCollectionRequestMutation } = launchpadApi;
