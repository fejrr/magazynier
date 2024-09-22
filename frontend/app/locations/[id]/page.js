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
  Image,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,

} from "@nextui-org/react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Location() {

  const [items, setItems] = useState([]);
  const [location, setLocation] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const pathname = usePathname();

  const getLocation = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/item/location/id/${id}`);
      const data = await response.json();
      if (data.status === "error") {

        push("/locations");
        return toast.error("Nie można pobrać elementu");

      }

      console.log(data);

      setItems(data.items);
      setLocation(data.location);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const updateLocation = async (location) => {
    try {
      const response = await fetch(`/api/items/location/${location._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: location.name,
          state: location.state,
          image: location.image,
        }),
      });
      const data = await response.json();

      toast.success("Zaktualizowano ustawienia");
    } catch (error) {
      console.error(error);
    }
  };


  const deleteLocation = async (location) => {

    try {
      const response = await fetch(`/api/items/location/${location._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.status === "error") {
        return toast.error("Nie można usunąć elementu");
      }

      toast.success("Usunięto element");
      push("/locations");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      <div className="flex gap-6">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-4  w-full">
            <div className="flex flex-col gap-2 md:w-3/4">
              <Input
                label="Nazwa"
                value={location.name}
                onValueChange={(e) => setLocation({ ...location, name: e })}
              />
              <div className="flex gap-2">
              <Input
                label="Obraz"
                value={location.image}
                onValueChange={(e) => setLocation({ ...location, image: e })}
              />
              {location.image && (
                <Image
                  src={location.image}
                  alt={location.name}
                  width={100}
                  height={100}
                />
              )}
              </div>
              <Switch
                label="Status"
                isSelected={location.state}
                onValueChange={(e) => setLocation({ ...location, state: e })}
              />
              <Button
                size="md"
                color="success"
                onPress={() => updateLocation(location)}
              >
                Zapisz
              </Button>
              <Button
                size="md"
                color="danger"
                onPress={() => deleteLocation(location)}
              >
                Usuń
              </Button>
            </div>
            {/* image + items container */}
            <div className="flex flex-col gap-2 md:w-1/4">
              <h2 className="text-lg font-bold">Przypisane przedmioty</h2>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Link key={item._id} href={`/items/${item._id}`}>
                      {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}