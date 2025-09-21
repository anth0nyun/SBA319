# Task Manager API

## Step 1: Project Setup
- Made a new folder `task-manager`
- Ran `npm init -y`
- Installed Express and nodemon
- Added `"type": "module"` to `package.json`
- Script: `"dev": "nodemon server.mjs"`

---

## Step 2: Basic Server
File: `server.mjs`
- Started Express app
- Used `express.json()` for JSON body parsing
- Root route `/` sends:  
  `{ "message": "Task Manager API is running 🚀" }`

---

## Step 3: Data Store
File: `data/store.mjs`
- Made in-memory arrays:
  - `users`
  - `projects`
  - `tasks`
- Added `nextIds` object to track new IDs
- Data resets each time the server restarts

---

## Step 4: Middleware
Folder: `middleware/`

- **requestLogger.mjs** → logs `Request: METHOD URL`
- **requireJson.mjs** → checks POST/PUT/PATCH requests for JSON header
- **errorHandler.mjs** → shows `{ "error": err.message }` if something breaks

We added them into `server.mjs` with `app.use(...)`.

---

## Step 5: Routes
Folder: `routes/`

### Users (short)
File: `routes/users.mjs`
- GET `/users` → all users
- POST `/users` → add new user (`{ "name": "Anthony" }`)

### Projects (short)
File: `routes/projects.mjs`
- GET `/projects` → all projects

### Tasks (full CRUD)
File: `routes/tasks.mjs`
- GET `/tasks` → all tasks
- GET `/tasks/:id` → one task
- POST `/tasks` → add task
- PUT `/tasks/:id` → replace whole task
- PATCH `/tasks/:id` → update part of task
- DELETE `/tasks/:id` → remove task

---

## Step 6: API Route Table

Base URL: `http://localhost:3000`

| Verb  | Path        | What it does        |
|-------|-------------|---------------------|
| GET   | /users      | Get all users       |
| POST  | /users      | Add a user          |
| GET   | /projects   | Get all projects    |
| GET   | /tasks      | Get all tasks       |
| GET   | /tasks/:id  | Get one task        |
| POST  | /tasks      | Add a task          |
| PUT   | /tasks/:id  | Replace a task      |
| PATCH | /tasks/:id  | Update part of task |
| DELETE| /tasks/:id  | Delete a task       |


## MongoDB Details
- Collections: users, projects, tasks
- Validation (collection-level JSON Schema):
  - users: name required; username/email strings
  - projects: name required (unique index)
  - tasks: title (string), completed (bool), priority (enum: low|med|high), projectId/assignedTo (ObjectId or null), dueDate (date|null)
- Indexes:
  - users: username (unique), email (unique)
  - projects: name (unique)
  - tasks: projectId, assignedTo, (completed, priority) compound
- Efficient queries (hit indexes):
  - `/tasks?projectId=<id>`
  - `/tasks?assignedTo=<id>`
  - `/tasks?completed=true&priority=high`