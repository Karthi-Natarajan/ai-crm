# AI-First CRM 🚀

AI-First CRM is a modern, full-stack Customer Relationship Management (CRM) application built with **React, Firebase, and Tailwind CSS**.  
It focuses on clean UI, real-time data handling, authentication, and user-specific settings.

---

## ✨ Features

### 🔐 Authentication
- Email & password authentication using **Firebase Auth**
- Secure login & signup
- Protected routes
- Logout functionality

### 📊 Dashboard
- Executive dashboard with KPIs
- Lead status visualization (Hot / Warm / Cold)
- Weekly lead growth charts
- Live activity feed
- Clean, responsive UI

### ⚙️ Settings Page
- Update user profile (First Name, Last Name)
- Email displayed from Firebase Auth
- Notification preferences
- AI configuration options
- Real-time save to **Firebase Firestore**
- Instant success/error feedback using toast alerts

### 👤 User Profile Sync
- User initials shown in Top Navigation
- Profile name updates reflected across UI
- Firebase-backed user data

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Lucide Icons

**Backend / Services**
- Firebase Authentication
- Firebase Firestore (Production mode)
- Firebase Hosting (ready)

**Utilities**
- date-fns
- sonner (toast notifications)

---

## 📂 Project Structure

```text
src/
│── components/
│   ├── ui/              # Reusable UI components
│   ├── TopNav.tsx
│
│── pages/
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── SettingsPage.tsx
│
│── hooks/
│   ├── useAuth.tsx
│
│── lib/
│   ├── firebase.ts
│
│── services/
│   ├── api.ts
│
│── App.tsx
│── main.tsx


🔑 Environment Variables

Create a .env file in the root:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
▶️ Run Locally
npm install
npm run dev

App will run on:

http://localhost:8080
🔒 Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
🚀 Deployment

Frontend is ready for deployment using:

Firebase Hosting

Vercel

Netlify

Backend uses Firebase-managed services, no separate server required.

📌 Future Enhancements

Role-based access (Admin / User)

Email notifications

AI-powered lead scoring

Export reports

Team management

👨‍💻 Author

Karthi Natarajan
AI & Data Science Student
Focused on building real-world, production-ready applications.