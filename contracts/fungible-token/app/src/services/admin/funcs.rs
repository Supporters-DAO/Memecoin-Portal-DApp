use crate::admin::{
    storage::AdditionalMeta,
    utils::{Error, Result},
};
use crate::services::erc20::{
    funcs,
    utils::{AllowancesMap, BalancesMap, NonZeroU256},
};
use gstd::{prelude::*, ActorId};
use primitive_types::U256;

pub fn mint(
    balances: &mut BalancesMap,
    meta: &AdditionalMeta,
    total_supply: &mut U256,
    to: ActorId,
    value: U256,
) -> Result<bool> {
    if value.is_zero() {
        return Ok(false);
    }

    let new_total_supply = total_supply
        .checked_add(value)
        .ok_or(Error::NumericOverflow)?;
    if new_total_supply <= meta.max_supply {
        let new_to = funcs::balance_of(balances, to)
            .checked_add(value)
            .ok_or(Error::NumericOverflow)?;

        let Ok(non_zero_new_to) = new_to.try_into() else {
            unreachable!("Infallible since fn is noop on zero value; qed");
        };

        balances.insert(to, non_zero_new_to);
    } else {
        return Err(Error::MaxSupplyReached);
    }

    Ok(true)
}

pub fn burn(balances: &mut BalancesMap, from: ActorId, value: U256) -> Result<bool> {
    if value.is_zero() {
        return Ok(false);
    }

    let new_from = funcs::balance_of(balances, from)
        .checked_sub(value)
        .ok_or(Error::InsufficientBalance)?;

    if let Ok(non_zero_new_from) = new_from.try_into() {
        balances.insert(from, non_zero_new_from);
    } else {
        balances.remove(&from);
    }

    Ok(true)
}

pub fn transfer_to_users(
    balances: &mut BalancesMap,
    from: ActorId,
    to: Vec<ActorId>,
    value: U256,
) -> Result<bool> {
    if value.is_zero() {
        return Ok(false);
    }

    let new_from = funcs::balance_of(balances, from)
        .checked_sub(value * to.len())
        .ok_or(Error::InsufficientBalance)?;

    for user_id in to.clone() {
        let new_to = funcs::balance_of(balances, user_id)
            .checked_add(value)
            .ok_or(Error::NumericOverflow)?;

        let Ok(non_zero_new_to) = new_to.try_into() else {
            unreachable!("Infallible since fn is noop on zero value; qed");
        };

        balances.insert(user_id, non_zero_new_to);
    }

    if let Ok(non_zero_new_from) = new_from.try_into() {
        balances.insert(from, non_zero_new_from);
    } else {
        balances.remove(&from);
    }

    Ok(true)
}

pub fn maps_data(
    allowances: &AllowancesMap,
    balances: &BalancesMap,
) -> ((usize, usize), (usize, usize)) {
    (
        (allowances.len(), allowances.capacity()),
        (balances.len(), balances.capacity()),
    )
}

pub fn allowances_reserve(allowances: &mut AllowancesMap, additional: usize) {
    allowances.reserve(additional)
}

pub fn balances_reserve(balances: &mut BalancesMap, additional: usize) {
    balances.reserve(additional)
}

pub fn allowances(
    allowances: &AllowancesMap,
    skip: usize,
    take: usize,
) -> Vec<((ActorId, ActorId), NonZeroU256)> {
    allowances
        .iter()
        .skip(skip)
        .take(take)
        .map(|(&(id1, id2), &v)| ((id1, id2), v))
        .collect()
}

pub fn balances(balances: &BalancesMap, skip: usize, take: usize) -> Vec<(ActorId, NonZeroU256)> {
    balances
        .iter()
        .skip(skip)
        .take(take)
        .map(|(&id, &v)| (id, v))
        .collect()
}
