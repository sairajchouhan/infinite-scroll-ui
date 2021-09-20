const { PrismaClient } = require('@prisma/client')
const { lorem } = require('faker')

const prisma = new PrismaClient()

const seed = async () => {
  const postPromises = []

  new Array(50).fill(0).forEach((_) => {
    postPromises.push(
      prisma.post.create({
        data: {
          title: lorem.sentence(),
        },
      })
    )
  })
  const posts = await Promise.all(postPromises)
  console.log(posts)
}

seed()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
