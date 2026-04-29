// DATA PRODUK
const products = [
  { id: 1, name: "Nike Air", category: "sneakers", price: 850000, image: "assets/images/nike-run.jpg" },
  { id: 2, name: "Addidas Run", category: "sport", price: 780000, image: "assets/images/adidas-run.jpg" },
  { id: 3, name: "Sepatu Formal", category: "formal", price: 650000, image: "assets/images/sepatu-formal.jpg" },
  { id: 4, name: "Adidas Casual", category: "casual", price: 420000, image: "assets/images/adidas.jpg" },
  { id: 5, name: "FASHION Fast.1985", category: "sneakers", price: 90000, image: "assets/images/sepatu-biru.jpg" },
  { id: 6, name: "FASHION Kids", category: "sneakers", price: 130000, image: "assets/images/sepatu-bergaris.jpg" },
  { id: 7, name: "Nike Air Jordan", category: "sneakers", price: 3500000, image: "assets/images/nike-run2.jpg" },
  { id: 8, name: "Nike Air", category: "sneakers", price: 900000, image: "assets/images/nike-abu.jpg" },
];

// STATE
let cart = JSON.parse(localStorage.getItem("stepup-cart")) || [];
let activeCategory = "all";
let searchQuery = "";
let sortBy = "default";
let wishlist = JSON.parse(localStorage.getItem("stepup-wishlist")) || [];
let ratings = JSON.parse(localStorage.getItem("stepup-ratings")) || {};

// Format angka ke rupiah
function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

// Simpan cart ke localStorage
function saveCart() {
  localStorage.setItem("stepup-cart", JSON.stringify(cart));
}

// Tampilkan toast notifikasi
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Toggle wishlist
function toggleWishlist(id) {
  const product = products.find(p => p.id === id);
  const exists = wishlist.some(w => w.id === id);
  if (exists) {
    wishlist = wishlist.filter(w => w.id !== id);
    showToast(`💔 ${product.name} dihapus dari wishlist`);
  } else {
    wishlist.push(product);
    showToast(`❤️ ${product.name} ditambahkan ke wishlist!`);
  }
  localStorage.setItem("stepup-wishlist", JSON.stringify(wishlist));
  renderProducts();
}

// Rating
function rateProduct(id, star) {
  ratings[id] = star;
  localStorage.setItem("stepup-ratings", JSON.stringify(ratings));
  renderProducts();
  showToast(`⭐ Rating tersimpan!`);
}

function getStars(id) {
  const rating = ratings[id] || 0;
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fas fa-star" onclick="event.stopPropagation(); rateProduct(${id}, ${i})" style="cursor:pointer; color:${i <= rating ? '#f5a623' : '#ddd'}; font-size:0.85rem;"></i>`;
  }
  return `<div class="star-wrap">${stars}</div>`;
}

// Render produk ke grid
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const countEl = document.getElementById("productCount");

  let filtered = products.filter(p => {
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (sortBy === "termurah") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "termahal") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "nama") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  countEl.textContent = `${filtered.length} produk`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>Produk tidak ditemukan.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isWishlisted = wishlist.some(w => w.id === p.id);
    return `
      <div class="product-card" onclick="openModal(${p.id})">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" />
          <span class="product-badge">${p.category}</span>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${p.id})">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="product-info">
          <p class="product-category">${p.category}</p>
          <h3 class="product-name">${p.name}</h3>
          ${getStars(p.id)}
          <p class="product-price">${formatRupiah(p.price)}</p>
          <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id})">
            <i class="fas fa-shopping-bag"></i> Tambah ke Keranjang
          </button>
          <button class="buy-now" onclick="event.stopPropagation(); buyNow(${p.id})">
            <i class="fas fa-bolt"></i> Beli Sekarang
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Tambah item ke cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
    showToast(`✅ ${product.name} +1`);
  } else {
    cart.push({ ...product, qty: 1 });
    showToast(`✅ ${product.name} ditambahkan!`);
  }
  saveCart();
  renderCart();
}

// Beli sekarang
function buyNow(id) {
  const product = products.find(p => p.id === id);
  localStorage.setItem("stepup-buynow", JSON.stringify([{ ...product, qty: 1 }]));
  showToast(`🎉 Langsung checkout: ${product.name}`);
  setTimeout(() => {
    window.location.href = "checkout.html?mode=buynow";
  }, 1000);
}

// Buka modal
function openModal(id) {
  const product = products.find(p => p.id === id);
  document.getElementById("modalImg").src = product.image;
  document.getElementById("modalImg").alt = product.name;
  document.getElementById("modalCategory").textContent = product.category;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalPrice").textContent = formatRupiah(product.price);
  document.getElementById("modalAddCart").onclick = () => {
    addToCart(product.id);
    closeModal();
  };
  document.getElementById("modalBuyNow").onclick = () => {
    buyNow(product.id);
    closeModal();
  };
  document.getElementById("productModal").classList.add("open");
  document.getElementById("modalOverlay").classList.add("active");
}

// Tutup modal
function closeModal() {
  document.getElementById("productModal").classList.remove("open");
  document.getElementById("modalOverlay").classList.remove("active");
}

// Hapus item dari cart
function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast(`🗑️ ${item.name} dihapus`);
}

// Tambah qty
function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  item.qty += 1;
  saveCart();
  renderCart();
}

// Kurangi qty
function decreaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item.qty === 1) {
    removeFromCart(id);
  } else {
    item.qty -= 1;
    saveCart();
    renderCart();
  }
}

// Render cart sidebar
function renderCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = totalQty;
  cartTotal.textContent = formatRupiah(totalPrice);
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><p>Keranjang masih kosong</p></div>`;
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatRupiah(item.price)}</p>
        <div class="qty-control">
          <button onclick="decreaseQty(${item.id})">−</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${item.id})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join("");
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

// Modal
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", closeModal);

// Sort
document.getElementById("sortSelect").addEventListener("change", e => {
  sortBy = e.target.value;
  renderProducts();
});

// Search
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderProducts();
});

// Buka cart
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("active");
}

document.getElementById("cartBtn").addEventListener("click", openCart);

// Tutup cart
function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("active");
}

document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("❌ Keranjang masih kosong!");
    return;
  }
  window.location.href = "checkout.html";
});

renderProducts();
renderCart();