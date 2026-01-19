// ==================== GLOBAL VARIABLES ====================
const canvas = document.getElementById('flyerCanvas');
const ctx = canvas.getContext('2d');
const W = 1080, H = 1440; // Rasio 3:4
canvas.width = W;
canvas.height = H;

// Konfigurasi Gereja
const CHURCH_NAME = "GKI GRIYA MERPATI MAS";
const LOGO_URL = "gki-gereja-kristen-indonesia-logo-png_seeklogo-536222.png"; // Pastikan file ini ada

// State Management
const state = {
    bgImage: null, // Image Object
    bgOverlayColor: 'rgba(0,0,0,0.4)',
    templateId: 'classic',
    type: 'umum', // Tipe ibadah
    data: {},
    autoColor: true,
    customColor: '#ffffff'
};

// ==================== TEMPLATE SYSTEM ====================
const templates = [
    {
        id: 'classic',
        name: 'Klasik Elegan',
        fontMain: 'Cuprum',
        fontSec: 'Ubuntu Condensed',
        render: (ctx, w, h, data) => renderClassic(ctx, w, h, data)
    },
    {
        id: 'modern',
        name: 'Modern Minimalis',
        fontMain: 'Montserrat',
        fontSec: 'Poppins',
        render: (ctx, w, h, data) => renderModern(ctx, w, h, data)
    },
    {
        id: 'artistic',
        name: 'Artistik',
        fontMain: 'Playfair Display',
        fontSec: 'Inter',
        render: (ctx, w, h, data) => renderArtistic(ctx, w, h, data)
    }
];

// ==================== INIT & EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadLogo();
    // Render awal
    updateCanvas();
});

function initUI() {
    // 1. Populate Template Select
    const tSelect = document.getElementById('templateSelect');
    templates.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        tSelect.appendChild(opt);
    });
    tSelect.addEventListener('change', (e) => {
        state.templateId = e.target.value;
        document.getElementById('previewTemplateBadge').textContent = `Template: ${templates.find(t=>t.id == e.target.value).name}`;
        updateCanvas();
    });

    // 2. Tipe Ibadah Change
    document.getElementById('flyerType').addEventListener('change', (e) => {
        state.type = e.target.value;
        renderFormInputs();
        updateCanvas();
    });

    // 3. Upload Local Image
    document.getElementById('bgInput').addEventListener('change', handleImageUpload);

    // 4. Auto Color Toggle
    document.getElementById('autoColorCheck').addEventListener('change', (e) => {
        state.autoColor = e.target.checked;
        updateCanvas();
    });

    // 5. Input Dynamic Listener (Delegation)
    document.getElementById('dynamicForm').addEventListener('input', () => {
        collectFormData();
        updateCanvas();
    });

    // 6. Modal Search Logic
    setupSearchModal();

    // 7. Download & Reset
    document.getElementById('downloadBtn').addEventListener('click', downloadCanvas);
    document.getElementById('resetBtn').addEventListener('click', () => {
        if(confirm('Reset semua data?')) location.reload();
    });

    // Render form awal
    renderFormInputs();
}

// ==================== FORM BUILDER ====================
function renderFormInputs() {
    const container = document.getElementById('dynamicForm');
    container.innerHTML = '';
    
    let html = '';
    
    // Field Tanggal & Waktu (Umum untuk semua)
    html += createInputHtml('date', 'Tanggal', 'date');
    html += createInputHtml('time', 'Waktu', 'text', 'Pkl. 09.00 WIB');

    if (state.type === 'umum' || state.type === 'remaja') {
        html += createInputHtml('tema', 'Tema Khotbah', 'text', 'Judul Khotbah...');
        html += createInputHtml('nats', 'Ayat Alkitab', 'text', 'Yohanes 3:16');
        html += createInputHtml('pengkhotbah', 'Pelayan Firman', 'text', 'Pdt. Nama Pengkhotbah');
    } 
    else if (state.type === 'sekolahminggu') {
        html += createInputHtml('tema', 'Tema Cerita', 'text', 'Anak Baik...');
        html += createInputHtml('kelas', 'Kelas', 'text', 'Balita & Kecil');
    }
    else if (state.type === 'rt') {
        html += createInputHtml('wilayah', 'Wilayah', 'text', 'Wilayah 1');
        html += createInputHtml('keluarga', 'Keluarga', 'text', 'Kel. Bpk. Budi');
        html += createInputHtml('alamat', 'Alamat', 'text', 'Jl. Merpati No. 1');
        html += createInputHtml('pengkhotbah', 'Pelayan Firman', 'text');
    }

    container.innerHTML = html;
    collectFormData();
}

function createInputHtml(id, label, type, placeholder='') {
    return `
    <div class="form-group">
        <label>${label}</label>
        <input type="${type}" id="input_${id}" class="modern-input" placeholder="${placeholder}">
    </div>`;
}

function collectFormData() {
    const inputs = document.querySelectorAll('#dynamicForm input');
    state.data = {};
    inputs.forEach(input => {
        const key = input.id.replace('input_', '');
        state.data[key] = input.value;
    });
}

// ==================== IMAGE HANDLING ====================
let churchLogoImg = new Image();
function loadLogo() {
    churchLogoImg.crossOrigin = "Anonymous";
    churchLogoImg.src = LOGO_URL;
    churchLogoImg.onload = updateCanvas;
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            state.bgImage = img;
            updateCanvas();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// ==================== BING SEARCH LOGIC (MOCKUP) ====================
function setupSearchModal() {
    const modal = document.getElementById('searchModal');
    const btnOpen = document.getElementById('btnOpenSearch');
    const btnClose = document.getElementById('btnCloseSearch');
    const btnSearch = document.getElementById('btnDoSearch');
    const inputSearch = document.getElementById('searchInput');
    const grid = document.getElementById('imageGrid');
    const loader = document.getElementById('imageLoader');

    btnOpen.onclick = () => modal.classList.remove('hidden');
    btnClose.onclick = () => modal.classList.add('hidden');
    
    // Search Trigger
    btnSearch.onclick = performSearch;
    inputSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    async function performSearch() {
        const query = inputSearch.value.trim();
        if(!query) return;

        // UI Loading
        grid.innerHTML = '';
        loader.classList.remove('hidden');
        grid.classList.add('hidden');

        // SIMULASI API BING (Karena tidak ada API Key nyata)
        // Kita menggunakan Pexels / Unsplash source logic untuk demo
        // Jika Anda punya Bing Key, ganti logika di sini.
        
        setTimeout(() => {
            const mockImages = generateMockImages(query);
            renderSearchResults(mockImages);
            loader.classList.add('hidden');
            grid.classList.remove('hidden');
        }, 800);
    }

    function generateMockImages(query) {
        // Ini membuat URL gambar acak yang valid untuk demo
        // Dalam implementasi nyata, ini adalah array dari response JSON Bing API
        const results = [];
        for(let i=0; i<12; i++) {
            // Menggunakan Lorem Picsum / Unsplash dengan seed berbeda
            results.push({
                thumb: `https://picsum.photos/seed/${query}${i}/300/200`,
                full: `https://picsum.photos/seed/${query}${i}/1080/1440`
            });
        }
        return results;
    }

    function renderSearchResults(images) {
        if(images.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">Tidak ditemukan.</p>';
            return;
        }

        images.forEach(imgData => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            const img = document.createElement('img');
            img.src = imgData.thumb;
            
            div.onclick = () => {
                selectOnlineImage(imgData.full);
                modal.classList.add('hidden');
            };

            div.appendChild(img);
            grid.appendChild(div);
        });
    }

    function selectOnlineImage(url) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            state.bgImage = img;
            updateCanvas();
            showToast("Gambar diterapkan!");
        };
        img.src = url;
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}


// ==================== CANVAS RENDERING ====================
function updateCanvas() {
    // Clear
    ctx.clearRect(0, 0, W, H);

    // 1. Background
    if (state.bgImage) {
        // Draw Image Cover (Center Crop)
        drawImageProp(ctx, state.bgImage, 0, 0, W, H);
    } else {
        // Default Background Gradient
        const grd = ctx.createLinearGradient(0, 0, W, H);
        grd.addColorStop(0, '#0066cc');
        grd.addColorStop(1, '#003366');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
    }

    // Overlay Gelap agar teks terbaca
    ctx.fillStyle = state.bgOverlayColor;
    ctx.fillRect(0, 0, W, H);

    // 2. Render Template Text
    const currentTemplate = templates.find(t => t.id === state.templateId);
    if (currentTemplate) {
        currentTemplate.render(ctx, W, H, state.data);
    }
}

// --- Helper: Draw Image Cover (mirip CSS object-fit: cover) ---
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0; w = ctx.canvas.width; h = ctx.canvas.height;
    }
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width, ih = img.height, r = Math.min(w / iw, h / ih), nw = iw * r, nh = ih * r, cx, cy, cw, ch, ar = 1;

    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);
    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

// --- Template Renders ---
function renderClassic(ctx, w, h, data) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    
    // Header
    if(churchLogoImg.complete && churchLogoImg.naturalHeight !== 0) {
        let logoW = 150; 
        let logoH = (churchLogoImg.height / churchLogoImg.width) * logoW;
        ctx.drawImage(churchLogoImg, (w/2) - (logoW/2), 80, logoW, logoH);
    }
    
    ctx.font = 'bold 50px Cuprum';
    ctx.fillText(CHURCH_NAME, w/2, 280);

    // Title Box
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    roundRect(ctx, 100, 350, w-200, 120, 20);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px Cuprum';
    let title = state.type.toUpperCase().replace('IBADAH ', '') + ' SERVICE';
    if(state.type === 'umum') title = "IBADAH UMUM";
    ctx.fillText(title, w/2, 435);

    // Content
    let yPos = 650;
    
    if(data.date) {
        ctx.font = '40px Ubuntu Condensed';
        ctx.fillText(formatDateIndo(data.date), w/2, yPos);
        yPos += 70;
    }
    if(data.time) {
        ctx.font = 'bold 90px Cuprum';
        ctx.fillText(data.time, w/2, yPos + 20);
        yPos += 150;
    }

    // Garis Pemisah
    ctx.beginPath();
    ctx.moveTo(w/2 - 100, yPos);
    ctx.lineTo(w/2 + 100, yPos);
    ctx.strokeStyle = '#ff8c00';
    ctx.lineWidth = 5;
    ctx.stroke();
    yPos += 80;

    if(data.tema) {
        ctx.font = 'italic 40px Ubuntu Condensed';
        ctx.fillText("Tema:", w/2, yPos);
        yPos += 60;
        ctx.font = 'bold 60px Cuprum';
        wrapText(ctx, data.tema, w/2, yPos, 800, 70);
    }
}

function renderModern(ctx, w, h, data) {
    // Style align Left dengan aksen kotak
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(50, 50, w-100, h-100); // White border frame

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1a1a1a'; // Dark Text

    // Logo
    if(churchLogoImg.complete) {
        ctx.drawImage(churchLogoImg, 120, 120, 100, 100);
    }
    
    ctx.font = 'bold 40px Montserrat';
    ctx.fillText("GKI GRIYA MERPATI MAS", 240, 160);
    ctx.font = '30px Montserrat';
    ctx.fillStyle = '#666';
    ctx.fillText("Minggu Ini", 240, 200);

    // Big Date
    ctx.fillStyle = '#0066cc';
    ctx.font = 'bold 180px Montserrat';
    ctx.fillText(data.time ? data.time.split('.')[0] : "09", 100, 500);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '60px Poppins';
    ctx.fillText(data.tema || "Tema Ibadah", 120, 700);
}

function renderArtistic(ctx, w, h, data) {
    // Center, Serif fonts
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';

    ctx.font = 'italic 50px Playfair Display';
    ctx.fillText("Mari Bergabung Bersama Kami", w/2, 200);

    ctx.font = 'bold 100px Playfair Display';
    ctx.fillText(data.tema || "Ibadah Minggu", w/2, 500);
}

// --- Utils ---
function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
}

function formatDateIndo(dateStr) {
    if(!dateStr) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = `Flyer-GKI-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
}