"use client";
import {
  deliveriesEnum,
  LocationInsert,
  TransactionInsert,
} from "@/drizzle/schema";
import { IPickerShop } from "@/interfaces/ILocation";
import { Details } from "@/interfaces/IProducts";
import { getServicePoints } from "@/lib/requests/sendCloud.request";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Delivery =
  | (typeof deliveriesEnum.enumValues)[number]
  | "hand_delivery";

const useBuyProductContextValue = () => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<Delivery>("hand_delivery");
  const [totalPrice, setTotalPrice] = useState<number>();
  const [protectionCost, setProtectionCost] = useState<number>();
  const [product, setProduct] = useState<Details>();
  const [transaction, setTransaction] = useState<TransactionInsert>();
  const [step, setStep] = useState<"delivery" | "payment" | 'success'>("delivery");
  const [location, setLocation] = useState<LocationInsert>();
  const [pickers, setPickers] = useState<IPickerShop[]>();
  const [selectedPicker, setSelectedPicker] = useState<IPickerShop>();
  const [loadingPickers, setLoadingPickers] = useState<boolean>(false);
  const [displayPickersList, setDisplayPickersList] = useState<boolean>(true);

  const submitDeliveryRef = useRef<HTMLButtonElement>(null);
  const personalInfoRef = useRef<HTMLDivElement>(null);

  //FETCH LA LISTE DES PICKERS
  const getSc = async () => {
    setLoadingPickers(true)
    const services = await getServicePoints(
      location as Required<LocationInsert>,
      selectedDeliveryMethod
    );
    setPickers(services);
    setLoadingPickers(false);
    setDisplayPickersList(true);
  };


  //CALCUL DU COUT DE LA PROTECTION
  useEffect(() => {
    if (product) {
      setProtectionCost(Math.floor(product.price * 0.025) || 1);
    }
  }, [product]);

  useEffect(() => {
    console.log("TRANSACTION DANS LE CONTEXT : ", transaction);
  }, [transaction]);

  //CALCUL DU TOTAL
  useEffect(() => {
    let total = 0;
    if (product) {
      total += product.price;
    }
    if (protectionCost) {
      total += protectionCost;
    }
    if (selectedDeliveryMethod && selectedDeliveryMethod !== "hand_delivery") {
      const del = product?.pdl.find(
        (item) => item.delivery.type === selectedDeliveryMethod
      );
      if (del) {
        total += parseFloat(del.delivery.price);
      }
    }
    setTotalPrice(total);
  }, [product, protectionCost, selectedDeliveryMethod]);

  //FETCH LES PICKERS AUTOUR DE LA LOCATION SELECTIONNEE 
  //ET REFETCH SI L'USER CHANGE DE DELIVERY METHOD
  useEffect(() => {
    if (location) {
      getSc();
    }
    setSelectedPicker(undefined);
  }, [location, selectedDeliveryMethod]);

  useEffect(() => {
    console.log('SELECTED PICKER : ', selectedPicker);
  },[selectedPicker])


  return {
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    totalPrice,
    setTotalPrice,
    protectionCost,
    setProtectionCost,
    product,
    setProduct,
    step,
    setStep,
    submitDeliveryRef,
    transaction,
    setTransaction,
    location,
    setLocation,
    pickers,
    setPickers,
    selectedPicker,
    setSelectedPicker,
    loadingPickers,
    setLoadingPickers,
    displayPickersList,
    setDisplayPickersList,
    personalInfoRef
  };
};

const BuyProductContext = createContext<
  ReturnType<typeof useBuyProductContextValue>
>({} as ReturnType<typeof useBuyProductContextValue>);

interface IProps {
  children: React.ReactNode;
}

export const BuyProductProvider: FC<IProps> = ({ children }) => {
  const value = useBuyProductContextValue();

  return (
    <BuyProductContext.Provider value={value}>
      {children}
    </BuyProductContext.Provider>
  );
};

export const useBuyProductContext = () => useContext(BuyProductContext);
