"use client";

import { useState } from "react";
import ReactWebcam from "react-webcam";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

const aspectRatios = {
  landscape: {
    width: 1270,
    height: 720,
  },
  portrait: {
    width: 720,
    height: 1270,
  },
};

export default function Webcam({
  setCapturedImage,
  show = false,
  dodajZdjecie = "Dodaj zdjęcie",
}) {
  const [type, setType] = useState("landscape");
  const [showWebcam, setShowWebcam] = useState(show);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
    setShowWebcam(false);
    onClose();
  }

  return (
    <div className="webcam">
      {!showWebcam && (
        <Button
          size="sm"
          color="primary"
          onPress={() => {
            setShowWebcam(true);
            onOpen();
          }}
          className="w-full md:w-[304px]"
        >
          <i className="bi bi-camera"></i> {dodajZdjecie}
        </Button>
      )}

      <Modal isOpen={isOpen} size="xl" onClose={handleClose} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Zrób zdjęcie</h3>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-2">
                <ReactWebcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1}
                  videoConstraints={{
                    ...aspectRatios[type],
                    facingMode: "environment",
                  }}
                >
                  {({ getScreenshot }) => (
                    <div className="flex gap-3 py-2 mt-2">
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => {
                          const imageSrc = getScreenshot();
                          setCapturedImage(imageSrc);
                        }}
                      >
                        Zrób zdjęcie
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => {
                          setType(
                            type === "landscape" ? "portrait" : "landscape"
                          );
                        }}
                      >
                        Zmień orientację
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        className="ms-auto"
                        onPress={handleClose}
                      >
                        Anuluj
                      </Button>
                    </div>
                  )}
                </ReactWebcam>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
