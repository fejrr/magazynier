"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Select,
  SelectItem,
  Textarea,
  Spinner,
  Input,
  Autocomplete,
  AutocompleteItem,
  Progress,
} from "@heroui/react";

import { useRouter } from "next/navigation";
import QrCodeScanner from "./components/QRCodeScanner";
import LoadingBar from "./components/LoadingBar";

const Home = () => {
  const { push } = useRouter();

  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrCodeMessage, setQrCodeMessage] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  async function fetchItems() {
    setLoading(true);

    try {
      const response = await fetch(`/api/items/all`);
      const data = await response.json();
      console.log(data);
      setItems(data.items);
      setLocations(data.locations);

      const searchItems = data.items.map((item) => ({
        _id: item._id,
        name: item.name.toLowerCase(),
        type: "item",
      }));

      const searchLocations = data.locations.map((location) => ({
        _id: location._id,
        name: location.name.toLowerCase(),
        type: "location",
      }));

      setSearchResults([...searchItems, ...searchLocations]);
    } catch (error) {
      console.error(error);
      return null;
    }

    setLoading(false);
  }

  const handleSelectionChange = (value) => {
    if (!value) {
      return;
    }

    const selectedItem = searchResults.find((result) => result._id === value);
    if (selectedItem.type === "item") {
      push(`/items/${selectedItem._id}`);
    } else {
      push(`/locations/${selectedItem._id}`);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container">
      {loading && <LoadingBar />}
      <div className="flex flex-col justify-center gap-4">
        <Autocomplete
          aria-label="Szukaj"
          variant="bordered"
          startContent={<i className="bi bi-search" />}
          className="w-full md:w-[304px]"
          size="md"
          onSelectionChange={(e) => handleSelectionChange(e)}
        >
          {searchResults.map((result) => (
            <AutocompleteItem key={result._id}>{result.name}</AutocompleteItem>
          ))}
        </Autocomplete>

        <div className="flex flex-col gap-2">
          {showScanner && <QrCodeScanner />}
          <Button
            onPress={() => setShowScanner(!showScanner)}
            size="sm"
            className="mb-2 w-full md:w-[304px]"
          >
            {showScanner ? "Ukryj skaner" : "Pokaż skaner"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
