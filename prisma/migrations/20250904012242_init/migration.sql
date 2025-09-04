-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "gpxText" TEXT NOT NULL,
    "polyline" TEXT NOT NULL,
    "traffic" INTEGER NOT NULL,
    "elevation" INTEGER NOT NULL,
    "scenic" INTEGER NOT NULL,
    "surface" INTEGER NOT NULL,
    "safety" INTEGER NOT NULL,
    "access" INTEGER NOT NULL
);
