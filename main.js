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
        
        handleDraggableTowerLevel(tower);
        handleDraggableTowerLevel(new_tower);
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
                return;
            }
        }
        
        e.preventDefault();
    });

    zone.addEventListener("drop", function (e) {
        e.preventDefault();
        const dragging_tower_level = document.querySelector(".dragging");
        if (!dragging_tower_level) return;
        zone.appendChild(dragging_tower_level);
    });
});

