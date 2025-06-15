var quran;

fetch('ajza.json')
    .then(response => response.json()) // Parse JSON
    .then(data => quran = data) // Work with JSON data
    .catch(error => console.error('Error fetching JSON:', error));

function showBoxes(a, b, c) {
    preTestBox.style.display = a ? "block" : "none"
    testBox.style.display = b ? "block" : "none"
    endTestEl.style.display = c ? "block" : "none"
}

// pretest
const fieldset = document.getElementById("select-ajza")
const preTestBox = document.getElementById("pretest-box")

// english numbers to arabic
String.prototype.toArabicDigits = function(){
 var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
 return this.replace(/[0-9]/g, function(w){
  return id[+w]
 });
}

// create inputs functions
const listOfInputEls = []
const selectedAjza = []
function createInputs() {
    // loop
    for (var juz = 1; juz <= 30; juz++) {
        // create input
        const input = document.createElement("input")
        listOfInputEls.push(input)
        input.type = "checkbox"
        input.id = juz.toString()
        input.value = juz
        fieldset.appendChild(input)
        // selected ajza
        const inputJuz = juz;
        input.oninput = (_e) => {
            if (selectedAjza.find(item => item === inputJuz) === undefined) {
                selectedAjza.push(inputJuz)
            } else {
                selectedAjza.splice(selectedAjza.findIndex(item => item === inputJuz), 1)
            }
        }
        // create label
        const label = document.createElement("label")
        label.htmlFor = juz.toString()
        label.innerText = juz.toString().toArabicDigits()
        fieldset.appendChild(label)
    }
}

createInputs()

// select all button
const selectAllButton = document.getElementById("select-all-button")
selectAllButton.onclick = (_e) => {
    for (const el of fieldset.children) {
        if (el.hasAttribute("value")) {
            el.click()
        }
    }
}

// start test
const testBox = document.getElementById("test-box")
function startTest() {
    // hide pre test box
    // show test box
    showBoxes(false, true, false)
    nextButton.disabled = false
}
const startButton = document.getElementById("start-button")
startButton.onclick = (_e) => startTest()

// next button
const quranBox = document.getElementById("quran-box")
var selectedAjzaCopy = []
var currentLetterCount = 0
var currentJuz = 0
var verseIndex, verse;
var firstTime = true

function next() {
    // start of function
    if (firstTime) {
        selectedAjzaCopy = [...selectedAjza, -1]
        firstTime = false
    }
    
    // reset variables if needed
    if (currentLetterCount === 0 || currentLetterCount > 1111 || verseIndex === quran[currentJuz-1].length-1) {
        console.log(currentJuz)

        currentJuz = selectedAjzaCopy[0]
        if (currentJuz !== -1) {
            selectedAjzaCopy.splice(0, 1)

            verseIndex = Math.floor(Math.random()*(quran[currentJuz-1]["endBound"]-2)) 
            verse = quran[currentJuz-1]["verses"][verseIndex-1]
            currentLetterCount = 0

            const juzEl = document.createElement("h1")
            juzEl.innerText = currentJuz
            quranBox.appendChild(juzEl)
        } else {
            endTest()
        }
    }

    if (currentJuz !== -1) {
        // get verse
        verse = quran[currentJuz-1]["verses"][verseIndex-1]

        // display verse
        const verseEl = document.createElement("p")
        verseEl.innerText = verse["text"]
        quranBox.appendChild(verseEl)

        // update variables
        currentLetterCount += verse["text"].length
        verseIndex++;
    }
}

function nextClick() {
    next()
}

function n100() {
    for (var i = 0; i < 100; i++) {
        next()
    }
}

nextButton = document.getElementById("next-button")
nextButton.onclick = (_e) => nextClick()

// end test screen
const endTestEl = document.getElementById("post-test-box")
function endTest() {
    currentLetterCount = 0
    nextButton.disabled = true
    quranBox.innerHTML = ""
    showBoxes(false, false, true)
    firstTime = true
    currentJuz = 0
}

// end button
document.getElementById("retake-test-button").onclick = (_e) => {
    showBoxes(true, false, false)
}