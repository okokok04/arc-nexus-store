import { submitTransaction, getContractData } from './soroban'
import { signTransaction } from './freighter'
import { Escrow, EscrowState } from '@types/index'

const CONTRACT_ID = import.meta.env.VITE_ESCROW_CONTRACT_ID || ''

export async function createEscrow(
  buyer: string,
  seller: string,
  amount: number,
  expiresIn: number,
  description: string,
  tokenType: string,
): Promise<string> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    // Placeholder: will be implemented with soroban-js SDK
    console.log('Creating escrow:', { buyer, seller, amount, expiresIn, description, tokenType })

    // This would create the actual transaction
    const txResult = await submitTransaction('create_escrow_tx')
    return txResult
  } catch (error) {
    throw new Error(`Failed to create escrow: ${error}`)
  }
}

export async function depositFunds(escrowId: number): Promise<string> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    // TODO: Build and submit deposit_funds transaction
    const txResult = await submitTransaction('deposit_funds_tx')
    return txResult
  } catch (error) {
    throw new Error(`Failed to deposit funds: ${error}`)
  }
}

export async function confirmDelivery(escrowId: number): Promise<string> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    // TODO: Build and submit confirm_delivery transaction
    const txResult = await submitTransaction('confirm_delivery_tx')
    return txResult
  } catch (error) {
    throw new Error(`Failed to confirm delivery: ${error}`)
  }
}

export async function requestRefund(escrowId: number): Promise<string> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    // TODO: Build and submit request_refund transaction
    const txResult = await submitTransaction('request_refund_tx')
    return txResult
  } catch (error) {
    throw new Error(`Failed to request refund: ${error}`)
  }
}

export async function fileDispute(escrowId: number, reason: string): Promise<number> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    // TODO: Build and submit file_dispute transaction
    const txResult = await submitTransaction('file_dispute_tx')
    return 0 // TODO: Extract dispute ID from result
  } catch (error) {
    throw new Error(`Failed to file dispute: ${error}`)
  }
}

export async function getEscrow(escrowId: number): Promise<Escrow> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    const data = await getContractData(`escrow_${escrowId}`)
    return parseEscrow(data)
  } catch (error) {
    throw new Error(`Failed to fetch escrow: ${error}`)
  }
}

export async function getAllEscrows(): Promise<Escrow[]> {
  if (!CONTRACT_ID) {
    throw new Error('Contract ID not configured')
  }

  try {
    // TODO: Query all escrows from contract state
    return []
  } catch (error) {
    throw new Error(`Failed to fetch escrows: ${error}`)
  }
}

function parseEscrow(data: any): Escrow {
  return {
    id: data.id || 0,
    buyer: data.buyer || '',
    seller: data.seller || '',
    amount: data.amount || 0,
    state: (data.state || 0) as EscrowState,
    createdAt: data.created_at || 0,
    expiresAt: data.expires_at || 0,
    description: data.description || '',
  }
}
