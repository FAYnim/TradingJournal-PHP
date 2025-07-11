<?php

/**
 * Class Database
 *
 * Menangani koneksi database dan operasi query menggunakan ekstensi MySQLi.
 * Menggunakan prepared statements untuk mencegah SQL injection.
 */
class Database
{
    private $host = 'localhost';
    private $dbname = 'fayd7716_project';
    private $user = 'fayd7716_project';
    private $pass = '#8C9yGOGHp-}3&.&';

    private $mysqli;
    private $error;

    /**
     * Konstruktor untuk membuat koneksi database MySQLi.
     */
    public function __construct($host = null, $dbname = null, $user = null, $pass = null)
    {
        if ($host) $this->host = $host;
        if ($dbname) $this->dbname = $dbname;
        if ($user) $this->user = $user;
        if ($pass) $this->pass = $pass;

        // Buat koneksi MySQLi
        $this->mysqli = new mysqli($this->host, $this->user, $this->pass, $this->dbname);

        // Periksa koneksi
        if ($this->mysqli->connect_errno) {
            $this->error = "Gagal terhubung ke MySQL: " . $this->mysqli->connect_error;
            throw new Exception($this->error);
        }

        // Set charset
        $this->mysqli->set_charset("utf8mb4");
    }

    /**
     * Helper untuk menginferensi tipe parameter untuk mysqli_stmt_bind_param.
     * @param array $params Array parameter.
     * @return string String tipe (e.g., 's', 'i', 'd', 'b').
     */
    private function getParamTypes($params)
    {
        $types = '';
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i'; // integer
            } elseif (is_float($param)) {
                $types .= 'd'; // double
            } elseif (is_string($param)) {
                $types .= 's'; // string
            } else {
                $types .= 's'; // default ke string
            }
        }
        return $types;
    }

    /**
     * Menjalankan query SELECT untuk mendapatkan satu baris data.
     * (Sebelumnya: selectOne)
     *
     * @param string $sql    Query SQL dengan placeholder (e.g., "SELECT * FROM users WHERE id = ?").
     * @param array  $params Array dari parameter untuk di-bind ke query.
     * @return mixed         Mengembalikan satu baris data sebagai associative array, atau null jika tidak ditemukan.
     */
    public function db_bind($sql, $params = [])
    {
        try {
            $stmt = $this->mysqli->prepare($sql);
            if (!$stmt) {
                $this->error = "Prepare failed: (" . $this->mysqli->errno . ") " . $this->mysqli->error;
                return null;
            }

            if (!empty($params)) {
                $types = $this->getParamTypes($params);
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result ? $result->fetch_assoc() : null;
            $stmt->close();
            return $row;
        } catch (Exception $e) {
            $this->error = $e->getMessage();
            return null;
        }
    }

    /**
     * Menjalankan query SELECT untuk mendapatkan banyak baris data.
     * (Sebelumnya: selectAll)
     *
     * @param string $sql    Query SQL dengan placeholder (e.g., "SELECT * FROM users WHERE status = ?").
     * @param array  $params Array dari parameter untuk di-bind ke query.
     * @return array         Mengembalikan array dari semua baris data yang cocok.
     */
    public function db_fetch($sql, $params = [])
    {
        try {
            $stmt = $this->mysqli->prepare($sql);
            if (!$stmt) {
                $this->error = "Prepare failed: (" . $this->mysqli->errno . ") " . $this->mysqli->error;
                return [];
            }

            if (!empty($params)) {
                $types = $this->getParamTypes($params);
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
            $stmt->close();
            return $rows;
        } catch (Exception $e) {
            $this->error = $e->getMessage();
            return [];
        }
    }

    /**
     * Menjalankan query non-SELECT (INSERT, UPDATE, DELETE, etc.).
     * (Sebelumnya: execute)
     *
     * @param string $sql    Query SQL dengan placeholder (e.g., "INSERT INTO users (nama, email) VALUES (?, ?)")
     * @param array  $params Array dari parameter untuk di-bind ke query.
     * @return mixed         Mengembalikan ID baris terakhir yang di-insert untuk query INSERT,
     *                       atau jumlah baris yang terpengaruh untuk query UPDATE/DELETE.
     *                       Mengembalikan false jika terjadi error.
     */
    public function db_query($sql, $params = [])
    {
        try {
            $stmt = $this->mysqli->prepare($sql);
            if (!$stmt) {
                $this->error = "Prepare failed: (" . $this->mysqli->errno . ") " . $this->mysqli->error;
                return false;
            }

            if (!empty($params)) {
                $types = $this->getParamTypes($params);
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();

            // Periksa apakah ini query INSERT untuk mengembalikan ID terakhir.
            if (stripos(trim($sql), 'INSERT') === 0) {
                $lastId = $stmt->insert_id;
                $stmt->close();
                return $lastId;
            }

            // Untuk UPDATE, DELETE, dll., kembalikan jumlah baris yang terpengaruh.
            $affectedRows = $stmt->affected_rows;
            $stmt->close();
            return $affectedRows;
        } catch (Exception $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }
    
    /**
     * Mengambil pesan error terakhir.
     *
     * @return string Pesan error.
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * Menutup koneksi database.
     */
    public function __destruct()
    {
        if ($this->mysqli) {
            $this->mysqli->close();
        }
    }
}

/*
|--------------------------------------------------------------------------
| CONTOH PENGGUNAAN SEDERHANA
|--------------------------------------------------------------------------

// 1. Membuat koneksi database:
// Ganti dengan kredensial database Anda
// $db = new Database('localhost', 'nama_db', 'user_db', 'pass_db');

// 2. Contoh SELECT satu data (db_bind):
// $user = $db->db_bind("SELECT * FROM users WHERE id = ?", [1]);
// Jika data ditemukan, $user akan berisi associative array dari baris data tersebut.
// Contoh: $user = ['id' => 1, 'nama' => 'John Doe', 'email' => 'john@example.com'];
// Jika tidak ditemukan atau terjadi error, $user akan bernilai null.

// 3. Contoh SELECT banyak data (db_fetch):
// $users = $db->db_fetch("SELECT * FROM users WHERE status = ?", ['aktif']);
// Jika data ditemukan, $users akan berisi array dari associative array.
// Contoh: $users = [['id' => 1, ...], ['id' => 2, ...]];
// Jika tidak ditemukan atau terjadi error, $users akan bernilai array kosong ([]).

// 4. Contoh INSERT/UPDATE/DELETE (db_query):
// $affectedRows = $db->db_query("UPDATE users SET nama = ? WHERE id = ?", ['Jane Doe', 1]);
// Untuk INSERT, akan mengembalikan ID terakhir yang di-insert.
// Untuk UPDATE/DELETE, akan mengembalikan jumlah baris yang terpengaruh.
Jika terjadi error, akan mengembalikan false.

*/
