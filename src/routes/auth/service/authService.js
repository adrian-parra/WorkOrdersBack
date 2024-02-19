import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función para verificar si el usuario está registrado en la base de datos
export const checkIfUserExists = async (username) => {
  const user = await prisma.usuarios.findFirst({
    where: { nombre_usuario: username },
    include: {
      autoridad: true
    }
  })

  return user
}

export const checkUserEqualsRefreshToken = async (refreshToken) => {
  return await prisma.usuarios.findFirst({
    where: {
      token: {
        equals: refreshToken
      }
    }
  })
}
