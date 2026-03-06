<!-- Google tag (gtag.js) -->
async src="https://www.googletagmanager.com/gtag/js?id=G-JD7J69DKEW"
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-JD7J69DKEW');

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add to cart function
function addToCart(productName, price, image) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--blush-pink);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);

    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add event listeners to all "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('$', '').split(' ')[0]);
            const image = productCard.querySelector('img').src;
            
            addToCart(productName, price, image);
        });
    });
});

// Cart icon click - show cart modal
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showCartModal();
    });
}

// Show cart modal
function showCartModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;

    
    let cartHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="font-family: 'Playfair Display', serif; color: var(--chocolate); margin: 0;">Your Cart</h2>
            <button class="close-modal" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-light);">&times;</button>
        </div>
    `;
    
    if (cart.length === 0) {
        cartHTML += `
            <div style="text-align: center; padding: 3rem 0; color: var(--text-light);">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p style="font-size: 1.2rem;">Your cart is empty</p>
                <a href="menu.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Browse Menu</a>
            </div>
        `;
    } else {
        cartHTML += '<div style="margin-bottom: 1.5rem;">';
        
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--soft-pink); align-items: center;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--chocolate);">${item.name}</h4>
                        <p style="margin: 0; color: var(--text-light);">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button class="decrease-qty" data-index="${index}" style="width: 30px; height: 30px; border: none; background: var(--soft-pink); border-radius: 50%; cursor: pointer; color: var(--chocolate); font-weight: bold;">-</button>
                        <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                        <button class="increase-qty" data-index="${index}" style="width: 30px; height: 30px; border: none; background: var(--blush-pink); border-radius: 50%; cursor: pointer; color: white; font-weight: bold;">+</button>
                    </div>
                    <div style="min-width: 80px; text-align: right;">
                        <p style="margin: 0; font-weight: 600; color: var(--blush-pink);">$${itemTotal.toFixed(2)}</p>
                        <button class="remove-item" data-index="${index}" style="background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 0.9rem; text-decoration: underline;">Remove</button>
                    </div>
                </div>
            `;
        });
        
        cartHTML += '</div>';
        cartHTML += `
            <div style="border-top: 2px solid var(--chocolate); padding-top: 1rem; margin-top: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: var(--chocolate);">Total:</h3>
                    <h3 style="margin: 0; color: var(--blush-pink);">$${total.toFixed(2)}</h3>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-bottom: 0.5rem;">Proceed to Checkout</button>
                <button class="clear-cart" style="width: 100%; padding: 0.8rem; background: transparent; border: 2px solid var(--text-light); color: var(--text-light); border-radius: 50px; cursor: pointer; font-weight: 600;">Clear Cart</button>
            </div>
        `;
    }
    
    modalContent.innerHTML = cartHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    
    // Close modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    const closeBtn = modalContent.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }
    
    // Increase quantity
    modalContent.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            modal.remove();
            showCartModal();
        });
    });
    
    // Decrease quantity
    modalContent.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            modal.remove();
            showCartModal();
        });
    });
    
    // Remove item
    modalContent.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            modal.remove();
            showCartModal();
        });
    });
    
    // Clear cart
    const clearBtn = modalContent.querySelector('.clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                modal.remove();
                showCartModal();
            }
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

