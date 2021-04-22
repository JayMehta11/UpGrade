import { Container } from 'typedi';
import { ExperimentUserService } from '../../../../src/api/services/ExperimentUserService';
import TestCase1 from './NoGroup';
import TestCase2 from './NoWorkingGroup';
import TestCase3 from "./IncorrectWorkingGroup";
import TestCase4 from "./IncorrectGroup";
import { CheckService } from '../../../../src/api/services/CheckService';
import { experimentUsers } from '../../mockData/experimentUsers/index';

const initialChecks = async () => {
  const userService = Container.get<ExperimentUserService>(ExperimentUserService);
  const checkService = Container.get<CheckService>(CheckService);

  // check all the tables are empty
  const users = await userService.find();
  expect(users.length).toEqual(0);

  const monitoredPoints = await checkService.getAllMarkedExperimentPoints();
  expect(monitoredPoints.length).toEqual(0);

  const groupAssignments = await checkService.getAllGroupAssignments();
  expect(groupAssignments.length).toEqual(0);

  const groupExclusions = await checkService.getAllGroupExclusions();
  expect(groupExclusions.length).toEqual(0);

  const individualAssignments = await checkService.getAllIndividualAssignment();
  expect(individualAssignments.length).toEqual(0);

  const individualExclusions = await checkService.getAllIndividualExclusion();
  expect(individualExclusions.length).toEqual(0);

  // create users over here
  await userService.create(experimentUsers as any);

  // get all user here
  const userList = await userService.find();
  expect(userList.length).toBe(experimentUsers.length);
  experimentUsers.map((user) => {
    expect(userList).toContainEqual(user);
  });
};

export const NoGroup = async () => {
  await initialChecks();
  await TestCase1();
};

export const NoWorkingGroup = async () => {
  await initialChecks();
  await TestCase2();
}

export const IncorrectWorkingGroup = async () => {
  await initialChecks();
  await TestCase3();
}

export const IncorrectGroup = async () => {
  await initialChecks();
  await TestCase4();
}
