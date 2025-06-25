// Global Variables
let currentUser = <?= $currentUser ? json_encode($currentUser) : 'null' ?>;
let wishlist = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const toggleRegisterConfirmPassword = document.getElementById('toggleRegisterConfirmPassword');
const loginPassword = document.getElementById('loginPassword');
const registerPassword = document.getElementById('registerPassword');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');
const mainContent = document.getElementById('mainContent');
const adminDashboard = document.getElementById('adminDashboard');
const sellerDashboard = document.getElementById('sellerDashboard');
const buyerDashboard = document.getElementById('buyerDashboard');
const adminLogout = document.getElementById('adminLogout');
const sellerLogout = document.getElementById('sellerLogout');
const buyerLogout = document.getElementById('buyerLogout');
const accountPreviewModal = document.getElementById('accountPreviewModal');
const closeAccountPreviewModal = document.getElementById('closeAccountPreviewModal');
const accountDetailModal = document.getElementById('accountDetailModal');
const closeAccountDetailModal = document.getElementById('closeAccountDetailModal');
const addToWishlistBtn = document.getElementById('addToWishlistBtn');
const buyNowBtn = document.getElementById('buyNowBtn');
const wishlistGrid = document.getElementById('wishlistGrid');
const wishlistCount = document.getElementById('wishlistCount');
const clearWishlistBtn = document.getElementById('clearWishlistBtn');
const marketplaceGrid = document.getElementById('marketplaceGrid');
const accountImagesInput = document.getElementById('accountImages');
const imagePreview = document.getElementById('imagePreview');
const previewAccountBtn = document.getElementById('previewAccountBtn');
const submitAccountBtn = document.getElementById('submitAccountBtn');
const addAccountForm = document.getElementById('addAccountForm');
const sellerAccountsTableBody = document.getElementById('sellerAccountsTableBody');
const accountsTableBody = document.getElementById('accountsTableBody');
const usersTableBody = document.getElementById('usersTableBody');
const transactionsTableBody = document.getElementById('transactionsTableBody');
const sellerSalesTableBody = document.getElementById('sellerSalesTableBody');
const purchasesTableBody = document.getElementById('purchasesTableBody');
const topSellersTableBody = document.getElementById('topSellersTableBody');
const addAdminForm = document.getElementById('addAdminForm');
const addAdminBtn = document.getElementById('addAdminBtn');
const mobileWarning = document.getElementById('mobileWarning');
const continueMobileBtn = document.getElementById('continueMobileBtn');

// Event Listeners
if (loginBtn) loginBtn.addEventListener('click', () => loginModal.classList.add('show'));
if (registerBtn) registerBtn.addEventListener('click', () => registerModal.classList.add('show'));
if (closeLoginModal) closeLoginModal.addEventListener('click', () => loginModal.classList.remove('show'));
if (closeRegisterModal) closeRegisterModal.addEventListener('click', () => registerModal.classList.remove('show'));
if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('show');
    registerModal.classList.add('show');
});
if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('show');
    loginModal.classList.add('show');
});
if (toggleLoginPassword) toggleLoginPassword.addEventListener('click', () => togglePasswordVisibility(loginPassword));
if (toggleRegisterPassword) toggleRegisterPassword.addEventListener('click', () => togglePasswordVisibility(registerPassword));
if (toggleRegisterConfirmPassword) toggleRegisterConfirmPassword.addEventListener('click', () => togglePasswordVisibility(registerConfirmPassword));
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);
if (adminLogout) adminLogout.addEventListener('click', handleLogout);
if (sellerLogout) sellerLogout.addEventListener('click', handleLogout);
if (buyerLogout) buyerLogout.addEventListener('click', handleLogout);
if (closeAccountPreviewModal) closeAccountPreviewModal.addEventListener('click', () => accountPreviewModal.classList.remove('show'));
if (closeAccountDetailModal) closeAccountDetailModal.addEventListener('click', () => accountDetailModal.classList.remove('show'));
if (addToWishlistBtn) addToWishlistBtn.addEventListener('click', toggleWishlist);
if (buyNowBtn) buyNowBtn.addEventListener('click', handleBuyNow);
if (clearWishlistBtn) clearWishlistBtn.addEventListener('click', clearWishlist);
if (accountImagesInput) accountImagesInput.addEventListener('change', handleImageUpload);
if (previewAccountBtn) previewAccountBtn.addEventListener('click', previewAccount);
if (submitAccountBtn) submitAccountBtn.addEventListener('click', submitAccount);
if (addAccountForm) addAccountForm.addEventListener('submit', handleAddAccount);
if (addAdminForm) addAdminForm.addEventListener('submit', handleAddAdmin);
if (addAdminBtn) addAdminBtn.addEventListener('click', () => {
    document.querySelectorAll('.dashboard-section').forEach(section => section.classList.add('hidden'));
    document.getElementById('adminSettings').classList.remove('hidden');
});
if (continueMobileBtn) continueMobileBtn.addEventListener('click', () => {
    mobileWarning.style.display = 'none';
    localStorage.setItem('mobileWarningDismissed', 'true');
});

// Sidebar navigation
document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.remove('hidden');
        
        // Update active link
        document.querySelectorAll('.sidebar-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Toggle sidebar
const sidebarToggle = document.querySelector('.sidebar-toggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('sidebar-collapsed');
        document.querySelector('.dashboard-content').classList.toggle('dashboard-content-expanded');
    });
}

// Initialize the app
function init() {
    // Check if user is already logged in
    if (currentUser) {
        showDashboard(currentUser.role);
    } else {
        showLandingPage();
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('gemoraWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistCount();
    }

    // Initialize data tables
    if (currentUser) {
        if (currentUser.role === 'admin') {
            renderAccountsTable();
            renderUsersTable();
            renderTransactionsTable();
            renderTopSellers();
            updateAdminStats();
        } else if (currentUser.role === 'seller') {
            renderSellerAccountsTable();
            renderSellerSalesTable();
            updateSellerStats();
        } else if (currentUser.role === 'buyer') {
            renderMarketplace();
            renderWishlist();
            renderPurchasesTable();
        }
    }

    // Check if user is on mobile
    if (isMobileDevice() && !localStorage.getItem('mobileWarningDismissed')) {
        mobileWarning.style.display = 'flex';
    }
}

// Show landing page
function showLandingPage() {
    if (mainContent) mainContent.classList.remove('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
    if (sellerDashboard) sellerDashboard.classList.add('hidden');
    if (buyerDashboard) buyerDashboard.classList.add('hidden');
}

// Show appropriate dashboard based on role
function showDashboard(role) {
    if (mainContent) mainContent.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
    if (sellerDashboard) sellerDashboard.classList.add('hidden');
    if (buyerDashboard) buyerDashboard.classList.add('hidden');

    if (role === 'admin') {
        if (adminDashboard) adminDashboard.classList.remove('hidden');
    } else if (role === 'seller') {
        if (sellerDashboard) sellerDashboard.classList.remove('hidden');
    } else if (role === 'buyer') {
        if (buyerDashboard) buyerDashboard.classList.remove('hidden');
    }
}

// Toggle password visibility
function togglePasswordVisibility(input) {
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    // Validate inputs
    if (!email || !password || !role) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    try {
        const response = await fetch('api.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            showDashboard(data.user.role);
            loginModal.classList.remove('show');
            showAlert('Login successful', 'success');
            
            // Reset form
            loginForm.reset();
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred during login', 'danger');
        console.error('Login error:', error);
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const role = document.querySelector('input[name="registerRole"]:checked').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate inputs
    if (!username || !email || !password || !confirmPassword || !role) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('You must agree to the terms and conditions', 'danger');
        return;
    }
    
    try {
        const response = await fetch('api.php?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            showDashboard(data.user.role);
            registerModal.classList.remove('show');
            showAlert('Registration successful', 'success');
            
            // Reset form
            registerForm.reset();
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred during registration', 'danger');
        console.error('Registration error:', error);
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch('api.php?action=logout');
        const data = await response.json();
        
        if (data.success) {
            currentUser = null;
            showLandingPage();
            showAlert('Logged out successfully', 'success');
        } else {
            showAlert('Logout failed', 'danger');
        }
    } catch (error) {
        showAlert('An error occurred during logout', 'danger');
        console.error('Logout error:', error);
    }
}

// Show alert message
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg bg-${type} text-white`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}

// Toggle wishlist
function toggleWishlist() {
    const accountId = parseInt(addToWishlistBtn.dataset.accountId);
    const index = wishlist.indexOf(accountId);
    
    if (index === -1) {
        wishlist.push(accountId);
        addToWishlistBtn.innerHTML = '<span>❤️</span> <span class="hidden md:inline">In Wishlist</span>';
        showAlert('Added to wishlist', 'success');
    } else {
        wishlist.splice(index, 1);
        addToWishlistBtn.innerHTML = '<span>❤️</span> <span class="hidden md:inline">Wishlist</span>';
        showAlert('Removed from wishlist', 'warning');
    }
    
    localStorage.setItem('gemoraWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlist();
}

// Clear wishlist
function clearWishlist() {
    wishlist = [];
    localStorage.setItem('gemoraWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlist();
    showAlert('Wishlist cleared', 'success');
}

// Update wishlist count
function updateWishlistCount() {
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

// Handle buy now
async function handleBuyNow() {
    const accountId = parseInt(buyNowBtn.dataset.accountId);
    
    try {
        const response = await fetch('api.php?action=buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Purchase initiated. Please contact the seller to complete the transaction.', 'success');
            accountDetailModal.classList.remove('show');
            
            // Update UI
            if (currentUser.role === 'buyer') {
                renderPurchasesTable();
                renderMarketplace();
            } else if (currentUser.role === 'seller') {
                renderSellerAccountsTable();
                renderSellerSalesTable();
            } else if (currentUser.role === 'admin') {
                renderAccountsTable();
                renderTransactionsTable();
            }
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred during purchase', 'danger');
        console.error('Purchase error:', error);
    }
}

// Handle image upload
function handleImageUpload() {
    const files = accountImagesInput.files;
    imagePreview.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Account Preview';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'image-preview-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                imgContainer.remove();
            });
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(removeBtn);
            imagePreview.appendChild(imgContainer);
        };
        
        reader.readAsDataURL(file);
    }
}

// Preview account before submission
function previewAccount() {
    const game = document.getElementById('accountGame').value;
    const rank = document.getElementById('accountRank').value;
    const nickname = document.getElementById('accountNickname').value;
    const price = document.getElementById('accountPrice').value;
    const skins = document.getElementById('accountSkins').value;
    const description = document.getElementById('accountDescription').value;
    
    if (!game || !rank || !nickname || !price || !description || imagePreview.children.length === 0) {
        showAlert('Please fill in all required fields and upload at least one image', 'danger');
        return;
    }
    
    // Update preview modal
    document.getElementById('previewAccountTitle').textContent = `${game} Account`;
    document.getElementById('previewAccountGame').textContent = game;
    document.getElementById('previewAccountRank').textContent = rank;
    document.getElementById('previewAccountNickname').textContent = nickname;
    document.getElementById('previewAccountSkins').textContent = skins || 'Not specified';
    document.getElementById('previewAccountDescription').textContent = description;
    document.getElementById('previewAccountPrice').textContent = `$${price}`;
    document.getElementById('previewAccountImage').src = imagePreview.children[0].querySelector('img').src;
    
    accountPreviewModal.classList.add('show');
}

// Submit account for approval
async function submitAccount() {
    const game = document.getElementById('accountGame').value;
    const rank = document.getElementById('accountRank').value;
    const nickname = document.getElementById('accountNickname').value;
    const price = parseFloat(document.getElementById('accountPrice').value);
    const skins = document.getElementById('accountSkins').value;
    const description = document.getElementById('accountDescription').value;
    
    // Get images (in a real app, we would upload them to the server)
    const images = [];
    for (let i = 0; i < imagePreview.children.length; i++) {
        images.push(imagePreview.children[i].querySelector('img').src);
    }
    
    try {
        const response = await fetch('api.php?action=add_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                game, 
                rank, 
                nickname, 
                price, 
                skins, 
                description, 
                images 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Account submitted for approval', 'success');
            accountPreviewModal.classList.remove('show');
            
            // Reset form
            addAccountForm.reset();
            imagePreview.innerHTML = '';
            
            // Update UI
            renderSellerAccountsTable();
            if (currentUser.role === 'admin') {
                renderAccountsTable();
            }
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while submitting the account', 'danger');
        console.error('Submit account error:', error);
    }
}

// Handle add account form submission
function handleAddAccount(e) {
    e.preventDefault();
    previewAccount();
}

// Handle add admin form submission
async function handleAddAdmin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;
    const level = document.getElementById('adminLevel').value;
    
    // Validate inputs
    if (!username || !email || !password || !confirmPassword || !level) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    try {
        const response = await fetch('api.php?action=add_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, level })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Admin account created successfully', 'success');
            addAdminForm.reset();
            renderUsersTable();
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while creating admin account', 'danger');
        console.error('Add admin error:', error);
    }
}

// Render accounts table for admin
async function renderAccountsTable(filter = 'all', search = '') {
    try {
        const response = await fetch(`api.php?action=get_accounts&filter=${filter}&search=${search}`);
        const accounts = await response.json();
        
        accountsTableBody.innerHTML = '';
        accounts.forEach(account => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${account.id}</td>
                <td>${account.game}</td>
                <td>${account.seller_username}</td>
                <td>${account.rank}</td>
                <td>$${account.price}</td>
                <td><span class="status-badge status-${account.status}">${account.status.charAt(0).toUpperCase() + account.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-success" data-action="approve" data-id="${account.id}">Approve</button>
                    <button class="btn btn-sm btn-danger" data-action="reject" data-id="${account.id}">Reject</button>
                    <button class="btn btn-sm btn-warning" data-action="revision" data-id="${account.id}">Revision</button>
                </td>
            `;
            
            accountsTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const accountId = parseInt(e.target.getAttribute('data-id'));
                updateAccountStatus(accountId, action);
            });
        });
        
        // Update showing/total counts
        document.getElementById('showingAccounts').textContent = `1-${accounts.length}`;
        document.getElementById('totalAccounts').textContent = accounts.length;
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
}

// Render users table for admin
async function renderUsersTable(filter = 'all', search = '') {
    try {
        const response = await fetch(`api.php?action=get_users&filter=${filter}&search=${search}`);
        const users = await response.json();
        
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td>${user.created_at}</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" data-action="delete" data-id="${user.id}">Delete</button>
                    ${user.role !== 'admin' ? `<button class="btn btn-sm btn-warning" data-action="suspend" data-id="${user.id}">Suspend</button>` : ''}
                    ${user.role !== 'admin' ? `<button class="btn btn-sm btn-primary" data-action="promote" data-id="${user.id}">Make Admin</button>` : ''}
                </td>
            `;
            
            usersTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const userId = parseInt(e.target.getAttribute('data-id'));
                handleUserAction(userId, action);
            });
        });
        
        // Update showing/total counts
        document.getElementById('showingUsers').textContent = `1-${users.length}`;
        document.getElementById('totalUsers').textContent = users.length;
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Render transactions table for admin
async function renderTransactionsTable(dateFrom = '', dateTo = '', search = '') {
    try {
        const response = await fetch(`api.php?action=get_transactions&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${search}`);
        const transactions = await response.json();
        
        transactionsTableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.game} (${transaction.nickname})</td>
                <td>${transaction.seller_username}</td>
                <td>${transaction.buyer_username}</td>
                <td>$${transaction.price}</td>
                <td>${transaction.transaction_date}</td>
                <td><span class="status-badge status-${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span></td>
            `;
            
            transactionsTableBody.appendChild(row);
        });
        
        // Update showing/total counts
        document.getElementById('showingTransactions').textContent = `1-${transactions.length}`;
        document.getElementById('totalTransactions').textContent = transactions.length;
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Render top sellers table
async function renderTopSellers() {
    try {
        const response = await fetch('api.php?action=get_top_sellers');
        const topSellers = await response.json();
        
        topSellersTableBody.innerHTML = '';
        topSellers.forEach((seller, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${seller.username}</td>
                <td>${seller.sales}</td>
                <td>$${seller.revenue}</td>
                <td>${seller.rating} ⭐</td>
            `;
            
            topSellersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading top sellers:', error);
    }
}

// Update admin stats
async function updateAdminStats() {
    try {
        const response = await fetch('api.php?action=get_stats');
        const stats = await response.json();
        
        document.getElementById('totalRevenue').textContent = `$${stats.total_revenue.toLocaleString()}`;
        document.getElementById('totalAccountsCount').textContent = stats.total_accounts.toLocaleString();
        document.getElementById('totalSales').textContent = stats.total_sales.toLocaleString();
        document.getElementById('totalUsersCount').textContent = stats.total_users.toLocaleString();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Render seller accounts table
async function renderSellerAccountsTable(filter = 'all', search = '') {
    try {
        const response = await fetch(`api.php?action=get_seller_accounts&filter=${filter}&search=${search}`);
        const accounts = await response.json();
        
        sellerAccountsTableBody.innerHTML = '';
        accounts.forEach(account => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${account.id}</td>
                <td>${account.game}</td>
                <td>${account.rank}</td>
                <td>$${account.price}</td>
                <td><span class="status-badge status-${account.status}">${account.status.charAt(0).toUpperCase() + account.status.slice(1)}</span></td>
                <td>${account.created_at}</td>
                <td>
                    ${account.status === 'revision' || account.status === 'rejected' ? `
                        <button class="btn btn-sm btn-primary" data-action="edit" data-id="${account.id}">Edit</button>
                    ` : ''}
                    ${account.status === 'active' ? `
                        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${account.id}">Delete</button>
                    ` : ''}
                </td>
            `;
            
            sellerAccountsTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const accountId = parseInt(e.target.getAttribute('data-id'));
                
                if (action === 'edit') {
                    editAccount(accountId);
                } else if (action === 'delete') {
                    deleteAccount(accountId);
                }
            });
        });
        
        // Update showing/total counts
        document.getElementById('showingSellerAccounts').textContent = `1-${accounts.length}`;
        document.getElementById('totalSellerAccounts').textContent = accounts.length;
    } catch (error) {
        console.error('Error loading seller accounts:', error);
    }
}

// Render seller sales table
async function renderSellerSalesTable(dateFrom = '', dateTo = '') {
    try {
        const response = await fetch(`api.php?action=get_seller_sales&dateFrom=${dateFrom}&dateTo=${dateTo}`);
        const sales = await response.json();
        
        sellerSalesTableBody.innerHTML = '';
        sales.forEach(sale => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.game} (${sale.nickname})</td>
                <td>${sale.buyer_username}</td>
                <td>$${sale.price}</td>
                <td>${sale.transaction_date}</td>
                <td><span class="status-badge status-${sale.status}">${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}</span></td>
            `;
            
            sellerSalesTableBody.appendChild(row);
        });
        
        // Update showing/total counts
        document.getElementById('showingSellerSales').textContent = `1-${sales.length}`;
        document.getElementById('totalSellerSales').textContent = sales.length;
    } catch (error) {
        console.error('Error loading seller sales:', error);
    }
}

// Update seller stats
async function updateSellerStats() {
    try {
        const response = await fetch('api.php?action=get_seller_stats');
        const stats = await response.json();
        
        document.getElementById('sellerTotalRevenue').textContent = `$${stats.total_revenue.toLocaleString()}`;
        document.getElementById('sellerTotalSales').textContent = stats.total_sales.toLocaleString();
        document.getElementById('sellerActiveAccounts').textContent = stats.active_accounts.toLocaleString();
        document.getElementById('sellerRating').textContent = stats.rating;
    } catch (error) {
        console.error('Error loading seller stats:', error);
    }
}

// Render marketplace for buyers
async function renderMarketplace(gameFilter = '', rankFilter = '', search = '') {
    try {
        const response = await fetch(`api.php?action=get_marketplace&game=${gameFilter}&rank=${rankFilter}&search=${search}`);
        const accounts = await response.json();
        
        marketplaceGrid.innerHTML = '';
        accounts.forEach(account => {
            const isInWishlist = wishlist.includes(account.id);
            
            const card = document.createElement('div');
            card.className = 'account-card';
            
            card.innerHTML = `
                <div class="account-badge">
                    <span class="status-badge status-active">Active</span>
                </div>
                <div class="account-image">
                    <img src="${account.images[0]}" alt="${account.game} Account">
                </div>
                <div class="account-content">
                    <h3 class="account-title">${account.game} - ${account.rank}</h3>
                    <div class="account-meta">
                        <span>${account.nickname}</span>
                        <span>${account.seller_username}</span>
                    </div>
                    <div class="account-price">$${account.price}</div>
                    <div class="account-actions">
                        <button class="btn btn-outline btn-sm" data-action="view" data-id="${account.id}">View</button>
                        <button class="btn ${isInWishlist ? 'btn-danger' : 'btn-outline'} btn-sm" data-action="wishlist" data-id="${account.id}">
                            ${isInWishlist ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            `;
            
            marketplaceGrid.appendChild(card);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('[data-action="view"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const accountId = parseInt(e.target.getAttribute('data-id'));
                viewAccountDetails(accountId);
            });
        });
        
        document.querySelectorAll('[data-action="wishlist"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const accountId = parseInt(e.target.getAttribute('data-id'));
                toggleWishlistAccount(accountId, e.target);
            });
        });
        
        // Update showing/total counts
        document.getElementById('showingMarketplace').textContent = `1-${accounts.length}`;
        document.getElementById('totalMarketplace').textContent = accounts.length;
    } catch (error) {
        console.error('Error loading marketplace:', error);
    }
}

// Render wishlist for buyers
async function renderWishlist() {
    try {
        const response = await fetch('api.php?action=get_wishlist');
        const wishlistAccounts = await response.json();
        
        // Render grid
        wishlistGrid.innerHTML = '';
        
        if (wishlistAccounts.length === 0) {
            wishlistGrid.innerHTML = '<div class="text-center py-8 text-gray">Your wishlist is empty</div>';
            return;
        }
        
        wishlistAccounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'account-card';
            
            card.innerHTML = `
                <div class="account-badge">
                    <span class="status-badge status-active">Active</span>
                </div>
                <div class="account-image">
                    <img src="${account.images[0]}" alt="${account.game} Account">
                </div>
                <div class="account-content">
                    <h3 class="account-title">${account.game} - ${account.rank}</h3>
                    <div class="account-meta">
                        <span>${account.nickname}</span>
                        <span>${account.seller_username}</span>
                    </div>
                    <div class="account-price">$${account.price}</div>
                    <div class="account-actions">
                        <button class="btn btn-outline btn-sm" data-action="view" data-id="${account.id}">View</button>
                        <button class="btn btn-danger btn-sm" data-action="remove" data-id="${account.id}">Remove</button>
                    </div>
                </div>
            `;
            
            wishlistGrid.appendChild(card);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('[data-action="view"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const accountId = parseInt(e.target.getAttribute('data-id'));
                viewAccountDetails(accountId);
            });
        });
        
        document.querySelectorAll('[data-action="remove"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const accountId = parseInt(e.target.getAttribute('data-id'));
                removeFromWishlist(accountId);
            });
        });
    } catch (error) {
        console.error('Error loading wishlist:', error);
    }
}

// Render purchases table for buyers
async function renderPurchasesTable(dateFrom = '', dateTo = '') {
    try {
        const response = await fetch(`api.php?action=get_purchases&dateFrom=${dateFrom}&dateTo=${dateTo}`);
        const purchases = await response.json();
        
        purchasesTableBody.innerHTML = '';
        purchases.forEach(purchase => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${purchase.id}</td>
                <td>${purchase.game} (${purchase.nickname})</td>
                <td>${purchase.seller_username}</td>
                <td>$${purchase.price}</td>
                <td>${purchase.transaction_date}</td>
                <td><span class="status-badge status-${purchase.status}">${purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" data-action="contact" data-id="${purchase.id}">Contact</button>
                    <button class="btn btn-sm btn-success" data-action="review" data-id="${purchase.id}">Review</button>
                </td>
            `;
            
            purchasesTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const transactionId = parseInt(e.target.getAttribute('data-id'));
                
                if (action === 'contact') {
                    contactSeller(transactionId);
                } else if (action === 'review') {
                    leaveReview(transactionId);
                }
            });
        });
        
        // Update showing/total counts
        document.getElementById('showingPurchases').textContent = `1-${purchases.length}`;
        document.getElementById('totalPurchases').textContent = purchases.length;
    } catch (error) {
        console.error('Error loading purchases:', error);
    }
}

// View account details
async function viewAccountDetails(accountId) {
    try {
        const response = await fetch(`api.php?action=get_account_details&id=${accountId}`);
        const account = await response.json();
        
        if (!account) {
            showAlert('Account not found', 'danger');
            return;
        }
        
        const isInWishlist = wishlist.includes(account.id);
        
        // Update modal content
        document.getElementById('detailAccountTitle').textContent = `${account.game} - ${account.rank}`;
        document.getElementById('detailAccountGame').textContent = account.game;
        document.getElementById('detailAccountRank').textContent = account.rank;
        document.getElementById('detailAccountNickname').textContent = account.nickname;
        document.getElementById('detailAccountSkins').textContent = account.skins || 'Not specified';
        document.getElementById('detailAccountSeller').textContent = account.seller_username;
        document.getElementById('detailAccountDescription').textContent = account.description;
        document.getElementById('detailAccountPrice').textContent = `$${account.price}`;
        document.getElementById('detailAccountImage').src = account.images[0];
        document.getElementById('detailAccountStatus').textContent = account.status.charAt(0).toUpperCase() + account.status.slice(1);
        document.getElementById('detailAccountStatus').className = `status-badge status-${account.status}`;
        
        // Update buttons
        addToWishlistBtn.dataset.accountId = accountId;
        buyNowBtn.dataset.accountId = accountId;
        
        if (isInWishlist) {
            addToWishlistBtn.innerHTML = '<span>❤️</span> <span class="hidden md:inline">In Wishlist</span>';
        } else {
            addToWishlistBtn.innerHTML = '<span>❤️</span> <span class="hidden md:inline">Wishlist</span>';
        }
        
        // Show modal
        accountDetailModal.classList.add('show');
    } catch (error) {
        console.error('Error loading account details:', error);
    }
}

// Toggle wishlist account
async function toggleWishlistAccount(accountId, button) {
    const index = wishlist.indexOf(accountId);
    
    try {
        if (index === -1) {
            // Add to wishlist
            const response = await fetch('api.php?action=add_to_wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                wishlist.push(accountId);
                button.innerHTML = '❤️';
                button.classList.remove('btn-outline');
                button.classList.add('btn-danger');
                showAlert('Added to wishlist', 'success');
            } else {
                showAlert(data.message, 'danger');
                return;
            }
        } else {
            // Remove from wishlist
            const response = await fetch('api.php?action=remove_from_wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                wishlist.splice(index, 1);
                button.innerHTML = '🤍';
                button.classList.remove('btn-danger');
                button.classList.add('btn-outline');
                showAlert('Removed from wishlist', 'warning');
            } else {
                showAlert(data.message, 'danger');
                return;
            }
        }
        
        localStorage.setItem('gemoraWishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        renderWishlist();
    } catch (error) {
        showAlert('An error occurred while updating wishlist', 'danger');
        console.error('Wishlist error:', error);
    }
}

// Remove from wishlist
async function removeFromWishlist(accountId) {
    const index = wishlist.indexOf(accountId);
    
    if (index !== -1) {
        try {
            const response = await fetch('api.php?action=remove_from_wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                wishlist.splice(index, 1);
                localStorage.setItem('gemoraWishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                renderWishlist();
                renderMarketplace();
                showAlert('Removed from wishlist', 'warning');
            } else {
                showAlert(data.message, 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while removing from wishlist', 'danger');
            console.error('Remove from wishlist error:', error);
        }
    }
}

// Contact seller
function contactSeller(transactionId) {
    // In a real app, this would open WhatsApp or another messaging platform
    showAlert(`Contacting seller for transaction #${transactionId}`, 'success');
}

// Leave review
function leaveReview(transactionId) {
    // In a real app, this would open a review form
    showAlert('Review feature coming soon', 'info');
}

// Update account status (admin action)
async function updateAccountStatus(accountId, action) {
    try {
        const response = await fetch('api.php?action=update_account_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountId, action })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(`Account ${action}d successfully`, 'success');
            
            // Update UI
            renderAccountsTable();
            if (currentUser.role === 'seller') {
                renderSellerAccountsTable();
            }
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while updating account status', 'danger');
        console.error('Update account status error:', error);
    }
}

// Handle user action (admin)
async function handleUserAction(userId, action) {
    try {
        const response = await fetch('api.php?action=update_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, action })
        });
        
        const data = await response.json();
        
        if (data.success) {
            let message = '';
            switch (action) {
                case 'delete':
                    message = 'User deleted successfully';
                    break;
                case 'suspend':
                    message = 'User suspended';
                    break;
                case 'promote':
                    message = 'User promoted to admin';
                    break;
                default:
                    message = 'Action completed';
            }
            
            showAlert(message, 'success');
            renderUsersTable();
        } else {
            showAlert(data.message, 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while performing user action', 'danger');
        console.error('User action error:', error);
    }
}

// Edit account (seller)
async function editAccount(accountId) {
    try {
        const response = await fetch(`api.php?action=get_account_details&id=${accountId}`);
        const account = await response.json();
        
        if (!account) {
            showAlert('Account not found', 'danger');
            return;
        }
        
        // Navigate to add account section
        document.querySelectorAll('.dashboard-section').forEach(section => section.classList.add('hidden'));
        document.getElementById('sellerAddAccount').classList.remove('hidden');
        
        // Update active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelector('.sidebar-link[data-section="sellerAddAccount"]').classList.add('active');
        
        // Fill form with account data
        document.getElementById('accountGame').value = account.game;
        document.getElementById('accountRank').value = account.rank;
        document.getElementById('accountNickname').value = account.nickname;
        document.getElementById('accountPrice').value = account.price;
        document.getElementById('accountSkins').value = account.skins || '';
        document.getElementById('accountDescription').value = account.description;
        
        // Show images
        imagePreview.innerHTML = '';
        account.images.forEach((img, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-preview-item';
            
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = 'Account Image';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'image-preview-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                imgContainer.remove();
                // In a real app, we would remove the image from the server
            });
            
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(removeBtn);
            imagePreview.appendChild(imgContainer);
        });
        
        // Store account ID for update
        addAccountForm.dataset.accountId = accountId;
    } catch (error) {
        showAlert('An error occurred while loading account for editing', 'danger');
        console.error('Edit account error:', error);
    }
}

// Delete account (seller)
async function deleteAccount(accountId) {
    if (confirm('Are you sure you want to delete this account?')) {
        try {
            const response = await fetch('api.php?action=delete_account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('Account deleted', 'success');
                renderSellerAccountsTable();
                
                if (currentUser.role === 'admin') {
                    renderAccountsTable();
                }
            } else {
                showAlert(data.message, 'danger');
            }
        } catch (error) {
            showAlert('An error occurred while deleting account', 'danger');
            console.error('Delete account error:', error);
        }
    }
}

// Check if user is on mobile
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Initialize the app
init();

// Add event listeners for filters and search
if (document.getElementById('accountFilter')) {
    document.getElementById('accountFilter').addEventListener('change', (e) => {
        renderAccountsTable(e.target.value, document.getElementById('accountSearch').value);
    });
}

if (document.getElementById('accountSearch')) {
    document.getElementById('accountSearch').addEventListener('input', (e) => {
        renderAccountsTable(document.getElementById('accountFilter').value, e.target.value);
    });
}

if (document.getElementById('userFilter')) {
    document.getElementById('userFilter').addEventListener('change', (e) => {
        renderUsersTable(e.target.value, document.getElementById('userSearch').value);
    });
}

if (document.getElementById('userSearch')) {
    document.getElementById('userSearch').addEventListener('input', (e) => {
        renderUsersTable(document.getElementById('userFilter').value, e.target.value);
    });
}

if (document.getElementById('transactionDateFrom')) {
    document.getElementById('transactionDateFrom').addEventListener('change', (e) => {
        renderTransactionsTable(e.target.value, document.getElementById('transactionDateTo').value, document.getElementById('transactionSearch').value);
    });
}

if (document.getElementById('transactionDateTo')) {
    document.getElementById('transactionDateTo').addEventListener('change', (e) => {
        renderTransactionsTable(document.getElementById('transactionDateFrom').value, e.target.value, document.getElementById('transactionSearch').value);
    });
}

if (document.getElementById('transactionSearch')) {
    document.getElementById('transactionSearch').addEventListener('input', (e) => {
        renderTransactionsTable(document.getElementById('transactionDateFrom').value, document.getElementById('transactionDateTo').value, e.target.value);
    });
}

if (document.getElementById('sellerAccountFilter')) {
    document.getElementById('sellerAccountFilter').addEventListener('change', (e) => {
        renderSellerAccountsTable(e.target.value, document.getElementById('sellerAccountSearch').value);
    });
}

if (document.getElementById('sellerAccountSearch')) {
    document.getElementById('sellerAccountSearch').addEventListener('input', (e) => {
        renderSellerAccountsTable(document.getElementById('sellerAccountFilter').value, e.target.value);
    });
}

if (document.getElementById('sellerSalesDateFrom')) {
    document.getElementById('sellerSalesDateFrom').addEventListener('change', (e) => {
        renderSellerSalesTable(e.target.value, document.getElementById('sellerSalesDateTo').value);
    });
}

if (document.getElementById('sellerSalesDateTo')) {
    document.getElementById('sellerSalesDateTo').addEventListener('change', (e) => {
        renderSellerSalesTable(document.getElementById('sellerSalesDateFrom').value, e.target.value);
    });
}

if (document.getElementById('marketplaceGameFilter')) {
    document.getElementById('marketplaceGameFilter').addEventListener('change', (e) => {
        renderMarketplace(e.target.value, document.getElementById('marketplaceRankFilter').value, document.getElementById('marketplaceSearch').value);
    });
}

if (document.getElementById('marketplaceRankFilter')) {
    document.getElementById('marketplaceRankFilter').addEventListener('change', (e) => {
        renderMarketplace(document.getElementById('marketplaceGameFilter').value, e.target.value, document.getElementById('marketplaceSearch').value);
    });
}

if (document.getElementById('marketplaceSearch')) {
    document.getElementById('marketplaceSearch').addEventListener('input', (e) => {
        renderMarketplace(document.getElementById('marketplaceGameFilter').value, document.getElementById('marketplaceRankFilter').value, e.target.value);
    });
}

if (document.getElementById('purchasesDateFrom')) {
    document.getElementById('purchasesDateFrom').addEventListener('change', (e) => {
        renderPurchasesTable(e.target.value, document.getElementById('purchasesDateTo').value);
    });
}

if (document.getElementById('purchasesDateTo')) {
    document.getElementById('purchasesDateTo').addEventListener('change', (e) => {
        renderPurchasesTable(document.getElementById('purchasesDateFrom').value, e.target.value);
    });
}

if (document.getElementById('statsPeriod')) {
    document.getElementById('statsPeriod').addEventListener('change', (e) => {
        updateAdminStats();
    });
}

if (document.getElementById('sellerStatsPeriod')) {
    document.getElementById('sellerStatsPeriod').addEventListener('change', (e) => {
        updateSellerStats();
    });
}

// Pagination event listeners
if (document.getElementById('prevAccountsPage')) {
    document.getElementById('prevAccountsPage').addEventListener('click', () => {
        // In a real app, this would load the previous page of accounts
        showAlert('Pagination coming soon', 'info');
    });
}

if (document.getElementById('nextAccountsPage')) {
    document.getElementById('nextAccountsPage').addEventListener('click', () => {
        // In a real app, this would load the next page of accounts
        showAlert('Pagination coming soon', 'info');
    });
}

// Similar pagination listeners for other tables...