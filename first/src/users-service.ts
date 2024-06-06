import express, { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

const app: express.Application = express();
app.use(express.json());

const prisma: PrismaClient = new PrismaClient();

app.get('/users', async (request: Request, response: Response) => {
    try {
        const users: User[] = await prisma.user.findMany({
            orderBy: {id: 'desc'}
        });
        response.json(users);
    } catch (error) {
        response.status(500).json({
            message: 'Произошла ошибка при получении списка пользователей'
        });
    }
});

app.post('/users', async (request: Request, response: Response) => {
    try {
        const user: User = await prisma.user.create({ data: request.body });
        await sendEvent('user-created', user);
        response.status(201).json(user);
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Произошла ошибка при создании пользователя'
        });
    }
});

app.put('/users/:id', async (request: Request, response: Response) => {
    try {
        const id: number = parseInt(request.params.id);
        const user: User = await prisma.user.update({
            where: { id },
            data: request.body,
        });
        await sendEvent('user-updated', user);
        response.json(user);
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Произошла ошибка при обновлении пользователя'
        });
    }
});

async function sendEvent(eventName: string, user: User) {
    try {
        await fetch(`http://localhost:3001/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName, userId: user.id }),
        });
    } catch (error) {
        console.error(`Произошла ошибка при отправке события в сервис историй действий: ${error}`);
    }
}

app.listen(3000, () => {
    console.log('Сервис пользователей запущен на порте 3000');
});