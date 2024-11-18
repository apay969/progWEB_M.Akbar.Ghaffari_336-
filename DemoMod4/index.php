<?php
$dataPath = __DIR__ . '/data/products.json';

// Fungsi untuk membaca data dari file JSON
function readData() {
    global $dataPath;
    if (!file_exists($dataPath)) {
        file_put_contents($dataPath, json_encode([]));
    }
    $data = file_get_contents($dataPath);
    return json_decode($data, true);
}

// Fungsi untuk menulis data ke file JSON
function writeData($data) {
    global $dataPath;
    file_put_contents($dataPath, json_encode($data, JSON_PRETTY_PRINT));
}

// Mendapatkan request method dan URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

if ($uri[0] === 'products') {
    $products = readData();

    switch ($method) {
        case 'POST':
            // Mendapatkan input dari body JSON
            $input = json_decode(file_get_contents('php://input'), true);

            // Validasi input
            if (!$input || empty($input['Student Name']) || empty($input['Subject']) || empty($input['Grade'])) {
                http_response_code(400);
                echo json_encode(['message' => 'All fields are required']);
                exit;
            }

            // Validasi duplikasi data
            $duplicate = array_filter($products, function ($product) use ($input) {
                return $product['Student Name'] === $input['Student Name'] &&
                       $product['Subject'] === $input['Subject'] &&
                       $product['Grade'] == $input['Grade'];
            });

            if (!empty($duplicate)) {
                http_response_code(409); // Konflik
                echo json_encode(['message' => 'Duplicate data not allowed']);
                exit;
            }

            // Menambahkan data baru
            $newProduct = [
                'id' => count($products) > 0 ? end($products)['id'] + 1 : 1,
                'Student Name' => $input['Student Name'],
                'Subject' => $input['Subject'],
                'Grade' => (int)$input['Grade']
            ];

            $products[] = $newProduct;
            writeData($products);
            http_response_code(201);
            echo json_encode($newProduct);
            break;

        case 'GET':
            if (isset($uri[1]) && is_numeric($uri[1])) {
                // GET by ID
                $id = (int)$uri[1];
                $product = array_filter($products, fn($p) => $p['id'] === $id);

                if (!empty($product)) {
                    echo json_encode(array_values($product)[0]); // Kirimkan produk pertama yang cocok
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Product not found']);
                }
            } else {
                // GET semua data
                echo json_encode($products);
            }
            break;

        case 'PUT':
            if (isset($uri[1]) && is_numeric($uri[1])) {
                $id = (int)$uri[1];
                $input = json_decode(file_get_contents('php://input'), true);

                // Validasi input
                if (!$input || empty($input['Student Name']) || empty($input['Subject']) || empty($input['Grade'])) {
                    http_response_code(400);
                    echo json_encode(['message' => 'All fields are required']);
                    exit;
                }

                // Cari data berdasarkan ID
                $updated = false;
                foreach ($products as &$product) {
                    if ($product['id'] === $id) {
                        $product['Student Name'] = $input['Student Name'];
                        $product['Subject'] = $input['Subject'];
                        $product['Grade'] = (int)$input['Grade'];
                        $updated = true;
                        break;
                    }
                }

                if ($updated) {
                    writeData($products); // Simpan data baru ke file JSON
                    http_response_code(200);
                    echo json_encode(['message' => 'Product updated successfully']);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Product not found']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Product ID is required']);
            }
            break;

            case 'DELETE':
                if (isset($uri[1]) && is_numeric($uri[1])) {
                    $id = (int)$uri[1];
                    $originalCount = count($products);
            
                    // Filter data untuk menghapus berdasarkan ID
                    $products = array_filter($products, fn($p) => $p['id'] !== $id);
            
                    if (count($products) < $originalCount) {
                        writeData(array_values($products)); // Tulis ulang data tanpa item yang dihapus
                        http_response_code(200);
                        echo json_encode(['message' => 'Product deleted successfully']);
                    } else {
                        http_response_code(404);
                        echo json_encode(['message' => 'Product not found']);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['message' => 'Product ID is required']);
                }
                break;
            

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
