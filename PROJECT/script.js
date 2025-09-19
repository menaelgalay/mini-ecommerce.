const products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Sample Product 1", price: 19.99, image: "https://via.placeholder.com/200x150?text=Product+1" },
  { id: 2, name: "Sample Product 2", price: 29.99, image: "https://via.placeholder.com/200x150?text=Product+2" }
];

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
  const container = document.getElementById("productsContainer");
  if (!container) return;
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = `<p class="text-muted">No products available.</p>`;
    return;
  }
  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price.toFixed(2)}</p>
          <button class="btn btn-danger mt-auto remove-btn" data-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(e.target.getAttribute("data-id"));
      confirmRemoveProduct(id);
    });
  });
}

function confirmRemoveProduct(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This product will be removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it!"
  }).then(result => {
    if (result.isConfirmed) {
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        products.splice(idx, 1);
        saveProducts();
        renderProducts();
        Swal.fire("Removed!", "Product has been removed.", "success");
      }
    }
  });
}

function handleAddProduct() {
  const form = document.getElementById("addProductForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("productName").value.trim();
    const priceVal = document.getElementById("productPrice").value;
    const price = parseFloat(priceVal);
    const image = document.getElementById("productImage").value.trim();
    if (!name || !priceVal || isNaN(price) || !image) {
      Swal.fire("Error", "Please fill all fields correctly.", "error");
      return;
    }
    const newProduct = { id: Date.now(), name, price, image };
    products.push(newProduct);
    saveProducts();
    renderProducts();
    Swal.fire("Success", "Product added successfully.", "success");
    form.reset();
    showPage("products");
    const navLink = document.querySelector('#mainNavbar .nav-link[data-page="products"]');
    if (navLink) {
      document.querySelectorAll('#mainNavbar .nav-link').forEach(l => l.classList.remove("active"));
      navLink.classList.add("active");
    }
  });
}

function handleLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (email === "" || password === "") {
      Swal.fire("خطأ", "من فضلك املأ الحقول قبل الدخول.", "error");
      return;
    }
    localStorage.setItem("loggedIn", "true");
    const navbar = document.getElementById("mainNavbar");
    if (navbar) navbar.classList.remove("d-none");
    const loginSection = document.getElementById("loginSection");
    if (loginSection) loginSection.classList.add("d-none");
    showPage("home");
    const homeLink = document.querySelector('#mainNavbar .nav-link[data-page="home"]');
    if (homeLink) {
      document.querySelectorAll('#mainNavbar .nav-link').forEach(l => l.classList.remove("active"));
      homeLink.classList.add("active");
    }
  });
}

function handleLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    location.reload();
  });
}

function showPage(page) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("d-none"));
  if (page === "home") {
    const s = document.getElementById("homeSection");
    if (s) s.classList.remove("d-none");
  } else if (page === "products") {
    const s = document.getElementById("productsSection");
    if (s) s.classList.remove("d-none");
    renderProducts();
  } else if (page === "add") {
    const s = document.getElementById("addSection");
    if (s) s.classList.remove("d-none");
  } else if (page === "about") {
    const s = document.getElementById("aboutSection");
    if (s) s.classList.remove("d-none");
  }
}

function handleNavbar() {
  const links = document.querySelectorAll('#mainNavbar .nav-link[data-page]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      document.querySelectorAll('#mainNavbar .nav-link').forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      showPage(page);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("loggedIn") === "true") {
    const navbar = document.getElementById("mainNavbar");
    if (navbar) navbar.classList.remove("d-none");
    const loginSection = document.getElementById("loginSection");
    if (loginSection) loginSection.classList.add("d-none");
    showPage("home");
  }
  handleLogin();
  handleLogout();
  handleAddProduct();
  handleNavbar();
  if (typeof Swiper === "function") {
    new Swiper(".mySwiper", {
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      loop: true
    });
  }
});


