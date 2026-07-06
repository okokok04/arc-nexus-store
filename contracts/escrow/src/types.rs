use soroban_sdk::{Address, String, contracttype};

#[derive(Clone)]
#[contracttype]
pub struct Escrow {
    pub id: u64,
    pub buyer: Address,
    pub seller: Address,
    pub token: Address,
    pub amount: i128,
    pub state: EscrowState,
    pub created_at: u64,
    pub expires_at: u64,
    pub description: String,
}

#[derive(Clone)]
#[contracttype]
pub struct Dispute {
    pub id: u64,
    pub escrow_id: u64,
    pub filer: Address,
    pub reason: String,
    pub filed_at: u64,
    pub status: u8, // 0 = pending, 1 = resolved
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[contracttype]
pub enum EscrowState {
    Created = 0,
    Funded = 1,
    Completed = 2,
    Refunded = 3,
    Disputed = 4,
}
