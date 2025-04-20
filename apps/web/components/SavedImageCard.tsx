
import { savedimageprops } from './Saved'
import Image from 'next/image';
import { Button } from './ui/button';
import { Copy, Heart , ArrowDownToLine } from 'lucide-react';

interface savedimagecardprops extends savedimageprops {
    onClick: () => void;
    onCopyClick: () => void;
    onDownloadClick: () => void;
    onImageClick: () => void;
}


export default function SavedImageCard({ id , imageUrl , onClick , onCopyClick , onImageClick ,  onDownloadClick }:savedimagecardprops) {
    

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
                width={400}
                height={500}
                className="w-full"
                priority
                alt='image here'
                />
            </div>

            <div
                className={`absolute bottom-4 left-4 transition-opacity flex gap-[1vw] duration-300`}
            >
                <Button
                    variant={"link"}
                    onClick={(e) => handleButtonClick(e,onClick) }
                    className={`w-[3vw] h-[6vh] border rounded-full transition-all bg-red-500 text-white border-red-500"`}
                    >
                    <Heart fill={"white"} />
                </Button>
                <Button
                    variant={"secondary"}
                    onClick={(e) => handleButtonClick(e, onCopyClick)}
                    className={`w-[3vw] h-[6vh] border rounded-full transition-all bg-transparent text-white border-white
                    `}
                    >
                    <Copy className="h-4 w-4" />
                </Button>
                <Button
                    variant={"secondary"}
                    onClick={(e) => handleButtonClick(e , onDownloadClick)}
                    className={`w-[3vw] h-[6vh] border rounded-full transition-all bg-transparent text-white border-white
                    `}
                    >
                    <ArrowDownToLine className="h-6 w-6 " />
                </Button>
            </div>
        </div>
    )
}