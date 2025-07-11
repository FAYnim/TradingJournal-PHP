-- Hapus tabel jika sudah ada (agar bisa dijalankan berulang kali tanpa error)
DROP TABLE IF EXISTS `tre_conditions`;
DROP TABLE IF EXISTS `tre_plans`;
DROP TABLE IF EXISTS `tre_orders`;
DROP TABLE IF EXISTS `tre_assets`;

-- =================================================================
-- Tabel untuk data dari assets.json
-- =================================================================
CREATE TABLE `tre_assets` (
  `name` VARCHAR(50) PRIMARY KEY,
  `amount` DECIMAL(30, 8) NOT NULL
);

-- Isi tabel `tre_assets`
INSERT INTO `tre_assets` (`name`, `amount`) VALUES
('IDR', 0),
('BTC', 0),
('DOGE', 0);


-- =================================================================
-- Tabel untuk data dari setup-plans.json
-- =================================================================
CREATE TABLE `tre_plans` (
  `id` VARCHAR(255) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL
);

CREATE TABLE `tre_conditions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `plan_id` VARCHAR(255),
  `text` TEXT,
  `checked` BOOLEAN,
  FOREIGN KEY (`plan_id`) REFERENCES `tre_plans`(`id`)
);

-- Isi tabel `tre_plans`
INSERT INTO `tre_plans` (`id`, `title`) VALUES
('plan-1750916301291', 'Buy');

-- Isi tabel `tre_conditions`
INSERT INTO `tre_conditions` (`id`, `plan_id`, `text`, `checked`) VALUES
('cond-1750916303425', 'plan-1750916301291', 'MA 50 > MA 200', 0),
('cond-1750916318840', 'plan-1750916301291', 'Berada di support', 0),
('cond-1750916328207', 'plan-1750916301291', 'RSI > 70', 0);


-- =================================================================
-- Tabel untuk data dari data-order.json
-- =================================================================
CREATE TABLE `tre_orders` (
  `id` VARCHAR(255) PRIMARY KEY,
  `pair` VARCHAR(50),
  `entry` DECIMAL(30, 8),
  `takeProfit` DECIMAL(30, 8),
  `stopLoss` DECIMAL(30, 8),
  `timeframe` VARCHAR(10),
  `duration` VARCHAR(10),
  `timestamp` DATETIME,
  `status` VARCHAR(20),
  `final_profit` FLOAT
);

-- Isi tabel `tre_orders`
INSERT INTO `tre_orders` (`id`, `pair`, `entry`, `takeProfit`, `stopLoss`, `timeframe`, `duration`, `timestamp`, `status`, `final_profit`) VALUES
('ecea33ac-2f6e-4601-85b5-18f9fe54d1a6', 'BTCIDR', 1704000000, 1699000000, 1719000000, '1H', 'Short', '2025-06-21 08:41:10', 'Selesai', 1.6911971830985917),
('cb67593-86cb-48f1-9461-4f73dc64880f', 'BTCIDR', 1700000000, 1712000000, 1673000000, '1H', 'Long', '2025-06-22 01:01:38', 'Selesai', -1.817470588235294),
('db4f7265-6e2c-4425-a48f-f09cead9b9fa', 'BTCIDR', 1671000000, 1661000000, 1703000000, '1H', 'Short', '2025-06-22 13:05:23', 'Batal', 3.2439257929383603),
('43939c4c-2bf8-42e7-a840-44e93c231536', 'BTCIDR', 1671000000, 1616000000, 1626000000, '1H', 'Short', '2025-06-22 21:43:30', 'Selesai', 3.154997007779772),
('8104e559-2346-477e-9119-44382015cebe', 'BTCIDR', 1649000000, 1667000000, 1616000000, '1H', 'Long', '2025-06-22 23:03:54', 'Selesai', 1.2073984232868404),
('9f1efc43-823f-473b-9ce7-409d7802cacc', 'DOGEIDR', 2673, 2780, 2582, '1H', 'Long', '2025-06-23 22:17:14', 'Selesai', 0.8978675645342313),
('af3ef65d-dab2-4588-9631-d9d24ad65065', 'BTCIDR', 1712000000, 1690000000, 1724000000, '1H', 'Short', '2025-06-24 03:39:16', 'Selesai', -0.6843457943925234),
('1c0cf6a4-5893-4df1-8218-6f848f383c33', 'BTCIDR', 1715000000, 1770000000, 1690000000, '1H', 'Long', '2025-06-24 12:20:04', 'Selesai', 0.8746355685131195),
('6c66b798-6706-4242-ad42-f91342e0ff2d', 'BTCIDR', 1731000000, 1721000000, 1737000000, '1H', 'Short', '2025-06-25 04:36:03', 'Selesai', -1.3330444829578278),
('af0f19bf-c9e2-4cb5-bbe8-00b8c83d74eb', 'BTCIDR', 1759500000, 1768000000, 1750000000, '1H', 'Long', '2025-06-25 13:59:09', 'Selesai', -0.31270247229326514),
('7f3ca596-1894-4e43-9783-c6e36797d2e0', 'BTCIDR', 1750000000, 1743000000, 1756000000, '1H', 'Short', '2025-06-25 22:01:52', 'Selesai', 0.11434285714285715),
('bfaf369f-36f1-4b45-8d23-ac6f19f56cec', 'BTCIDR', 1740000000, 1730000000, 1745000000, '1H', 'Short', '2025-06-27 00:30:39', 'Selesai', -0.25862068965517243),
('528bfd12-e908-4029-82bf-22942bdca3c0', 'DOGEIDR', 2598, 2656, 2563, '1H', 'Long', '2025-06-27 00:31:10', 'Selesai', 1.5011547344110854),
('0ada510f-cffe-4b24-8eaf-ab1b2ef61700', 'DOGEIDR', 2657, 2633, 2668, '1H', 'Short', '2025-06-29 05:02:03', 'Batal', -3.387278885961611),
('686cd9c88958a', 'DOGEIDR', 2726, 2800, 2689, '30m', 'Long', '2025-07-08 08:41:44', 'Open', NULL),
('686cd9dcd3159', 'BTCIDR', 11, 11, 11, '1H', 'Long', '2025-07-08 08:42:04', 'Batal', NULL),
('686cda3b2d818', 'BTCIDR', 10, 10, 10, '1H', 'Long', '2025-07-08 08:43:39', 'Batal', NULL),
('686cda4355030', 'BTCIDR', 10, 10, 10, '1H', 'Long', '2025-07-08 08:43:47', 'Batal', NULL);
