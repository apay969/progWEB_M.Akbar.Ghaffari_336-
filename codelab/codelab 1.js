function hitung() {
    // Ambil nilai input dari dua field
    const bilangan1 = document.getElementById('bilangan1').value;
    const bilangan2 = document.getElementById('bilangan2').value;

    // Cek apakah input kosong atau tidak valid
    if (bilangan1 === "" || bilangan2 === "") {
        alert("Mohon masukkan kedua bilangan.");
        return;
    }

    // Konversi nilai input ke tipe number
    const num1 = parseFloat(bilangan1);
    const num2 = parseFloat(bilangan2);

    // Cek apakah input valid berupa angka
    if (isNaN(num1) || isNaN(num2)) {
        alert("Masukkan nilai numerik yang valid.");
        return;
    }

    // Hitung hasil penjumlahan
    const hasil = num1 + num2;

    // Tampilkan hasil di elemen hasil
    document.getElementById('hasil').innerText = "Hasil: " + hasil;
}

function reset() {
    // Kosongkan field input
    document.getElementById('bilangan1').value = '';
    document.getElementById('bilangan2').value = '';

    // Set hasil kembali ke nol
    document.getElementById('hasil').innerText = "Hasil: 0";
}
