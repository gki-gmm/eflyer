// ==================== GLOBAL VARIABLES ====================
const canvas = document.getElementById('flyerCanvas');
const ctx = canvas.getContext('2d');
const W = 1080, H = 1440;
canvas.width = W;
canvas.height = H;
const PERMANENT_CHURCH_NAME = "GKI GRIYA MERPATI MAS";
const PERMANENT_LOGO_URL = "gki-gereja-kristen-indonesia-logo-png_seeklogo-536222.png";

// State management
const state = {
    churchName: PERMANENT_CHURCH_NAME,
    logo: null,
    logoLoaded: false,
    frame: null,
    isCustomFrame: false,
    type: 'umum',
    data: {},
    autoColor: true,
    customColor: '#ffffff',
    contrast: 'dark'
};

// Template System
const templates = [
    {
        id: 'classic',
        name: 'Template Klasik',
        description: 'Desain elegan dengan sentuhan tradisional gereja',
        features: ['Rata Tengah', 'Warna Custom', 'Font Elegant'],
        mainFont: 'Cuprum',
        subFont: 'Ubuntu Condensed',
        accentColor: '#005acf',
        bgOverlay: 'rgba(0,0,0,0.5)',
        textShadow: true,
        hasDivider: true,
        borderRadius: 25,
        style: 'classic'
    },
    {
        id: 'modern',
        name: 'Template Modern',
        description: 'Minimalis dengan garis-garis bersih dan kontras tinggi',
        features: ['Rata Kiri', 'Kontras Tinggi', 'Font Modern'],
        mainFont: 'Montserrat',
        subFont: 'Montserrat',
        accentColor: '#2c3e50',
        bgOverlay: 'rgba(0,0,0,0.6)',
        textShadow: false,
        hasDivider: false,
        borderRadius: 15,
        style: 'modern'
    },
    {
        id: 'artistic',
        name: 'Template Artistik',
        description: 'Dengan efek gradien dan elemen dekoratif menarik',
        features: ['Rata Tengah', 'Gradien', 'Efek Visual'],
        mainFont: 'Poppins',
        subFont: 'Poppins',
        accentColor: '#ff6b35',
        bgOverlay: 'rgba(0,0,0,0.4)',
        textShadow: true,
        hasDivider: true,
        borderRadius: 30,
        style: 'artistic'
    },
    {
        id: 'elegant',
        name: 'Template Elegant',
        description: 'Menggunakan font serif dan border dekoratif',
        features: ['Rata Kanan', 'Font Serif', 'Border Dekoratif'],
        mainFont: 'Roboto Slab',
        subFont: 'Roboto Slab',
        accentColor: '#8e2de2',
        bgOverlay: 'rgba(0,0,0,0.55)',
        textShadow: true,
        hasDivider: true,
        borderRadius: 20,
        style: 'elegant'
    },
    {
        id: 'bold',
        name: 'Template Bold',
        description: 'Kontras tinggi dengan elemen tebal dan impactful',
        features: ['Rata Kiri', 'Bold Typography', 'High Contrast'],
        mainFont: 'Cuprum',
        subFont: 'Ubuntu Condensed',
        accentColor: '#ff416c',
        bgOverlay: 'rgba(255,255,255,0.1)',
        textShadow: false,
        hasDivider: false,
        borderRadius: 10,
        style: 'bold'
    }
];

const accentColors = [
    { name: 'Biru', value: '#005acf' },
    { name: 'Ungu', value: '#8e2de2' },
    { name: 'Merah', value: '#ff416c' },
    { name: 'Oranye', value: '#ff6b35' },
    { name: 'Hijau', value: '#10b981' },
    { name: 'Emas', value: '#f59e0b' }
];

// Template state
const templateState = {
    currentTemplate: 'classic',
    mainAlignment: 'center',
    subAlignment: 'center',
    accentColor: '#005acf',
    features: []
};

// Unsplash Image Search Variables
let currentSearchTerm = '';
let currentPage = 1;
let totalResults = 0;
let selectedImageIndex = -1;
const UNSPLASH_ACCESS_KEY = 'Q4YdDWJkqfiIHoGS6zOUpjP3OWKQ7hfnTb4TbWJUnX8';

// Fallback images
const FALLBACK_IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1080&h=1440&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=400&h=400&fit=crop'
    },
    {
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1080&h=1440&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop'
    },
    {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080&h=1440&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop'
    },
    {
        url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1080&h=1440&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&h=400&fit=crop'
    },
    {
        url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1080&h=1440&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=400&fit=crop'
    }
];

// Preacher list
const preacherList = [
    // PENDETA
    { name: "Bpk. Ray James Sahertian, S.Si.(Teol.)", church: "BPK Penabur" },
    { name: "Pdt. A. Lung (Siau A Lung)", church: "GKI Rahmani" },
    { name: "Pdt. Abdiel Bhopa Djentoro", church: "GKI Ayudia" },
    { name: "Pdt. Addi Soselia Patriabara", church: "GKI Kavling Polri" },
    { name: "Pdt. Adi Cahyono", church: "GKI Delima" },
    { name: "Pdt. Adi Netto Kristiano", church: "GKI Kedoya" },
    { name: "Pdt. Adi Netto Kristanto", church: "GKI Kedoya" },
    // ... (keep the rest of your preacher list)
    { name: "Pnt. Sudadi", church: "" },
    { name: "Pnt. Meirudi Lumban Tobing", church: "" }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize template system
    initTemplateSystem();

    // Set tanggal default (hari Minggu depan)
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
    const dateString = nextSunday.toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = dateString;
    });

    // Initialize semua komponen
    initPreacherDropdowns();
    initImageSearch();
    initEvents();

    // Load logo
    loadImage(PERMANENT_LOGO_URL).then(img => {
        state.logo = img;
        state.logoLoaded = true;
        updateData();
        draw();
    }).catch(() => {
        console.warn("Logo gagal dimuat. Pastikan file logo ada di folder.");
        updateData();
        draw();
    });

    // Auto search setelah halaman load
    setTimeout(() => {
        document.getElementById('googleSearch').value = "church interior";
        performSearch();
    }, 1000);
});

// ==================== TEMPLATE SYSTEM FUNCTIONS ====================
function initTemplateSystem() {
    // Load template grid
    const templateGrid = document.getElementById('templateGrid');
    templates.forEach((template, index) => {
        const templateItem = document.createElement('div');
        templateItem.className = `template-item ${index === 0 ? 'active' : ''}`;
        templateItem.dataset.templateId = template.id;

        templateItem.innerHTML = `
            <div class="template-preview ${template.style}">
                <div class="template-preview-content" style="text-align: ${templateState.mainAlignment}">
                    <div class="preview-title">${template.name}</div>
                    <div class="preview-text">${template.description}</div>
                </div>
            </div>
            <div class="template-info">
                <div class="template-name">${template.name}</div>
                <div class="template-desc">${template.description}</div>
            </div>
        `;

        templateItem.addEventListener('click', () => selectTemplate(template.id));
        templateGrid.appendChild(templateItem);
    });

    // Load accent colors
    const colorOptions = document.getElementById('accentColorOptions');
    accentColors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color.value;
        colorOption.title = color.name;
        colorOption.dataset.color = color.value;

        if (color.value === '#005acf') {
            colorOption.classList.add('active');
        }

        colorOption.addEventListener('click', () => selectAccentColor(color.value));
        colorOptions.appendChild(colorOption);
    });

    // Custom color picker event
    document.getElementById('customAccentColor').addEventListener('input', (e) => {
        selectAccentColor(e.target.value);
    });

    // Alignment buttons events
    document.querySelectorAll('#mainTextAlignment .alignment-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#mainTextAlignment .alignment-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            templateState.mainAlignment = this.dataset.alignment;
            updateTemplateFeatures();
            draw();
        });
    });

    document.querySelectorAll('#subTextAlignment .alignment-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#subTextAlignment .alignment-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            templateState.subAlignment = this.dataset.alignment;
            updateTemplateFeatures();
            draw();
        });
    });
}

function selectTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Update UI
    document.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.template-item[data-template-id="${templateId}"]`).classList.add('active');

    // Update state
    templateState.currentTemplate = templateId;
    templateState.accentColor = template.accentColor;

    // Update color picker
    document.getElementById('customAccentColor').value = template.accentColor;
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === template.accentColor) {
            option.classList.add('active');
        }
    });

    // Update indicators
    document.getElementById('currentTemplateIndicator').innerHTML = `
        <i class="fas fa-palette"></i>
        <span>${template.name}</span>
    `;

    document.getElementById('previewTemplateName').textContent = template.name.split(' ')[1];

    document.getElementById('templateInfo').innerHTML = `
        <i class="fas fa-palette"></i> Template aktif: <b>${template.name}</b> • Penataan: <b>${getAlignmentText(templateState.mainAlignment)}</b>
    `;

    updateTemplateFeatures();
    draw();

    showToast(`Template "${template.name}" dipilih`, "success");
}

function selectAccentColor(color) {
    templateState.accentColor = color;

    // Update color pickers
    document.getElementById('customAccentColor').value = color;
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });

    draw();
}

function updateTemplateFeatures() {
    const template = templates.find(t => t.id === templateState.currentTemplate);
    const featuresContainer = document.getElementById('templateFeatures');

    if (!template || !featuresContainer) return;

    // Clear existing features
    featuresContainer.innerHTML = '';

    // Add alignment feature
    const alignmentText = getAlignmentText(templateState.mainAlignment);
    featuresContainer.innerHTML += `
        <span class="feature-tag"><i class="fas fa-align-${templateState.mainAlignment === 'justify' ? 'justify' : templateState.mainAlignment}"></i> ${alignmentText}</span>
    `;

    // Add template-specific features
    template.features.forEach(feature => {
        let icon = 'fas fa-star';
        if (feature.includes('Font')) icon = 'fas fa-font';
        if (feature.includes('Warna')) icon = 'fas fa-palette';
        if (feature.includes('Gradien')) icon = 'fas fa-fill-drip';
        if (feature.includes('Border')) icon = 'fas fa-square';
        if (feature.includes('Kontras')) icon = 'fas fa-adjust';

        featuresContainer.innerHTML += `
            <span class="feature-tag"><i class="${icon}"></i> ${feature}</span>
        `;
    });
}

function getAlignmentText(alignment) {
    switch (alignment) {
        case 'left': return 'Rata Kiri';
        case 'right': return 'Rata Kanan';
        case 'center': return 'Rata Tengah';
        case 'justify': return 'Rata Kiri-Kanan';
        default: return 'Rata Tengah';
    }
}

// ==================== DRAWING FUNCTIONS ====================
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    // Get current template
    const template = templates.find(t => t.id === templateState.currentTemplate);

    // Draw background
    if (state.frame) {
        ctx.drawImage(state.frame, 0, 0, W, H);
        state.contrast = getContrastColor(state.frame);

        // Add overlay based on template
        ctx.fillStyle = template.bgOverlay;
        ctx.fillRect(0, 0, W, H);
    } else {
        // Fallback background with template style
        ctx.fillStyle = template.accentColor;
        ctx.fillRect(0, 0, W, H);
        state.contrast = 'light';
    }

    // Apply template-specific styles
    applyTemplateStyles(template);

    // Draw all elements with template styling
    drawTemplateElements(template);
}

function applyTemplateStyles(template) {
    // Set global text alignment
    ctx.textAlign = templateState.mainAlignment;

    // Set text baseline
    ctx.textBaseline = 'alphabetic';

    // Set shadow based on template
    if (template.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    } else {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}

function drawTemplateElements(template) {
    let yPos = 100; // PERBAIKAN: Mulai dari posisi lebih atas untuk memberi ruang untuk nama gereja

    // Draw logo with template styling
    if (state.logoLoaded && state.logo) {
        const size = 120; // Sedikit lebih kecil
        let x = W / 2 - size / 2;

        // Adjust position based on alignment
        if (templateState.mainAlignment === 'left') x = 100;
        if (templateState.mainAlignment === 'right') x = W - size - 100;

        // Logo background based on template
        ctx.fillStyle = `rgba(255,255,255,${template.style === 'bold' ? '0.95' : '0.85'})`;
        ctx.beginPath();
        ctx.roundRect(x - 10, yPos - 10, size + 20, size + 20, template.borderRadius);
        ctx.fill();
        ctx.drawImage(state.logo, x, yPos, size, size);

        yPos += size + 40; // Kurangi jarak setelah logo
    } else {
        yPos = 150;
    }

    // Church name with template font - PERBAIKAN: Posisi lebih kebawah
    yPos += 30; // Tambahkan jarak setelah logo
    ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
    ctx.font = `900 ${template.style === 'bold' ? '52px' : '48px'} "${template.mainFont}"`; // Sedikit lebih kecil
    let churchNameX = W / 2;
    if (templateState.mainAlignment === 'left') churchNameX = 100;
    if (templateState.mainAlignment === 'right') churchNameX = W - 100;

    ctx.fillText(state.churchName.toUpperCase(), churchNameX, yPos);

    // Divider line if template has it
    if (template.hasDivider) {
        yPos += 60; // Kurangi jarak
        ctx.beginPath();
        let startX = churchNameX - 100;
        let endX = churchNameX + 100;
        if (templateState.mainAlignment === 'left') {
            startX = 100;
            endX = 400;
        }
        if (templateState.mainAlignment === 'right') {
            startX = W - 400;
            endX = W - 100;
        }
        ctx.moveTo(startX, yPos);
        ctx.lineTo(endX, yPos);
        ctx.strokeStyle = templateState.accentColor;
        ctx.lineWidth = template.style === 'bold' ? 4 : 3;
        ctx.stroke();
        yPos += 20; // Kurangi jarak
    } else {
        yPos += 30; // Kurangi jarak
    }

    // Service type with template styling
    yPos += 40; // Kurangi jarak
    ctx.font = `700 ${template.style === 'bold' ? '70px' : '65px'} "${template.mainFont}"`;
    let title = getServiceTitle();
    ctx.fillStyle = templateState.accentColor;
    ctx.fillText(title, churchNameX, yPos);

    // Date with sub font
    yPos += 80; // Kurangi jarak
    ctx.font = `700 ${template.style === 'bold' ? '52px' : '48px'} "${template.subFont}"`;
    ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
    ctx.fillText(state.data.date || "Minggu, 01 Jan 2023", churchNameX, yPos);

    // Time with template-specific styling
    yPos += 70; // Kurangi jarak
    drawTimeInfo(churchNameX, yPos, template);

    // TEMA - PERBAIKAN: Tambah jarak lebih banyak sebelum tema
    if (!['rt', 'syukur', 'sekolahminggu', 'praremaja'].includes(state.type)) {
        yPos += 120; // DIUBAH: dari 90 menjadi 120 (tambah jarak)
        ctx.font = `italic 700 ${template.style === 'artistic' ? '65px' : '60px'} "Playfair Display"`;
        ctx.fillStyle = templateState.accentColor + (template.style === 'artistic' ? 'cc' : 'b3');
        ctx.fillText(`"${state.data.tema || "Tema Kebaktian"}"`, churchNameX, yPos);
        yPos += 120; // DIUBAH: dari 100 menjadi 120 (tambah jarak)
    } else {
        yPos += 50;
    }

    // Service info - Simplified version without info box
    drawServiceInfo(yPos, churchNameX, template);

    // Website with template styling
    ctx.fillStyle = templateState.accentColor + 'cc';
    ctx.font = `700 ${template.style === 'bold' ? '36px' : '32px'} "${template.subFont}"`;
    ctx.textAlign = 'center';
    ctx.fillText("www.gkigriyamerpatimas.or.id", W / 2, H - 100);
}

function getServiceTitle() {
    if (state.type === 'umum') return "KEBAKTIAN UMUM";
    if (state.type === 'remaja') return "KEBAKTIAN REMAJA PEMUDA";
    if (state.type === 'praremaja') return state.data.judul ? state.data.judul.toUpperCase() : "KEBAKTIAN PRA REMAJA";
    if (state.type === 'dewasa') return "PERSEKUTUAN DEWASA";
    if (state.type === 'sekolahminggu') return state.data.judul ? state.data.judul.toUpperCase() : "KEBAKTIAN ASM";
    if (state.type === 'rt') return "KEBAKTIAN RUMAH TANGGA";
    if (state.type === 'syukur') return "KEBAKTIAN SYUKUR";
    return "KEBAKTIAN";
}

function drawTimeInfo(x, y, template) {
    ctx.font = `700 ${template.style === 'bold' ? '52px' : '48px'} "${template.subFont}"`;

    if (state.type === 'sekolahminggu') {
        ctx.fillText(`Kelas Batita-3: ${state.data.w1 || "09.00 WIB"}`, x, y);
        y += 60;
        ctx.fillText(`Kelas 4-8: ${state.data.w2 || "07.00 WIB"}`, x, y);
    } else if (state.type === 'umum') {
        ctx.fillText(`Kebaktian I: ${state.data.w1 || "07.00 WIB"}`, x, y);
        y += 60;
        ctx.fillText(`Kebaktian II: ${state.data.w2 || "09.00 WIB"}`, x, y);
    } else {
        ctx.fillText(`Pukul: ${state.data.w || "11.00 WIB"}`, x, y);
    }
}

function drawServiceInfo(startY, x, template) {
    let yPos = startY + 40;
    ctx.textAlign = templateState.mainAlignment;
    let centerX = x;

    if (['rt', 'syukur'].includes(state.type)) {
        ctx.font = `700 ${template.style === 'bold' ? '44px' : '40px'} "${template.subFont}"`;
        ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
        yPos = wrapText(ctx, `Wilayah: ${state.data.wilayah || "Wilayah"}`, centerX, yPos, W - 200, 48);
        yPos += 10;

        ctx.font = `900 ${template.style === 'bold' ? '52px' : '48px'} "${template.mainFont}"`;
        yPos = wrapText(ctx, state.data.keluarga || "Keluarga", centerX, yPos, W - 200, 55);
        yPos += 10;

        ctx.font = `700 ${template.style === 'bold' ? '44px' : '40px'} "${template.subFont}"`;
        yPos = wrapText(ctx, `📍 ${state.data.alamat || "Alamat"}`, centerX, yPos, W - 200, 48);
        yPos += 50;
    }

    // Apply shadow for preacher info
    if (template.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }

    // Draw preacher info with shadow
    if (state.data.pelayan) {
        const preacherLabel = "Pelayan Firman:";
        ctx.font = `700 ${template.style === 'bold' ? '44px' : '40px'} "${template.subFont}"`;
        ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
        ctx.fillText(preacherLabel, centerX, yPos);

        yPos += 70;

        ctx.font = `700 ${template.style === 'bold' ? '46px' : '42px'} "${template.mainFont}"`;
        ctx.fillStyle = templateState.accentColor;
        yPos = wrapText(ctx, state.data.pelayan, centerX, yPos, W - 200, 60);

        if (state.data.asal) {
            yPos += 15;
            ctx.font = `400 ${template.style === 'bold' ? '40px' : '36px'} "${template.subFont}"`;
            ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
            ctx.fillText(`(${state.data.asal})`, centerX, yPos);
        }

        if (state.type === 'umum' && state.data.ket) {
            yPos += 50;
            ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
            ctx.font = `400 ${template.style === 'bold' ? '40px' : '36px'} "${template.subFont}"`;
            yPos = wrapText(ctx, `Catatan: ${state.data.ket}`, centerX, yPos, W - 200, 45);
        }
    }

    // Clear shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// ==================== UTILITY FUNCTIONS ====================
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return y;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if (url.startsWith('http')) img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

function getContrastColor(imgElement) {
    if (!imgElement) return 'dark';
    const c = document.createElement('canvas');
    const cx = c.getContext('2d');
    c.width = 1;
    c.height = 1;

    try {
        cx.drawImage(imgElement, W / 2, H / 2, 1, 1, 0, 0, 1, 1);
        const p = cx.getImageData(0, 0, 1, 1).data;
        const brightness = (p[0] * 299 + p[1] * 587 + p[2] * 114) / 1000;
        return brightness > 128 ? 'dark' : 'light';
    } catch (e) {
        return 'dark';
    }
}

function showToast(msg, type = "info") {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const icon = toast.querySelector('i');
    const message = toast.querySelector('.toast-message');

    if (type === "success") {
        icon.className = "fas fa-check-circle";
        toast.className = "toast success";
    } else if (type === "error") {
        icon.className = "fas fa-exclamation-circle";
        toast.className = "toast error";
    } else {
        icon.className = "fas fa-info-circle";
        toast.className = "toast info";
    }
    message.textContent = msg;

    // Show toast
    toast.classList.remove('hidden');
    toast.classList.add('show');

    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 4000);
}

// ==================== PREACHER SEARCH FUNCTIONS ====================
function initPreacherDropdowns() {
    const maps = [
        { input: 'pelayanUmum', target: 'asalGerejaUmum' },
        { input: 'pelayanRD', target: 'asalGerejaRD' },
        { input: 'pelayanRT', target: 'asalGerejaRT' }
    ];

    maps.forEach(map => {
        const inputEl = document.getElementById(map.input);
        const targetEl = document.getElementById(map.target);
        if (inputEl && targetEl) {
            setupSearch(inputEl, targetEl);
        }
    });
}

function setupSearch(inputEl, targetEl) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results hidden';
    inputEl.parentNode.appendChild(resultsContainer);

    inputEl.addEventListener('input', (e) => {
        try {
            const val = e.target.value.toLowerCase();
            resultsContainer.innerHTML = '';

            if (val.length < 2) {
                resultsContainer.classList.add('hidden');
                return;
            }

            const filtered = preacherList.filter(p => p.name.toLowerCase().includes(val));

            if (filtered.length > 0) {
                filtered.forEach(p => {
                    const item = document.createElement('div');
                    item.className = 'search-item';
                    let churchDisplay = (p.church && p.church !== "") ? `<span class="church-name">${p.church}</span>` : "";
                    item.innerHTML = `<b>${highlightMatch(p.name, val)}</b> ${churchDisplay}`;

                    item.addEventListener('mousedown', () => {
                        inputEl.value = p.name;
                        targetEl.value = (p.church && p.church !== "") ? p.church : "";
                        resultsContainer.classList.add('hidden');
                        updateData();
                        draw();
                    });

                    resultsContainer.appendChild(item);
                });
                resultsContainer.classList.remove('hidden');
            } else {
                resultsContainer.classList.add('hidden');
            }
        } catch (err) {
            console.error("Error saat mencari:", err);
        }
    });

    document.addEventListener('click', (e) => {
        if (!inputEl.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="color:var(--primary-color)">$1</span>');
}

// ==================== IMAGE SEARCH FUNCTIONS ====================
function initImageSearch() {
    const searchInput = document.getElementById('googleSearch');
    const searchButton = document.getElementById('btnSearch');

    if (!searchInput || !searchButton) {
        console.error("Search elements not found!");
        return;
    }

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    document.querySelectorAll('.chip[data-search]').forEach(chip => {
        chip.addEventListener('click', function () {
            const searchTerm = this.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch();
        });
    });

    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                performSearch(currentSearchTerm, currentPage);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < Math.ceil(totalResults / 10)) {
                currentPage++;
                performSearch(currentSearchTerm, currentPage);
            }
        });
    }
}

async function performSearch(term = null, page = 1) {
    const searchTerm = term || document.getElementById('googleSearch').value.trim();

    if (!searchTerm) {
        showToast("Masukkan kata kunci pencarian", "error");
        return;
    }

    currentSearchTerm = searchTerm;
    currentPage = page;

    const searchButton = document.getElementById('btnSearch');
    const originalText = searchButton.innerHTML;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mencari...';
    searchButton.disabled = true;

    const searchResults = document.getElementById('searchResults');
    searchResults.style.display = 'block';

    const imagesGrid = document.getElementById('imagesGrid');
    imagesGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light);">Mencari gambar...</div>';

    try {
        let images = [];
        images = await fetchUnsplashImages(searchTerm, page);

        if (images.length === 0) {
            images = await fetchFallbackImages(searchTerm);
        }

        displayImages(images);
        updatePagination();

    } catch (error) {
        console.error("Search error:", error);
        showToast("Gagal mencari gambar. Coba kata kunci lain.", "error");

        try {
            const fallbackImages = await fetchFallbackImages(searchTerm);
            displayImages(fallbackImages);
        } catch (fallbackError) {
            const imagesGrid = document.getElementById('imagesGrid');
            imagesGrid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>Gagal memuat gambar. Coba kata kunci lain atau refresh halaman.</p>
                    <button class="btn btn-primary" onclick="performSearch()" style="margin-top: 15px;">
                        <i class="fas fa-redo"></i> Coba Lagi
                    </button>
                </div>
            `;
        }
    } finally {
        searchButton.innerHTML = originalText;
        searchButton.disabled = false;
    }
}

async function fetchUnsplashImages(searchTerm, page = 1) {
    try {
        if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
            return await fetchFallbackImages(searchTerm);
        }

        const perPage = 10;
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&page=${page}&per_page=${perPage}&orientation=portrait`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status}`);
        }

        const data = await response.json();
        totalResults = data.total || 0;

        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${totalResults.toLocaleString()} gambar ditemukan`;
        }

        return data.results?.map(item => ({
            url: `${item.urls.raw}&w=1080&h=1440&fit=crop`,
            thumbnail: `${item.urls.thumb}?w=400&h=400&fit=crop`,
            width: item.width,
            height: item.height,
            title: item.alt_description || item.description || searchTerm,
            author: item.user?.name || 'Unknown'
        })) || [];

    } catch (error) {
        console.warn("Unsplash API failed, using fallback:", error);
        return await fetchFallbackImages(searchTerm);
    }
}

async function fetchFallbackImages(searchTerm) {
    await new Promise(resolve => setTimeout(resolve, 500));

    totalResults = FALLBACK_IMAGES.length * 3;
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${totalResults.toLocaleString()} gambar ditemukan (Demo)`;
    }

    return FALLBACK_IMAGES.map((img, index) => ({
        url: img.url,
        thumbnail: img.thumbnail,
        width: 1080,
        height: 1440,
        title: `${searchTerm} ${index + 1}`,
        author: 'Unsplash'
    }));
}

function displayImages(images) {
    const imagesGrid = document.getElementById('imagesGrid');
    imagesGrid.innerHTML = '';

    if (images.length === 0) {
        imagesGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light);">
                <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>Tidak ada gambar ditemukan. Coba kata kunci lain.</p>
            </div>
        `;
        return;
    }

    images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.index = index;

        imageItem.innerHTML = `
            <div class="image-loading" style="width: 100%; height: 100%;"></div>
        `;

        const img = new Image();
        img.onload = function () {
            imageItem.innerHTML = '';
            imageItem.appendChild(img);

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 5px;
                font-size: 0.7rem;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            overlay.textContent = image.author ? `by ${image.author}` : '';
            imageItem.appendChild(overlay);

            imageItem.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
            });
            imageItem.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
            });
        };

        img.onerror = function () {
            imageItem.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: var(--text-light);">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
            `;
        };

        img.src = image.thumbnail;
        img.alt = image.title;
        img.loading = 'lazy';

        imageItem.addEventListener('click', () => selectImage(image.url, index));
        imagesGrid.appendChild(imageItem);
    });
}

function selectImage(imageUrl, index) {
    document.querySelectorAll('.image-item.selected').forEach(item => {
        item.classList.remove('selected');
    });

    const selectedItem = document.querySelector(`.image-item[data-index="${index}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }

    selectedImageIndex = index;

    const img = new Image();
    img.crossOrigin = "anonymous";

    showToast("Memuat gambar...", "info");

    img.onload = function () {
        state.frame = img;
        state.isCustomFrame = false;
        updateData();
        draw();

        showToast("Background berhasil dipilih!", "success");

        document.querySelector('.preview-panel').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    img.onerror = function () {
        showToast("Gagal memuat gambar. Coba pilih gambar lain.", "error");
    };

    img.src = imageUrl;
}

function updatePagination() {
    const totalPages = Math.ceil(totalResults / 10);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    if (pageInfo) {
        pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    }

    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// ==================== EVENT HANDLERS ====================
function initEvents() {
    // Auto color toggle
    const autoColorCheck = document.getElementById('autoColorCheck');
    if (autoColorCheck) {
        autoColorCheck.addEventListener('change', toggleColorInput);
    }

    // Custom color picker
    const customColorPicker = document.getElementById('customColorPicker');
    if (customColorPicker) {
        customColorPicker.addEventListener('input', (e) => {
            state.customColor = e.target.value;
            updateData();
            draw();
        });
    }

    // Service type change
    const serviceType = document.getElementById('serviceType');
    if (serviceType) {
        serviceType.addEventListener('change', (e) => {
            toggleSections(e.target.value);
            updateData();
            draw();
        });
    }

    // Custom frame upload
    const customFrame = document.getElementById('customFrame');
    if (customFrame) {
        customFrame.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const labelDiv = document.getElementById('customFrameName');
            const nameSpan = document.getElementById('fileNameText');
            if (labelDiv) labelDiv.classList.remove('hidden');
            if (nameSpan) nameSpan.textContent = file.name;

            state.isCustomFrame = true;

            const reader = new FileReader();
            reader.onload = (evt) => {
                const img = new Image();
                img.onload = () => {
                    state.frame = img;
                    updateData();
                    draw();
                    showToast("Background berhasil diupload", "success");
                };
                img.onerror = () => {
                    showToast("Gagal memuat gambar", "error");
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            try {
                const link = document.createElement('a');
                link.download = `Flyer-GKI-${state.type}-${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
                showToast("Flyer berhasil diunduh!", "success");
            } catch (e) {
                showToast("Gagal mengunduh flyer", "error");
            }
        });
    }

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin mereset semua pengaturan?")) {
                location.reload();
            }
        });
    }

    // Input events untuk form lainnya
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id === 'googleSearch' || el.id.includes('pelayan')) return;

        el.addEventListener('input', () => {
            updateData();
            draw();
        });
        el.addEventListener('change', () => {
            updateData();
            draw();
        });
    });

    // Setup drag & drop untuk file upload
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropZone.classList.add('dragover');
        }

        function unhighlight() {
            dropZone.classList.remove('dragover');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) {
                customFrame.files = files;
                const event = new Event('change', {
                    bubbles: true
                });
                customFrame.dispatchEvent(event);
            }
        }
    }
}

function toggleColorInput() {
    const checkbox = document.getElementById('autoColorCheck');
    const customColorSection = document.getElementById('customColorSection');

    if (checkbox.checked) {
        customColorSection.classList.add('hidden');
        state.autoColor = true;
        showToast("Warna teks diatur otomatis", "info");
    } else {
        customColorSection.classList.remove('hidden');
        state.autoColor = false;
        state.customColor = document.getElementById('customColorPicker').value;
        showToast("Warna teks kustom diaktifkan", "info");
    }
    updateData();
    draw();
}

function toggleSections(type) {
    document.querySelectorAll('.dynamic-section').forEach(el => el.classList.add('hidden'));
    state.type = type;

    if (type === 'umum') document.getElementById('section-umum').classList.remove('hidden');
    else if (type === 'remaja' || type === 'dewasa') document.getElementById('section-remaja-dewasa').classList.remove('hidden');
    else if (type === 'praremaja') document.getElementById('section-praremaja').classList.remove('hidden');
    else if (type === 'sekolahminggu') document.getElementById('section-sekolahminggu').classList.remove('hidden');
    else if (type === 'rt' || type === 'syukur') document.getElementById('section-rt-syukur').classList.remove('hidden');
}

function updateData() {
    const val = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };

    if (state.type === 'umum') {
        state.data = {
            date: formatDate(val('dateUmum')),
            w1: val('waktu1'),
            w2: val('waktu2'),
            tema: val('temaUmum'),
            pelayan: val('pelayanUmum'),
            asal: val('asalGerejaUmum'),
            ket: val('keteranganUmum')
        };
    } else if (['remaja', 'dewasa'].includes(state.type)) {
        state.data = {
            date: formatDate(val('dateRD')),
            w: val('waktuRD'),
            tema: val('temaRD'),
            pelayan: val('pelayanRD'),
            asal: val('asalGerejaRD')
        };
    } else if (state.type === 'praremaja') {
        state.data = {
            judul: val('judulPra'),
            date: formatDate(val('datePra')),
            w: val('waktuPra'),
            tema: val('temaPra')
        };
    } else if (state.type === 'sekolahminggu') {
        state.data = {
            judul: val('judulSM'),
            date: formatDate(val('dateSM')),
            w1: val('waktuSM1'),
            w2: val('waktuSM2'),
            tema: val('temaSM')
        };
    } else {
        state.data = {
            date: formatDate(val('dateRT')),
            w: val('waktuRT'),
            wilayah: val('wilayahRT'),
            keluarga: val('namaKeluarga'),
            alamat: val('alamatRT'),
            pelayan: val('pelayanRT'),
            asal: val('asalGerejaRT')
        };
    }
}

function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}