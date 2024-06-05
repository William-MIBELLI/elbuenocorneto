import { getDb } from "@/drizzle/db";
import { CategorySelect, categoryTable } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse<CategorySelect[]>> {
  try {
    console.log('ROUTE CATEGORIES')
    const db = getDb();
    const cat = await db.select().from(categoryTable);

    return NextResponse.json(cat)
  } catch (error) {
    console.log('ERROR FETCHING CATEGORIES ', error);
    return NextResponse.json([])
  }
}