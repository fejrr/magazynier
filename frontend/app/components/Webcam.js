"use client";

import { useState } from "react";
import ReactWebcam from "react-webcam";
import {
    Button,
} from "@nextui-org/react";

const aspectRatios = {
    landscape: {
        width: 1920,
        height: 1080
    },
    portrait: {
        width: 1080,
        height: 1920
    }
}


export default function Webcam({ setCapturedImage, show=false }) {

    const [type, setType] = useState("landscape")
    const [showWebcam, setShowWebcam] = useState(show)

    return (
        <div className="webcam">
            {showWebcam ? (
            <ReactWebcam
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                videoConstraints={{
                    ...aspectRatios[type],
                    facingMode: "environment"
                }}
            >
                {({ getScreenshot }) => (
                    <div className="flex gap-3 py-2 mt-2">
                        <Button size="sm" color="primary"
                            onPress={() => {
                                const imageSrc = getScreenshot()
                                setCapturedImage(imageSrc)
                            }}
                        >
                            Zrób zdjęcie
                        </Button>
                        <Button size="sm" color="primary"
                            onPress={() => {
                                setType(type === "landscape" ? "portrait" : "landscape")
                            }}
                        >
                            Zmień orientację
                        </Button>
                        <Button size="sm" color="danger" className="ms-auto"
                            onPress={() => {
                                setShowWebcam(false)
                            }}
                        >
                            Anuluj
                        </Button>
                    </div>
                )}
            </ReactWebcam>
            ) : (
            <Button 
                size="sm" 
                color="primary"
                onPress={() => {
                    setShowWebcam(true)
                }}
            >
                <i className="bi bi-camera"></i> Dodaj zdjęcie
            </Button>
            )}
        </div>
    )
}