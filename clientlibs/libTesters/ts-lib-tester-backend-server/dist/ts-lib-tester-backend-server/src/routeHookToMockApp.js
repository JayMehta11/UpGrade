import { MOCK_APP_NAMES } from '../../shared/constants.js';
import { GeneralTSBackendVersion1 } from './mockBackendTSServerApps/GeneralTSBackendVersion1.js';
import { GeneralTSBackendVersion5 } from './mockBackendTSServerApps/GeneralTSBackendVersion5.js';
export default async function (clientConstructor, hookRequest) {
    const { mockApp } = hookRequest;
    if (mockApp === MOCK_APP_NAMES.GENERAL_TS_BACKEND_1) {
        return new GeneralTSBackendVersion1(clientConstructor).routeHook(hookRequest);
    }
    else if (mockApp === MOCK_APP_NAMES.GENERAL_TS_BACKEND_5) {
        return new GeneralTSBackendVersion5(clientConstructor).routeHook(hookRequest);
    }
    else {
        return {
            hookReceived: hookRequest,
            response: {
                error: `No mock app found for ${mockApp}`,
            },
        };
    }
}
//# sourceMappingURL=routeHookToMockApp.js.map