const init_tower = document.getElementById("tower-1");

const levels = 8;
const disc_width = 150;
const disc_height = 100;
const disc_decrement = 10;

const disc_hole_width = 60;
const disc_hole_height = 40;
const disc_hole_decrement = 5;

for (let i = 0; i < levels; i++) {
    const disc = document.createElement("span");
    disc.classList.add("disc");
    disc.style.width = `${disc_width - i * disc_decrement}px`;
    disc.style.height = `${disc_height - i * disc_decrement}px`;

    const disc_hole = document.createElement("span");
    disc_hole.classList.add("disc-hole");
    disc_hole.style.width = `${disc_hole_width - i * disc_hole_decrement}px`;
    disc_hole.style.height = `${disc_hole_height - i * disc_hole_decrement}px`;

    disc.dataset.size = levels - i;

    disc.appendChild(disc_hole);
    init_tower.appendChild(disc);
}

function handleDraggableDisc(tower) {
    const top_disc = tower.querySelector(".disc:last-child");
    if (!top_disc) return;

    tower.querySelectorAll(".disc:not(:last-child)").forEach(disc => {
        disc.setAttribute("draggable", "false");
        disc.classList.remove("top-disc");
    });

    top_disc.setAttribute("draggable", "true");
    top_disc.classList.add("top-disc");

    top_disc.addEventListener("drag", function (event) {
        top_disc.classList.add("dragging");
    });

    top_disc.addEventListener("dragend", function (event) {
        top_disc.classList.remove("dragging");
        handleDraggableDisc(tower);
        const new_tower = top_disc.parentElement;
        handleDraggableDisc(new_tower);
    });
}

handleDraggableDisc(document.getElementById("tower-1"));

var dropZones = document.querySelectorAll(".drop-zone");
dropZones.forEach(function (zone) {
    zone.addEventListener("dragover", function (event) {
        dragging_disc = document.querySelector(".dragging");
        drag_on_zone_top_disc = zone.querySelector(".disc:last-child");

        if (dragging_disc && drag_on_zone_top_disc) {
            if (parseInt(dragging_disc.dataset.size) > parseInt(drag_on_zone_top_disc.dataset.size)) {
                return;
            }
        }
        
        event.preventDefault();
        zone.appendChild(document.querySelector(".dragging"));
    });
});

