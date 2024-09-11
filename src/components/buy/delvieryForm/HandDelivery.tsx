import React from "react";

const HandDelivery = () => {
  return (
      <form noValidate className="col-span-2 shadow-small rounded-lg text-left p-6 flex flex-col gap-3 my-4 relative z-30 bg-white">
        <h3 className="font-semibold text-lg">
          Remise de l'achat en main propre
        </h3>
        <h5 className="text-gray-400 font-thin">
          Les étapes de la remise en main propre :
        </h5>
        <div className="flex flex-col gap-3">
          <div className="w-full flex gap-3 items-center text-sm">
            <div className="p-4 rounded-full bg-orange-100 text-orange-400 text-sm font-semibold w-8 h-8 flex justify-center items-center">
              1
            </div>
            <p>Le vendeur vous confirme la disponibilité de la commande</p>
          </div>
          <div className="w-full flex gap-3 items-center text-sm">
            <div className="p-4 rounded-full bg-orange-100 text-orange-400 text-sm font-semibold w-8 h-8 flex justify-center items-center">
              2
            </div>
            <p>
              Vous vous organisez avec le vendeur pour définir le lieu et la date
              de votre rendez-vous
            </p>
          </div>
          <div className="w-full flex gap-3 items-center text-sm">
            <div className="p-4 rounded-full bg-orange-100 text-orange-400 text-sm font-semibold w-8 h-8 flex justify-center items-center">
              3
            </div>
            <p>
              Pensez à prendre votre téléphone portable pour déclencher le
              paiement depuis votre messagerie{" "}
              <span className="text-main font-semibold">elbuenocorneto</span>{" "}
              pendant le rendez-vous
            </p>
          </div>
      </div>
      <button type="submit" hidden ></button>
      </form>
  );
};

export default HandDelivery;
