"use client";
import React, { useRef, useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCamera } from "react-icons/fa";

const CameraModal = ({ open, onOpenChange, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (open) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [open]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video stream
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");

            // Handle mirroring (standard for front cameras)
            context.translate(canvas.width, 0);
            context.scale(-1, 1);

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "profile-photo.jpg", {
                        type: "image/jpeg",
                    });
                    onCapture(file);
                    onOpenChange(false);
                }
            }, "image/jpeg");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Capture Profile Photo</DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border-2 border-primary/20">
                    {error ? (
                        <div className="text-white text-center p-4">
                            <p className="mb-4">{error}</p>
                            <Button onClick={startCamera}>
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ transform: "scaleX(-1)" }} // Mirror the preview
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={capturePhoto} disabled={!stream} className="bg-primary hover:bg-primary/90">
                        <FaCamera className="mr-2" />
                        Capture Photo
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CameraModal;
