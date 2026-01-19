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

// ==================== GOOGLE IMAGE SEARCH Variables ====================
let currentSearchTerm = '';
let currentPage = 1;
let totalResults = 0;
let selectedImageIndex = -1;

const SERPAPI_KEY = 'ad5c4262ed1b53b6411f89691f7109ea1b7fbbc940d7c5480fbc5a1ddab0c93a'; // API Key SerpApi Anda
const SERPAPI_ENDPOINT = 'https://serpapi.com/search?engine=google';

// Fallback images
const FALLBACK_IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1440&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1440&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
        url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1440&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1440&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
        url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1440&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'
    }
];

// Tambahkan cache system di sini
const imageCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

       // PEMBARUAN: Daftar Pendeta & Penatua Lengkap
       const preacherList = [
           // PENDETA
           { name: "Bpk. Ray James Sahertian, S.Si.(Teol.)", church: "BPK Penabur" },
           { name: "Pdt. A. Lung (Siau A Lung)", church: "GKI Rahmani" },
           { name: "Pdt. Abdiel Bhopa Djentoro", church: "GKI Ayudia" },
           { name: "Pdt. Addi Soselia Patriabara", church: "GKI Kavling Polri" },
           { name: "Pdt. Adi Cahyono", church: "GKI Delima" },
           { name: "Pdt. Adi Netto Kristanto", church: "GKI Kedoya" },
           { name: "Pdt. Agetta Putri Awijaya", church: "GKI Bandar Lampung" },
           { name: "Pdt. Agnes Irmawati Sunjoto", church: "GKI Kebonjati" },
           { name: "Pdt. Agus Gunawan", church: "GKI Kebonjati" },
           { name: "Pdt. Albert Marchus Puntodewo", church: "GKI Cikarang" },
           { name: "Pdt. Albertus Marines Patty", church: "GKI Maulana Yusuf" },
           { name: "Pdt. Alexander Hendrik Urbinas", church: "GKI Harapan Jaya" },
           { name: "Pdt. Alviandito Yulian Dicky", church: "GKI Kebonjati" },
           { name: "Pdt. Andi", church: "GKI Kanaan" },
           { name: "Pdt. Andi Christianto", church: "GKI Cawang" },
           { name: "Pdt. Andreas Loanka", church: "GKI Gading Serpong" },
           { name: "Pdt. Andy Gunawan", church: "GKI Bungur" },
           { name: "Pdt. Anthonius Widjaja", church: "GKI Duta Mas Batam" },
           { name: "Pdt. Arliyanus Larosa", church: "GKI Kepa Duri" },
           { name: "Pdt. Armin Honggo", church: "GKI Pekanbaru" },
           { name: "Pdt. Arum Agung Gumilar", church: "GKI Cianjur" },
           { name: "Pdt. Astrida Kardina", church: "GKI Cimahi" },
           { name: "Pdt. Ayunistya Dwita Prawira", church: "GKI Kayu Putih" },
           { name: "Pdt. Bagus Walujo Djati", church: "GKI Raya Hankam" },
           { name: "Pdt. Bambang Mulyono", church: "GKI Sudirman" },
           { name: "Pdt. Benny Halim", church: "GKI Serang" },
           { name: "Pdt. Bernadeth Florenza Da Lopez", church: "GKI Maulana Yusuf" },
           { name: "Pdt. Budiman", church: "GKI Bandar Lampung" },
           { name: "Pdt. Cenglyson Tjajadi", church: "GKI Anugerah" },
           { name: "Pdt. Charliedus Rounaldy Saragih Napitu", church: "GKI Camar" },
           { name: "Pdt. Christia Kalff", church: "GKI Layur" },
           { name: "Pdt. Christian Elbert Budiman", church: "GKI Wahid Hasyim" },
           { name: "Pdt. Christina Febri Untari Ospara", church: "GKI Kranggan" },
           { name: "Pdt. Cipta Martalu Sapangi", church: "GKI Puri Indah" },
           { name: "Pdt. Cordelia", church: "GKI Puri Indah" },
           { name: "Pdt. Daniel Guntur Cahyo Prakoso", church: "GKI Melur" },
           { name: "Pdt. Danny Purnama", church: "GKI Gading Serpong" },
           { name: "Pdt. Darmawasih Manullang", church: "GKI Kranggan" },
           { name: "Pdt. Darwin Darmawan", church: "Ptks Sinode GKI (Sekretaris Umum Pgi)" },
           { name: "Pdt. Daud Chevi Naibaho", church: "GKI Cikarang" },
           { name: "Pdt. Daud Solichin", church: "GKI Kebonjati" },
           { name: "Pdt. David Roestandi Surya S", church: "GKI Kota Wisata" },
           { name: "Pdt. David Sudarto", church: "GKI Gunung Sahari" },
           { name: "Pdt. Debora Rachelina Stefani", church: "GKI Kota Wisata" },
           { name: "Pdt. Devina Erlin Minerva Marunduri", church: "GKI Gading Serpong" },
           { name: "Pdt. Dewi Prahesti", church: "GKI Wahid Hasyim" },
           { name: "Pdt. Diana Bachri", church: "GKI Cipinang Elok" },
           { name: "Pdt. Dimas Samuel", church: "GKI Terate" },
           { name: "Pdt. Dina Kharismaningtyas Budiasri", church: "GKI Re Martadinata" },
           { name: "Pdt. Djie S. Mahonny", church: "GKI Filadelfia" },
           { name: "Pdt. Eddo Ega Wirakusuma", church: "GKI Guntur" },
           { name: "Pdt. Edwin Nugraha Tjandraputra", church: "GKI Puri Indah" },
           { name: "Pdt. Eko Priliadona", church: "GKI Tanggamus Gisting" },
           { name: "Pdt. Em. Mulia Hukum Baeha Waruwu", church: "GKI Tubagus Angke" },
           { name: "Pdt. Em. Udjang Tanusaputra", church: "GKI Cimahi" },
           { name: "Pdt. Engeline Chandra", church: "GKI Kepa Duri" },
           { name: "Pdt. Erma Primastuti Kristiyono", church: "GKI Gading Serpong" },
           { name: "Pdt. Esakatri Parahita", church: "GKI Pengadilan Bogor" },
           { name: "Pdt. Essy Eisen", church: "GKI Halimun" },
           { name: "Pdt. Evelyne Yudiarti", church: "GKI Kedoya" },
           { name: "Pdt. Febe Oriana Fermanto", church: "GKI Gunung Sahari" },
           { name: "Pdt. Febrita Melati S.", church: "GKI Cikarang" },
           { name: "Pdt. Frida Situmorang", church: "GKI Samanhudi" },
           { name: "Pdt. Galvin Tiara Bartianus", church: "GKI Pengadilan Bogor" },
           { name: "Pdt. Gloria Tesalonika", church: "GKI Citra I" },
           { name: "Pdt. Gordon Suhardo Hutabarat", church: "GKI Kota Wisata" },
           { name: "Pdt. Gunawan Saputra", church: "GKI Pakis Raya" },
           { name: "Pdt. Handri", church: "GKI Cipinang Elok" },
           { name: "Pdt. Harianto Suryadi", church: "GKI Harapan Indah" },
           { name: "Pdt. Hendra Setia Prasaja", church: "GKI Camar" },
           { name: "Pdt. Hendri Mulyana Sendjaja", church: "GKI Samanhudi" },
           { name: "Pdt. Hendy Suwandi", church: "GKI Harapan Indah" },
           { name: "Pdt. Henni Herlina", church: "GKI Agus Salim" },
           { name: "Pdt. Hizkia Anugrah Gunawan", church: "GKI Taman Aries" },
           { name: "Pdt. Ima Frontatina Simamora", church: "GKI Delima" },
           { name: "Pdt. Iman Sugio Ibrahim", church: "GKI Kranggan" },
           { name: "Pdt. Imanuel Adam", church: "GKI Wahid Hasyim" },
           { name: "Pdt. Imanuel Kristo", church: "GKI Gunung Sahari" },
           { name: "Pdt. Indra Kurniadi Tjandra", church: "GKI Kota Modern" },
           { name: "Pdt. Indriyati Tjandra", church: "GKI Kosambi Baru" },
           { name: "Pdt. Ivonne Maranatha", church: "GKI Bekasi Timur" },
           { name: "Pdt. Iwan Sentoso", church: "GKI Guntur" },
           { name: "Pdt. Jimmi Santoso", church: "GKI Raya Hankam" },
           { name: "Pdt. Johan Newton Crystal Na", church: "GKI Duta Mas Batam" },
           { name: "Pdt. Jotje Hanri Karuh", church: "GKI Kebonjati" },
           { name: "Pdt. Juswantori Ichwan", church: "GKI Samanhudi" },
           { name: "Pdt. Kristina Simaremare", church: "GKI Samanhudi" },
           { name: "Pdt. Lie Nah", church: "GKI Perniagaan" },
           { name: "Pdt. Lie Samuel Wiratama", church: "GKI Citra Raya" },
           { name: "Pdt. Lie Simon Stevi", church: "GKI Agape" },
           { name: "Pdt. Lukman Sitorus", church: "GKI Penginjil" },
           { name: "Pdt. Luther Tarlim Samara", church: "GKI Zaenal Zahse" },
           { name: "Pdt. Lydia Novellia", church: "GKI Kanaan" },
           { name: "Pdt. Maria Waryanti Sindhu Putri", church: "GKI Samanhudi" },
           { name: "Pdt. Martinus Stephanus", church: "GKI Karbela" },
           { name: "Pdt. Marto Marbun", church: "GKI Perniagaan" },
           { name: "Pdt. Melani Ayub Egne", church: "GKI Agus Salim" },
           { name: "Pdt. Merry Rumondang Malau", church: "GKI Gunung Sahari" },
           { name: "Pdt. Michael Chandra Wijaya", church: "GKI Nurdin" },
           { name: "Pdt. Michael Suryajaya", church: "GKI Seroja" },
           { name: "Pdt. Modi Tiko Pradana", church: "GKI Cibadak" },
           { name: "Pdt. Mulyadi", church: "GKI Muara Karang" },
           { name: "Pdt. Nadya Dewi Natalia", church: "GKI Gatot Subroto" },
           { name: "Pdt. Nanang", church: "GKI Mangga Besar" },
           { name: "Pdt. Natan Kristiyanto", church: "GKI Kayu Putih" },
           { name: "Pdt. Natanael Setiadi", church: "GKI Kayu Putih" },
           { name: "Pdt. Naya Widiawan", church: "GKI Citra I" },
           { name: "Pdt. Noerman Sasono", church: "GKI Halimun" },
           { name: "Pdt. Novita", church: "GKI Gading Indah" },
           { name: "Pdt. Nugraha Yudhi Rumpaka", church: "GKI Bintaro" },
           { name: "Pdt. Nugraheni Iswara Adi", church: "GKI Buaran" },
           { name: "Pdt. Nurkiana Simatupang", church: "GKI Bundasudi" },
           { name: "Pdt. Peter Abet Nego Wijaya", church: "GKI Samanhudi" },
           { name: "Pdt. Prioutomo", church: "GKI Cipinang Indah" },
           { name: "Pdt. Rahmadi Putra", church: "GKI Pasirkoja" },
           { name: "Pdt. Reefo Christy Panabunan", church: "GKI Bungur" },
           { name: "Pdt. Ricardo Sitorus", church: "GKI Kemang Pratama Bekasi" },
           { name: "Pdt. Rinto Tampubolon", church: "GKI Taman Aries" },
           { name: "Pdt. Riseida Novlia Pasaribu", church: "GKI Raya Hankam" },
           { name: "Pdt. Roy Alexander Surjanegara", church: "GKI Buaran" },
           { name: "Pdt. Rumenta Santyani Manurung", church: "GKI Griya Merpati Mas" },
           { name: "Pdt. Samuel", church: "GKI Cicurug" },
           { name: "Pdt. Santoni", church: "GKI Gading Serpong" },
           { name: "Pdt. Semuel Akihary", church: "GKI Samanhudi" },
           { name: "Pdt. Setiawati Sucipto", church: "GKI Surya Utama" },
           { name: "Pdt. Sonny Samuel Hasiholan Turnip", church: "GKI Bekasi Timur" },
           { name: "Pdt. Sosam Enidampra Zebua", church: "GKI Rengasdengklok" },
           { name: "Pdt. Stefani Sohilait", church: "GKI Pondok Makmur" },
           { name: "Pdt. Sthira Budhi Purwosuwito", church: "GKI Gading Indah" },
           { name: "Pdt. Suhud Setyo Wardono", church: "Sekum Bpms GKI" },
           { name: "Pdt. Sunar Birama", church: "GKI Kanaan" },
           { name: "Pdt. Suriawan Edhi", church: "GKI Bungur" },
           { name: "Pdt. Suryatie Ambarsari", church: "GKI Perumnas I" },
           { name: "Pdt. Susamsuri", church: "GKI Anugerah" },
           { name: "Pdt. Susi Juliana", church: "GKI Rahmani" },
           { name: "Pdt. Suta Prawira", church: "GKI Gunung Sahari" },
           { name: "Pdt. Sutanto Teddhy", church: "GKI Cimahi" },
           { name: "Pdt. Suto Tan", church: "GKI Agape" },
           { name: "Pdt. Theo Paulus Situmorang", church: "GKI Metro Lampung" },
           { name: "Pdt. Timur Citra Sari", church: "GKI Bekasi Timur" },
           { name: "Pdt. Tjen Benny", church: "GKI Pinangsia Gloria" },
           { name: "Pdt. Tri Santoso", church: "GKI Pengadilan Bogor" },
           { name: "Pdt. Ujun Junaedi", church: "GKI Guntur" },
           { name: "Pdt. Verawati", church: "GKI Cipinang Indah" },
           { name: "Pdt. Vince Ferdinan Markus", church: "GKI Sutopo" },
           { name: "Pdt. Vincenco Garuda Damara", church: "GKI Buaran" },
           { name: "Pdt. Wee Williyanto", church: "GKI Maulana Yusuf" },
           { name: "Pdt. Wendy Pratama Gouw", church: "GKI Jatinegara" },
           { name: "Pdt. Widya Astuti", church: "GKI Kosambi Timur" },
           { name: "Pdt. Windyarti Angelia", church: "GKI Kavling Polri" },
           { name: "Pdt. Yael Eka Hadiputeri", church: "GKI Muara Karang" },
           { name: "Pdt. Yanti Rusli", church: "GKI Cawang" },
           { name: "Pdt. Yedi Otniel Liline", church: "GKI Sunter" },
           { name: "Pdt. Yerusa Maria Agustini H.", church: "GKI Pakuwon" },
           { name: "Pdt. Yeryandri Wilson Tungga", church: "GKI Bundasudi" },
           { name: "Pdt. Yesie Irawan", church: "GKI Kayu Putih" },
           { name: "Pdt. Yolanda Pantou", church: "GKI Surya Utama" },
           { name: "Pdt. Yosafat Simatupang", church: "GKI Sudirman" },
           { name: "Pdt. Yusak Soleiman", church: "GKI Kayu Putih" },
           { name: "Pdt.Em. Adijanto Suryadi", church: "GKI Surya Utama" },
           { name: "Pdt.Em. Andar Ismail", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Anderas Hadi Simeon", church: "GKI Bungur" },
           { name: "Pdt.Em. Asworo Pireno", church: "GKI Camar" },
           { name: "Pdt.Em. Benjamin Maleachi", church: "GKI Wahid Hasyim" },
           { name: "Pdt.Em. Budiono Adi Wibowo", church: "GKI Maulana Yusuf" },
           { name: "Pdt.Em. Daisy Lukman", church: "GKI Pinangsia Gloria" },
           { name: "Pdt.Em. Dede Soerja Moeljana", church: "GKI Buaran" },
           { name: "Pdt.Em. Dianawati Sarah Juwanda", church: "GKI Nurdin" },
           { name: "Pdt.Em. Ellisabeth", church: "GKI Citra I" },
           { name: "Pdt.Em. Elly Ledia Tehupeiory", church: "GKI Raya Hankam" },
           { name: "Pdt.Em. Faith Yuswandi", church: "GKI Pinangsia Gloria" },
           { name: "Pdt.Em. Ferdinand Suleeman", church: "GKI Bekasi Timur" },
           { name: "Pdt.Em. Flora Dharmawan", church: "GKI Gunung Sahari" },
           { name: "Pdt.Em. Grace Elim", church: "GKI Bungur" },
           { name: "Pdt.Em. Harry Gunawan", church: "GKI Ayudia" },
           { name: "Pdt.Em. Haryanto Wahyudi Maranatha", church: "GKI Nurdin" },
           { name: "Pdt.Em. Henkie Kertamihardja", church: "GKI Kepa Duri" },
           { name: "Pdt.Em. Henry Efferin", church: "GKI Anugerah" },
           { name: "Pdt.Em. Henry Rugun Tarigan Girsang", church: "GKI Kalideres" },
           { name: "Pdt.Em. Heryadi Atmasuyana", church: "GKI Sudirman" },
           { name: "Pdt.Em. Iwan Tri Wakhyudi", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Jahja Purwanto", church: "GKI Pasirkaliki" },
           { name: "Pdt.Em. Jahja Sunarja", church: "GKI Puri Indah" },
           { name: "Pdt.Em. Jefta Chandra Widiatmadja", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Jimmer L. G. Saragih", church: "GKI Sutopo" },
           { name: "Pdt.Em. Joppy Alexander Saerang", church: "GKI Anugerah" },
           { name: "Pdt.Em. Joseph The To Liong", church: "GKI Jatinegara" },
           { name: "Pdt.Em. Julius Kristianto", church: "GKI Melur" },
           { name: "Pdt.Em. Junatan Subianto", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Kathleen Tan Kiuw Tin", church: "GKI Rahmani" },
           { name: "Pdt.Em. Liely S. Setiadi", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Lucia Dahliana Widjaja", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Luther Tan", church: "GKI Perniagaan" },
           { name: "Pdt.Em. Magdalena Handoyo", church: "GKI Pasirkaliki" },
           { name: "Pdt.Em. Matius T.Adi Prawira", church: "GKI Kanaan" },
           { name: "Pdt.Em. Maxi Sompotan", church: "GKI Re Martadinata" },
           { name: "Pdt.Em. Meitha Sartika", church: "GKI Delima" },
           { name: "Pdt.Em. Mellisa Sugihermanto", church: "GKI Terang Hidup" },
           { name: "Pdt.Em. Merry Sung", church: "GKI Penginjil" },
           { name: "Pdt.Em. Natan Setiabudi", church: "GKI Kedoya" },
           { name: "Pdt.Em. Nur Wahjuni Kristiadji", church: "GKI Perniagaan" },
           { name: "Pdt.Em. Nurhayati Girsang", church: "GKI Gunung Sahari" },
           { name: "Pdt.Em. Omo Hasim", church: "GKI Cikarang" },
           { name: "Pdt.Em. Paul Suradji", church: "GKI Cawang" },
           { name: "Pdt.Em. Peterus Nadjari", church: "GKI Terate" },
           { name: "Pdt.Em. Raden August Sehat Pandiangan", church: "GKI Perniagaan" },
           { name: "Pdt.Em. Rasid Rachman", church: "GKI Surya Utama" },
           { name: "Pdt.Em. Rewah Auriani Handayani S.", church: "GKI Pasirkaliki" },
           { name: "Pdt.Em. Robby I Gusti Chandra", church: "GKI Kayu Putih" },
           { name: "Pdt.Em. Ronny Nathanael", church: "GKI Gading Indah" },
           { name: "Pdt.Em. Ronny Setiamukti", church: "GKI Muara Karang" },
           { name: "Pdt.Em. Royandi Tanudjaya", church: "GKI Gunung Sahari" },
           { name: "Pdt.Em. Samuel Santoso", church: "GKI Kedoya" },
           { name: "Pdt.Em. Samuel Suryodinoto", church: "GKI Layur" },
           { name: "Pdt.Em. Semuel Obaja Purwadisatra", church: "GKI Wahid Hasyim" },
           { name: "Pdt.Em. Setiawan Oetama", church: "GKI Samanhudi" },
           { name: "Pdt.Em. Sheph Davidy Jonazh", church: "GKI Gunung Sahari" },
           { name: "Pdt.Em. Suatami Sutedja", church: "GKI Gading Indah" },
           { name: "Pdt.Em. Sugiarto Sutanto", church: "GKI Taman Aries" },
           { name: "Pdt.Em. Suryadi", church: "GKI Cikarang" },
           { name: "Pdt.Em. Suryadi Niman", church: "GKI Cipinang Indah" },
           { name: "Pdt.Em. Tonny Arwadi", church: "GKI Delima" },
           { name: "Pdt.Em. Tri Hiantoro", church: "GKI Kebonjati" },
           { name: "Pdt.Em. Tri Hiantoro", church: "GKI Kebonjati" },
           { name: "Pdt.Em. Willy Berlian", church: "GKI Duta Mas Batam" },
           { name: "Sdr. David Ryantama Sitorus", church: "(Kader Kependetaan GKI) Praktik Jemaat 2 - GKI Sidoarjo" },
           { name: "Pdt. Boas Pepalem Tarigan", church: "GKI Palsigunung - Depok" },
           { name: "Pdt. Markus Hadinata", church: "GKI Perniagaan" },
           { name: "Pdt. Yonatan Wijayanto", church: "GKI Serpong" },
           // PENATUA
           { name: "Pnt. Ana Nur'Aini", church: "GKI Gading Indah" },
           { name: "Pnt. Frida Tri Jayanti", church: "GKI Kebonjati" },
           { name: "Pnt. Gabriela Nathania", church: "GKI Kalideres" },
           { name: "Pnt. Gilbert Christian Kristamulyana", church: "GKI Gunung Sahari" },
           { name: "Pnt. Harapan Panjaitan", church: "GKI Raya Hankam" },
           { name: "Pnt. Jefrry Aswin Hartanto", church: "GKI Sumbawa Dua" },
           { name: "Pnt. Liem Septian Adi Nugroho", church: "GKI Agus Salim" },
           { name: "Pnt. Marcello Ananda Odang", church: "GKI Layur" },
           { name: "Pnt. Novia Abigail", church: "GKI Sutopo" },
           { name: "Pnt. Theo Krispanki Dandel", church: "GKI Muara Karang" },
           { name: "Pnt. Yason Resyiworo Hyangputra", church: "GKI Sutopo" },
           { name: "Pnt. Yosafat Prasanda Hanaryo", church: "GKI Pamanukan" },
           { name: "Pnt. Zeta Dahana", church: "GKI Maulana Yusuf" },
           { name: "Pnt. Wahyu Retno Palupi", church: "" },
           { name: "Pnt. Albherd RP Hutasoit", church: "" },
           { name: "Pnt. Murjangkung", church: "" },
           { name: "Pnt. Dwi Rahayu Ning Tyas", church: "" },
           { name: "Pnt. Esteman Ndraha", church: "" },
           { name: "Pnt. Hendrik S. Millu", church: "" },
           { name: "Pnt. Sutrisno", church: "" },
           { name: "Pnt. Christina Ellen Pardede", church: "" },
           { name: "Pnt. Henni Indriani", church: "" },
           { name: "Pnt. Leonard Gultom", church: "" },
           { name: "Pnt. Wiyata", church: "" },
           { name: "Pnt. Heriwandi Saputro", church: "" },
           { name: "Pnt. Dewi Prihatiningsih", church: "" },
           { name: "Pnt. Resha Esy Pindaow Barus", church: "" },
           { name: "Pnt. Nanad Sunardi", church: "" },
           { name: "Pnt. Sutanto", church: "" },
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
    let yPos = 100;

    // Draw logo
    if (state.logoLoaded && state.logo) {
        const size = 120;
        let x = W / 2 - size / 2;

        // Adjust position based on alignment
        if (templateState.mainAlignment === 'left') x = 100;
        if (templateState.mainAlignment === 'right') x = W - size - 100;

        // Logo background
        ctx.fillStyle = `rgba(255,255,255,${template.style === 'bold' ? '0.95' : '0.85'})`;
        ctx.beginPath();
        ctx.roundRect(x - 10, yPos - 10, size + 20, size + 20, template.borderRadius);
        ctx.fill();
        ctx.drawImage(state.logo, x, yPos, size, size);

        yPos += size + 40;
    } else {
        yPos = 150;
    }

    // Church name
    yPos += 30;
    ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
    ctx.font = `900 ${template.style === 'bold' ? '52px' : '48px'} "${template.mainFont}"`;
    let churchNameX = W / 2;
    if (templateState.mainAlignment === 'left') churchNameX = 100;
    if (templateState.mainAlignment === 'right') churchNameX = W - 100;

    ctx.fillText(state.churchName.toUpperCase(), churchNameX, yPos);

    // Divider line
    if (template.hasDivider) {
        yPos += 60;
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
        yPos += 20;
    } else {
        yPos += 30;
    }

    // Service type
    yPos += 40;
    ctx.font = `700 ${template.style === 'bold' ? '70px' : '65px'} "${template.mainFont}"`;
    let title = getServiceTitle();
    ctx.fillStyle = templateState.accentColor;
    ctx.fillText(title, churchNameX, yPos);

    // Date
    yPos += 80;
    ctx.font = `700 ${template.style === 'bold' ? '52px' : '48px'} "${template.subFont}"`;
    ctx.fillStyle = state.autoColor ? (state.contrast === 'light' ? '#ffffff' : '#ffffff') : state.customColor;
    ctx.fillText(state.data.date || "Minggu, 01 Jan 2023", churchNameX, yPos);

    // **PERUBAHAN PENTING: Hanya tampilkan waktu jika BUKAN remaja-bergabung**
    // Checkbox untuk mode "Bergabung dengan Umum"
    const isBergabungMode = document.getElementById('bergabungCheck') ? document.getElementById('bergabungCheck').checked : false;
    
    // Time info - TAMPILKAN KECUALI untuk Remaja-Pemuda dalam mode bergabung
    if (!(state.type === 'remaja' && isBergabungMode)) {
        yPos += 70;
        drawTimeInfo(churchNameX, yPos, template);
        yPos += 100;
    } else {
        yPos += 30; // Kurangi jarak karena tidak ada waktu
    }

    // **PERUBAHAN PENTING: Tampilkan "BERGABUNG" untuk Remaja-Pemuda mode bergabung**
    if (state.type === 'remaja' && isBergabungMode) {
        // Tampilkan "BERGABUNG" dalam ukuran besar dengan underline
        yPos += 150;
        ctx.font = `900 ${template.style === 'bold' ? '85px' : '80px'} "${template.mainFont}"`;
        ctx.fillStyle = templateState.accentColor;
        
        // Gambar teks "BERGABUNG"
        const text = "BERGABUNG";
        ctx.fillText(text, churchNameX, yPos);
        
        // Tambahkan underline
        const textWidth = ctx.measureText(text).width;
        const underlineY = yPos + 10;
        ctx.beginPath();
        ctx.moveTo(churchNameX - textWidth/2, underlineY);
        ctx.lineTo(churchNameX + textWidth/2, underlineY);
        ctx.strokeStyle = templateState.accentColor;
        ctx.lineWidth = 6;
        ctx.stroke();
        
        yPos += 150;
    } 
    // Tampilkan tema normal untuk tipe lain
    else if (!['rt', 'syukur', 'sekolahminggu', 'praremaja'].includes(state.type)) {
        yPos += 150;
        ctx.font = `italic 700 ${template.style === 'artistic' ? '65px' : '60px'} "Playfair Display"`;
        ctx.fillStyle = templateState.accentColor + (template.style === 'artistic' ? 'cc' : 'b3');
        ctx.fillText(`"${state.data.tema || "Tema Kebaktian"}"`, churchNameX, yPos);
        yPos += 120;
    } else {
        yPos += 50;
    }

    // Service info - Jangan tampilkan info pelayan untuk Remaja-Pemuda mode bergabung
    drawServiceInfo(yPos, churchNameX, template);

    // Website
    ctx.fillStyle = templateState.accentColor + 'cc';
    ctx.font = `700 ${template.style === 'bold' ? '36px' : '32px'} "${template.subFont}"`;
    ctx.textAlign = 'center';
    ctx.fillText("www.gkigriyamerpatimas.or.id", W / 2, H - 100);
}

function getServiceTitle() {
    if (state.type === 'umum') return "KEBAKTIAN UMUM";
    if (state.type === 'remaja') return "KEBAKTIAN REMAJA PEMUDA"; // Tetap sama
    if (state.type === 'praremaja') return state.data.judul ? state.data.judul.toUpperCase() : "KEBAKTIAN PRA REMAJA";
    if (state.type === 'dewasa') return "PERSEKUTUAN DEWASA";
    if (state.type === 'sekolahminggu') return state.data.judul ? state.data.judul.toUpperCase() : "KEBAKTIAN ASM";
    if (state.type === 'rt') return "KEBAKTIAN RUMAH TANGGA";
    if (state.type === 'syukur') return "KEBAKTIAN SYUKUR";
    return "KEBAKTIAN";
}

function drawTimeInfo(x, y, template) {
    // Jangan tampilkan waktu untuk Remaja-Pemuda jika mode bergabung aktif
    const isBergabungMode = document.getElementById('bergabungCheck') ? document.getElementById('bergabungCheck').checked : false;
    
    if (state.type === 'remaja' && isBergabungMode) {
        return y;
    }
    
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
    
    return y;
}

function drawServiceInfo(startY, x, template) {
    let yPos = startY + 40;
    ctx.textAlign = templateState.mainAlignment;
    let centerX = x;

    // Jangan tampilkan info pelayan untuk Remaja-Pemuda jika mode bergabung aktif
    const isBergabungMode = document.getElementById('bergabungCheck') ? document.getElementById('bergabungCheck').checked : false;
    
    if (state.type === 'remaja' && isBergabungMode) {
        return yPos;
    }

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

    // Draw preacher info
    if (state.data.pelayan && !(state.type === 'remaja' && isBergabungMode)) {
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
            yPos = wrapText(ctx, `${state.data.ket}`, centerX, yPos, W - 200, 45);
        }
    }

    // Clear shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    return yPos;
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

// ==================== GOOGLE IMAGE SEARCH FUNCTIONS ====================
function initImageSearch() {
    const searchInput = document.getElementById('googleSearch');
    const searchButton = document.getElementById('btnSearch');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (!searchInput || !searchButton) return;

    // 1. Tombol CARI (Search) - Selalu mulai dari halaman 1
    searchButton.onclick = () => {
        const term = searchInput.value.trim();
        if (term) {
            performSearch(term, 1); 
        } else {
            showToast("Masukkan kata kunci pencarian", "error");
        }
    };

    // 2. Tombol ENTER di keyboard
    searchInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const term = searchInput.value.trim();
            if (term) performSearch(term, 1);
        }
    };

    // 3. Tombol SEBELUMNYA (Prev)
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                performSearch(currentSearchTerm, currentPage - 1);
            }
        };
    }

    // 4. Tombol SELANJUTNYA (Next)
    if (nextBtn) {
        nextBtn.onclick = () => {
            const maxPage = Math.ceil(totalResults / 10);
            if (currentPage < maxPage) {
                performSearch(currentSearchTerm, currentPage + 1);
            }
        };
    }

    // 5. Chip Kategori
    document.querySelectorAll('.chip[data-search]').forEach(chip => {
        chip.onclick = function () {
            const searchTerm = this.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch(searchTerm, 1);
        };
    });
}

// Fungsi performSearch untuk Google Custom Search
async function performSearch(term, page = 1) {
    // Validasi
    if (!term) {
        // Jika term kosong, coba ambil dari currentSearchTerm atau input
        term = currentSearchTerm || document.getElementById('googleSearch').value.trim();
        if (!term) return;
    }

    // Update Global Variables
    currentSearchTerm = term;
    currentPage = page;

    // UI Elements
    const searchButton = document.getElementById('btnSearch');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const originalBtnText = searchButton.innerHTML;
    const imagesGrid = document.getElementById('imagesGrid');
    const searchResults = document.getElementById('searchResults');

    // --- STATE LOADING: START ---
    searchButton.disabled = true;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    
    searchResults.style.display = 'block';
    
    // Tampilkan animasi loading di grid
    imagesGrid.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-light);">
            <div class="spinner"></div>
            <p style="margin-top: 15px;">Memuat halaman ${page}...</p>
        </div>
    `;

    try {
        // Fetch gambar dari Google Custom Search
        let images = await fetchGoogleImages(term, page);

        if (images.length === 0 && page === 1) {
            images = await fetchFallbackImages(term);
        }

        // Tampilkan hasil
        displayImages(images);
        updatePagination();

    } catch (error) {
        console.error("Search error:", error);
        showToast("Gagal memuat gambar. Coba lagi.", "error");
        
        imagesGrid.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Terjadi kesalahan koneksi.</p>
            </div>
        `;
    } finally {
        // --- STATE LOADING: END ---
        searchButton.innerHTML = '<i class="fas fa-search"></i> Cari Gambar';
        searchButton.disabled = false;
        
        if (page > 1) {
            document.getElementById('searchResults').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

async function fetchSerpApiImages(searchTerm, page = 1) {
    try {
        const cacheKey = `${searchTerm}_${page}`;
        const cached = imageCache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            totalResults = cached.data.totalResults || 0;
            updateResultsCount();
            return cached.data.images;
        }

        if (!SERPAPI_KEY) {
            console.warn("API Key SerpApi tidak ditemukan.");
            return await fetchFallbackImages(searchTerm);
        }

        // Parameter untuk Google Images Search
        const params = new URLSearchParams({
            engine: 'google_images',       // Ganti ke 'google_images'
            q: searchTerm,
            api_key: SERPAPI_KEY,
            start: (page - 1) * 10,        // Parameter paginasi SerpApi
            safe: 'active',
            tbs: 'isz:lt,islt:4mp,iar:s'   // Filter: lisensi komersial & rasio tinggi
        });

        const url = `${SERPAPI_ENDPOINT}?${params}`;
        console.log("URL SerpApi:", url);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`SerpApi error: ${response.status}`);
        }

        const data = await response.json();
        console.log("SerpApi response:", data);
        
        // Total hasil dari `search_information`
        totalResults = data.search_information?.total_results || 0;
        updateResultsCount();

        // Gambar berada di `images_results`
        const images = data.images_results?.map(item => ({
            url: item.original,           // URL gambar resolusi tinggi
            thumbnail: item.thumbnail,    // URL thumbnail
            preview: item.thumbnail,
            width: item.original_width,
            height: item.original_height,
            title: item.title || searchTerm,
            author: item.source || 'SerpApi',
            source: 'serpapi'
        })) || [];

        // Simpan ke cache
        imageCache.set(cacheKey, {
            timestamp: Date.now(),
            data: { images, totalResults }
        });

        return images;

    } catch (error) {
        console.error("SerpApi failed:", error);
        showToast(`Gagal memuat gambar: ${error.message}`, "error");
        return await fetchFallbackImages(searchTerm);
    }
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${totalResults.toLocaleString()} gambar ditemukan`;
    }
}

async function fetchFallbackImages(searchTerm) {
    console.log("Using fallback images for:", searchTerm);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    totalResults = FALLBACK_IMAGES.length * 3;
    updateResultsCount();
    
    // Update teks untuk menunjukkan ini demo
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${totalResults.toLocaleString()} gambar ditemukan (Fallback Images)`;
    }

    return FALLBACK_IMAGES.map((img, index) => ({
        url: img.url,
        thumbnail: img.thumbnail,
        preview: img.thumbnail.replace('w=400&h=400', 'w=100&h=100'),
        width: 1080,
        height: 1440,
        title: `${searchTerm} ${index + 1}`,
        author: 'Unsplash',
        photographer_url: 'https://unsplash.com'
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

    // Observer untuk lazy loading
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px', // Preload sedikit sebelum muncul
        threshold: 0.01
    });

    images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.index = index;
        
        // Loading Spinner Container
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'image-loading';
        loadingSpinner.style.position = 'absolute';
        loadingSpinner.style.top = '0';
        loadingSpinner.style.left = '0';
        loadingSpinner.style.width = '100%';
        loadingSpinner.style.height = '100%';
        loadingSpinner.style.background = '#f0f0f0';
        loadingSpinner.style.zIndex = '1';
        imageItem.appendChild(loadingSpinner);

        // Elemen Gambar
        const img = document.createElement('img');
        img.className = 'lazy-image';
        img.alt = image.title;
        img.setAttribute('data-src', image.thumbnail); // Simpan URL di data-src
        
        // Style agar gambar fit
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.opacity = '0'; // Sembunyikan dulu
        img.style.transition = 'opacity 0.3s ease';
        img.style.position = 'relative';
        img.style.zIndex = '2';

        // Event saat gambar SELESAI dimuat
        img.onload = function() {
            img.style.opacity = '1'; // Munculkan gambar
            loadingSpinner.style.display = 'none'; // Hilangkan loading
        };

        img.onerror = function() {
            loadingSpinner.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            console.warn("Gagal memuat:", image.thumbnail);
        };

        // Langsung append ke DOM agar Observer bisa melihatnya
        imageItem.appendChild(img);
        
        // Info overlay (opsional)
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute; bottom: 0; left: 0; right: 0;
            background: rgba(0,0,0,0.6); color: white; padding: 4px;
            font-size: 10px; text-align: center; opacity: 0;
            transition: opacity 0.3s; z-index: 3; pointer-events: none;
        `;
        overlay.textContent = `Source: ${image.author}`;
        imageItem.appendChild(overlay);

        imageItem.addEventListener('mouseenter', () => overlay.style.opacity = '1');
        imageItem.addEventListener('mouseleave', () => overlay.style.opacity = '0');

        // Click event
        imageItem.addEventListener('click', () => selectImage(image.url, index));

        // Masukkan item ke grid
        imagesGrid.appendChild(imageItem);

        // Mulai observasi gambar ini
        observer.observe(img);
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

    // Tampilkan loading
    showToast("Memuat gambar...", "info");

    // Load gambar
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = function () {
        state.frame = img;
        state.isCustomFrame = false;
        updateData();
        draw();
        showToast("Background dari Google Images berhasil dipilih!", "success");
    };

    img.onerror = function () {
        showToast("Gagal memuat gambar. Coba pilih gambar lain.", "error");
    };

    // Scroll ke preview
    document.querySelector('.preview-panel').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
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

    // Checkbox "Bergabung dengan Kebaktian Umum"
    const bergabungCheck = document.getElementById('bergabungCheck');
    if (bergabungCheck) {
        bergabungCheck.addEventListener('change', function() {
            if (this.checked) {
                showToast("Mode Bergabung aktif: Waktu dan Pelayan Firman tidak ditampilkan", "info");
            } else {
                showToast("Mode Bergabung nonaktif", "info");
            }
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

    if (type === 'umum') {
        document.getElementById('section-umum').classList.remove('hidden');
    } else if (type === 'remaja' || type === 'dewasa') {
        document.getElementById('section-remaja-dewasa').classList.remove('hidden');
    } else if (type === 'praremaja') {
        document.getElementById('section-praremaja').classList.remove('hidden');
    } else if (type === 'sekolahminggu') {
        document.getElementById('section-sekolahminggu').classList.remove('hidden');
    } else if (type === 'rt' || type === 'syukur') {
        document.getElementById('section-rt-syukur').classList.remove('hidden');
    }
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
    } else if (['rt', 'syukur'].includes(state.type)) {
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