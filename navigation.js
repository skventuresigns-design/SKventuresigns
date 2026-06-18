const SYNC_JSON = "./navigation.json";
let siteData = { nav: [], phones: [], email: "", addressStreet: "", addressCity: "" };

function smartTabClick(event, element, targetName, url) {
    if (event) event.preventDefault();
    window.location.href = url;
}
window.smartTabClick = smartTabClick;

function renderDynamicFramework() {
    const dNav = document.getElementById('desktop-nav-root');
    const mNav = document.getElementById('mobile-menu');
    const fPhone = document.getElementById('footer-phone-list');
    const fEmail = document.getElementById('footer-email-list');
    const fAddr = document.getElementById('footer-address-container');

    // Get current filename to accurately set the active tab state
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    if (dNav) dNav.innerHTML = ''; 
    if (mNav) mNav.innerHTML = '';

    siteData.nav.forEach(n => {
        // Match against current page or fallback to Home for index.html
        const isCurrentPage = n.url.includes(currentPath) || (currentPath === "index.html" && n.label.toLowerCase() === 'home');
        const uniqueTarget = `tab_sk_${n.label.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const desktopActive = isCurrentPage ? 'active' : '';

        if (dNav) {
            dNav.innerHTML += `<li><a href="${n.url}" class="nav-link ${desktopActive}" onclick="smartTabClick(event, this, '${uniqueTarget}', '${n.url}')">${n.label}</a></li>`;
        }
        
        if (mNav) {
            const mobileClass = isCurrentPage
                ? `text-2xl font-bold border-b border-black/5 pb-3 text-[var(--sk-gold)]`
                : `text-2xl font-bold border-b border-black/5 pb-3`;
            mNav.innerHTML += `<a href="${n.url}" class="${mobileClass}" onclick="smartTabClick(event, this, '${uniqueTarget}', '${n.url}')">${n.label}</a>`;
        }
    });

    if (fPhone && siteData.phones.length > 0) {
        fPhone.className = "flex flex-wrap items-center justify-center gap-3";
        let phoneHTML = `<span class="footer-value !mb-0" onclick="openPhoneSmartActions('${siteData.phones[0]}')">${siteData.phones[0]}</span>`;
        if (siteData.phones[1]) {
            phoneHTML += `<span class="text-white opacity-70 text-sm font-bold uppercase">or</span><span class="footer-value !mb-0" onclick="openPhoneSmartActions('${siteData.phones[1]}')">${siteData.phones[1]}</span>`;
        }
        fPhone.innerHTML = phoneHTML;
    }

    if (fEmail) {
        fEmail.innerHTML = `<span class="footer-value" onclick="openEmailSmartActions('${siteData.email}')">${siteData.email}</span>`;
    }
    if (fAddr) {
        fAddr.innerHTML = `<span class="footer-value" onclick="openMapSmartActions()">${siteData.addressStreet}, ${siteData.addressCity}</span>`;
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadSheetData() {
    fetch(SYNC_JSON)
        .then(response => response.json())
        .then(data => {
            siteData = data;
            renderDynamicFramework();
        })
        .catch(err => console.error("Error loading navigation engine:", err));
}

// Global initialization for all pages using this script
window.addEventListener('DOMContentLoaded', () => {
    loadSheetData();
    
    // Wire up mobile menu toggle safely if present on the page
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.onclick = () => {
            const m = document.getElementById('mobile-menu');
            if (m) {
                m.classList.toggle('hidden'); 
                m.classList.toggle('flex');
            }
        };
    }
});