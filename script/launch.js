let filterButtonActive = false;
let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("json/launch.json");
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Add row number Reverse order
        row.appendChild(createCell(data.length - index));

        // Add table data
        ["HUL Code", "HUL Outlet Name", "ME Name", "Beat", "BasePack Desc", "Target (VMQ)", "Achv Qty", "Status"].forEach(key => {
            row.appendChild(createCell(item[key]));
        });

        tableBody.appendChild(row);
    });
}

// 🛠 Utility function to create table cells (Fixes Zero Display Issue)
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value === 0 ? "0" : value !== undefined && value !== null ? value : "";
    return cell;
}

function applyFilters() {
    let filteredData = jsonData.filter(row => {
        return (
            (getFilterValue("filter-me-name") === "" || row["ME Name"] === getFilterValue("filter-me-name")) &&
            (getFilterValue("filter-beat") === "" || row["Beat"] === getFilterValue("filter-beat")) &&
            (getFilterValue("filter-basepack-desc") === "" || row["BasePack Desc"] === getFilterValue("filter-basepack-desc")) &&
            (document.getElementById("search-bar").value === "" || 
                row["HUL Code"].toLowerCase().includes(document.getElementById("search-bar").value.toLowerCase()) ||
                row["HUL Outlet Name"].toLowerCase().includes(document.getElementById("search-bar").value.toLowerCase()))
        );
    });

    if (filterButtonActive) {
        filteredData = filteredData.filter(row => row["Status"] === "Pending");
    }

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

// 🛠 Helper function to get filter values
function getFilterValue(id) {
    return document.getElementById(id).value;
}

function updateDropdowns(filteredData) {
    const headers = ["ME Name", "Beat", "BasePack Desc"];
    headers.forEach(header => populateDropdown(`filter-${header.toLowerCase().replace(/ /g, '-')}`, getUniqueValues(filteredData, header), header));
}

// 🛠 Extract unique values for dropdowns
function getUniqueValues(data, key) {
    return [...new Set(data.map(item => item[key]).filter(Boolean))];
}

// 🛠 Populate dropdowns dynamically
function populateDropdown(id, options, defaultText) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = "";

    dropdown.appendChild(new Option(defaultText, "", true));

    options.forEach(option => {
        const optionElement = new Option(option, option);
        if (option === selectedValue) optionElement.selected = true;
        dropdown.appendChild(optionElement);
    });
}

// 📌 Event Listeners
document.getElementById("reset-button").addEventListener("click", () => {
    filterButtonActive = false;
    document.getElementById("filter-button-1").style.backgroundColor = "blue";
    document.getElementById("search-bar").value = "";
    ["filter-me-name", "filter-beat", "filter-basepack-desc"].forEach(id => document.getElementById(id).selectedIndex = 0);
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-beat").addEventListener("change", applyFilters);
document.getElementById("filter-basepack-desc").addEventListener("change", applyFilters);

document.getElementById("filter-button-1").addEventListener("click", () => {
    filterButtonActive = !filterButtonActive;
    document.getElementById("filter-button-1").style.backgroundColor = filterButtonActive ? "green" : "blue";
    applyFilters();
});

// 🚀 Initialize
function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();
