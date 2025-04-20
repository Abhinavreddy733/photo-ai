/*
  Warnings:

  - You are about to drop the column `outputImagesId` on the `LikedImages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[outputImageId]` on the table `LikedImages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outputImageId` to the `LikedImages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LikedImages" DROP CONSTRAINT "LikedImages_outputImagesId_fkey";

-- AlterTable
ALTER TABLE "LikedImages" DROP COLUMN "outputImagesId",
ADD COLUMN     "outputImageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LikedImages_outputImageId_key" ON "LikedImages"("outputImageId");

-- AddForeignKey
ALTER TABLE "LikedImages" ADD CONSTRAINT "LikedImages_outputImageId_fkey" FOREIGN KEY ("outputImageId") REFERENCES "OutputImages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
