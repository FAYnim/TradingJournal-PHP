<?php
$request_uri = $_SERVER['REQUEST_URI'];

// Route for API
if (strpos($request_uri, '/api/') === 0) {
    $_SERVER['PATH_INFO'] = $request_uri;
    require __DIR__ . '/api.php';
    return;
}

// Route for static files
$public_path = __DIR__ . '/public';
$path = $public_path . parse_url($request_uri, PHP_URL_PATH);

if ($path === $public_path . '/') {
    $path = $public_path . '/index.html';
}

if (file_exists($path) && is_file($path)) {
    $extension = pathinfo($path, PATHINFO_EXTENSION);
    $mime_type = '';
    switch ($extension) {
        case 'css':
            $mime_type = 'text/css';
            break;
        case 'js':
            $mime_type = 'application/javascript';
            break;
        case 'html':
            $mime_type = 'text/html';
            break;
        case 'png':
            $mime_type = 'image/png';
            break;
        case 'jpg':
        case 'jpeg':
            $mime_type = 'image/jpeg';
            break;
        default:
            $mime_type = mime_content_type($path);
            break;
    }

    header('Content-Type: ' . $mime_type);
    readfile($path);
} else {
    http_response_code(404);
    echo "404 Not Found";
}