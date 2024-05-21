module.exports = class Data1712235181171 {
    name = 'Data1712235181171'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "from" text NOT NULL, "to" text NOT NULL, "amount" numeric NOT NULL, "coin_id" character varying, "factory_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_430eeb3c66f5772bb0299113c6" ON "transfer" ("coin_id") `)
        await db.query(`CREATE INDEX "IDX_d6624eacc30144ea97915fe846" ON "transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_070c555a86b0b41a534a55a659" ON "transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_f4007436c1b546ede08a4fd7ab" ON "transfer" ("amount") `)
        await db.query(`CREATE INDEX "IDX_da3bd5374c3bd206d207f114f6" ON "transfer" ("factory_id") `)
        await db.query(`CREATE TABLE "coin" ("id" character varying NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "decimals" integer NOT NULL, "initial_supply" numeric NOT NULL, "max_supply" numeric NOT NULL, "website" text, "telegram" text, "twitter" text, "discord" text, "description" text NOT NULL, "image" text, "screenshots" text array NOT NULL, "admins" text array NOT NULL, "distributed" numeric NOT NULL, "created_by" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "factory_id" character varying, CONSTRAINT "PK_650993fc71b789e4793b62fbcac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_44484875c0658c07e3841fb22d" ON "coin" ("factory_id") `)
        await db.query(`CREATE INDEX "IDX_ea74e8d68692e9b6fb63f02fa3" ON "coin" ("timestamp") `)
        await db.query(`CREATE TABLE "factory" ("id" character varying NOT NULL, "address" text NOT NULL, "meta" text NOT NULL, "coin_meta" text NOT NULL, CONSTRAINT "PK_1372e5a7d114a3fa80736ba66bb" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "memcoin_factory_event" ("id" character varying NOT NULL, "type" text NOT NULL, "raw" text NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "factory_id" character varying, CONSTRAINT "PK_02022f76709f025e98bcbfb6893" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_96f35648211c8e4ca176a7a4fc" ON "memcoin_factory_event" ("factory_id") `)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_430eeb3c66f5772bb0299113c6c" FOREIGN KEY ("coin_id") REFERENCES "coin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_da3bd5374c3bd206d207f114f67" FOREIGN KEY ("factory_id") REFERENCES "factory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "coin" ADD CONSTRAINT "FK_44484875c0658c07e3841fb22d3" FOREIGN KEY ("factory_id") REFERENCES "factory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "memcoin_factory_event" ADD CONSTRAINT "FK_96f35648211c8e4ca176a7a4fc9" FOREIGN KEY ("factory_id") REFERENCES "factory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_430eeb3c66f5772bb0299113c6"`)
        await db.query(`DROP INDEX "public"."IDX_d6624eacc30144ea97915fe846"`)
        await db.query(`DROP INDEX "public"."IDX_70ff8b624c3118ac3a4862d22c"`)
        await db.query(`DROP INDEX "public"."IDX_070c555a86b0b41a534a55a659"`)
        await db.query(`DROP INDEX "public"."IDX_f4007436c1b546ede08a4fd7ab"`)
        await db.query(`DROP INDEX "public"."IDX_da3bd5374c3bd206d207f114f6"`)
        await db.query(`DROP TABLE "coin"`)
        await db.query(`DROP INDEX "public"."IDX_44484875c0658c07e3841fb22d"`)
        await db.query(`DROP INDEX "public"."IDX_ea74e8d68692e9b6fb63f02fa3"`)
        await db.query(`DROP TABLE "factory"`)
        await db.query(`DROP TABLE "memcoin_factory_event"`)
        await db.query(`DROP INDEX "public"."IDX_96f35648211c8e4ca176a7a4fc"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_430eeb3c66f5772bb0299113c6c"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_da3bd5374c3bd206d207f114f67"`)
        await db.query(`ALTER TABLE "coin" DROP CONSTRAINT "FK_44484875c0658c07e3841fb22d3"`)
        await db.query(`ALTER TABLE "memcoin_factory_event" DROP CONSTRAINT "FK_96f35648211c8e4ca176a7a4fc9"`)
    }
}
