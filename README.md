After School Activities – Back-End (Express.js + MongoDB)

<<<<<<< HEAD
This repository contains the Back-End REST API for the “After School Activities” coursework project. It provides lesson data and handles orders for the Vue.js front-end.
=======
This repository contains the Back-End REST API for the “After School Activities” coursework project.
It provides lesson data and handles orders for the Vue.js front-end.
>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b

Live API (Render Deployment)

Base URL:

<<<<<<< HEAD
https://backend-1-sits.onrender.com

Method	Route	Description
GET	/lessons	Returns all lessons
GET	/lessons/:id	Returns one lesson
POST	/orders	Creates a new order
PUT	/lessons/:id	Updates lesson spaces
backend/ │ ├── server.js ├── seed.js ├── package.json ├── .env └── node_modules/
=======
https://backend-1-sits.onrender.com 

| Method | Route          | Description           |
| ------ | -------------- | --------------------- |
| GET    | `/lessons`     | Returns all lessons   |
| GET    | `/lessons/:id` | Returns one lesson    |
| POST   | `/orders`      | Creates a new order   |
| PUT    | `/lessons/:id` | Updates lesson spaces | 


backend/
│
├── server.js
├── seed.js
├── package.json
├── .env
└── node_modules/ 
>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b

Environment Variables

Create a .env file with:

MONGO_URL=your_mongodb_connection_string

<<<<<<< HEAD
=======

>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b
Technologies Used

Node.js

Express.js

MongoDB Atlas (Native Driver)

CORS

Custom Logger Middleware

Render.com Deployment

<<<<<<< HEAD
Postman API Testing

API Documentation ✔ GET /lessons
=======
Postman API Testing 

API Documentation
✔ GET /lessons
>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b

Returns all lessons from the database.

✔ GET /lessons/:id

Returns a specific lesson using its ObjectId.

✔ POST /orders

Creates a new order.

Example:

<<<<<<< HEAD
{ "name": "Student Name", "phone": "07123456789", "lessonId": "673e12a1c9f1bb18", "spaces": 1 }
=======
{
  "name": "Student Name",
  "phone": "07123456789",
  "lessonId": "673e12a1c9f1bb18",
  "spaces": 1
}
>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b

✔ PUT /lessons/:id

Updates the number of available spaces for a lesson.

Example:

<<<<<<< HEAD
{ "spaces": 4 }

Middleware Used JSON Parser app.use(express.json());

CORS import cors from "cors"; app.use(cors());

Custom Logger app.use((req, res, next) => { console.log(${new Date().toISOString()} - ${req.method} ${req.url}); next(); });

MongoDB Setup Collections:
=======
{
  "spaces": 4
}

Middleware Used
JSON Parser
app.use(express.json());

CORS
import cors from "cors";
app.use(cors());

Custom Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

MongoDB Setup
Collections:
>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b

lessons

orders

<<<<<<< HEAD
Connection: const client = new MongoClient(process.env.MONGO_URL); await client.connect();
=======
Connection:
const client = new MongoClient(process.env.MONGO_URL);
await client.connect();
>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b

🌱 Seeding the Database

Run:

node seed.js

<<<<<<< HEAD
=======

>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b
This inserts the initial lesson data into MongoDB.

🧪 Postman Testing

Tested Endpoints:

GET /lessons

GET /lessons/:id

POST /orders

PUT /lessons/:id

Each test includes:

Request URL

JSON Body

JSON Response

Status Code

<<<<<<< HEAD
Verified MongoDB update

Deployment on Render Build Command npm install

Start Command node server.js

Environment Variable MONGO_URL

Render provides the live server URL used by the front-end.

Author

Student: Rawaz Al-Barznji student ID: M01052576 Course: CST3144 Full Stack Web Development (2025-2026)

Verified MongoDB update 

Deployment on Render
Build Command
npm install

Start Command
node server.js

Environment Variable
MONGO_URL


Render provides the live server URL used by the front-end. 


Author: Rawaz Al-Barznji (Student)
student ID: M01052576 
Course: CST3144 Full Stack Web Development (2025-2026)
 








>>>>>>> 6c0d1857df58a3c9d667a5da399351266d32bb3b
