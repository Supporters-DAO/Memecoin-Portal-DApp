[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)]( https://gitpod.io/)

# Fungible Token Smart Contract (gRC-20)

## Description

This smart contract is designed for the creation and management of a fungible token (gFT). It supports various standard operations such as minting, burning, transferring, and approving tokens, along with administrative functions to manage the contract.

## Actions

### TransferToUsers
Distributes a specified amount of tokens equally to a list of users.
- `value`: Total amount of tokens to be distributed.
- `to_users`: List of `ActorId`s representing the recipients.

### Mint
Creates a specified amount of tokens and assigns them to a user.
- `value`: Amount of tokens to be minted.
- `to`: `ActorId` of the recipient.

### Burn
Destroys a specified amount of tokens from the total supply.
- `from`: `ActorId`.
- `value`: Amount of tokens to be burned.

### Transfer
Transfers a specified amount of tokens from one user to another.
- `from`: `ActorId` of the sender.
- `to`: `ActorId` of the recipient.
- `value`: Amount of tokens to be transferred.

### Approve
Grants permission to another user to spend a specified amount of tokens on behalf of the sender.
- `to`: `ActorId` of the authorized user.
- `value`: Amount of tokens the authorized user is allowed to spend.


## Events (FTReply)

### TransferredToUsers
Indicates that tokens have been successfully transferred to multiple users.
- `from`: `ActorId` of the sender.
- `to_users`: List of `ActorId`s representing the recipients.
- `value`: Amount of tokens distributed to each user.

### Transferred
Indicates a successful token transfer between two users.
- `from`: `ActorId` of the sender.
- `to`: `ActorId` of the recipient.
- `value`: Amount of tokens transferred.

### Approved
Indicates that a token spending approval has been successfully granted.
- `from`: `ActorId` of the approver.
- `to`: `ActorId` of the authorized user.
- `value`: Amount of tokens the authorized user is allowed to spend.

### Minted
Indicates a successful token mint.
- `to`: `ActorId` of the recipient.
- `value`: Amount of tokens transferred.

### Burned
Indicates a successful token burn.
- `from`: `ActorId` of the sender.
- `value`: Amount of tokens transferred.

## Queries

The contract supports a variety of queries to retrieve information about the token and its transactions:

### Name
Returns the name of the token.

### Symbol
Returns the symbol of the token.

### Decimals
Returns the decimal places used by the token.

### TotalSupply
Returns the current supply of tokens that can ever exist.

### Description
Returns a description of the token.

### ExternalLinks
Returns a collection of external links associated with the token, such as websites or social media profiles.

### BalanceOf
Returns the balance of a specified user.
- `ActorId`: The user whose balance is being queried.

### Allowance
Returns the allowance that one account has to another.
- `owner`: The `ActorId` of the owner account.
- `spender`: The `ActorId` of the approved spender.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
