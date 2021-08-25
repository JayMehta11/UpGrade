import { JsonController, Post, Body, UseBefore, Get, BodyParam, Req } from 'routing-controllers';
import { ExperimentService } from '../services/ExperimentService';
import { ExperimentAssignmentService } from '../services/ExperimentAssignmentService';
import { MarkExperimentValidator } from './validators/MarkExperimentValidator';
import { ExperimentAssignmentValidator } from './validators/ExperimentAssignmentValidator';
import { ExperimentUser } from '../models/ExperimentUser';
import { ExperimentUserService } from '../services/ExperimentUserService';
import { UpdateWorkingGroupValidator } from './validators/UpdateWorkingGroupValidator';
import { MonitoredExperimentPoint } from '../models/MonitoredExperimentPoint';
import { IExperimentAssignment, ISingleMetric, IGroupMetric } from 'upgrade_types';
import { FailedParamsValidator } from './validators/FailedParamsValidator';
import { ExperimentError } from '../models/ExperimentError';
import { FeatureFlag } from '../models/FeatureFlag';
import { FeatureFlagService } from '../services/FeatureFlagService';
import { ClientLibMiddleware } from '../middlewares/ClientLibMiddleware';
import { LogValidator } from './validators/LogValidator';
import { Log } from '../models/Log';
import { MetricService } from '../services/MetricService';
import { ExperimentUserAliasesValidator } from './validators/ExperimentUserAliasesValidator';
import { Metric } from '../models/Metric';
import * as express from 'express';

/**
 * @swagger
 * definitions:
 *   initResponse:
 *     type: object
 *     properties:
 *       createdAt:
 *         type: string
 *         minLength: 1
 *       updatedAt:
 *         type: string
 *         minLength: 1
 *       versionNumber:
 *         type: number
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
 *       - createdAt
 *       - updatedAt
 *       - versionNumber
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

@JsonController('/')
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
   *               group:
   *                 type: object
   *               workingGroup:
   *                 type: object
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
    @Body({ validate: { validationError: { target: false, value: false } } })
    experimentUser: ExperimentUser
  ): Promise<ExperimentUser> {
    const document = await this.experimentUserService.create([experimentUser]);
    return document[0];
  }

  /**
   * @swagger
   * /groupmembership:
   *    post:
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
   *               group:
   *                 type: object
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
  @Post('groupmembership')
  public setGroupMemberShip(
    @Body({ validate: { validationError: { target: false, value: false } } })
    experimentUser: ExperimentUser
  ): Promise<ExperimentUser> {
    return this.experimentUserService.updateGroupMembership(experimentUser.id, experimentUser.group);
  }

  /**
   * @swagger
   * /workinggroup:
   *    post:
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
   *               workingGroup:
   *                 type: object
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
  @Post('workinggroup')
  public setWorkingGroup(
    @Body({ validate: { validationError: { target: false, value: false } } })
    workingGroupParams: UpdateWorkingGroupValidator
  ): Promise<ExperimentUser> {
    return this.experimentUserService.updateWorkingGroup(workingGroupParams.id, workingGroupParams.workingGroup);
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
   *           name: userId
   *           required: true
   *           schema:
   *             type: string
   *           description: User ID
   *         - in: body
   *           name: experimentPoint
   *           required: true
   *           schema:
   *             type: string
   *           description: Experiment Point
   *         - in: body
   *           name: partitionId
   *           required: true
   *           schema:
   *             type: string
   *           description: Partition ID
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
   *                createdAt:
   *                  type: string
   *                  minLength: 1
   *                updatedAt:
   *                  type: string
   *                  minLength: 1
   *                versionNumber:
   *                  type: number
   *                id:
   *                  type: string
   *                  minLength: 1
   *                experimentId:
   *                  type: string
   *                  minLength: 1
   *                enrollmentCode:
   *                  type: string
   *                  minLength: 1
   *                userId:
   *                  type: string
   *                  minLength: 1
   *                condition:
   *                  type: string
   *                  minLength: 1
   *              required:
   *                - createdAt
   *                - updatedAt
   *                - versionNumber
   *                - id
   *                - experimentId
   *                - enrollmentCode
   *                - userId
   *                - condition
   */
  @Post('mark')
  public markExperimentPoint(
    @Body({ validate: { validationError: { target: false, value: false } } })
    experiment: MarkExperimentValidator
  ): Promise<MonitoredExperimentPoint> {
    return this.experimentAssignmentService.markExperimentPoint(
      experiment.userId,
      experiment.experimentPoint,
      experiment.condition,
      experiment.partitionId
    );
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
   *               context:
   *                 type: string
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
   *                  - expId
   *                  - expPoint
   *                  - twoCharacterId
   *                  - assignedCondition
   *                properties:
   *                  expId:
   *                    type: string
   *                    minLength: 1
   *                  expPoint:
   *                    type: string
   *                    minLength: 1
   *                  twoCharacterId:
   *                    type: string
   *                    minLength: 1
   *                  assignedCondition:
   *                    type: object
   *                    properties:
   *                      createdAt:
   *                        type: string
   *                        minLength: 1
   *                      updatedAt:
   *                        type: string
   *                        minLength: 1
   *                      versionNumber:
   *                        type: number
   *                      id:
   *                        type: string
   *                        minLength: 1
   *                      twoCharacterId:
   *                        type: string
   *                        minLength: 1
   *                      name:
   *                        type: string
   *                      description: {}
   *                      conditionCode:
   *                        type: string
   *                        minLength: 1
   *                      assignmentWeight:
   *                        type: number
   *                      order:
   *                        type: number
   *                    required:
   *                      - createdAt
   *                      - updatedAt
   *                      - versionNumber
   *                      - id
   *                      - twoCharacterId
   *                      - name
   *                      - conditionCode
   *                      - assignmentWeight
   *                      - order
   */
  @Post('assign')
  public getAllExperimentConditions(
    @Body({ validate: { validationError: { target: false, value: false } } })
    experiment: ExperimentAssignmentValidator
  ): Promise<IExperimentAssignment[]> {
    return this.experimentAssignmentService.getAllExperimentConditions(experiment.userId, experiment.context);
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
   *               value:
   *                 type: string
   *            description: User Document
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Log data
   */
  @Post('log')
  public log(
    @Body({ validate: { validationError: { target: false, value: false } } })
    logData: LogValidator
  ): Promise<Log[]> {
    return this.experimentAssignmentService.dataLog(logData.userId, logData.value);
  }

  /**
   * @swagger
   * /bloblog:
   *    post:
   *       description: Post blob log data
   *       consumes:
   *         - multipart/form-data
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
   *                 type: string
   *                 format: binary
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
  public blobLog(@Req() request: express.Request): Promise<Log[]> {
    return new Promise((resolve) => {
      request.on('readable', async (data) => {
        const blobData = JSON.parse(request.read());
        const response = await this.experimentAssignmentService.blobDataLog(blobData.userId, blobData.value);
        resolve(response);
      });
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
   *              experimentPoint:
   *                type: string
   *              experimentId:
   *                type: string
   *            description: Experiment Error from client
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Client side reported error
   */
  @Post('failed')
  public failedExperimentPoint(
    @Body({ validate: { validationError: { target: false, value: false } } })
    errorBody: FailedParamsValidator
  ): Promise<ExperimentError> {
    return this.experimentAssignmentService.clientFailedExperimentPoint(
      errorBody.reason,
      errorBody.experimentPoint,
      errorBody.userId,
      errorBody.experimentId
    );
  }

  /**
   * @swagger
   * /featureflags:
   *    get:
   *       description: Get all feature flags using SDK
   *       produces:
   *         - application/json
   *       tags:
   *         - Client Side SDK
   *       responses:
   *          '200':
   *            description: Feature flags list
   */
  @Get('featureflag')
  public getAllFlags(): Promise<FeatureFlag[]> {
    return this.featureFlagService.find();
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
   */
  @Post('metric')
  public filterMetrics(@BodyParam('metricUnit') metricUnit: Array<ISingleMetric | IGroupMetric>): Promise<Metric[]> {
    return this.metricService.saveAllMetrics(metricUnit);
  }

  /**
   * @swagger
   * /useraliases:
   *    post:
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
   *              aliases:
   *                type: array
   *                items:
   *                 type: string
   *            description: Set user aliases
   *       tags:
   *         - Client Side SDK
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Experiment User aliases added
   *            schema:
   *              type: array
   *              description: ''
   *              minItems: 1
   *              uniqueItems: true
   *              items:
   *                type: object
   *                required:
   *                  - id
   *                  - createdAt
   *                  - updatedAt
   *                  - versionNumber
   *                  - originalUser
   *                properties:
   *                  id:
   *                    type: string
   *                    minLength: 1
   *                  group: {}
   *                  workingGroup: {}
   *                  createdAt:
   *                    type: string
   *                    minLength: 1
   *                  updatedAt:
   *                    type: string
   *                    minLength: 1
   *                  versionNumber:
   *                    type: number
   *                  originalUser:
   *                    type: string
   *                    minLength: 1
   */
  @Post('useraliases')
  public setUserAliases(@Body() user: ExperimentUserAliasesValidator): Promise<ExperimentUser[]> {
    return this.experimentUserService.setAliasesForUser(user.userId, user.aliases);
  }
}
