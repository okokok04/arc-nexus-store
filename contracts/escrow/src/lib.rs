use soroban_sdk::{
    contract, contractimpl, Address, Env, String, Symbol, Vec, log, token,
    IntoVal, FromVal, Bytes,
};

mod error;
mod types;

use error::Error;
use types::{Escrow, EscrowState, Dispute};

const ESCROW_COUNT_KEY: &str = "escrow_count";
const ESCROW_PREFIX: &str = "escrow_";
const DISPUTE_COUNT_KEY: &str = "dispute_count";
const DISPUTE_PREFIX: &str = "dispute_";
const FEE_RATE: u32 = 100; // 1% = 100 basis points
const PLATFORM_WALLET: &str = "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW5QC6OX2H";

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Create a new escrow
    pub fn create_escrow(
        env: Env,
        buyer: Address,
        seller: Address,
        token: Address,
        amount: i128,
        expires_in: u64,
        description: String,
    ) -> Result<u64, Error> {
        buyer.require_auth();

        // Validate inputs
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        if buyer == seller {
            return Err(Error::BuyerSellerSame);
        }

        // Get next escrow ID
        let count: u64 = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, ESCROW_COUNT_KEY))
            .unwrap_or(0);

        let escrow_id = count + 1;
        let current_time = env.ledger().timestamp();
        let expire_time = current_time + expires_in;

        // Create escrow
        let escrow = Escrow {
            id: escrow_id,
            buyer: buyer.clone(),
            seller: seller.clone(),
            token: token.clone(),
            amount,
            state: EscrowState::Created,
            created_at: current_time,
            expires_at: expire_time,
            description: description.clone(),
        };

        // Store escrow
        let key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, escrow_id));
        env.storage().persistent().set(&key, &escrow);

        // Update count
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, ESCROW_COUNT_KEY), &escrow_id);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "EscrowCreated"), buyer, seller),
            (escrow_id, amount),
        );

        log!(&env, "Escrow created: ID={}, Amount={}", escrow_id, amount);

        Ok(escrow_id)
    }

    /// Get escrow details
    pub fn get_escrow(env: Env, escrow_id: u64) -> Result<Escrow, Error> {
        let key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, escrow_id));

        env.storage()
            .persistent()
            .get(&key)
            .ok_or(Error::EscrowNotFound)
    }

    /// Deposit funds into escrow (buyer deposits)
    pub fn deposit_funds(env: Env, escrow_id: u64) -> Result<(), Error> {
        let key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, escrow_id));

        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::EscrowNotFound)?;

        // Verify caller is buyer
        let caller = env.invoker();
        if caller != escrow.buyer {
            return Err(Error::NotBuyer);
        }

        // Verify state
        if escrow.state != EscrowState::Created {
            return Err(Error::InvalidState);
        }

        // Transfer funds from buyer to contract
        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &escrow.buyer,
            &env.current_contract_address(),
            &escrow.amount,
        );

        // Update escrow state
        escrow.state = EscrowState::Funded;
        env.storage().persistent().set(&key, &escrow);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "FundsDeposited"), escrow.buyer.clone()),
            escrow_id,
        );

        log!(&env, "Funds deposited for escrow: ID={}", escrow_id);

        Ok(())
    }

    /// Confirm delivery and release payment
    pub fn confirm_delivery(env: Env, escrow_id: u64) -> Result<(), Error> {
        let key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, escrow_id));

        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::EscrowNotFound)?;

        // Verify caller is buyer
        let caller = env.invoker();
        if caller != escrow.buyer {
            return Err(Error::NotBuyer);
        }

        // Verify state
        if escrow.state != EscrowState::Funded {
            return Err(Error::InvalidState);
        }

        // Calculate fee
        let fee = (escrow.amount * FEE_RATE as i128) / 10000;
        let seller_amount = escrow.amount - fee;

        // Transfer to seller
        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.seller,
            &seller_amount,
        );

        // Transfer fee to platform
        if fee > 0 {
            let platform = Address::from_contract_id(&env, &Bytes::from_slice(&env, PLATFORM_WALLET.as_bytes()));
            token_client.transfer(
                &env.current_contract_address(),
                &platform,
                &fee,
            );
        }

        // Update escrow state
        escrow.state = EscrowState::Completed;
        env.storage().persistent().set(&key, &escrow);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "PaymentReleased"), escrow.seller.clone()),
            (escrow_id, seller_amount),
        );

        log!(&env, "Payment released for escrow: ID={}, Amount={}", escrow_id, seller_amount);

        Ok(())
    }

    /// Request refund
    pub fn request_refund(env: Env, escrow_id: u64) -> Result<(), Error> {
        let key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, escrow_id));

        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::EscrowNotFound)?;

        // Verify caller is buyer or timeout reached
        let caller = env.invoker();
        let current_time = env.ledger().timestamp();

        if caller != escrow.buyer {
            // Only seller can trigger refund if timeout reached
            if current_time < escrow.expires_at {
                return Err(Error::NotBuyer);
            }
        }

        // Verify state
        if escrow.state != EscrowState::Funded {
            return Err(Error::InvalidState);
        }

        // Return funds to buyer
        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.buyer,
            &escrow.amount,
        );

        escrow.state = EscrowState::Refunded;
        env.storage().persistent().set(&key, &escrow);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "RefundIssued"), escrow.buyer.clone()),
            (escrow_id, escrow.amount),
        );

        log!(&env, "Refund issued for escrow: ID={}, Amount={}", escrow_id, escrow.amount);

        Ok(())
    }

    /// File a dispute
    pub fn file_dispute(env: Env, escrow_id: u64, reason: String) -> Result<u64, Error> {
        let escrow_key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, escrow_id));

        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&escrow_key)
            .ok_or(Error::EscrowNotFound)?;

        // Verify caller is buyer or seller
        let caller = env.invoker();
        if caller != escrow.buyer && caller != escrow.seller {
            return Err(Error::UnauthorizedDispute);
        }

        // Only funded escrows can be disputed
        if escrow.state != EscrowState::Funded {
            return Err(Error::InvalidState);
        }

        // Get next dispute ID
        let dispute_count: u64 = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, DISPUTE_COUNT_KEY))
            .unwrap_or(0);

        let dispute_id = dispute_count + 1;

        // Create dispute
        let dispute = Dispute {
            id: dispute_id,
            escrow_id,
            filer: caller.clone(),
            reason: reason.clone(),
            filed_at: env.ledger().timestamp(),
            status: 0, // Pending
        };

        // Store dispute
        let dispute_key = Symbol::new(&env, &format!("{}{}", DISPUTE_PREFIX, dispute_id));
        env.storage().persistent().set(&dispute_key, &dispute);

        // Update dispute count
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, DISPUTE_COUNT_KEY), &dispute_id);

        // Update escrow state
        escrow.state = EscrowState::Disputed;
        env.storage().persistent().set(&escrow_key, &escrow);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "DisputeFiled"), caller),
            (escrow_id, dispute_id, reason),
        );

        log!(&env, "Dispute filed: Dispute ID={}, Escrow ID={}", dispute_id, escrow_id);

        Ok(dispute_id)
    }

    /// Resolve dispute (admin only)
    pub fn resolve_dispute(
        env: Env,
        dispute_id: u64,
        resolution: u8, // 0 = refund buyer, 1 = release to seller
    ) -> Result<(), Error> {
        // TODO: Add admin authorization
        let dispute_key = Symbol::new(&env, &format!("{}{}", DISPUTE_PREFIX, dispute_id));

        let mut dispute: Dispute = env
            .storage()
            .persistent()
            .get(&dispute_key)
            .ok_or(Error::DisputeNotFound)?;

        let escrow_key = Symbol::new(&env, &format!("{}{}", ESCROW_PREFIX, dispute.escrow_id));
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&escrow_key)
            .ok_or(Error::EscrowNotFound)?;

        if escrow.state != EscrowState::Disputed {
            return Err(Error::InvalidState);
        }

        let token_client = token::Client::new(&env, &escrow.token);

        match resolution {
            0 => {
                // Refund buyer
                token_client.transfer(
                    &env.current_contract_address(),
                    &escrow.buyer,
                    &escrow.amount,
                );
                escrow.state = EscrowState::Refunded;
            }
            1 => {
                // Release to seller (with fee)
                let fee = (escrow.amount * FEE_RATE as i128) / 10000;
                let seller_amount = escrow.amount - fee;
                token_client.transfer(
                    &env.current_contract_address(),
                    &escrow.seller,
                    &seller_amount,
                );
                escrow.state = EscrowState::Completed;
            }
            _ => return Err(Error::InvalidResolution),
        }

        dispute.status = 1; // Resolved
        env.storage().persistent().set(&dispute_key, &dispute);
        env.storage().persistent().set(&escrow_key, &escrow);

        env.events().publish(
            (Symbol::new(&env, "DisputeResolved"), dispute_id),
            resolution,
        );

        Ok(())
    }

    /// Get dispute details
    pub fn get_dispute(env: Env, dispute_id: u64) -> Result<Dispute, Error> {
        let key = Symbol::new(&env, &format!("{}{}", DISPUTE_PREFIX, dispute_id));

        env.storage()
            .persistent()
            .get(&key)
            .ok_or(Error::DisputeNotFound)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::*, Env, String, Address};

    #[test]
    fn test_create_escrow() {
        let env = Env::default();
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);
        let token = Address::generate(&env);

        let result = EscrowContract::create_escrow(
            env,
            buyer,
            seller,
            token,
            1000,
            3600,
            String::from_slice(&env, "Test escrow"),
        );

        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 1);
    }

    #[test]
    fn test_invalid_amount() {
        let env = Env::default();
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);
        let token = Address::generate(&env);

        let result = EscrowContract::create_escrow(
            env,
            buyer,
            seller,
            token,
            0,
            3600,
            String::from_slice(&env, "Test escrow"),
        );

        assert!(result.is_err());
    }

    #[test]
    fn test_buyer_seller_same() {
        let env = Env::default();
        let addr = Address::generate(&env);
        let token = Address::generate(&env);

        let result = EscrowContract::create_escrow(
            env,
            addr.clone(),
            addr,
            token,
            1000,
            3600,
            String::from_slice(&env, "Test escrow"),
        );

        assert!(result.is_err());
    }

    #[test]
    fn test_get_escrow() {
        let env = Env::default();
        let buyer = Address::generate(&env);
        let seller = Address::generate(&env);
        let token = Address::generate(&env);

        let escrow_id = EscrowContract::create_escrow(
            env.clone(),
            buyer,
            seller,
            token,
            1000,
            3600,
            String::from_slice(&env, "Test escrow"),
        )
        .unwrap();

        let escrow = EscrowContract::get_escrow(env, escrow_id).unwrap();
        assert_eq!(escrow.id, escrow_id);
        assert_eq!(escrow.amount, 1000);
    }
}
