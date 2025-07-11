-- Perintah SQL untuk membuat tabel users dan memperbarui tabel yang ada.

--
-- Struktur tabel untuk `users`
--
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Memperbarui tabel `orders`
--
-- Hapus default value dari user_id
ALTER TABLE `orders` ALTER `user_id` DROP DEFAULT;
-- Tambahkan foreign key constraint
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

--
-- Memperbarui tabel `setup_plans`
--
-- Hapus default value dari user_id
ALTER TABLE `setup_plans` ALTER `user_id` DROP DEFAULT;
-- Tambahkan foreign key constraint
ALTER TABLE `setup_plans` ADD CONSTRAINT `fk_setup_plans_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
