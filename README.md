# 🔮 Gemini Backend Clone – Kuvaka Tech Assignment

This is a fully functional backend clone of Gemini Pro, built using **Node.js**, **Express.js**, **PostgreSQL**, **TypeORM**, **BullMQ**, **Redis**, and **Stripe**, deployed on **AWS EC2**.

---

## 🧱 Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL** + **TypeORM**
- **Redis** + **BullMQ** (Queue system)
- **JWT** for auth
- **Stripe** for subscriptions
- **PM2** for process management
- **Nginx** for reverse proxy
- **pgAdmin** for database GUI
- **Deployed on AWS EC2 (Ubuntu)**

---

## 📦 Features

### 🧑 User Authentication
- OTP-based login (mock OTP returned)
- JWT token authentication
- Change password

### 💬 Chatroom
- Create and view chatrooms
- Send messages (async Gemini response via queue)
- Redis-based caching for chatroom list

### 💳 Subscription
- Stripe Pro subscription (checkout)
- Webhook support
- Subscription tier-based rate limiting

---

## 🛠️ Local Setup

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis
- `npm` or `yarn`

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/gemini.git
cd gemini
npm install
npm run start //Start the Server
node src/queue/worker.js  //Running BullMQ Worker
