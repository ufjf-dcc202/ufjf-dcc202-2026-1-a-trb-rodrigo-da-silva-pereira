const init_tower = document.getElementById("tower-1");

const levels = 8;
const tower_level_width = 90;
const tower_level_height = 100;
const tower_level_decrement = 8;

for (let i = 0; i < levels; i++) {
    const tower_level = document.createElement("img");
    tower_level.classList.add("tower-level");
    tower_level.src = "/sprites/tower-level.png";
    tower_level.alt = "Tower Level";

    tower_level.dataset.size = levels - i;
    tower_level.style.width = `${tower_level_width - i * tower_level_decrement}px`;

    init_tower.appendChild(tower_level);
}

function recordMove(fromTower, toTower, towerLevel) {
    const historyList = document.getElementById("history-sidebar");
    const historyRecord = document.createElement("p");
    historyRecord.classList.add("history-record");
    historyRecord.textContent = `Move-se o nível de tamanho ${towerLevel.dataset.size} da torre ${fromTower.id.split("-")[1]} para a torre ${toTower.id.split("-")[1]}`;
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

handleDraggableTowerLevel(document.getElementById("tower-1"));

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
historyButton.addEventListener("click", function () {
    const historySidebar = document.getElementById("history-sidebar");
    historySidebar.classList.toggle("hidden");
    historyButton.classList.toggle("active");
})

