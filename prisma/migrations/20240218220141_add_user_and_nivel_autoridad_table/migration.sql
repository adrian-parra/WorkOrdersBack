-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "nivel_autoridad" INTEGER NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "estatus" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_nivel_autoridad_fkey" FOREIGN KEY ("nivel_autoridad") REFERENCES "nivel_autoridad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nivel_autoridad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nivel_autoridad" INTEGER NOT NULL,
    "concepto" TEXT NOT NULL,
    "rol_encriptado" TEXT
);
