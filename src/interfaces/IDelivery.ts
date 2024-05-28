
export type DeliveryType = 'colissimo' | 'laposte' | 'mondialrelay' | 'chronopost'

export const DeliveryTypeList: DeliveryType[] = [
  'chronopost', 'colissimo', 'laposte', 'mondialrelay'
]

export interface IDelivery {
  type: DeliveryType;
  label: string;
  description: string;
  price: number;
  iconUrl: string;
  requirement: string;
  maxWeight: number;
}



export const deliveryList: IDelivery[] = [
  {
    type: 'chronopost',
    label: 'Shop2Shop by Chronopost',
    description: 'en point Pickup sous 2-4 jours',
    price: 6.49,
    iconUrl: '/icons/chronopost.svg',
    requirement: "La somme de la longueur, largeur et hauteur ne dépasse pas 150 cm, ou le côté le plus long ne dépasse pas 100 cm",
    maxWeight: 20
  },
  {
    type: 'laposte',
    label: 'Courrier suivi',
    description: 'à votre domicile sous 2-3 jours',
    price: 9.69,
    iconUrl: '/icons/laposte.svg',
    requirement: "Limité à 3 cm d’épaisseur",
    maxWeight: 2
  },
  {
    type: 'mondialrelay',
    label: 'Mondial Relay',
    description: 'en point Mondial Relay sous 3-5 jours',
    price: 4.99,
    iconUrl: '/icons/mondialrelay.svg',
    requirement: "La somme de la longueur, largeur et hauteur ne dépasse pas 150 cm, et le côté le plus long ne dépasse pas 120 cm",
    maxWeight: 30
  },
  {
    type: 'colissimo',
    label: 'Colissimo',
    description: 'à votre domicile sous 2-3 jours',
    price: 10.15,
    iconUrl: '/icons/colissimo.svg',
    requirement: "La somme de la longueur, largeur et hauteur ne dépasse pas 150 cm, ou le côté le plus long ne dépasse pas 100 cm",
    maxWeight: 30
  },
]