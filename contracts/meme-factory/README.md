[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)]( https://gitpod.io/)

# MemeCoin Factory Smart Contract

### 🏗️ Building

```sh
cargo build --release
```

Welcome to the MemeCoin Factory Smart Contract! This project is dedicated to creating and managing digital assets in the form of Memecoins, utilizing blockchain technology for secure and decentralized transactions.

## Overview

MemeCoin Factory allows users to create, mint, burn, transfer, and manage Memecoins. Each Memecoin is represented as a unique digital asset with its own characteristics such as name, symbol, and decimals.

## Actions

The contract defines the following actions that users can perform:

### CreateMeme
Allows a user to create a new meme with specific configurations.
- `init_config`: The initial configuration settings required to create a meme, detailed as follows:
  - `name`: The name of the meme.
  - `symbol`: A unique symbol representing the meme.
  - `decimals`: The number of decimals for the meme's token representation.
  - `description`: A brief description of the meme.
  - `external_links`: A collection of external links related to the meme, including:
    - `image`: An optional link to an image of the meme.
    - `website`: An optional link to a website associated with the meme.
    - `telegram`: An optional link to a Telegram group or channel for the meme.
    - `twitter`: An optional link to a Twitter page for the meme.
    - `discord`: An optional link to a Discord server for the meme.
  - `initial_supply`: The initial amount of tokens supplied for the meme.
  - `total_supply`: The total amount of tokens available for the meme.
  - `admin`: The `ActorId` of the meme's administrator.
  - `initial_capacity`: An optional parameter indicating the initial capacity.
  - `config`: Additional configuration settings specific to the meme, encapsulated within a `Config` struct that includes:
    - `tx_storage_period`: The period in which transactions related to this meme are stored, expressed in some unit of time.
    - `tx_payment`: The payment required for transactions related to this meme.

### CodeIdUpdate
Updates the `CodeId` of the contract. This action can only be performed by authorized administrators.
- `new_code_id`: The new `CodeId` to which the contract should be updated. This ID is critical for identifying the version or instance of the contract code in the blockchain.

### UpdateGasProgram
Updates the amount of gas used for the contract.
- `new_gas_amount`: The new gas amount to be used for the grc-20 contract. It's a crucial parameter to ensure that transactions are processed efficiently and without unnecessary cost.

### AddAdmin
Allows adding a new administrator to the contract. Only current administrators can add new ones.
- `admin_actor_id`: The `ActorId` of the new administrator being added to the contract. This allows the new admin to perform privileged operations on the contract.

## Events

The contract emits the following events in response to actions performed:

### MemeCreated
Emitted when a new meme has been successfully created. It includes identifiers and initial settings used for the meme creation.
- `meme_id`: The unique identifier for the newly created meme.
- `meme_address`: The blockchain address of the new meme, which can be used for transactions or queries.
- `init_config`: The initial configuration used for creating the meme, mirroring the details provided in the `CreateMeme` action.

### GasUpdatedSuccessfully
Indicates that the gas amount for the contract has been successfully updated. It includes details about the updater and the new gas settings.
- `updated_by`: The `ActorId` of the individual who performed the update.
- `new_gas_amount`: The new gas amount set for the gRC-20 contract.

### CodeIdUpdatedSuccessfully
Emitted when the `CodeId` has been successfully updated. It includes the updater's details and the new code identifier.
- `updated_by`: The `ActorId` of the individual who performed the update.
- `new_code_id`: The new `CodeId` to which the contract has been updated, crucial for contract versioning and identification.

### AdminAdded
Indicates that a new administrator has been added to the contract. It includes details about the updater and the new admin.
- `updated_by`: The `ActorId` of the existing administrator who added the new admin.
- `admin_actor_id`: The `ActorId` of the new administrator added to the contract, granting them privileged access.

### MemeRegistered
Emitted when a meme has been successfully registered in the contract, confirming the meme's successful creation and storage.

### MemeFailed
Emitted when the creation or registration of a meme has failed, alerting users and administrators to take necessary actions.

## Queries

The contract supports the following queries for retrieving information:

### MemeNumber
Requests the total number of memes created in the factory.

### MemeCodeId
Fetches the current `CodeId` of the contract, which identifies the version or instance of the contract code.

### FactoryAdminAccount
Retrieves a list of `ActorId`s representing the administrators of the Meme Factory.

### GasForProgram
Queries the current gas amount set for the contract's operations, important for transaction processing efficiency.

### IdToAddress
Maps meme IDs to their corresponding blockchain addresses, useful for transactions and interactions.

### Memecoins
Requests information about the memecoins associated with each actor and meme, including records of meme transactions and ownership.

## Query Replies

Responses to the above queries are structured as follows:

### MemeNumber
- `MemeId`: The unique identifier representing the total number of memes created.

### MemeCodeId
- `CodeId`: The current code identifier of the contract, indicating its version or instance.

### FactoryAdminAccount
- `Vec<ActorId>`: A vector of `ActorId`s representing the contract administrators, allowing identification and interaction with admin accounts.

### GasForProgram
- `u64`: The current gas amount configured for the contract's operations, reflecting the cost-efficiency of transactions.

### IdToAddress
- `Vec<(MemeId, ActorId)>`: A vector of tuples mapping each `MemeId` to its corresponding `ActorId` or blockchain address, facilitating meme identification and interaction.

### Memecoins
- `Vec<(ActorId, Vec<(MemeId, MemeRecord)>)>`: A nested vector structure where each `ActorId` is associated with a vector of tuples. Each tuple contains a `MemeId` and its corresponding `MemeRecord`, detailing the transactions and ownership of memecoins related to specific memes.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

