# How to Connect Database (MongoDB)

You have two options to fix the database connection:

## Option 1: Install MongoDB Locally (Recommended for Windows)
1.  **Download**: Go to [MongoDB Community Server Download](https://www.mongodb.com/try/download/community).
2.  **Install**: Run the sticky `.msi` installer.
    *   **Important**: Check the box **"Install MongoDB as a Service"**.
3.  **Verify**:
    *   Open Task Manager -> Services.
    *   Find `MongoDB`. Right-click and **Start** if it's stopped.
4.  **Restart Backend**:
    *   Go to your VS Code terminal (backend).
    *   Press `Ctrl + C` to stop.
    *   Run `npm run dev` again.

## Option 2: Use MongoDB Cloud (Atlas)
If you don't want to install software:
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (Free).
2.  Create a **Shared Cluster** (Free Tier).
3.  Go to **Database Access** -> create a user/password (e.g., `admin`/`password123`).
4.  Go to **Network Access** -> Add IP Address -> **Allow Access from Anywhere**.
5.  Click **Connect** -> **Drivers** -> Copy the string.
6.  Update your `backend/.env` file:
    ```env
    MONGO_URI=mongodb+srv://admin:password123@cluster0.1234.mongodb.net/anticorruption?retryWrites=true&w=majority
    ```
