 /**
 * S&K UNIVERSAL ENGINE v10.15 (JSON Core / Same Tab Forced)
 */
const SYNC_JSON = "./navigation.json";

// Shared cross-page runtime dataset state
let siteData = { nav: [], phones: [], email: "", addressStreet: "", addressCity: "" };

// Initialize system dependencies on script parse
document.addEventListener("DOMContentLoaded", () => {
    // Re-initialize Lucide icons safely if runtime engine is present
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }
});

/**
 * 1. CORE DATA DISPATCHER
 * Fetches root JSON parameters and safely handles empty states via console logging fallbacks
 */
async function loadSheetData() {
    try {
        const response = await fetch(SYNC_JSON);
        if (!response.ok) throw new Error(`HTTP status error: ${response.status}`);
        
        const data = await response.json();
        
        let tempNav = [];
        siteData.phones = []; // Reset reference array arrays to fill fresh

        data.forEach((item) => {
            const loc = item.Location?.trim().toLowerCase();
            
            if (loc === 'header') {
                tempNav.push({ label: item.Title, url: item.Url });
            } else if (loc === 'footer phone') {
                siteData.phones.push(item.Title);
            } else if (loc === 'footer email') {
                siteData.email = item.Title;
            } else if (loc === 'footer address') {
                siteData.addressStreet = item.Title;
                siteData.addressCity = item.Url;
            }
        });

        siteData.nav = tempNav;
        renderDynamicFramework();
    } catch (err) { 
        console.warn("Framework Sync Fallback Activated:", err); 
        renderDynamicFramework(); 
    }
}

/**
 * 2. MASTER LAYOUT ARCHITECT (renderDynamicFramework)
 * Dynamically builds identical navigation menus and contact information across all pages
 */
function renderDynamicFramework() {
    const desktopRoot = document.getElementById("desktop-nav-root");
    const mobileRoot = document.getElementById("mobile-menu");
    const footerPhone = document.getElementById("footer-phone-list");
    const footerEmail = document.getElementById("footer-email-list");
    const footerAddress = document.getElementById("footer-address-container");
    
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // Build Desktop Navigation Links
    if (desktopRoot) {
        desktopRoot.innerHTML = siteData.nav.map(item => {
            const isActive = item.url === currentPath;
            return `
                <li>
                    <a href="./${item.url}" 
                       class="nav-link ${isActive ? 'active' : ''}" 
                       onclick="smartTabClick(event, this, 'tab_sk_${item.label}', this.href)">
                       ${item.label}
                    </a>
                </li>`;
        }).join('');
    }

    // Build Mobile Drawer Menu Structure
    if (mobileRoot) {
        mobileRoot.innerHTML = siteData.nav.map(item => {
            const isActive = item.url === currentPath;
            return `
                <a href="./${item.url}" 
                   class="text-xl font-bold uppercase tracking-wide border-b border-black/5 pb-2 ${isActive ? 'text-[var(--sk-gold-alt)] font-black' : ''}"
                   onclick="smartTabClick(event, this, 'tab_sk_mob_${item.label}', this.href)">
                   ${item.label}
                </a>`;
        }).join('');
    }

    // Process Footer Elements Safely
    if (footerPhone && siteData.phones.length > 0) {
        footerPhone.innerHTML = siteData.phones.map(p => `<p class="footer-value" onclick="openPhoneModal()">${p}</p>`).join('');
    }
    if (footerEmail && siteData.email) {
        footerEmail.innerHTML = `<p class="footer-value" onclick="openEmailModal()">${siteData.email}</p>`;
    }
    if (footerAddress && siteData.addressStreet) {
        footerAddress.innerHTML = `
            <p class="footer-value" onclick="openMapModal()">
                ${siteData.addressStreet}<br>
                <span class="text-xs opacity-60 font-sans tracking-normal uppercase block mt-1">${siteData.addressCity}</span>
            </p>`;
    }

    // Run dynamic structural triggers after DOM modification completes
    initLightboxInteractions();
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }
}

/**
 * 3. STRICT SAME-TAB NAVIGATION METHOD
 */
window.smartTabClick = function(event, element, targetName, url) {
    if (event) event.preventDefault();
    // Enforce strict location resolving window-wide within the same frame
    window.location.href = url;
};

/**
 * 4. SYSTEM LIGHTBOX LOGIC
 */
function initLightboxInteractions() {
    const overlay = document.getElementById("lightbox-overlay");
    const img = document.getElementById("lightbox-img");
    if (!overlay || !img) return;

    document.querySelectorAll(".lightbox-trigger").forEach(element => {
        // Clear binding duplicates
        element.onclick = null;
        element.onclick = function() {
            img.src = this.src;
            overlay.style.display = "flex";
        };
    });
}

/**
 * 5. INTERACTION MODAL MANAGEMENT
 */
window.openPhoneModal = function() {
    const container = document.getElementById("phone-options-container");
    if (container && siteData.phones.length > 0) {
        container.innerHTML = siteData.phones.map(p => `
            <a href="tel:${p.replace(/[^0-9]/g, '')}" class="smart-option">
                <i data-lucide="phone"></i> Call ${p}
            </a>
        `).join('');
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }
    }
    document.getElementById("phone-modal").style.display = "flex";
};

window.openEmailModal = function() {
    const container = document.getElementById("email-options-container");
    if (container && siteData.email) {
        container.innerHTML = `
            <a href="mailto:${siteData.email}" class="smart-option">
                <i data-lucide="mail"></i> Email Specialist
            </a>`;
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }
    }
    document.getElementById("email-modal").style.display = "flex";
};

window.openMapModal = function() {
    const encodedAddress = encodeURIComponent(`${siteData.addressStreet}, ${siteData.addressCity}`);
    
    document.getElementById("link-gmaps").href = `https://maps.google.com/?q=${encodedAddress}`;
    document.getElementById("link-amaps").href = `maps://maps.apple.com/?q=${encodedAddress}`;
    document.getElementById("link-waze").href = `https://waze.com/ul?q=${encodedAddress}`;
    
    document.getElementById("map-modal").style.display = "flex";
};

window.closeModals = function() {
    document.getElementById("phone-modal").style.display = "none";
    document.getElementById("email-modal").style.display = "none";
    document.getElementById("map-modal").style.display = "none";
};

// Global scroll event controller for structural padding variations
window.onscroll = function() {
    const header = document.getElementById("main-header");
    if (!header) return;
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
};

// Toggle UI Drawer Panel for Dev Custom Settings
window.toggleSettingsPanel = function() {
    const panel = document.getElementById("settings-panel");
    if (panel) panel.classList.toggle("hidden-settings");
};

// Auto-boot sequence on entry
window.onload = loadSheetData;