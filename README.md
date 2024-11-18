# Serverless

This project is a serverless function that sends verification emails using SendGrid. It is designed to be deployed as an AWS Lambda function.

## Prerequisites

- Node.js
- AWS account
- SendGrid account

## Setup

1. Clone the repository:

```sh
git clone git@github.com:csye6225-cloud-neu/serverless.git
cd serverless/src
```

2. Install dependencies:
```sh
npm install
```

3. Deploy the Lambda function in the /src folder using your preferred deployment method and set your credentials in the Environment Variables under Configuration:
```
EMAIL_FROM=your-email@example.com
SENDGRID_API_KEY=your-sendgrid-api-key
DOMAIN=your-domain.com
```