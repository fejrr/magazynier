"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Link as NavLink,
} from "@heroui/react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Przedmioty", path: "/items" },
  { name: "Lokalizacje", path: "/locations" }
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <Navbar className="justify-start mt-4" height="auto" id="nav">
      <NavbarContent className="flex flex-wrap h-full gap-2 md:gap-4">
        {navItems.map((item) => (
          <NavbarItem key={item.name}>
            <Button as={Link} size="sm" color="primary" variant={pathname === item.path ? 'solid' : 'bordered'} href={item.path}>{item.name}</Button>
          </NavbarItem>
        ))}
      </NavbarContent>
    </Navbar>
  );
}
