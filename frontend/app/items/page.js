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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Webcam from "../components/Webcam";

export default function Items() {

  const newItemTemplate = { name: "", quantity: 1, image: "", location: "", tags: "" };

  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newItem, setNewItem] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);

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

  const uploadImage = async (image) => {

    // conver base64 to image
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
    const file = new File([blob], "item.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.file.filename;
    } catch (error) {
      console.error(error);
    }

  };

  const updateItem = async (item) => {

    console.log(item);
    return

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

  const addItem = async () => {



    newItem.image = await uploadImage(capturedImage);
    
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
      setNewItem(newItemTemplate);
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
            <Table aria-label="Tabela" removeWrapper isCompact>
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
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Input
                        aria-label="Ilość"
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
                        aria-label="Lokalizacja"
                        onSelectionChange={(e) =>
                          setItems(
                            items.map((i) =>
                              i._id === item._id
                                ? { ...i, location: e.target.value }
                                : i
                            )
                          )
                        }
                        // selectedKeys={[item.location]}
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
                      <Image src={`/api/public/items/${item.image}`} alt={item.name} width={100} />
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
                          <Button
                            as={Link}
                            href={`/items/${item._id}`}
                            auto
                            size="sm"
                            color="primary"
                            isIconOnly
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ----------------------------- MODAL ----------------------------- */}
            {/* ----------------------------- MODAL ----------------------------- */}

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
                    label="Tagi"
                    value={newItem.tags}
                    onChange={(e) =>
                      setNewItem({ ...newItem, tags: e.target.value })
                    }
                  />

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-col gap-2">
                      {!capturedImage &&
                        <Webcam setCapturedImage={setCapturedImage} show={showWebcam} />
                      }

                      {capturedImage && (
                        <div className="flex flex-col gap-2">
                        <Image
                          src={capturedImage}
                          alt={newItem.name}
                          width={100}
                        />
                        <Button
                          color="danger"
                          auto
                          onPress={() => {
                            setCapturedImage(null)
                            setShowWebcam(true)
                          }
                        }
                        >
                          Ponów zdjęcie
                        </Button>
                        </div>
                      )}
                    </div>
                  </div>
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
