import { QueryParams } from "@/app/(regular)/search-result/page";
import { ISearchParams, SortType } from "@/context/search.context";
import { CategoryEnum, SearchInsert } from "@/drizzle/schema";
import { user } from "@nextui-org/theme";




export const queryToParams = (query: QueryParams): ISearchParams => {


  const params = {
    ...query,
    titleOnly: query.titleOnly === "true",
    min: query.min ? +query.min ?? undefined : undefined,
    max: query.max ? +query.max ?? undefined : undefined,
    keyword: query.keyword ? query.keyword.toString() : "",
    radius: query.radius ? +query.radius ?? undefined : undefined,
    delivery: query.delivery === "true",
    sort: query.sort ? (query.sort as SortType) : undefined,
    categorySelectedType: query.categorySelectedType
      ? (query.categorySelectedType as (typeof CategoryEnum.enumValues)[number])
      : undefined,
    categorySelectedLabel: query.categorySelectedLabel?.toString() ?? undefined,
    donation: query.donation === "true",
    page: query.page ? +query.page : 1,
    lat: query.lat ? +query.lat ?? undefined : undefined,
    lng: query.lng ? +query.lng ?? undefined : undefined,
    id: query.id?.toString() ?? undefined,
    locationId: query.locationId?.toString() ?? undefined,
    createdAt: query.createdAt ? new Date(query.createdAt as string) : undefined,
  };

  const mapped = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined)
  );
  return mapped as unknown as ISearchParams;
};

export const paramsToQuery = (
  params: ISearchParams
): Record<string, string> => {

  const ignore: Partial<keyof SearchInsert>[] = [ 'createdAt', 'userId' ];


  const mapped = Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => {
        return (value !== undefined || value?.length !== 0) && !ignore.includes(key as keyof SearchInsert)
          ? [key, value?.toString()]
          : [];
      })
      .filter((item) => {
        //ON RECUPERE UNIQUEMENT LES VALUES QUI NE SONT PAS UNDEFINED
        return item[1] !== undefined;
      })
  );
  //console.log("MAPPED DANS LA FUNCTION : ", mapped, params);
  return mapped;
};

export const getPriceText = (
  params: Pick<ISearchParams, "donation" | "max" | "min">
): string => {
  if (params.donation) {
    return "Dons uniquement";
  }
  if (params.max && params.min) {
    return `Entre ${params.min} et ${params.max}€`;
  }
  if (params.max) {
    return `Jusqu'à ${params.max}€`;
  }
  if (params.min) {
    return `A partir de ${params.min}€`;
  }
  return "Tous les prix";
};

export const compareSearchs = (current: SearchInsert | ISearchParams, target: ISearchParams): boolean => {

  //ON CREE UN TABLEAU AVEC LES KEYS A IGNORER
  const ignore: Partial<keyof SearchInsert>[] = ["userId", "id", "locationId", 'createdAt', 'page'];

  //console.log('CURRENT : ', current);
  //console.log('target : ', target);

  //ON LOOP SUR CHAQUE KEY DE LA SEARCH
  for (const key in current) {

    //SI LA KEY EST DANS LA TARGET MAIS LES VALUES SONT DIFFERENTES, ON RETOURNE FALSE
    if (current[key as keyof ISearchParams] !== target[key as keyof ISearchParams]) {
      if (!ignore.includes(key as keyof SearchInsert) && current[key as keyof ISearchParams] !== undefined || null) {
        // //console.log('DIFFERENT VALUE : ', key, current[key as keyof ISearchParams], target[key as keyof ISearchParams]);
        return false
      }
      // //console.log('DIFFERENT VALUE IGNORED : ',key , current[key as keyof ISearchParams], target[key as keyof ISearchParams]);
    }
    // //console.log('SAME VALUE : ', key, current[key as keyof ISearchParams], target[key as keyof ISearchParams]);
  }
  console.log('SAME : ', current, target)
  return true
}


