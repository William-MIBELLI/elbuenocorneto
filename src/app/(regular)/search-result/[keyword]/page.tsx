import Body from "@/components/search-page/Body";
import {
  SearchContextProvider,
  SearchParamskeys,
} from "@/context/search.context";
import {
  createWhereConditionFromKeyword,
  getProductsList,
  createSearchCondition,
} from "@/lib/requests/product.request";
import { FC } from "react";

interface IProps {
  params: {
    keyword: string;
  };
  searchParams: { [key in SearchParamskeys]: string | string[] | undefined };
}

export const revalidate = 0;
const page: FC<IProps> = async ({ params, searchParams }) => {
  const { keyword } = params;
  const { titleOnly, page } = searchParams;
  console.log("SEARCHPARAMS : ", searchParams);

  const condition = createSearchCondition({
    keyword,
    titleOnly: titleOnly === "true",
  });

  const result = await getProductsList(
    condition.where,
    undefined,
    undefined,
    page ? +page : 1
  );

  const p = {
    keyword,
    titleOnly: titleOnly === "true ",
    page: page ? +page : 1,
  };
  return (
    <SearchContextProvider>
      <Body
        key={keyword + page}
        keyword={keyword}
        titleOnly={titleOnly}
        result={result}
        p={p}
      />
    </SearchContextProvider>
  );
};

export default page;
