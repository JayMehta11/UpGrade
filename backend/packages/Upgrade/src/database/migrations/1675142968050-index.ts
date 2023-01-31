import {MigrationInterface, QueryRunner} from "typeorm";

export class index1675142968050 implements MigrationInterface {
    name = 'index1675142968050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."experiment_error_type_enum" RENAME TO "experiment_error_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."experiment_error_type_enum" AS ENUM('Database not reachable', 'Database auth fail', 'Error in the assignment algorithm', 'Parameter missing in the client request', 'Parameter not in the correct format', 'User ID not found', 'Query Failed', 'Error reported from client', 'Experiment user not defined', 'Experiment user group not defined', 'Working group is not a subset of user group', 'Invalid token', 'Token is not present in request', 'Error in migration', 'Email send error', 'Condition not found', 'Experiment ID not provided for shared Decision Point', 'Experiment ID provided is invalid for shared Decision Point')`);
        await queryRunner.query(`ALTER TABLE "public"."experiment_error" ALTER COLUMN "type" TYPE "public"."experiment_error_type_enum" USING "type"::"text"::"public"."experiment_error_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."experiment_error_type_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_a12b2ac5e10ea27d692b43fd80" ON "public"."decision_point" ("experimentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_715bbd2f483a715789a991123e" ON "public"."group_for_segment" ("segmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb84433b17891682f9a7712675" ON "public"."individual_for_segment" ("segmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c95e8b36cee12dbdaa643de238" ON "public"."condition_alias" ("parentConditionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6620368844e3608be5ef131baf" ON "public"."condition_alias" ("decisionPointId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6620368844e3608be5ef131baf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c95e8b36cee12dbdaa643de238"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb84433b17891682f9a7712675"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_715bbd2f483a715789a991123e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a12b2ac5e10ea27d692b43fd80"`);
        await queryRunner.query(`CREATE TYPE "public"."experiment_error_type_enum_old" AS ENUM('Database not reachable', 'Database auth fail', 'Error in the assignment algorithm', 'Parameter missing in the client request', 'Parameter not in the correct format', 'User ID not found', 'Query Failed', 'Error reported from client', 'Experiment user not defined', 'Experiment user group not defined', 'Working group is not a subset of user group', 'Invalid token', 'Token is not present in request', 'Error in migration', 'Email send error', 'Condition not found', 'Experiment ID not provided for shared Decision Point')`);
        await queryRunner.query(`ALTER TABLE "public"."experiment_error" ALTER COLUMN "type" TYPE "public"."experiment_error_type_enum_old" USING "type"::"text"::"public"."experiment_error_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."experiment_error_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."experiment_error_type_enum_old" RENAME TO "experiment_error_type_enum"`);
    }

}
