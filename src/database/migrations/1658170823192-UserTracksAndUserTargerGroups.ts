import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserTracksAndUserTargerGroups1658170823192 implements MigrationInterface {
  name = 'UserTracksAndUserTargerGroups1658170823192'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_tracks_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "trackId" uuid NOT NULL, "assignedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_b4d4020d52db3cdf064068d28e5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_target_groups_entity" ("userId" uuid NOT NULL, "targetGroupId" uuid NOT NULL, CONSTRAINT "PK_77c1bdc4a11c6d7a66c1ec3c28d" PRIMARY KEY ("userId", "targetGroupId"))`,
    )
    await queryRunner.query(`CREATE INDEX "IDX_77b8bde37b57f4549004e96270" ON "user_target_groups_entity" ("userId") `)
    await queryRunner.query(
      `CREATE INDEX "IDX_f2e2e4a31a2dc0b01f12732da4" ON "user_target_groups_entity" ("targetGroupId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tracks_entity" ADD CONSTRAINT "FK_8eca062e666ee5de3e65232f92c" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tracks_entity" ADD CONSTRAINT "FK_62e33369a702e0b7ae5c8e6e036" FOREIGN KEY ("trackId") REFERENCES "track_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
    await queryRunner.query(`ALTER TABLE "user_tracks_entity" DROP CONSTRAINT "FK_62e33369a702e0b7ae5c8e6e036"`)
    await queryRunner.query(`ALTER TABLE "user_tracks_entity" DROP CONSTRAINT "FK_8eca062e666ee5de3e65232f92c"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_f2e2e4a31a2dc0b01f12732da4"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_77b8bde37b57f4549004e96270"`)
    await queryRunner.query(`DROP TABLE "user_target_groups_entity"`)
    await queryRunner.query(`DROP TABLE "user_tracks_entity"`)
  }
}
