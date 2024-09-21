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

import { useParams } from "next/navigation";

export default function Items() {


  const [item, setItem] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const getItem = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/item/item/id/${id}`);
      const data = await response.json();
      setItem(data);

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
      setItems(items.filter((item) => item._id !== item._id));

      toast.success("Usunięto element");
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
                onChange={(e) => setItem({ ...item, name: e.target.value })}
              />
              <Input
                label="Ilość"
                value={item.quantity}
                onChange={(e) => setItem({ ...item, quantity: e.target.value })}
              />
              <Select
                label="Lokalizacja"
                value={item.location}
                onChange={(e) => setItem({ ...item, location: e.target.value })}
              >
                {locations.map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Obraz"
                value={item.image}
                onChange={(e) => setItem({ ...item, image: e.target.value })}
              />
              <Input
                label="Tagi"
                value={item.tags}
                onChange={(e) => setItem({ ...item, tags: e.target.value })}
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