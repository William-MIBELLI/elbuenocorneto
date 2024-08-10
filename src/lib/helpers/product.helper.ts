import { ISearchParams } from "@/context/search.context";
import { locations } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

export function withLocation<T extends PgSelect>(qb: T, params: ISearchParams) {
  return qb.where(
    sql`earth_distance(
      ll_to_earth(
        (${locations.coordonates}->>'lat')::numeric,
        (${locations.coordonates}->>'lng')::numeric
      ),
      ll_to_earth(${params.lat},${params.lng})
    )/1000 < ${params.radius}`
  );
}