import { auth, signOut } from "@/auth";
import Card from "@/components/dashboard/Card";
import { findUserByEmail } from "@/lib/requests/auth.requests";
import { getUserById } from "@/lib/requests/user.request";
import { Button } from "@nextui-org/react";
import { MoveRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export interface ICardDashboard {
  title: string;
  content?: string;
  iconUrl: string;
  target: string;
  available?: boolean;
}

const cardsToDisplay: ICardDashboard[] = [
  {
    title: 'Annonces',
    content: 'Gérer mes annonces déposées',
    iconUrl: 'annonces.png',
    target: '/mes-annonces',
    available: true
  },
  {
    title: 'Transaction',
    content: 'Suivre mes achats et mes ventes',
    iconUrl: 'transactions.png',
    target: '/mes-transactions',
    available: true
  },
  {
    title: 'Réservation de vacances',
    content: 'Retrouver vos réservations en tant que voyageur',
    iconUrl: 'portal-vacances.png',
    target: '/reservation-vacances'
  },
  {
    title: 'Profil et Espaces',
    content: 'Modifier mon profil public, accéder à mes avis, aux espaces candidat, locataire et bailleur',
    iconUrl: 'private-profile.png',
    target: `/mon-profil/`,
    available: true
  },
  {
    title: 'Paramètres',
    content: 'Compléter et modifier mes informations privées et préférences',
    iconUrl: 'parametres.png',
    target: `/mes-parametres/`,
    available: true,
  },
  {
    title: 'Connexion et sécurité',
    content: 'Protéger mon compte et consulter son indice de sécurité',
    iconUrl: 'securite.png',
    target: '/securite'
  },
  {
    title: 'Mes crédits',
    iconUrl: 'credits.svg',
    target: '/credits'
  },
  {
    title: 'Aide',
    iconUrl: 'help.png',
    target: '/help'
  },
  

]

const Dashboard = async () => {

  const session = await auth();
  
  if (!session) redirect('/auth/login');
  //console.log('SESSION DANS DASHBOARD ', session);
  const { user: data } = session;
  const user = await findUserByEmail(data?.email!)
  
  return (
    <div className="w-full flex flex-col items-start gap-4">
      {/* HEADER */}

      <div className="w-full flex gap-4 md:flex-row flex-col">
        <div className="border-gray border-1 flex justify-between flex-grow p-6 rounded-lg">
          <div className="flex items-center gap-2 ">
            <div className="relative rounded-full overflow-hidden h-28 w-28">
              <Image
                className="rounded-full overflow-hidden"
                src={user?.image ?? "/profile-default.svg"}
                alt="profile pics"
                fill
              />
            </div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
          </div>
          <div className="flex gap-1 items-center">
            <Link
              className="text-sm font-semibold underline"
              href={`/profile/${session.user?.id}`}
            >
              Accéder à mon profil public
            </Link>
            <MoveRight size={17} />
          </div>
        </div>

        <div className="flex font-semibold relative shadow-dashboard_card p-6 rounded-xl overflow-hidden">
          <div className="bg-orange-300 w-40  h-40 rounded-full absolute -top-10 -left-28 "> </div>
          <div className="bg-gray-200 w-40 opacity-70  h-40 rounded-full absolute -bot-10 -left-28 "> </div>
          <div className="flex md:flex-col flex-row justify-center items-center md:items-start gap-3 bg-transparent ml-14">
            <h3>Porte-monnaie</h3>
            <p>{user?.walletAmout || 0}€</p>
            <p className="font-normal text-sm">Solde disponible</p>
          </div>
        </div>
      </div>

      {/* ADD PICTURE */}

      <div className="flex flex-col items-end p-4 rounded-lg gap-2 bg-blue-100 w-full">
        <Button isIconOnly className="bg-transparent rounded-full" >
          <X size={19} />
        </Button>
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-start">
            <h3 className="font-semibold">Photo de profil</h3>
            <p className="text-sm">
              Pour une expérience plus agréable entre membres avec qui vous
              aller faire des affaires!
            </p>
          </div>
          <Button className="bg-orange-500 text-white font-semibold">
            Ajouter ma photo de profil
          </Button>
        </div>
      </div>
      <div className=" grid grid-cols-3 gap-4">
        {
          cardsToDisplay.map(card => (
            <Card card={card} key={Math.random()}/>
          ))
        }
      </div>
      <form action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}>
        <Button variant="bordered" className="font-semibold text-gray-400" type="submit">Me déconnecter</Button>
        </form>

    </div>
  );
};

export default Dashboard;
