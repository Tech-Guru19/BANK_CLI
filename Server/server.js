const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

class AccountDataStore {
    constructor(filename = 'bank_accounts.json') {
        this.filename = filename;
        this.accounts = new Map();
        this.usedAccountNumbers = new Set();
    }

    async initialize() {
        await this.loadData();
    }

    async loadData() {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const parsed = JSON.parse(data);
            this.accounts = new Map(Object.entries(parsed.accounts || {}));
            this.usedAccountNumbers = new Set(parsed.usedNumbers || []);
        } catch (error) {
            this.accounts = new Map();
            this.usedAccountNumbers = new Set();
        }
    }

    async saveData() {
        const data = {
            accounts: Object.fromEntries(this.accounts),
            usedNumbers: Array.from(this.usedAccountNumbers)
        };
        await fs.writeFile(this.filename, JSON.stringify(data, null, 2));
    }

    async saveAccount(accountNumber, accountData) {
        this.accounts.set(accountNumber, accountData);
        this.usedAccountNumbers.add(accountNumber);
        await this.saveData();
    }

    getAccount(accountNumber) {
        return this.accounts.get(accountNumber);
    }

    isNumberUsed(accountNumber) {
        return this.usedAccountNumbers.has(accountNumber);
    }
}

class BankAccount {
    constructor(accountHolderName, accountNumber, balance = 0) {
        this.accountHolderName = accountHolderName;
        this.accountNumber = accountNumber;
        this._balance = balance;
    }

    get balance() {
        return this._balance;
    }

    deposit(amount) {
        if (amount < 10) throw new Error('Minimum deposit amount is ₦10');
        if (amount <= 0) throw new Error('Deposit amount must be positive');
        this._balance += amount;
        return true;
    }

    withdraw(amount) {
        if (amount < 10) throw new Error('Minimum withdrawal amount is ₦10');
        if (amount <= 0) throw new Error('Withdrawal amount must be positive');
        if (amount > this._balance) {
            throw new Error(`Insufficient funds. Available balance: ₦${this._balance.toFixed(2)}`);
        }
        this._balance -= amount;
        return true;
    }

    toObject() {
        return {
            accountHolderName: this.accountHolderName,
            accountNumber: this.accountNumber,
            balance: this._balance
        };
    }

    static fromObject(data) {
        return new BankAccount(data.accountHolderName, data.accountNumber, data.balance);
    }
}

class BankingService {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }

    generateAccountNumber() {
        let accountNumber;
        do {
            accountNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
        } while (this.dataStore.isNumberUsed(accountNumber));
        return accountNumber;
    }

    async createAccount(accountHolderName) {
        if (!accountHolderName || !accountHolderName.trim()) {
            throw new Error('Account holder name cannot be empty');
        }
        const accountNumber = this.generateAccountNumber();
        const account = new BankAccount(accountHolderName.trim(), accountNumber);
        await this.dataStore.saveAccount(accountNumber, account.toObject());
        return account.toObject();
    }

    getAccount(accountNumber) {
        const accountData = this.dataStore.getAccount(accountNumber);
        if (!accountData) throw new Error('Account not found');
        return accountData;
    }

    async deposit(accountNumber, amount) {
        const accountData = this.dataStore.getAccount(accountNumber);
        if (!accountData) throw new Error('Account not found');

        const account = BankAccount.fromObject(accountData);
        account.deposit(amount);
        await this.dataStore.saveAccount(accountNumber, account.toObject());
        return account.toObject();
    }

    async withdraw(accountNumber, amount) {
        const accountData = this.dataStore.getAccount(accountNumber);
        if (!accountData) throw new Error('Account not found');

        const account = BankAccount.fromObject(accountData);
        account.withdraw(amount);
        await this.dataStore.saveAccount(accountNumber, account.toObject());
        return account.toObject();
    }

    async transfer(senderAccountNumber, recipientAccountNumber, amount) {
        if (senderAccountNumber === recipientAccountNumber) {
            throw new Error('Cannot transfer to the same account');
        }

        const senderData = this.dataStore.getAccount(senderAccountNumber);
        const recipientData = this.dataStore.getAccount(recipientAccountNumber);

        if (!senderData) throw new Error('Sender account not found');
        if (!recipientData) throw new Error('Recipient account not found');

        const sender = BankAccount.fromObject(senderData);
        const recipient = BankAccount.fromObject(recipientData);

        sender.withdraw(amount);
        recipient.deposit(amount);

        await this.dataStore.saveAccount(senderAccountNumber, sender.toObject());
        await this.dataStore.saveAccount(recipientAccountNumber, recipient.toObject());

        return sender.toObject();
    }
}

// Initialize services
const dataStore = new AccountDataStore();
const bankingService = new BankingService(dataStore);


// Create new account
app.post('/api/accounts', async (req, res) => {
    try {
        const { accountHolderName } = req.body;
        const account = await bankingService.createAccount(accountHolderName);
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get account by number
app.get('/api/accounts/:accountNumber', async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const account = bankingService.getAccount(accountNumber);
        res.json({ success: true, data: account });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
});

// Deposit
app.post('/api/accounts/:accountNumber/deposit', async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { amount } = req.body;
        const account = await bankingService.deposit(accountNumber, parseFloat(amount));
        res.json({ success: true, data: account });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Withdraw
app.post('/api/accounts/:accountNumber/withdraw', async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { amount } = req.body;
        const account = await bankingService.withdraw(accountNumber, parseFloat(amount));
        res.json({ success: true, data: account });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Transfer
app.post('/api/accounts/:accountNumber/transfer', async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { recipientAccountNumber, amount } = req.body;
        const account = await bankingService.transfer(
            accountNumber,
            recipientAccountNumber,
            parseFloat(amount)
        );
        res.json({ success: true, data: account });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Start server
dataStore.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`🏦 Bank API Server running on http://localhost:${PORT}`);
    });
});