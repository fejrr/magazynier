"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Spinner,
  Switch,
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

import Webcam from "../components/Webcam";

import Link from "next/link";
import { usePathname } from "next/navigation";

const newItemTemplate = { name: "", state: true, image: "" };

const stateColorMap = {
  true: "success",
  false: "danger",
};

const stateValueMap = {
  true: "Aktywna",
  false: "Nieaktywna",
};

export default function Locations() {

  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const pathname = usePathname();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getLocations = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/items/locations`);
      const data = await response.json();
      console.log(data);
      setLocations(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const uploadImage = async (image) => {

    // conver base64 to image
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
    const file = new File([blob], "location.jpg", { type: "image/jpeg" });

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

  const addLocation = async () => {

    onOpenChange();

    let image = newLocation.image;

    if (capturedImage) {
      image = await uploadImage(capturedImage);
      setNewLocation({ ...newLocation, image });
    }

    try {
      const response = await fetch(`/api/items/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newLocation.name,
          state: newLocation.state,
          image: image
        }),
      });
      const data = await response.json();
      setLocations([...locations, data]);
      setNewLocation(newItemTemplate);
      toast.success("Dodano element");
    } catch (error) {
      console.error(error);
    }
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
      setLocations(locations.filter((item) => item._id !== location._id));

      toast.success("Usunięto element");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="flex flex-col gap-6 min-h-100vh">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          <Button color="success" onPress={onOpen}>Dodaj nową lokalizację</Button>
          <Table aria-label="Tabela" removeWrapper>
            <TableHeader>
              <TableColumn>Nazwa</TableColumn>
              <TableColumn>Stan</TableColumn>
              <TableColumn>Obraz</TableColumn>
              <TableColumn>Akcje</TableColumn>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location._id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color={stateColorMap[location.state]}
                      auto
                      onPress={() => {
                        setLocations(
                          locations.map((item) =>
                            item._id === location._id
                              ? { ...item, state: !item.state }
                              : item
                          )
                        );
                      }}
                    >
                      {stateValueMap[location.state]}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {location.image && (
                      <Link href={`/api/public/locations/${location.image}`} passHref>
                      <Image src={`/api/public/locations/${location.image}`} alt={location.name} width={100} />
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        aria-label="Save"
                        size="sm"
                        color="success"
                        onPress={() => updateLocation(location)}
                        isIconOnly
                      >
                        <i className="bi bi-floppy"></i>
                      </Button>

                      <Button
                        aria-label="Delete"
                        size="sm"
                        color="danger"
                        onPress={() => deleteLocation(location)}
                        isIconOnly
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                      <Button
                        aria-label="Edit"
                        as={Link}
                        size="sm"
                        color="primary"
                        href={`locations/${location._id}`}
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
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              <ModalHeader>Dodaj nową lokalizację</ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Nazwa"
                  aria-label="Nazwa"
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                />
                <Switch
                  aria-label="Stan"
                  color={stateColorMap[newLocation.state]}
                  isSelected={newLocation.state}
                  onValueChange={(state) => setNewLocation({ ...newLocation, state })}
                >
                  {stateValueMap[newLocation.state]}
                </Switch>

                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex flex-col gap-2">
                      {!capturedImage &&
                        <Webcam setCapturedImage={setCapturedImage} show={showWebcam} />
                      }

                      {capturedImage && (
                        <div className="flex flex-col gap-2">
                        <Image
                          src={capturedImage}
                          alt={newLocation.name}
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
                <Button color="success" auto onPress ={addLocation}>
                  Dodaj
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
}
