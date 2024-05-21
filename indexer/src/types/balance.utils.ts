import { AccountBalance } from "../model";

export function deductBalance(balance: AccountBalance, amount: bigint): void {
  balance.balance -= amount;
  if (balance.balance < BigInt(0)) {
    balance.balance = BigInt(0);
  }
}
