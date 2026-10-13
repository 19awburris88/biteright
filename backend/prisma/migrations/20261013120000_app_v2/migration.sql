-- DropForeignKey
ALTER TABLE "PreferenceProfile" DROP CONSTRAINT "PreferenceProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Swipe" DROP CONSTRAINT "Swipe_dishId_fkey";

-- DropForeignKey
ALTER TABLE "Swipe" DROP CONSTRAINT "Swipe_userId_fkey";

-- AlterTable
ALTER TABLE "Dish" ADD COLUMN     "dietary" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "dietary" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "neighborhood" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SavedRestaurant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedRestaurant_userId_restaurantId_key" ON "SavedRestaurant"("userId", "restaurantId");

-- Remove duplicate swipes (keep the most recent per user+dish) before adding the unique index
DELETE FROM "Swipe" a USING "Swipe" b
WHERE a."userId" = b."userId" AND a."dishId" = b."dishId" AND a."id" < b."id";

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_userId_dishId_key" ON "Swipe"("userId", "dishId");

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRestaurant" ADD CONSTRAINT "SavedRestaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRestaurant" ADD CONSTRAINT "SavedRestaurant_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenceProfile" ADD CONSTRAINT "PreferenceProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

