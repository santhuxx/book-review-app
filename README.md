
# 📚 Web Application for Book Reviews

This web application allows users to explore, review, and manage book reviews. Users can navigate through pages such as welcome, sign in, sign up, home, my reviews and book reviews, offering a seamless experience for book enthusiasts.

---

## 🚀 Getting Started

## Clone the repository:
   ```bash
   git clone https://github.com/santhuxx/book-review-app.git
   cd book-review-app
   ```
### Backend Setup

1. Navigate to the `backend` folder in your project directory.
2. Run the following command to start the backend server:
   ```bash
   npx nodemon server.js
   ```

### Frontend Setup

1. Navigate to the `frontend` folder in your project directory.
2. Run the following command to start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/yourDatabase?retryWrites=true&w=majority
PORT=5000
```

### MongoDB Cluster Setup:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Sign in or create an account.
3. Create a new **cluster**.
4. Once the cluster is ready, click **Connect** and choose the option to connect your application.
5. Copy the provided connection string (URI) and replace `your_mongodb_cluster_uri` in the `.env` file with it.
   - Example:
     ```env
     MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/yourDatabase?retryWrites=true&w=majority
     ```
6. Replace `username`, `password`, and `yourDatabase` with your actual MongoDB credentials and database name.

---

## 📝 Features Overview

1. **Welcome Page**:
   - Upon visiting the web app, the user lands on the welcome page.
   - The user can choose to **Sign In** if they are already registered.
   - Alternatively, the user can select **Sign Up** if they are new to the website.

2. **Sign In/Sign Up**:
   - After selecting an option, the user is navigated to the respective page for account authentication or creation.
   - Once the process is complete, the user is redirected to the **Home Page**.

3. **Home Page**:
   - Users can see a list of all reviews in the application.

4. **Navigation Bar**:
   - **Add Review**: Allows users to add a new review for a book.
   - **My Reviews**: Displays all reviews submitted by the user.
   - **Home**: Redirects to the home page.
   - **Logout**: Logs the user out of the application.

5. **Book Details**:
   - Clicking on a review redirects the user to the specific book's details page.
   - The page displays:
     - Average rating of the book.
     - All reviews for the book.

6. **Adding Reviews**:
   - Users can click the **Add Review** button to submit a review for a book.

7. **My Reviews**:
   - This page lists all reviews created by the logged-in user.

---

## 🛠️ Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via MongoDB Atlas)

---

## 📄 License

This project is licensed under the MIT License.


---

## 📞 Contact

For queries or support, reach out to us at ksanthusha20@gmail.com
