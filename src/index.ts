import  express  from "express";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { title } from "process";
const app = express();
const prisma = new PrismaClient()


const userSchema = z.object({
    username : z.string(),
    password : z.string(),
    firstName : z.string(),
    lastName : z.string()
});

app.use(express.json());


app.post('/',async (req,res) => {
    const response = userSchema.safeParse(req.body);
    if(!response.success){
        res.json({
            msg : "Invalid Credential"
        });
    }

    const {username , password , lastName , firstName} = req.body;


    try{
        const response = await prisma.user.create({
            data : {
                username,
                password,
                firstName,
                lastName
            }
        });
        res.json({
            response : response
        });
        console.log(response);
    }
    catch(err){
        res.json({
            msg : "Server Error"
        });
        console.log("Server Error");
    }
})


const todoSchema = z.object({
    title : z.string(),
    description : z.string(),
    userId : z.number()
})

app.post('/todo' , async (req,res) => {

    const success = todoSchema.safeParse(req.body);
    if(!success.success){
        res.json({
            msg : "Invalid Credential"
        });
    }


    const {title , description, userId} = req.body;
    const response = await prisma.todo.create({
        data : {
            title,
            description,
            userId
        }
    });
    res.json({
        response : response 
    });
    console.log(response);
})


app.get('/',async (req,res) => {
    const response = await prisma.todo.findMany({
        where : {
            done : false
        },
        select : {
            user : true,
            title : true,
            description : true
        }
    });
    res.json({
        response : response
    });
});




app.listen(3000,()=>{
    console.log('Server Started at port 3000');
})