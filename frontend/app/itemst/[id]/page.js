"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Spinner,
  Chip,
  Image,

} from "@heroui/react";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

import Webcam from "../../components/Webcam";
import QRCode from "../../components/QRCodeGen";

export default function Item() {

  const { id } = useParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const [item, setItem] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const getItem = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/item/item/id/${id}`);
      const { data, status } = await response.json();
      if (status !== "success") {
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
          name: item.name,
          quantity: item.quantity,
          location: item.location,
          image: item.image,
          tags: item.tags,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: item.image,
        }),
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
        ) : item && (
          <>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-full md:w-1/2"> {/*MAIN*/}
                <Input
                  label="Nazwa"
                  value={item.name}
                  onValueChange={(e) => setItem({ ...item, name: e })}
                />
                <Input
                  label="Ilość"
                  type="number"
                  value={item.quantity}
                  onValueChange={(e) => setItem({ ...item, quantity: e })}
                />
                <div className="flex flex-wrap md:flex-nowrap gap-2">
                  <Select
                    label="Lokalizacja"
                    fullWidth
                    selectedKeys={[item.location]}
                    onSelectionChange={(e) => setItem({ ...item, location: [...e][0] })}
                  >
                    {locations.map((location) => (
                      <SelectItem key={location._id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Link href={`/locations/${item.location}`}>
                    <Button size="sm" fullWidth color="success" className="md:h-full px-11 md:px-2">Edytuj lokalizację</Button>
                  </Link>
                </div>
                <Input
                  label="Tagi"
                  value={item.tags}
                  onValueChange={(e) => setItem({ ...item, tags: e })}
                />
              <div className="flex gap-4 mt-5">
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
              <div className="flex flex-col gap-2 md:w-1/2"> {/*IMAGE*/}
                <QRCode />

                {item.image && (
                  <Image
                    src={`/api/public/items/${item.image}`}
                    alt={item.name}
                    className="w-full object-cover h-full"
                  />
                )}

                <div className="flex flex-col gap-2">
                  {!capturedImage &&
                    <Webcam setCapturedImage={setCapturedImage} show={showWebcam} dodajZdjecie={`${item.image ? "Zmień" : "Dodaj"} zdjęcie`} />
                  }

                  {capturedImage && (
                    <div className="flex flex-col gap-2">
                      <Image
                        src={capturedImage}
                        alt="Nowe zdjęcie"
                        width={100}
                      />
                      <div className="flex gap-2">
                        <Button
                          color="warning"
                          auto
                          onPress={() => {
                            setCapturedImage(null)
                            setShowWebcam(true)
                          }
                          }
                        >
                          Ponów zdjęcie
                        </Button>
                        <Button
                          color="danger"
                          auto
                          onPress={() => {
                            setCapturedImage(null)
                            setShowWebcam(false)
                          }
                          }
                        >
                          Anuluj
                        </Button>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>


        )}
      </div>
    </>
  );
}