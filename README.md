
# 📚 AI-Powered Study Assistant

An intelligent study platform that helps students organize their learning materials, generate practice questions, create summaries of notes, and schedule study sessions optimized for maximum retention — powered by AI.

---

## 🚀 Tech Stack

- **Frontend**: React.js + Vite, Tailwind CSS
- **Backend**: Spring Boot (v 3.4.5), Java (JDK 21), Spring Security, JWT Authentication
- **Database**: Maria DB (v 11.7.2)
- **AI Integration**: Gemini 2.0 Flash (for Summarization, Question Generation, Concept Explanation)
- **Other Tools**: FireBase Storage (Storing materials), Post Man.

---

## ✨ Key Features

- **User Authentication**
  - Signup/Login with JWT tokens
  - Secure protected routes
- **Study Material Management**
  - Upload and organize notes
  - Tag materials by subject and  topics.
- **AI Study Tools**
  - Generate practice questions from uploaded notes
  - Summarize long lecture notes
  - Explain complex concepts in simpler terms
  - Generate Flash Cards
- **Study Scheduler**
  - study session planning and Tracking.
- **Progress Tracking**
  - View completed sessions and knowledge gaps
- **Responsive UI**
  - Clean, distraction-free interface
  - Mobile-friendly

---

## 🛠️ Project Setup

### Backend (Spring Boot)

```bash
# Clone the repository
git clone https://github.com/yourusername/study-assistant.git
cd study-assistant/backend

# Build and run the Spring Boot application
./mvnw spring-boot:run
```

> Make sure you have DB running locally or update `application.properties` or `.env` to point to your cloud DB.

### Frontend (React)

```bash
# Navigate to frontend folder
cd study-assistant/frontend

# Install dependencies
npm install

# Run the application
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend project to store sensitive keys:

```bash
DB_URL="jdbc:mariadb://<DB_HOST>:<DB_PORT>/<DB_NAME>"
DB_USERNAME="<DB_USERNAME>"
DB_PASSWORD="<DB_PASSWORD>"
JWT_SECRET="<JWT_SECRET>"
CORS_ORIGIN="<CORS_ORIGIN>"
#note : if you are using other DB change it accordingly.
```

Create a `.env` file in the frontend project:

```bash
VITE_REACT_APP_FIREBASE_API_KEY="<FIREBASE_API_KEY>"
VITE_REACT_APP_FIREBASE_AUTH_DOMAIN="<FIREBASE_AUTH_DOMAIN>"
VITE_REACT_APP_FIREBASE_PROJECT_ID="<FIREBASE_PROJECT_ID>"
VITE_REACT_APP_FIREBASE_STORAGE_BUCKET="<FIREBASE_STORAGE_BUCKET>"
VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID="<FIREBASE_MESSAGING_SENDER_ID>"
VITE_REACT_APP_FIREBASE_APP_ID="<FIREBASE_APP_ID>"

VITE_GEMINI_API_KEY="<GEMINI_API_KEY>"

VITE_BACKEND_BASE_URL="<BACKEND_BASE_URL>"

```

---

## 🤖 AI Tools Used

- **GEMINI 2.0 Flash**
  - Summarization of notes
  - Question generation from materials
  - Concept simplification
  - Flash Card Generation


---

## 📸 Demo Screenshots
#### Login
![login](/screenshots/login.png)
---
#### Home
![home](/screenshots/home.png)
---
#### Flashcards
![home](/screenshots/flash-cards.png)
---

<!-- ## 🎥 Demo Video

[Watch the demo here →](https://your-demo-video-link.com)

--- -->


## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

# 🚀 Happy Studying!