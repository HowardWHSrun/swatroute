-- CreateIndex
CREATE INDEX "Comment_routeId_idx" ON "Comment"("routeId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Route_title_idx" ON "Route"("title");

-- CreateIndex
CREATE INDEX "Route_author_idx" ON "Route"("author");

-- CreateIndex
CREATE INDEX "Route_createdAt_idx" ON "Route"("createdAt");
