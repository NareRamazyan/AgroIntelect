const { EntitySchema } = require("typeorm");

const UserSchema = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: { 
            primary: true, 
            type: "int", 
            generated: true 
        },
        login: { 
            type: "varchar", 
        },
        email: { 
            type: "varchar", 
            unique: true 
        },
        pass: { 
            type: "varchar" 
        },
        name: { 
            type: "varchar", 
            nullable: true 
        },
        phone: { 
            type: "varchar", 
            nullable: true 
        }
    },
    relations: {
        histories: {
            target: "History", 
            type: "one-to-many",
            inverseSide: "user"
        }
    } 
});

module.exports = { UserSchema };