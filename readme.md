# EveryDukan

EveryDukan is a comprehensive platform designed to facilitate efficient management and smooth operations for businesses of all sizes. It is built with modern technologies to provide a seamless experience for users, administrators, and backend operations.

---

## Project Structure

The project is organized into four main folders:

1. **App**:
   - Contains the Dart application source code.
   - The mobile application is designed to provide users with an intuitive interface to interact with the EveryDukan platform.

2. **Function**:
   - Houses the backend services built using Node.js.
   - Backend is deployed on AWS Lambda for scalability and cost efficiency.
   - Responsible for handling API requests, authentication, database operations, and other server-side logic.

3. **d2cdashboard**:
   - Contains the admin management application built with Next.js.
   - Provides tools for administrators to manage users, products, orders, and platform settings.

4. **everydukan**:
   - Serves as the homepage of the platform.
   - Built with Next.js to ensure fast loading and SEO optimization.
   - Acts as the gateway for visitors and potential users to learn more about EveryDukan.

---

## Features

### App (Dart Application)
- User-friendly interface.
- Real-time updates and notifications.
- Secure authentication and user management.
- Extensive product browsing and ordering functionalities.

### Function (Backend Services)
- RESTful API endpoints.
- Secure and scalable architecture using AWS Lambda.
- Integration with databases for data persistence.
- Logging and monitoring for performance and debugging.

### d2cdashboard (Admin Application)
- Comprehensive management of users, orders, and products.
- Dashboard analytics for insights and decision-making.
- Role-based access control for administrators.

### everydukan (Homepage)
- Information about the platform and its features.
- Contact forms and links to download the mobile application.
- SEO-optimized pages to attract and retain visitors.

---

## Technologies Used

- **Dart**: For building the mobile application.
- **Node.js**: For backend services.
- **AWS Lambda**: For deploying scalable backend functions.
- **Next.js**: For building the admin dashboard and homepage.

---

## Getting Started

### Prerequisites
- Install Node.js and npm.
- Install Flutter for Dart development.
- Set up AWS CLI and access credentials.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/everydukan.git
   ```
2. Navigate to the respective folders for setup:
   - **App**: Install Dart dependencies.
     ```bash
     cd App
     flutter pub get
     ```
   - **Function**: Install Node.js dependencies.
     ```bash
     cd Function
     npm install
     ```
   - **d2cdashboard** and **everydukan**: Install Next.js dependencies.
     ```bash
     cd d2cdashboard
     npm install

     cd ../everydukan
     npm install
     ```

### Running the Applications
- **App**: Use Flutter tools to run the mobile application.
  ```bash
  flutter run
  ```
- **Function**: Deploy the backend services to AWS Lambda.
  ```bash
  npm run deploy
  ```
- **d2cdashboard**: Start the admin dashboard in development mode.
  ```bash
  npm run dev
  ```
- **everydukan**: Start the homepage in development mode.
  ```bash
  npm run dev
  ```
 