import { create } from 'zustand'

interface WalletStore {
  address: string | null
  balance: number
  isConnected: boolean
  network: 'testnet' | 'mainnet'
  setAddress: (address: string) => void
  setBalance: (balance: number) => void
  setConnected: (connected: boolean) => void
  setNetwork: (network: 'testnet' | 'mainnet') => void
  reset: () => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  balance: 0,
  isConnected: false,
  network: 'testnet',
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  setConnected: (connected) => set({ isConnected: connected }),
  setNetwork: (network) => set({ network }),
  reset: () =>
    set({
      address: null,
      balance: 0,
      isConnected: false,
      network: 'testnet',
    }),
}))

interface EscrowStore {
  escrows: any[]
  selectedEscrow: any | null
  setEscrows: (escrows: any[]) => void
  addEscrow: (escrow: any) => void
  updateEscrow: (id: number, escrow: any) => void
  setSelectedEscrow: (escrow: any | null) => void
}

export const useEscrowStore = create<EscrowStore>((set) => ({
  escrows: [],
  selectedEscrow: null,
  setEscrows: (escrows) => set({ escrows }),
  addEscrow: (escrow) => set((state) => ({ escrows: [...state.escrows, escrow] })),
  updateEscrow: (id, escrow) =>
    set((state) => ({
      escrows: state.escrows.map((e) => (e.id === id ? { ...e, ...escrow } : e)),
    })),
  setSelectedEscrow: (escrow) => set({ selectedEscrow: escrow }),
}))

interface UIStore {
  isLoading: boolean
  error: string | null
  success: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  error: null,
  success: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
}))
