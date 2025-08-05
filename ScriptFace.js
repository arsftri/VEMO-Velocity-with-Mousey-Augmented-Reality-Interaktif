//@input SceneObject headBinding   // Input dari Lens Studio: objek wajah yang dilacak (biasanya Head Binding)
 //@input SceneObject sunglasses   // Input: objek kacamata virtual yang akan digerakkan
 //@input float dropThreshold = 20.0   // Batas rotasi kepala (dalam derajat) untuk memicu gerakan kacamata
 //@input vec3 startPosition = vec3(0, 14.6258, 0.0)   // Posisi awal kacamata (di atas kepala)
 //@input vec3 endPosition = vec3(0, 5.3045, 0.0)      // Posisi akhir kacamata (di posisi mata)
 //@input float delaySeconds = 4.65   // Waktu delay sebelum sistem mulai mendeteksi gerakan kepala (dalam detik)

var hasDropped = false;   // Menyimpan status apakah kacamata sudah turun atau belum
var allowDrop = false;    // Menandakan apakah sistem sudah boleh mendeteksi gerakan kepala untuk menurunkan kacamata
var timeElapsed = 0;      // Menghitung waktu berjalan sejak awal script dijalankan

// Fungsi untuk mereset kacamata ke posisi awal (bisa dipanggil manual)
function resetSunglasses() {
    script.sunglasses.getTransform().setLocalPosition(script.startPosition);  // Mengembalikan posisi kacamata ke atas kepala
    hasDropped = false;    // Status kacamata di-set belum turun
    allowDrop = false;     // Deteksi gerakan kepala dinonaktifkan sementara
    timeElapsed = 0;       // Waktu berjalan di-reset ke 0
    print("🔁 Posisi awal kacamatanya di-set ulang.");  // Menampilkan pesan log bahwa posisi awal di-reset
}

// Panggil fungsi reset saat script pertama kali dijalankan
resetSunglasses();

// Update setiap frame (dijalankan terus-menerus selama Lens aktif)
var event = script.createEvent("UpdateEvent");
event.bind(function () {
    // Jika belum melewati delay, hitung waktu dulu
    if (!allowDrop) {
        timeElapsed += getDeltaTime();  // Tambahkan waktu delta (selisih antar frame)
        if (timeElapsed >= script.delaySeconds) {
            allowDrop = true;  // Setelah delay selesai, izinkan mendeteksi gerakan kepala
            print("🟢 Delay selesai. Sekarang bisa turun jika kepala mengangguk.");  // Log bahwa sistem siap
        } else {
            return;  // Jika delay belum selesai, hentikan proses di sini
        }
    }

    // Ambil rotasi kepala pengguna (dalam radian, lalu diubah ke derajat)
    var headRot = script.headBinding.getTransform().getWorldRotation().toEulerAngles();
    var xRotDeg = headRot.x * 180.0 / Math.PI;  // Ambil rotasi sumbu X (gerakan nunduk)

    // Jika kepala nunduk melewati batas dan kacamata belum turun, turunkan
    if (xRotDeg > script.dropThreshold && !hasDropped) {
        script.sunglasses.getTransform().setLocalPosition(script.endPosition);  // Geser posisi kacamata ke bawah (mata)
        hasDropped = true;  // Tandai bahwa kacamata sudah turun
        print("😎 Kacamata turun ke mata dan akan stay di sana.");  // Log bahwa animasi turun terjadi
    }

    // Tidak ada perintah untuk naik lagi — kacamata akan tetap di bawah
});
