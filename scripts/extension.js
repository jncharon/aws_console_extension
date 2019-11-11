let globalRegionArray = [];

function fillTable() {
    chrome.storage.sync.get('globalRegionArray', (response) => {
        if (response.globalRegionArray == null) {
            loadFromDefaultFile();
        } 
        drawTable(); 
        refreshTab();
    });
}

function drawTable() {
    var tableRef = document.getElementById('contentTable').getElementsByTagName('tbody')[0];
    if (globalRegionArray != undefined && tableRef != undefined) {
        globalRegionArray.forEach(region => {
            var row = tableRef.insertRow();
            createNewImageCell(row, 0, region.country);
            createNewCell(row, 1, region.name, region.color);
            createNewCell(row, 2, region.code, region.color);
            createNewCell(row, 3, region.az, region.color);
            createNewFormCell(row, 4, region.code, region.color);
        });
    }
}

function createNewCell(row, index, content, color) {
    var cell = row.insertCell(index);
    var element = document.createElement('SPAN');
    element.style = `color:${color}`;
    element.textContent = content;
    cell.appendChild(element);
}

function createNewImageCell(row, index, content) {
    var cell = row.insertCell(index);
    var img = document.createElement('IMG');
    img.src = buildFlagUrl(content);
    img.style = 'margin-left:5px;width:20px;vertical-align:middle';
    cell.appendChild(img);
}

function createNewFormCell(row, index, code, color) {
    var cell = row.insertCell(index);
    var input = document.createElement('INPUT');
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', 7);
    input.style = 'width:55px';
    input.id = code;
    input.value = color;
    input.id = code;
    cell.appendChild(input);
}

function saveColorsAndRefreshConsole() {
    let error = false;
    if (globalRegionArray != undefined) {
        globalRegionArray.forEach(function(region, index) {
            color = $(`#${region.code}`).val().trim();
            if (color.length === 7 && color.startsWith('#')) {
                region.color = color;
                this[index] = region;
            } else {
                alert(`Invalid color : ${color} for region ${region.name}`);
                error = true;
            }
        });
        
        if (!error) {
            saveGlobalRegions(globalRegionArray);
        }
    }
};

function restoreDefaultColorsAndRefreshConsole() {
    //if (confirm('Restore default colors ?')) {
        loadFromDefaultFile();
    //}
}

function loadFromDefaultFile() {
    const dataPath = 'data/data.json';
    console.log(`Reloading data from ${dataPath}`)
    const url = chrome.runtime.getURL(dataPath);
    fetch(url)
        .then(response => response.json())
        .then(regionArray => {
            globalRegionArray = regionArray;
            saveGlobalRegions(globalRegionArray);
        });
}

function saveGlobalRegions(globalRegionArray) {
    chrome.storage.sync.set({ 'globalRegionArray': globalRegionArray }, function(){
        fillTable();
        refreshTab();
    });
}

function refreshTab() {
    chrome.tabs.query({ url: 'https://*.console.aws.amazon.com/*' }, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { 'refresh':globalRegionArray })
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fillTable();
    document.getElementById("saveBtn").addEventListener('click', saveColorsAndRefreshConsole);
    // document.getElementById("restoreBtn").addEventListener('click', restoreDefaultColorsAndRefreshConsole);
});