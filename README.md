
# Blog API Project

## Tech Stack

* Node.js
* Express
* MongoDB with Mongoose
* JWT for Authentication

## Project Features

* User Authentication & Authorization
* User Profile Management
* User Blocking / Unblocking
* Follow / Unfollow Users
* Track Profile Views and Posts Count
* Admin Capabilities to Block or Unblock Users
* **Category management** (create, list categories)
* *(Post and Comment features are still pending)*

> **Note:** I completed the Category feature so users can organize posts by category. Post and Comment features will be added later.

## Running Locally

1. Clone the repo
   `git clone https://github.com/YourUsername/your-blog-api.git`

2. Install dependencies
   `npm install`

3. Setup environment variables in `.env` file:

   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start server
   `npm run server`

## Authentication

Protected routes require JWT in header:
`Authorization: Bearer YOUR_TOKEN`

## API Endpoints (Partial)

### Users

* `POST /api/v1/users/register` - Register user
* `POST /api/v1/users/login` - Login
* `GET /api/v1/users/profile` - Get my profile
* `PUT /api/v1/users/block/:id` - Block user
* `PUT /api/v1/users/unblock/:id` - Unblock user

Categories API Endpoints
POST /api/v1/category — Create a new category
Requires authentication

GET /api/v1/categories — Get all categories

GET /api/v1/categories/:id — Get details of a specific category by ID

PUT /api/v1/categories/:id — Update a category by ID
Requires authentication

DELETE /api/v1/categories/:id — Delete a category by ID
Requires authentication


### Posts & Comments

*(Coming soon)*


