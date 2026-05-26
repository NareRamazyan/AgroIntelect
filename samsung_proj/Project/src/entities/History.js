const { EntitySchema } = require("typeorm");

const HistorySchema = new EntitySchema({
    name: "History",
    tableName: "histories",
    columns: {
        id: { 
            primary: true, 
            type: "int", 
            generated: true 
        },
        action: { 
            type: "varchar" 
        },
        created_at: { 
            type: "timestamp", 
            createDate: true 
        }
    },
    relations: {
        user: {
            target: "User", // Սա կապում է History-ն User-ի հետ
            type: "many-to-one",
            joinColumn: true, // Սա ավտոմատ կստեղծի userId սյունակը
            inverseSide: "histories"
        }
    } 
});

module.exports = { HistorySchema };