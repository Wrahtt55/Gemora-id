<?php
// Start session
session_start();

// Include database configuration
require_once 'db.php';

// Check if user is logged in
$currentUser = isset($_SESSION['user']) ? $_SESSION['user'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemora ID - Game Account Marketplace</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Mobile Warning Popup -->
    <div class="mobile-warning" id="mobileWarning">
        <div class="mobile-warning-content">
            <h2>⚠️ Desktop Recommended</h2>
            <p>For the best experience, we recommend using Gemora ID on a desktop computer. The mobile version is currently not fully optimized and some features may not work properly.</p>
            <button class="mobile-warning-btn" id="continueMobileBtn">Continue Anyway</button>
        </div>
    </div>
    
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <div class="logo">
                <span class="logo-icon">🎮</span>
                <span>Gemora ID</span>
            </div>
            <nav class="nav-links">
                <a href="#" class="nav-link">Home</a>
                <a href="#" class="nav-link">Marketplace</a>
                <a href="#" class="nav-link">How It Works</a>
                <a href="#" class="nav-link">FAQ</a>
            </nav>
            <div class="user-menu">
                <?php if (!$currentUser): ?>
                    <button class="btn btn-outline" id="loginBtn">Login</button>
                    <button class="btn btn-primary" id="registerBtn">Register</button>
                <?php else: ?>
                    <div class="user-avatar"><?= strtoupper(substr($currentUser['username'], 0, 1)) ?></div>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main" id="mainContent">
        <?php if (!$currentUser): ?>
            <!-- Landing Page Content (Default) -->
            <section class="hero py-4">
                <div class="container">
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-4xl font-bold mb-4">Buy & Sell Premium Game Accounts Safely</h1>
                            <p class="text-xl mb-6">Gemora ID provides a trusted marketplace for gamers to trade their accounts with escrow protection and verified sellers.</p>
                            <div class="flex gap-3">
                                <button class="btn btn-primary btn-lg">Browse Accounts</button>
                                <button class="btn btn-outline btn-lg">Learn More</button>
                            </div>
                        </div>
                        <div class="flex-1 hidden md:block">
                            <img src="https://via.placeholder.com/600x400" alt="Hero Image" class="rounded shadow">
                        </div>
                    </div>
                </div>
            </section>
        <?php else: ?>
            <!-- Dashboard Content based on user role -->
            <?php if ($currentUser['role'] === 'admin'): ?>
                <?php include 'admin_dashboard.php'; ?>
            <?php elseif ($currentUser['role'] === 'seller'): ?>
                <?php include 'seller_dashboard.php'; ?>
            <?php elseif ($currentUser['role'] === 'buyer'): ?>
                <?php include 'buyer_dashboard.php'; ?>
            <?php endif; ?>
        <?php endif; ?>
    </main>

    <!-- Auth Modals -->
    <?php if (!$currentUser): ?>
        <!-- Login Modal -->
        <div class="modal" id="loginModal">
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title">Login to Your Account</h3>
                    <button class="modal-close" id="closeLoginModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail" class="form-label">Email</label>
                            <input type="email" id="loginEmail" class="form-control" placeholder="Enter your email" required>
                            <div class="error-message" id="loginEmailError">Please enter a valid email address</div>
                        </div>
                        <div class="form-group password-toggle">
                            <label for="loginPassword" class="form-label">Password</label>
                            <input type="password" id="loginPassword" class="form-control" placeholder="Enter your password" required>
                            <button type="button" class="password-toggle-btn" id="toggleLoginPassword">👁️</button>
                            <div class="error-message" id="loginPasswordError">Password must be at least 6 characters</div>
                        </div>
                        <div class="form-group">
                            <label for="loginRole" class="form-label">Login As</label>
                            <select id="loginRole" class="form-control" required>
                                <option value="">Select your role</option>
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="form-group flex items-center justify-between">
                            <div class="flex items-center">
                                <input type="checkbox" id="rememberMe" class="mr-2">
                                <label for="rememberMe">Remember me</label>
                            </div>
                            <a href="#" class="text-primary text-sm">Forgot password?</a>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <p>Don't have an account? <a href="#" class="text-primary" id="switchToRegister">Register</a></p>
                </div>
            </div>
        </div>

        <!-- Register Modal -->
        <div class="modal" id="registerModal">
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3 class="modal-title">Create New Account</h3>
                    <button class="modal-close" id="closeRegisterModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="registerForm">
                        <div class="form-group">
                            <label class="form-label">Register As</label>
                            <div class="role-selector">
                                <div class="role-option">
                                    <input type="radio" name="registerRole" id="registerBuyer" value="buyer" class="role-radio" checked>
                                    <label for="registerBuyer" class="role-label">
                                        <div class="font-semibold">Buyer</div>
                                        <div class="text-sm">I want to buy game accounts</div>
                                    </label>
                                </div>
                                <div class="role-option">
                                    <input type="radio" name="registerRole" id="registerSeller" value="seller" class="role-radio">
                                    <label for="registerSeller" class="role-label">
                                        <div class="font-semibold">Seller</div>
                                        <div class="text-sm">I want to sell game accounts</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerUsername" class="form-label">Username</label>
                            <input type="text" id="registerUsername" class="form-control" placeholder="Choose a username" required>
                            <div class="error-message" id="registerUsernameError">Username must be 3-20 characters</div>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail" class="form-label">Email</label>
                            <input type="email" id="registerEmail" class="form-control" placeholder="Enter your email" required>
                            <div class="error-message" id="registerEmailError">Please enter a valid email address</div>
                        </div>
                        <div class="form-group password-toggle">
                            <label for="registerPassword" class="form-label">Password</label>
                            <input type="password" id="registerPassword" class="form-control" placeholder="Create a password" required>
                            <button type="button" class="password-toggle-btn" id="toggleRegisterPassword">👁️</button>
                            <div class="error-message" id="registerPasswordError">Password must be at least 6 characters</div>
                        </div>
                        <div class="form-group password-toggle">
                            <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                            <input type="password" id="registerConfirmPassword" class="form-control" placeholder="Confirm your password" required>
                            <button type="button" class="password-toggle-btn" id="toggleRegisterConfirmPassword">👁️</button>
                            <div class="error-message" id="registerConfirmPasswordError">Passwords do not match</div>
                        </div>
                        <div class="form-group">
                            <div class="flex items-center">
                                <input type="checkbox" id="agreeTerms" class="mr-2" required>
                                <label for="agreeTerms">I agree to the <a href="#" class="text-primary">Terms of Service</a> and <a href="#" class="text-primary">Privacy Policy</a></label>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Account</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <p>Already have an account? <a href="#" class="text-primary" id="switchToLogin">Login</a></p>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- Account Preview Modal -->
    <div class="modal" id="accountPreviewModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3 class="modal-title">Account Preview</h3>
                <button class="modal-close" id="closeAccountPreviewModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="image-preview">
                            <div class="image-preview-item">
                                <img src="https://via.placeholder.com/300x200" alt="Account Preview" id="previewAccountImage">
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold mb-2" id="previewAccountTitle">Mobile Legends Account</h2>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="status-badge status-active">Active</span>
                            <span class="text-gray">ID: #12345</span>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Game:</span>
                                <span id="previewAccountGame">Mobile Legends</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Rank:</span>
                                <span id="previewAccountRank">Mythic 100</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Nickname:</span>
                                <span id="previewAccountNickname">ProPlayer123</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Skins/Items:</span>
                                <span id="previewAccountSkins">50+ Skins, All Heroes</span>
                            </div>
                        </div>
                        <div class="mb-4">
                            <h3 class="font-semibold mb-2">Description</h3>
                            <p id="previewAccountDescription">This is a premium Mobile Legends account with all heroes unlocked, 50+ skins, and high rank. Perfect for competitive players.</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="text-gray">Price:</span>
                                <span class="text-2xl font-bold text-primary" id="previewAccountPrice">$250</span>
                            </div>
                            <button class="btn btn-primary" id="submitAccountBtn">Submit for Approval</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Account Detail Modal -->
    <div class="modal" id="accountDetailModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3 class="modal-title">Account Details</h3>
                <button class="modal-close" id="closeAccountDetailModal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="image-preview">
                            <div class="image-preview-item">
                                <img src="https://via.placeholder.com/300x200" alt="Account Image" id="detailAccountImage">
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold mb-2" id="detailAccountTitle">Mobile Legends Account</h2>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="status-badge status-active" id="detailAccountStatus">Active</span>
                            <span class="text-gray">ID: #12345</span>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Game:</span>
                                <span id="detailAccountGame">Mobile Legends</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Rank:</span>
                                <span id="detailAccountRank">Mythic 100</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Nickname:</span>
                                <span id="detailAccountNickname">ProPlayer123</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Skins/Items:</span>
                                <span id="detailAccountSkins">50+ Skins, All Heroes</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray">Seller:</span>
                                <span id="detailAccountSeller">GameSellerPro</span>
                            </div>
                        </div>
                        <div class="mb-4">
                            <h3 class="font-semibold mb-2">Description</h3>
                            <p id="detailAccountDescription">This is a premium Mobile Legends account with all heroes unlocked, 50+ skins, and high rank. Perfect for competitive players.</p>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="text-gray">Price:</span>
                                <span class="text-2xl font-bold text-primary" id="detailAccountPrice">$250</span>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-outline" id="addToWishlistBtn">
                                    <span>❤️</span> <span class="hidden md:inline">Wishlist</span>
                                </button>
                                <button class="btn btn-primary" id="buyNowBtn">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>