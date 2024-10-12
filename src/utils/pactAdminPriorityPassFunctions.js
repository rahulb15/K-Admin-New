// priorityPassPactFunctions.js

const testnetFunctions = {
    createCollection: 'free.kmpasstest003.create-collection',
    getUnrevealedTokensForCollection: 'free.kmpasstest003.get-unrevealed-tokens-for-collection',
    bulkSyncWithNg: 'free.kmpasstest003.bulk-sync-with-ng',
    addPolicies: 'free.lptest003.add-policies',
    replacePolicies: 'free.lptest003.replace-policies',
    getPoliciesOfCollection: 'free.kmpasstest003.get-policies-of-collection',
    addPriorityUsers: 'free.lptest003.add-priority-users',
    updatePrice: 'free.kmpasstest003.update-price',
    getCollectionId: 'free.kmpasstest003.get-collection-id',
    getCollectionCreator: 'free.lptest003.get-collection-creator',
    isAdmin: 'free.kmpasstest003.IS_ADMIN',
    createCollectionCapability: 'free.kmpasstest003.CREATE-COLLECTION',
    priorityCapability: 'free.lptest003.PRIORITY'
};

const mainnetFunctions = {
    createCollection: 'free.KMPPV2.create-collection',
    getUnrevealedTokensForCollection: 'free.KMPPV2.get-unrevealed-tokens-for-collection',
    bulkSyncWithNg: 'free.KMPPV2.bulk-sync-with-ng',
    addPolicies: 'free.KMLPV2.add-policies',
    replacePolicies: 'free.KMLPV2.replace-policies',
    getPoliciesOfCollection: 'free.KMPPV2.get-policies-of-collection',
    addPriorityUsers: 'free.KMLPV2.add-priority-users',
    updatePrice: 'free.KMPPV2.update-price',
    getCollectionId: 'free.KMPPV2.get-collection-id',
    getCollectionCreator: 'free.KMLPV2.get-collection-creator',
    isAdmin: 'free.KMPPV2.IS_ADMIN',
    createCollectionCapability: 'free.KMPPV2.CREATE-COLLECTION',
    priorityCapability: 'free.KMLPV2.PRIORITY'
};

const networkType = process.env.REACT_APP_KDA_NETWORK_TYPE || 'testnet';

const priorityPassPactFunctions = networkType === 'mainnet' ? mainnetFunctions : testnetFunctions;

export default priorityPassPactFunctions;