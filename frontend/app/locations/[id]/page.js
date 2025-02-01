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

} from "@heroui/react";
import Webcam from "../../components/Webcam";
import QRCode from "../../components/QRCodeGen";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

const stateColorMap = {
  true: "success",
  false: "danger",
};

const stateValueMap = {
  true: "Aktywna",
  false: "Nieaktywna",
};

export default function Location() {

  const { id } = useParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const [items, setItems] = useState([]);
  const [location, setLocation] = useState({});
  const [loading, setLoading] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const getLocation = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/item/location/id/${id}`);
      const { data, status } = await response.json();
      if (status !== "success") {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: location.image,
        }),
      });
      const data = await response.json();

      if (data.status !== "success") {
        push("/locations");
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

  return (<>
    <div className="flex flex-col gap-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 md:w-1/2">
              <Input
                label="Nazwa"
                value={location.name}
                onValueChange={(e) => setLocation({ ...location, name: e })}
              />
              <Switch
                aria-label="Stan"
                color={stateColorMap[location.state]}
                isSelected={location.state}
                onValueChange={(state) => setLocation({ ...location, state })}
              >
                {stateValueMap[location.state]}
              </Switch>
              <div className="flex gap-4 mt-auto">
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
            </div>
            {/* image + items container */}
            <div className="flex flex-col gap-3 md:w-1/2">
              <QRCode/>
              {location.image && (
                <Image
                  src={`/api/public/locations/${location.image}`}
                  alt={location.name}
                />
              )}
              {!capturedImage &&
                <Webcam setCapturedImage={setCapturedImage} show={showWebcam} dodajZdjecie={`${location.image ? "Zmień" : "Dodaj"} zdjęcie`} />
              }

              {capturedImage && (
                <div className="flex flex-col gap-3">
                  <Image
                    src={capturedImage}
                    alt="Nowe zdjęcie"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      color="warning"
                      className="md:w-auto w-full"
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
                      className="md:w-auto w-full"
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
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-lg font-bold">Przypisane przedmioty</h2>
            <div className="flex flex-wrap gap-2">
              {items.map((item, index) => (
                (<Link key={item._id} href={`/items/${item._id}`}>
                  <Chip key={item._id} color="primary" className="cursor-pointer">
                    {item.name}
                  </Chip>
                </Link>)
                // <Link key={item._id} href={`/items/${item._id}`}>
                //   {item.name}
                // </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </>);
}