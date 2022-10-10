import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserAppointments1653996102801 implements MigrationInterface {
  name = 'UserAppointments1653996102801'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_appointments_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "appointmentId" uuid NOT NULL, "speciality" character varying, "doctor" character varying, "datetime" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_c112cd473b8c7c290a37d9bdb68" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "appointments_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "tag" character varying, CONSTRAINT "PK_8736ebfed4d8236b8a9bd2fa153" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_appointments_entity" ADD CONSTRAINT "FK_edcfc8f62cc45b0cde93936417b" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_appointments_entity" ADD CONSTRAINT "FK_d9960e116ee5d98ed263257b080" FOREIGN KEY ("appointmentId") REFERENCES "appointments_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_appointments_entity" DROP CONSTRAINT "FK_d9960e116ee5d98ed263257b080"`)
    await queryRunner.query(`ALTER TABLE "user_appointments_entity" DROP CONSTRAINT "FK_edcfc8f62cc45b0cde93936417b"`)
    await queryRunner.query(`DROP TABLE "appointments_entity"`)
    await queryRunner.query(`DROP TABLE "user_appointments_entity"`)
  }
}
