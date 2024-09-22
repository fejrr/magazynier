"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Spinner,
  Switch,
  Chip,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,

} from "@nextui-org/react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";


export default function Item() {


  const [item, setItem] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const pathname = usePathname();

  const getItem = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/item/item/id/${id}`);
      const data = await response.json();
      if (data.status === "error") {

        push("/items");
        return toast.error("Nie można pobrać elementu");

      }

      console.log(data);

      setItem(data.item);
      setLocations(data.locations);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const updateItem = async (item) => {
    try {
      const response = await fetch(`/api/items/item/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          quantity: newItem.quantity,
          location: newItem.location,
          image: newItem.image,
          tags: newItem.tags,
        }),
      });
      const data = await response.json();

      toast.success("Zaktualizowano ustawienia");
    } catch (error) {
      console.error(error);
    }
  };


  const deleteItem = async (item) => {

    try {
      const response = await fetch(`/api/items/item/${item._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.status === "error") {
        return toast.error("Nie można usunąć elementu");
      }

      toast.success("Usunięto element");
      push("/items");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input
                label="Nazwa"
                value={item.name}
                onValueChange={(e) => setItem({ ...item, name: e })}
              />
              <Input
                label="Ilość"
                value={item.quantity}
                onValueChange={(e) => setItem({ ...item, quantity: e })}
              />
              <div className="flex gap-2">
              <Select
                label="Lokalizacja"
                selectedKeys={[item.location?._id]}
                onSelectionChange={(e) => setItem({ ...item, location: e })}
              >
                {locations.map((location) => (
                  <SelectItem key={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
              </Select>
              <Link href={`/locations/${item.location?._id}`}>
                <Button size="sm" color="success">Edytuj</Button>
              </Link>
              </div>
              <Input
                label="Obraz"
                value={item.image}
                onValueChange={(e) => setItem({ ...item, image: e })}
              />
              <Input
                label="Tagi"
                value={item.tags}
                onValueChange={(e) => setItem({ ...item, tags: e })}
              />
              <Button
                size="md"
                color="success"
                onPress={() => updateItem(item)}
              >
                Zapisz
              </Button>
              <Button
                size="md"
                color="danger"
                onPress={() => deleteItem(item)}
              >
                Usuń
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}