import carBrands from '../../car_brand.json';
export interface ICarCriteria {
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType,
  numberOfDoors: 3 | 5,
  transmission: 'automatic' | 'manual',
  cv: number,
  kilometers: number;
}

export enum FuelType {
  diesel =  'Diesel',
  essence = 'Essence',
  gas = 'GPL',
  electric = 'Electrique',
  hybrid = 'Hybrid'
}

