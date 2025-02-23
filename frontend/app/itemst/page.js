"use client";

import React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import useDeviceDetection from '../components/useDeviceDetection';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Image,
  Button,
  ButtonGroup,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Avatar,
  Link,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Autocomplete,
  AutocompleteItem
} from "@heroui/react";

import { usePathname, useRouter } from "next/navigation";
import Webcam from "../components/Webcam";
const newItemTemplate = {
  name: "",
  quantity: 1,
  image: "",
  location: "",
  tags: [],
};

const columns = [
  {name: "Image", uid: "image"},
  {name: "Nazwa", uid: "name", sortable: true},
  {name: "Ilość", uid: "quantity", sortable: true},
  {name: "Lokalizacja", uid: "location", sortable: true},
  {name: "Tagi", uid: "tags"},
];

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = ["image", "name", "quantity", "location", "tags"];

export default function Itemst() {

  const device = useDeviceDetection();

  const pathname = usePathname();
  const { push } = useRouter();

  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [newItem, setNewItem] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const {isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageModal, setImageModal] = useState(false);
  const [imageToShow, setImageToShow] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredItems = [...items];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter((item) => 
        item.name.toLowerCase().includes(filterValue.toLowerCase() || "") 
        || item.tags.some(tag => tag.name.toLowerCase().includes(filterValue.toLowerCase() || "")) 
        || item.location.name.toLowerCase().includes(filterValue.toLowerCase() || "")
      )
    }

    return filteredItems;
  }, [items, filterValue]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback((item, columnKey) => {

    const cellValue = item[columnKey];

    switch (columnKey) {
      case "image":
        return (
            <Image
              src={`/api/public/items/${
                item.image != "" ? item.image : "brak-zdjecia.png"
              }`}
              alt={item.name}
              className="w-10 h-10 rounded-sm cursor-pointer"
              onPointerDown={() => {
                setImageToShow(item.image);
                setImageModal(true);
              }}
            />
        );
      case "name":
        return (
            <Link className="cursor-pointer capitalize" color="foreground" onPointerDown={() => push(`/items/${item._id}`)}>{cellValue}</Link>
        );
      case "quantity":
        return (
          <Chip color="primary">
            {cellValue} szt.
          </Chip>
        );
      case "location":
        return (
          <>
              {cellValue ? (
                <ButtonGroup size="sm">
                  <Button color="secondary" size="sm" onPress={() => push(`/locations/${item.location._id}`)}>
                    {item.location.name}
                  </Button>
                  <Button color="secondary" size="sm" variant="light" isIconOnly onPress={() => onSearchChange(item.location.name)}>
                    <i className="bi bi-search"></i>
                  </Button>
                </ButtonGroup>

              ) : (
                <Chip color="danger" radius="none">
                  Brak lokalizacji
                </Chip>
              )}
          </>
        );
      case "tags":
        return (
          <div className="flex gap-2 overflow-x-auto">
            {cellValue &&
              cellValue.map((tag) => (
                <Chip key={tag._id} className="cursor-pointer text-default-50" style={{backgroundColor: tag.color}}  variant="flat" radius="none" onPointerDown={() => onSearchChange(tag.name)}>
                  {tag.name}
                </Chip>
              ))}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Szukaj po nazwie, tagach lub lokalizacji"
            startContent={<i className="bi bi-search"></i>}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<i className="bi bi-filter"></i>}>
                  Kolumny
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="success" size="md" onPress={onOpen} endContent={<i className="bi bi-plus-lg"></i>}>
              Dodaj nowy
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-default-400 text-small">Łącznie {items.length}</span>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    items.length,
    onSearchChange,
    hasSearchFilter,
  ]);

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

  const getTags = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/tags`);
      const data = await response.json();
      console.log(data);
      setTags(data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (image, name) => {
    const file_name = `item_${name.replace(/\s/g, "-")}.jpg`;
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
    getTags();
  }, []);

  return (
    <>
    <Table
      aria-label="Items Table"
      classNames={{
        wrapper: "max-h-[382px], p-0 pb-2",
        table: "overflow-x-auto",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      radius="none"
    >
      <TableHeader columns={headerColumns} className="rounded-none">
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "quantity" ? "center" : "left"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems} isLoading={<Spinner />}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => <TableCell className="px-2">{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    {/* ----------------------------- MODAL ----------------------------- */}
    <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={device === "desktop" ? "lg" : "full"}
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
            <Autocomplete
              label="Lokalizacja"
              value={newItem.location}
              onSelectionChange={(e) => {
                setNewItem({ ...newItem, location: e });
                console.log(e);
              }}>
              {locations.map((location) => (
                <AutocompleteItem key={location._id}>
                  {location.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Select
                label="Tagi"
                selectedKeys={newItem.tags}
                onSelectionChange={(e) => {
                setNewItem({ ...newItem, tags: [...e] })
                }}
              selectionMode="multiple"
            >
              {tags.map((tag) => (
                <SelectItem key={tag._id} value={tag._id}>
                  {tag.name}
                </SelectItem>
              ))}
            </Select>
            

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
      {/* modal for image */}

      <Modal
        isOpen={imageModal}
        onOpenChange={() => setImageModal(!imageModal)}
        size={device === "desktop" ? "xs" : "full"}
        isDismissable={true}
        isKeyboardDismissDisabled={true}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>&nbsp;</ModalHeader>
          <ModalBody>
            <Image src={`/api/public/items/${imageToShow}`} alt={imageToShow} />
          </ModalBody>
          <ModalFooter className="flex gap-4">
            <Button
              color="danger"
              variant="light"
              onPress={() => setImageModal(false)}
            >
              Zamknij
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

