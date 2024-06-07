"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.get('/users', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            orderBy: { id: 'desc' }
        });
        response.json(users);
    }
    catch (error) {
        response.status(500).json({
            message: 'Произошла ошибка при получении списка пользователей'
        });
    }
}));
app.post('/users', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.create({ data: request.body });
        yield sendEvent('user-created', user);
        response.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Произошла ошибка при создании пользователя'
        });
    }
}));
app.put('/users/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(request.params.id);
        const user = yield prisma.user.update({
            where: { id },
            data: request.body,
        });
        yield sendEvent('user-updated', user);
        response.json(user);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Произошла ошибка при обновлении пользователя'
        });
    }
}));
function sendEvent(eventName, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetch(`http://localhost:3001/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName, userId: user.id }),
            });
        }
        catch (error) {
            console.error(`Произошла ошибка при отправке события в сервис историй действий: ${error}`);
        }
    });
}
app.listen(3000, () => {
    console.log('Сервис пользователей запущен на порте 3000');
});
