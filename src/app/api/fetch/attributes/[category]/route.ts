import { getDb } from "@/drizzle/db";
import { AttributeSelect, CategoryEnum, attributeCategoryJONC, attributesTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Params = {
  category: string
}

export const GET = async (request: Request, context: { params: Params }): Promise<NextResponse<(AttributeSelect | null)[]>> =>{
  try {

    //ON RECUPERE LA CATEGORIE DANS L'URL
    const { params } = context;

    //ON VERIFIE QU'ELLE EXISTE BIEN DANS CATEGORYENUM
    const cat = CategoryEnum.enumValues.find(item => item === params.category)
    if (!cat) throw new Error('Invalid category')
    
    //ON FETCH LES ATRTRIBUTS DISPO POUR LA CATEGORIE
    const db = getDb();

    //LA SUBQUERY POUR RECUP LES ATTRIBUTS ASSOCIES A LA CAT UNIQUEMENT
    const sq = db.select().from(attributeCategoryJONC).where(eq(attributeCategoryJONC.categoryType, cat)).as('sq')
    const attributes = await db.select().from(attributesTable).rightJoin(sq, eq(sq.attributeName, attributesTable.name));

    const mappedAttris = attributes.map(item => item.attribute).filter(item => item !== null);

    //console.log('MAPPED ATTRS : ', attributes);
    return NextResponse.json(mappedAttris)

  } catch (error) {
    console.log('ERROR REQUTES ATTRIBUTES : ', error);
    return NextResponse.json([])
  }
}