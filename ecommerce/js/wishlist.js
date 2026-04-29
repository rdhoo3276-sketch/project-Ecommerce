let wishlist = JSON.parse(localStorage.getItem("stepup-wishlist")) || [];

function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(w => w.id !== id);
  localStorage.setItem("stepup-wishlist", JSON.stringify(wishlist));
  showToast("💔 Dihapus dari wishlist");
  renderWishlist();
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");

  if (wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <i class="fas fa-heart" style="font-size:3rem; display:block; margin-bottom:16px; opacity:0.3;"></i>
        <p>Wishlist masih kosong</p>
        <a href="index.html" style="color:#e84393; margin-top:12px; display:block;">Mulai belanja →</a>
      </div>
    `;
    return;
  }

  grid.innerHTML = wishlist.map(p => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" />
        <span class="product-badge">${p.category}</span>
        <button class="wishlist-btn active" onclick="removeFromWishlist(${p.id})">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">${formatRupiah(p.price)}</p>
        <a href="index.html" class="add-to-cart" style="text-decoration:none; text-align:center;">
          <i class="fas fa-shopping-bag"></i> Ke Toko
        </a>
      </div>
    </div>
  `).join("");
}

renderWishlist();