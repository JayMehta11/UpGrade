export const experiment = {
  id: 'be3ae74f-370a-4015-93f3-7761d16f8b17',
  name: 'Test Experiment',
  description: 'Test Experiment Description',
  consistencyRule: 'individual',
  assignmentUnit: 'individual',
  postExperimentRule: 'continue',
  state: 'scheduled',
  startOn: new Date().toISOString(),
  group: 'teacher',
  conditions: [
    {
      id: 'c22467b1-f0e9-4444-9517-cc03037bc079',
      name: 'Condition A',
      description: 'Condition A',
      assignmentWeight: 0.4,
      conditionCode: 'ConditionA',
    },
    {
      id: 'd2702d3c-5e04-41a7-8766-1da8a95b72ce',
      name: 'Condition B',
      description: 'Condition B',
      assignmentWeight: 0.6,
      conditionCode: 'ConditionB',
    },
  ],
  segments: [
    {
      point: 'CurriculumSequence ',
      name: 'W1',
      description: 'Segment on Workspace 1',
    },
    {
      point: 'CurriculumSequence',
      name: 'W2',
      description: 'Segment on Workspace 2',
    },
  ],
};
