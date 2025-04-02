const currentWordDisplay = document.getElementById('current-word')
const wordInput = document.getElementById('word-input')
const submitWordButton = document.getElementById('submit-word')
const startGameButton = document.getElementById('start-game')
const messageDisplay = document.getElementById('message')
const scoreDisplay = document.getElementById('score')
const timerDisplay = document.getElementById('timer')

let score = 0
let previousWord = ''
let consecutiveWords = 0
let timeLeft = 30

async function startGame() {
    score = 0
    consecutiveWords = 0
    timeLeft = 30
    timerDisplay.textContent = `${timeLeft}s`
    messageDisplay.textContent = ''
    startGameButton.style.display = 'none'
    wordInput.style.display = 'inline-block'
    submitWordButton.style.display = 'inline-block'
    const response = await fetch('http://localhost:5000/api/start')
    const data = await response.json()
    currentWordDisplay.textContent = data.word
    previousWord = data.word
    scoreDisplay.textContent = score
    wordInput.focus()
    startTimer()
}

async function validateWord(word) {
    const response = await fetch('http://localhost:5000/api/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word: word, previousWord: previousWord })
    })

    if (!response.ok) {
        const error = await response.json()
        messageDisplay.textContent = error.error || 'An error occurred'
        return
    }

    const data = await response.json()
    return data
}

submitWordButton.addEventListener('click', async () => {
    const word = wordInput.value.trim()
    if (!word) {
        messageDisplay.textContent = 'Please enter a word.'
        return
    }

    const result = await validateWord(word)

    if (result.valid) {
        consecutiveWords++
        if (consecutiveWords === 2) score += 5
        else if (consecutiveWords === 3) score += 10
        else if (consecutiveWords > 3) score += 15
        messageDisplay.textContent = 'Correct!'
        scoreDisplay.textContent = score += word.length
        currentWordDisplay.textContent = result.nextWord
        previousWord = result.nextWord
        timeLeft = 30
        timerDisplay.textContent = `${timeLeft}s`
    } else {
        consecutiveWords = 0
        messageDisplay.textContent = result.message
    }
    wordInput.value = ''
    wordInput.focus()
})

function startTimer() {
    const interval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--
            timerDisplay.textContent = `${timeLeft}s`
        } else {
            wordInput.blur()
            wordInput.value = ''
            wordInput.style.display = 'none'
            submitWordButton.style.display = 'none'
            startGameButton.style.display = 'block'
            messageDisplay.textContent = 'Time is up!'
            clearInterval(interval)
        }
    }, 1000)
}

startGameButton.addEventListener('click', startGame)