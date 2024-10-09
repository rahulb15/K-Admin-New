// launchpadAdminPactFunctions.js

const testnetFunctions = {
    nftCollectionRequest: 'free.lptest001.nft-collection-request',
    launchCollection: 'free.lptest001.launch-collection',
    createNgCollection: 'free.lptest001.create-ng-collection',
    getCollectionId: 'free.lptest001.get-collection-id',
    createPresale: 'free.lptest001.create-presale',
    createWhitelist: 'free.lptest001.create-whitelist',
    addWlAccounts: 'free.lptest001.add-wl-accounts',
    addPresaleAccounts: 'free.lptest001.add-presale-accounts',
    createAirdrop: 'free.lptest001.create-airdrop',
    getUnrevealedTokensForCollection: 'free.lptest001.get-unrevealed-tokens-for-collection',
    bulkSyncWithNg: 'free.lptest001.bulk-sync-with-ng',
    getBalance: 'coin.get-balance',
    transferCreate: 'coin.transfer-create',
    addRoles: 'free.lptest001.add-roles',
    addPolicies: 'free.lptest001.add-policies',
    replacePolicies: 'free.lptest001.replace-policies',
    getPolicyOfCollection: 'free.lptest001.get-policy-of-collection',
    updatePrice: 'free.kmpasstest003.update-price',
    getCollectionCreator: 'free.lptest001.get-collection-creator',
    getRoyaltyInfo: 'free.lptest001.get-royalty-info',
    isAdmin: 'free.lptest001.IS_ADMIN',
    mintProcess: 'free.lptest001.MINTPROCESS'
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
    updatePrice: 'free.KMPPV2.update-price',
    getCollectionCreator: 'free.KMLPV2.get-collection-creator',
    getRoyaltyInfo: 'free.KMLPV2.get-royalty-info',
    isAdmin: 'free.KMLPV2.IS_ADMIN',
    mintProcess: 'free.KMLPV2.MINTPROCESS'
};

const networkType = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';

const launchpadPactFunctions = networkType === 'mainnet' ? mainnetFunctions : testnetFunctions;

export default launchpadPactFunctions;