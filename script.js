var isDrawing = false;
var isEraserMode = false;

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

if (gridContainer) {
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
        
        if (storageKey.startsWith("pixel_art_")) {
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

welcomeScreen.style.top = (window.innerHeight / 2 - welcomeScreen.offsetHeight / 2) + "px";
welcomeScreen.style.left = (window.innerWidth / 2 - welcomeScreen.offsetWidth / 2) + "px";

pixelScreen.style.top = (window.innerHeight / 2 - pixelScreen.offsetHeight / 2) + "px";
pixelScreen.style.left = (window.innerWidth / 2 - pixelScreen.offsetWidth / 2) + 150 + "px";

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
    element.style.top = (window.innerHeight / 2 - element.offsetHeight / 2) + "px";
    element.style.left = (window.innerWidth / 2 - element.offsetWidth / 2) + "px";
}

welcomeScreenClose.addEventListener("click", function() {
    closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
    openWindow(welcomeScreen);
});

pixelScreenClose.addEventListener("click", function() {
  closeWindow(pixelScreen);
});

pixelScreenOpen.addEventListener("click", function() {
    openWindow(pixelScreen);
});

dragElement(document.getElementById("window"));
dragElement(document.getElementById("pixel-window"));

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    if (e.target.id === "welcomeclose" || e.target.id === "pixelclose") return;

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

    if (newTop < 0) {
        newTop = 0;
    }
    if (newTop + element.offsetHeight > window.innerHeight) {
        newTop = window.innerHeight - element.offsetHeight;
    }
    if (newLeft < 0) {
        newLeft = 0;
    }
    if (newLeft + element.offsetWidth > window.innerWidth) {
        newLeft = window.innerWidth - element.offsetWidth;
    }

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
