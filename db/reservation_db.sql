-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Nov 05, 2025 at 07:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reservation_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cells`
--

CREATE TABLE `cells` (
  `id` int(11) NOT NULL,
  `floor` tinyint(4) NOT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `type` enum('empty','room','corridor','stair','decoration') NOT NULL DEFAULT 'empty',
  `room_no` varchar(64) DEFAULT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `base_status` enum('free','disabled') NOT NULL DEFAULT 'disabled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cells`
--

INSERT INTO `cells` (`id`, `floor`, `x`, `y`, `type`, `room_no`, `is_hidden`, `base_status`, `created_at`, `updated_at`) VALUES
(1, 3, 0, 0, 'room', '301', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 15:59:08'),
(2, 3, 6, 0, 'room', '305', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:45:35'),
(3, 3, 0, 2, 'room', '308', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:19:22'),
(4, 3, 3, 0, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:16:43'),
(5, 3, 4, 0, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:16:42'),
(6, 3, 2, 0, 'room', '303', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:17:58'),
(7, 3, 5, 0, 'room', '304', 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:18:47'),
(10, 3, 0, 1, 'room', '307', 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:19:22'),
(11, 3, 2, 1, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:16:37'),
(12, 3, 3, 1, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:16:38'),
(13, 3, 4, 1, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:16:39'),
(14, 3, 5, 1, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:16:40'),
(15, 3, 6, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(16, 3, NULL, NULL, 'room', '317', 1, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:08:13'),
(18, 3, 1, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(19, 3, 2, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-03 16:39:43'),
(21, 3, 4, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:54:05'),
(22, 3, 5, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:15:21'),
(23, 3, 6, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(24, 3, 7, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(25, 3, 1, 0, 'room', '302', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:17:31'),
(26, 3, 1, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(27, 3, 2, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:15:35'),
(28, 3, 3, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:07:54'),
(29, 3, 4, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:15:33'),
(30, 3, 5, 3, 'stair', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:15:24'),
(31, 3, 6, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(32, 3, 7, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(33, 3, 0, 3, 'room', '309', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:36:46'),
(34, 3, 0, 4, 'room', '310', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:42:46'),
(35, 3, 1, 4, 'room', '311', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:42:46'),
(36, 3, 3, 4, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:15:30'),
(37, 3, 4, 4, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 16:15:32'),
(38, 3, 2, 4, 'room', '312', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:38:45'),
(39, 3, 5, 4, 'room', '313', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:37:28'),
(40, 3, 6, 4, 'room', '314', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:37:15'),
(41, 4, 0, 0, 'room', '401', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:18'),
(42, 4, 1, 0, 'room', '402', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:23'),
(43, 4, 2, 0, 'room', '403', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:27'),
(44, 4, 3, 0, 'room', '404', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:31'),
(45, 4, 4, 0, 'room', '405', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:36'),
(46, 4, 5, 0, 'room', '406', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:41'),
(47, 4, 6, 0, 'room', '407', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:46'),
(48, 4, 7, 0, 'room', '408', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 19:57:50'),
(49, 4, 0, 1, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:18'),
(50, 4, 1, 1, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:57'),
(51, 4, 2, 1, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:02'),
(52, 4, 3, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-05 02:46:09'),
(53, 4, 4, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(54, 4, 5, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(55, 4, 6, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(57, 4, 0, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:19'),
(58, 4, 1, 2, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:56'),
(59, 4, 2, 2, 'stair', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:04'),
(60, 4, 3, 2, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:09'),
(61, 4, 4, 2, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:55'),
(62, 4, 5, 2, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:53'),
(63, 4, 6, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(65, 4, 0, 3, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:21'),
(66, 4, 1, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:37'),
(67, 4, 2, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:00'),
(68, 4, 3, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:40'),
(69, 4, 4, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:01:39'),
(70, 4, 5, 3, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:00:13'),
(71, 4, 6, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(73, 4, 7, 1, 'room', '409', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:24:12'),
(74, 4, 7, 2, 'room', '410', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:02:26'),
(75, 4, 7, 3, 'room', '411', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:02:30'),
(76, 4, 6, 4, 'room', '413', 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:02:15'),
(77, 4, 7, 4, 'room', '412', 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:02:13'),
(78, 4, 5, 4, 'room', '414', 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:02:17'),
(79, 4, NULL, NULL, 'room', '415', 1, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:00:50'),
(80, 4, NULL, NULL, 'room', '416', 1, 'disabled', '2025-11-02 13:43:01', '2025-11-04 20:00:52'),
(81, 5, 0, 0, 'room', '501', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:00'),
(82, 5, 1, 0, 'room', '502', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:05'),
(83, 5, 2, 0, 'room', '503', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:13'),
(84, 5, 3, 0, 'room', '504', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:20'),
(85, 5, 4, 0, 'room', '505', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:24'),
(86, 5, 5, 0, 'room', '506', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:28'),
(87, 5, 6, 0, 'room', '507', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:34'),
(88, 5, 7, 0, 'room', '508', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:39'),
(89, 5, 0, 1, 'room', '509', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:45'),
(90, 5, 1, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(91, 5, 2, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(92, 5, 3, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(93, 5, 4, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(94, 5, 5, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(95, 5, 6, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(96, 5, 7, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(97, 5, 0, 2, 'room', '510', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:51'),
(98, 5, 1, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(99, 5, 2, 2, 'stair', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:59:53'),
(100, 5, 3, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:29'),
(101, 5, 4, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:51'),
(102, 5, 5, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:52'),
(103, 5, 6, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:53'),
(104, 5, 7, 2, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:54'),
(105, 5, 0, 3, 'room', '511', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:23:55'),
(106, 5, 1, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(107, 5, 2, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(108, 5, 3, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(109, 5, 4, 3, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:49'),
(110, 5, 5, 3, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:38'),
(111, 5, 6, 3, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:39'),
(112, 5, 7, 3, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:41'),
(113, 5, 0, 4, 'room', '512', 0, 'free', '2025-11-02 13:43:01', '2025-11-04 20:24:01'),
(114, 5, 1, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(115, 5, 2, 4, 'stair', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:59:54'),
(116, 5, 3, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(117, 5, 4, 4, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:48'),
(118, 5, 5, 4, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:35'),
(119, 5, 6, 4, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:34'),
(120, 5, 7, 4, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-04 19:58:33'),
(122, 3, 7, 4, 'room', '315', 0, 'free', '2025-11-04 16:08:16', '2025-11-04 19:37:07'),
(129, 3, 7, 0, 'room', '306', 0, 'disabled', '2025-11-04 16:14:44', '2025-11-04 19:45:35'),
(130, 3, 1, 1, 'empty', NULL, 0, 'disabled', '2025-11-04 16:18:45', '2025-11-04 16:18:45'),
(134, 3, 7, 1, 'empty', NULL, 0, 'disabled', '2025-11-04 16:27:20', '2025-11-04 16:27:20'),
(135, 4, 2, 4, 'stair', NULL, 0, 'disabled', '2025-11-04 20:00:40', '2025-11-04 20:00:58'),
(136, 4, 3, 4, 'empty', NULL, 0, 'disabled', '2025-11-04 20:00:43', '2025-11-04 20:00:43'),
(137, 4, 4, 4, 'empty', NULL, 0, 'disabled', '2025-11-04 20:00:45', '2025-11-04 20:00:45'),
(141, 4, 0, 4, 'decoration', NULL, 0, 'disabled', '2025-11-04 20:01:29', '2025-11-04 20:01:33'),
(142, 4, 1, 4, 'corridor', NULL, 0, 'disabled', '2025-11-04 20:01:31', '2025-11-04 20:01:35'),
(143, 3, 3, 2, 'decoration', NULL, 0, 'disabled', '2025-11-04 20:08:13', '2025-11-04 20:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` bigint(20) NOT NULL,
  `cell_id` int(11) NOT NULL,
  `slot_id` varchar(4) NOT NULL,
  `requested_by` int(11) NOT NULL,
  `approver_id` int(11) DEFAULT NULL,
  `status` enum('pending','reserved','rejected') NOT NULL DEFAULT 'pending',
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `cell_id`, `slot_id`, `requested_by`, `approver_id`, `status`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 'S1', 1, 3, 'rejected', 'test rejected', '2025-11-01 15:17:43', '2025-11-02 15:19:31'),
(2, 1, 'S1', 1, NULL, 'pending', NULL, '2025-11-03 15:20:43', '2025-11-03 15:20:43'),
(3, 2, 'S2', 1, 3, 'reserved', NULL, '2025-10-31 15:21:26', '2025-11-02 15:22:10'),
(5, 2, 'S1', 1, NULL, 'pending', NULL, '2025-11-04 19:20:47', '2025-11-04 19:30:47');

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` varchar(4) NOT NULL,
  `label` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`id`, `label`) VALUES
('S1', '08:00-10:00'),
('S2', '10:00-12:00'),
('S3', '13:00-15:00'),
('S4', '15:00-17:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','staff','approver') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'lisa@gmail.com', 'Lisa', '$argon2id$v=19$m=19456,t=2,p=1$R7ZGdkHg/Qiv3FhArKLvGQ$ai/QTh1eSI8poDzjktHhH3S+7NbZQ5ZUUZ425226xS0', 'user', '2025-11-02 13:54:06', '2025-11-02 13:54:06'),
(2, 'staff@gmail.com', 'Adbird', '$argon2id$v=19$m=19456,t=2,p=1$n7BgWAoeMPH31oign/3DMw$vVqncSecZ26k8t8tsJbqsNudguhMZN4Ug9BFYzK7Djs', 'staff', '2025-11-02 13:56:10', '2025-11-02 13:56:10'),
(3, 'approver@gmail.com', 'AdPingPong', '$argon2id$v=19$m=19456,t=2,p=1$ASN94L8l9kgeTWR5wEeMzA$Qeht4VUSkHHsutLSsjzBWm+QBCqr8+OoAUkpDN3js5I', 'approver', '2025-11-02 13:58:01', '2025-11-02 13:58:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cells`
--
ALTER TABLE `cells`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cells_floor_xy` (`floor`,`x`,`y`),
  ADD KEY `idx_cells_room_no` (`room_no`),
  ADD KEY `idx_cells_hidden` (`is_hidden`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_res_slot` (`slot_id`),
  ADD KEY `idx_res_cell_slot_status` (`cell_id`,`slot_id`,`status`),
  ADD KEY `idx_res_requested_by` (`requested_by`),
  ADD KEY `idx_res_approver_id` (`approver_id`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD UNIQUE KEY `uq_users_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cells`
--
ALTER TABLE `cells`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_res_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_res_cell` FOREIGN KEY (`cell_id`) REFERENCES `cells` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_res_requester` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_res_slot` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
