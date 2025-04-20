/*
  Warnings:

  - You are about to drop the `LikedImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OutputImageLiked" AS ENUM ('like', 'unlike');

-- DropForeignKey
ALTER TABLE "LikedImages" DROP CONSTRAINT "LikedImages_outputImageId_fkey";

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "likedImage" "OutputImageLiked" NOT NULL DEFAULT 'unlike';

-- DropTable
DROP TABLE "LikedImages";
