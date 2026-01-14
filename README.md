# AntiCorruption BD 🇧🇩

**Speak Up for Bangladesh.**

A secure, anonymous, and community-driven platform empowering citizens to report corruption, bribery, and public service negligence. By leveraging crowd-sourced verification (voting) and real-time data, AntiCorruption BD aims to bring transparency and accountability to society.

![Flag of Bangladesh](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/1200px-Flag_of_Bangladesh.svg.png)

## 🚀 Features

*   **Anonymous Reporting**: Submit reports without revealing your identity. IP addresses are anonymized.
*   **Real-time Voting System**: Community members verify reports by voting "True" or "False", generating a dynamic Credibility Score.
*   **Dynamic Filtering**: Filter reports by Category (Traffic, Gov, etc.) and Location (Dhaka, Narayanganj).
*   **Evidence Upload**: Securely upload images as proof.
*   **Bangladesh Theme**: A UI designed with the colors and spirit of Bangladesh.
*   **Admin Moderation**: Secure admin tools to remove inappropriate content.
*   **Responsive Design**: Fully optimized for mobile and desktop devices.

## 🛠 Tech Stack

### Frontend
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/) (Mongoose ODM)
*   **Storage**: Local uploads (Prototype) / Cloudinary (Production ready)

---

## 📦 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Compass or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/AbuBakar223200/AntiCorruption.git
cd AntiCorruption
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_PASSWORD=admin
```

Start the server:
```bash
npm start
```

### 3. Setup Frontend
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the application:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌍 Deployment

### Backend (Render/Heroku)
1.  Push code to GitHub.
2.  Create a new Web Service on Render.
3.  Set Root Directory to `backend`.
4.  Add Environment Variables (`MONGO_URI`, etc.).

### Frontend (Vercel)
1.  Push code to GitHub.
2.  Import project to Vercel.
3.  Set Root Directory to `frontend`.
4.  Add Environment Variable `NEXT_PUBLIC_API_URL` (pointing to your live backend).

> **Note**: This prototype uses local storage for images. For production deployment on serverless platforms, integrate a cloud storage service like Cloudinary.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
