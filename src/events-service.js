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
        console.log(req.query)
        const { userId, page, limit } = req.query;

        let where = {};
        let skip;
        let take;

        if (userId) {
            where.userId = parseInt(userId);
        }

        if (page && limit) {
            skip = (page - 1) * parseInt(limit);
            take = parseInt(limit) || 10;
            console.log(take)
        }

        const events = await prisma.event.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        });

        res.json(events)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Ошибка при получении событий' });
    }
})

app.listen(3001, () => {
    console.log('Сервис истории действий запущен на порте 3001');
})