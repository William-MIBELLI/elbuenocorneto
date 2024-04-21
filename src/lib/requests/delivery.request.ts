import { DeliveryType, deliveryList } from "@/interfaces/IDelivery";

export const getDeliveryByType = (type: DeliveryType) => {
  const item = deliveryList.find(del => del.type === type);
  return item
}