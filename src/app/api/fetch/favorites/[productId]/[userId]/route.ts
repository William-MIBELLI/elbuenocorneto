import { isThisProductAFavorite } from "@/lib/requests/favorite.request";
import { NextResponse } from "next/server";

type Params = {
  productId: string;
  userId: string;
}

export async function GET(request: Request, context: { params: Params}): Promise<NextResponse<boolean>> {
  console.log('ON EST DANS LA ROUTE : ', context.params); 
  const { productId, userId } = context.params;
  try {
    const isFavorite = await isThisProductAFavorite(productId, userId);
    
    return NextResponse.json(isFavorite);
  } catch (error) {
    console.log('ERROR FETCHING DELIVERIES FROM ROUTE ', error);
    return NextResponse.json(false);
  }
}