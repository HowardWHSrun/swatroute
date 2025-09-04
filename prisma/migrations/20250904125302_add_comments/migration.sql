-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "traffic" INTEGER,
    "elevation" INTEGER,
    "scenic" INTEGER,
    "surface" INTEGER,
    "safety" INTEGER,
    "access" INTEGER,
    "routeId" TEXT NOT NULL,
    CONSTRAINT "Comment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
