/* ==========================================================================
   RUKUS STREETWEAR — MAIN JS
   Handles: scroll reveal, ticker, nav, cart, modal, search, products, parallax
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollReveal();
    initNavScroll();
    initHamburger();
    initTicker();
    initFilterChips();
    initCart();
    initSearch();
    initParallax();
    fetchAndRenderProducts();
    initContactForm();
    initProductDetailPage();
});

/* ==========================================================================
   THEME TOGGLE (MONOCHROMATIC B&W DARK / LIGHT)
   ========================================================================== */
function initThemeToggle() {
    const savedTheme = localStorage.getItem('rukus-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    const updateIcons = () => {
        const isLight = document.body.classList.contains('light-mode');
        document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
            if (isLight) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    };

    updateIcons();

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('rukus-theme', isLight ? 'light' : 'dark');
            updateIcons();
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // fire once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   NAVBAR SCROLL BEHAVIOUR
   ========================================================================== */
function initNavScroll() {
    const navbar = document.getElementById('navbar');
    const secNavbar = document.getElementById('secondary-navbar');
    const hero = document.querySelector('.hero-fixed');

    if (!navbar) return;

    const onScroll = () => {
        const scrollY = window.scrollY;
        if (hero) {
            const heroHeight = window.innerHeight;
            const ratio = Math.min(scrollY / heroHeight, 1);
            
            // Simultaneous slide animations
            navbar.style.transform = `translateY(${-ratio * 100}%)`;
            if (secNavbar) {
                secNavbar.style.transform = `translateY(${-100 + (ratio * 100)}%)`;
            }
        } else {
            // Normal fallback page behavior
            navbar.classList.toggle('scrolled', scrollY > 60);
        }
    };
    
    // Set initial transitions
    if (hero) {
        navbar.style.transition = 'transform 0.1s linear';
        if (secNavbar) {
            secNavbar.style.transition = 'transform 0.1s linear';
        }
    }
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   MOBILE HAMBURGER
   ========================================================================== */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const secHamburger = document.getElementById('sec-hamburger');
    const mobileNav  = document.getElementById('mobile-nav');
    if (!mobileNav) return;

    const toggleMenu = () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger?.classList.toggle('open', isOpen);
        secHamburger?.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger?.addEventListener('click', toggleMenu);
    secHamburger?.addEventListener('click', toggleMenu);

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            secHamburger?.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ==========================================================================
   TICKER MARQUEE
   ========================================================================== */
function initTicker() {
    const track      = document.getElementById('ticker-track') || document.querySelector('.ticker-track');
    const primarySpan = document.querySelector('.ticker-span');
    if (!track || !primarySpan) return;

    let scrollX = 0;
    const speed = 0.65; // px per frame

    function animate() {
        scrollX -= speed;
        const spanW = primarySpan.offsetWidth;
        if (spanW > 0 && Math.abs(scrollX) >= spanW) scrollX = 0;
        track.style.transform = `translateX(${scrollX}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* ==========================================================================
   PARALLAX (banner image on scroll)
   ========================================================================== */
function initParallax() {
    const imgs = document.querySelectorAll('.parallax-img');
    if (!imgs.length) return;

    const onScroll = () => {
        imgs.forEach(img => {
            const rect   = img.closest('.banner-section')?.getBoundingClientRect();
            if (!rect) return;
            const ratio  = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const offset = (ratio - 0.5) * 60; // ±30 px travel
            img.style.transform = `translateY(${offset}px) scale(1.08)`;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   PRODUCT FETCHING & RENDERING
   ========================================================================== */
async function fetchAndRenderProducts(category = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Skeleton state
    grid.innerHTML = Array(8).fill(0).map(() => `
        <div class="product-card-skeleton">
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text skeleton-text--short"></div>
        </div>
    `).join('');

    try {
        const url = category === 'all'
            ? '/api/products'
            : `/api/products?category=${encodeURIComponent(category)}`;

        const res  = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data     = await res.json();
        const products = data.products || [];

        if (products.length === 0) {
            grid.innerHTML = `<p class="empty-msg">No products found in this category.</p>`;
            return;
        }

        grid.innerHTML = '';
        products.forEach(p => grid.appendChild(renderProductCard(p)));

        // Re-bind card interactions after fresh render
        initProductHover();
        initWishlistToggle();
        initProductModal();
        initQuickAdd();
        initScrollReveal(); // re-observe newly injected elements

    } catch (err) {
        console.warn('[fetchAndRenderProducts] API unavailable:', err.message);
        grid.innerHTML = `
            <p style="color:rgba(255,255,255,0.4);font-family:'Poppins',sans-serif;font-size:13px;
                       grid-column:1/-1;text-align:center;padding:60px 0;">
                Could not reach server. Run <code>npm start</code> to load products.
            </p>`;
    }
}

function renderProductCard(product) {
    const {
        id, name, price,
        category   = '',
        badge      = 'NEW',
        description= '',
        image_url  = '',
        sizes      = ['S','M','L','XL']
    } = product;

    const card = document.createElement('article');
    card.className        = 'product-card';
    card.dataset.id       = id;
    card.dataset.name     = name;
    card.dataset.price    = price;
    card.dataset.img      = image_url;
    card.dataset.desc     = description;
    card.dataset.category = category;

    const sizeBtns = sizes.map(s =>
        `<button class="quick-size-btn" data-size="${s}">${s}</button>`
    ).join('');

    card.innerHTML = `
        <div class="product-image-container">
            <span class="product-badge">${badge}</span>
            <button class="wishlist-btn" aria-label="Wishlist">
                <i class="fa-regular fa-heart"></i>
            </button>
            <img
                src="${image_url}"
                alt="${name}"
                class="product-image"
                loading="lazy"
                onerror="this.style.opacity='0.15'"
            >
            <div class="quick-add-overlay">
                <span class="quick-add-title">QUICK ADD</span>
                <div class="size-options">${sizeBtns}</div>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${name}</h3>
            <span class="product-price">₦${Number(price).toLocaleString()}</span>
        </div>
    `;
    return card;
}

/* ==========================================================================
   FILTER CHIPS
   ========================================================================== */
function initFilterChips() {
    const chips = document.querySelectorAll('.filter-chip');
    if (!chips.length) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const cat = chip.dataset.cat || chip.textContent.trim().toLowerCase();
            fetchAndRenderProducts(cat === 'all' ? 'all' : cat);
        });
    });
}

/* ==========================================================================
   PRODUCT CARD HOVER
   ========================================================================== */
function initProductHover() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('card-hovered'));
        card.addEventListener('mouseleave', () => card.classList.remove('card-hovered'));
    });
}

/* ==========================================================================
   WISHLIST TOGGLE
   ========================================================================== */
function initWishlistToggle() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.product-card');
            const name = card?.dataset.name || 'Item';

            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (icon) {
                if (btn.classList.contains('active')) {
                    icon.className = 'fa-solid fa-heart';
                    showToast('SAVED TO WISHLIST', `${name} added to your wishlist.`, 'fa-solid fa-heart');
                } else {
                    icon.className = 'fa-regular fa-heart';
                    showToast('REMOVED', `${name} removed from wishlist.`, 'fa-regular fa-heart');
                }
            }
        });
    });
}

/* ==========================================================================
   QUICK ADD BUTTONS (on hover overlay)
   ========================================================================== */
function initQuickAdd() {
    document.querySelectorAll('.quick-size-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card');
            if (!card) return;
            addToCart(
                card.dataset.id,
                card.dataset.name,
                parseFloat(card.dataset.price),
                card.dataset.img,
                btn.dataset.size
            );
        });
    });
}

/* ==========================================================================
   PRODUCT MODAL
   ========================================================================== */
let activeModalProduct = null;
let activeModalSize    = null;

function initProductModal() {
    const modal     = document.getElementById('detail-modal');
    const closeBtn  = document.getElementById('modal-close');
    const addBtn    = document.getElementById('modal-add-btn');
    if (!modal) return;

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.wishlist-btn') || e.target.closest('.quick-add-overlay')) return;

            activeModalProduct = {
                id:    card.dataset.id,
                name:  card.dataset.name,
                price: parseFloat(card.dataset.price),
                img:   card.dataset.img,
                desc:  card.dataset.desc
            };
            openProductModal();
        });
    });

    closeBtn?.addEventListener('click', closeProductModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeProductModal(); });

    // Size selection
    modal.querySelectorAll('.modal-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            activeModalSize = btn.dataset.size;
        });
    });

    // Add to cart from modal
    addBtn?.addEventListener('click', () => {
        if (!activeModalProduct) return;
        if (!activeModalSize) {
            showToast('SELECT SIZE', 'Please choose a size first.', 'fa-solid fa-circle-exclamation');
            const sel = document.querySelector('.modal-size-selector');
            if (sel) {
                sel.style.animation = 'shake 0.4s ease';
                setTimeout(() => sel.style.animation = '', 400);
            }
            return;
        }
        addToCart(activeModalProduct.id, activeModalProduct.name, activeModalProduct.price, activeModalProduct.img, activeModalSize);
        closeProductModal();
    });
}

function openProductModal() {
    if (!activeModalProduct) return;
    activeModalSize = null;
    document.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));

    document.getElementById('modal-product-img').src        = activeModalProduct.img;
    document.getElementById('modal-product-img').alt        = activeModalProduct.name;
    document.getElementById('modal-product-name').textContent  = activeModalProduct.name;
    document.getElementById('modal-product-price').textContent = `₦${Number(activeModalProduct.price).toLocaleString()}`;
    document.getElementById('modal-product-desc').textContent  = activeModalProduct.desc;

    document.getElementById('detail-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('detail-modal')?.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==========================================================================
   CART STATE & DRAWER
   ========================================================================== */
let cartState = (() => {
    try { return JSON.parse(localStorage.getItem('rukus_cart') || '[]'); } catch { return []; }
})();

function initCart() {
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('sec-cart-btn')?.addEventListener('click', openCart);
    document.getElementById('cart-drawer-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-drawer-overlay')?.addEventListener('click', closeCart);

    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (!cartState.length) return;
        closeCart();
        window.location.href = 'checkout.html';
    });

    updateCartUI(); // reflect localStorage on page load
}

function openCart() {
    document.getElementById('cart-drawer')?.classList.add('active');
    document.getElementById('cart-drawer-overlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-drawer')?.classList.remove('active');
    document.getElementById('cart-drawer-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(id, name, price, img, size) {
    const idx = cartState.findIndex(i => i.id === id && i.size === size);
    if (idx > -1) {
        cartState[idx].quantity++;
    } else {
        cartState.push({ id, name, price, img, size, quantity: 1 });
    }
    updateCartUI();
    showToast('ADDED TO BAG', `${name} (${size}) added.`, 'fa-solid fa-bag-shopping');
    openCart();
}

function updateCartUI() {
    localStorage.setItem('rukus_cart', JSON.stringify(cartState));

    const totalItems = cartState.reduce((a, i) => a + i.quantity, 0);
    const subtotal   = cartState.reduce((a, i) => a + i.price * i.quantity, 0);

    // Badge counts
    document.querySelectorAll('#cart-count, #sec-cart-count, #cart-drawer-count').forEach(el => {
        if (el) el.textContent = totalItems;
    });

    const itemsWrap = document.getElementById('cart-drawer-items');
    const footer    = document.getElementById('cart-drawer-footer');
    const totalEl   = document.getElementById('cart-total');
    if (!itemsWrap) return;

    if (!cartState.length) {
        itemsWrap.innerHTML = `
            <div class="cart-empty-message">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Your bag is empty.</p>
                <a href="collections.html" class="continue-shopping-btn">SHOP NEW DROPS</a>
            </div>`;
        if (footer) footer.style.display = 'none';
        return;
    }

    if (footer) footer.style.display = 'block';
    if (totalEl) totalEl.textContent = `₦${subtotal.toLocaleString()}`;

    itemsWrap.innerHTML = '';
    cartState.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-img-container">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-meta">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-size">SIZE: ${item.size}</span>
                    <span class="cart-item-price">₦${Number(item.price).toLocaleString()}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-qty-selector">
                        <button class="cart-qty-btn qty-minus" data-idx="${idx}"><i class="fa-solid fa-minus"></i></button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button class="cart-qty-btn qty-plus" data-idx="${idx}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="cart-item-remove" data-idx="${idx}">REMOVE</button>
                </div>
            </div>`;
        itemsWrap.appendChild(el);
    });

    itemsWrap.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = +btn.dataset.idx;
            if (cartState[i].quantity > 1) cartState[i].quantity--;
            else cartState.splice(i, 1);
            updateCartUI();
        });
    });
    itemsWrap.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            cartState[+btn.dataset.idx].quantity++;
            updateCartUI();
        });
    });
    itemsWrap.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const removed = cartState.splice(+btn.dataset.idx, 1)[0];
            updateCartUI();
            showToast('REMOVED', `${removed.name} removed from bag.`, 'fa-solid fa-trash');
        });
    });
}

/* ==========================================================================
   SEARCH OVERLAY
   ========================================================================== */
function initSearch() {
    const overlay = document.getElementById('search-overlay');
    const input   = document.getElementById('search-input');

    const openSearch = () => {
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => input?.focus(), 80);
    };

    document.getElementById('search-btn')?.addEventListener('click', openSearch);
    document.getElementById('sec-search-btn')?.addEventListener('click', openSearch);

    document.getElementById('search-close')?.addEventListener('click', closeSearch);

    // Keyboard Esc
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeSearch();
            closeProductModal();
            closeCart();
        }
    });

    document.getElementById('search-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const query = input?.value.trim().toLowerCase();
        if (!query) return;

        const cards = document.querySelectorAll('.product-card');
        let count = 0;
        cards.forEach(card => {
            const match = card.dataset.name?.toLowerCase().includes(query) ||
                          card.dataset.desc?.toLowerCase().includes(query);
            card.style.display = match ? '' : 'none';
            if (match) count++;
        });

        closeSearch();
        document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' });
        showToast('RESULTS', `${count} item${count !== 1 ? 's' : ''} found for "${query}"`, 'fa-solid fa-magnifying-glass');
    });

    document.querySelectorAll('.search-suggest-link').forEach(link => {
        link.addEventListener('click', closeSearch);
    });
}

function closeSearch() {
    document.getElementById('search-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
}

/* ==========================================================================
   TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(title, message, iconClass = 'fa-solid fa-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <div class="toast-content">
            <h5 class="toast-title">${title}</h5>
            <p class="toast-msg">${message}</p>
        </div>`;

    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const btn = form.querySelector('button[type="submit"]');

        if (!nameInput || !emailInput || !messageInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = 'SENDING... <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                showToast('SUCCESS', data.message || 'Message sent successfully!', 'fa-solid fa-circle-check');
                form.reset();
            } else {
                showToast('ERROR', data.error || 'Something went wrong.', 'fa-solid fa-circle-exclamation');
            }
        } catch (err) {
            console.error('[Contact Form Error]', err);
            showToast('ERROR', 'Could not reach server. Please try again.', 'fa-solid fa-circle-exclamation');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'SEND MESSAGE <i class="fa-solid fa-paper-plane"></i>';
            }
        }
    });
}

/* ==========================================================================
   PRODUCT DETAIL PAGE
   ========================================================================== */
async function initProductDetailPage() {
    const layout = document.getElementById('product-detail-layout');
    if (!layout) return;

    // Parse product ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        layout.innerHTML = `<p style="grid-column:1/-1;color:var(--color-white-40);text-align:center;padding:80px 0;font-family:var(--font-body);">No product specified.</p>`;
        return;
    }

    try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const p = data.product;

        // Update page title
        document.title = `${p.name} — RUKUS Streetwear`;

        // Render the detail layout
        const sizes = p.sizes || ['S', 'M', 'L', 'XL'];
        const sizeBtns = sizes.map(s =>
            `<button class="detail-size-btn" data-size="${s}">${s}</button>`
        ).join('');

        layout.innerHTML = `
            <div class="detail-gallery-wrap">
                <div class="detail-img-container">
                    <img src="${p.image_url}" alt="${p.name}" onerror="this.src=''; this.style.opacity='0.15'">
                </div>
            </div>
            <div class="detail-info reveal-up">
                <span class="detail-badge">${p.badge || 'NEW'}</span>
                <h1 class="detail-title">${p.name}</h1>
                <span class="detail-price">₦${Number(p.price).toLocaleString()}</span>
                <p class="detail-desc">${p.description || 'No description available.'}</p>

                <div class="detail-options">
                    <span class="detail-options-title">Select Size</span>
                    <div class="detail-sizes-row" id="detail-sizes">
                        ${sizeBtns}
                    </div>
                </div>

                <button class="detail-add-btn" id="detail-add-btn">
                    ADD TO BAG <i class="fa-solid fa-bag-shopping"></i>
                </button>

                <div class="detail-features">
                    <div class="detail-feature-item">
                        <i class="fa-solid fa-truck-fast"></i>
                        <span>Free Express Shipping on orders over ₦50k</span>
                    </div>
                    <div class="detail-feature-item">
                        <i class="fa-solid fa-rotate-left"></i>
                        <span>30-Day Hassle-Free Returns</span>
                    </div>
                    <div class="detail-feature-item">
                        <i class="fa-solid fa-shield-halved"></i>
                        <span>Secure 100% Encrypted Checkout</span>
                    </div>
                    <div class="detail-feature-item">
                        <i class="fa-solid fa-fire-flame-curved"></i>
                        <span>Limited Drop — No Restocks, Ever</span>
                    </div>
                </div>
            </div>
        `;

        // Wire up size selection
        let selectedSize = null;
        layout.querySelectorAll('.detail-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                layout.querySelectorAll('.detail-size-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedSize = btn.dataset.size;
            });
        });

        // Wire up Add to Bag
        layout.querySelector('#detail-add-btn')?.addEventListener('click', () => {
            if (!selectedSize) {
                showToast('SELECT SIZE', 'Please choose a size first.', 'fa-solid fa-circle-exclamation');
                const row = layout.querySelector('#detail-sizes');
                if (row) {
                    row.style.animation = 'shake 0.4s ease';
                    setTimeout(() => row.style.animation = '', 400);
                }
                return;
            }
            addToCart(p.id, p.name, parseFloat(p.price), p.image_url, selectedSize);
        });

        // Trigger reveal animations
        initScrollReveal();

        // Load related products (same category, excluding current)
        fetchAndRenderProducts(p.category);

    } catch (err) {
        console.error('[initProductDetailPage]', err.message);
        layout.innerHTML = `<p style="grid-column:1/-1;color:var(--color-white-40);text-align:center;padding:80px 0;font-family:var(--font-body);">Could not load product. <a href="collections.html" style="color:var(--color-red)">Back to Shop</a></p>`;
    }
}
