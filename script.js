const wallMaterials = {
  1: { Branches: 10 },
  2: { Logs: 6, Rope: 1 },
  3: { Planks: 10, Nails: 4 },
  4: { "SheetMetal": 10, Rebars: 2 },
  5: { Concrete: 10, Bricks: 2 },
};

const floorMaterials = {
  1: { Branches: 10 },
  2: { Logs: 6, Rope: 1 },
  3: { Planks: 10, Nails: 4 },
  4: { "SheetMetal": 10, Rebars: 2 },
  5: { Concrete: 10, Bricks: 2 },
};

const foundationMaterials = {
  1: { Branches: 10 },
  2: { Logs: 6, Rope: 2 },
  3: { Planks: 10, Nails: 4 },
  4: { "SheetMetal": 10, Rebars: 2 },
  5: { Concrete: 10, Bricks: 2 },
};

const materialIcons = {
  Branches: "branches.png",
  Logs: "logs.png",
  Rope: "rope.png",
  Rags: "rags.png",
  Planks: "planks.png",
  Nails: "nails.png",
  SheetMetal: "SheetMetal.png",
  ScrapMetal: "ScrapMetal.png",
  Rebars: "rebars.png",
  Concrete: "concrete.png",
  Cement: "cement.png",
  Bricks: "bricks.png",
};


function mergeMaterials(base, addition, count) {
  for (const [mat, qty] of Object.entries(addition)) {
    base[mat] = (base[mat] || 0) + qty * count;
  }
}

function calculateCraftingNeeds(required) {
  const crafting = {};

  if (required.Rope) {
    crafting.Rags = (crafting.Rags || 0) + required.Rope * 2;
  }

  if (required.Planks) {
    const extraLogs = Math.ceil(required.Planks / 4);
    crafting.Logs = (crafting.Logs || 0) + extraLogs;
  }

  if (required["SheetMetal"]) {
    crafting["ScrapMetal"] =
      (crafting["ScrapMetal"] || 0) + required["SheetMetal"];
  }

  if (required.Concrete) {
    const neededCement = Math.ceil(required.Concrete / 2);
    crafting.Cement = (crafting.Cement || 0) + neededCement;
  }

  return crafting;
}

function calculate() {
  const walls = parseInt(document.getElementById("Walls").value) || 0;
  const floors = parseInt(document.getElementById("Floors").value) || 0;
  const foundations =
    parseInt(document.getElementById("Foundations").value) || 0;
  const selectedLevels = Array.from(
    document.querySelectorAll(".level-checkbox:checked")
  ).map((cb) => parseInt(cb.value));

  const total = {};

  for (const lvl of selectedLevels) {
    mergeMaterials(total, wallMaterials[lvl], walls);
    mergeMaterials(total, floorMaterials[lvl], floors);
    mergeMaterials(total, foundationMaterials[lvl], foundations);
  }

  const crafting = calculateCraftingNeeds(total);

  for (const [mat, qty] of Object.entries(crafting)) {
    if (mat === "Logs") {
      total[mat] = (total[mat] || 0) + qty;
      delete crafting[mat];
    }
  }

  let html = "<h2>Required resources:</h2><ul>";
  for (const [mat, qty] of Object.entries(total)) {
    if (qty > 0) {
      const imgSrc = `images/${materialIcons[mat] }`;
      html += `
        <li>
          <img src="${imgSrc}" alt="${mat}" class="icon" />
          <div class="material-text">
            <div><strong>${mat}:</strong> ${qty}</div>
          </div>
        </li>
      `;
    }
  }
  html += "</ul>";

  if (Object.keys(crafting).length > 0) {
    html +=
      "<h2 style='margin-top:20px;'>Materials needed for crafting:</h2><ul>";
    for (const [mat, qty] of Object.entries(crafting)) {
      const imgSrc = `images/${materialIcons[mat] }`;
      html += `
        <li>
          <img src="${imgSrc}" alt="${mat}" class="icon" />
          <div class="material-text">
            <div><strong>${mat}:</strong> ${qty}</div>
          </div>
        </li>
      `;
    }
    html += "</ul>";
  }

  document.getElementById("result").innerHTML = html;
}

const dropdownToggle = document.getElementById("levelDropdownToggle");
const dropdownList = document.getElementById("levelDropdown");

dropdownToggle.addEventListener("click", () => {
  dropdownList.style.display =
    dropdownList.style.display === "flex" ? "none" : "flex";
});

const selectAllCheckbox = document.getElementById("selectAllLevels");
selectAllCheckbox.addEventListener("change", () => {
  const allCheckboxes = document.querySelectorAll(".level-checkbox");
  allCheckboxes.forEach((cb) => (cb.checked = selectAllCheckbox.checked));
  calculate();
});

document.querySelectorAll(".level-checkbox").forEach((cb) => {
  cb.addEventListener("change", () => {
    const all = document.querySelectorAll(".level-checkbox");
    const checked = document.querySelectorAll(".level-checkbox:checked");
    selectAllCheckbox.checked = all.length === checked.length;
    calculate();
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach((el) => {
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  });
  calculate();
});

document.querySelectorAll(".btn-minus, .btn-plus").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    let value = parseInt(input.value) || 0;
    if (btn.classList.contains("btn-minus")) {
      value = Math.max(0, value - 1);
    } else {
      value += 1;
    }
    input.value = value;
    calculate();
  });
});

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input[type='number']").forEach((el) => {
      el.value = 0;
    });

    const selectAll = document.getElementById("selectAllLevels");
    selectAll.checked = true;

    document.querySelectorAll(".level-checkbox").forEach((cb) => {
      cb.checked = true;
    });

    calculate();
  });
}
