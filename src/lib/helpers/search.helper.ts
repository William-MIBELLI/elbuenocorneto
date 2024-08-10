import { QueryParams } from "@/app/(regular)/search-result/page";
import { ISearchParams, SortType } from "@/context/search.context";
import { CategoryEnum, SearchInsert } from "@/drizzle/schema";

export const queryToParams = (
  query: QueryParams,
  withUndefined = false
): ISearchParams => {
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
    createdAt: query.createdAt
      ? new Date(query.createdAt as string)
      : undefined,
  };

  const mapped = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined)
  );

  //SI ON NE BEUT PAS LES UNDEFINED
  if (!withUndefined) {
    return mapped as unknown as ISearchParams;
  }

  return params;
};

export const paramsToQuery = (
  params: ISearchParams
): Record<string, string> => {
  const ignore: Partial<keyof SearchInsert>[] = ["createdAt", "userId"];

  const mapped = Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => {
        return (value !== undefined || value?.length !== 0) &&
          !ignore.includes(key as keyof SearchInsert)
          ? [key, value?.toString()]
          : [];
      })
      .filter((item) => {
        //ON RECUPERE UNIQUEMENT LES VALUES QUI NE SONT PAS UNDEFINED
        return item[1] !== undefined;
      })
  );
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

export const compareSearchs = (
  current: SearchInsert | ISearchParams,
  t: ISearchParams
): boolean => {
  //ON CREE UN TABLEAU AVEC LES KEYS A IGNORER
  const ignore: Partial<keyof SearchInsert>[] = [
    "userId",
    "id",
    "locationId",
    "createdAt",
    "page",
  ];

  //ON CREE UNE SEARCH AVEC TOUS LES PARAMS, MEME UNDEFINED
  const target = generateFullSearchInsert(t as SearchInsert);

  //ON LOOP SUR CHAQUE KEY DE LA SEARCH
  for (const key in current) {
    //SI LA KEY EST DANS LA TARGET MAIS LES VALUES SONT DIFFERENTES, ON RETOURNE FALSE
    if (
      current[key as keyof ISearchParams] !== target[key as keyof ISearchParams]
    ) {
      //ON CHECK SI LA KEY N'EST PAS DANS LES KEYS A IGNORER
      if (ignore.includes(key as keyof SearchInsert)) {
        console.log('KEY IGNORED : ', key);
        continue;
      }
      //ET SI LA VALUE N'EST PAS UNDEFINED OU NULL
      if (
        (current[key as keyof ISearchParams] !== undefined &&
          current[key as keyof ISearchParams] !== null) ||
          (target[key as keyof ISearchParams] !== undefined &&
            target[key as keyof ISearchParams] !== null)
          ) {
        console.log("KEY : ", key, "CURRENT : ", current[key as keyof ISearchParams], "TARGET : ", target[key as keyof ISearchParams]);
        console.log("RETURN FALSE");
        return false;
      }
    }
  }
  return true;
};

export const generateFullSearchInsert = (
  params: SearchInsert
): SearchInsert => {
  //ON CONVERTIT LES PARAMS EN QUERY
  const query = paramsToQuery(params);

  //ON SE SERT DE LA QUERY POUR GENERER UNE SEARCH AVEC TOUS LES PARAMS, MEME UNDEFINED
  const fullParams = queryToParams(query as QueryParams, true);

  //ON MAP LES UNDEFINED EN NULL
  const mappedFullParams = Object.fromEntries(
    Object.entries(fullParams).map(([key, value]) => {
      return value === undefined ? [key, null] : [key, value];
    })
  );

  //ON RETURN LES PARAMS AVEC LA DATE DE CREATION
  return { ...params, ...mappedFullParams, createdAt: new Date(Date.now()) };
};
