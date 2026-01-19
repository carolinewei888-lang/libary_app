
# Libri - AI Library Manager

Libri is a modern, AI-powered library management system designed for high-growth individuals. It helps curate personal wisdom, manage financial strategies, and provides intelligent book recommendations using Google's Gemini models.

## 🚀 Live Demo

**Access the deployed application here:**
👉 [**https://libary-app-valsoft-6h18svkew-carolinewei888-langs-projects.vercel.app**](https://libary-app-valsoft-6h18svkew-carolinewei888-langs-projects.vercel.app)

---

## ✨ Features

- **Smart Catalog:** Manage books with status tracking (Available/Borrowed).
- **AI-Powered Entry:** Auto-fill book details (Description, Category, ISBN) using Gemini AI just by typing a title.
- **AI Librarian:** Get personalized book recommendations based on your current mood or goals.
- **Deep Dive:** View AI-generated core concepts, estimated reading time, and "Why you should read this" analysis.
- **User Roles:**
  - **Admin:** Add/Delete books, manage inventory.
  - **Borrower:** Browse, Wishlist, and Checkout books.
- **Responsive Design:** Beautiful UI built with Tailwind CSS.

---

## 🛠️ Local Development Setup

If you want to run this project locally, follow these steps.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### 2. Installation
Clone the repository (or download the source code) and install dependencies:

```bash
npm install
```

### 3. Environment Configuration (API Key)

This application uses the **Google Gemini API** for its smart features (auto-fill, recommendations, deep dives).

**Important for Vite/Vercel Users:**
The API key must be prefixed with `VITE_` to be accessible in the browser.

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Create a file named `.env` in the root directory of the project.
3. Add your key exactly as shown below:

```env
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

**For Vercel Deployment:**
Go to Settings -> Environment Variables and add:
- Key: `VITE_GOOGLE_API_KEY`
- Value: `your_actual_api_key_string`

### 4. Running the App

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🔑 Default Accounts

The app uses a mock database (LocalStorage). You can log in using these simulated roles:

1. **Administrator**
   - Has full access to add/edit/delete books.
2. **Borrower (User)**
   - Can browse, add to wishlist, and borrow books.

---

## 📦 Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **Data:** LocalStorage Mock DB (Persists data in your browser for demo purposes)
