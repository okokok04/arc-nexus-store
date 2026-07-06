use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum Error {
    InvalidAmount = 1,
    EscrowNotFound = 2,
    NotBuyer = 3,
    NotSeller = 4,
    InvalidState = 5,
    BuyerSellerSame = 6,
    UnauthorizedDispute = 7,
    EscrowExpired = 8,
    InsufficientFunds = 9,
    TransferFailed = 10,
    DisputeNotFound = 11,
    InvalidResolution = 12,
    Unauthorized = 13,
}
