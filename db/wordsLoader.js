const fs = require('fs')
const mongoose = require('mongoose')
const Word = require('../model/Word.js')

mongoose
    .connect("mongodb://127.0.0.1:27017/antakshari")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err))

fs.readFile('words_alpha.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }

    const words = data.split('\n')

    try {
        for (const word of words) {
            const newWord = new Word({ word: word.trim() })
            await newWord.save()
        }
        console.log('Database populated successfully!')
    } catch (error) {
        console.error('Error populating database:', error)
    }
})