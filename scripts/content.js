var region = $('#awsc-navigation__more-menu--list > li:nth-child(2) > div > button > span.KFpjKKVRktMFh3wa-eKuZ > span.ThRjn7o-KwO0459UzmvoU.w8Kxy2XztOAkWobGpdJLt').text().trim();
if (region != null) {
  console.log("Region : -" + region + "-");
}

function loadData() {
  chrome.storage.sync.get('globalRegionArray', (response) => {
    globalRegionArray = response.globalRegionArray;
    //alert('Loaded '+globalRegionArray.length+' regions')
  
    if (globalRegionArray != undefined && globalRegionArray.length <= 0) {
        //alert('globalRegionArray is empty, loading from file');
        const url = chrome.runtime.getURL('data/data.json');
        fetch(url)
        .then(response => response.json())
        .then(regionArray => {
            globalRegionArray = regionArray
            saveGlobalRegions(globalRegionArray);
            setupColors(globalRegionArray);
        });
    } else {
      setupColors(globalRegionArray);
    }
  });
}

function setupColors(regionArray) {
  if (regionArray  != undefined && region != undefined) {
    console.log('Applying colors');
    var regionObj = regionArray.find(x => x.name === region);
    if (regionObj) {
      var newRegionName = `${regionObj.name} (${regionObj.code})`;
      var iconPath = buildFlagUrl(regionObj.country);

      var regionNameTagId = '#awsc-navigation__more-menu--list > li:nth-child(2) > div > button > span.KFpjKKVRktMFh3wa-eKuZ > span.ThRjn7o-KwO0459UzmvoU.w8Kxy2XztOAkWobGpdJLt';
      ['#awsc-nav-header','#awsc-concierge-input'].forEach(el => {
        this.setbackgroundColor(el, regionObj.color);
      })
      $(regionNameTagId).css('vertical-align', 'middle');
      $(regionNameTagId).text(newRegionName);

      var img = document.createElement('IMG');
      img.src = iconPath;
      img.style = 'margin-left:5px;width:20px;vertical-align:middle';
      $(regionNameTagId).append(img);
    }
  }
}

function setbackgroundColor(tag, color){
  $(tag).css("background-color", color);
}

function buildFlagUrl(country) {
  return chrome.runtime.getURL(`flags/${country}.png`);
}

chrome.runtime.onMessage.addListener(request => {
  loadData();
});

loadData();