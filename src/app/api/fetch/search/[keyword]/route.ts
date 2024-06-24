import { ProductSelect } from "@/drizzle/schema";
import { NextResponse } from "next/server";
import { searchOnDb } from "@/lib/requests/product.request";
import { SearchResultType } from "@/interfaces/IProducts";

type Params = {
  keyword: string;
};

// export const GET = async (
//   request: Request,
//   context: { params: Params }
// ): Promise<NextResponse<SearchResultType[]>> => {
//   try {
//     //console.log('REQUEST :', request);
//     const p: SearchResultType[] = await searchOnDb(context.params.keyword);

//     return NextResponse.json(p);
//   } catch (error) {
//     console.log("ERROR SEARCH ROUTE : ", error);
//     return NextResponse.json([]);
//   }
// };

export const POST = async (request: Request): Promise<NextResponse<SearchResultType[]>> => {
  try {
    const req: { value: string, titleOnly: boolean} = await request.json();
    const p: SearchResultType[] = await searchOnDb(req.value, req.titleOnly);
    return NextResponse.json(p);
  } catch (error) {
    console.log('ERROR : ', error);
    return NextResponse.json([]);
  }
}
