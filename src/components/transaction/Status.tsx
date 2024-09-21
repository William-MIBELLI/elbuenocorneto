import { TransactionStatusEnum } from "@/drizzle/schema";
import React, { FC, useEffect, useState } from "react";

interface IProps {
  status: (typeof TransactionStatusEnum.enumValues)[number];
}

const statusLabel: Record<(typeof TransactionStatusEnum.enumValues)[number], string> = {
  "ACCEPTED": 'Validée',
  "CANCELED": 'Annulée',
  'CREATED': 'En attente de validation',
  'DECLINED': 'Refusée',
  "DONE": 'Terminée',
  "REFUNDED": 'Remboursée'
}

const Status: FC<IProps> = ({ status }) => {

  const [bgColor, setBgColor] = useState<string>();
  const getBgColor = () => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-400';
      case 'CANCELED':
      case 'DECLINED':
        return 'bg-red-400'
      case 'CREATED':
      case 'DONE':
        return 'bg-blue-400';
      case 'REFUNDED':
        return 'bg-orange-400';
      default:
        return 'bg-blue-400';
    }
  }

  useEffect(() => {
    const color = getBgColor();
    setBgColor(color);
  }, [status]);

  return (
    <div className="flex gap-1 items-center justify-end">
      <p className="font-semibold text-sm">Status : </p>
      <p className={`text-white px-2 text-xs rounded-lg ${bgColor}`}>
        {statusLabel[status]}
      </p>
    </div>
  );
};

export default Status;
