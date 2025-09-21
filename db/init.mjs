import { getDb } from "./conn.mjs";

async function ensureUsersValidationAndIndexes(db) {
    const name = "users";

    // If collection doesn't exist, create with validation; if it does, update
    const exists = await db.listCollections({ name }).hasNext();
    const validator = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            properties: {
                name: { bsonType: "string", minLength: 1 },
                username: { bsonType: "string" },
                email: { bsonType: "string" }
            },
            additionalProperties: true
        }
    };

    if (!exists) {
        await db.createCollection(name, { validator });
        console.log("Created 'users' with validation.");
    } else {
        await db.command({ collMod: name, validator, validationLevel: "moderate" });
        console.log("Updated 'users' validation (collMod).");
    }

    // indexes
    const users = db.collection(name);
    await users.createIndex({ username: 1 }, { unique: true, sparse: true });
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log("Ensured indexes on 'users' (username/email).");
}

async function run() {
    const db = await getDb();
    await ensureUsersValidationAndIndexes(db);
    console.log("DB init done.");
    process.exit(0);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});