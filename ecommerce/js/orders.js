const orders = JSON.parse(localStorage.getItem("stepup-orders")) || [];

function formatRupiah(number) {
    return "Rp" + number.toLocaleString("id-ID");
}

function renderOrders () {
    const ordersList = document.getElementById("ordersList");

    if (orders.length === 0) {
        ordersList.innerHTML = `
        <div style="text-align:center; padding:60px  20px; color:#aaa;">
            <i class="fas fa-receipt" style="font-size: 3rem; display:block; margin-bottom:16px; opacity:0.3"></i>
            <p>Belum ada pesanan</p>
        </div>
        `;
        return;
    }

    // Tampilkan dari yg terbaru
    const sorted = [...orders].reverse();

  ordersList.innerHTML = sorted.map(order => `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <p class="order-id">#${order.id}</p>
          <p class="order-date">${order.tanggal}</p>
        </div>
        <span class="order-status">✅ Selesai</span>
      </div>
      <div class="order-card-items">
        ${order.items.map(item => `
          <div class="order-card-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <p class="order-item-name">${item.name}</p>
              <p class="order-item-price">${formatRupiah(item.price)} × ${item.qty}</p>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="order-card-footer">
        <div class="order-card-info">
          <p><i class="fas fa-user"></i> ${order.nama}</p>
          <p><i class="fas fa-map-marker-alt"></i> ${order.kota}</p>
          <p><i class="fas fa-credit-card"></i> ${order.payment}</p>
        </div>
        <div class="order-card-total">
          <span>Total</span>
          <strong>${formatRupiah(order.total)}</strong>
        </div>
      </div>
    </div>
  `).join("");
}

renderOrders();