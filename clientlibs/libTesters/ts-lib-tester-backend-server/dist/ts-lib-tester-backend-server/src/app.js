import express from 'express';
import { getUpgradeClientConstructor, validateHook } from './utils.js';
import routeHookToMockApp from './routeHookToMockApp.js';
import cors from 'cors';
import { GeneralTSBackendVersion5 } from './mockBackendTSServerApps/GeneralTSBackendVersion5.js';
import { GeneralTSBackendVersion1 } from './mockBackendTSServerApps/GeneralTSBackendVersion1.js';
// import dotenv from 'dotenv';
// dotenv.config();
const app = express();
// const port = process.env.PORT;
const port = 3000;
app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
app.get('/api', (req, res) => {
    res.send('Serving TS Client Test Backend');
});
app.get('/api/mock-app-models', (req, res) => {
    // get the models from the mock apps themselves
    const models = [
        new GeneralTSBackendVersion1().getAppInterfaceModel(),
        new GeneralTSBackendVersion5().getAppInterfaceModel(),
    ];
    res.json({ models });
});
app.post('/api/hook', async (req, res) => {
    // if all is valid
    if (!req.body && !validateHook(req.body) === false) {
        res.json({
            hookRecieved: req.body,
            response: {
                error: 'Invalid hook request',
            },
        });
        return;
    }
    // then use libversion create a client constructor
    const hookRequest = req.body;
    try {
        const ClientLibConstructor = getUpgradeClientConstructor(hookRequest.libVersion);
        console.log('ClientLibConstructor', ClientLibConstructor);
        // route to mock app with the client constructor, payload, and hook
        console.log('hookRequest', hookRequest);
        const response = await routeHookToMockApp(ClientLibConstructor, hookRequest);
        console.log('response', response);
        res.json(response);
    }
    catch (_) {
        res.json({
            hookRecieved: req.body,
            response: {
                error: `Invalid client library version for backend: ${hookRequest.libVersion}`,
            },
        });
        return;
    }
});
//# sourceMappingURL=app.js.map