import { getDb } from "./conn.mjs";

async function ensureUsersValidationAndIndexes(db) {
    const name = "users";
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

    const exists = await db.listCollections({ name }).hasNext();
    if (!exists) {
        await db.createCollection(name, { validator });
        console.log("Created 'users' with validation.");
    } else {
        await db.command({ collMod: name, validator, validationLevel: "moderate" });
        console.log("Updated 'users' validation (collMod).");
    }

    const users = db.collection(name);
    await users.createIndex({ username: 1 }, { unique: true, sparse: true });
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log("Ensured indexes on 'users' (username/email).");
}

// validation + unique index on name
async function ensureProjectsValidationAndIndexes(db) {
    const name = "projects";
    const validator = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            properties: {
                name: { bsonType: "string", minLength: 1 }
            }
        }
    };

    const exists = await db.listCollections({ name }).hasNext();
    if (!exists) {
        await db.createCollection(name, { validator });
        console.log("Created 'projects' with validation.");
    } else {
        await db.command({ collMod: name, validator, validationLevel: "moderate" });
        console.log("Updated 'projects' validation (collMod).");
    }

    await db.collection(name).createIndex({ name: 1 }, { unique: true });
    console.log("Ensured index on 'projects'.name (unique).");
}

// validation + query indexes 
async function ensureTasksValidationAndIndexes(db) {
    const name = "tasks";
    const validator = {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "completed", "priority"],
            properties: {
                title: { bsonType: "string", minLength: 1 },
                completed: { bsonType: "bool" },
                priority: { enum: ["low", "med", "high"] },
                projectId: { bsonType: ["objectId", "null"] },
                assignedTo: { bsonType: ["objectId", "null"] },
                dueDate: { bsonType: ["date", "null"] }
            }
        }
    };

    const exists = await db.listCollections({ name }).hasNext();
    if (!exists) {
        await db.createCollection(name, { validator });
        console.log("Created 'tasks' with validation.");
    } else {
        await db.command({ collMod: name, validator, validationLevel: "moderate" });
        console.log("Updated 'tasks' validation (collMod).");
    }

    const col = db.collection(name);
    await col.createIndex({ projectId: 1 });
    await col.createIndex({ assignedTo: 1 });
    await col.createIndex({ completed: 1, priority: 1 });
    console.log("Ensured indexes on 'tasks': projectId, assignedTo, (completed,priority).");
}

async function run() {
    const db = await getDb();
    await ensureUsersValidationAndIndexes(db);
    await ensureProjectsValidationAndIndexes(db);
    await ensureTasksValidationAndIndexes(db);
    console.log("DB init done.");
    process.exit(0);
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});