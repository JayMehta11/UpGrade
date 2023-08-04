import { UpGradeClientInterfaces } from './types';
import {
  IFeatureFlag,
  ISingleMetric,
  IGroupMetric,
  ILogInput,
  CaliperEnvelope,
  IExperimentAssignmentv5,
  MARKED_DECISION_POINT_STATUS,
} from 'upgrade_types';
import Assignment from './Assignment';
import ApiService from './ApiService';
import { DataService } from 'DataService';

/**
 * UpGradeClient is the main class for interacting with the UpGrade API.
 *
 * @example
 * ```typescript
 * import UpgradeClient from 'upgrade_client_lib/dist/browser';
 * ```
 *
 * ```typescript
 * import UpgradeClient from 'upgrade_client_lib/dist/node';
 * ```
 *
 * General UpGrade types can also be accessed as named exports:
 * ```typescript
 * import UpgradeClient, { IExperimentAssignment } from 'upgrade_client_lib/dist/browser';
 * ```
 *
 * SDK-Specific types can be accessed also:
 * ```typescript
 * import { UpGradeClientInterfaces } from 'upgrade_client_lib/dist/clientlibs/js/src/identifiers';
 *
 * const initResponse: UpGradeClientInterfaces.IUser = await upgradeClient.init();
 * ```
 */

export default class UpgradeClient {
  private apiService: ApiService;
  private dataService: DataService;

  // allow MARKED_DECISION_POINT_STATUS to be exposed on the client a la UpgradeClient.MARKED_DECISION_POINT_STATUS
  // this will allow js users who are not using the upgrade types package to use this enum for markExperimentPoint()
  public static MARKED_DECISION_POINT_STATUS = MARKED_DECISION_POINT_STATUS;

  /**
   * When constructing UpgradeClient, the user id, api host url, and "context" identifier are required.
   * These will be attached to various API calls for this instance of the client.
   *
   * @example
   *
   * ```typescript
   * // required
   * const hostUrl: "htts://my-hosted-upgrade-api.com";
   * const userId: "abc123";
   * const context: "my-app-context-name";
   *
   * // not required, each is also optional
   * const options: {
   *   token: "someToken";
   *   clientSessionId: "someSessionId";
   * }
   *
   * const upgradeClient: UpgradeClient[] = new UpgradeClient(hostURL, userId, context);
   * const upgradeClient: UpgradeClient[] = new UpgradeClient(hostURL, userId, context, options);
   * ```
   */

  constructor(userId: string, hostUrl: string, context: string, options?: UpGradeClientInterfaces.IConfigOptions) {
    const config: UpGradeClientInterfaces.IConfig = {
      apiVersion: 'v5',
      userId: userId,
      hostURL: hostUrl,
      context: context,
      clientSessionId: options.clientSessionId,
      token: options.token,
      httpClient: options.httpClient,
    };

    this.dataService = new DataService();
    this.apiService = new ApiService(config, this.dataService);
  }

  /**
   * This will initialize user and metadata for the user. It will return the user object with id, group, and working group.
   * NOTE: A user must be initialized at least once before calling any other methods.
   * Else, you will see "Experiment user not defined" errors when other SDK methods are called.
   *
   * @example
   * ```typescript
   * const group: Record<string, Array<string>> = {
   *   classId: ['class1', 'class2'],
   *   districtId: ['district1', 'district2'],
   * }
   *
   * const workingGroup: Record<string, string> = {
   *  classId: 'class1',
   *  districtId: 'district2',
   * }
   *
   * const initResponse: UpGradeClientInterfaces.IUser[] = await upgradeClient.init();
   * const initResponse: UpGradeClientInterfaces.IUser[] = await upgradeClient.init(group);
   * const initResponse: UpGradeClientInterfaces.IUser[] = await upgradeClient.init(group, workingGroup);
   *
   * ```
   */
  async init(
    group?: Record<string, Array<string>>,
    workingGroup?: Record<string, string>
  ): Promise<UpGradeClientInterfaces.IUser> {
    return await this.apiService.init(group, workingGroup);
  }

  /**
   * Will set the group membership(s) for the user and return the user object with updated working group.
   *
   * @example
   * ```typescript
   * const group: Record<string, Array<string>> = {
   *   classId: ['class1', 'class2'],
   *   districtId: ['district1', 'district2'],
   * }
   *
   * const groupMembershipResponse: UpGradeClientInterfaces.IUser[] = await upgradeClient.setGroupMembership(group);
   * ```
   */
  async setGroupMembership(group: Record<string, Array<string>>): Promise<UpGradeClientInterfaces.IUser> {
    let response: UpGradeClientInterfaces.IUser = await this.apiService.setGroupMembership(group);
    if (response.id) {
      // If it does not throw error from setGroupMembership
      this.dataService.setGroup(group);
      response = {
        ...response,
        workingGroup: this.dataService.getWorkingGroup(),
      };
    }
    return response;
  }

  /**
   * Will set the working group(s) for the user and return the user object with updated working group.
   *
   * @example
   * ```typescript
   * const workingGroup: Record<string, string> = {
   *  classId: 'class1',
   *  districtId: 'district2',
   * }
   *
   * const workingGroupResponse: UpGradeClientInterfaces.IUser[] = await upgradeClient.setWorkingGroup(workingGroup);
   * ```
   */
  async setWorkingGroup(workingGroup: Record<string, string>): Promise<UpGradeClientInterfaces.IUser> {
    let response: UpGradeClientInterfaces.IUser = await this.apiService.setWorkingGroup(workingGroup);
    if (response.id) {
      // If it does not throw error from setWorkingGroup
      this.dataService.setWorkingGroup(workingGroup);
      response = {
        ...response,
        group: this.dataService.getGroup(),
      };
    }
    return response;
  }

  /**
   * This will return all the assignment for the given context.
   * The return object contains site, target, experimentType, assignedCondition array and assignedFactor array(optional)
   * Here assignedCondition and assignedFactors(For Factorial-experiment) are arrays
   *    They will return a stack of condition user will be assigned in that order
   * For With-in subjects these stacks will be contain all conditions according to the chosen `Condition-Order`
   * For Between subjects experiment both stack will return array containing single condition.
   *
   * @example
   * ```typescript
   * const userId = "User1"
   * const context = "mathia"
   *
   * const getAllResponse: IExperimentAssignmentv5[] = await upgradeClient.getAllExperimentConditions();
   * ```
   */
  async getAllExperimentConditions(): Promise<IExperimentAssignmentv5[]> {
    const response = await this.apiService.getAllExperimentConditions();
    if (Array.isArray(response)) {
      this.dataService.setExperimentAssignmentData(response);
    }

    // returns the first element of the queue
    return response;
  }

  /**
   * Given a site and optional target, return the Assignment this decision point
   * NOTE: If getAllExperimentConditions() has not been called, this will call it first.
   * NOTE ALSO: If getAllExperimentConditions() has been called, this will return the cached result and not make a network call.
   *
   * @example
   * ```typescript
   * const assignmentResponse: Assignment = await upgradeClient.getDecisionPointAssignment(site, target);
   * ```
   */

  async getDecisionPointAssignment(site: string, target?: string): Promise<Assignment> {
    if (this.dataService.getExperimentAssignmentData() == null) {
      await this.getAllExperimentConditions();
    }
    // const clientState: UpGradeClientInterfaces.IClientState = this.getClientState();
    if (this.dataService.getExperimentAssignmentData()) {
      const experimentAssignment = this.dataService.findExperimentAssignmentBySiteAndTarget(site, target);

      if (experimentAssignment) {
        const assignment = new Assignment(experimentAssignment, this.apiService, this.dataService);

        return assignment;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * Will record ("mark") that a user has "seen" a condition at the given decision point (site + target).
   *
   * NOTE: This method may be deprecated in favor of Assignment.markDecisionPoint() in a future release.
   *
   * Marking the decision point will record the user's condition assignment, regardless of whether the user is enrolled in an experiment.
   *
   * @param site
   * @param target
   * @param condition `condition` is the string identifier that the user was assigned to. If none is provided, the condition will be default (null)
   *
   * @param status `status` signifies a client application's note on what it did in the code with condition assignment that Upgrade provided.
   *  Status can be one of the following:
   *
   * ```ts
   * export enum MARKED_DECISION_POINT_STATUS {
   *   CONDITION_APPLIED = 'condition applied',
   *   CONDITION_FAILED_TO_APPLY = 'condition not applied',
   *   NO_CONDITION_ASSIGNED = 'no condition assigned',
   * }
   * ```
   *
   * @param uniquifier A `uniquifier` unique string can be sent along to help tie a user's logged metrics to a specific marked condition.
   * This identifier will also need to be sent when calling `upgradeClient.log()`
   * This is required for 'within-subjects' experiments.
   *
   * @param clientError The client can also send along an additional `clientError` string to log context as to why a condition was not applied.
   *
   * @example
   * ```ts
   * import { MARKED_DECISION_POINT_STATUS } from 'upgrade_types';
   *
   * const site = 'dashboard';
   * const target = 'experimental button';
   * const condition = 'variant_x'; // send null if no condition / no experiment is running / error
   * const status: MARKED_DECISION_POINT_STATUS = MARKED_DECISION_POINT_STATUS.CONDITION_FAILED_TO_APPLY
   * const clientError = 'variant not recognized'; //optional
   *
   * const markResponse = await upgradeClient.markDecisionPoint(site, target, condition, MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED);
   * ```
   *
   * Note*: mark can also be called via `Assignment.markDecisionPoint()` when returning an assignment from `getDecisionPointAssignment()`:
   * ```ts
   * const assignment: Assignment[] = await upgradeClient.getDecisionPointAssignment(site, target);
   * const markResponse = await assignment.markDecisionPoint(MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED);
   * ```
   */

  async markDecisionPoint(
    site: string,
    target: string,
    condition: string = null,
    status: MARKED_DECISION_POINT_STATUS,
    uniquifier?: string,
    clientError?: string
  ): Promise<UpGradeClientInterfaces.IMarkDecisionPoint> {
    if (this.dataService.getExperimentAssignmentData() == null) {
      await this.getAllExperimentConditions();
    }
    return await this.apiService.markDecisionPoint({
      site,
      target,
      condition,
      status,
      uniquifier,
      clientError,
    });
  }

  /**
   * @deprecated
   * Please use "markDecisionPoint" instead. This is just a name change, the functionality is the same, but could be removed in future.
   *
   * Will record ("mark") that a user has "seen" a condition at the given decision point (site + target).
   *
   * NOTE: This method may be deprecated in favor of Assignment.markDecisionPoint() in a future release.
   *
   * Marking the decision point will record the user's condition assignment, regardless of whether the user is enrolled in an experiment.
   *
   * @param site
   * @param target
   * @param condition `condition` is the string identifier that the user was assigned to. If none is provided, the condition will be default (null)
   *
   * @param status `status` signifies a client application's note on what it did in the code with condition assignment that Upgrade provided.
   *  Status can be one of the following:
   *
   * ```ts
   * export enum MARKED_DECISION_POINT_STATUS {
   *   CONDITION_APPLIED = 'condition applied',
   *   CONDITION_FAILED_TO_APPLY = 'condition not applied',
   *   NO_CONDITION_ASSIGNED = 'no condition assigned',
   * }
   * ```
   *
   * @param uniquifier A `uniquifier` unique string can be sent along to help tie a user's logged metrics to a specific marked condition.
   * This identifier will also need to be sent when calling `upgradeClient.log()`
   * This is required for 'within-subjects' experiments.
   *
   * @param clientError The client can also send along an additional `clientError` string to log context as to why a condition was not applied.
   *
   * @example
   * ```ts
   * import { MARKED_DECISION_POINT_STATUS } from 'upgrade_types';
   *
   * const site = 'dashboard';
   * const target = 'experimental button';
   * const condition = 'variant_x'; // send null if no condition / no experiment is running / error
   * const status: MARKED_DECISION_POINT_STATUS = MARKED_DECISION_POINT_STATUS.CONDITION_FAILED_TO_APPLY
   * const clientError = 'variant not recognized'; //optional
   *
   * const markResponse = await upgradeClient.markExperimentPoint(site, target, condition, MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED);
   * ```
   *
   * Note*: mark can also be called via `Assignment.markDecisionPoint()` when returning an assignment from `getDecisionPointAssignment()`:
   * ```ts
   * const assignment: Assignment[] = await upgradeClient.getDecisionPointAssignment(site, target);
   * const markResponse = await assignment.markDecisionPoint(MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED);
   * ```
   */

  markExperimentPoint = this.markDecisionPoint;

  /**
   * This feature is available but not recommended for use as it is not fully regression tested in recent releases.
   * @ignore
   */

  async getAllFeatureFlags(): Promise<IFeatureFlag[]> {
    const response = await this.apiService.getAllFeatureFlags();
    if (response.length) {
      this.dataService.setFeatureFlags(response);
    }
    return response;
  }

  /**
   * This feature is available but not recommended for use as it is not fully regression tested in recent releases.
   * @ignore
   */
  public getFeatureFlag(key: string): IFeatureFlag {
    return this.dataService.getFeatureFlag(key);
  }

  /**
   * Will report user outcome metrics to Upgrade.
   * Please see https://upgrade-platform.gitbook.io/docs/developer-guide/reference/metrics for more information.
   *
   * @example
   * ```ts
   * const metrics: IMetricInput[] = [
   *     {
   *         "metric": "totalTimeSeconds",
   *         "datatype": "continuous"
   *     },
   *     {
   *         "metric": "completedAll",
   *         "datatype": "categorical",
   *         "allowedValues": [ "COMPLETE", "INCOMPLETE" ]
   *     },
   *     {
   *         "groupClass": "quizzes",
   *         "allowedKeys":
   *             [
   *                 "quiz1",
   *                 "quiz2",
   *                 "quiz3"
   *             ],
   *         "attributes":
   *             [
   *                 {
   *                     "metric": "quizTimeSeconds",
   *                     "datatype": "continuous"
   *                 },
   *                 {
   *                     "metric": "score",
   *                     "datatype": "continuous"
   *                 },
   *                 {
   *                     "metric": "passStatus",
   *                     "datatype": "categorical",
   *                     "allowedValues": [ "PASS", "FAIL" ]
   *                 }
   *             ]
   *      },
   *      {
   *          "groupClass": "polls",
   *          "allowedKeys":
   *              [
   *                  "poll1",
   *                  "poll2"
   *              ],
   *          "attributes":
   *              [
   *                  {
   *                      "metric": "pollTimeSeconds",
   *                      "datatype": "continuous"
   *                  },
   *                  {
   *                      "metric": "rank",
   *                      "datatype": "categorical",
   *                      "allowedValues": [ "UNHAPPY", "NEUTRAL", "HAPPY" ]
   *                  }
   *              ]
   *        }
   *   ];
   *
   * const logResponse: ILog[] = await upgradeClient.metrics(metrics);
   * ```
   */
  async log(value: ILogInput[], sendAsAnalytics = false): Promise<UpGradeClientInterfaces.ILog[]> {
    return await this.apiService.log(value, sendAsAnalytics);
  }

  /**
 * Will report Caliper user outcome metrics to Upgrade, same as log() but with Caliper envelope.
 * 
 * @example
 * ```ts
 * const logRequest: CaliperEnvelope = {
      sensor: 'test',
      sendTime: 'test',
      dataVersion: 'test',
      data: [],
    };
 *
 *
 *  const logCaliperResponse: ILog[] = await upgradeClient.logCaliper(logRequest);
 * 
 * ```
 */
  async logCaliper(value: CaliperEnvelope, sendAsAnalytics = false): Promise<UpGradeClientInterfaces.ILog[]> {
    return await this.apiService.logCaliper(value, sendAsAnalytics);
  }

  /**
   * Will set an array of alternate user ids for the user.
   *
   * @example
   * ```ts
   * const aliases: string[] = ['alias1', 'alias2'];
   *
   * const setAltUserIdsResponse: IExperimentUserAliases[] = await upgradeClient.setAltUserIds(aliases);
   * ```
   */
  async setAltUserIds(altUserIds: string[]): Promise<UpGradeClientInterfaces.IExperimentUserAliases> {
    return await this.apiService.setAltUserIds(altUserIds);
  }

  /**
   * This feature is available but not recommended for use as it is not fully regression tested in recent releases.
   * @ignore
   */
  async addMetrics(metrics: (ISingleMetric | IGroupMetric)[]): Promise<UpGradeClientInterfaces.IMetric[]> {
    return await this.apiService.addMetrics(metrics);
  }
}
