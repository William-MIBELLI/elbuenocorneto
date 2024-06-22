import { Navbar, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { categoriesList } from "@/interfaces/IProducts";

const Categories = () => {
  return (
    <Navbar maxWidth="lg" height="1rem" className="py-2 hidden md:flex " position="static">
      {Object.entries(categoriesList).map(([key, { label, target }], index) => (
        <NavbarItem
          as={Link}
          href={`/category/${target}`}
          key={index}
          className="text-xs  pb-1 nav_item cat_item relative"
        >
          {label}
        </NavbarItem>
      ))}
    </Navbar>
  );
};

export default Categories;
