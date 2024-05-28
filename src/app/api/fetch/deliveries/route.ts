import { DeliverySelect } from "@/drizzle/schema";
import { getAllDeliveriesFromDB } from "@/lib/requests/delivery.request";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse<DeliverySelect[]>> {
  console.log('ON EST DNAS LLE ROUTE');
  try {
    const dels = await getAllDeliveriesFromDB();
    
    return NextResponse.json(dels);
  } catch (error) {
    console.log('ERROR FETCHING DELIVERIES FROM ROUTE ', error);
    return NextResponse.json([]);
  }
}