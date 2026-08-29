# BANK_CLI - Modern Banking Dashboard

## Overview

A full-stack banking application with a professional, polished interface. The React client delivers a complete banking dashboard for account management, transactions, and transfers, backed by a local Express API.

**Disclaimer:** This is a demonstration and learning project. No real financial operations are performed.

## Key Features

- **Account overview:** Balance and account card display
- **Transfers and transactions:** Money movement between accounts with full history
- **Financial trends:** Income and expense insights with filters
- **Statement export:** Download and print account statements
- **Per-account state:** localStorage keys scoped by account number
- **Polished interface:** Gradient cards, smooth animations, and Lucide icons

## Technology Stack

| Component | Technology |
|---|---|
| Client | React (Vite), Bootstrap, Lucide React, Axios |
| Server | Node.js, Express 5, CORS |

## Getting Started

```bash
git clone https://github.com/Tech-Guru19/BANK_CLI.git
cd BANK_CLI

# Start the server
cd Server && npm install && npm start   # runs on port 5000

# Start the client (in a new terminal)
cd ../Client && npm install && npm run dev
```

## Project Structure

```
BANK_CLI/
├── Client/    # React and Vite dashboard
└── Server/    # Express API (localhost:5000/api)
```

## Author

[Obiasogu Esther Chizaram](https://github.com/Tech-Guru19)
