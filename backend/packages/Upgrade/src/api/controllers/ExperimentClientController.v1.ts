import {
  JsonController,
  Post,
  Body,
  UseBefore,
  Req,
  InternalServerError,
  Delete,
  Patch,
  OnUndefined,
} from 'routing-controllers';
import { ExperimentService } from '../services/ExperimentService';
import { ExperimentAssignmentService } from '../services/ExperimentAssignmentService';
import { MarkExperimentValidator } from './validators/MarkExperimentValidator.v1';
import { ExperimentAssignmentValidator } from './validators/ExperimentAssignmentValidator';
import { ExperimentUser } from '../models/ExperimentUser';
import { ExperimentUserService } from '../services/ExperimentUserService';
import { UpdateWorkingGroupValidator } from './validators/UpdateWorkingGroupValidator';
import { SERVER_ERROR, IGroupMembership, IUserAliases, IWorkingGroup } from 'upgrade_types';
import { FailedParamsValidator } from './validators/FailedParamsValidator.v1';
import { ExperimentError } from '../models/ExperimentError';
import { FeatureFlagService } from '../services/FeatureFlagService';
import { ClientLibMiddleware } from '../middlewares/ClientLibMiddleware';
import { LogValidator } from './validators/LogValidator';
import { MetricService } from '../services/MetricService';
import { ExperimentUserAliasesValidator } from './validators/ExperimentUserAliasesValidator';
import { Metric } from '../models/Metric';
import * as express from 'express';
import { AppRequest } from '../../types';
import { env } from '../../env';
import { MonitoredDecisionPointLog } from '../models/MonitoredDecisionPointLog';
import { Log } from '../models/Log';
import flatten from 'lodash.flatten';
import { CaliperLogEnvelope } from './validators/CaliperLogEnvelope';
import { ExperimentUserValidator } from './validators/ExperimentUserValidator';
import { MetricValidator } from './validators/MetricValidator';

interface IMonitoredDeciosionPoint {
  id: string;
  user: ExperimentUser;
  site: string;
  target: string;
  experimentId: string;
  condition: string;
  monitoredPointLogs: MonitoredDecisionPointLog[];
}

interface IExperimentAssignment {
  site: string;
  target: string;
  assignedCondition: {
    condition: string;
  };
}
/**
 * @swagger
 * definitions:
 *   initResponse:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         minLength: 1
 *       group:
 *         type: object
 *         properties:
 *           class:
 *             type: array
 *             items:
 *               required: []
 *               properties: {}
 *         required:
 *           - class
 *       workingGroup:
 *         type: object
 *         properties:
 *           school:
 *             type: string
 *             minLength: 1
 *           class:
 *             type: string
 *             minLength: 1
 *           instructor:
 *             type: string
 *             minLength: 1
 *         required:
 *           - school
 *           - class
 *           - instructor
 *     required:
 *       - id
 *       - group
 *       - workingGroup
 */

/**
 * @swagger
 * tags:
 *   - name: Client Side SDK
 *     description: CRUD operations related to experiments points
 */

@JsonController('/v1/')
@UseBefore(ClientLibMiddleware)
export class ExperimentClientController {
  constructor(
    public experimentService: ExperimentService,
    public experimentAssignmentService: ExperimentAssignmentService,
    public experimentUserService: ExperimentUserService,
    public featureFlagService: FeatureFlagService,
    public metricService: MetricService
  ) {}

  /**
   * @swagger
   * /init:
   *    post:
   *       description: Create/Update Experiment User
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: experimentUser
   *           required: true
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 example: user1
   *               group:
   *                 type: object
   *                 properties:
   *                   schoolId:
   *                      type: array
   *                      items:
   *                        type: string
   *                        example: school1
   *                   classId:
   *                      type: array
   *                      items:
   *                        type: string
   *                        example: class1
   *                   instructorId:
   *                      type: array
   *                      items:
   *                        type: string
   *                        example: instructor1
   *               workingGroup:
   *                 type: object
   *                 properties:
   *                   schoolId:
   *                      type: string
   *                      example: school1
   *                   classId:
   *                      type: string
   *                      example: class1
   *                   instructorId:
   *                      type: string
   *                      example: instructor1
   *           description: ExperimentUser
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Set Group Membership
   *            schema:
   *              $ref: '#/definitions/initResponse'
   */
  @Post('init')
  public async init(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    experimentUser: ExperimentUserValidator
  ): Promise<Pick<ExperimentUser, 'id' | 'group' | 'workingGroup'>> {
    request.logger.info({ message: 'Starting the init call for user' });
    // getOriginalUserDoc call for alias
    const experimentUserDoc = await this.experimentUserService.getUserDoc(experimentUser.id, request.logger);
    // if reinit call is made with any of the below fields not included in the call,
    // then we will fetch the stored values of the field and return them in the response
    // for consistent init response with 3 fields ['userId', 'group', 'workingGroup']
    const { id, group, workingGroup } = { ...experimentUserDoc, ...experimentUser };

    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }

    const upsertResult = await this.experimentUserService.upsertOnChange(
      experimentUserDoc,
      experimentUser,
      request.logger
    );

    if (!upsertResult) {
      request.logger.error({
        details: 'user upsert failed',
      });
      throw new InternalServerError('user init failed');
    }

    return { id, group, workingGroup };
  }

  /**
   * @swagger
   * /groupmembership:
   *    patch:
   *       description: Set group membership for a user
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: experimentUser
   *           required: true
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 example: user1
   *               group:
   *                 type: object
   *                 properties:
   *                   schoolId:
   *                      type: array
   *                      items:
   *                        type: string
   *                        example: school1
   *                   classId:
   *                      type: array
   *                      items:
   *                        type: string
   *                        example: class1
   *                   instructorId:
   *                      type: array
   *                      items:
   *                        type: string
   *                        example: instructor1
   *           description: ExperimentUser
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Set Group Membership
   *            schema:
   *              $ref: '#/definitions/initResponse'
   *          '500':
   *            description: null value in column "id" of relation "experiment_user" violates not-null constraint
   */
  @Patch('groupmembership')
  public async setGroupMemberShip(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    experimentUser: ExperimentUserValidator
  ): Promise<IGroupMembership> {
    request.logger.info({ message: 'Starting the groupmembership call for user' });
    // getOriginalUserDoc call for alias
    const experimentUserDoc = await this.experimentUserService.getUserDoc(experimentUser.id, request.logger);
    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }
    const { id, group } = await this.experimentUserService.updateGroupMembership(
      experimentUser.id,
      experimentUser.group,
      {
        logger: request.logger,
        userDoc: experimentUserDoc,
      }
    );
    return { id, group };
  }

  /**
   * @swagger
   * /workinggroup:
   *    patch:
   *       description: Set working group for a user
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: params
   *           required: true
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 example: user1
   *               workingGroup:
   *                 type: object
   *                 properties:
   *                   schoolId:
   *                      type: string
   *                      example: school1
   *                   classId:
   *                      type: string
   *                      example: class1
   *                   instructorId:
   *                      type: string
   *                      example: instructor1
   *           description: ExperimentUser
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Set Group Membership
   *            schema:
   *              $ref: '#/definitions/initResponse'
   *          '500':
   *            description: null value in column "id" of relation "experiment_user" violates not-null constraint
   */
  @Patch('workinggroup')
  public async setWorkingGroup(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    workingGroupParams: UpdateWorkingGroupValidator
  ): Promise<IWorkingGroup> {
    request.logger.info({ message: 'Starting the workinggroup call for user' });
    // getOriginalUserDoc call for alias
    const experimentUserDoc = await this.experimentUserService.getUserDoc(workingGroupParams.id, request.logger);
    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }
    const { id, workingGroup } = await this.experimentUserService.updateWorkingGroup(
      workingGroupParams.id,
      workingGroupParams.workingGroup,
      {
        logger: request.logger,
        userDoc: experimentUserDoc,
      }
    );
    return { id, workingGroup };
  }

  /**
   * @swagger
   * /mark:
   *    post:
   *       description: Mark a Experiment Point
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: experimentUser
   *           required: true
   *           schema:
   *             type: object
   *             required:
   *                - userId
   *                - experimentPoint
   *                - condition
   *             properties:
   *               userId:
   *                 type: string
   *               site:
   *                 type: string
   *               target:
   *                 type: string
   *                 example: partition1
   *               condition:
   *                 type: string
   *                 example: control
   *               status:
   *                 type: string
   *                 example: condition applied
   *               experimentId:
   *                 type: string
   *                 example: exp1
   *           description: ExperimentUser
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Experiment Point is Marked
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: string
   *                  minLength: 1
   *                experimentId:
   *                  type: string
   *                  minLength: 1
   *                site:
   *                  type: string
   *                  minLength: 1
   *                target:
   *                  type: string
   *                  minLength: 1
   *                condition:
   *                  type: string
   *                  minLength: 1
   *              required:
   *                - id
   *                - experimentId
   *                - enrollmentCode
   *                - userId
   *                - condition
   *          '500':
   *            description: User not defined
   */
  @Post('mark')
  public async markExperimentPoint(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    experiment: MarkExperimentValidator
  ): Promise<IMonitoredDeciosionPoint> {
    request.logger.info({ message: 'Starting the markExperimentPoint call for user' });
    // getOriginalUserDoc call for alias
    const experimentUserDoc = await this.experimentUserService.getUserDoc(experiment.userId, request.logger);
    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }
    const { createdAt, updatedAt, versionNumber, ...rest } = await this.experimentAssignmentService.markExperimentPoint(
      experimentUserDoc,
      experiment.site,
      experiment.status,
      experiment.condition,
      request.logger,
      experiment.target,
      experiment.experimentId ? experiment.experimentId : null
    );
    return rest;
  }

  /**
   * @swagger
   * /assign:
   *    post:
   *       description: Assign a Experiment Point
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: user
   *            required: true
   *            schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 example: user1
   *               context:
   *                 type: string
   *                 example: add
   *            description: User Document
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Experiment Point is Assigned
   *            schema:
   *              type: array
   *              description: ''
   *              minItems: 1
   *              uniqueItems: true
   *              items:
   *                type: object
   *                required:
   *                  - site
   *                  - target
   *                  - condition
   *                properties:
   *                  site:
   *                    type: string
   *                    minLength: 1
   *                  target:
   *                    type: string
   *                    minLength: 1
   *                  condition:
   *                    type: string
   *                    minLength: 1
   *          '500':
   *            description: null value in column "id" of relation "experiment_user" violates not-null constraint
   *          '404':
   *            description: Experiment user not defined
   */
  @Post('assign')
  public async getAllExperimentConditions(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    experiment: ExperimentAssignmentValidator
  ): Promise<IExperimentAssignment[]> {
    request.logger.info({ message: 'Starting the getAllExperimentConditions call for user' });
    const experimentUserDoc = await this.experimentUserService.getUserDoc(experiment.userId, request.logger);
    const assignedData = await this.experimentAssignmentService.getAllExperimentConditions(
      experimentUserDoc,
      experiment.context,
      request.logger
    );

    return assignedData.map(({ site, target, assignedCondition }) => {
      return {
        site,
        target,
        assignedCondition: { condition: assignedCondition[0].payload?.value || assignedCondition[0].conditionCode },
      };
    });
  }

  /**
   * @swagger
   * /log:
   *    post:
   *       description: Post log data
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: data
   *            required: true
   *            schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 required: true
   *               value:
   *                 type: array
   *                 required: true
   *                 items:
   *                   type: object
   *                   properties:
   *                      userId:
   *                         type: string
   *                         example: user1
   *                      metrics:
   *                         type: object
   *                         properties:
   *                            attributes:
   *                              type: object
   *                              properties:
   *                                  continuousMetricName:
   *                                    type: integer
   *                                    example: 100
   *                                  categoricalMetricName:
   *                                    type: string
   *                                    example: CATEGORY
   *                            groupedMetrics:
   *                              type: array
   *                              items:
   *                                  type: object
   *                                  properties:
   *                                      groupClass:
   *                                          type: string
   *                                          required: true
   *                                          example: workspaceType
   *                                      groupKey:
   *                                          type: string
   *                                          required: true
   *                                          example: workspaceName
   *                                      groupUniquifier:
   *                                           type: string
   *                                           required: true
   *                                           example: workspaceUniquifier
   *                                      attributes:
   *                                        type: object
   *                                        properties:
   *                                            continuousMetricName:
   *                                              type: integer
   *                                              example: 100
   *                                            categoricalMetricName:
   *                                              type: string
   *                                              example: CATEGORY
   *            description: User Document
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Log data
   *          '500':
   *            description: null value in column "id\" of relation \"experiment_user\" violates not-null constraint
   */
  @Post('log')
  public async log(
    @Req()
    request: AppRequest,
    @Body({ validate: true })
    logData: LogValidator
  ): Promise<Omit<Log, 'createdAt' | 'updatedAt' | 'versionNumber'>[]> {
    request.logger.info({ message: 'Starting the log call for user' });
    // getOriginalUserDoc call for alias
    const experimentUserDoc = await this.experimentUserService.getUserDoc(logData.userId, request.logger);
    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }
    const logs = await this.experimentAssignmentService.dataLog(experimentUserDoc, logData.value, request.logger);
    return logs.map(({ createdAt, updatedAt, versionNumber, ...rest }) => {
      return rest;
    });
  }

  /**
   * @swagger
   * /log/caliper:
   *    post:
   *       description: Post Caliper format log data
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: data
   *            required: true
   *            description: User Document
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Log data
   *          '500':
   *            description: null value in column "id\" of relation \"experiment_user\" violates not-null constraint
   */
  @Post('log/caliper')
  public async caliperLog(
    @Body({ validate: false })
    @Req()
    request: AppRequest,
    envelope: CaliperLogEnvelope
  ): Promise<Log[]> {
    const result = envelope.data.map(async (log) => {
      // getOriginalUserDoc call for alias
      const experimentUserDoc = await this.experimentUserService.getUserDoc(log.object.assignee.id, request.logger);
      if (experimentUserDoc) {
        // append userDoc in logger
        request.logger.child({ userDoc: experimentUserDoc });
        request.logger.info({ message: 'Got the original user doc' });
      }
      return this.experimentAssignmentService.caliperDataLog(log, {
        logger: request.logger,
        userDoc: experimentUserDoc,
      });
    });

    const logsToReturn = await Promise.all(result);
    return flatten(logsToReturn);
  }

  /**
   * @swagger
   * /bloblog:
   *    post:
   *       description: Post blob log data
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: data
   *            required: true
   *            schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *               value:
   *                 type: array
   *                 items:
   *                   type: object
   *            description: User Document
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Log blob data
   */
  @Post('bloblog')
  public async blobLog(@Req() request: express.Request): Promise<any> {
    return new Promise((resolve, reject) => {
      request.on('readable', async () => {
        const blobData = JSON.parse(request.read());
        try {
          // The function will throw error if userId doesn't exist
          const experimentUserDoc = await this.experimentUserService.getUserDoc(blobData.userId, request.logger);
          if (experimentUserDoc) {
            // append userDoc in logger
            request.logger.child({ userDoc: experimentUserDoc });
            request.logger.info({ message: 'Got the original user doc' });
          }
          const response = await this.experimentAssignmentService.blobDataLog(
            experimentUserDoc,
            blobData.value,
            request.logger
          );
          resolve(response);
        } catch (error) {
          // The error is rejected so promise can now handle this error
          reject(error);
        }
      });
    }).catch((error) => {
      request.logger.error(error);
      error = new Error(
        JSON.stringify({
          type: SERVER_ERROR.EXPERIMENT_USER_NOT_DEFINED,
          message: error.message,
        })
      );
      (error as any).type = SERVER_ERROR.EXPERIMENT_USER_NOT_DEFINED;
      (error as any).httpCode = 404;
      throw error;
    });
  }

  /**
   * @swagger
   * /failed:
   *    post:
   *       description: Add error from client end
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: experimentError
   *            required: false
   *            schema:
   *             type: object
   *             properties:
   *              reason:
   *                type: string
   *              site:
   *                type: string
   *              userId:
   *                type: string
   *              target:
   *                type: string
   *            description: Experiment Error from client
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Client side reported error
   *          '500':
   *            description: null value in column "id\" of relation \"experiment_user\" violates not-null constraint
   */
  @Post('failed')
  public async failedExperimentPoint(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    errorBody: FailedParamsValidator
  ): Promise<ExperimentError> {
    const experimentUserDoc = await this.experimentUserService.getUserDoc(errorBody.userId, request.logger);
    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }
    return this.experimentAssignmentService.clientFailedExperimentPoint(
      errorBody.reason,
      errorBody.site,
      errorBody.userId,
      errorBody.target,
      {
        logger: request.logger,
        userDoc: experimentUserDoc,
      }
    );
  }

  /**
   * @swagger
   * /featureflag:
   *    post:
   *       description: Get all feature flags using SDK
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: user
   *           required: true
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 example: user1
   *               context:
   *                 type: string
   *                 example: add
   *             description: User Document
   *       produces:
   *         - application/json
   *       tags:
   *         - Client Side SDK
   *       responses:
   *          '200':
   *            description: Feature flags list
   */
  @Post('featureflag')
  public async getAllFlags(
    @Req() request: AppRequest,
    @Body({ validate: true })
    experiment: ExperimentAssignmentValidator
  ): Promise<string[]> {
    const experimentUserDoc = await this.experimentUserService.getUserDoc(experiment.userId, request.logger);
    return this.featureFlagService.getKeys(experimentUserDoc, experiment.context, request.logger);
  }

  /**
   * @swagger
   * /metric:
   *    post:
   *       description: Add filter metrics
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: params
   *            schema:
   *             type: object
   *             properties:
   *              metricUnit:
   *                type: object
   *            description: Filtered Metrics
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Filtered Metrics
   *          '500':
   *            description: Insert error in database
   */
  @Post('metric')
  public async filterMetrics(
    @Req()
    request: AppRequest,
    @Body({ validate: false })
    metric: MetricValidator
  ): Promise<Metric[]> {
    return await this.metricService.saveAllMetrics(metric.metricUnit, metric.context, request.logger);
  }

  /**
   * @swagger
   * /useraliases:
   *    patch:
   *       description: Set aliases for current user
   *       consumes:
   *         - application/json
   *       parameters:
   *          - in: body
   *            name: user aliases
   *            required: true
   *            schema:
   *             type: object
   *             required:
   *               - userId
   *               - aliases
   *             properties:
   *              userId:
   *                type: string
   *                example: user1
   *              aliases:
   *                type: array
   *                items:
   *                 type: string
   *                 example: alias123
   *            description: Set user aliases
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Experiment User aliases added
   *            schema:
   *              type: object
   *              properties:
   *                userId:
   *                  type: string
   *                  minLength: 1
   *                aliases:
   *                  type: array
   *                  items:
   *                    type: string
   *              required:
   *               - userId
   *               - userAliases
   *          '500':
   *            description: null value in column "id\" of relation \"experiment_user\" violates not-null constraint
   */
  @Patch('useraliases')
  public async setUserAliases(
    @Req()
    request: AppRequest,
    @Body()
    user: ExperimentUserAliasesValidator
  ): Promise<IUserAliases> {
    const experimentUserDoc = await this.experimentUserService.getUserDoc(user.userId, request.logger);
    if (experimentUserDoc) {
      // append userDoc in logger
      request.logger.child({ userDoc: experimentUserDoc });
      request.logger.info({ message: 'Got the original user doc' });
    }
    return this.experimentUserService.setAliasesForUser(experimentUserDoc, user.aliases, request.logger);
  }

  /**
   * @swagger
   * /clearDB:
   *    delete:
   *       description: Only available in DEMO mode. Removes everything except UpGrade users, metric metadata, UpGrade settings, and migrations
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Database cleared
   *          '500':
   *            description: DEMO mode is disabled
   */
  @Delete('clearDB')
  @OnUndefined(204)
  public clearDB(@Req() request: AppRequest) {
    // if DEMO mode is enabled, then clear the database:
    if (!env.app.demo) {
      this.experimentUserService.clearDB(request.logger);
    } else {
      request.logger.error({ message: 'DEMO mode is disabled. You cannot clear DB.' });
    }
    return;
  }
}
