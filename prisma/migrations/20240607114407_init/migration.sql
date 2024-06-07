-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "surname" VARCHAR(25) NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "problems" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
