module.exports = class Data1713344463294 {
    name = 'Data1713344463294'

    async up(db) {
        await db.query(`ALTER TABLE "coin" ADD "tokenomics" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "coin" DROP COLUMN "tokenomics"`)
    }
}
