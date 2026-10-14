// 🔒 Password Vault Security Controller
function checkPassword() {
    const enteredPass = document.getElementById('password-input').value;
    const correctPass = "ronaldoxmessi";
    const errorField = document.getElementById('error-msg');

    if (enteredPass === correctPass) {
        document.getElementById('password-gate').style.display = 'none';
        document.getElementById('app-content').style.display = 'flex';
        applyCustomBackground(); // Apply saved wallpaper if configured
        loadHome(); 
    } else {
        errorField.textContent = "❌ Invalid Family Password Key. Access Denied.";
    }
}

document.getElementById('password-input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
});

// 💾 LocalStorage Permanent Database Sync System Engine
let appData = {
    abhi: { pics: [], vids: [] },
    avani: { pics: [], vids: [] },
    rakesh: { pics: [], vids: [] },
    vishwa: { pics: [], vids: [] },
    family: { pics: [], vids: [] } 
};

// Auto-retrieve saved items if they exist inside local browser storage cache
if (localStorage.getItem('familyCelebrationDB')) {
    try {
        appData = JSON.parse(localStorage.getItem('familyCelebrationDB'));
    } catch(e) {
        console.error("Database parsing failed, reverting to empty setup", e);
    }
}

function saveDatabaseToLocalStorage() {
    localStorage.setItem('familyCelebrationDB', JSON.stringify(appData));
}

// Background wallpaper processing module
function applyCustomBackground() {
    const savedBg = localStorage.getItem('customWallpaperImage');
    const mainContentArea = document.querySelector('.main-content');
    if (mainContentArea) {
        if (savedBg) {
            mainContentArea.style.background = `url('${savedBg}')`;
        } else {
            // Restore native premium color gradient fallback
            mainContentArea.style.background = 'radial-gradient(circle at 80% 20%, #15120a 0%, #060709 100%)';
        }
    }
}

// Global active placement states
let activePerson = '';
let activeType = '';

// Highlight active sidebar navigation indicators
function setSidebarActive(btnId) {
    document.querySelectorAll('.main-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(btnId)?.classList.add('active');
}

// 🗺️ HOME NAVIGATION VIEW
function loadHome() {
    setSidebarActive('btn-home');
    const mainPanel = document.getElementById('main-panel');
    mainPanel.innerHTML = `
        <div class="welcome-card">
            <h2>✨ Saree & Dhoti Function Hub</h2>
            <p>
                Welcome to the private digital photo vault for Abhi and Avani's ceremonies! 
                Select any family member from the menu bar to upload or view their glossy photos and videos.
            </p>
            <div class="admin-control-box">
                <button class="admin-bg-btn" onclick="triggerAdminWallpaperChange()">🖼️ Change Background</button>
                <button class="admin-reset-btn" onclick="triggerAdminWallpaperReset()">🔄 Reset Background</button>
            </div>
        </div>
    `;
    applyCustomBackground();
}

// 🔐 Admin Background Authentication Prompt
function triggerAdminWallpaperChange() {
    const adminPass = prompt("🔑 Enter Admin Password to change wallpaper:");
    if (adminPass === null) return; 
    
    if (adminPass === "admin") {
        document.getElementById('background-file-uploader').click();
    } else {
        alert("❌ Incorrect Admin Password. Access Denied.");
    }
}

// 🔐 Admin Background Reset Controller
function triggerAdminWallpaperReset() {
    const adminPass = prompt("🔑 Enter Admin Password to reset wallpaper:");
    if (adminPass === null) return; 
    
    if (adminPass === "admin") {
        localStorage.removeItem('customWallpaperImage');
        applyCustomBackground();
        alert("🔄 Background reset to original gradient successfully.");
    } else {
        alert("❌ Incorrect Admin Password. Access Denied.");
    }
}

// Administrative wallpaper processing script loop
document.getElementById('background-file-uploader').onchange = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        localStorage.setItem('customWallpaperImage', base64Image);
        applyCustomBackground();
    };
    reader.readAsDataURL(file);
};

// 🗺️ DASHBOARD PAGE GENERATOR
function loadProfileDashboard(personName) {
    activePerson = personName;
    setSidebarActive(`btn-${personName}`);
    const mainPanel = document.getElementById('main-panel');
    
    const titleLabel = (personName === 'family') ? 'Family Function Dashboard' : `${personName}'s Dashboard`;

    mainPanel.innerHTML = `
        <div class="page-header">
            <h2>${titleLabel}</h2>
        </div>
        <div class="dashboard-menu-grid">
            <div class="media-card dashboard-card" onclick="loadGalleryPage('pics')">
                <h3>📸 Pictures Gallery</h3>
                <p>Click to open photos and manage uploads</p>
            </div>
            <div class="media-card dashboard-card" onclick="loadGalleryPage('vids')">
                <h3>🎥 Videos Gallery</h3>
                <p>Click to watch clips and manage uploads</p>
            </div>
        </div>
    `;
    applyCustomBackground();
}

// 🗺️ DEEP GALLERY PAGE 
function loadGalleryPage(type) {
    activeType = type; 
    const mainPanel = document.getElementById('main-panel');
    const items = appData[activePerson][activeType];

    const acceptFilter = (activeType === 'pics') ? 'image/*' : 'video/*';
    const uploadLabel = (activeType === 'pics') ? '➕ Upload Picture Only' : '➕ Upload Video Only';
    const displayTitle = (activePerson === 'family') ? 'Family Function' : activePerson;

    let mediaHTML = '';
    if (items.length === 0) {
        mediaHTML = `
            <div class="welcome-card" style="grid-column: 1/-1; margin-top: 20px;">
                <h2>Folder Empty</h2>
                <p>Click the button above to upload your first ${activeType === 'pics' ? 'photo' : 'video file'}.</p>
            </div>`;
    } else {
        mediaHTML = '<div class="media-display-grid">';
        items.forEach(item => {
            if (activeType === 'pics') {
                mediaHTML += `<div class="media-card"><img src="${item.data}"></div>`;
            } else {
                mediaHTML += `<div class="media-card"><video src="${item.data}" controls></video></div>`;
            }
        });
        mediaHTML += '</div>';
    }

    mainPanel.innerHTML = `
        <div class="page-header">
            <button class="back-btn" onclick="loadProfileDashboard('${activePerson}')">⬅ Back to Dashboard</button>
            <h2 style="text-transform: capitalize;">${displayTitle} - ${activeType === 'pics' ? 'Pictures' : 'Videos'}</h2>
            <button class="action-upload-btn" onclick="triggerSystemUpload('${acceptFilter}')">${uploadLabel}</button>
        </div>
        ${mediaHTML}
    `;
    applyCustomBackground();
}

// 🛠️ Contextual Upload Engine
function triggerSystemUpload(filterType) {
    const inputElement = document.getElementById('hidden-file-uploader');
    inputElement.accept = filterType; 
    inputElement.value = '';
    
    inputElement.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            appData[activePerson][activeType].unshift({ data: base64Data });
            saveDatabaseToLocalStorage();
            loadGalleryPage(activeType);
        };
        reader.readAsDataURL(file);
    };

    inputElement.click();
}
