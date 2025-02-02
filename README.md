# 🌍 Venturo API

Welcome to the **Venturo API** – the backend service powering **Venturo**, a platform for creating, sharing, and discovering travel itineraries. 🚀

## 🛠️ Tech Stack

- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **MongoDB** (Local or Cloud)

### Installation

```bash
# Clone the repository
git clone https://github.com/joaoantoniocoelho/venturo-api.git
cd venturo-api

# Install dependencies
npm install

```

### Environment Variables

Create a `.env` file in the root directory and configure the required variables:

```
PORT=8080   
MONGO_URI=<MONGO_CONNECTION_STRING>
JWT_SECRET=<SUPER_SECRET_KEY>
JWT_RESET_SECRET=<ANOTHER_SUPER_SECRET_KEY>

EMAIL_USER=<YOUR_EMAIL>
EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>

FRONTEND_URL=http://localhost:3000

```

### Running the Server

```bash
npm start

```

## 📬 Contributing

We welcome contributions! Feel free to open issues, suggest features, or submit pull requests. 🤝

## 📜 License

This project is licensed under the **MIT License**.

---

🌍 **Venturo – Explore. Share. Inspire.**
