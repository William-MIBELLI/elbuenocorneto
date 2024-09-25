"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import { TransactionInsert } from "@/drizzle/schema";
import { reserveProductACTION } from "@/lib/actions/product.action";
import { createTransactionACTION } from "@/lib/actions/transaction.action";
import { Spinner } from "@nextui-org/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { AnyARecord } from "dns";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
// import '../../../envConfig'

interface IProps {
  clientSecret: string;
  dpmLink: string;
}

const StripeForm: FC<IProps> = ({ clientSecret, dpmLink }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    transaction,
    setStep,
    submitDeliveryRef,
    product,
    setLoading,
    setTransaction,
  } = useBuyProductContext();
  const [message, setMessage] = useState<string>();
  const router = useRouter();

  if (!product || !transaction) {
    return <Spinner />;
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //////////////////////
    //  PATTERN STRIPE  //
    //////////////////////
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    try {
      //ON SUBMIT LES ELEMENTS
      const t = await elements.submit();

      //ON UPDATE LE PRODUCT EN PASSANT ISRESERVED A TRUE pour
      //EVITER QUE 2 USERS PUISSENT L'ACHETER EN MEME TEMPS
      const res = await reserveProductACTION(product.id, true);

      if (!res) {
        setMessage("Impossible de réserver cette annonce");
        return;
      }

      //ON CALL STRIPE
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/buy/success",
        },
        clientSecret,
        redirect: "if_required",
      });

      //AVANT DE TRAITER LES ERREURS SI IL Y EN A OU SI PAS DE PAYMENT
      //ON REPASSE LE PRODUCT A ISRESERVED === FALSE POUR QU'IL SOIT DISPONIBLE
      if (error || !paymentIntent) {
        await reserveProductACTION(product.id, false);
      }

      //SI ON A UNE ERREUR, ON L'AFFICHE A L'USER
      if (
        error &&
        (error.type === "card_error" || error.type === "validation_error")
      ) {
        setMessage(error.message);
        return;
      } else if (error) {
        console.log('ERROR DANS STRIPE : ', error);
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

      //SI LA CREATION DANS LA DB EST OK, ON REDIRIGE
      if (trans) {
        //ON UPDATE LA TRANSACTION DANS LE CONTEXT
        setTransaction(trans);

        //ON UPDATE LE STEP
        setStep("success");

        //ON INVALIDE LE PATH DU PRODUCT
        console.log("PATH INVALIDE");

        //ON REPLACE L'URL VERS SUCCESS
        //POUR EMPECHER L'USER DE BACK SUR LA PAGE PAYMENT
        router.replace("/buy/success");
      }
    } catch (error: any) {
      console.log("ERROR ONSUBMIT HANDLER : ", error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form noValidate onSubmit={onSubmitHandler} className=" col-span-2">
      <PaymentElement
        id="payment-element"
        options={{ readOnly: false, layout: { type: "tabs" } }}
      />
      <button ref={submitDeliveryRef} type="submit" hidden></button>
      {message && <p className="tetx-center text-sm text-red-500 font-semibold">{message}</p>}
    </form>
  );
};

export default StripeForm;
