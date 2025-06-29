let jsonData = [];

async function fetchData() {
  try {
    const response = await fetch("json/data.json");
    if (!response.ok) throw new Error("Failed to fetch data.");
    jsonData = await response.json();
    initialize();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function populateTable(data) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    const serialCell = document.createElement("td");
    serialCell.textContent = data.length - index;
    row.appendChild(serialCell);

    const fields = [
      "HUL Code", "HUL Outlet Name", "Shikhar Outlet",
      "DETS ME Name", "DETS Beat",
      "FNB ME Name", "FNB Beat",
      "NUTS ME Name", "NUTS Beat",
      "PP ME NAME", "PP BEAT",
      "U2NC  ME NAME", "U2NC BEAT"
    ];

    fields.forEach(key => {
      const cell = document.createElement("td");
      cell.textContent = item[key] ?? "";
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

function applyFilters() {
  const searchValue = document.getElementById("search-bar").value.toLowerCase();

  const filters = {
    "DETS ME Name": document.getElementById("filter-dets-me-name").value,
    "DETS Beat": document.getElementById("filter-dets-beat").value,
    "FNB ME Name": document.getElementById("filter-fnb-me-name").value,
    "FNB Beat": document.getElementById("filter-fnb-beat").value,
    "NUTS ME Name": document.getElementById("filter-nuts-me-name").value,
    "NUTS Beat": document.getElementById("filter-nuts-beat").value,
    "PP ME NAME": document.getElementById("filter-pp-me-name").value,
    "PP BEAT": document.getElementById("filter-pp-beat").value,
    "U2NC  ME NAME": document.getElementById("filter-u2nc-me-name").value,
    "U2NC BEAT": document.getElementById("filter-u2nc-beat").value
  };

  const filtered = jsonData.filter(row => {
    return (
      Object.entries(filters).every(([key, value]) => value === "" || row[key] === value) &&
      (searchValue === "" ||
        row["HUL Code"]?.toLowerCase().includes(searchValue) ||
        row["HUL Outlet Name"]?.toLowerCase().includes(searchValue))
    );
  });

  populateTable(filtered);
  updateDropdowns(filtered);
}

function updateDropdowns(data) {
  const dropdownMap = {
    "filter-dets-me-name": "DETS ME Name",
    "filter-dets-beat": "DETS Beat",
    "filter-fnb-me-name": "FNB ME Name",
    "filter-fnb-beat": "FNB Beat",
    "filter-nuts-me-name": "NUTS ME Name",
    "filter-nuts-beat": "NUTS Beat",
    "filter-pp-me-name": "PP ME NAME",
    "filter-pp-beat": "PP BEAT",
    "filter-u2nc-me-name": "U2NC  ME NAME",
    "filter-u2nc-beat": "U2NC BEAT"
  };

  for (const id in dropdownMap) {
    const field = dropdownMap[id];
    const values = new Set();
    data.forEach(row => {
      if (row[field]) values.add(row[field]);
    });
    populateSelect(id, values, field);
  }
}

function populateSelect(id, optionsSet, label) {
  const select = document.getElementById(id);
  const prevValue = select.value;
  select.innerHTML = `<option value="">${label}</option>`;
  Array.from(optionsSet)
    .sort()
    .forEach(option => {
      const selected = option === prevValue ? "selected" : "";
      select.innerHTML += `<option value="${option}" ${selected}>${option}</option>`;
    });
}

function resetFilters() {
  document.getElementById("search-bar").value = "";
  document.querySelectorAll("select").forEach(select => (select.value = ""));
  applyFilters();
}

function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function initialize() {
  document.getElementById("search-bar").addEventListener("input", debounce(applyFilters));
  document.querySelectorAll("select").forEach(select => select.addEventListener("change", applyFilters));
  document.getElementById("reset-button").addEventListener("click", resetFilters);

  populateTable(jsonData);
  applyFilters();
}

fetchData();
