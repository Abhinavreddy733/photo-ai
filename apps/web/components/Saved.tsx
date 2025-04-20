"use client";

import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import SavedImageCard from "./SavedImageCard";
import { motion } from "framer-motion";
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Copy, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface savedimageprops {
  id: string;
  imageUrl: string;
  modelId: string;
  userId: string;
  likedImage:string;
  prompt: string;
  createdAt: string;
}

function Saved() {
    const [images, setImages] = useState<savedimageprops[]>([]);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<savedimageprops | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const { getToken } = useAuth();

  const fetchImages = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BACKEND_URL}/liked/bulk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(response.data.images);
      setImagesLoading(false);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setImagesLoading(false);
    }
  };

  const removeFromSaved = async (id:string) => {
    try {
        setImagesLoading(true);
        const token = await getToken();
        const response = await axios.post(`${BACKEND_URL}/toggle-like`,{ imageId : id }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast(`${response.data.message} Successfully`)
        await fetchImages();
        setImagesLoading(false);
        } catch (error) {
            console.error("Failed to remove saved image:", error);
        }
}

const copyToClipBoard = async (prompt:string) => {
  try {
    await navigator.clipboard.writeText(prompt);
    toast("Prompt Copied Successfully")
  }catch(e) {
    console.error('Failed to copy prompt: ', e);
  }
}

const downloadImage = async (imageUrl: string, fileName: string = "image") => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const extension = 'png';
    
    link.download = `${fileName.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
    document.body.appendChild(link);
    toast("Image Downloaded Successfully")
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed. Please try again.');
  }
};

  const handleImageClick = (image: savedimageprops) => {
    const index = images.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(index);
    setSelectedImage(image);
  };

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(images[newIndex] ?? null);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(images[newIndex] ?? null);
    }
  };

  useEffect(() => {
    fetchImages()
  },[])

  return (
    <div className="space-y-4" >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Saved Gallery</h2>
          <span className="text-xs select-none bg-secondary/40 font-semibold border border-secondary text-muted-foreground px-2 py-1 rounded-full">
            {images.length} images
          </span>
        </div>
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {imagesLoading
              ? [...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-neutral-300 h-48 rounded-lg animate-pulse"
                  />
                ))
              :images.map(image => (
                  <div
                    key={image.id}
                    className="cursor-pointer transition-transform mb-4 hover:scale-[1.02]"
                  >
                      <SavedImageCard
                        id={image.id}
                        imageUrl={image.imageUrl}
                        modelId={image.modelId}
                        likedImage={image.likedImage}
                        prompt={image.prompt}
                        userId={image.userId}
                        onClick={ () => removeFromSaved(image.id)}
                        onCopyClick = { () => copyToClipBoard(image.prompt) }
                        onDownloadClick = { () => downloadImage(image.imageUrl) }
                        onImageClick={() => handleImageClick(image)}
                        createdAt={image.createdAt}
                        />
                  </div>
              ))}
        </motion.div>

        {!imagesLoading && images.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No images yet. Start by generating some!
          </p>
        </motion.div>
      )}

<Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
      >
        <DialogContent className="max-w-6xl w-[60vw] h-[90vh] p-0 overflow-hidden">
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
              <div className="relative h-full w-full bg-transparent flex items-center justify-center">
                <div className="w-full h-full relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    disabled={currentImageIndex === 0}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white ${
                      currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.prompt}
                    className="object-contain w-full h-full max-h-[90vh]"
                    loading="lazy"
                  />
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    disabled={currentImageIndex === images.length - 1}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white ${
                      currentImageIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto">
                <DialogTitle className="text-xl font-semibold">
                  Image Details
                </DialogTitle>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Prompt
                  </h3>
                  <p className="text-sm">{selectedImage.prompt}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created At
                  </h3>
                  <p className="text-sm">
                    {new Date(selectedImage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => downloadImage(selectedImage.imageUrl)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => copyToClipBoard(selectedImage.prompt)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Prompt
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Saved