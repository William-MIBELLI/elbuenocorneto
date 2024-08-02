import { LocationInsert } from "@/drizzle/schema";
import { fetchAddressFromAPI } from "@/lib/actions/location.action";
import {
  Button,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderValue,
  Spinner,
} from "@nextui-org/react";
import { ChevronDown, Crosshair, LucideIcon, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PopoverContentOptions from "./PopoverContentOptions";
import PopoverContentList from "./PopoverContentList";
import { useSearchContext } from "@/context/search.context";

const AddressSearchInput = () => {
  const { list, setList, selectedAddress, updateLocation } =
    useSearchContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [displayList, setDisplayList] = useState<boolean>(false);
  const lastTimeTyping = useRef<number>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>(selectedAddress?.city || "");

  //GESTION DU INPUT AVEC LE TIMEOUT ETC...
  const onChangeHandler = async (value: string) => {
    console.log('ONCHANGEHANDLER SUR LE INPUT');
    setValue(value);
    const timer = 100;
    lastTimeTyping.current = Date.now();
    setTimeout(async () => {
      const now = Date.now();
      const diff = now - lastTimeTyping.current!;
      if (diff >= timer) {
        setLoading(true);
        if (value.length >= 3) {
          const res = await fetchAddressFromAPI(value, true);

          //ON STOCKE LE RESULTAT DANS LIST
          setList(res);
          setDisplayList(true);
          setLoading(false);
        }
      }
    }, timer);
  };

  //ON UPDATE VALUE SI IL Y A UNE ADDRESS SELECTIONNEE DANS LE CONTEXT
  useEffect(() => {
    console.log('USE EFFECT SUR LE SELECTED ADDRESS', selectedAddress);
    if (selectedAddress) {
      return setValue(selectedAddress.city);
    }
    setValue("");
  }, [selectedAddress]);

  //GESTION DU CLICK SUR ADDRESS DE LA LIST
  const onAddressClick = (address: LocationInsert) => {
    console.log('ON ADDRESS CLICK')
    updateLocation(address);
    setList([]);
    if (triggerRef.current) {
      triggerRef.current.click();
    }
  };


  //POUR GERER LE DISPLAY DE LA LISTE, ON CHECK OU L'USER CLICK
  const handleClickOutside = (event: MouseEvent) => {
    if (
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setDisplayList(false);
    }
  };

  //ON PASSE LE LISTENER A TOUT LE DOCUMENT
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Popover
      backdrop="opaque"
      placement="bottom-end"
      classNames={{
        base: [" w-72 translate-x-8"],
      }}
    >
      <div className="relative">
        <Input
          onFocus={() => onChangeHandler(value)}
          variant="bordered"
          startContent={<MapPin color="lightblue" className="my-auto"/>}
          endContent={
            <PopoverTrigger className="cursor-pointer">
              <div ref={triggerRef}>
                <ChevronDown color="gray" size={24} />
              </div>
            </PopoverTrigger>
          }
          placeholder="Choisir une localisation"
          classNames={{
            base: ["w-fit "],
            inputWrapper: ["border-gray-300"],
          }}
          onValueChange={onChangeHandler}
          value={value}
        />

        {/* LIST DES ADDRESS DISPOS */}
        {(list.length > 0 && displayList && value.length > 0) && (
          <div
            ref={listRef}
            // onClick={(e) => console.log('CLICK SUR LISTREF ', e.relatedTarget)}
            className="flex flex-col bg-blue-500 absolute  max-h-52 overflow-y-auto  w-full z-50 border-gray-300 shadow-md border-2 rounded-lg"
          >
            {list.map((address) => (
              <div
                key={Math.random()}
                className="cursor-pointer hover:bg-gray-100 py-2"
                onClick={() => onAddressClick(address)}
              >
                {`${address.city} (${address.postcode.toString().slice(0, 2)})`}
              </div>
            ))}
          </div>
        )}
      </div>
      <PopoverContentOptions trigger={triggerRef.current} />
    </Popover>
  );
};

export default AddressSearchInput;
