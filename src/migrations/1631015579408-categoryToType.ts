import { MigrationInterface, QueryRunner } from "typeorm";

export class categoryToType1631015579408 implements MigrationInterface {
    name = 'categoryToType1631015579408';
    // update
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
        );
    }
    // rollback
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
        );
    }
}
