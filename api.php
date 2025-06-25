<?php
header('Content-Type: application/json');
require_once 'db.php';

// Initialize database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Start session
session_start();

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'login':
        handleLogin($conn);
        break;
    case 'register':
        handleRegister($conn);
        break;
    case 'logout':
        handleLogout();
        break;
    case 'get_accounts':
        getAccounts($conn);
        break;
    case 'get_users':
        getUsers($conn);
        break;
    case 'get_transactions':
        getTransactions($conn);
        break;
    case 'get_top_sellers':
        getTopSellers($conn);
        break;
    case 'get_stats':
        getStats($conn);
        break;
    case 'get_seller_accounts':
        getSellerAccounts($conn);
        break;
    case 'get_seller_sales':
        getSellerSales($conn);
        break;
    case 'get_seller_stats':
        getSellerStats($conn);
        break;
    case 'get_marketplace':
        getMarketplace($conn);
        break;
    case 'get_wishlist':
        getWishlist($conn);
        break;
    case 'get_purchases':
        getPurchases($conn);
        break;
    case 'get_account_details':
        getAccountDetails($conn);
        break;
    case 'add_to_wishlist':
        addToWishlist($conn);
        break;
    case 'remove_from_wishlist':
        removeFromWishlist($conn);
        break;
    case 'buy':
        handleBuy($conn);
        break;
    case 'add_account':
        addAccount($conn);
        break;
    case 'update_account_status':
        updateAccountStatus($conn);
        break;
    case 'update_user':
        updateUser($conn);
        break;
    case 'delete_account':
        deleteAccount($conn);
        break;
    case 'add_admin':
        addAdmin($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Close connection
$conn->close();

// Handle login
function handleLogin($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $role = $conn->real_escape_string($data['role']);
    
    // Validate inputs
    if (empty($email) || empty($password) || empty($role)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
        return;
    }
    
    // Find user
    $sql = "SELECT * FROM users WHERE email = '$email' AND role = '$role'";
    $result = $conn->query($sql);
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Account not found']);
        return;
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password (in a real app, we would use password_verify() with hashed passwords)
    if ($password !== $user['password']) {
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        return;
    }
    
    // Login successful
    $_SESSION['user'] = $user;
    echo json_encode(['success' => true, 'user' => $user]);
}

// Handle register
function handleRegister($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = $conn->real_escape_string($data['username']);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $role = $conn->real_escape_string($data['role']);
    
    // Validate inputs
    if (empty($username) || empty($email) || empty($password) || empty($role)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
        return;
    }
    
    // Check if email already exists
    $sql = "SELECT id FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        return;
    }
    
    // Check if username already exists
    $sql = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already taken']);
        return;
    }
    
    // Create new user (in a real app, we would hash the password)
    $sql = "INSERT INTO users (username, email, password, role) VALUES ('$username', '$email', '$password', '$role')";
    
    if ($conn->query($sql) === TRUE) {
        $user_id = $conn->insert_id;
        $user = [
            'id' => $user_id,
            'username' => $username,
            'email' => $email,
            'role' => $role,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $_SESSION['user'] = $user;
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
}

// Handle logout
function handleLogout() {
    session_destroy();
    echo json_encode(['success' => true]);
}

// Get accounts for admin
function getAccounts($conn) {
    $filter = isset($_GET['filter']) ? $conn->real_escape_string($_GET['filter']) : 'all';
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    $sql = "SELECT ga.*, u.username as seller_username 
            FROM game_accounts ga
            JOIN users u ON ga.seller_id = u.id";
    
    $where = [];
    if ($filter !== 'all') {
        $where[] = "ga.status = '$filter'";
    }
    
    if (!empty($search)) {
        $where[] = "(ga.game LIKE '%$search%' OR ga.nickname LIKE '%$search%' OR ga.rank LIKE '%$search%')";
    }
    
    if (!empty($where)) {
        $sql .= " WHERE " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY ga.created_at DESC";
    
    $result = $conn->query($sql);
    $accounts = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $accounts[] = $row;
        }
    }
    
    echo json_encode($accounts);
}

// Get users for admin
function getUsers($conn) {
    $filter = isset($_GET['filter']) ? $conn->real_escape_string($_GET['filter']) : 'all';
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    $sql = "SELECT * FROM users";
    
    $where = [];
    if ($filter !== 'all') {
        $where[] = "role = '$filter'";
    }
    
    if (!empty($search)) {
        $where[] = "(username LIKE '%$search%' OR email LIKE '%$search%')";
    }
    
    if (!empty($where)) {
        $sql .= " WHERE " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    $users = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    
    echo json_encode($users);
}

// Get transactions for admin
function getTransactions($conn) {
    $dateFrom = isset($_GET['dateFrom']) ? $conn->real_escape_string($_GET['dateFrom']) : '';
    $dateTo = isset($_GET['dateTo']) ? $conn->real_escape_string($_GET['dateTo']) : '';
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    $sql = "SELECT t.*, ga.game, ga.nickname, 
                   seller.username as seller_username, 
                   buyer.username as buyer_username
            FROM transactions t
            JOIN game_accounts ga ON t.account_id = ga.id
            JOIN users seller ON t.seller_id = seller.id
            JOIN users buyer ON t.buyer_id = buyer.id";
    
    $where = [];
    if (!empty($dateFrom)) {
        $where[] = "t.transaction_date >= '$dateFrom'";
    }
    
    if (!empty($dateTo)) {
        $where[] = "t.transaction_date <= '$dateTo'";
    }
    
    if (!empty($search)) {
        $where[] = "(ga.game LIKE '%$search%' OR ga.nickname LIKE '%$search%' OR 
                    seller.username LIKE '%$search%' OR buyer.username LIKE '%$search%')";
    }
    
    if (!empty($where)) {
        $sql .= " WHERE " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY t.transaction_date DESC";
    
    $result = $conn->query($sql);
    $transactions = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
    }
    
    echo json_encode($transactions);
}

// Get top sellers for admin
function getTopSellers($conn) {
    $sql = "SELECT u.id, u.username, 
                   COUNT(t.id) as sales, 
                   SUM(t.price) as revenue,
                   ROUND(AVG(5), 1) as rating
            FROM users u
            LEFT JOIN transactions t ON u.id = t.seller_id
            WHERE u.role = 'seller'
            GROUP BY u.id
            ORDER BY sales DESC
            LIMIT 10";
    
    $result = $conn->query($sql);
    $sellers = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sellers[] = $row;
        }
    }
    
    echo json_encode($sellers);
}

// Get stats for admin
function getStats($conn) {
    $stats = [];
    
    // Total revenue
    $sql = "SELECT SUM(price) as total_revenue FROM transactions";
    $result = $conn->query($sql);
    $stats['total_revenue'] = $result->fetch_assoc()['total_revenue'] ?? 0;
    
    // Total active accounts
    $sql = "SELECT COUNT(*) as total_accounts FROM game_accounts WHERE status = 'active'";
    $result = $conn->query($sql);
    $stats['total_accounts'] = $result->fetch_assoc()['total_accounts'] ?? 0;
    
    // Total sales
    $sql = "SELECT COUNT(*) as total_sales FROM transactions";
    $result = $conn->query($sql);
    $stats['total_sales'] = $result->fetch_assoc()['total_sales'] ?? 0;
    
    // Total users
    $sql = "SELECT COUNT(*) as total_users FROM users";
    $result = $conn->query($sql);
    $stats['total_users'] = $result->fetch_assoc()['total_users'] ?? 0;
    
    echo json_encode($stats);
}

// Get seller accounts
function getSellerAccounts($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'seller') {
        echo json_encode([]);
        return;
    }
    
    $seller_id = $_SESSION['user']['id'];
    $filter = isset($_GET['filter']) ? $conn->real_escape_string($_GET['filter']) : 'all';
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    $sql = "SELECT * FROM game_accounts WHERE seller_id = $seller_id";
    
    $where = [];
    if ($filter !== 'all') {
        $where[] = "status = '$filter'";
    }
    
    if (!empty($search)) {
        $where[] = "(game LIKE '%$search%' OR nickname LIKE '%$search%' OR rank LIKE '%$search%')";
    }
    
    if (!empty($where)) {
        $sql .= " AND " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    $accounts = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $accounts[] = $row;
        }
    }
    
    echo json_encode($accounts);
}

// Get seller sales
function getSellerSales($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'seller') {
        echo json_encode([]);
        return;
    }
    
    $seller_id = $_SESSION['user']['id'];
    $dateFrom = isset($_GET['dateFrom']) ? $conn->real_escape_string($_GET['dateFrom']) : '';
    $dateTo = isset($_GET['dateTo']) ? $conn->real_escape_string($_GET['dateTo']) : '';
    
    $sql = "SELECT t.*, ga.game, ga.nickname, u.username as buyer_username
            FROM transactions t
            JOIN game_accounts ga ON t.account_id = ga.id
            JOIN users u ON t.buyer_id = u.id
            WHERE t.seller_id = $seller_id";
    
    $where = [];
    if (!empty($dateFrom)) {
        $where[] = "t.transaction_date >= '$dateFrom'";
    }
    
    if (!empty($dateTo)) {
        $where[] = "t.transaction_date <= '$dateTo'";
    }
    
    if (!empty($where)) {
        $sql .= " AND " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY t.transaction_date DESC";
    
    $result = $conn->query($sql);
    $sales = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sales[] = $row;
        }
    }
    
    echo json_encode($sales);
}

// Get seller stats
function getSellerStats($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'seller') {
        echo json_encode([]);
        return;
    }
    
    $seller_id = $_SESSION['user']['id'];
    $stats = [];
    
    // Total revenue
    $sql = "SELECT SUM(price) as total_revenue FROM transactions WHERE seller_id = $seller_id";
    $result = $conn->query($sql);
    $stats['total_revenue'] = $result->fetch_assoc()['total_revenue'] ?? 0;
    
    // Total sales
    $sql = "SELECT COUNT(*) as total_sales FROM transactions WHERE seller_id = $seller_id";
    $result = $conn->query($sql);
    $stats['total_sales'] = $result->fetch_assoc()['total_sales'] ?? 0;
    
    // Active accounts
    $sql = "SELECT COUNT(*) as active_accounts FROM game_accounts WHERE seller_id = $seller_id AND status = 'active'";
    $result = $conn->query($sql);
    $stats['active_accounts'] = $result->fetch_assoc()['active_accounts'] ?? 0;
    
    // Rating (random for demo)
    $stats['rating'] = round(4 + (rand(0, 20) / 10, 1);
    
    echo json_encode($stats);
}

// Get marketplace for buyers
function getMarketplace($conn) {
    $game = isset($_GET['game']) ? $conn->real_escape_string($_GET['game']) : '';
    $rank = isset($_GET['rank']) ? $conn->real_escape_string($_GET['rank']) : '';
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    $sql = "SELECT ga.*, u.username as seller_username 
            FROM game_accounts ga
            JOIN users u ON ga.seller_id = u.id
            WHERE ga.status = 'active'";
    
    $where = [];
    if (!empty($game)) {
        $where[] = "ga.game = '$game'";
    }
    
    if (!empty($rank)) {
        $where[] = "ga.rank LIKE '%$rank%'";
    }
    
    if (!empty($search)) {
        $where[] = "(ga.game LIKE '%$search%' OR ga.nickname LIKE '%$search%' OR ga.rank LIKE '%$search%')";
    }
    
    if (!empty($where)) {
        $sql .= " AND " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY ga.created_at DESC";
    
    $result = $conn->query($sql);
    $accounts = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // In a real app, we would get actual images from the server
            $row['images'] = ['https://via.placeholder.com/300x200'];
            $accounts[] = $row;
        }
    }
    
    echo json_encode($accounts);
}

// Get wishlist for buyer
function getWishlist($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'buyer') {
        echo json_encode([]);
        return;
    }
    
    $buyer_id = $_SESSION['user']['id'];
    
    $sql = "SELECT ga.*, u.username as seller_username 
            FROM wishlist w
            JOIN game_accounts ga ON w.account_id = ga.id
            JOIN users u ON ga.seller_id = u.id
            WHERE w.user_id = $buyer_id AND ga.status = 'active'";
    
    $result = $conn->query($sql);
    $accounts = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // In a real app, we would get actual images from the server
            $row['images'] = ['https://via.placeholder.com/300x200'];
            $accounts[] = $row;
        }
    }
    
    echo json_encode($accounts);
}

// Get purchases for buyer
function getPurchases($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'buyer') {
        echo json_encode([]);
        return;
    }
    
    $buyer_id = $_SESSION['user']['id'];
    $dateFrom = isset($_GET['dateFrom']) ? $conn->real_escape_string($_GET['dateFrom']) : '';
    $dateTo = isset($_GET['dateTo']) ? $conn->real_escape_string($_GET['dateTo']) : '';
    
    $sql = "SELECT t.*, ga.game, ga.nickname, u.username as seller_username
            FROM transactions t
            JOIN game_accounts ga ON t.account_id = ga.id
            JOIN users u ON t.seller_id = u.id
            WHERE t.buyer_id = $buyer_id";
    
    $where = [];
    if (!empty($dateFrom)) {
        $where[] = "t.transaction_date >= '$dateFrom'";
    }
    
    if (!empty($dateTo)) {
        $where[] = "t.transaction_date <= '$dateTo'";
    }
    
    if (!empty($where)) {
        $sql .= " AND " . implode(' AND ', $where);
    }
    
    $sql .= " ORDER BY t.transaction_date DESC";
    
    $result = $conn->query($sql);
    $purchases = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $purchases[] = $row;
        }
    }
    
    echo json_encode($purchases);
}

// Get account details
function getAccountDetails($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $sql = "SELECT ga.*, u.username as seller_username 
            FROM game_accounts ga
            JOIN users u ON ga.seller_id = u.id
            WHERE ga.id = $id";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows === 0) {
        echo json_encode(null);
        return;
    }
    
    $account = $result->fetch_assoc();
    // In a real app, we would get actual images from the server
    $account['images'] = ['https://via.placeholder.com/300x200'];
    
    echo json_encode($account);
}

// Add to wishlist
function addToWishlist($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'buyer') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $account_id = intval($data['account_id']);
    $user_id = $_SESSION['user']['id'];
    
    // Check if account exists and is active
    $sql = "SELECT id FROM game_accounts WHERE id = $account_id AND status = 'active'";
    $result = $conn->query($sql);
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Account not available']);
        return;
    }
    
    // Check if already in wishlist
    $sql = "SELECT id FROM wishlist WHERE user_id = $user_id AND account_id = $account_id";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Already in wishlist']);
        return;
    }
    
    // Add to wishlist
    $sql = "INSERT INTO wishlist (user_id, account_id) VALUES ($user_id, $account_id)";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add to wishlist']);
    }
}

// Remove from wishlist
function removeFromWishlist($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'buyer') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $account_id = intval($data['account_id']);
    $user_id = $_SESSION['user']['id'];
    
    $sql = "DELETE FROM wishlist WHERE user_id = $user_id AND account_id = $account_id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove from wishlist']);
    }
}

// Handle buy
function handleBuy($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'buyer') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $account_id = intval($data['account_id']);
    $buyer_id = $_SESSION['user']['id'];
    
    // Check if account exists and is active
    $sql = "SELECT id, seller_id, price FROM game_accounts WHERE id = $account_id AND status = 'active'";
    $result = $conn->query($sql);
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Account not available']);
        return;
    }
    
    $account = $result->fetch_assoc();
    $seller_id = $account['seller_id'];
    $price = $account['price'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Update account status to sold
        $sql = "UPDATE game_accounts SET status = 'sold' WHERE id = $account_id";
        $conn->query($sql);
        
        // Create transaction record
        $sql = "INSERT INTO transactions (account_id, seller_id, buyer_id, price, status) 
                VALUES ($account_id, $seller_id, $buyer_id, $price, 'pending')";
        $conn->query($sql);
        
        $conn->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Transaction failed']);
    }
}

// Add account
function addAccount($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'seller') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $game = $conn->real_escape_string($data['game']);
    $rank = $conn->real_escape_string($data['rank']);
    $nickname = $conn->real_escape_string($data['nickname']);
    $price = floatval($data['price']);
    $skins = isset($data['skins']) ? $conn->real_escape_string($data['skins']) : '';
    $description = $conn->real_escape_string($data['description']);
    $seller_id = $_SESSION['user']['id'];
    
    // In a real app, we would upload images to the server and store paths
    $images = isset($data['images']) ? $data['images'] : [];
    
    $sql = "INSERT INTO game_accounts (game, rank, nickname, price, skins, description, seller_id, status) 
            VALUES ('$game', '$rank', '$nickname', $price, '$skins', '$description', $seller_id, 'pending')";
    
    if ($conn->query($sql) === TRUE) {
        $account_id = $conn->insert_id;
        echo json_encode(['success' => true, 'account_id' => $account_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add account']);
    }
}

// Update account status
function updateAccountStatus($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $account_id = intval($data['account_id']);
    $action = $conn->real_escape_string($data['action']);
    
    // Validate action
    $validActions = ['approve', 'reject', 'revision'];
    if (!in_array($action, $validActions)) {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        return;
    }
    
    $status = '';
    switch ($action) {
        case 'approve':
            $status = 'active';
            break;
        case 'reject':
            $status = 'rejected';
            break;
        case 'revision':
            $status = 'revision';
            break;
    }
    
    $sql = "UPDATE game_accounts SET status = '$status' WHERE id = $account_id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update account status']);
    }
}

// Update user (admin actions)
function updateUser($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $user_id = intval($data['user_id']);
    $action = $conn->real_escape_string($data['action']);
    
    // Prevent modifying self
    if ($user_id === $_SESSION['user']['id']) {
        echo json_encode(['success' => false, 'message' => 'Cannot modify your own account']);
        return;
    }
    
    $success = false;
    $message = '';
    
    switch ($action) {
        case 'delete':
            $sql = "DELETE FROM users WHERE id = $user_id AND role != 'admin'";
            if ($conn->query($sql) === TRUE) {
                $success = true;
            } else {
                $message = 'Failed to delete user';
            }
            break;
            
        case 'suspend':
            // In a real app, we would have a suspended status
            $success = true;
            $message = 'User suspended (demo)';
            break;
            
        case 'promote':
            $sql = "UPDATE users SET role = 'admin' WHERE id = $user_id";
            if ($conn->query($sql) === TRUE) {
                $success = true;
            } else {
                $message = 'Failed to promote user';
            }
            break;
            
        default:
            $message = 'Invalid action';
    }
    
    echo json_encode(['success' => $success, 'message' => $message]);
}

// Delete account (seller)
function deleteAccount($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'seller') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $account_id = intval($data['account_id']);
    $seller_id = $_SESSION['user']['id'];
    
    // Check if account belongs to seller
    $sql = "SELECT id FROM game_accounts WHERE id = $account_id AND seller_id = $seller_id";
    $result = $conn->query($sql);
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Account not found']);
        return;
    }
    
    $sql = "DELETE FROM game_accounts WHERE id = $account_id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete account']);
    }
}

// Add admin
function addAdmin($conn) {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = $conn->real_escape_string($data['username']);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $level = $conn->real_escape_string($data['level']);
    
    // Validate inputs
    if (empty($username) || empty($email) || empty($password) || empty($level)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
        return;
    }
    
    // Check if email already exists
    $sql = "SELECT id FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        return;
    }
    
    // Check if username already exists
    $sql = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already taken']);
        return;
    }
    
    // Create new admin (in a real app, we would hash the password)
    $sql = "INSERT INTO users (username, email, password, role, level) 
            VALUES ('$username', '$email', '$password', 'admin', '$level')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create admin account']);
    }
}