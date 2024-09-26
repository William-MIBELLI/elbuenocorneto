"use client";
import { UserTransactions } from "@/lib/requests/transaction.request";
import {
  Checkbox,
  Divider,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";
import React, { FC, useEffect, useRef, useState } from "react";
import TransactionItem from "./TransactionItem";

interface IProps {
  transactions: UserTransactions;
  userId: string;
}

const TransactionDisplayer: FC<IProps> = ({ transactions, userId }) => {
  const [tab, setTab] = useState<"achat" | "vente">("vente");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [transToDisplay, setTransToDisplay] = useState<UserTransactions>();

  useEffect(() => {

    //1ER FILTRE SELON LA NATURE DE LA TRANSACTION : ACHAT OU VENTE
    const filtered = transactions.filter((item) => {
      return tab === "achat"
        ? item.userId === userId
        : item.sellerId === userId;
    });

    //2ND FILTRE SELON L'ETAT DE LA TRANSACTION
    const finalFilter = filtered.filter((item) => {
      switch (filter) {
        case "active": {
          if (item.status === "CREATED" || item.status === "ACCEPTED") {
            return item;
          }
          return;
        }
        case "done": {
          if (
            item.status === "CANCELED" ||
            item.status === "DONE"
          ) {
            return item;
          }
          return;
        }
        case "all":
          return item;
        default:
          return;
      }
    });
    setTransToDisplay((prev) => finalFilter);
  }, [tab, transactions, filter]);

  return (
    <div className="w-full my-4">
      {/* TABS */}
      <div className="flex justify-center mb-3">
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

      {/* FILTERS */}
      <div className="my-4 flex flex-col items-end text-sm">
        <RadioGroup
          onValueChange={(value) => setFilter(value as typeof filter)}
          value={filter}
          orientation="horizontal"
          size="sm"
        >
          <Radio value={"all"}>Toutes</Radio>
          <Radio value={"active"}>Actives</Radio>
          <Radio value={"done"}>Cloturées</Radio>
        </RadioGroup>
        <Divider className="my-2" />
      </div>

      {transToDisplay ? (
        transToDisplay.map((t) => (
          <TransactionItem transaction={t} key={t.id} />
        ))
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default TransactionDisplayer;
