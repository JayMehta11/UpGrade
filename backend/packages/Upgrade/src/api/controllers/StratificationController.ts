import { JsonController, Get, Delete, Param, Authorized, Req, Res, Body, Post } from 'routing-controllers';
import { SERVER_ERROR } from 'upgrade_types';
import { AppRequest } from '../../types';
import { UserStratificationFactor } from '../models/UserStratificationFactor';
import { StratificationService } from '../services/StratificationService';
import { FactorStrata, UploadedFilesArrayValidator } from './validators/StratificationValidator';
import { StratificationFactor } from '../models/StratificationFactor';
import * as express from 'express';

/**
 * @swagger
 * definitions:
 *   FactorStrata:
 *     description: ''
 *     type: object
 *     required:
 *       - factor
 *       - value
 *     properties:
 *       factor:
 *         type: string
 *       value:
 *         type: object
 *   UserStratificationFactor:
 *     description: ''
 *     type: object
 *     properties:
 *       user:
 *         type: object
 *         required:
 *           - id
 *         properties:
 *           id:
 *             type: string
 *           group:
 *             type: object
 *           workingGroup:
 *             type: object
 *       stratificationFactor:
 *         type: object
 *         required:
 *           - stratificationFactorName
 *         properties:
 *           stratificationFactorName:
 *             type: string
 *       stratificationFactorValue:
 *         type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Stratification
 *     description: CRUD operations related to Stratification
 */
@Authorized()
@JsonController('/stratification')
export class StratificationController {
  constructor(public stratificationService: StratificationService) {}

  /**
   * @swagger
   * /stratification:
   *    get:
   *       description: Get all stratification
   *       tags:
   *         - Stratification
   *       produces:
   *         - application/json
   *       responses:
   *          '200':
   *            description: Get all stratification
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/definitions/FactorStrata'
   *          '401':
   *            description: Authorization Required Error
   */
  @Get()
  public async getAllStratification(@Req() request: AppRequest): Promise<FactorStrata[]> {
    return this.stratificationService.getAllStratification(request.logger);
  }

  /**
   * @swagger
   * /stratification/download/{factor}:
   *    get:
   *      description: Get stratificationFactor CSV by factorName
   *      tags:
   *        - Stratification
   *      produces:
   *        - application/json
   *      parameters:
   *        - in: path
   *          name: factor
   *          description: Factor name
   *          required: true
   *          schema:
   *            type: string
   *      responses:
   *        '200':
   *          description: Get stratificationFactor detailed CSV by name
   *        '401':
   *          description: Authorization Required Error
   *        '404':
   *          description: Factor name not found
   *        '500':
   *          description: Internal Server Error, FactorName is not valid
   */
  @Get('/download/:factor')
  public async getStratificationByFactor(
    @Param('factor') factor: string,
    @Req() request: AppRequest,
    @Res() res: express.Response
  ): Promise<express.Response> {
    if (!factor) {
      return Promise.reject(new Error(SERVER_ERROR.MISSING_PARAMS + ' : stratification Factor should not be null.'));
    }

    const csvData = await this.stratificationService.getCSVDataByFactor(factor, request.logger);

    // return csv file with appropriate headers to request;
    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader('Content-Disposition', `attachment; filename=data-${factor}.csv`);
    return res.send(csvData);
  }

  /**
   * @swagger
   * /stratification:
   *    post:
   *      description: Create a new stratificationFactor by CSV
   *      tags:
   *        - Stratification
   *      produces:
   *        - application/json
   *      parameters:
   *        - in: body
   *          name: file
   *          description: CSV file
   *          required: true
   *          schema:
   *            type: file
   *      responses:
   *        '200':
   *          description: Create a new UserStratificationFactors by CSV
   *          schema:
   *            type: array
   *            items:
   *              $ref: '#/definitions/UserStratificationFactor'
   *        '401':
   *          description: Authorization Required Error
   *        '500':
   *          description: Internal Server Error, Insert Error in database, CSV file is not valid
   */
  @Post()
  public async insertStratification(
    @Req() request: AppRequest,
    @Body({ validate: true }) body: UploadedFilesArrayValidator
  ): Promise<UserStratificationFactor[]> {
    const promises = body.files.map((fileObj) => {
      return this.stratificationService.insertStratification(fileObj.file, request.logger);
    });
    return (await Promise.all(promises)).flat();
  }

  /**
   * @swagger
   * /stratification/{factor}:
   *    delete:
   *      description: Delete a stratificationFactor by factorName
   *      tags:
   *      - Stratification
   *      produces:
   *        - application/json
   *      parameters:
   *        - in: path
   *          name: factor
   *          description: Factor name
   *          required: true
   *          schema:
   *            type: string
   *      responses:
   *        '200':
   *          description: Delete a stratificationFactor by factorName
   *          schema:
   *            $ref: '#/definitions/FactorStrata'
   *        '401':
   *          description: Authorization Required Error
   *        '500':
   *          description: Internal Server Error, FactorName is not valid
   */
  @Delete('/:factor')
  public deleteStratification(
    @Param('factor') stratificationFactor: string,
    @Req() request: AppRequest
  ): Promise<StratificationFactor> {
    if (!stratificationFactor) {
      return Promise.reject(new Error(SERVER_ERROR.MISSING_PARAMS + ' : stratification Factor should not be null.'));
    }
    return this.stratificationService.deleteStratification(stratificationFactor, request.logger);
  }
}
