/* ==========================================================================
   CHECKOUT PAGE CLIENT JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

let checkoutCartItems = [];
const SHIPPING_FEE = 2500;

function getCartFromStorage() {
    try { return JSON.parse(localStorage.getItem('rukus_cart') || '[]'); } catch { return []; }
}

async function initCheckout() {
    const itemsList = document.getElementById('checkout-items-list');

    checkoutCartItems = getCartFromStorage();

    if (checkoutCartItems.length === 0) {
        if (itemsList) {
            itemsList.innerHTML = `
                <p style="color:var(--color-white-50);font-size:13px;padding:20px 0;">
                    Your cart is empty. <a href="collections.html" style="color:var(--color-red);text-decoration:underline;">Browse Shop</a>
                </p>`;
        }
        const placeBtn = document.getElementById('place-order-btn');
        if (placeBtn) placeBtn.disabled = true;
        renderCheckoutSummary();
        return;
    }

    renderCheckoutSummary();
    initCheckoutForm();
    initPaymentSelection();
}

function renderCheckoutSummary() {
    const itemsList  = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl    = document.getElementById('summary-total');

    if (!itemsList) return;

    let subtotal = 0;

    if (checkoutCartItems.length === 0) {
        if (subtotalEl) subtotalEl.textContent = '₦0';
        if (totalEl)    totalEl.textContent    = `₦${SHIPPING_FEE.toLocaleString()}`;
        return;
    }

    itemsList.innerHTML = checkoutCartItems.map(item => {
        const itemPrice = parseFloat(item.price);
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="checkout-item">
                <img src="${item.img || ''}" alt="${item.name}" class="checkout-item-img"
                     onerror="this.style.opacity='0.2'">
                <div class="checkout-item-details">
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-meta">Size: ${item.size} &nbsp;·&nbsp; Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">₦${itemTotal.toLocaleString()}</div>
            </div>
        `;
    }).join('');

    const grandTotal = subtotal + SHIPPING_FEE;

    if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = `₦${SHIPPING_FEE.toLocaleString()}`;
    if (totalEl)    totalEl.textContent    = `₦${grandTotal.toLocaleString()}`;
}

function initPaymentSelection() {
    const cards = document.querySelectorAll('.payment-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}

function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const latestCart = getCartFromStorage();
        if (!latestCart.length) {
            alert('Your cart is empty.');
            return;
        }

        const submitBtn = document.getElementById('place-order-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCESSING...';
        }

        const formData = new FormData(form);
        const customer = {
            email:       formData.get('email'),
            first_name:  formData.get('first_name'),
            last_name:   formData.get('last_name'),
            address:     formData.get('address'),
            city:        formData.get('city'),
            postal_code: formData.get('postal_code') || '',
            country:     formData.get('country') || 'Nigeria',
            phone:       formData.get('phone')
        };

        const subtotal    = latestCart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
        const grandTotal  = subtotal + SHIPPING_FEE;
        const paymentMethod = formData.get('payment_method') || 'card';

        // Map localStorage cart format → API format
        const apiItems = latestCart.map(i => ({
            product_id: i.id,
            name:       i.name,
            price:      i.price,
            size:       i.size,
            quantity:   i.quantity,
            image_url:  i.img
        }));

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer,
                    cart_items:     apiItems,
                    total_amount:   grandTotal,
                    payment_method: paymentMethod
                })
            });

            const data = await res.json();

            if (data.success && data.order) {
                // Clear local cart
                localStorage.removeItem('rukus_cart');

                // Update badge
                document.querySelectorAll('#cart-count, #sec-cart-count').forEach(el => {
                    if (el) el.textContent = '0';
                });

                // Show success modal
                const confirmedRef = document.getElementById('confirmed-order-id');
                const modal        = document.getElementById('order-success-modal');
                if (confirmedRef) confirmedRef.textContent = `#${data.order.order_number}`;
                if (modal) {
                    modal.style.display    = 'flex';
                    modal.style.alignItems = 'center';
                    modal.style.justifyContent = 'center';
                }
            } else {
                alert(data.error || 'Failed to place order. Please try again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>PLACE ORDER</span><i class="fa-solid fa-arrow-right"></i>';
                }
            }
        } catch (err) {
            console.error('[checkout] Order error:', err);
            alert('An unexpected error occurred. Please try again.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>PLACE ORDER</span><i class="fa-solid fa-arrow-right"></i>';
            }
        }
    });
}
