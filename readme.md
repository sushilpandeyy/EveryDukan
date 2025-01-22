# EveryDukan

EveryDukan is a platform that provides information and usability of famous brands, their recent offers, and coupon codes. The project is built with modern technologies to deliver a seamless user experience across mobile, web, and serverless platforms.

---

## Project Structure

The project is divided into four main components:

### 1. **App Folder**
   - **Description**: This folder contains the source code for the EveryDukan mobile application, built using Dart. The app is designed for both Android and iOS platforms.
   - **Features**:
     - User-friendly and intuitive interface.
     - Provides real-time updates about offers and coupons.
     - Multi-platform compatibility for seamless usage.
   - **Tech Stack**: Flutter, Dart.

### 2. **Function Folder**
   - **Description**: Houses the backend services built using Node.js. The backend is deployed on AWS Lambda, ensuring scalability and cost-efficiency.
   - **Features**:
     - API services to fetch data about brands, offers, and coupons.
     - Serverless architecture for handling high concurrency.
     - Integration with databases for secure and reliable data storage.
   - **Tech Stack**: Node.js, AWS Lambda, DynamoDB.

### 3. **D2C Dashboard Folder**
   - **Description**: Contains the admin dashboard application for managing the platform, built using Next.js.
   - **Features**:
     - Real-time data visualization for offers and user activity.
     - Tools for managing content related to brands and coupons.
     - Modern UI with server-side rendering for improved performance.
   - **Tech Stack**: Next.js, React, Tailwind CSS.

### 4. **EveryDukan Homepage Folder**
   - **Description**: Contains the code for the public-facing homepage of the EveryDukan platform, built using Next.js.
   - **Features**:
     - Provides an overview of the platform and its features.
     - Optimized for SEO and responsive across devices.
     - Fetches dynamic data for real-time updates about brands and offers.
   - **Tech Stack**: Next.js, React, Tailwind CSS.

---

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- Flutter SDK
- AWS CLI (for deployment)
- A code editor like VS Code

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sushilpandeyy/EveryDukan
   ```
2. Navigate to the folder you want to work on (e.g., `App`, `Function`).
3. Follow the specific setup instructions provided in the folder's README.

---

## Deployment

### App
- Build the Flutter application using:
  ```bash
  flutter build apk
  ```

### Backend (Function Folder)
- Deploy the backend services to AWS Lambda:
  ```bash
  serverless deploy
  ```

### Admin Dashboard
- Build and deploy the Next.js admin dashboard:
  ```bash
  npm run build
  npm start
  ```

### Homepage
- Deploy the homepage using your preferred hosting provider (e.g., Vercel):
  ```bash
  npm run build
  npm start
  ```

---

## Contributing

We welcome contributions to improve EveryDukan. Please follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes and push them to your fork.
4. Create a pull request for review.
 