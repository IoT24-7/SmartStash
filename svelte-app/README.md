# SmartStash

This guide will walk you through setting up and running the SmartStash web application on your local machine using SvelteKit.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)

## Setup

1. **Clone the Repository**

   First, clone the SmartStash repository to your local machine:

   ```bash
   git clone https://github.com/IoT24-7/SmartStash.git
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the required dependencies:

   ```bash
   cd SmartStash/svelte-app
   npm install
   ```

3. **Environment Variables**

   You will receive the `.env` and the `service-account.json` file via messenger. Place this file in the root directory of the project.

4. **Start the Development Server**

   To start the development server, run:

   ```bash
   npm run dev --open
   ```

   Your application will now be available at `http://localhost:5173`.
