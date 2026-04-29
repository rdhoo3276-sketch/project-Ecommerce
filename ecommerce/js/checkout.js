const ONGKIR = 15000;
const PROMO_CODES = {
  "STEPUP10": 10,
  "DISKON20": 20,
  "HEMAT50": 50,
};

let discount = 0;

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

const cart = mode === "buynow"
  ? JSON.parse(localStorage.getItem("stepup-buynow")) || []
  : JSON.parse(localStorage.getItem("stepup-cart")) || [];

function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function renderOrder() {
  const orderItems = document.getElementById("orderItems");
  const orderSubtotal = document.getElementById("orderSubtotal");
  const orderTotal = document.getElementById("orderTotal");

  if (cart.length === 0) {
    orderItems.innerHTML = `<p style="color:#aaa; text-align:center; padding:20px 0">Keranjang kosong</p>`;
    orderSubtotal.textContent = formatRupiah(0);
    orderTotal.textContent = formatRupiah(ONGKIR);
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount + ONGKIR;

  orderItems.innerHTML = cart.map(item => `
    <div class="order-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="order-item-info">
        <p class="order-item-name">${item.name}</p>
        <p class="order-item-price">${formatRupiah(item.price)} × ${item.qty}</p>
      </div>
      <strong>${formatRupiah(item.price * item.qty)}</strong>
    </div>
  `).join("");

  orderSubtotal.textContent = formatRupiah(subtotal);
  orderTotal.textContent = formatRupiah(total);

  if (discount > 0) {
    document.getElementById("discountRow").style.display = "flex";
    document.getElementById("orderDiscount").textContent = `-${formatRupiah(discountAmount)}`;
  } else {
    document.getElementById("discountRow").style.display = "none";
  }
}

function validateForm() {
  const nama = document.getElementById("nama").value.trim();
  const hp = document.getElementById("hp").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const kota = document.getElementById("kota").value.trim();
  const kodepos = document.getElementById("kodepos").value.trim();

  if (!nama) { showToast("❌ Nama lengkap harus diisi!"); return false; }
  if (!hp) { showToast("❌ Nomor HP harus diisi!"); return false; }
  if (!alamat) { showToast("❌ Alamat harus diisi!"); return false; }
  if (!kota) { showToast("❌ Kota harus diisi!"); return false; }
  if (!kodepos) { showToast("❌ Kode pos harus diisi!"); return false; }

  return true;
}

document.getElementById("promoBtn").addEventListener("click", () => {
  const code = document.getElementById("promoInput").value.trim().toUpperCase();
  const promoMsg = document.getElementById("promoMsg");

  if (PROMO_CODES[code]) {
    discount = PROMO_CODES[code];
    promoMsg.style.color = "green";
    promoMsg.textContent = `✅ Kode berhasil! Diskon ${discount}%`;
    renderOrder();
  } else {
    discount = 0;
    promoMsg.style.color = "red";
    promoMsg.textContent = "❌ Kode promo tidak valid!";
    renderOrder();
  }
});

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("❌ Keranjang masih kosong!");
    return;
  }

  if (!validateForm()) return;

  const payment = document.querySelector("input[name='payment']:checked").value;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount + ONGKIR;

  const order = {
    id: Date.now(),
    items: [...cart],
    nama: document.getElementById("nama").value.trim(),
    hp: document.getElementById("hp").value.trim(),
    alamat: document.getElementById("alamat").value.trim(),
    kota: document.getElementById("kota").value.trim(),
    kodepos: document.getElementById("kodepos").value.trim(),
    payment,
    discount,
    total,
    tanggal: new Date().toLocaleDateString("id-ID")
  };

  const orders = JSON.parse(localStorage.getItem("stepup-orders")) || [];
  orders.push(order);
  localStorage.setItem("stepup-orders", JSON.stringify(orders));

  if (mode === "buynow") {
    localStorage.removeItem("stepup-buynow");
  } else {
    localStorage.removeItem("stepup-cart");
  }

  showToast("🎉 Pesanan berhasil dibuat!");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2500);
});

renderOrder();