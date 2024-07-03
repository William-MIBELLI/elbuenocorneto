import {
  Button,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderValue,
} from "@nextui-org/react";
import { ChevronDown, Crosshair, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const kmValue = [1, 5, 10, 20, 30, 50, 100, 200];

const AddressSearchInput = () => {
  const [value, setValue] = useState<SliderValue>(0);
  const [km, setKm] = useState<number>(1);
  const [displaySlider, setDisplaySlider] = useState<boolean>(false);

  useEffect(() => {
    console.log("VALUE : ", value);
    setKm(kmValue[value as number]);
  }, [value]);

  return (
    <Popover
      backdrop="opaque"
      placement="bottom-end"
      classNames={{
        base: [" w-60"],
      }}
    >
      <Input
        variant="bordered"
        isDisabled
        startContent={<MapPin color="gray" />}
        endContent={
          <PopoverTrigger className="cursor-pointer">
            <ChevronDown color="gray" size={32} />
          </PopoverTrigger>
        }
        placeholder="Choisir une localisation"
        classNames={{
          base: ["w-fit"],
          inputWrapper: ["border-gray-300"],
        }}
      />

      {/* HEADER */}
      <PopoverContent className="w-full py-4">
        <div className="flex flex-col items-start w-full gap-4">
          <h3 className="text-md font-semibold">Où voulez-vous chercher ?</h3>
          <Divider />

          {/* AROUND ME */}
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex w-full p-2 items-center gap-2 hover:bg-gray-100 cursor-pointer" onClick={() => setDisplaySlider(true)}>
              <Crosshair color="lightblue" />
              <p>Autour de moi</p>
            </div>
            {displaySlider && (
              <div className="w-full ">
                <div className="flex  justify-between text-blue-400 font-semibold">
                  <p>Dans un rayon de</p>
                  <p>{km} Km</p>
                </div>
                <Slider
                  size="sm"
                  step={1}
                  color="primary"
                  maxValue={7}
                  minValue={0}
                  value={value}
                  onChange={setValue}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* EVERYWHERE */}
          <div className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer w-full p-2" onClick={() => setDisplaySlider(false)}>
            <div>
              <MapPin color="lightblue" />
            </div>
            <p>Toute la France</p>
          </div>
        </div>
        <Divider className="my-3" />

        {/* FOOTER */}
        <div className="flex justify-between w-full">
          <Button className="button_secondary">Effacer</Button>
          <Button className="button_main">Rechercher</Button>
        </div>

      </PopoverContent>
    </Popover>
  );
};

export default AddressSearchInput;
