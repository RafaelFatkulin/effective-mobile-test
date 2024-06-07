import { PrismaClient } from '@prisma/client'
import { fa, fakerRU as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
    for(let i = 0; i < 1000000; i++) {
        const sex = faker.person.sex() as "female" | "male"
        const user = {
            sex,
            name: faker.person.firstName(sex),
            surname: faker.person.lastName(sex),
            age: faker.number.int({min: 18, max: 100}),
            problems: faker.datatype.boolean()
        }

        await prisma.user.create({data: user})
    }
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })