"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import { TransactionInsert } from "@/drizzle/schema";
import { createTransactionACTION } from "@/lib/actions/transaction.action";
import { Button } from "@nextui-org/react";
import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect, RedirectType, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
// import '../../../envConfig'

interface IProps {
  clientSecret: string;
  dpmLink: string;
}

const StripeForm: FC<IProps> = ({ clientSecret, dpmLink }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { transaction, setStep, submitDeliveryRef } = useBuyProductContext();
  const [message, setMessage] = useState<string>();
  const router = useRouter();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //////////////////////
    //  PATTERN STRIPE  //
    //////////////////////
    if (!stripe || !elements) {
      return;
    }
    const t = await elements.submit();

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/buy/success",
      },
      clientSecret,
      redirect: "if_required",
    });

    if (
      error &&
      (error.type === "card_error" || error.type === "validation_error")
    ) {
      setMessage(error.message);
      return;
    } else if (error) {
      setMessage("Une erreur s'est produite.");
      return;
    }

    if (!paymentIntent) {
      return;
    }

    //SI CA S'EST BIEN PASSE AVEC STRIPE, ON INSERT LA TRANSACTION DANS LA DB
    const trans = await createTransactionACTION(
      transaction as TransactionInsert,
      paymentIntent.id
    );

    //TODO : NOTIFIER LE VENDEUR

    //SI LA CREATION DANS LA DB EST OK, ON REDIRIGE
    if (trans) {
      setStep("success");
      router.push("/buy/success");
      // redirect('/buy/success', RedirectType.push);
    }
  };

  return (
    <form noValidate onSubmit={onSubmitHandler} className=" col-span-2">
      <PaymentElement
        id="payment-element"
        options={{ readOnly: false, layout: { type: "tabs" } }}
      />
      <button ref={submitDeliveryRef} type="submit" hidden></button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default StripeForm;
