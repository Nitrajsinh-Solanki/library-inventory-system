
---

# 📚 **Library & Book Store Inventory System**  

## 🚀 **Introduction**  

The **Library & Book Store Inventory System** is a **Next.js** web application designed for **efficient management of books, users, and transactions** in a library or bookstore. It supports **Admin, Librarian, and User roles**, ensuring streamlined **book tracking, borrowing, returning, and fare management**.  

🔹 **Tech Stack:**  
💻 **Frontend:** Next.js (React, TypeScript, TailwindCSS)  
🛠 **Backend:** Next.js API routes, MongoDB (Mongoose), Supabase  
🔐 **Authentication:** NextAuth, JWT, Cookies  
📦 **Storage:** Supabase Storage  
🤖 **AI-powered Book Description Generator:** Google Gemini AI  

---

## 🌟 **Key Features**  

### 🛠 **Admin Panel**  
✅ Manage **users, librarians, and books**  
✅ Promote/demote **users** to Librarians  
✅ Monitor **borrowing transactions & overdue books**  

### 📚 **Book Management**  
✅ **Add, edit, delete books**  
✅ Upload **book cover images** to Supabase Storage  
✅ Generate **AI-powered book descriptions** with Google Gemini AI  

### 🔑 **User Authentication**  
✅ Secure **Login / Registration** with **email verification**  
✅ Role-based **access control** (Admin, Librarian, User)  
✅ Implemented with **NextAuth & JWT**  

### 📖 **Borrow & Return Books**  
✅ Users can **borrow books** with due dates  
✅ Admins/Librarians can **mark books as returned**  
✅ Automatic **fine calculation** for overdue books  

### 💰 **Fare Settings**  
✅ Configure **borrowing fees, late return penalties, and borrowing limits**  

### 📊 **Dashboard & Analytics**  
✅ Track **total users, books, and active borrows**  
✅ View **overdue books and outstanding fines**  

---

## 🎥 **Demo Videos**  

📌 Watch how each role works:  

🔹 **Admin Panel:** [🎬 Watch Demo](https://youtu.be/_1GYteabksM?feature=shared)  
🔹 **User Panel:** [🎬 Watch Demo](https://youtu.be/G3F-GpxAswI?feature=shared)  
🔹 **Librarian Panel:** [🎬 Watch Demo](https://youtu.be/gHpUR4IV91c?feature=shared)  

---

## 🏗 **Project Structure**  

```
📁 nitrajsinh-solanki-library-inventory-system/
│── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 api/                  # Next.js API routes
│   │   ├── 📂 dashboard/            # Admin dashboard
│   │   ├── 📂 library/              # User library interface
│   │   ├── 📂 login/                # User authentication
│   │   ├── 📂 manage-books/         # Book management UI
│   │   ├── 📂 profile/              # User profile section
│   │   └── 📂 unauthorized/         # Unauthorized access page
│   ├── 📂 components/               # Reusable UI components
│   ├── 📂 lib/
│   │   ├── 📂 models/               # MongoDB Models (Book, User, Borrow)
│   │   ├── 📂 mongodb/              # MongoDB Connection
│   │   ├── 📂 supabase/             # Supabase Storage Configuration
│   │   └── 📂 utils/                # Helper functions (auth, fare calculation)
│── 📂 public/                       # Static assets
│── 📄 .env.local                    # Environment variables
│── 📄 package.json                   # Dependencies & scripts
│── 📄 next.config.ts                  # Next.js configuration
│── 📄 README.md                      # Project documentation
```

---

## 🛠 **Setup & Installation**  

### 1️⃣ Clone the Repository  

```bash
git clone https://github.com/Nitrajsinh-Solanki/library-inventory-system.git
cd library-inventory-system
```

### 2️⃣ Install Dependencies  

```bash
npm install
```

### 3️⃣ Configure Environment Variables  

Create a **.env.local** file in the project root and add the following:  

```ini
MONGODB_URI="your-mongodb-connection-string"
EMAIL="your-email@gmail.com"
EMAIL_PASS="your-email-password"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_STORAGE_BUCKET="for-hackathon"
GEMINI_API_KEY="your-google-gemini-api-key"
```

📌 **Resources for setting up .env variables:**  
- 📧 **NodeMailer (Email SMTP):** [🔗 Guide](https://medium.com/@kathishcivil94/sending-emails-in-node-js-with-nodemailer-36c6e32dc37e)  
- 🗄 **Supabase Configuration:** [🔗 Guide](https://medium.com/@poojanbhalodiya2003/getting-started-with-supabase-a-step-by-step-guide-5c024d860271)  
- 🍃 **MongoDB Atlas Setup:** [🔗 Guide](https://medium.com/@xuwei19850423/free-mongodb-cluster-on-mongodb-atlas-1443a87da347)  

---

### 📧 **Email Configuration for NodeMailer**  

The **`EMAIL`** and **`EMAIL_PASS`** fields in **.env.local** are used for **NodeMailer**, which handles email verification and notifications.  

```ini
EMAIL="your-email@gmail.com"
EMAIL_PASS="your-email-password"
```

To configure **NodeMailer**, use an **SMTP service** like **Gmail, Outlook, or SendGrid**.  

📌 **Reference Guide:** [🔗 Sending Emails in Node.js with NodeMailer](https://medium.com/@kathishcivil94/sending-emails-in-node-js-with-nodemailer-36c6e32dc37e)  

---

### 4️⃣ Run the Development Server  

```bash
npm run dev
```

🌐 Open your browser and visit: **[http://localhost:3000](http://localhost:3000)**  

---

## 🔑 **Setting Up Admin & Librarian for Testing**  

By default, all newly registered users have the **"user"** role. To test **Admin** or **Librarian** functionality, you must manually update the user role in **MongoDB Atlas**.  

### 🔹 **Steps to Promote a User to Admin or Librarian:**  

1️⃣ **Go to MongoDB Atlas** and navigate to your database.  
2️⃣ Open the **`users`** collection.  
3️⃣ Find the user document you want to promote.  
4️⃣ Edit the `role` field:  
   - Change `"user"` → `"admin"` (for admin access)  
   - Change `"user"` → `"librarian"` (for librarian access)  
5️⃣ Click **Save** and restart the application.  

📌 **User Schema (`User.ts`) Role Field:**  

```typescript
role: {
  type: String,
  enum: ['user', 'librarian', 'admin'],
  default: 'user', // Default role is "user"
}
```

---

## 🚀 **Future Enhancements**  

🔹 **Planned Features:**  
- 📌 **QR Code Scanning** for book borrowing  
- 💳 **Stripe Payment Integration** for fines and purchases  
- 📑 **PDF Reports** for borrowing history  
- 📚 **AI-powered Book Recommendations**  

---

## 🤝 **Contributing**  

Contributions are **welcome**! If you'd like to add features or fix bugs, please:  
1️⃣ **Fork** the repository  
2️⃣ **Create a new branch** (`feature/new-feature`)  
3️⃣ **Commit your changes**  
4️⃣ **Submit a pull request**  

---

## 📜 **License**  

This project is **MIT Licensed**.  

---

**Made with ❤️ by [Nitrajsinh Solanki](https://github.com/Nitrajsinh-Solanki)** 🚀📚  

---

