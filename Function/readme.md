# Function Folder

This folder contains the backend services for the EveryDukan platform. The services are built with Node.js and deployed on AWS Lambda for serverless operations.

---

## Features

- **Scalable Backend**: Designed to handle a large number of concurrent requests.
- **Serverless Architecture**: Built with AWS Lambda to ensure cost-effectiveness and scalability.
- **API-Driven**: Provides RESTful APIs to interact with the mobile and admin applications.

---

## Requirements

- Node.js (v14 or later)
- AWS CLI configured for deployment

---

## Getting Started

1. Clone the repository.
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the `Function` folder.
   ```bash
   cd Function
   ```

3. Install dependencies.
   ```bash
   npm install
   ```

4. Deploy to AWS Lambda.
   ```bash
   npm run deploy
   ```

---

## Folder Structure

- **/src**: Contains the source code for the Lambda functions.
- **/config**: Configuration files for AWS and environment settings.
- **/tests**: Unit and integration tests for backend services.

---

## Deployment

The backend services are deployed using AWS Lambda. Ensure your AWS CLI is configured and the appropriate permissions are set for deployment.

---

## Contributing

Contributions are welcome! Please ensure you follow the project guidelines for submitting pull requests.
