declare global {
  interface Window {
    freighter?: {
      isConnected(): Promise<boolean>
      getPublicKey(): Promise<string>
      signTransaction(
        tx: string,
        opts?: {
          network?: string
          accountToSign?: string
        },
      ): Promise<string>
      signAuthEntry(entry: string): Promise<string>
      isAllowed(): Promise<boolean>
      setAllowed(isAllowed: boolean): Promise<void>
    }
  }
}

/**
 * Checks if Freighter wallet is available
 */
export function isFreighterAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.freighter
}

/**
 * Gets the public key from Freighter wallet
 */
export async function getPublicKey(): Promise<string> {
  if (!isFreighterAvailable()) {
    throw new Error('Freighter wallet is not installed')
  }

  try {
    const publicKey = await window.freighter!.getPublicKey()
    return publicKey
  } catch (error) {
    throw new Error(`Failed to get public key from Freighter: ${error}`)
  }
}

/**
 * Signs a transaction with Freighter wallet
 */
export async function signTransaction(
  tx: string,
  options?: {
    network?: string
    accountToSign?: string
  },
): Promise<string> {
  if (!isFreighterAvailable()) {
    throw new Error('Freighter wallet is not installed')
  }

  try {
    const signedTx = await window.freighter!.signTransaction(tx, {
      network: options?.network || 'TESTNET_NETWORK_PASSPHRASE',
      accountToSign: options?.accountToSign,
    })
    return signedTx
  } catch (error) {
    throw new Error(`Failed to sign transaction with Freighter: ${error}`)
  }
}

/**
 * Signs an authorization entry with Freighter wallet
 */
export async function signAuthEntry(entry: string): Promise<string> {
  if (!isFreighterAvailable()) {
    throw new Error('Freighter wallet is not installed')
  }

  try {
    const signedEntry = await window.freighter!.signAuthEntry(entry)
    return signedEntry
  } catch (error) {
    throw new Error(`Failed to sign auth entry with Freighter: ${error}`)
  }
}

/**
 * Checks if Freighter is connected to the current site
 */
export async function isConnected(): Promise<boolean> {
  if (!isFreighterAvailable()) {
    return false
  }

  try {
    return await window.freighter!.isConnected()
  } catch (error) {
    console.error('Failed to check Freighter connection:', error)
    return false
  }
}

/**
 * Checks if current site is allowed to interact with Freighter
 */
export async function isAllowed(): Promise<boolean> {
  if (!isFreighterAvailable()) {
    return false
  }

  try {
    return await window.freighter!.isAllowed()
  } catch (error) {
    console.error('Failed to check Freighter allowance:', error)
    return false
  }
}

/**
 * Sets whether current site is allowed to interact with Freighter
 */
export async function setAllowed(isAllowed: boolean): Promise<void> {
  if (!isFreighterAvailable()) {
    throw new Error('Freighter wallet is not installed')
  }

  try {
    await window.freighter!.setAllowed(isAllowed)
  } catch (error) {
    throw new Error(`Failed to set Freighter allowance: ${error}`)
  }
}
