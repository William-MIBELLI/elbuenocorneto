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

  const where = createWhereConditionFromKeyword(keyword, titleOnly === "true");
  const test = createSearchCondition({
    keyword: "chair",
    titleOnly: true,
    min: 200,
    categorySelected: {
      type: 'autre',
      label: 'test'
    }
  });

  const result = await getProductsList(where);

  return (
    <SearchContextProvider>
      <Body keyword={keyword} titleOnly={titleOnly} result={result} />
    </SearchContextProvider>
  );
};

export default page;
