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
const zod_1 = require("zod");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const userSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string()
});
app.use(express_1.default.json());
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = userSchema.safeParse(req.body);
    if (!response.success) {
        res.json({
            msg: "Invalid Credential"
        });
    }
    const { username, password, lastName, firstName } = req.body;
    try {
        const response = yield prisma.user.create({
            data: {
                username,
                password,
                firstName,
                lastName
            }
        });
        res.json({
            response: response
        });
        console.log(response);
    }
    catch (err) {
        res.json({
            msg: "Server Error"
        });
        console.log("Server Error");
    }
}));
const todoSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    userId: zod_1.z.number()
});
app.post('/todo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const success = todoSchema.safeParse(req.body);
    if (!success.success) {
        res.json({
            msg: "Invalid Credential"
        });
    }
    const { title, description, userId } = req.body;
    const response = yield prisma.todo.create({
        data: {
            title,
            description,
            userId
        }
    });
    res.json({
        response: response
    });
    console.log(response);
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield prisma.todo.findMany({
        where: {
            done: false
        },
        select: {
            user: true,
            title: true,
            description: true
        }
    });
    res.json({
        response: response
    });
}));
app.listen(3000, () => {
    console.log('Server Started at port 3000');
});
