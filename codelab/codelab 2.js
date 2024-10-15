function validateForm() {
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const alamat = document.getElementById('alamat').value.trim();

    // Validasi nama
    if (nama === "") {
        alert("Nama harus diisi.");
        return false;
    }

    // Validasi email
    if (email === "") {
        alert("Email harus diisi.");
        return false;
    } else if (!validateEmail(email)) {
        alert("Email tidak valid.");
        return false;
    }

    // Validasi alamat
    if (alamat === "") {
        alert("Alamat harus diisi.");
        return false;
    }

    // Jika validasi berhasil, form akan dikirim
    return true;
}

function validateEmail(email) {
    // Regex sederhana untuk validasi email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
