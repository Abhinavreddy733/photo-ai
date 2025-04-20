"use client"

import { Heart, Copy, ArrowDownToLine } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TImage } from "./Camera";

interface ImageCardProps extends TImage {
  onClickSave: () => void;
  onCopyClick: () => void;
  onDownloadClick: () => void;
  onImageClick: () => void;
}

export function ImageCard({
  id,
  status,
  imageUrl,
  likedImage,
  prompt,
  onClickSave,
  onCopyClick,
  onDownloadClick,
  onImageClick
}: ImageCardProps) {
  const [liked, setLiked] = useState(likedImage);
  if (!imageUrl) return null;

  useEffect(() => {
    if (likedImage !== undefined && likedImage !== null) {
      setLiked(likedImage);
    }
  }, [likedImage]);

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };
  
  return (
    <div
      className="group relative rounded-none overflow-hidden max-w-[300px] cursor-zoom-in"
      onClick={onImageClick}
    >
      <div className="flex gap-4 min-h-32">
        <Image
          key={id}
          src={imageUrl}
          alt={status === "Generated" ? "Generated image" : "Loading image"}
          width={400}
          height={500}
          className="w-full"
          priority
        />
      </div>

      <div
        className={`absolute bottom-4 left-4 transition-opacity flex gap-[1vw] duration-300 ${
          liked == "liked" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Button
          variant={"link"}
          onClick={(e) => handleButtonClick(e, onClickSave)}
          className={`w-[3vw] h-[6vh] border rounded-full transition-all
            ${liked == "like"
              ? "bg-red-500 text-white border-red-500"
              : "bg-transparent text-white border-white"}
          `}
        >
          <Heart fill={liked ? "white" : "none"} />
        </Button>
        <Button
          variant={"secondary"}
          onClick={(e) => handleButtonClick(e, onCopyClick)}
          className={`w-[3vw] h-[6vh] border rounded-full transition-all bg-transparent text-white border-white`}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant={"secondary"}
          onClick={(e) => handleButtonClick(e, onDownloadClick)}
          className={`w-[3vw] h-[6vh] border rounded-full transition-all bg-transparent text-white border-white`}
        >
          <ArrowDownToLine className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}