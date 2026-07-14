const params = new URLSearchParams(window.location.search);

const init_tower = document.getElementById("tower-1");

const levels = parseInt(params.get("dificuldade")) || 8;
const tower_level_width = 4.6;
const tower_level_decrement = 0.4;

document.addEventListener("click", function(event){
    const sidebar = document.getElementById("history-sidebar");
    const clickedOutsideSidebar = !sidebar.contains(event.target);

    if (!sidebar.classList.contains("hidden") && clickedOutsideSidebar){
        document.getElementById("history-button").click();
    }
})

function initializeGame() {
    const minMoves = document.getElementById("min-moves-counter");
    minMoves.textContent = `${2**levels - 1}`;

    for (let i = 0; i < levels; i++) {
        const tower_level = document.createElement("img");
        tower_level.classList.add("tower-level");
        tower_level.src = "/sprites/tower-level.png";
        tower_level.alt = "Tower Level";

        tower_level.dataset.size = levels - i;
        tower_level.style.width = `${tower_level_width - i * tower_level_decrement}vw`;

        init_tower.appendChild(tower_level);
    }
    handleDraggableTowerLevel(document.getElementById("tower-1"));
}

initializeGame();

function recordMove(fromTower, toTower, towerLevel) {
    const parsedSize = parseInt(towerLevel.dataset.size);
    const parsedFromTower = parseInt(fromTower.id.split("-")[1]);
    const parsedToTower = parseInt(toTower.id.split("-")[1]);

    const historyList = document.getElementById("history-sidebar");
    const historyRecord = document.createElement("p");
    historyRecord.classList.add("history-record");

    historyRecord.dataset.fromTower = parsedFromTower;
    historyRecord.dataset.toTower = parsedToTower;
    historyRecord.dataset.size = parsedSize;

    historyRecord.textContent = `Nível ${parsedSize}: torre ${parsedFromTower} -> ${parsedToTower}`;
    
    historyList.appendChild(historyRecord);
    historyList.appendChild(document.createElement("hr"));

    const moveCounter = document.getElementById("move-count-number");
    const currentCount = parseInt(moveCounter.textContent);
    moveCounter.textContent = currentCount + 1;
}

function handleDraggableTowerLevel(tower) {
    const top_tower_level = tower.querySelector(".tower-level:last-child");
    console.log(top_tower_level);
    if (!top_tower_level) return;

    tower.querySelectorAll(".tower-level:not(:last-child)").forEach(tower_level => {
        tower_level.setAttribute("draggable", "false");
        tower_level.classList.remove("top-tower-level");
    });

    top_tower_level.setAttribute("draggable", "true");
    top_tower_level.classList.add("top-tower-level");

    top_tower_level.ondrag = function () {
        top_tower_level.classList.add("dragging");
    }

    top_tower_level.ondragend = function () {
        top_tower_level.classList.remove("dragging");
        const new_tower = top_tower_level.parentElement;
        
        if (new_tower !== tower) {
            handleDraggableTowerLevel(tower);
            handleDraggableTowerLevel(new_tower);

            recordMove(tower, new_tower, top_tower_level);
        }
    }
}

var dropZones = document.querySelectorAll(".drop-zone");
dropZones.forEach(function (zone) {
    zone.addEventListener("dragover", function (e) {
        dragging_tower_level = document.querySelector(".dragging");
        drag_on_zone_top_tower_level = zone.querySelector(".tower-level:last-child");

        if (dragging_tower_level && drag_on_zone_top_tower_level) {
            if (parseInt(dragging_tower_level.dataset.size) > parseInt(drag_on_zone_top_tower_level.dataset.size)) {
                zone.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
                return;
            }
        }
        
        zone.style.backgroundColor = "rgba(0, 255, 0, 0.25)";
        e.preventDefault();
    });

    zone.addEventListener("dragleave", function (e) {
        zone.style.backgroundColor = "";
    });

    zone.addEventListener("drop", function (e) {
        e.preventDefault();
        const dragging_tower_level = document.querySelector(".dragging");
        if (!dragging_tower_level) return;
        zone.appendChild(dragging_tower_level);
        zone.style.backgroundColor = "";
    });
});

const historyButton = document.getElementById("history-button");
historyButton.addEventListener("click", function (event) {
    const historySidebar = document.getElementById("history-sidebar");
    historySidebar.classList.toggle("hidden");
    historyButton.classList.toggle("active");
    event.stopPropagation();
})

function resetGame(cleanHistory = true) {
    towers = document.querySelectorAll(".tower");
    towers.forEach(tower => {
        tower.replaceChildren();
    });

    if (cleanHistory){
        lastHistoryListHeaderChild = document.getElementById("first-history-separator");
        while (lastHistoryListHeaderChild.nextSibling) {
            lastHistoryListHeaderChild.nextSibling.remove();
        }

        const moveCounter = document.getElementById("move-count-number");
        moveCounter.textContent = 0;
    }

    initializeGame();
}

const resetHistoryButton = document.getElementById("reset-history-button");
resetHistoryButton.addEventListener("click", resetGame);

const replayButton = document.getElementById("replay-history-button");
replayButton.addEventListener("click", function () {
    const historyRecords = document.querySelectorAll(".history-record");

    if (historyRecords.length == 0){
        return;
    }

    resetGame(false);

    document.getElementById("history-button").click();

    const replayOverlay = document.getElementById("replay-overlay")
    replayOverlay.classList.add("active");

    historyRecords.forEach((record, index) => {
        setTimeout(() => {
            const fromTowerId = `tower-${record.dataset.fromTower}`;
            const toTowerId = `tower-${record.dataset.toTower}`;

            const fromTower = document.getElementById(fromTowerId);
            const toTower = document.getElementById(toTowerId);
            const towerLevel = fromTower.querySelector(`.tower-level[data-size="${record.dataset.size}"]`);

            if (towerLevel) {
                toTower.appendChild(towerLevel);
            }

            if (index == historyRecords.length -1){
                const towers = document.querySelectorAll(".tower");
                towers.forEach(tower => {
                    handleDraggableTowerLevel(tower);
                })

                replayOverlay.classList.remove("active")
            }
        }, index * 1000)
    });
    
});