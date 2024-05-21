module.exports = class Data1716203117438 {
    name = 'Data1716203117438'

    async up(db) {
        await db.query(`ALTER TABLE "coin" ADD "minted" numeric NOT NULL default 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "coin" DROP COLUMN "minted"`)
    }
}
