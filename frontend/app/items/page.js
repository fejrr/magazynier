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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Items() {

  const newItemTemplate = { name: "", quantity: 1, image: "", location: "", tags: "" };

  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newItem, setNewItem] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getItems = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/items/all`);
      const data = await response.json();
      console.log(data);
      setItems(data.items);
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
          name: item.name,
          state: item.state,
          image: item.image,
        }),
      });
      const data = await response.json();

      toast.success("Zaktualizowano ustawienia");
    } catch (error) {
      console.error(error);
    }
  };

  const addItem= async () => {

    try {
      const response = await fetch(`/api/items/item`, {
        method: "POST",
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
      setItems([...items, data]);
      toast.success("Dodano element");
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
    getItems();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Ustawienia */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-4">
          <Button color="success" size="md" onPress={onOpen}>Dodaj nowy przedmiot</Button>
          <Table aria-label="Tabela" removeWrapper>
            <TableHeader>
              <TableColumn>Nazwa</TableColumn>
              <TableColumn>Ilość</TableColumn>
              <TableColumn>Lokalizacja</TableColumn>
              <TableColumn>Tagi</TableColumn>
              <TableColumn>Obraz</TableColumn>
              <TableColumn>Akcje</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell><Link href={`/items/${item._id}`}>{item.name}</Link></TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        setItems(
                          items.map((i) =>
                            i._id === item._id
                              ? { ...i, quantity: e.target.value }
                              : i
                          )
                        )
                      }
                      min="1"
                      className="w-auto"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      onSelectionChange={(e) =>
                        setItems(
                          items.map((i) =>
                            i._id === item._id
                              ? { ...i, location: e.target.value }
                              : i
                          )
                        )
                      }
                      selectedKeys={[item.location]}
                      className="w-auto"
                    >
                      {locations.map((location) => (
                        <SelectItem key={location._id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {item.tags && item.tags.split(",").map((tag) => (
                      <Chip key={tag} color="success">{tag}</Chip>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Avatar src={item.image} />
                  </TableCell>
                  <TableCell>
                  <div className="flex gap-2">
                      <Button
                        auto
                        size="sm"
                        color="success"
                        onPress={() => updateItem(item)}
                        isIconOnly
                      >
                        <i className="bi bi-floppy"></i>
                      </Button>

                      <Button
                        auto
                        size="sm"
                        color="danger"
                        onPress={() => deleteItem(item)}
                        isIconOnly
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              <ModalHeader>Dodaj nowy przedmiot</ModalHeader>
              <ModalBody>
                <Input
                  label="Nazwa"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
                <Input
                  label="Ilość"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                />
                <Select
                  label="Lokalizacja"
                  value={newItem.location}
                  onChange={(e) =>
                    setNewItem({ ...newItem, location: e.target.value })
                  }
                >
                  {locations.map((location) => (
                    <SelectItem key={location._id} value={location._id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Obraz"
                  value={newItem.image}
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                />
                <Input
                  label="Tagi"
                  value={newItem.tags}
                  onChange={(e) =>
                    setNewItem({ ...newItem, tags: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  auto
                  onClick={() => {
                    addItem();
                    onOpenChange();
                  }}
                >
                  Dodaj
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>



          </div>
        )}
      </div>
    </>
  );
}
