import { AttrCatInsert } from "@/drizzle/schema";

export const attributeCategoryList: Omit<AttrCatInsert, "id">[] = [
  {
    categoryType: "immobilier",
    attributeName: "garden",
  },
  {
    categoryType: "immobilier",
    attributeName: "livingSpace",
  },
  {
    categoryType: "immobilier",
    attributeName: "habitationType",
  },
  {
    categoryType: "vehicule",
    attributeName: "carBrand",
  },
  {
    categoryType: "vehicule",
    attributeName: "color",
  },
  {
    categoryType: "vehicule",
    attributeName: "doors",
  },
  {
    categoryType: "vehicule",
    attributeName: "fuel",
  },
  {
    categoryType: "vehicule",
    attributeName: "power",
  },
  {
    categoryType: "vehicule",
    attributeName: "milling",
  },
  {
    categoryType: "vehicule",
    attributeName: "year",
  },
  {
    categoryType: "electronique",
    attributeName: "year",
  },
  {
    categoryType: "electronique",
    attributeName: "model",
  },
  {
    categoryType: "electronique",
    attributeName: "brand",
  },
  {
    categoryType: "electronique",
    attributeName: "stockage",
  },
  {
    categoryType: "electronique",
    attributeName: "memory",
  },
  {
    categoryType: "mode",
    attributeName: "size",
  },
  {
    categoryType: "mode",
    attributeName: "color",
  },
  {
    categoryType: "mode",
    attributeName: "brand",
  },
  {
    categoryType: "vacance",
    attributeName: "livingSpace",
  },
  {
    categoryType: "vacance",
    attributeName: "habitationType",
  },
  {
    categoryType: "vacance",
    attributeName: "garden",
  },
  {
    categoryType: "job",
    attributeName: "contractType",
  },
  {
    categoryType: "job",
    attributeName: "wage",
  },
  {
    categoryType: "famille",
    attributeName: "age",
  },
  {
    categoryType: "famille",
    attributeName: "objectMaterial",
  },
  {
    categoryType: "loisir",
    attributeName: "age",
  },
  {
    categoryType: "loisir",
    attributeName: "objectMaterial",
  },
];
