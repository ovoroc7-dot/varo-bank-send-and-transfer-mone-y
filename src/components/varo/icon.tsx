import addCash from "@/assets/varo/add-cash.png.asset.json";
import advance from "@/assets/varo/advance.png.asset.json";
import applePay from "@/assets/varo/apple-pay.png.asset.json";
import bankAccount from "@/assets/varo/bank-account.png.asset.json";
import bankTransfer from "@/assets/varo/bank-transfer.png.asset.json";
import believeCard from "@/assets/varo/believe-card.png.asset.json";
import cashapp from "@/assets/varo/cashapp.png.asset.json";
import depositCash from "@/assets/varo/deposit-cash.png.asset.json";
import depositCheck from "@/assets/varo/deposit-check.png.asset.json";
import directDeposit from "@/assets/varo/direct-deposit.png.asset.json";
import findAtm from "@/assets/varo/find-atm.png.asset.json";
import fundInstantly from "@/assets/varo/fund-instantly.png.asset.json";
import gasCar from "@/assets/varo/gas-car.png.asset.json";
import inviteHands from "@/assets/varo/invite-hands.png.asset.json";
import lineCredit from "@/assets/varo/line-credit.png.asset.json";
import linkAccounts from "@/assets/varo/link-accounts.png.asset.json";
import lockMoney from "@/assets/varo/lock-money.png.asset.json";
import manageBills from "@/assets/varo/manage-bills.png.asset.json";
import papaJohns from "@/assets/varo/papa-johns.png.asset.json";
import promoCash from "@/assets/varo/promo-cash.png.asset.json";
import savingsBag from "@/assets/varo/savings-bag.png.asset.json";
import sonic from "@/assets/varo/sonic.png.asset.json";
import transactionHistory from "@/assets/varo/transaction-history.png.asset.json";
import transfer from "@/assets/varo/transfer.png.asset.json";
import varoAnyone from "@/assets/varo/varo-anyone.png.asset.json";
import zelle from "@/assets/varo/zelle.png.asset.json";

export const art = {
  addCash,
  advance,
  applePay,
  bankAccount,
  bankTransfer,
  believeCard,
  cashapp,
  depositCash,
  depositCheck,
  directDeposit,
  findAtm,
  fundInstantly,
  gasCar,
  inviteHands,
  lineCredit,
  linkAccounts,
  lockMoney,
  manageBills,
  papaJohns,
  promoCash,
  savingsBag,
  sonic,
  transactionHistory,
  transfer,
  varoAnyone,
  zelle,
} as const;

export type ArtKey = keyof typeof art;

export function Art({
  name,
  size = 44,
  className = "",
}: {
  name: ArtKey;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={art[name].url}
      alt=""
      aria-hidden
      style={{ width: size, height: size }}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
