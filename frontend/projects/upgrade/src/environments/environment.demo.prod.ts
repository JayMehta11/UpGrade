export const environment = {
  appName: 'UpGrade',
  envName: 'PROD',
  apiBaseUrl: 'https://upgrade-demo.carnegielearning.com/api',
  production: true,
  test: false,
  baseHrefPrefix: '/upgrade',
  googleClientId: '586868075529-8k9hvk5ber8cb6qfu50945kpln7eo870.apps.googleusercontent.com',
  domainName: '',
  pollingEnabled: true,
  pollingInterval: 10 * 1000,
  pollingLimit: 600,
  featureFlagNavToggle: false,
  withinSubjectExperimentSupportToggle: false,
  errorLogsToggle: false,
  api: {
    getAllExperiments: '/experiments/paginated',
    createNewExperiments: '/experiments',
    validateExperiment: '/experiments/validation',
    importExperiment: '/experiments/import',
    exportExperiment: '/experiments/export',
    updateExperiments: '/experiments',
    experimentContext: '/experiments/context',
    getExperimentById: '/experiments/single',
    getAllAuditLogs: '/audit',
    getAllErrorLogs: '/error',
    experimentsStats: '/stats/enrollment',
    experimentDetailStat: '/stats/enrollment/detail',
    generateCsv: '/stats/csv',
    experimentGraphInfo: '/stats/enrollment/date',
    deleteExperiment: '/experiments',
    updateExperimentState: '/experiments/state',
    users: '/users',
    loginUser: '/login/user', // Used to create a new user after login if doesn't exist in DB
    getAllUsers: '/users/paginated',
    userDetails: '/users/details',
    previewUsers: '/previewUsers',
    stratification: '/stratification',
    getAllPreviewUsers: '/previewUsers/paginated',
    previewUsersAssignCondition: '/previewUsers/assign',
    allPartitions: '/experiments/partitions',
    allExperimentNames: '/experiments/names',
    featureFlag: '/flags',
    updateFlagStatus: '/flags/status',
    getPaginatedFlags: '/flags/paginated',
    setting: '/setting',
    metrics: '/metric',
    metricsSave: '/metric/save',
    queryResult: '/query/analyse',
    getVersion: '/version',
    contextMetaData: '/experiments/contextMetaData',
    segments: '/segments',
    validateSegments: '/segments/validation',
    importSegments: '/segments/import',
    exportSegments: '/segments/export/json',
    exportSegmentCSV: '/segments/export/csv',
    getGroupAssignmentStatus: '/experiments/getGroupAssignmentStatus',
  },
};
