# airBnB

This project is a simple Airbnb-like web application built with Node.js, Express, MongoDB, and Mongoose. It demonstrates user authentication, session management, file uploads, and CRUD operations for homes and user favourites. The UI is styled using Tailwind CSS and EJS templates.

## Features

- **User Authentication**: Signup and login with hashed passwords using bcrypt.
- **User Types**: Supports both "guest" and "host" user roles.
- **Session Management**: User sessions are stored in MongoDB using `connect-mongodb-session`.
- **Home Listings**: Hosts can add, edit, and delete homes with photo uploads.
- **Favourites**: Guests can add homes to their favourites and remove them.
- **Bookings Page**: Placeholder for future booking functionality.
- **File Uploads**: Home photos are uploaded and stored in the `/uploads` directory.
- **Validation**: Uses `express-validator` for form validation.
- **Responsive UI**: Styled with Tailwind CSS and EJS templates.

## Folder Structure

```
.
├── app.js
├── package.json
├── nodemon.json
├── tailwind.config.js
├── .env.example
├── controllers/
│   ├── authController.js
│   ├── errors.js
│   ├── hostController.js
│   └── storeController.js
├── models/
│   ├── home.js
│   └── user.js
├── public/
│   ├── home.css
│   ├── output.css
│   └── images/
├── routes/
│   ├── authRouter.js
│   ├── hostRouter.js
│   └── storeRouter.js
├── storage/
├── uploads/
│   └── [uploaded images]
├── utils/
│   └── pathUtil.js
└── views/
    ├── auth/
    ├── host/
    ├── partials/
    └── store/
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas account (or local MongoDB instance)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Kailramiya/airbnb
   cd Chapter\ 17\ -\ Introduction\ to\ Mongoose
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and add your MongoDB connection string if needed.

4. **Run Tailwind CSS (in a separate terminal):**
   ```sh
   npm run tailwind
   ```

5. **Start the server:**
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

## Usage

- **Signup/Login:** Register as a guest or host.
- **Guests:** Browse homes, add to favourites, view favourites.
- **Hosts:** Add new homes, edit or delete your homes.
- **Photo Upload:** When adding/editing a home, upload a photo (JPEG/PNG).
- **Bookings:** Bookings page is a placeholder for future features.

## Technologies Used

- Node.js, Express.js
- MongoDB, Mongoose
- EJS (Embedded JavaScript Templates)
- Tailwind CSS
- Multer (for file uploads)
- bcrypt (for password hashing)
- express-session, connect-mongodb-session
- express-validator

## Notes

- Uploaded images are stored in the `/uploads` directory.
- Sessions are stored in MongoDB for persistence.
- The app uses EJS for server-side rendering.
- Bookings functionality is not implemented; the page is a placeholder.

## License

This project is for educational purposes.

---

**Author:** Aman Kumar
