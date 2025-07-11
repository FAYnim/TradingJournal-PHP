-- Perintah SQL untuk membuat tabel yang diperlukan untuk aplikasi Jurnal Trading.
-- Jalankan file ini di database MySQL Anda.

--
-- Struktur tabel untuk `orders`
--
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `pair` varchar(20) NOT NULL,
  `order_type` enum('Long','Short') NOT NULL,
  `entry_price` decimal(20,8) NOT NULL,
  `take_profit` decimal(20,8) NOT NULL,
  `stop_loss` decimal(20,8) NOT NULL,
  `timeframe` varchar(10) NOT NULL,
  `status` enum('Open','Selesai','Batal') NOT NULL DEFAULT 'Open',
  `final_profit_percent` decimal(10,4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Struktur tabel untuk `setup_plans`
--
CREATE TABLE `setup_plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Struktur tabel untuk `plan_conditions`
--
CREATE TABLE `plan_conditions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `condition_text` text NOT NULL,
  `is_checked` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `plan_id` (`plan_id`),
  CONSTRAINT `plan_conditions_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `setup_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
