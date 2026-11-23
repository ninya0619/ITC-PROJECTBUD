<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit;
}

$query = "SELECT id, full_name, email, password, screentime, profile_picture, first_login FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        unset($row['password']);
        echo json_encode([
            "success" => true,
            "user" => $row
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
}
?>