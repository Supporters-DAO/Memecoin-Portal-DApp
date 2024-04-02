[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)]( https://gitpod.io/new/#https://github.com/A-mont/MemeFactoryPortalContracts.git)

# MemeCoin Factory Smart Contracts

### 🏗️ Building

```sh
cargo build --release
```

Welcome to the MemeCoin Factory Smart Contracts repository! This project is dedicated to creating and managing digital assets in the form of Memecoins, utilizing blockchain technology for secure and decentralized transactions.

## Overview

MemeCoin Factory allows users to create, mint, burn, transfer, and manage Memecoins. Each Memecoin is represented as a unique digital asset with its own characteristics such as name, symbol, and decimals.

## Contract Actions

The smart contract includes several actions that can be performed by users:

### `CreateMeme`

- **Description**: Creates a new MemeCoin with specified attributes.
- **Parameters**:
  - `name`: The name of the MemeCoin.
  - `symbol`: A unique symbol to represent the MemeCoin.
  - `decimals`: The number of decimal places the MemeCoin can be divided into.
  - `admin`: The initial administrator's ActorId.
  - `image`: A link to an image representing the MemeCoin.

### `MintMeme`

- **Description**: Mints new units of a specific MemeCoin.
- **Parameters**:
  - `amount`: The quantity of MemeCoin to mint.
  - `to`: The ActorId receiving the newly minted MemeCoin.
  - `meme_id`: The identifier of the MemeCoin to mint.

### `BurnMeme`

- **Description**: Burns (destroys) units of a specific MemeCoin.
- **Parameters**:
  - `amount`: The quantity of MemeCoin to burn.
  - `from`: The ActorId from whose balance the MemeCoins will be burnt.
  - `meme_id`: The identifier of the MemeCoin to burn.

### `TransferMeme`

- **Description**: Transfers MemeCoins from one account to another.
- **Parameters**:
  - `from`: The ActorId of the sender.
  - `to`: The ActorId of the receiver.
  - `amount`: The quantity of MemeCoin to transfer.
  - `meme_id`: The identifier of the MemeCoin to transfer.

### `ApproveMeme`

- **Description**: Approves another account to withdraw a specified amount of MemeCoins from the caller's account.
- **Parameters**:
  - `to`: The ActorId authorized to withdraw MemeCoins.
  - `amount`: The maximum amount they are authorized to withdraw.
  - `meme_id`: The identifier of the MemeCoin for which the approval is given.

### `AddAdmin`

- **Description**: Adds a new administrator to a specific MemeCoin.
- **Parameters**:
  - `meme_id`: The identifier of the MemeCoin.
  - `admin_actor_id`: The ActorId to be added as an administrator.

## Events

The `MemeFactory` smart contract emits events to signal the outcome of various actions. These events are crucial for tracking the state changes on the blockchain and can be listened to by applications to trigger corresponding reactions.

### `MemeFactoryEvent` Enum

This enum defines the possible events that the `MemeFactory` contract can emit:

#### `MemeCreated`

- **Description**: Emitted when a new MemeCoin is successfully created.
- **Parameters**:
  - `meme_id`: The unique identifier of the newly created MemeCoin.
  - `meme_address`: The `ActorId` representing the address of the new MemeCoin.

#### `TokensMinted`

- **Description**: Indicates that a certain amount of tokens has been minted.
- **Parameters**:
  - `amount`: The amount of tokens minted.
  - `actor_id`: The `ActorId` of the recipient of the minted tokens.

#### `TokensBurned`

- **Description**: Signals that a certain amount of tokens has been burned.
- **Parameters**:
  - `amount`: The amount of tokens burned.
  - `actor_id`: The `ActorId` from whose balance the tokens were burned.

#### `TokensTransferred`

- **Description**: Notifies that tokens have been transferred from one account to another.
- **Parameters**:
  - `amount`: The amount of tokens transferred.
  - `from_actor_id`: The `ActorId` of the sender.
  - `to_actor_id`: The `ActorId` of the receiver.

#### `TokensApproved`

- **Description**: Emitted when a token allowance is set by an approver.
- **Parameters**:
  - `amount`: The amount of tokens approved.
  - `approver_actor_id`: The `ActorId` of the approver.
  - `to_actor_id`: The `ActorId` of the authorized spender.

#### `MemeRegistered`

- **Description**: Announces the registration of a new MemeCoin.

#### `MemeFailed`

- **Description**: Indicates that an attempted action on a MemeCoin has failed.

#### `AdminAdded`

- **Description**: Emitted when a new administrator is added to a MemeCoin.

---

These events are integral to the MemeCoin Factory ecosystem, providing visibility and transparency into the operations conducted within the smart contract.


# License

The source code is licensed under the MIT license.

##

<h4>
<p align="center" nowrap>
 •
    <a href="https://wiki.gear-tech.io/" nowrap>
       Developers guide (Wiki)
    </a> •
    <a href="https://idea.gear-tech.io/">
      Upload program to Vara Network
    </a> •
        <a href="https://vara-network.io/news">
      News
    </a> •
    <a href="https://vara-network.io/events">
      Events
    </a> •
</p>
</h4>