"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  Button, 
  Select, 
  SelectItem, 
  Textarea,
  Spinner,
} from "@nextui-org/react";

const Home = () => {

  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {

    setLoading(true);

    try {
      const response = await fetch(`/api/items/all`);
      const data = await response.json();
      console.log(data);
      setItems(data.items);
      setLocations(data.locations);
    } catch (error) {
      console.error(error);
      return null;
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container">
      {loading && <Spinner />}
      <div>
        <ul>
          {items.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <ul>

          {locations.map((location) => (
            <li key={location._id}>{location.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
