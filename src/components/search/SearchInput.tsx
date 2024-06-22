import { Input, Spinner } from "@nextui-org/react";
import { FC, useEffect, useRef, useState } from "react";
import SellButton from "../sell-button/SellButton";
import { ProductSelect } from "@/drizzle/schema";
import { Search } from "lucide-react";
import ResultContainer from "./ResultContainer";
import { usePathname } from "next/navigation";
import { SearchResultType } from "@/interfaces/IProducts";

const SearchInput: FC = () => {
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [openResult, setOpenResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const lastTyping = useRef<number>();
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  //SI L'USER CHANGE DE PAGE, ON CACHE LE RESULT
  useEffect(() => {
    setOpenResult(false);
  }, [pathname]);


  //SEARCH HANDLER
  const onSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    lastTyping.current = Date.now();

    //SI VALUE EST VIDE, ON RESET SEARCHRESULT
    if (!value.length) {
      setSearchResult([]);
      setOpenResult(false);
      return;
    }

    //TIMEOUT POUR DELAY LA RECHERCHE
    setTimeout(async () => {
      const now = Date.now();
      //SI VALUE EST VIDE, ON NE REQUEST PAS
      if (now - lastTyping.current! >= 200 && value.length !== 0) {
        console.log("ON LANCE LA RECHERCHE");
        setLoading(true);
        const response = await fetch(`/api/fetch/search/${value ?? ""}`);
        if (response.ok) {
          const p: SearchResultType[] = await response.json();
          console.log('RESULTAT : ', p);
          setSearchResult(p);
          setOpenResult(true);
          setLoading(false);
        }
      }
    }, 200);
  };

  //SI LINPUT PERD LE FOCUS, ON CHECK OU L'USER A CLICK
  const onBlurHandler = (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<Element, Element>
  ) => {
    console.log('ONBLUR EVENT ');

    //SI C'EST DANS RESULT, C'EST QUE L'USER A CLIQUE SUR UN LIEN, ON LAISSE LE RESULT AFFICHE
    if (ref.current && !ref.current.contains(event.relatedTarget)) {
      console.log('ON RENTRE DANS LE IF')
      setOpenResult(false);
      setIsSearchFocus(false)
    }
  };

  //QUAND L'INPUT A LE FOCUS, ON DISPLAY RESULT ET ON CACHE LE BUTTON
  const onFocusHandler = () => {
    setIsSearchFocus(true);
    setOpenResult(true);
  }

  return (
    <div className="hidden md:flex flex-col w-[50%] gap-2 justify-between relative z-40">
      <div className="flex justify-between  w-full gap-3">
        {!isSearchFocus && <SellButton />}
        <Input
          type="search"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onSearchChange}
          fullWidth={isSearchFocus}
          placeholder="Rechercher sur El bueno Cornetto"
          endContent={loading ? (
            <Spinner/>
          ): (
            <Search
              size={28}
              className="bg-orange-500 text-white p-1 rounded-lg"
            />    
          )
          }
          classNames={{
            inputWrapper: ["bg-gray-200", isSearchFocus ? "w-full" : "w-auto"],
          }}
        />
      </div>
      {(searchResult.length > 0 && openResult) && (
        <div ref={ref}>
          <ResultContainer
            result={searchResult}
            setOpenresult={setOpenResult}
          />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
