import { Button, Divider } from "@nextui-org/react";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-96 mt-24 bg-gray-900 flex text-gray-200 flex-col justify-center items-center text-sm">
      <h3 className="text-2xl font-bold">
        ⚠️ SITE EN COURS DE DEVELOPPEMENT ⚠️
      </h3>
      <p className="text-gray-500">Certaines fonctionnalités du site ne sont pas encore disponible</p>
      <p className="text-gray-500">
        La base de donnée a été seed de facon aleatoire{" "}
        <span className="text-xs text-gray-900">(mais oui, ici on aime les chats 👀)</span>
      </p>
      <p className="my-3 font-semibold">En ce moment : Creation Product</p>
      <div className="flex gap-3">
      <Button as={Link} className="flex items-center gap-2  font-semibold" href={'https://docs.google.com/document/d/1f0AP0OxrqNv6i6y_QQPNJTK3b83Dc1xWhq8B2vqRmeg/edit?usp=sharing'} target="_blank">
        Le devlog
        <ExternalLink size={17}/>
      </Button>
      <Button as={Link} className="flex items-center gap-2  font-semibold" href={'https://williammibelli.netlify.app/'} target="_blank">
        Mon portfolio
        <ExternalLink size={17}/>
      </Button>
      <Button as={Link} className="flex items-center gap-2  font-semibold" href={'https://github.com/William-MIBELLI'} target="_blank">
        Mon Github
        <ExternalLink size={17}/>
      </Button>

      </div>
    </div>
  );
};

export default Footer;
