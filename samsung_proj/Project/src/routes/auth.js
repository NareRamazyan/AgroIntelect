const express = require('express');

const router = express.Router(); // Ավելացրու .Router()

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const { AppDataSource } = require('../data-source'); // Ճշտիր ուղին

const { UserSchema } = require('../entities/User');

const { HistorySchema } = require('../entities/History');



// Եթե hashPassword ֆունկցիան ունես middleware-ում, ներմուծիր այն

// Եթե ոչ, կարող ես bcrypt.hash օգտագործել հենց այստեղ

const bcryptjs = require('bcryptjs');



const userRepository = AppDataSource.getRepository(UserSchema);

const historyRepository = AppDataSource.getRepository(HistorySchema);



// Գրանցում (Register)

router.post("/register", async (req, res) => {

    try {

        const { login, email, pass, name, phone } = req.body;



        if (!login || !email || !pass) {

            return res.status(400).json({ error: "Login, email, and password are required" });

        }



        // Գաղտնաբառի հեշավորում

        const salt = await bcryptjs.genSalt(10);

        const hashedPassword = await bcryptjs.hash(pass, salt);

       

        const newUser = userRepository.create({

            login,

            email,

            pass: hashedPassword,

            name,

            phone

        });

       

        await userRepository.save(newUser);

        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {

        res.status(400).json({

            error: "Registration failed",

            details: error.message

        });

    }

});



// Մուտք (Login)

router.post("/login", async (req, res) => {

    try {

        const { email, pass } = req.body;



        const user = await userRepository.findOneBy({ email });

        if (!user) {

            return res.status(404).json({ error: "User not found" });

        }



        const isMatch = await bcrypt.compare(pass, user.pass);

        if (!isMatch) {

            return res.status(401).json({ error: "Invalid password" });

        }



        const token = jwt.sign(

            { userId: user.id },

            process.env.JWT_SECRET || "SUPER_SECRET_KEY",

            { expiresIn: "24h" }

        );



        await historyRepository.save({

            action: "User logged in",

            user: user

        });



        res.status(200).json({

            message: "Login successful",

            token: token,

            userId: user.id

        });

    } catch (error) {

        res.status(500).json({ error: "Login failed" });

    }

});



module.exports = router; 

