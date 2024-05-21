[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)]( https://gitpod.io/)

# Fungible Token Smart Contract (gRC-20)

## Description

This smart contract is designed for the creation and management of a fungible token (gFT). It supports various standard operations such as minting, burning, transferring, and approving tokens, along with administrative functions to manage the contract.

## Actions

### TransferToUsers
Distributes a specified amount of tokens equally to a list of users.
- `amount`: Total amount of tokens to be distributed.
- `to_users`: List of `ActorId`s representing the recipients.

### Mint
Creates a specified amount of tokens and assigns them to a user.
- `amount`: Amount of tokens to be minted.
- `to`: `ActorId` of the recipient.

### Burn
Destroys a specified amount of tokens from the total supply.
- `amount`: Amount of tokens to be burned.

### Transfer
Transfers a specified amount of tokens from one user to another.
- `tx_id`: Optional transaction identifier.
- `from`: `ActorId` of the sender.
- `to`: `ActorId` of the recipient.
- `amount`: Amount of tokens to be transferred.

### Approve
Grants permission to another user to spend a specified amount of tokens on behalf of the sender.
- `tx_id`: Optional transaction identifier.
- `to`: `ActorId` of the authorized user.
- `amount`: Amount of tokens the authorized user is allowed to spend.

### BalanceOf
Queries the balance of a specified user.
- `ActorId`: The user whose balance is being queried.

### AddAdmin
Adds a new administrator to the contract.
- `admin_id`: `ActorId` of the new admin.

### DeleteAdmin
Removes an administrator from the contract.
- `admin_id`: `ActorId` of the admin to remove.

## Events (FTReply)

### Initialized
Indicates that the contract has been successfully initialized.

### TransferredToUsers
Indicates that tokens have been successfully transferred to multiple users.
- `from`: `ActorId` of the sender.
- `to_users`: List of `ActorId`s representing the recipients.
- `amount`: Amount of tokens distributed to each user.

### Transferred
Indicates a successful token transfer between two users.
- `from`: `ActorId` of the sender.
- `to`: `ActorId` of the recipient.
- `amount`: Amount of tokens transferred.

### Approved
Indicates that a token spending approval has been successfully granted.
- `from`: `ActorId` of the approver.
- `to`: `ActorId` of the authorized user.
- `amount`: Amount of tokens the authorized user is allowed to spend.

### AdminAdded
Indicates that a new administrator has been successfully added to the contract.
- `admin_id`: `ActorId` of the new admin.

### AdminRemoved
Indicates that an administrator has been successfully removed from the contract.
- `admin_id`: `ActorId` of the removed admin.

### Balance
Returns the balance of a specified user.
- `u128`: The token balance of the user.

## Queries

The contract supports a variety of queries to retrieve information about the token and its transactions:

### Name
Returns the name of the token.

### Symbol
Returns the symbol of the token.

### Decimals
Returns the decimal places used by the token.

### CurrentSupply
Returns the current supply of tokens in circulation.

### TotalSupply
Returns the maximum supply of tokens that can ever exist.

### Description
Returns a description of the token.

### ExternalLinks
Returns a collection of external links associated with the token, such as websites or social media profiles.

### BalanceOf
Returns the balance of a specified user.
- `ActorId`: The user whose balance is being queried.

### AllowanceOfAccount
Returns the allowance that one account has to another.
- `account`: The `ActorId` of the owner account.
- `approved_account`: The `ActorId` of the approved spender.

### Admins
Returns a list of administrators for the token contract.

### GetTxValidityTime
Returns the validity time of a transaction.
- `account`: The `ActorId` of the account in question.
- `tx_id`: The transaction identifier.

### GetTxIdsForAccount
Returns a list of transaction IDs associated with an account.
- `account`: The `ActorId` of the account in question.

## Query Replies

### Name
- `String`: The name of the token.

### Symbol
- `String`: The symbol of the token.

### Decimals
- `u8`: The number of decimal places used by the token.

### CurrentSupply
- `u128`: The current supply of tokens in circulation.

### TotalSupply
- `u128`: The maximum supply of tokens that can ever exist.

### Description
- `String`: A description of the token.

### ExternalLinks
- `ExternalLinks`: A struct containing a collection of external links associated with the token.

### Balance
- `u128`: The balance of the specified user.

### AllowanceOfAccount
- `u128`: The allowance that one account has to another.

### Admins
- `Vec<ActorId>`: A list of `ActorId`s representing the administrators of the token contract.

### TxValidityTime
- `ValidUntil`: The validity time of a specified transaction.

### TxIdsForAccount
- `tx_ids`: A list of transaction IDs associated with the specified account.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.