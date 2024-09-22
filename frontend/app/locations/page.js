"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Spinner,
  Switch,
  Image,
  Card, CardHeader, CardBody, CardFooter,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  Chip,
} from "@nextui-org/react";

import Webcam from "../components/Webcam";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

  const pathname = usePathname();
  const { push } = useRouter();

  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);

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

  const uploadImage = async (image, name) => {

    const file_name = `location_${name.replace(/\s/g, "-")}.jpg`;
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
    const file = new File([blob], file_name, { type: "image/jpeg" });

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

    newLocation.image = await uploadImage(capturedImage, newLocation.name) ?? newLocation.image;

    try {
      const response = await fetch(`/api/items/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newLocation.name,
          state: newLocation.state,
          image: newLocation.image
        }),
      });
      const data = await response.json();
      getLocations();
      setNewLocation(newItemTemplate);
      setCapturedImage(null);
      toast.success("Dodano element");
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
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {locations.map((item) => (

              <Card shadow="sm" className="max-h-[300px]" key={item._id} isPressable onPress={() => push(`/locations/${item._id}`)}>
                <CardBody className="overflow-visible p-0 relative">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.name}
                    className="w-full h-40 object-cover"
                    src={`/api/public/locations/${item.image}`}
                  />
                </CardBody>
                <CardFooter className={`text-small ${item.state ? "bg-green-500 text-black" : "bg-red-500"}`}>
                  <b>{item.name}</b>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* ----------------------------- MODAL ----------------------------- */}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" className="md:min-h-fit min-h-svh">
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
              <ModalFooter className="flex gap-4">
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Anuluj 
                </Button>
                <Button color="success" auto onPress={addLocation}>
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
