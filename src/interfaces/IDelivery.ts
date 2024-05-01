
export type DeliveryType = 'colissimo' | 'laposte' | 'mondialrelay' | 'chronopost'

export interface IDelivery {
  type: DeliveryType;
  label: string;
  description: string;
  price: number;
  iconUrl: string;
}



export const deliveryList: IDelivery[] = [
  {
    type: 'chronopost',
    label: 'Shop2Shop by Chronopost',
    description: 'en point Pickup sous 2-4 jours',
    price: 6.49,
    iconUrl: '/icons/chronopost.svg'
  },
  {
    type: 'laposte',
    label: 'Courrier suivi',
    description: 'à votre domicile sous 2-3 jours',
    price: 9.69,
    iconUrl: '/icons/laposte.svg'
  },
  {
    type: 'mondialrelay',
    label: 'Mondial Relay',
    description: 'en point Mondial Relay sous 3-5 jours',
    price: 4.99,
    iconUrl: '/icons/mondialrelay.svg'
  },
  {
    type: 'colissimo',
    label: 'Colissimo',
    description: 'à votre domicile sous 2-3 jours',
    price: 10.15,
    iconUrl: '/icons/colissimo.svg'
  },
]