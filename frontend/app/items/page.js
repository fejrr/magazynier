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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,

} from "@heroui/react";

import { usePathname, useRouter } from "next/navigation";
import Webcam from "../components/Webcam";

const newItemTemplate = {
  name: "",
  quantity: 1,
  image: "",
  location: "",
  tags: "",
};

export default function Items() {
  const pathname = usePathname();
  const { push } = useRouter();

  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newItem, setNewItem] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
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

  const uploadImage = async (image, name) => {
    const file_name = `item.jpg`;
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
    const file = new File([blob], file_name, { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", file);

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

  const addItem = async () => {
    onOpenChange();
    if (capturedImage) {
      newItem.image = await uploadImage(capturedImage, newItem.name);
    }

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
      getItems();
      setNewItem(newItemTemplate);
      setCapturedImage(null);
      toast.success("Dodano element");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectionChange = (value) => {
    if (!value) {
      return;
    }

    const selectedItem = items.find((result) => result._id === value);
    if (selectedItem.type === "item") {
      push(`/items/${selectedItem._id}`);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Autocomplete
              aria-label="Szukaj"
              variant="bordered"
              startContent={<i className="bi bi-search" />}
              className="w-full md:w-auto"
              size="md"
              onSelectionChange={(e) => handleSelectionChange(e)}
            >
              {items.map((result) => (
                <AutocompleteItem key={result._id}>
                  {result.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Button color="success" size="md" onPress={onOpen} isIconOnly>
            <i className="bi bi-plus-lg"></i>
            </Button>
          </div>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-5">
            {items.map((item) => (
              <Card
                shadow="sm"
                className="max-h-[300px]"
                key={item._id}
                isPressable
                onPress={() => push(`/items/${item._id}`)}
              >
                <CardHeader className="text-small justify-between pe-1">
                  <b>{item.name}</b>
                  <Chip className="text-default-500">{item.quantity} szt.</Chip>
                </CardHeader>
                <CardBody className="overflow-visible p-0 relative">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.name}
                    className="w-full h-40 object-cover"
                    src={`/api/public/items/${
                      item.image != "" ? item.image : "brak-zdjecia.png"
                    }`}
                  />
                </CardBody>
                <CardFooter className="text-small justify-between px-1">
                  <div className="flex flex-col gap-2">
                    {item.location ? (
                      <Chip color="secondary" radius="sm">
                        {item.location.name}
                      </Chip>
                    ) : (
                      <Chip color="danger" radius="none">
                        Brak lokalizacji
                      </Chip>
                    )}
                    <div className="flex gap-2">
                      {item.tags &&
                        item.tags.split(",").map((tag) => (
                          <Chip
                            key={tag}
                            color="primary"
                            variant="flat"
                            radius="none"
                          >
                            {tag}
                          </Chip>
                        ))}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* ----------------------------- MODAL ----------------------------- */}

          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            className="md:min-h-fit min-h-full"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            placement="center"
          >
            <ModalContent>
              <ModalHeader>Dodaj nowy przedmiot</ModalHeader>
              <ModalBody>
                <Input
                  label="Nazwa"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  autoFocus={false}
                />
                <Input
                  label="Ilość"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                />
                <Select
                  label="Lokalizacja"
                  selectedKeys={[newItem.location]}
                  onSelectionChange={(e) => {
                    setNewItem({ ...newItem, location: [...e][0] })
                  }}
                  
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

                {/* <div className="flex flex-col gap-2 mt-2"> */}
                  <div className="flex flex-col gap-2">
                    {!capturedImage && (
                      <Webcam
                        setCapturedImage={setCapturedImage}
                        show={showWebcam}
                      />
                    )}

                    {capturedImage && (
                      <div className="flex flex-col gap-2">
                        <Image src={capturedImage} alt={newItem.name} width={100} />
                        <Button
                          color="warning"
                          autoSave=""
                          onPress={() => {
                            setCapturedImage(null);
                            setShowWebcam(true);
                          }}
                        >
                          Ponów zdjęcie
                        </Button>
                      </div>
                    )}
                  </div>
                {/* </div> */}
              </ModalBody>
              <ModalFooter className="flex gap-4">
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Anuluj
                </Button>
                <Button
                  color="success"
                  auto
                  onPress={() => {
                    addItem();
                    onOpenChange();
                  }}
                >
                  Dodaj przedmiot
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
}
