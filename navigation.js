 async function loadSheetData() {
    try {
        // 1. Fetch our local JSON file instead of the CSV
        const response = await fetch(SYNC_JSON);
        const data = await response.json();
        
        let tempNav = [];
        siteData.phones = []; // Clear old items to fill freshly

        // 2. Loop through your clean JSON array objects directly
        data.forEach((item) => {
            const loc = item.Location?.trim().toLowerCase();
            
            // Map headers to the nav array
            if (loc === 'header') {
                tempNav.push({ label: item.Title, url: item.Url });
            }
            // Map phone numbers safely without worrying about row numbers
            else if (loc === 'footer phone') {
                siteData.phones.push(item.Title);
            }
            // Map email directly
            else if (loc === 'footer email') {
                siteData.email = item.Title;
            }
            // Map address elements directly
            else if (loc === 'footer address') {
                siteData.addressStreet = item.Title;
                siteData.addressCity = item.Url;
            }
        });

        siteData.nav = tempNav;
        renderDynamicFramework();
    } catch (err) { 
        console.warn("Framework Sync Fallback", err); 
        renderDynamicFramework(); 
    }
}