import { FRASES } from "./frases.js";

let vidasRestantes = 3;
let currentGuess = [];
let fraseAdivinarString = FRASES[Math.floor(Math.random() * FRASES.length)]
let fraseAdivinarStringTrim = fraseAdivinarString.split(" ").join("")
let intentosDiv = document.getElementById("intentosRestantes")

function initBoard() {
    let board = document.getElementById("game-board");

    let row = document.createElement("div")
    row.className = "letter-row"

    for (let i = 0; i < fraseAdivinarString.length; i++) {
        if(fraseAdivinarString[i] != ' '){
            let box = document.createElement("div")
            box.id = "letra"+i
            box.className = "letter-box"
            row.appendChild(box)
        }
        else
        {
            /*let box = document.createElement("span")
            box.className = "letter-space"
            box.id = i
            row.appendChild(box)*/
            row = document.createElement("div")
            row.className = "letter-row"
        }

        board.appendChild(row)
    }
    
    intentosDiv.textContent = "Vidas restantes: "+vidasRestantes
    
    toastr.options = {
        positionClass: 'toast-top-center'
    };
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function insertLetter (pressedKey) {
    let upperPressedKey = pressedKey.toUpperCase()

    //let row = document.getElementsByClassName("letter-row")[0]
    //let box;
    let indiceLetra = fraseAdivinarString.indexOf(upperPressedKey)
    let pressedButton = document.getElementById(pressedKey)
    if(indiceLetra > -1)
        pressedButton.classList.add("acierto")
    else
    {
        pressedButton.classList.add("fallo")
        vidasRestantes -= 1;
    }

    while(indiceLetra > -1)
    {
        let box = document.getElementById("letra"+indiceLetra);
        animateCSS(box, "pulse")
        box.textContent = upperPressedKey
        box.classList.add("filled-box")
        currentGuess[indiceLetra] = upperPressedKey
        indiceLetra = fraseAdivinarString.indexOf(upperPressedKey, indiceLetra+1)
    }

    if (currentGuess.join("") === fraseAdivinarStringTrim) {
        toastr.success("Acertaste!!")
        vidasRestantes = 0
        return
    } else {
        intentosDiv.textContent = "Vidas restantes: "+vidasRestantes
        if(vidasRestantes === 1)
            intentosDiv.style.setProperty("color","red")

        if (vidasRestantes === 0) {
            toastr.info(`"${fraseAdivinarString}"`)
            toastr.error("Meeeec!! No has hacertado pero que sepas que...")
        }
    }
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {

    if (vidasRestantes === 0) {
        return
    }

    let pressedKey = String(e.key)
    
    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

initBoard();
