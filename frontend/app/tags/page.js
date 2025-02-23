"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
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
} from "@heroui/react";


import { usePathname, useRouter } from "next/navigation";
import React from "react";

const newItemTemplate = { name: "", color: "" };

export default function Tags() {

  const pathname = usePathname();
  const { push } = useRouter();

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState(newItemTemplate);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: editModal, onOpen: onEditModal, onOpenChange: setEditModal } = useDisclosure();

  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredItems = [...tags];
    if (hasSearchFilter) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase() || "")
      )
    }

    return filteredItems;
  }, [tags, filterValue]);

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

    setLoading(false);
  };

  const addTag = async () => {

    setNewTag(newItemTemplate);
    onOpenChange();

    try {
      const response = await fetch(`/api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTag.name,
          color: newTag.color,
        }),
      });
      const data = await response.json();
      getTags();
      setNewTag(newItemTemplate);
      toast.success("Dodano element");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTag = async (id) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setEditModal(!editModal);
      setNewTag(newItemTemplate);
      getTags();
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const editTag = async (id) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTag.name,
          color: newTag.color,
        }),
      });
      const data = await response.json();
      setEditModal(!editModal);
      setNewTag(newItemTemplate);
      getTags();
      toast.success("Zaktualizowano element");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="flex flex-col gap-6 min-h-100vh">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-end">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Szukaj po nazwie"
              startContent={<i className="bi bi-search"></i>}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <div className="flex gap-3">
              <Button color="success" size="md" onPress={onOpen} endContent={<i className="bi bi-plus-lg"></i>}>
                Dodaj nowy
              </Button>
            </div>
          </div>
          <div className="gap-2 grid grid-cols-5 md:grid-cols-8">
            {filteredItems.map((item) => (
              <Card key={item._id} className="flex flex-col gap-2" style={{ backgroundColor: item.color }} isPressable onPress={() => { setNewTag(item); onEditModal(); }}>
                <CardBody>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-default-50">{item.name}</span>
                        {/* <Button color="default" size="sm" onPress={() => { setNewTag(item); onEditModal(); }} isIconOnly>
                          <i className="bi bi-pencil"></i>
                        </Button> */}
                    </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* ----------------------------- MODAL ----------------------------- */}
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            className="md:min-h-fit min-h-fit"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              <ModalHeader>Dodaj nowy tag</ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                <Input
                  placeholder="Nazwa"
                  aria-label="Nazwa"
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  autoFocus={false}
                />
                <Input
                  placeholder="Kolor"
                  aria-label="Kolor"
                  type="color"
                  className="w-[60px]"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                />
                </div>
              </ModalBody>
              <ModalFooter className="flex gap-4">
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Anuluj
                </Button>
                <Button color="success" auto onPress={addTag}>
                  Dodaj
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* ----------------------------- MODAL ----------------------------- */}

            <Modal
              isOpen={editModal}
              onOpenChange={() => setEditModal(!editModal)}
              isDismissable={true}
              isKeyboardDismissDisabled={true}
              placement="center"
            >
              <ModalContent>
                <ModalHeader>Edytuj tag</ModalHeader>
                <ModalBody>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Nazwa"
                      aria-label="Nazwa"
                      type="text"
                      value={newTag.name}
                      onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                      autoFocus={false}
                    />
                    <Input
                      placeholder="Kolor"
                      aria-label="Kolor"
                      type="color"
                      className="w-[60px]"
                      value={newTag.color}
                      onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-between gap-4">
                  <Button color="danger" variant="solid" onPress={() => deleteTag(newTag._id)} isIconOnly>
                    <i className="bi bi-trash"></i>
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => setEditModal(!editModal)}
                    >
                      Zamknij
                    </Button>
                    <Button color="success" auto onPress={() => editTag(newTag._id)}>
                      Zapisz
                    </Button>
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </div>
      )}
    </div>
  );
}
