import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const getAllUserService = async () => {
  const users = prisma.usuarios.findMany()
  return users
}

export const getUserByIdService = async (id) => {
  const userById = prisma.usuarios.findFirst(
        {where: {id: id}}
    )
  return userById
}

export const createUserService = async (payload) => {
  payload.password = await bcrypt.hash(payload.password, 10)
  const createUser = prisma.usuarios.create(
        {data: payload}
    )
  return createUser
}

export const updateUserService = async (id, payload) => {
  const updateUser = prisma.usuarios.update(
    {where: {id: Number(id)},
      data: payload
    })
  return updateUser
}
