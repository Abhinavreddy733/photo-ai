-- CreateTable
CREATE TABLE "LikedImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "modelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "outputImagesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikedImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedImages" ADD CONSTRAINT "LikedImages_outputImagesId_fkey" FOREIGN KEY ("outputImagesId") REFERENCES "OutputImages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
