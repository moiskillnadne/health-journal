import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserTargetGroups1659600609278 implements MigrationInterface {
  name = 'UserTargetGroups1659600609278'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_77b8bde37b57f4549004e96270"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_f2e2e4a31a2dc0b01f12732da4"`)
    await queryRunner.query(`ALTER TABLE "conditions_entity" ADD "tag" character varying`)
    await queryRunner.query(`ALTER TABLE "target_group_entity" ADD "tag" character varying`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "PK_77c1bdc4a11c6d7a66c1ec3c28d"`)
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "PK_8d53ca4c22698d77e8db8440113" PRIMARY KEY ("userId", "targetGroupId", "id")`,
    )
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" ADD "updateAt" TIMESTAMP DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "FK_77b8bde37b57f4549004e962707"`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "FK_f2e2e4a31a2dc0b01f12732da44"`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "PK_8d53ca4c22698d77e8db8440113"`)
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "PK_23ec7157119e850c49e961cc401" PRIMARY KEY ("targetGroupId", "id")`,
    )
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "PK_23ec7157119e850c49e961cc401"`)
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "PK_cf9cf628862322801cd172c826c" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "FK_77b8bde37b57f4549004e962707" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "FK_f2e2e4a31a2dc0b01f12732da44" FOREIGN KEY ("targetGroupId") REFERENCES "target_group_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "FK_f2e2e4a31a2dc0b01f12732da44"`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "FK_77b8bde37b57f4549004e962707"`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "PK_cf9cf628862322801cd172c826c"`)
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "PK_23ec7157119e850c49e961cc401" PRIMARY KEY ("targetGroupId", "id")`,
    )
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "PK_23ec7157119e850c49e961cc401"`)
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "PK_8d53ca4c22698d77e8db8440113" PRIMARY KEY ("userId", "targetGroupId", "id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "FK_f2e2e4a31a2dc0b01f12732da44" FOREIGN KEY ("targetGroupId") REFERENCES "target_group_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "FK_77b8bde37b57f4549004e962707" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP COLUMN "updateAt"`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP COLUMN "createAt"`)
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP CONSTRAINT "PK_8d53ca4c22698d77e8db8440113"`)
    await queryRunner.query(
      `ALTER TABLE "user_target_groups_entity" ADD CONSTRAINT "PK_77c1bdc4a11c6d7a66c1ec3c28d" PRIMARY KEY ("userId", "targetGroupId")`,
    )
    await queryRunner.query(`ALTER TABLE "user_target_groups_entity" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "target_group_entity" DROP COLUMN "tag"`)
    await queryRunner.query(`ALTER TABLE "conditions_entity" DROP COLUMN "tag"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_f2e2e4a31a2dc0b01f12732da4" ON "user_target_groups_entity" ("targetGroupId") `,
    )
    await queryRunner.query(`CREATE INDEX "IDX_77b8bde37b57f4549004e96270" ON "user_target_groups_entity" ("userId") `)
  }
}
