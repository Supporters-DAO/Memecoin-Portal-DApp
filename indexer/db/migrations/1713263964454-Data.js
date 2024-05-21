module.exports = class Data1713263964454 {
    name = 'Data1713263964454'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_f4007436c1b546ede08a4fd7ab"`)
        await db.query(`CREATE TABLE "account_balance" ("id" character varying NOT NULL, "address" text NOT NULL, "balance" numeric NOT NULL, "coin_id" character varying, CONSTRAINT "PK_bd893045760f719e24a95a42562" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_aa6eff25c58cd169594aa92ab3" ON "account_balance" ("address") `)
        await db.query(`CREATE INDEX "IDX_a88504e19111589f574755ced6" ON "account_balance" ("coin_id") `)
        await db.query(`ALTER TABLE "coin" ADD "circulating_supply" numeric NOT NULL`)
        await db.query(`ALTER TABLE "coin" ADD "burned" numeric NOT NULL`)
        await db.query(`ALTER TABLE "coin" ADD "holders" integer NOT NULL`)
        await db.query(`ALTER TABLE "account_balance" ADD CONSTRAINT "FK_a88504e19111589f574755ced6e" FOREIGN KEY ("coin_id") REFERENCES "coin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_f4007436c1b546ede08a4fd7ab" ON "transfer" ("amount") `)
        await db.query(`DROP TABLE "account_balance"`)
        await db.query(`DROP INDEX "public"."IDX_aa6eff25c58cd169594aa92ab3"`)
        await db.query(`DROP INDEX "public"."IDX_a88504e19111589f574755ced6"`)
        await db.query(`ALTER TABLE "coin" DROP COLUMN "circulating_supply"`)
        await db.query(`ALTER TABLE "coin" DROP COLUMN "burned"`)
        await db.query(`ALTER TABLE "coin" DROP COLUMN "holders"`)
        await db.query(`ALTER TABLE "account_balance" DROP CONSTRAINT "FK_a88504e19111589f574755ced6e"`)
    }
}
