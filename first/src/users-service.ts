import express, {Request, Response} from "express";
import {PrismaClient, User} from "@prisma/client";

const app = express()
app.use(express.json())

const prisma = new PrismaClient()

app.get('/users', async (request: Request, response: Response) => {
    try {
        const users = await prisma.user.findMany()
        response.json(users)
    } catch (error) {
        response.status(500).json({
            message: 'Произошла ошибка при создании пользователя'
        })
    }
})

app.post('/users', async(request: Request, response: Response) => {
    try {
        const user = await prisma.user.create({data: request.body})
        await sendEvent('user-created', user);
        return response.status(201).json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: 'Произошла ошибка при создании пользователя'
        })
    }
})

app.put('/users/:id', async (request: Request, response: Response) => {
    try {
        const id = parseInt(request.params.id)
        const user = await prisma.user.update({
            where: { id },
            data: request.body,
        })
        await sendEvent('user-updated', user);
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: 'Произошла ошибка при обновлении пользователя'
        })
    }
})

async function sendEvent(eventName: string, user: User) {
    const response = await fetch(`http://localhost:3001/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eventName,
            data: user
        })
    })

    if(!response.ok) {
        console.error(`Произошла ошибка при отправке события в сервис историт действий: ${response.statusText}`)
    }
}

app.listen(3000, () => {
    console.log('Сервис пользователей запущен на порте 3000');
})