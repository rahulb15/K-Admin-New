// launchpadAdminPactFunctions.js

const testnetFunctions = {
    nftCollectionRequest: 'free.lptest003.nft-collection-request',
    launchCollection: 'free.lptest003.launch-collection',
    createNgCollection: 'free.lptest003.create-ng-collection',
    getCollectionId: 'free.lptest003.get-collection-id',
    createPresale: 'free.lptest003.create-presale',
    createWhitelist: 'free.lptest003.create-whitelist',
    addWlAccounts: 'free.lptest003.add-wl-accounts',
    addPresaleAccounts: 'free.lptest003.add-presale-accounts',
    // createAirdrop: 'free.lptest003.create-airdrop',
    getUnrevealedTokensForCollection: 'free.lptest003.get-unrevealed-tokens-for-collection',
    bulkSyncWithNg: 'free.lptest003.bulk-sync-with-ng',
    getBalance: 'coin.get-balance',
    transferCreate: 'coin.transfer-create',
    addRoles: 'free.lptest003.add-roles',
    addPolicies: 'free.lptest003.add-policies',
    replacePolicies: 'free.lptest003.replace-policies',
    getPolicyOfCollection: 'free.lptest003.get-policy-of-collection',
    updatePrice: 'free.lptest003.update-public-price',
    getCollectionCreator: 'free.lptest003.get-collection-creator',
    getRoyaltyInfo: 'free.lptest003.get-royalty-info',
    isAdmin: 'free.lptest003.IS_ADMIN',
    mintProcess: 'free.lptest003.MINTPROCESS',
    denyCollection: 'free.lptest003.deny-collection',
    createAirdrop: 'free.lptest003.create-airdrop',
    bulkAirdrop: 'free.lptest003.bulk-airdrop'
};

const mainnetFunctions = {
    nftCollectionRequest: 'free.KMLPV2.nft-collection-request',
    launchCollection: 'free.KMLPV2.launch-collection',
    createNgCollection: 'free.KMLPV2.create-ng-collection',
    getCollectionId: 'free.KMLPV2.get-collection-id',
    createPresale: 'free.KMLPV2.create-presale',
    createWhitelist: 'free.KMLPV2.create-whitelist',
    addWlAccounts: 'free.KMLPV2.add-wl-accounts',
    addPresaleAccounts: 'free.KMLPV2.add-presale-accounts',
    createAirdrop: 'free.KMLPV2.create-airdrop',
    getUnrevealedTokensForCollection: 'free.KMLPV2.get-unrevealed-tokens-for-collection',
    bulkSyncWithNg: 'free.KMLPV2.bulk-sync-with-ng',
    getBalance: 'coin.get-balance',
    transferCreate: 'coin.transfer-create',
    addRoles: 'free.KMLPV2.add-roles',
    addPolicies: 'free.KMLPV2.add-policies',
    replacePolicies: 'free.KMLPV2.replace-policies',
    getPolicyOfCollection: 'free.KMLPV2.get-policy-of-collection',
    updatePrice: 'free.KMLPV2.update-public-price',
    getCollectionCreator: 'free.KMLPV2.get-collection-creator',
    getRoyaltyInfo: 'free.KMLPV2.get-royalty-info',
    isAdmin: 'free.KMLPV2.IS_ADMIN',
    mintProcess: 'free.KMLPV2.MINTPROCESS',
    denyCollection: 'free.KMLPV2.deny-collection',
    createAirdrop: 'free.KMLPV2.create-airdrop',
    bulkAirdrop: 'free.KMLPV2.bulk-airdrop'
};

const networkType = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';

const launchpadPactFunctions = networkType === 'mainnet' ? mainnetFunctions : testnetFunctions;

export default launchpadPactFunctions;