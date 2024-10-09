// export const CHAIN_ID = process.env.REACT_APP_KDA_CHAIN_ID || "0";
// export const PRECISION = Number(process.env.REACT_APP_KDA_PRECISION) || 12;
// export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || "testnet04";
// export const FEE = process.env.REACT_APP_KDA_FEE || 0.003;
// export const APR_FEE = process.env.REACT_APP_APR_FEE || 0.0025;
// export const GAS_PRICE =
//     Number(process.env.REACT_APP_KDA_GAS_PRICE) || 0.0000001;
// export const GAS_LIMIT =
//     Number(process.env.REACT_APP_KDA_GAS_LIMIT) || 100000;
// export const NETWORK_TYPE =
//     process.env.REACT_APP_KDA_NETWORK_TYPE || "testnet";
// export const ENABLE_GAS_STATION =
//     process.env.REACT_APP_ENABLE_GAS_STATION || false;
// export const KADDEX_NAMESPACE =
//     process.env.REACT_APP_KADDEX_NAMESPACE || "kaddex"; //
// export const STAKING_REWARDS_PERCENT =
//     process.env.REACT_APP_STAKING_REWARDS_PERCENT || 0.05;
// export const NETWORK_VERSION =
//     process.env.REACT_APP_KDA_NETWORK_VERSION || "0.0";

// export const KDX_TOTAL_SUPPLY = 1000000000;

// export const NETWORK = `${process.env.REACT_APP_KDA_NETWORK}/chainweb/${NETWORK_VERSION}/${NETWORKID}/chain/${CHAIN_ID}/pact`;

// export const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;

// export const isMainnet = () => NETWORK_TYPE === "mainnet";



// export const CHAIN_ID = process.env.REACT_APP_KDA_CHAIN_ID || "0";
export const CHAIN_ID = process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_ID : process.env.REACT_APP_TESTNET_CHAIN_ID;
// export const PRECISION = Number(process.env.REACT_APP_KDA_PRECISION) || 12;
export const PRECISION = Number(process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_PRECISION : process.env.REACT_APP_TESTNET_CHAIN_PRECISION) || 12;
// export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_ID || "testnet04";
export const NETWORKID = process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_NETWORK_ID : process.env.REACT_APP_TESTNET_CHAIN_NETWORK_ID;
// export const FEE = process.env.REACT_APP_KDA_FEE || 0.003;
export const FEE = process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_FEE : process.env.REACT_APP_TESTNET_CHAIN_FEE;
// export const APR_FEE = process.env.REACT_APP_APR_FEE || 0.0025;
export const APR_FEE = process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_APR_FEE : process.env.REACT_APP_TESTNET_CHAIN_APR_FEE;
// export const GAS_PRICE =
//     Number(process.env.REACT_APP_KDA_GAS_PRICE) || 0.0000001;
export const GAS_PRICE =
    Number(process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_GAS_PRICE : process.env.REACT_APP_TESTNET_CHAIN_GAS_PRICE) || 0.0000001;
export const GAS_LIMIT =
    Number(process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_GAS_LIMIT : process.env.REACT_APP_TESTNET_CHAIN_GAS_LIMIT) || 400000;
// export const NETWORK_VERSION =
//     process.env.REACT_APP_KDA_NETWORK_VERSION || "0.0";
export const NETWORK_VERSION = process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_VERSION : process.env.REACT_APP_TESTNET_CHAIN_VERSION;

export const CHAIN_NETWORK = process.env.REACT_APP_KDA_NETWORK_TYPE === "mainnet" ? process.env.REACT_APP_MAINNET_CHAIN_NETWORK : process.env.REACT_APP_TESTNET_CHAIN_NETWORK;

export const NETWORK = `${CHAIN_NETWORK}/chainweb/${NETWORK_VERSION}/${NETWORKID}/chain/${CHAIN_ID}/pact`;

export const creationTime = () => Math.round(new Date().getTime() / 1000) - 10;
