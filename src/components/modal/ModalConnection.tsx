import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Dispatch, FC, useEffect } from "react";

interface IProps {
  open: boolean;
  setOpen: Dispatch<boolean>;
}

const ModalConnection: FC<IProps> = ({ open, setOpen }) => {

  const { onOpen, onClose, isOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onOpen();
    }
  }, [open]);

  const onCloseHanlder = () => {
    console.log("ONCLOSE HANDLER");
    setOpen(false);
    onClose();
  };

  const onClickHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log("CLICK MODAL");
    e.stopPropagation();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onCloseHanlder}
      size="xl"
      className=""
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody className="flex flex-col gap-3 text-sm font-semibold">
              <p>
                Vous devez être connecté pour ajouter des annonces dans vos
                favoris.
              </p>
              <p>
                {pathname}
              </p>
            </ModalBody>
            <ModalFooter>
              <div>
                <Button as={Link} href={`/auth/login/${pathname}`} className="button_main">Se connecter</Button>
                {/* <Button className="button_secondary" onPress={onClose}>Fermer</Button> */}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConnection;
