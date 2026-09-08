-- CreateEnum
CREATE TYPE "Era" AS ENUM ('YEARS_OF_THE_TREES', 'FIRST_AGE', 'SECOND_AGE', 'THIRD_AGE');

-- CreateTable
CREATE TABLE "creatures" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "originEra" "Era" NOT NULL DEFAULT 'THIRD_AGE',
    "master" TEXT,
    "threatLevel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notable_beasts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "status" TEXT NOT NULL,
    "creatureId" INTEGER NOT NULL,

    CONSTRAINT "notable_beasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitats" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "habitats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creature_habitats" (
    "creatureId" INTEGER NOT NULL,
    "habitatId" INTEGER NOT NULL,

    CONSTRAINT "creature_habitats_pkey" PRIMARY KEY ("creatureId","habitatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "creatures_name_key" ON "creatures"("name");

-- CreateIndex
CREATE UNIQUE INDEX "notable_beasts_name_key" ON "notable_beasts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "habitats_name_key" ON "habitats"("name");

-- AddForeignKey
ALTER TABLE "notable_beasts" ADD CONSTRAINT "notable_beasts_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "creatures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creature_habitats" ADD CONSTRAINT "creature_habitats_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "creatures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creature_habitats" ADD CONSTRAINT "creature_habitats_habitatId_fkey" FOREIGN KEY ("habitatId") REFERENCES "habitats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
