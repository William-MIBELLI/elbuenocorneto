import {
  DeliveryLinkSelect,
  ImageSelect,
  ProductSelect,
  SelectUser,
} from "@/drizzle/schema";
import { DeliveryType } from "./IDelivery";
import { ILocation } from "./ILocation";

export const categoriesList: ICategoriesList = {
  immobilier: {
    label: "Immobilier",
    imageUrl: "immobilier",
    id: 1,
    target: "immobilier",
  },
  vehicule: {
    label: "Véhicule",
    imageUrl: "voiture",
    id: 2,
    target: "vehicule",
  },
  vacance: {
    label: "Locations de vacances",
    imageUrl: "vacance",
    id: 3,
    target: "vacance",
  },
  job: {
    label: "Emploi",
    imageUrl: "job",
    id: 4,
    target: "job",
  },
  mode: {
    label: "Mode",
    imageUrl: "mode",
    id: 5,
    target: "mode",
  },
  jardin: {
    label: "Maison & Jardin",
    imageUrl: "decoration",
    id: 6,
    target: "jardin",
  },
  famille: {
    label: "Famille",
    imageUrl: "ameublement",
    id: 7,
    target: "famille",
  },
  electronique: {
    label: "Electronique",
    imageUrl: "informatique",
    id: 8,
    target: "electronique",
  },
  loisir: {
    label: "Loisirs",
    imageUrl: "livres",
    id: 9,
    target: "loisir",
  },
  autre: {
    label: "Autres",
    imageUrl: "autre",
    id: 10,
    target: "autre",
  },
};

export type CategoriesType =
  | "immobilier"
  | "vehicule"
  | "vacance"
  | "job"
  | "mode"
  | "jardin"
  | "famille"
  | "electronique"
  | "loisir"
  | "autre";

export type ICategoriesList = {
  [key in CategoriesType]: ICategory;
};

export interface ICategory {
  label: string;
  imageUrl: string;
  id: number;
  target: CategoriesType;
}

export interface ICoordonates {
  lat: number;
  lng: number;
}

export interface IProduct {
  id: string;
  userId: string;
  imageUrl: string[];
  title: string;
  price: number;
  delivery: DeliveryType[];
  coordonates: ICoordonates;
  location: {
    city: string;
    postal: number;
  };
  createdAt: Date | string;
  category: CategoriesType;
  description: string;
}

export interface IProductCard {
  product: ProductSelect | null;
  user: Partial<SelectUser> | null;
  imagesUrl: string[];
}

export interface IProductDetails {
  product:  ProductSelect;
  user: SelectUser | null;
  images: string[];
  del: string[];
  location: ILocation | null
}

export type ICard = ProductSelect & {
  seller: Pick<SelectUser, "name" | "rateNumber" | "rating">;
} & { pdl: Pick<DeliveryLinkSelect, "deliveryId">[] }
  & { images: Pick<ImageSelect, 'url'>[]};
