import { AttrCatSelect, DeliverySelect, FavoriteSelect, deliveries } from "./../drizzle/schema";
import {
  AttributeInsert,
  AttributeSelect,
  CategoryInsert,
  CategorySelect,
  DeliveryLinkSelect,
  ImageSelect,
  LocationSelect,
  ProdAttrSelect,
  ProductSelect,
  SelectUser,
} from "@/drizzle/schema";
import { DeliveryType } from "./IDelivery";
import { ILocation } from "./ILocation";
import { v4 as uuidV4 } from "uuid";
import carBrand from "../../car_brand.json";

export const categoriesList: ICategoriesList = {
  immobilier: {
    label: "Immobilier",
    imageUrl: "immobilier",
    id: uuidV4(),
    target: "immobilier",
    type: "immobilier",
    parentId: null,
  },
  vehicule: {
    label: "Véhicule",
    imageUrl: "voiture",
    id: uuidV4(),
    target: "vehicule",
    type: "vehicule",
    parentId: null,
  },
  vacance: {
    label: "Locations de vacances",
    imageUrl: "vacance",
    id: uuidV4(),
    target: "vacance",
    type: "vacance",
    parentId: null,
  },
  job: {
    label: "Emploi",
    imageUrl: "job",
    id: uuidV4(),
    target: "job",
    type: "job",
    parentId: null,
  },
  mode: {
    label: "Mode",
    imageUrl: "mode",
    id: uuidV4(),
    target: "mode",
    type: "mode",
    parentId: null,
  },
  jardin: {
    label: "Maison & Jardin",
    imageUrl: "decoration",
    id: uuidV4(),
    target: "jardin",
    type: "jardin",
    parentId: null,
  },
  famille: {
    label: "Famille",
    imageUrl: "ameublement",
    id: uuidV4(),
    target: "famille",
    type: "famille",
    parentId: null,
  },
  electronique: {
    label: "Electronique",
    imageUrl: "informatique",
    id: uuidV4(),
    target: "electronique",
    type: "electronique",
    parentId: null,
  },
  loisir: {
    label: "Loisirs",
    imageUrl: "livres",
    id: uuidV4(),
    target: "loisir",
    type: "loisir",
    parentId: null,
  },
  autre: {
    label: "Autres",
    imageUrl: "autre",
    id: uuidV4(),
    target: "autre",
    type: "autre",
    parentId: null,
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

export const categoriesTypeList: CategoriesType[] = [
  "immobilier",
  "vehicule",
  "vacance",
  "job",
  "mode",
  "jardin",
  "famille",
  "electronique",
  "loisir",
  "autre",
];

export type ICategoriesList = {
  [key in CategoriesType]: CategoryInsert;
};

export interface ProductDataForList {
  product: Pick<
    ProductSelect,
    "id" | "title" | "createdAt" | "price" | "categoryType" | "state"
  >;
  images: ImageSelect[];
  location: LocationSelect;
  favorites: boolean;
}

export interface ICategory {
  label: string;
  imageUrl: string;
  id: string;
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
    postcode: number;
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
  product: ProductSelect;
  user: SelectUser[] | null;
  images: ImageSelect[] | null;
  del: DeliverySelect[] | null;
  location: LocationSelect[] | null;
  favorites: FavoriteSelect[] | null;
  attributes: ProdAttrSelect[] | null;
} 

export type attrType = ProdAttrSelect & {
  attribute: AttributeSelect
}

export type delType = DeliveryLinkSelect & {
  delivery: DeliverySelect
}

export type Details = ProductSelect & {
  attributes: attrType[];
  seller: SelectUser;
  favorites: FavoriteSelect[];
  images: ImageSelect[];
  location: LocationSelect;
  pdl: delType[];
}

export type AttrType = ProdAttrSelect & { attribute: AttributeSelect };

// export type ProdForCat =
//   | (ProductSelect & ImageSelect[])
//   | (null & FavoriteSelect)
//   | (null & LocationSelect)
//   | null;

export type ProductUpdateType = ProductSelect & {
  images: ImageSelect[];
  location: LocationSelect;
  category: CategorySelect;
  attributes: AttrType[];
  pdl: DeliveryLinkSelect[];
};

export type ICard = ProductSelect & {
  seller: Pick<SelectUser, "name" | "rateNumber" | "rating">;
} & { pdl: Pick<DeliveryLinkSelect, "deliveryId">[] } & {
  images: Pick<ImageSelect, "url">[];
} & { location: Pick<LocationSelect, "city" | "postcode"> } & { favorites: FavoriteSelect[] | null};

export interface IProductImage {
  file: File;
  url: string;
}

const yearValues = new Array(30).fill(" ").map((_item, index) => {
  const date = new Date().getFullYear();
  return (date - index).toString();
});

export const attributesList: Omit<AttributeInsert, "id">[] = [
  {
    name: "carBrand",
    label: "Marque",
    type: "select",
    possibleValue: Object.keys(carBrand).map((k) => k),
  },
  {
    name: "year",
    label: "Année de fabrication",
    type: "select",
    possibleValue: yearValues,
  },
  {
    name: "milling",
    label: "Kilométrage",
    type: "number",
  },
  {
    name: "fuel",
    label: "carburant",
    type: "select",
    possibleValue: [
      "Essence",
      "Diesel",
      "GPL",
      "Hybride",
      "Electrique",
      "Autre",
    ],
  },
  {
    name: "power",
    label: "Puissance",
    type: "number",
    required: false,
  },
  {
    name: "doors",
    label: "Nombre de portes",
    type: "select",
    possibleValue: ["3", "5", "Autre"],
    required: false,
  },
  {
    name: "livingSpace",
    label: "Surface habitable",
    type: "number",
  },
  {
    name: "habitationType",
    label: "Type d'habitation",
    type: "select",
    possibleValue: [
      "Appartement",
      "Maison individuelle",
      "Co-propriété",
      "Autre",
    ],
  },
  {
    name: "garden",
    label: "jardin",
    type: "boolean",
  },
  {
    name: "color",
    label: "Couleur",
    type: "text",
    required: false,
  },
  {
    name: "clothMaterial",
    label: "Tissu",
    type: "select",
    possibleValue: ["Coton", "Polyamide", "Cuir", "Simili-cuir", "Autre"],
  },
  {
    name: "objectMaterial",
    label: "Matière",
    type: "select",
    possibleValue: ["plastique", "Bois", "Métal", "Composite", "Autre"],
  },
  {
    name: "model",
    label: "Modèle",
    type: "text",
  },
  {
    name: "size",
    label: "Taille",
    type: "select",
    possibleValue: ["S", "M", "L", "XL", "2XL"],
  },
  {
    name: "age",
    label: "Tranche d'age",
    type: "select",
    possibleValue: ["0-3", "3-8", "8-11", "11-14", "14-18", "18+"],
    required: false,
  },
  {
    name: "stockage",
    label: "Capacité",
    type: "select",
    possibleValue: ["32", "64", "128", "256", "512", "Plus"],
    required: false,
  },
  {
    name: "memory",
    label: "Memoire vive",
    type: "select",
    possibleValue: ["2", "4", "8", "16", "32", "Plus"],
    required: false,
  },
  {
    name: "contractType",
    label: "Type de contrat",
    type: "select",
    possibleValue: [
      "CDI",
      "CDD",
      "Interim",
      "Freelance",
      "Alternance",
      "Stage",
      "Autre",
    ],
  },
  {
    name: "wage",
    label: "Salaire",
    type: "number",
    required: false,
  },
  {
    name: "brand",
    label: "Marque",
    type: "text",
  },
];

export type ProductForList = {
  product: ProductSelect | null,
  location: LocationSelect | null;
  image: ImageSelect | null;
  favorites: FavoriteSelect | null
}

export type SearchResultType = {
  product: ProductSelect | null;
  category: CategorySelect | null;
  count: { total: number}
}