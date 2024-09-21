"use client";
import { UserTransactions } from "@/lib/requests/transaction.request";
import { Divider, Spinner } from "@nextui-org/react";
import React, { FC, useEffect, useRef, useState } from "react";
import TransactionItem from "./TransactionItem";

interface IProps {
  transactions: UserTransactions;
  userId: string;
}

const TransactionDisplayer: FC<IProps> = ({ transactions, userId }) => {
  const [tab, setTab] = useState<"achat" | "vente">("vente");
  const [transToDisplay, setTransToDisplay] = useState<UserTransactions>();

  useEffect(() => {
    const filtered = transactions.filter((item) =>
      tab === "achat"
        ? item.userId === userId
        : item.sellerId === userId
    );
    setTransToDisplay(prev => filtered);
  }, [tab, transactions]);

  useEffect(() => {
    console.log('TRANSDISPLAY LENGTH : ', transToDisplay?.length);
  },[transToDisplay])

  return (
    <div className="w-full my-4">
      {/* TABS */}
      <div className="flex justify-center mb-10">
        <div
          onClick={() => setTab("vente")}
          className={`${
            tab === "vente"
              ? "border-b-2 border-main cursor-default"
              : "cursor-pointer hover:bg-gray-50 transition-all"
          } w-fit px-2 `}
        >
          Vente
        </div>
        <div
          onClick={() => setTab("achat")}
          className={`${
            tab === "achat"
              ? "border-b-2 border-main cursor-default"
              : "cursor-pointer hover:bg-gray-50 transition-all"
          } w-fit px-2 `}
        >
          Achat
        </div>
      </div>
      {transToDisplay ? transToDisplay.map((t) => (
        <TransactionItem transaction={t} key={t.id}/>
      )) : (
          <Spinner/>
      )}
    </div>
  );
};

export default TransactionDisplayer;
