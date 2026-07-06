// Type definitions for Escrow domain
export interface Escrow {
  id: number
  buyer: string
  seller: string
  amount: number
  state: EscrowState
  createdAt: number
  expiresAt: number
  description: string
  assetId: string
}

export enum EscrowState {
  Created = 0,
  Funded = 1,
  Completed = 2,
  Refunded = 3,
  Disputed = 4,
}

export interface Transaction {
  id: string
  escrowId: number
  type: 'create' | 'deposit' | 'release' | 'refund' | 'dispute'
  amount: number
  timestamp: number
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface Dispute {
  id: number
  escrowId: number
  filer: string
  reason: string
  evidence: string[]
  status: 'filed' | 'resolved' | 'closed'
  resolution?: string
  filedAt: number
}

export interface WalletState {
  address: string | null
  balance: number
  isConnected: boolean
  network: 'testnet' | 'mainnet'
}
