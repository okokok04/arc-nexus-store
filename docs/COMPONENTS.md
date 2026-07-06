# Component Development Guide

## Core Components

### 1. **WalletConnect.tsx** ✅
Freighter wallet integration with connection state management

**Props**: None (uses useWallet hook)
**Features**:
- Connect/disconnect wallet
- Display truncated address
- Show balance
- Error handling

**Usage**:
```jsx
<WalletConnect />
```

---

### 2. **CreateEscrowForm.tsx** ✅
Form for creating new escrow agreements

**Props**:
```typescript
interface CreateEscrowFormProps {
  onSuccess?: (escrowId: number) => void
}
```

**Features**:
- Seller address validation (Stellar format)
- Amount input with decimal support
- Token type selection (XLM, USDC)
- Description textarea
- Expiration time picker
- Loading states
- Error messages

**Usage**:
```jsx
<CreateEscrowForm onSuccess={(id) => navigate(`/escrow/${id}`)} />
```

---

### 3. **EscrowCard.tsx** ✅
Display escrow details with action buttons

**Props**:
```typescript
interface EscrowCardProps {
  escrow: Escrow
  onRefresh: () => void
}
```

**Features**:
- Display escrow info (ID, amount, parties, status)
- Role-based action buttons (buyer/seller)
- Confirm delivery button
- Request refund button
- File dispute button
- Loading states
- Error handling

**Usage**:
```jsx
<EscrowCard escrow={escrowData} onRefresh={() => fetchEscrow()} />
```

---

### 4. **EscrowDashboard.tsx** ✅
Dashboard with escrow statistics and list

**Props**: None

**Features**:
- Active escrows count
- Completed transactions count
- Disputed escrows count
- Filter by status
- List all user escrows
- Link to detail view

**Usage**:
```jsx
<EscrowDashboard />
```

---

### 5. **TransactionHistory.tsx** ✅
Transaction history table with filtering

**Props**: None

**Features**:
- Sortable columns
- Transaction status indicators
- Pagination
- Export to CSV (planned)

**Usage**:
```jsx
<TransactionHistory />
```

---

### 6. **Layout.tsx** ✅
Main layout wrapper with header, navigation, footer

**Props**: None (uses Outlet for child routes)

**Features**:
- Sticky header
- Navigation links
- Wallet connect button
- Footer with links
- Responsive design

**Usage**:
```jsx
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      {/* other routes */}
    </Route>
  </Routes>
</BrowserRouter>
```

---

## Hooks

### 1. **useWallet.ts** ✅
Wallet state and Freighter integration

```typescript
const {
  account,        // Connected wallet address
  isConnected,    // Boolean connection status
  balance,        // XLM balance
  network,        // 'testnet' | 'mainnet'
  connect,        // () => Promise<void>
  disconnect,     // () => void
  sign,           // (tx: string) => Promise<string>
  error,          // Error message if any
} = useWallet()
```

---

### 2. **useEventStream.ts** ✅
Real-time event polling from Soroban

```typescript
const {
  events,         // Array of contract events
  isLoading,      // Loading state
  error,          // Error if any
  isSubscribed,   // Subscription status
  refetch,        // Manual refetch function
} = useEventStream(contractId)
```

---

## Pages

### 1. **HomePage.tsx** ✅
Landing page with features, how-it-works, FAQ

**Features**:
- Hero section
- Feature cards
- Step-by-step process
- FAQ section
- Call-to-action

---

### 2. **CreateEscrowPage.tsx** ✅
Form page for creating new escrow

**Features**:
- Centered form layout
- Input validation
- Success/error messages

---

### 3. **EscrowDetailPage.tsx** ✅
Individual escrow detail view

**Features**:
- Fetch escrow by ID
- Display card with actions
- Auto-refresh on state change

---

### 4. **HistoryPage.tsx** ✅
User dashboard with stats and transaction history

**Features**:
- Statistics cards
- Transaction table
- Pagination
- Filtering

---

## Context & State Management

### 1. **NotificationContext.tsx** ✅
Global notification system

```typescript
const { addNotification, removeNotification } = useNotification()

// Usage:
addNotification({
  type: 'success',
  message: 'Escrow created!',
  duration: 3000,
})
```

---

### 2. **stores.ts** ✅
Zustand stores for global state

**useWalletStore**: Wallet connection state
**useEscrowStore**: Escrow data cache
**useUIStore**: Loading and error states

---

## Styling

### Utility Classes (Tailwind)

```css
/* Buttons */
.btn          /* Base button styles */
.btn-primary  /* Blue button */
.btn-secondary /* Gray button */

/* Cards */
.card         /* Card container */

/* Forms */
.input        /* Text input, textarea, select */
.error-message
.success-message
```

### Custom Theme

**Colors**:
- Primary Blue: #0ea5e9
- Secondary Cyan: #06b6d4
- Success Green: #10b981
- Error Red: #ef4444

---

## Component Checklist

- [x] WalletConnect
- [x] CreateEscrowForm
- [x] EscrowCard
- [x] EscrowDashboard
- [x] TransactionHistory
- [x] Layout
- [ ] DisputeModal (planned)
- [ ] TransactionDetails (planned)
- [ ] Analytics Dashboard (planned)

---

*Last Updated: 2024*
