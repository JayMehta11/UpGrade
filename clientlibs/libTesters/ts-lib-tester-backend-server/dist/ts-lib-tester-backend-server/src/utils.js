import { availableClientLibraries } from './app-config.js';
export function validateHook(body) {
    const { name, user, libVersion, apiHostUrl, mockApp } = body;
    if (!name || !user || !libVersion || !apiHostUrl || !mockApp) {
        return false;
    }
    return true;
}
export function getUpgradeClientConstructor(version) {
    const clientLibrary = availableClientLibraries.find((clientLibrary) => clientLibrary.version === version);
    if (!clientLibrary || !clientLibrary.client || !clientLibrary.client.default) {
        throw new Error(`Client library version ${version} not found`);
    }
    return clientLibrary.client.default;
}
//# sourceMappingURL=utils.js.map