import Body from "@/components/search-page/Body";
import {
  SearchContextProvider,
  SearchParamskeys,
  
} from "@/context/search.context";
import {
  createWhereConditionFromKeyword,
  getProductsList, createSearchCondition
} from "@/lib/requests/product.request";
import { FC } from "react";

interface IProps {
  params: {
    keyword: string;
  };
  searchParams: { [key in SearchParamskeys]: string | string[] | undefined };
}

const page: FC<IProps> = async ({ params, searchParams }) => {
  const { keyword } = params;
  const { titleOnly } = searchParams;

  const condition = createSearchCondition({keyword, titleOnly: titleOnly === "true"});

  const result = await getProductsList(condition.where);

  return (
    <SearchContextProvider>
      <Body keyword={keyword} titleOnly={titleOnly} result={result} />
    </SearchContextProvider>
  );
};

export default page;
