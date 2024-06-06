const express = require('express')
const { PrismaClient } = require("@prisma/client");

const app = express()
app.use(express.json())

const prisma = new PrismaClient();

app.post('/events', async (req, res) => {
    try {
        console.log('events POST body', req.body)
        const {eventName, userId} = req.body
        console.log(req.body)
        const event = await prisma.event.create({
            data: {
                eventName,
                userId
            }
        })

        res.json(event)
    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Ошибка при создании события'});
    }
})

app.get('/events', async (req, res) => {
    try {
        const { userId, page, limit } = req.query;
        const where = userId ? { userId: parseInt(userId) } : {};
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = page && limit ? parseInt(limit) : undefined;

        const events = await prisma.event.findMany({
            where,
            skip,
            take,
            orderBy: {createdAt: 'desc'}
        })

        res.json(events)
    } catch (e) {
        console.error(e)
        res.status(500).json({message: 'Ошибка при получении событий'});
    }
})

app.listen(3001, () => {
    console.log('Сервис истории действий запущен на порте 3001');
})