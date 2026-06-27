// Untuk Searching Dokter Pada Halaman Beranda 
const doctors = [
    { name: "Drg. Cindy Law", spesialis: "Dokter Gigi", id: "cindy" },
    { name: "Dr. Kenny Gilbert", spesialis: "Dokter Kulit", id: "kenny" },
    { name: "Drg. Chrestella Glacia", spesialis: "Dokter Gigi", id: "chrestella" },
    { name: "Dr. Randy Pratama", spesialis: "Dokter Kandungan", id: "randy" },
    { name: "Dr. Li Wen", spesialis: "Dokter THT", id: "liwen" },
    { name: "Dr. Zhang Wei", spesialis: "Dokter Jantung", id: "zhangwei" }
];

function searchDoctor() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultBox = document.getElementById("searchResult");

    // kalau hasil sudah ada, klik cari lagi = reset
    if (resultBox.innerHTML.trim() !== "") {
        resultBox.innerHTML = "";
        return;
    }

    const filtered = doctors.filter(doc =>
        doc.name.toLowerCase().includes(input)
    );

    if (filtered.length === 0) {
        resultBox.innerHTML = `<div class="not-found">Pencarian Tidak Ditemukan</div>`;
        return;
    }

    filtered.forEach(doc => {
        resultBox.innerHTML += `
            <div class="search-item" onclick="goToDoctor('${doc.id}')">
                <strong>${doc.name}</strong><br>
                <small>${doc.spesialis}</small>
            </div>
        `;
    });
}
function goToDoctor(id) {
    window.location.href = "doctor.html#" + id;
}

// Auto Search saat Mengetik
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("searchInput");
    if (input) {
        input.addEventListener("keyup", searchDoctor);
    }
});


// Melihat Jadwal Dokter Secara Pop up
function toggleJadwal(id) {
    const el = document.getElementById(id);
    el.classList.toggle("active");
}

// Penyinkronan Jadwal Dokter untuk menjadi opsi jadwal pada form reservasi

const jadwalDokter = {
    cindy: [
        { klinik:"Zealth Medical Center",hari: 1, mulai: "08:00", selesai: "12:00" }, // Senin
        { klinik:"Siloam Hospital",hari: 3, mulai: "10:00", selesai: "14:00" }  // Rabu
    ],

    kenny: [
        { klinik:"Vitalis Care Hospital",hari: 1, mulai: "09:00", selesai: "11:00" },
        { klinik:"Kenny Private Clinic",hari: 4, mulai: "18:00", selesai: "20:00" }
    ],

    chrestella: [
        { klinik:"Aurora Care Hospital",hari: 3, mulai: "10:00", selesai: "17:00" },
        { klinik:"Zealth Medical Center",hari: 5, mulai: "17:00", selesai: "19:00" }
    ],

    randy: [
        { klinik:"PrimeLife Hospital",hari: 3, mulai: "12:00", selesai: "18:30" },
        { klinik:"Klinik Randy Sukses",hari: 6, mulai: "09:00", selesai: "11:00" }
    ],

    liwen: [
        { klinik:"Harmony Health Hospital",hari: 2, mulai: "12:00", selesai: "17:30" },
        { klinik:"Zealth Medical Care",hari: 4, mulai: "10:30", selesai: "16:00" }
    ],

    zhangwei: [
        { klinik:"Nusantara Medika Hospital",hari: 4, mulai: "15:00", selesai: "19:00" },
        { klinik:"Klinik Jantung Sehat",hari: 5, mulai: "10:00", selesai: "18:00" }
    ]
};
function updateLokasi() {
    const dokter = document.getElementById("doctorSelect").value;
    const lokasiSelect = document.getElementById("lokasiSelect");

    lokasiSelect.innerHTML = `<option value="">-- Pilih Lokasi --</option>`;

    if (!dokter) return;

    const lokasiUnik = [
        ...new Set(jadwalDokter[dokter].map(j => j.klinik))
    ];

    lokasiUnik.forEach(lokasi => {
        lokasiSelect.innerHTML += `
            <option value="${lokasi}">${lokasi}</option>
        `;
    });
}
document.addEventListener("DOMContentLoaded", () => {

    const dokter = document.getElementById("doctorSelect");
    const tanggal = document.getElementById("tanggalReservasi");
    const waktu = document.getElementById("waktuReservasi");

    if (!dokter || !tanggal || !waktu) return;

    // DEBUG
    tanggal.addEventListener("change", () => {

        const selectedDate = new Date(tanggal.value);

        console.log(selectedDate);
        console.log("Hari =", selectedDate.getDay());

    });

    // VALIDASI TANGGAL
    tanggal.addEventListener("change", () => {

        if (!dokter.value) {
            alert("Pilih dokter terlebih dahulu");
            tanggal.value = "";
            return;
        }

        const selectedDate = new Date(tanggal.value);
        const hari = selectedDate.getDay();

        const tersedia = jadwalDokter[dokter.value].some(
            jadwal => jadwal.hari === hari
        );

        if (!tersedia) {
            alert("Jadwal Tidak Tersedia");
            tanggal.value = "";
        }
    });

});
// PENYINKRONAN PENEKANAN TOMBOL YANG ADA DI doctor.html dan service.html
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const doctor = params.get("doctor");

    console.log("Doctor:", doctor);

    if (doctor) {
        document.getElementById("doctorSelect").value = doctor;
    }
});
    // VALIDASI RESERVASI YANG DI INPUT USER
document.addEventListener("DOMContentLoaded", () => {

    const dokter = document.getElementById("doctorSelect");
    const lokasi = document.getElementById("lokasiSelect");
    const tanggal = document.getElementById("tanggalReservasi");
    const waktu = document.getElementById("waktuReservasi");

    if (!dokter || !lokasi || !tanggal || !waktu) return;

    dokter.addEventListener("change", updateLokasi);

    // CEK RESERVASI YANG DI INPUT USER
    function cekJadwal() {

        if (!dokter.value || !lokasi.value || !tanggal.value || !waktu.value) return;

        const hari = new Date(tanggal.value).getDay();
        const jamDipilih = waktu.value;

        const jadwal = jadwalDokter[dokter.value];

        const tersedia = jadwal.some(j => 
            j.klinik === lokasi.value &&
            j.hari === hari &&
            jamDipilih >= j.mulai &&
            jamDipilih < j.selesai
        );

        if (!tersedia) {
            alert("Jadwal Tidak Tersedia");
            waktu.value = "";
        }
    }

    lokasi.addEventListener("change", cekJadwal);
    tanggal.addEventListener("change", cekJadwal);
    waktu.addEventListener("change", cekJadwal);
});

// Validasi Inputan Nama,Nomor Telepon,NIK
document.addEventListener("DOMContentLoaded", () => {

    const nama = document.getElementById("NamaLengkap");
    const noHP = document.getElementById("NoHP");
    const nik = document.getElementById("NIK");
    const dokter = document.getElementById("doctorSelect");
    const lokasi = document.getElementById("lokasiSelect");
    const tanggal = document.getElementById("tanggalReservasi");
    const waktu = document.getElementById("waktuReservasi");


    const errorNama = document.getElementById("ErrorNama");
    const errorHP = document.getElementById("ErrorHP");
    const errorNIK = document.getElementById("ErrorNIK");

    // VALIDASI NAMA
    nama.addEventListener("input", () => {
        const regex = /^[A-Za-z\s]+$/;

        if (!regex.test(nama.value)) {
            errorNama.innerText = "Masukkan Nama dengan Tipe Data yang Tepat";
        } else {
            errorNama.innerText = "";
        }
    });

    // VALIDASI NOMOR HP (HANYA ANGKA)
    noHP.addEventListener("input", () => {
        // hapus selain angka
        noHP.value = noHP.value.replace(/\D/g, "");
        const regex = /^[0-9]+$/;

        if (noHP.value.length > 13) {
            noHP.value = noHP.value.slice(0, 13);
        }

        if (noHP.value.length < 11) {
            errorHP.innerText = "Nomor telepon anda tidak valid karena harus berkisaran 11-13 angka";
        } else {
            errorHP.innerText = "";
        }
       if (!regex.test(noHP.value)) {
            errorHP.innerText = "Masukkan Nomor Telepon dengan Tipe Data yang Tepat!";
        } else {
            errorHP.innerText = "";
        }
    });

    // VALIDASI NIK

    nik.addEventListener("input", () => {
        nik.value = nik.value.replace(/\D/g, "");

        const regex = /^[0-9]+$/;

        if (nik.value.length !== 16) {
            errorNIK.innerText = "NIK harus 16 digit";
        } else {
            errorNIK.innerText = "";
        }

        if (!regex.test(nik.value) && nik.value !== "") {
            errorNIK.innerText = "Masukkan NIK dengan Tipe Data yang Tepat!";
        }
    });
})  

// Simpan Data form agar bisa dimunculkan dan dicek untuk mencegah 2 pasien memilih jadwal reservasi yang sama
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservationForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = {
            nama: document.getElementById("NamaLengkap").value,
            dokter: document.getElementById("doctorSelect").value,
            lokasi: document.getElementById("lokasiSelect").value,
            tanggal: document.getElementById("tanggalReservasi").value,
            waktu: document.getElementById("waktuReservasi").value
        };

        let reservasi = JSON.parse(localStorage.getItem("reservasi")) || [];

        //  CEK APAKAH SUDAH ADA YANG BOOK
        const sudahAda = reservasi.some(r =>
            r.dokter === data.dokter &&
            r.lokasi === data.lokasi &&
            r.tanggal === data.tanggal &&
            r.waktu === data.waktu
        );

        if (sudahAda) {
            alert("Reservasi Sudah di book pasien lain");
            return; // ⛔ STOP DI SINI
        }

        // ✅ SIMPAN JIKA AMAN
        reservasi.push(data);
        localStorage.setItem("reservasi", JSON.stringify(reservasi));

        // ✅ BARU MUNCUL ALERT
        alert("Submit Berhasil");

        // redirect opsional
        window.location.href = "reservasi.html";
    });
});

// Menampilkan Data pada tabel di halaman reservasi.html
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#tabelReservasi tbody");
    if (!tbody) return;

    let reservasi = JSON.parse(localStorage.getItem("reservasi")) || [];

    render();

function render() {
    const tbody = document.querySelector("#tabelReservasi tbody");
    tbody.innerHTML = "";

    let reservasi = JSON.parse(localStorage.getItem("reservasi")) || [];

    reservasi.forEach((r, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${r.nama}</td>
            <td>${r.dokter}</td>
            <td>${r.lokasi}</td>
            <td>${r.tanggal}</td>
            <td>${r.waktu}</td>
            <td></td>
        `;

        // 🔥 BUAT CONTAINER
        const aksiDiv = document.createElement("div");
        aksiDiv.style.display = "flex";
        aksiDiv.style.justifyContent = "center";
        aksiDiv.style.gap = "8px";

        // 🔥 BUTTON EDIT
        const btnEdit = document.createElement("button");
        btnEdit.innerText = "Edit";
        btnEdit.style.background = "#6bbf9f";
        btnEdit.style.color = "white";
        btnEdit.style.border = "none";
        btnEdit.style.padding = "7px 12px";
        btnEdit.style.borderRadius = "8px";
        btnEdit.style.cursor = "pointer";

        // 🔥 HOVER EDIT
        btnEdit.onmouseover = () => btnEdit.style.background = "#4da88a";
        btnEdit.onmouseout = () => btnEdit.style.background = "#6bbf9f";

        // 🔥 BUTTON HAPUS
        const btnHapus = document.createElement("button");
        btnHapus.innerText = "Hapus";
        btnHapus.style.background = "#2e4f4f";
        btnHapus.style.color = "white";
        btnHapus.style.border = "none";
        btnHapus.style.padding = "7px 12px";
        btnHapus.style.borderRadius = "8px";
        btnHapus.style.cursor = "pointer";

        // 🔥 HOVER HAPUS
        btnHapus.onmouseover = () => btnHapus.style.background = "#1f3636";
        btnHapus.onmouseout = () => btnHapus.style.background = "#2e4f4f";

        // 🔥 EVENT
        btnEdit.onclick = () => editData(index);
        btnHapus.onclick = () => hapusData(index);

        // 🔥 GABUNGKAN
        aksiDiv.appendChild(btnEdit);
        aksiDiv.appendChild(btnHapus);

        row.children[5].appendChild(aksiDiv);

        tbody.appendChild(row);
    });
}

    window.hapusData = function(index) {
        reservasi.splice(index, 1);
        localStorage.setItem("reservasi", JSON.stringify(reservasi));
        render();
    }

    window.editData = function(index) {
        const data = reservasi[index];

        localStorage.setItem("editData", JSON.stringify(data));
        localStorage.setItem("editIndex", index);

        window.location.href = "service.html";
    }
});

// Load Data Pada Saat Diedit
document.addEventListener("DOMContentLoaded", () => {

    const editData = JSON.parse(localStorage.getItem("editData"));

    if (!editData) return;

    document.getElementById("NamaLengkap").value = editData.nama;
    document.getElementById("doctorSelect").value = editData.dokter;
    updateLokasi();

    setTimeout(() => {
        document.getElementById("lokasiSelect").value = editData.lokasi;
        document.getElementById("tanggalReservasi").value = editData.tanggal;
        document.getElementById("waktuReservasi").value = editData.waktu;
    }, 200);
});

// Update data pada saat di submit
let editIndex = localStorage.getItem("editIndex");

if (editIndex !== null) {
    reservasi[editIndex] = data;
    localStorage.removeItem("editIndex");
    localStorage.removeItem("editData");
} else {
    reservasi.push(data);
}

