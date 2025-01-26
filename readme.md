# EveryDukan

<p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/ihh-player.appspot.com/o/unnamed.webp?alt=media&token=0cbc1595-cb67-4f71-a371-7fb9e2e61cb4" alt="EveryDukan Logo" width="200"/>
</p>

<div align="center">
  <a href="https://drive.google.com/file/d/1e9s2w5zVS9Xy9sWk5kPYthn86qFqpdF3/view?usp=sharing">
    <img src="https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android" alt="Download APK"/>
  </a>
</div>

Platform providing information about brands, offers, and coupon codes with seamless experience across mobile, web, and serverless platforms.

## Tech Stack

- Dart 
- Node.js Microservices
- AWS Lambda
- Next.js
- TypeScript

## Project Structure

### 1. **App Folder**
- Mobile application built with Flutter/Dart
- User-friendly interface for both Android and iOS
- Real-time updates for offers and coupons

### 2. **Function Folder**
- Backend services using Node.js on AWS Lambda
- API services for brands, offers, and coupons
- MongoDB integration for data storage

### 3. **D2C Dashboard Folder**
- Admin dashboard built with Next.js
- Real-time data visualization
- Content management tools

### 4. **EveryDukan Homepage Folder**
- Public-facing website using Next.js
- SEO optimized and responsive
- Dynamic data fetching

## Getting Started

### Prerequisites
- Node.js (v14+)
- Flutter SDK
- AWS CLI
- VS Code (recommended)

### Installation
```bash
# Clone repository
git clone https://github.com/sushilpandeyy/EveryDukan

# Navigate to desired folder
cd [App/Function/D2C/Homepage]

# Follow folder-specific README
```

## Deployment

```bash
# App
flutter build apk

# Backend
serverless deploy

# Dashboard & Homepage
npm run build
npm start
```

## License

Copyright © 2025 EveryDukan. All rights reserved.