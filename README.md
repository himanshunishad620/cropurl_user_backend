# 📊 CropURL Click & Scan Management Backend

The **CropURL Click & Scan Management Backend** is a dedicated backend service for managing and recording **short URL clicks and QR code scans** for the CropURL platform.

It handles click and scan events and maintains the data required to monitor link and QR code engagement.

## 🚀 Features

- 🔗 Record short URL clicks
- 📱 Record QR code scans
- 📊 Manage click and scan statistics
- 📅 Track daily clicks and scans
- 👥 Track unique visitors
- 🌍 Track visitor location data
- 🌐 Track browser information
- ⚡ Dedicated service for click and scan management

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **UAParser**
- **REST APIs**
- **Cookies**

## 📈 Tracking Data

The service manages engagement data including:

- Total clicks
- Total QR scans
- Unique visitors
- Daily clicks
- Daily scans
- Visitor cities
- Browsers

## 💻 Installation

Clone the repository:

```bash
git clone https://github.com/himanshunishad620/cropurl_user_backend.git
cd cropurl_user_backend
```

Install dependencies:

```bash
npm install
```

Create your `.env` file and add the required configuration.

```env
MONGODB_URI=<your_mongodb_connection_string>
NODE_ENV=development
CLIENT_URL=<your_frontend_url>

```

Start the development server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:1000
```

## 🎯 Purpose

This service is designed specifically to **manage click and QR scan tracking** separately from CropURL's core application backend.

By keeping tracking functionality isolated, the main backend can focus on URL, QR code, and user-related operations while this service handles engagement data.

## 🔗 Related Project

**CropURL** — URL shortener and QR code analytics platform.

Live application: **https://cropurl.in**

## 👨‍💻 Author

**Himanshu Nishad**
