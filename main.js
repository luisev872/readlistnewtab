var rhombusImage = new Image()
rhombusImage.src = chrome.runtime.getURL("/images/rhombus.svg")


const drawRhombus = (angle, cv) => {
    const ctx = cv.getContext('2d')
    ctx.save()
    ctx.clearRect(0, 0, cv.width, cv.height)
    ctx.translate(cv.width/2, cv.height/2)
    ctx.rotate(angle)
    ctx.drawImage(rhombusImage, -cv.width/2, -cv.height/2, cv.width, cv.height)
    ctx.restore()
}


let numCols = 0
let numRows = 0
let lastNumCols = 0
let lastNumRows = 0

const renderSquares = () => {
    lastNumCols = numCols
    lastNumRows = numRows

    const rect = document.querySelector('body').getBoundingClientRect()

    numCols = Math.round(rect.width / 60) - 1
    numRows = Math.round(rect.height / 60) - 1

    if (numCols === lastNumCols && numRows === lastNumRows) {
        return
    }

    const container = document.querySelector('.container')
    container.width = numCols * 60
    container.height = numRows * 60

    const tab = document.querySelector('.tab')
    tab.width = (numCols - 5) * 60
    tab.height = (numRows - 5) * 60

    container.style.gridTemplateColumns = `repeat(${numCols}, 1fr)` 
    container.style.gridTemplateRows = `repeat(${numRows}, 1fr)`

    const numberSquares = numCols * numRows
    const lastNumberSquares = lastNumCols * lastNumRows
    const diff = numberSquares - lastNumberSquares

    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            const cv = document.createElement('canvas')
            cv.width = 60
            cv.height = 60
            container.appendChild(cv)
            drawRhombus(0, cv)
        }
    } else {
        let squares = document.querySelectorAll('.squarebox')
        for (let i = 0; i < squares.length; i++) {
            squares[i].remove()
            diff++
            if (diff === 0) break
        }
    }
}
renderSquares()

addEventListener("resize", () => {renderSquares()})

const mouse = {x: 0, y: 0, hasChanged: false}

addEventListener("mousemove", (e) => {
    mouse.x = e.pageX
    mouse.y = e.pageY
    mouse.hasChanged = true
})

setInterval(() => {
    if (!mouse.hasChanged) return
    mouse.hasChanged = false
    document.querySelectorAll('canvas').forEach((cv) => {
        const rect = cv.getBoundingClientRect()
        const dx = rect.left + rect.width / 2 - mouse.x
        const dy = rect.top + rect.height / 2 - mouse.y
        const theta = Math.atan2(dy, dx)
        drawRhombus(theta + Math.PI/2, cv)
    })
}, 50)