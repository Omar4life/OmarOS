var isDrawing = false;
var isEraserMode = false;
var isMovieGameMode = false; 
var isMatrixMode = false;
var matrixInterval = null;

function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    if (timeText) {
        timeText.innerHTML = currentTime;
    }
}
setInterval(updateTime, 1000);

window.addEventListener("mouseup", function() {
    isDrawing = false;
});

var gridContainer = document.querySelector("#canvasGrid");
var colorInput = document.querySelector("#colorPicker");
var eraserButton = document.querySelector("#eraserBtn");
var clearButton = document.querySelector("#clearCanvasBtn");
var saveButton = document.querySelector("#saveProjectBtn");
var loadDropdown = document.querySelector("#loadProjectSelect");

if (gridContainer && colorInput) {
    for (var i = 0; i < 256; i++) {
        var tile = document.createElement("div");
        tile.classList.add("pixel-tile");
       
        tile.addEventListener("mousedown", function(e) {
            isDrawing = true;
            var currentBrushColor = isEraserMode ? "#ffffff" : colorInput.value;
            e.target.style.backgroundColor = currentBrushColor;
        });
       
        tile.addEventListener("mouseenter", function(e) {
            if (isDrawing) {
                var currentBrushColor = isEraserMode ? "#ffffff" : colorInput.value;
                e.target.style.backgroundColor = currentBrushColor;
            }
        });
       
        gridContainer.appendChild(tile);
    }
}

if (eraserButton) {
    eraserButton.addEventListener("click", function() {
        isEraserMode = !isEraserMode;
        if (isEraserMode) {
            eraserButton.classList.add("active");
            eraserButton.innerText = "Brush";
        } else {
            eraserButton.classList.remove("active");
            eraserButton.innerText = "Eraser";
        }
    });
}

if (clearButton) {
    clearButton.addEventListener("click", function() {
        var allTiles = document.querySelectorAll(".pixel-tile");
        allTiles.forEach(function(tile) {
            tile.style.backgroundColor = "#ffffff";
        });
    });
}

if (saveButton) {
    saveButton.addEventListener("click", function() {
        var projectName = prompt("Enter a name for your drawing:");
       
        if (projectName === null || projectName.trim() === "") {
            alert("Save cancelled: Please enter a valid name.");
            return;
        }

        var tiles = document.querySelectorAll(".pixel-tile");
        var colorArray = [];

        tiles.forEach(function(tile) {
            var color = tile.style.backgroundColor || "rgb(255, 255, 255)";
            colorArray.push(color);
        });

        localStorage.setItem("pixel_art_" + projectName, JSON.stringify(colorArray));
        alert("Project '" + projectName + "' saved successfully!");
       
        updateLoadDropdown();
    });
}

function updateLoadDropdown() {
    if (!loadDropdown) return;
   
    loadDropdown.innerHTML = '<option value="">Saved Projects</option>';
   
    for (var j = 0; j < localStorage.length; j++) {
        var storageKey = localStorage.key(j);
       
        if (storageKey && storageKey.startsWith("pixel_art_")) {
            var plainName = storageKey.replace("pixel_art_", "");
            var opt = document.createElement("option");
            opt.value = storageKey;
            opt.innerText = plainName;
            loadDropdown.appendChild(opt);
        }
    }
}

if (loadDropdown) {
    loadDropdown.addEventListener("change", function(e) {
        var selectedKey = e.target.value;
        if (!selectedKey) return;
       
        var savedColorsData = localStorage.getItem(selectedKey);
        if (savedColorsData) {
            var parsedColorsArray = JSON.parse(savedColorsData);
            var gridTilesArray = document.querySelectorAll(".pixel-tile");
           
            gridTilesArray.forEach(function(tile, index) {
                if (parsedColorsArray[index]) {
                    tile.style.backgroundColor = parsedColorsArray[index];
                }
            });
        }
    });
}

updateLoadDropdown();

var welcomeScreen = document.querySelector("#window");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var welcomeScreenOpen = document.querySelector("#welcomeopen");

var pixelScreen = document.querySelector("#pixel-window");
var pixelScreenClose = document.querySelector("#pixelclose");
var pixelScreenOpen = document.querySelector("#pixelopen");
var terminalScreen = document.querySelector("#terminal-window");
var terminalScreenClose = document.querySelector("#terminalclose");
var terminalScreenOpen = document.querySelector("#terminalopen");

if (welcomeScreen) {
    welcomeScreen.style.top = (window.innerHeight / 2 - welcomeScreen.offsetHeight / 2) + "px";
    welcomeScreen.style.left = (window.innerWidth / 2 - welcomeScreen.offsetWidth / 2) + "px";
}
if (pixelScreen) {
    pixelScreen.style.top = (window.innerHeight / 2 - pixelScreen.offsetHeight / 2) + "px";
    pixelScreen.style.left = (window.innerWidth / 2 - pixelScreen.offsetWidth / 2) + 150 + "px";
}
if (terminalScreen) {
    terminalScreen.style.top = (window.innerHeight / 2 - terminalScreen.offsetHeight / 2) + 50 + "px";
    terminalScreen.style.left = (window.innerWidth / 2 - terminalScreen.offsetWidth / 2) - 100 + "px";
}

function closeWindow(element) {
    if (element) element.style.display = "none";
}

function openWindow(element) {
    if (!element) return;
    element.style.display = "block";
    element.style.top = (window.innerHeight / 2 - element.offsetHeight / 2) + "px";
    element.style.left = (window.innerWidth / 2 - element.offsetWidth / 2) + "px";
}

if (welcomeScreenClose && welcomeScreen) {
    welcomeScreenClose.addEventListener("click", function() { closeWindow(welcomeScreen); });
}
if (welcomeScreenOpen && welcomeScreen) {
    welcomeScreenOpen.addEventListener("click", function() { openWindow(welcomeScreen); });
}
if (pixelScreenClose && pixelScreen) {
    pixelScreenClose.addEventListener("click", function() { closeWindow(pixelScreen); });
}
if (pixelScreenOpen && pixelScreen) {
    pixelScreenOpen.addEventListener("click", function() { openWindow(pixelScreen); });
}
if (terminalScreenClose && terminalScreen) {
    terminalScreenClose.addEventListener("click", function() { closeWindow(terminalScreen); });
}
if (terminalScreenOpen && terminalScreen) {
    terminalScreenOpen.addEventListener("click", function() {
        openWindow(terminalScreen);
        var inputEl = document.querySelector("#terminalInput");
        if (inputEl) inputEl.focus();
    });
}

dragElement(document.getElementById("window"));
dragElement(document.getElementById("pixel-window"));
dragElement(document.getElementById("terminal-window"));

var terminalInput = document.querySelector("#terminalInput");
var terminalHistory = document.querySelector("#terminalHistory");
var terminalBody = document.querySelector(".terminal-body");

if (terminalInput && terminalHistory && terminalBody) {
    terminalInput.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key && e.key.toLowerCase() === "c") {
            if (isMovieGameMode) {
                e.preventDefault();
                isMovieGameMode = false;
                var logLine = document.createElement("div");
                logLine.innerHTML = '<span style="color: #ff3333;">> Guessing game closed. Exited game prompt.</span>';
                terminalHistory.appendChild(logLine);
            } else if (isMatrixMode) {
                e.preventDefault();
                isMatrixMode = false;
                clearInterval(matrixInterval);
                
                var overlay = document.getElementById("matrixOverlayCanvas");
                if (overlay) {
                    overlay.remove();
                }
                window.onresize = null;
                
                var logLine = document.createElement("div");
                logLine.innerHTML = '<span style="color: #ff3333;">> Connection dropped. Matrix core detached.</span>';
                terminalHistory.appendChild(logLine);
            }
            terminalInput.value = "";
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        if (e.key === "Enter") {
            var rawInput = terminalInput.value;
            var command = rawInput.trim().toLowerCase();
            
            if (isMatrixMode) {
                terminalInput.value = "";
                return;
            }
            if (command === "" && !isMovieGameMode) return;

            var logLine = document.createElement("div");
            logLine.innerHTML = '<span style="color: #00aaff; font-weight: bold;">omarOS:~$</span> ' + rawInput;
            terminalHistory.appendChild(logLine);

            var responseLines = [];

            if (isMovieGameMode) {
                if (command === "inception") {
                    responseLines = ["<span style='color: #00ff00; font-weight: bold;'>Correct!</span> You guessed it!"];
                    isMovieGameMode = false; 
                } else {
                    responseLines = [
                        "<span style='color: #ff3333;'>Incorrect!</span>",
                        "Try again, or press <span class='highlight'>Ctrl + C</span> to exit."
                    ];
                }
            } else {
                if (command === "-help") {
                    responseLines = [
                        "Available commands:",
                        "  <span class='highlight'>-help</span>       : Show this list",
                        "  <span class='highlight'>-about</span>      : Learn more about OmarOS",
                        "  <span class='highlight'>-skills</span>     : See my tech stack",
                        "  <span class='highlight'>-movie</span>      : Play my favorite movie guesser game",
                        "  <span class='highlight'>-matrix</span>     : Enter the digital matrix pipeline stream",
                        "  <span class='highlight'>-open pixel</span> : Launch the Pixel Art window",
                        "  <span class='highlight'>-open omaros</span>: Launch the Welcome introduction window",
                        "  <span class='highlight'>-whoami</span>     : Find out who you are",
                        "  <span class='highlight'>-clear</span>      : Clear the terminal screen"
                    ];
                } else if (command === "-about") {
                    responseLines = ["A customized web-based Operating System built with HTML, CSS, and vanilla JavaScript."];
                } else if (command === "-skills") {
                    responseLines = [
                        "Languages & tools:",
                        "  - HTML/CSS",
                        "  - JavaScript",
                        "  - Python (Currently learning)"
                    ];
                } else if (command === "-open pixel") {
                    openWindow(pixelScreen);
                    responseLines = ["Launching Pixel Art application framework..."];
                } else if (command === "-open omaros") {
                    openWindow(welcomeScreen);
                    responseLines = ["Launching OmarOS core dashboard view..."];
                } else if (command === "-whoami") {
                    openWindow(welcomeScreen);
                    responseLines = ["You are yourself"];
                } else if (command === "-movie") {
                    responseLines = [
                        "<span style='color: #ffff00; font-weight: bold;'>[Movie Guessing Game Engine]</span>",
                        "Guess my favorite movie based on this iconic quote:",
                        "\"<span style='color: #00ffaa; font-style: italic;'>You never really remember the beginning of a dream, do you? You always wind up right in the middle of what's going on.</span>\"",
                        "Type your guess below and press Enter (or <span class='highlight'>Ctrl + C</span> to give up):"
                    ];
                    isMovieGameMode = true;
                } else if (command === "-matrix") {
                    responseLines = [
                        "<span style='color: #00ff00;'>Establishing transparent system overlay...</span>",
                        "Matrix feed active. Press <span class='highlight'>Ctrl + C</span> to escape."
                    ];
                    isMatrixMode = true;
                    
                    setTimeout(function() {
                        if (!isMatrixMode) return;

                        var matrixCanvas = document.createElement("canvas");
                        matrixCanvas.id = "matrixOverlayCanvas";
                        matrixCanvas.style.position = "fixed";
                        matrixCanvas.style.top = "0";
                        matrixCanvas.style.left = "0";
                        matrixCanvas.style.width = "100vw";
                        matrixCanvas.style.height = "100vh";
                        matrixCanvas.style.zIndex = "99999";
                        matrixCanvas.style.pointerEvents = "none"; 
                        matrixCanvas.style.background = "transparent";
                        document.body.appendChild(matrixCanvas);

                        var ctx = matrixCanvas.getContext("2d");
                        matrixCanvas.width = window.innerWidth;
                        matrixCanvas.height = window.innerHeight;

                        var matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%&_+-=[]{}|;:,.<>?/".split("");
                        var fontSize = 14;
                        var columns = matrixCanvas.width / fontSize;

                        var drops = [];
                        for (var x = 0; x < columns; x++) {
                            drops[x] = 1;
                        }

                        function drawMatrixRain() {
                            ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
                            ctx.globalCompositeOperation = "destination-out";
                            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                            ctx.globalCompositeOperation = "source-over";
                            ctx.fillStyle = "#00ff33"; 
                            ctx.font = "bold " + fontSize + "px monospace";

                            for (var i = 0; i < drops.length; i++) {
                                var text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                                    drops[i] = 0;
                                }
                                drops[i]++;
                            }
                        }

                        matrixInterval = setInterval(drawMatrixRain, 33);

                        window.onresize = function() {
                            if (matrixCanvas) {
                                matrixCanvas.width = window.innerWidth;
                                matrixCanvas.height = window.innerHeight;
                            }
                        };
                    }, 600);
                } else if (command === "-clear") {
                    terminalHistory.innerHTML = "";
                } else {
                    responseLines = ["Command not found: '" + rawInput + "'. Type <span class='highlight'>-help</span> for assistance."];
                }
            }

            responseLines.forEach(function(line) {
                var resLine = document.createElement("div");
                resLine.innerHTML = line;
                if (terminalHistory) terminalHistory.appendChild(resLine);
            });

            terminalInput.value = "";
            if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    terminalBody.addEventListener("click", function() {
        terminalInput.focus();
    });
}

function dragElement(element) {
  if (!element) return;
  
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    if (e.target.id === "welcomeclose" || e.target.id === "pixelclose" || e.target.id === "terminalclose") return;
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = moveElement;
  }

  function moveElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    var newTop = element.offsetTop - currentY;
    var newLeft = element.offsetLeft - currentX;

    if (newTop < 0) newTop = 0;
    if (newTop + element.offsetHeight > window.innerHeight) newTop = window.innerHeight - element.offsetHeight;
    if (newLeft < 0) newLeft = 0;
    if (newLeft + element.offsetWidth > window.innerWidth) newLeft = window.innerWidth - element.offsetWidth;

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}