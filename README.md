# My Dubai Properties API
This repository contains the backend API for **My Dubai Properties**. Follow the steps below to set up the project locally.

## Prerequisites
Before you begin, make sure you have the following installed:

- **Node.js** version 16.20.2 (or compatible)
- **MongoDB** running locally

## Project Setup
Follow these steps to set up the project on your local machine:

### 1. Install Node.js (v16.20.2)
Ensure that you have **Node.js version 16.20.2** installed. If you don't have it, you can download and install it from the [official Node.js website](https://nodejs.org/).

### 2. Install Project Dependencies
Clone the repository and navigate to the project directory. Then, run the following command to install the required dependencies:

```bash
npm install
```

### 3. Set Up MongoDB Database
If you haven't already, create a new MongoDB database called `my_dubai_properties_local_db`. This will be used for the local development environment.

### 4. Verify MongoDB Connection String
Open the `config.dev.json` file and check the MongoDB connection string:
```bash
"mongoUrl": "mongodb://localhost:27017/my_dubai_properties_local_db"
```
The default value assumes MongoDB is running locally on localhost:27017. Ensure this string matches your local MongoDB setup. If you are connecting to a different MongoDB instance, update the connection string accordingly.

### 5. Build the Project
After installing the dependencies, build the project using the following command:
```bash
npm run build
```

### 6. Start the API Server
Once the build is complete, start the API server by running:

```bash
npm run start
```
##### Application will be running on: http://localhost:3333

<br /><br /><br />



# ABOUT #

Web & API services for Off Ready Ready Plan.


## Back Panel Users ##
There are 3 different user types
- Admin
- Moderator
- User

Short desc about user roles here...


## Initial Tasks (Deadline Saturday 15th Feb, 2023) ##
- [x] Initial project structure
- [x] Authorization URL
- [x] Menu auto filter based on authorization
- [x] First Time Setup
- [x] Authentication & User Login
- [x] Dashboard

- [x] User management
    - [x] List Users
    - [x] Add User
    - [x] Edit User
    - [x] Delete User
    - [x] Password recovery
    - [x] Password Change



