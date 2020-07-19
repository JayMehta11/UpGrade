import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { MonitoredExperimentPointRepository } from '../repositories/MonitoredExperimentPointRepository';
import { IndividualAssignmentRepository } from '../repositories/IndividualAssignmentRepository';
// import { IndividualExclusionRepository } from '../repositories/IndividualExclusionRepository';
// import { GroupExclusionRepository } from '../repositories/GroupExclusionRepository';
import { GroupAssignmentRepository } from '../repositories/GroupAssignmentRepository';
import { ExperimentRepository } from '../repositories/ExperimentRepository';
// import { In } from 'typeorm';
// import { MonitoredExperimentPoint } from '../models/MonitoredExperimentPoint';
// import { IndividualAssignment } from '../models/IndividualAssignment';
import { IExperimentEnrollmentDetailStats, DATE_RANGE, IExperimentEnrollmentDetailDateStats, POST_EXPERIMENT_RULE } from 'upgrade_types';
// import { IndividualExclusion } from '../models/IndividualExclusion';
// import { GroupAssignment } from '../models/GroupAssignment';
// import { GroupExclusion } from '../models/GroupExclusion';
// import { ASSIGNMENT_TYPE } from '../../types';
import { AnalyticsRepository } from '../repositories/AnalyticsRepository';
import { Experiment } from '../models/Experiment';
import { ExperimentCondition } from '../models/ExperimentCondition';
import ObjectsToCsv from 'objects-to-csv';

interface IEnrollmentStatByDate {
  date: string;
  stats: IExperimentEnrollmentDetailDateStats;
}

@Service()
export class AnalyticsService {
  constructor(
    @OrmRepository()
    private experimentRepository: ExperimentRepository,
    @OrmRepository()
    private monitoredExperimentPointRepository: MonitoredExperimentPointRepository,
    @OrmRepository()
    private individualAssignmentRepository: IndividualAssignmentRepository,
    // @OrmRepository()
    // private individualExclusionRepository: IndividualExclusionRepository,
    // @OrmRepository()
    // private groupExclusionRepository: GroupExclusionRepository,
    @OrmRepository()
    private groupAssignmentRepository: GroupAssignmentRepository,
    @OrmRepository()
    private analyticsRepository: AnalyticsRepository
  ) {}

  public async getEnrollments(experimentIds: string[]): Promise<any> {
    return this.analyticsRepository.getEnrollments(experimentIds);
  }

  public async getDetailEnrolment(experimentId: string): Promise<IExperimentEnrollmentDetailStats> {
    const promiseArray = await Promise.all([
      this.experimentRepository.findOne(experimentId, { relations: ['conditions', 'partitions'] }),
      this.analyticsRepository.getDetailEnrollment(experimentId),
    ]);
    const experiment: Experiment = promiseArray[0];
    const [
      individualEnrollmentByCondition,
      individualEnrollmentConditionAndPartition,
      groupEnrollmentByCondition,
      groupEnrollmentConditionAndPartition,
      individualExclusion,
      groupExclusion,
    ] = promiseArray[1];

    console.log('individualEnrollmentByCondition', individualEnrollmentByCondition);
    console.log('individualEnrollmentConditionAndPartition', individualEnrollmentConditionAndPartition);
    console.log('groupEnrollmentByCondition', groupEnrollmentByCondition);
    console.log('groupEnrollmentConditionAndPartition', groupEnrollmentConditionAndPartition);
    console.log('individualExclusion', individualExclusion);
    console.log('groupExclusion', groupExclusion);

    return {
      id: experimentId,
      users:
        individualEnrollmentByCondition.reduce((accumulator: number, { count }): number => {
          return accumulator + parseInt(count, 10);
        }, 0) || 0,
      groups:
        groupEnrollmentByCondition.reduce((accumulator: number, { count }): number => {
          return accumulator + parseInt(count, 10);
        }, 0) || 0,
      usersExcluded: parseInt(individualExclusion[0].count, 10) || 0,
      groupsExcluded: parseInt(groupExclusion[0].count, 10) || 0,
      conditions: experiment.conditions.map(({ id }) => {
        const userInCondition = individualEnrollmentByCondition.find(({ conditions_id }) => {
          return conditions_id === id;
        });
        const groupInCondition = groupEnrollmentByCondition.find(({ conditions_id }) => {
          return conditions_id === id;
        });
        return {
          id,
          users: (userInCondition && parseInt(userInCondition.count, 10)) || 0,
          groups: (groupInCondition && parseInt(groupInCondition.count, 10)) || 0,
          partitions: experiment.partitions.map((partitionDoc) => {
            const userInConditionPartition = individualEnrollmentConditionAndPartition.find(
              ({ conditions_id, partitions_id }) => {
                return partitions_id === partitionDoc.id && conditions_id === id;
              }
            );
            const groupInConditionPartition = groupEnrollmentConditionAndPartition.find(
              ({ conditions_id, partitions_id }) => {
                return partitions_id === partitionDoc.id && conditions_id === id;
              }
            );
            return {
              id: partitionDoc.id,
              users: (userInConditionPartition && parseInt(userInConditionPartition.count, 10)) || 0,
              groups: (groupInConditionPartition && parseInt(groupInConditionPartition.count, 10)) || 0,
            };
          }),
        };
      }),
    };
  }

  public async getEnrolmentStatsByDate(experimentId: string, dateRange: DATE_RANGE): Promise<IEnrollmentStatByDate[]> {
    const keyToReturn = {};
    switch (dateRange) {
      case DATE_RANGE.LAST_SEVEN_DAYS:
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() - i);
          const newDate = new Date(date).toISOString();
          keyToReturn[newDate] = {};
        }
        break;
      case DATE_RANGE.LAST_THREE_MONTHS:
        for (let i = 0; i < 3; i++) {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(1);
          date.setMonth(date.getMonth() - i);
          const newDate = new Date(date).toISOString();
          keyToReturn[newDate] = {};
        }
        break;
      case DATE_RANGE.LAST_SIX_MONTHS:
        for (let i = 0; i < 6; i++) {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(1);
          date.setMonth(date.getMonth() - i);
          const newDate = new Date(date).toISOString();
          keyToReturn[newDate] = {};
        }
        break;
      default:
        for (let i = 0; i < 12; i++) {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(1);
          date.setMonth(date.getMonth() - i);
          const newDate = new Date(date).toISOString();
          keyToReturn[newDate] = {};
        }
        break;
    }

    const promiseArray = await Promise.all([
      this.experimentRepository.findOne(experimentId, { relations: ['conditions', 'partitions'] }),
      this.analyticsRepository.getEnrolmentByDateRange(experimentId, dateRange),
    ]);

    const experiment: Experiment = promiseArray[0];
    const [individualEnrollmentConditionAndPartition, groupEnrollmentConditionAndPartition] = promiseArray[1];

    // console.log('individualEnrollmentByCondition', individualEnrollmentByCondition);
    // console.log('individualEnrollmentConditionAndPartition', individualEnrollmentConditionAndPartition);
    // console.log('groupEnrollmentByCondition', groupEnrollmentByCondition);
    // console.log('groupEnrollmentConditionAndPartition', groupEnrollmentConditionAndPartition);
    // console.log('individualExclusion', individualExclusion);
    // console.log('groupExclusion', groupExclusion);

    return Object.keys(keyToReturn).map((date) => {
      const stats: IExperimentEnrollmentDetailDateStats = {
        id: experimentId,
        conditions: experiment.conditions.map(({ id }) => {
          return {
            id,
            partitions: experiment.partitions.map((partitionDoc) => {
              const userInConditionPartition = individualEnrollmentConditionAndPartition.find(
                ({ conditions_id, partitions_id, date_range }) => {
                  return (
                    partitions_id === partitionDoc.id &&
                    conditions_id === id &&
                    new Date(date).getTime() === (date_range as any).getTime()
                  );
                }
              );
              const groupInConditionPartition = groupEnrollmentConditionAndPartition.find(
                ({ conditions_id, partitions_id, date_range }) => {
                  return (
                    partitions_id === partitionDoc.id &&
                    conditions_id === id &&
                    new Date(date).getTime() === (date_range as any).getTime()
                  );
                }
              );
              return {
                id: partitionDoc.id,
                users: (userInConditionPartition && parseInt(userInConditionPartition.count, 10)) || 0,
                groups: (groupInConditionPartition && parseInt(groupInConditionPartition.count, 10)) || 0,
              };
            }),
          };
        }),
      };
      return {
        date,
        stats,
      };
    });
  }

  public async getCSVData(experimentId: string, email: string): Promise<string> {
    // get experiment definition
    const experiment = await this.experimentRepository.findOne({
      where: { id: experimentId },
      relations: ['partitions', 'conditions'],
    });

    if (!experiment) {
      return '';
    }
    const { conditions, partitions, ...experimentInfo } = experiment;
    const experimentIdAndPoint = [];
    partitions.forEach((partition) => {
      const partitionId = partition.id;
      experimentIdAndPoint.push(partitionId);
    });
    const timeStamp = new Date().toISOString();

    const promiseData = await Promise.all([
      this.individualAssignmentRepository.findIndividualAssignmentsByConditions(experimentId),
      this.groupAssignmentRepository.findGroupAssignmentsByConditions(experimentId),
      this.monitoredExperimentPointRepository.getMonitoredExperimentPointCount(experimentIdAndPoint)
    ]);

    let csvRows: any = [{
      'Created At': experimentInfo.createdAt.toISOString(),
      'Updated At': experimentInfo.updatedAt.toISOString(),
      'version Number': experimentInfo.versionNumber,
      'Experiment ID': experimentInfo.id,
      'Experiment Name': experimentInfo.name,
      'Experiment Description': experimentInfo.description,
      'Enrollment Start Date': experimentInfo.startDate && experimentInfo.startDate.toISOString(),
      'Enrollment End Date': experimentInfo.endDate && experimentInfo.endDate.toISOString(),
      'Unit of Assignment': experimentInfo.assignmentUnit,
      'Consistency Rule': experimentInfo.consistencyRule,
      'Group': experimentInfo.group,
      'Tags': experimentInfo.tags.join(','),
      'Context': experimentInfo.context.join(','),
      'Condition Names': conditions.map(condition => condition.conditionCode).join(','),
      'Condition Weights': conditions.map(condition => condition.assignmentWeight).join(','),
      'Condition UserNs': this.getConditionByCount(conditions, promiseData[0]),
      'Condition GroupNs': this.getConditionByCount(conditions, promiseData[1]),
      'Ending Criteria': experimentInfo.enrollmentCompleteCondition && JSON.stringify(experimentInfo.enrollmentCompleteCondition),
      'Post-Experiment Rule': experimentInfo.postExperimentRule === POST_EXPERIMENT_RULE.CONTINUE
      ? experimentInfo.postExperimentRule
      : experimentInfo.revertTo ? 'revert ( ' +  this.getConditionCode(conditions, experimentInfo.revertTo) + ' )' : 'revert (to default)' ,
      'ExperimentPoints': partitions.map(partition => partition.expPoint).join(','),
      'ExperimentIDs': partitions.map(partition => partition.expId).join(','),
    }];

    let csv = new ObjectsToCsv(csvRows);
    await csv.toDisk(`src/api/assets/files/${email}_experiment_${timeStamp}.csv`);
    for (let i = 1; i <= promiseData[2]; i++) {
      csvRows = [];
      const monitoredExperimentPoints = await this.monitoredExperimentPointRepository.getMonitorExperimentPointForExport(i - 1, 1, experimentIdAndPoint, experimentId);
      console.log('monitoredExperimentPoints', monitoredExperimentPoints);
      monitoredExperimentPoints.forEach(data => {
        console.log('data.condition', data.assignment.condition);
        csvRows.push({
          'UserID': data.user.id || '',
          'markExperimentPointTime': data.createdAt.toISOString(),
          'Enrollment code': data.enrollmentCode,
          'Condition Name': data.assignment && data.assignment.condition.conditionCode || 'default',
          'GroupID': data.user.workingGroup || '',
          'ExperimentPoint': data.partition.expPoint,
          'ExperimentID': data.partition.expId,
          'Metrics monitored': ''
        });
      });
      csv = new ObjectsToCsv(csvRows);
      await csv.toDisk(`src/api/assets/files/${email}_monitoredPoints${timeStamp}.csv`, { append: true });
    }
    return '';
  }

  private getConditionCode(conditions: ExperimentCondition[], id: string): string {
    return conditions.filter(condition => condition.id === id)[0].conditionCode || '';
  }

  private getConditionByCount(conditions: ExperimentCondition[], data: any): string {
    return conditions.map(condition => {
      const conditionFound = data.find(con => (con as any).conditionId === condition.id);
      return conditionFound ? (conditionFound as any).count : 0;
    }).join(',');
  }
}
