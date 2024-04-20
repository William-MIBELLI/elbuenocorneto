
export const categoriesList: ICategoriesList = {
  immobilier: {label:"Immobilier", imageUrl:"immobilier", id:1},
  vehicule: {
    label: "Véhicule",
    imageUrl: "voiture",
    id: 2
  },
  vacance: {
    label: "Locations de vacances",
    imageUrl: "vacance",
    id: 3
  },
  job: {
    label: "Emploi",
    imageUrl: "job",
    id: 4
  },
  mode: {
    label: "Mode",
    imageUrl: "mode",
    id:5
  },
  jardin: {
    label: "Maison & Jardin",
    imageUrl: "decoration",
    id: 6
  },
  famille: {
    label: "Famille",
    imageUrl: "ameublement",
    id: 7
  },
  electronique: {
    label: "Electronique",
    imageUrl: "informatique",
    id: 8
  },
  loisir: {
    label: "Loisirs",
    imageUrl: "livres",
    id: 9
  },
  autre: {
    label: "Autres",
    imageUrl: "autre",
    id: 10
  },
};

export type CategoriesType = 'immobilier' | 'vehicule' | 'vacance' | 'job' | 'mode' | 'jardin' | 'famille' | 'electronique' | 'loisir' | 'autre';

export type ICategoriesList  = {
  [key in CategoriesType]: ICategory;
}

export interface ICategory {
  label: string;
  imageUrl: string;
  id: number;
}

export interface IProduct {
  username: string
  rating: number
  rateNumber: number
  imageUrl: string
  title: string
  price: number
  delivery: boolean
  location: string
  postal: number
  createdAt: Date | string
}