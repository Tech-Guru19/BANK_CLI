import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  AlertCircle, CheckCircle, User, CreditCard, LogOut, ArrowRight, ArrowLeft,
  TrendingUp, TrendingDown, DollarSign, Send, Loader2, Clock, Filter, Calendar,
  ArrowUpRight, ArrowDownLeft, RefreshCw, Download, Printer, X
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const getStorageKey = (accountNumber, key) => `${key}_${accountNumber}`;


const CustomStyles = () => (
  <style>
    {`
    /* Custom Variables */
    :root {
      --ag-indigo-900: #1e3a8a;
      --ag-indigo-600: #4f46e5;
      --ag-teal-600: #0d9488;
      --ag-teal-400: #2dd4bf;
      --ag-red-600: #dc2626;
      --ag-gray-100: #f3f4f6;
      --ag-purple-600: #9333ea;
      --ag-green-600: #059669;
      --bs-body-bg: var(--ag-gray-100);
      --bs-primary: var(--ag-indigo-600);
      --bs-success: var(--ag-teal-600);
      --bs-danger: var(--ag-red-600);
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--ag-gray-100);
    }
    
    .header-card {
      background: linear-gradient(135deg, var(--ag-indigo-900) 0%, #312e81 100%);
      border-radius: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
    }
    
    .main-card {
      border-radius: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid #e5e7eb;
    }

    .fixed-alert {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1050;
      border-radius: 0.75rem;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .input-custom-style:focus {
      border-color: var(--ag-indigo-600) !important;
      box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25) !important;
      transition: all 0.3s ease;
    }

    .custom-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .custom-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .custom-button-indigo {
      background-color: var(--ag-indigo-600);
    }
    .custom-button-indigo:hover {
      background-color: #4338ca;
    }
    .custom-button-teal {
      background-color: var(--ag-teal-600);
    }
    .custom-button-teal:hover {
      background-color: #0c746a;
    }
    .custom-button-red {
      background-color: var(--ag-red-600);
    }
    .custom-button-red:hover {
      background-color: #b91c1c;
    }
    .custom-button-purple {
      background-color: var(--ag-purple-600);
    }
    .custom-button-purple:hover {
      background-color: #7e22ce;
    }
    .custom-button-green {
      background-color: var(--ag-green-600);
    }
    .custom-button-green:hover {
      background-color: #047857;
    }
    
    .balance-card {
      background: linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%);
      border: 1px solid #99f6e4;
      border-radius: 0.75rem;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }

    .nav-link-custom {
      border-bottom: 4px solid transparent;
      transition: all 0.2s ease;
      font-weight: 600;
      color: #6b7280;
      min-width: 100px;
    }
    .nav-link-custom:hover {
      background-color: #f9fafb;
      color: #1f2937;
    }
    .nav-link-custom.active {
      background-color: #eef2ff;
      color: var(--ag-indigo-600);
      border-color: var(--ag-indigo-600);
    }
    
    .detail-container {
      background-color: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 0.75rem;
    }
    .detail-item {
      border-bottom: 1px solid #e0e7ff;
    }

    .transaction-card {
      border-left: 4px solid transparent;
      transition: all 0.2s ease;
      cursor: pointer;
      border-radius: 0.5rem;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
    }
    .transaction-card:hover {
      background-color: #f9fafb;
      border-left-width: 4px;
      transform: translateX(4px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .transaction-card.deposit {
      border-left-color: var(--ag-green-600);
    }
    .transaction-card.withdrawal {
      border-left-color: var(--ag-red-600);
    }
    .transaction-card.transfer-in {
      border-left-color: var(--ag-teal-600);
    }
    .transaction-card.transfer-out {
      border-left-color: var(--ag-purple-600);
    }

    .spinner-custom {
      width: 1.5rem;
      height: 1.5rem;
      border: 0.25em solid currentColor;
      border-right-color: transparent;
      margin-right: 0.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .filter-chip {
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      border: 2px solid #e5e7eb;
      background: white;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .filter-chip:hover {
      border-color: var(--ag-indigo-600);
      background: #eef2ff;
    }
    .filter-chip.active {
      border-color: var(--ag-indigo-600);
      background: var(--ag-indigo-600);
      color: white;
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      color: #9ca3af;
    }

    .receipt-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .receipt-content {
      background: white;
      border-radius: 1rem;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { 
        transform: translateY(20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }

    .receipt-print {
      background: white;
      padding: 2rem;
      border: 2px dashed #e5e7eb;
      border-radius: 0.5rem;
    }

    @media print {
      body * {
        visibility: hidden;
      }
      .receipt-print, .receipt-print * {
        visibility: visible;
      }
      .receipt-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        border: none;
      }
      .no-print {
        display: none !important;
      }
    }

    .receipt-header {
      text-align: center;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .receipt-total {
      background: #eef2ff;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }
    `}
  </style>
);

const inputClass = "form-control form-control-lg rounded-3 input-custom-style text-dark";

const Spinner = ({ color = 'text-white' }) => (
  <div className={`spinner-border spinner-custom ${color}`} role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

export default function App() {
  const [view, setView] = useState('main');
  const [currentAccount, setCurrentAccount] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transactions, setTransactions] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem('currentAccount');

    if (savedAccount) {
      try {
        const account = JSON.parse(savedAccount);
        setCurrentAccount(account);
        setView('account');

        const transactionsKey = getStorageKey(account.accountNumber, 'transactions');
        const savedTransactions = localStorage.getItem(transactionsKey);

        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error loading saved account:', error);
        localStorage.removeItem('currentAccount');
        setTransactions([]);
      }
    }
  }, []);

  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
    } else {
      localStorage.removeItem('currentAccount');
    }
  }, [currentAccount]);


  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleLogin = async (accountNumber) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await axios.get(`${API_URL}/accounts/${accountNumber}`);
      if (response.data.success) {
        const accountData = response.data.data;
        setCurrentAccount(accountData);

        const transactionsKey = getStorageKey(accountNumber, 'transactions');
        const savedTransactions = localStorage.getItem(transactionsKey);

        if (savedTransactions) {
          try {
            setTransactions(JSON.parse(savedTransactions));
          } catch (e) {
            setTransactions([]);
          }
        } else {
          setTransactions([]);
        }

        await fetchTransactions(accountNumber);

        setView('account');
        showMessage('success', 'Login successful! Welcome back.');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Account not found or service unavailable.');
    }
  };

  const fetchTransactions = async (accountNumber) => {
    try {
      const response = await axios.get(`${API_URL}/accounts/${accountNumber}/transactions`);
      if (response.data.success) {
        const fetchedTransactions = response.data.data || [];
        setTransactions(fetchedTransactions);
        const transactionsKey = getStorageKey(accountNumber, 'transactions');
        localStorage.setItem(transactionsKey, JSON.stringify(fetchedTransactions));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleLogout = () => {
    setCurrentAccount(null);
    setTransactions([]);
    setView('main');
    localStorage.removeItem('currentAccount');
    showMessage('success', 'Logged out successfully. Thank you for banking with us.');
  };

  const refreshAccount = async () => {
    if (currentAccount) {
      try {
        const response = await axios.get(`${API_URL}/accounts/${currentAccount.accountNumber}`);
        if (response.data.success) {
          setCurrentAccount(response.data.data);
          localStorage.setItem('currentAccount', JSON.stringify(response.data.data));
          await fetchTransactions(currentAccount.accountNumber);
        }
      } catch (error) {
        console.error('Error refreshing account:', error);
      }
    }
  };

  const formatNaira = (amount) => {
    return `₦${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const addTransaction = (transaction) => {
    if (!currentAccount) return;

    setTransactions(prev => {
      const updated = [transaction, ...prev];
      const transactionsKey = getStorageKey(currentAccount.accountNumber, 'transactions');
      localStorage.setItem(transactionsKey, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <CustomStyles />

      <div className="min-vh-100 p-4 p-sm-5 antialiased">
        <div className="container-lg mx-auto">

          <header className="header-card text-white p-4 p-md-5 mb-5">
            <h1 className="h1 fw-bolder tracking-tight d-flex align-items-center gap-3">
              <CreditCard size={36} style={{ color: 'var(--ag-teal-400)' }} />
              Finova Digital Bank
            </h1>
            <p className="text-opacity-75 mt-2 fs-5" style={{ color: '#c7d2fe' }}>Your Future, Secured and Accessible.</p>
          </header>

          {message.text && (
            <div className={`fixed-alert p-3 d-flex align-items-center gap-3 ${message.type === 'success' ? 'bg-success' : 'bg-danger'
              }`}>
              {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <span className="fw-semibold text-white">{message.text}</span>
            </div>
          )}

          <div className="bg-white p-4 p-md-5 main-card">
            {view === 'main' && <MainMenu setView={setView} />}
            {view === 'create' && <CreateAccount setView={setView} showMessage={showMessage} />}
            {view === 'login' && <Login handleLogin={handleLogin} setView={setView} />}
            {view === 'account' && (
              <AccountDashboard
                account={currentAccount}
                handleLogout={handleLogout}
                showMessage={showMessage}
                refreshAccount={refreshAccount}
                formatNaira={formatNaira}
                transactions={transactions}
                addTransaction={addTransaction}
                setSelectedReceipt={setSelectedReceipt}
              />
            )}
          </div>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          formatNaira={formatNaira}
        />
      )}
    </>
  );
}

function ReceiptModal({ receipt, onClose, formatNaira }) {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptText = generateReceiptText(receipt, formatNaira);
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receipt.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReceiptText = (receipt, formatNaira) => {
    return `
========================================
    FINOVA DIGITAL BANK
    TRANSACTION RECEIPT
========================================

Transaction ID: ${receipt.transactionId}
Date & Time: ${receipt.timestamp}

----------------------------------------
TRANSACTION DETAILS
----------------------------------------
Type: ${receipt.type.toUpperCase()}
Amount: ${formatNaira(receipt.amount)}
${receipt.recipientAccount ? `Recipient: ${receipt.recipientAccount}` : ''}
${receipt.recipientName ? `Recipient Name: ${receipt.recipientName}` : ''}

----------------------------------------
ACCOUNT INFORMATION
----------------------------------------
Account Number: ${receipt.accountNumber}
Account Holder: ${receipt.accountHolder}
Balance Before: ${formatNaira(receipt.balanceBefore)}
Balance After: ${formatNaira(receipt.balanceAfter)}

----------------------------------------
Status: ${receipt.status}

========================================
Thank you for banking with us!
For inquiries: support@Finova.com 
========================================
    `;
  };

  return (
    <div className="receipt-modal" onClick={onClose}>
      <div className="receipt-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 no-print">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h4 fw-bold mb-0">Transaction Receipt</h3>
            <button onClick={onClose} className="btn btn-link text-dark">
              <X size={24} />
            </button>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button onClick={handlePrint} className="btn custom-button-indigo text-white flex-grow-1 d-flex align-items-center justify-content-center gap-2">
              <Printer size={18} />
              Print Receipt
            </button>
            <button onClick={handleDownload} className="btn custom-button-teal text-white flex-grow-1 d-flex align-items-center justify-content-center gap-2">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        <div className="receipt-print p-4" ref={receiptRef}>
          <div className="receipt-header">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <CreditCard size={32} style={{ color: 'var(--ag-indigo-600)' }} />
              <h2 className="h3 fw-bold mb-0">Finova Digital Bank</h2>
            </div>
            <p className="text-secondary mb-0">Transaction Receipt</p>
          </div>

          <div className="mb-4">
            <div className="text-center mb-3">
              <span className="badge bg-success px-4 py-2 fs-6">{receipt.status}</span>
            </div>

            <div className="receipt-row">
              <span className="text-secondary">Transaction ID:</span>
              <span className="fw-bold font-monospace">{receipt.transactionId}</span>
            </div>

            <div className="receipt-row">
              <span className="text-secondary">Date & Time:</span>
              <span className="fw-semibold">{receipt.timestamp}</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="h6 fw-bold mb-3" style={{ color: 'var(--ag-indigo-600)' }}>Transaction Details</h4>

            <div className="receipt-row">
              <span className="text-secondary">Transaction Type:</span>
              <span className="fw-bold text-uppercase">{receipt.type}</span>
            </div>

            <div className="receipt-row">
              <span className="text-secondary">Amount:</span>
              <span className="fw-bold fs-5" style={{ color: 'var(--ag-green-600)' }}>{formatNaira(receipt.amount)}</span>
            </div>

            {receipt.recipientAccount && (
              <>
                <div className="receipt-row">
                  <span className="text-secondary">Recipient Account:</span>
                  <span className="fw-bold font-monospace">{receipt.recipientAccount}</span>
                </div>
                {receipt.recipientName && (
                  <div className="receipt-row">
                    <span className="text-secondary">Recipient Name:</span>
                    <span className="fw-bold">{receipt.recipientName}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mb-4">
            <h4 className="h6 fw-bold mb-3" style={{ color: 'var(--ag-indigo-600)' }}>Account Information</h4>

            <div className="receipt-row">
              <span className="text-secondary">Account Number:</span>
              <span className="fw-bold font-monospace">{receipt.accountNumber}</span>
            </div>

            <div className="receipt-row">
              <span className="text-secondary">Account Holder:</span>
              <span className="fw-bold">{receipt.accountHolder}</span>
            </div>

            <div className="receipt-row">
              <span className="text-secondary">Balance Before:</span>
              <span className="fw-semibold">{formatNaira(receipt.balanceBefore)}</span>
            </div>

            <div className="receipt-total">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Balance After:</span>
                <span className="fw-bold fs-5" style={{ color: 'var(--ag-indigo-600)' }}>{formatNaira(receipt.balanceAfter)}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-top">
            <p className="small text-secondary mb-1">Thank you for banking with Finova Digital Bank</p>
            <p className="small text-secondary mb-0">For inquiries: support@Finova.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainMenu({ setView }) {
  const Button = ({ onClick, icon: Icon, label, colorClass }) => (
    <button
      onClick={onClick}
      className={`w-100 btn btn-lg text-white fw-bold py-4 rounded-3 shadow-lg custom-button ${colorClass} d-flex align-items-center justify-content-between fs-5`}
    >
      <div className="d-flex align-items-center gap-3">
        <Icon size={24} />
        <span>{label}</span>
      </div>
      <ArrowRight size={20} />
    </button>
  );

  return (
    <div className="mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="text-center h3 fw-bolder text-dark mb-5">Your Financial Journey Starts Here</h2>
      <div className="d-grid gap-4">
        <Button
          onClick={() => setView('login')}
          icon={User}
          label="Secure Account Login"
          colorClass="custom-button-indigo"
        />
        <Button
          onClick={() => setView('create')}
          icon={CreditCard}
          label="Open a New Account"
          colorClass="custom-button-teal"
        />
      </div>
    </div>
  );
}

function BackToMain({ setView }) {
  return (
    <button
      onClick={() => setView('main')}
      className="mb-4 btn btn-link text-decoration-none text-primary d-flex align-items-center gap-2 fw-semibold p-0 back-button"
      style={{ '--bs-link-color': 'var(--ag-indigo-600)' }}
    >
      <ArrowLeft size={18} />
      Go Back to Main Menu
    </button>
  );
}

function CreateAccount({ setView, showMessage }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/accounts`, {
        accountHolderName: name
      });
      if (response.data.success) {
        showMessage('success', `Account created! Your Account Number is: ${response.data.data.accountNumber}. Please save it.`);
        setName('');
        setView('main');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create account. Please try again.';
      if (errorMsg.toLowerCase().includes('already exists') || errorMsg.toLowerCase().includes('user already exist')) {
        showMessage('error', 'User already exists. Please use a different name or login to your existing account.');
      } else {
        showMessage('error', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '450px' }}>
      <BackToMain setView={setView} />
      <h2 className="h3 fw-bold text-dark mb-4">Open Your Account</h2>
      <form onSubmit={handleSubmit} className="d-grid gap-4">
        <div>
          <label htmlFor="name" className="form-label text-dark fw-semibold mb-2">Account Holder Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g., Jane Doe"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !name}
          className="w-100 btn btn-lg custom-button-teal text-white fw-bold py-3 rounded-3 transition shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ms-2">Processing...</span>
            </>
          ) : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

function Login({ handleLogin, setView }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleLogin(accountNumber);
    setLoading(false);
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '450px' }}>
      <BackToMain setView={setView} />
      <h2 className="h3 fw-bold text-dark mb-4">Secure Login</h2>
      <form onSubmit={handleSubmit} className="d-grid gap-4">
        <div>
          <label htmlFor="accountNumber" className="form-label text-dark fw-semibold mb-2">Account Number</label>
          <input
            id="accountNumber"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className={inputClass}
            placeholder="Enter your 10-digit account number"
            maxLength={10}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || accountNumber.length !== 10}
          className="w-100 btn btn-lg custom-button-indigo text-white fw-bold py-3 rounded-3 transition shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ms-2">Signing In...</span>
            </>
          ) : 'Login to Account'}
        </button>
      </form>
    </div>
  );
}

function AccountDashboard({ account, handleLogout, showMessage, refreshAccount, formatNaira, transactions, addTransaction, setSelectedReceipt }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="d-grid gap-4">
      <div className="bg-white p-4 rounded-3 shadow-lg border-top border-primary border-5">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
          <div>
            <h2 className="h3 fw-bolder text-dark d-flex align-items-center gap-3">
              <User size={30} style={{ color: 'var(--ag-indigo-600)' }} />
              Hello, {account.accountHolderName}
            </h2>
            <p className="text-secondary d-flex align-items-center gap-2 mt-2 mb-0">
              <CreditCard size={18} />
              Account: <span className="font-monospace text-dark tracking-wider fw-bold">{account.accountNumber}</span>
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={refreshAccount}
              className="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              title="Refresh Account"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="btn custom-button-red text-white px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm flex-shrink-0"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="balance-card p-4 mt-4">
          <p className="text-secondary text-uppercase fw-medium mb-1">Current Available Balance</p>
          <p className="display-6 fw-bolder mt-1 mb-0" style={{ color: '#3730a3' }}>{formatNaira(account.balance)}</p>
        </div>
      </div>

      <div className="bg-white rounded-3 shadow-lg border border-light">
        <ul className="nav nav-tabs border-bottom border-light flex-nowrap overflow-auto p-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'transactions', label: 'Transactions', icon: Clock },
            { id: 'deposit', label: 'Deposit', icon: DollarSign },
            { id: 'withdraw', label: 'Withdrawal', icon: TrendingUp },
            { id: 'transfer', label: 'Transfer', icon: Send }
          ].map(({ id, label, icon: Icon }) => (
            <li className="nav-item flex-grow-1" key={id}>
              <button
                onClick={() => setActiveTab(id)}
                className={`nav-link nav-link-custom w-100 d-flex align-items-center justify-content-center gap-2 fs-6 py-3 px-2 ${activeTab === id ? 'active' : ''}`}
                style={{ borderRadius: '0.75rem 0.75rem 0 0' }}
              >
                <Icon size={20} />
                <span className="d-none d-sm-inline">{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="p-4 p-md-5">
          {activeTab === 'overview' && <Overview account={account} formatNaira={formatNaira} transactions={transactions} setSelectedReceipt={setSelectedReceipt} />}
          {activeTab === 'transactions' && <Transactions transactions={transactions} formatNaira={formatNaira} accountNumber={account.accountNumber} setSelectedReceipt={setSelectedReceipt} />}
          {activeTab === 'deposit' && (
            <Deposit account={account} showMessage={showMessage} refreshAccount={refreshAccount} formatNaira={formatNaira} addTransaction={addTransaction} setSelectedReceipt={setSelectedReceipt} />
          )}
          {activeTab === 'withdraw' && (
            <Withdraw account={account} showMessage={showMessage} refreshAccount={refreshAccount} formatNaira={formatNaira} addTransaction={addTransaction} setSelectedReceipt={setSelectedReceipt} />
          )}
          {activeTab === 'transfer' && (
            <Transfer account={account} showMessage={showMessage} refreshAccount={refreshAccount} formatNaira={formatNaira} addTransaction={addTransaction} setSelectedReceipt={setSelectedReceipt} />
          )}
        </div>
      </div>
    </div>
  );
}

function Overview({ account, formatNaira, transactions, setSelectedReceipt }) {
  const recentTransactions = transactions.slice(0, 5);

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' || t.type === 'transfer_in')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' || t.type === 'transfer_out')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div>
      <h3 className="h4 fw-bold text-dark mb-4">Account Overview</h3>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="p-2 rounded-3" style={{ backgroundColor: '#dcfce7' }}>
                <TrendingUp size={24} style={{ color: 'var(--ag-green-600)' }} />
              </div>
              <div>
                <p className="text-secondary small mb-0">Total Deposits</p>
                <p className="h5 fw-bold mb-0" style={{ color: 'var(--ag-green-600)' }}>{formatNaira(totalDeposits)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="p-2 rounded-3" style={{ backgroundColor: '#fee2e2' }}>
                <TrendingDown size={24} style={{ color: 'var(--ag-red-600)' }} />
              </div>
              <div>
                <p className="text-secondary small mb-0">Total Withdrawals</p>
                <p className="h5 fw-bold mb-0" style={{ color: 'var(--ag-red-600)' }}>{formatNaira(totalWithdrawals)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="p-2 rounded-3" style={{ backgroundColor: '#e0e7ff' }}>
                <Clock size={24} style={{ color: 'var(--ag-indigo-600)' }} />
              </div>
              <div>
                <p className="text-secondary small mb-0">Total Transactions</p>
                <p className="h5 fw-bold mb-0" style={{ color: 'var(--ag-indigo-600)' }}>{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-container p-4 d-grid gap-2 mb-4">
        <DetailItem label="Account Holder" value={account.accountHolderName} />
        <DetailItem label="Account Number" value={account.accountNumber} isMonospace={true} />
        <DetailItem label="Current Balance" value={formatNaira(account.balance)} isBalance={true} />
        <DetailItem label="Account Status" value="Active" color="text-success" />
      </div>

      {recentTransactions.length > 0 && (
        <div>
          <h4 className="h5 fw-bold text-dark mb-3">Recent Activity</h4>
          <div className="d-grid gap-2">
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                transaction={transaction}
                formatNaira={formatNaira}
                accountNumber={account.accountNumber}
                setSelectedReceipt={setSelectedReceipt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const DetailItem = ({ label, value, isMonospace = false, isBalance = false, color = 'text-dark' }) => (
  <div className={`d-flex justify-content-between align-items-center py-2 detail-item`}>
    <span className="text-secondary fw-medium">{label}:</span>
    <span className={`fw-bold ${isMonospace ? 'font-monospace tracking-wider' : ''} ${isBalance ? 'fs-5' : ''} ${color}`} style={{ color: isBalance ? '#3730a3' : undefined }}>
      {value}
    </span>
  </div>
);

function Transactions({ transactions, formatNaira, accountNumber, setSelectedReceipt }) {
  const [filter, setFilter] = useState('all');

  const accountTransactions = transactions.filter(t => t.accountNumber === accountNumber);

  const filteredTransactions = accountTransactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All', icon: Filter },
    { value: 'deposit', label: 'Deposits', icon: ArrowDownLeft },
    { value: 'withdrawal', label: 'Withdrawals', icon: ArrowUpRight },
    { value: 'transfer_in', label: 'Transfer In', icon: TrendingDown },
    { value: 'transfer_out', label: 'Transfer Out', icon: TrendingUp }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="h4 fw-bold text-dark mb-0">Transaction History</h3>
        <span className="badge bg-primary rounded-pill px-3 py-2">{filteredTransactions.length} transactions</span>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {filterOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`filter-chip ${filter === value ? 'active' : ''}`}
          >
            <div className="d-flex align-items-center gap-2">
              <Icon size={16} />
              <span className="fw-semibold small">{label}</span>
            </div>
          </button>
        ))}
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="d-grid gap-3">
          {filteredTransactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
              formatNaira={formatNaira}
              accountNumber={accountNumber}
              detailed={true}
              setSelectedReceipt={setSelectedReceipt}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Clock size={48} className="mb-3" />
          <p className="h5">No transactions found</p>
          <p className="small">Your transaction history will appear here</p>
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction, formatNaira, accountNumber, detailed = false, setSelectedReceipt }) {
  const getTransactionDetails = () => {
    switch (transaction.type) {
      case 'deposit':
        return {
          icon: ArrowDownLeft,
          color: 'var(--ag-green-600)',
          bgColor: '#dcfce7',
          label: 'Deposit',
          className: 'deposit',
          sign: '+'
        };
      case 'withdrawal':
        return {
          icon: ArrowUpRight,
          color: 'var(--ag-red-600)',
          bgColor: '#fee2e2',
          label: 'Withdrawal',
          className: 'withdrawal',
          sign: '-'
        };
      case 'transfer_in':
        return {
          icon: ArrowDownLeft,
          color: 'var(--ag-teal-600)',
          bgColor: '#ccfbf1',
          label: 'Transfer In',
          className: 'transfer-in',
          sign: '+'
        };
      case 'transfer_out':
        return {
          icon: ArrowUpRight,
          color: 'var(--ag-purple-600)',
          bgColor: '#f3e8ff',
          label: 'Transfer Out',
          className: 'transfer-out',
          sign: '-'
        };
      default:
        return {
          icon: DollarSign,
          color: '#6b7280',
          bgColor: '#f3f4f6',
          label: 'Transaction',
          className: '',
          sign: ''
        };
    }
  };

  const details = getTransactionDetails();
  const Icon = details.icon;

  return (
    <div
      className={`transaction-card ${details.className}`}
      onClick={() => setSelectedReceipt(transaction)}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex gap-3 flex-grow-1">
          <div className="p-2 rounded-3" style={{ backgroundColor: details.bgColor }}>
            <Icon size={24} style={{ color: details.color }} />
          </div>
          <div className="flex-grow-1">
            <p className="fw-bold mb-1">{details.label}</p>
            <p className="text-secondary small mb-1">{transaction.timestamp}</p>
            {detailed && transaction.description && (
              <p className="text-secondary small mb-0">{transaction.description}</p>
            )}
            {transaction.recipientAccount && (
              <p className="text-secondary small mb-0 font-monospace">To: {transaction.recipientAccount}</p>
            )}
          </div>
        </div>
        <div className="text-end">
          <p className={`fw-bold mb-0 fs-5`} style={{ color: details.color }}>
            {details.sign}{formatNaira(transaction.amount)}
          </p>
          {detailed && (
            <button className="btn btn-link btn-sm p-0 text-decoration-none" style={{ color: 'var(--ag-indigo-600)' }}>
              <small>View Receipt</small>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Deposit({ account, showMessage, refreshAccount, formatNaira, addTransaction, setSelectedReceipt }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount < 10) {
      showMessage('error', 'Deposit amount must be at least ₦10.');
      return;
    }

    setLoading(true);
    const balanceBefore = account.balance;

    try {
      const response = await axios.post(
        `${API_URL}/accounts/${account.accountNumber}/deposit`,
        { amount: depositAmount }
      );
      if (response.data.success) {
        showMessage('success', `Deposited ${formatNaira(depositAmount)} successfully!`);

        const receipt = {
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'deposit',
          amount: depositAmount,
          accountNumber: account.accountNumber,
          accountHolder: account.accountHolderName,
          balanceBefore: balanceBefore,
          balanceAfter: response.data.data.balance || (balanceBefore + depositAmount),
          status: 'Successful',
          description: 'Cash Deposit'
        };

        addTransaction(receipt);
        setAmount('');
        await refreshAccount();
        setSelectedReceipt(receipt);
      }
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Deposit failed. Please check the amount.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '400px' }}>
      <h3 className="h4 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <DollarSign size={24} className="text-success" /> Deposit Funds
      </h3>
      <form onSubmit={handleSubmit} className="d-grid gap-4">
        <div>
          <label htmlFor="depositAmount" className="form-label text-dark fw-semibold mb-2">Amount (Minimum ₦10)</label>
          <input
            id="depositAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="Enter deposit amount"
            min="10"
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !amount || parseFloat(amount) < 10}
          className="w-100 btn btn-lg custom-button-teal text-white fw-bold py-3 rounded-3 transition shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ms-2">Processing...</span>
            </>
          ) : 'Complete Deposit'}
        </button>
      </form>
    </div>
  );
}

function Withdraw({ account, showMessage, refreshAccount, formatNaira, addTransaction, setSelectedReceipt }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const currentBalance = account.balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < 10) {
      showMessage('error', 'Withdrawal amount must be at least ₦10.');
      return;
    }
    if (withdrawAmount > currentBalance) {
      showMessage('error', 'Insufficient funds for withdrawal.');
      return;
    }

    setLoading(true);
    const balanceBefore = account.balance;

    try {
      const response = await axios.post(
        `${API_URL}/accounts/${account.accountNumber}/withdraw`,
        { amount: withdrawAmount }
      );
      if (response.data.success) {
        showMessage('success', `Withdrew ${formatNaira(withdrawAmount)} successfully!`);

        const receipt = {
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'withdrawal',
          amount: withdrawAmount,
          accountNumber: account.accountNumber,
          accountHolder: account.accountHolderName,
          balanceBefore: balanceBefore,
          balanceAfter: response.data.data.balance || (balanceBefore - withdrawAmount),
          status: 'Successful',
          description: 'Cash Withdrawal'
        };

        addTransaction(receipt);
        setAmount('');
        await refreshAccount();
        setSelectedReceipt(receipt);
      }
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Withdrawal failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '400px' }}>
      <h3 className="h4 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <TrendingUp size={24} style={{ color: 'var(--ag-indigo-600)' }} /> Withdraw Funds
      </h3>
      <form onSubmit={handleSubmit} className="d-grid gap-4">
        <div>
          <label htmlFor="withdrawAmount" className="form-label text-dark fw-semibold mb-2">Amount (Minimum ₦10)</label>
          <input
            id="withdrawAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="Enter withdrawal amount"
            min="10"
            step="0.01"
            required
          />
        </div>
        <p className="text-muted small mt-2">Current Available Balance: <span className="fw-bold text-primary">{formatNaira(currentBalance)}</span></p>
        <button
          type="submit"
          disabled={loading || !amount || parseFloat(amount) < 10 || parseFloat(amount) > currentBalance}
          className="w-100 btn btn-lg custom-button-indigo text-white fw-bold py-3 rounded-3 transition shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ms-2">Processing...</span>
            </>
          ) : 'Complete Withdrawal'}
        </button>
      </form>
    </div>
  );
}

function Transfer({ account, showMessage, refreshAccount, formatNaira, addTransaction, setSelectedReceipt }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [checkingRecipient, setCheckingRecipient] = useState(false);
  const currentBalance = account.balance;

  useEffect(() => {
    const checkRecipient = async () => {
      if (recipient.length === 10 && recipient !== account.accountNumber) {
        setCheckingRecipient(true);
        try {
          const response = await axios.get(`${API_URL}/accounts/${recipient}`);
          if (response.data.success) {
            setRecipientInfo({
              name: response.data.data.accountHolderName,
              bank: 'Finova Digital Bank'
            });
          }
        } catch (error) {
          setRecipientInfo(null);
        } finally {
          setCheckingRecipient(false);
        }
      } else {
        setRecipientInfo(null);
      }
    };

    const timer = setTimeout(checkRecipient, 500);
    return () => clearTimeout(timer);
  }, [recipient, account.accountNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);

    if (recipient === account.accountNumber) {
      showMessage('error', 'Cannot transfer funds to the same account.');
      return;
    }
    if (transferAmount < 10) {
      showMessage('error', 'Transfer amount must be at least ₦10.');
      return;
    }
    if (transferAmount > currentBalance) {
      showMessage('error', 'Insufficient funds for transfer.');
      return;
    }

    setLoading(true);
    const balanceBefore = account.balance;

    try {
      const response = await axios.post(
        `${API_URL}/accounts/${account.accountNumber}/transfer`,
        {
          recipientAccountNumber: recipient,
          amount: transferAmount
        }
      );
      if (response.data.success) {
        showMessage('success', `Transferred ${formatNaira(transferAmount)} to ${recipientInfo?.name || recipient} successfully!`);

        const receipt = {
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: 'transfer_out',
          amount: transferAmount,
          accountNumber: account.accountNumber,
          accountHolder: account.accountHolderName,
          recipientAccount: recipient,
          recipientName: recipientInfo?.name || response.data.data.recipientName || 'N/A',
          balanceBefore: balanceBefore,
          balanceAfter: response.data.data.balance || (balanceBefore - transferAmount),
          status: 'Successful',
          description: `Transfer to ${recipientInfo?.name || recipient}`
        };

        addTransaction(receipt);
        setRecipient('');
        setAmount('');
        setRecipientInfo(null);
        await refreshAccount();
        setSelectedReceipt(receipt);
      }
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Transfer failed. Check balance and recipient number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '400px' }}>
      <h3 className="h4 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <Send size={24} style={{ color: 'var(--ag-purple-600)' }} /> Initiate Fund Transfer
      </h3>
      <form onSubmit={handleSubmit} className="d-grid gap-4">
        <div>
          <label htmlFor="recipientAccount" className="form-label text-dark fw-semibold mb-2">Recipient Account Number</label>
          <input
            id="recipientAccount"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={inputClass}
            placeholder="Enter 10-digit recipient account number"
            maxLength={10}
            required
          />
          {checkingRecipient && (
            <div className="mt-2 text-primary small">
              <Spinner color="text-primary" /> Verifying account...
            </div>
          )}
          {recipientInfo && (
            <div className="mt-2 p-3 rounded-3" style={{ backgroundColor: '#dcfce7', border: '1px solid var(--ag-green-600)' }}>
              <p className="mb-1 small text-success fw-semibold">✓ Account Found</p>
              <p className="mb-0 fw-bold" style={{ color: '#059669' }}>{recipientInfo.name}</p>
              <p className="mb-0 small text-secondary">{recipientInfo.bank}</p>
            </div>
          )}
          {recipient.length === 10 && !recipientInfo && !checkingRecipient && recipient !== account.accountNumber && (
            <div className="mt-2 p-3 rounded-3" style={{ backgroundColor: '#fee2e2', border: '1px solid var(--ag-red-600)' }}>
              <p className="mb-0 small text-danger fw-semibold">✗ Account not found</p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="transferAmount" className="form-label text-dark fw-semibold mb-2">Amount (Minimum ₦10)</label>
          <input
            id="transferAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="Enter amount to transfer"
            min="10"
            step="0.01"
            required
          />
        </div>
        <p className="text-muted small">Current Available Balance: <span className="fw-bold text-primary">{formatNaira(currentBalance)}</span></p>
        <button
          type="submit"
          disabled={loading || !recipient || !amount || parseFloat(amount) < 10 || parseFloat(amount) > currentBalance || recipient.length !== 10 || !recipientInfo}
          className="w-100 btn btn-lg custom-button-purple text-white fw-bold py-3 rounded-3 transition shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              <span className="ms-2">Processing...</span>
            </>
          ) : 'Confirm Transfer'}
        </button>
      </form>
    </div>
  );
}