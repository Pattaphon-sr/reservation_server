-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Nov 02, 2025 at 04:24 PM
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
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
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
(1, 3, 0, 0, 'room', '301', 0, 'free', '2025-11-02 13:43:01', '2025-11-02 15:15:57'),
(2, 3, 1, 0, 'room', '302', 0, 'free', '2025-11-02 13:43:01', '2025-11-02 15:16:32'),
(3, 3, 2, 0, 'corridor', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 15:22:39'),
(4, 3, 3, 0, 'stair', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 15:22:47'),
(5, 3, 4, 0, 'decoration', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 15:22:57'),
(6, 3, 5, 0, 'room', '303', 0, 'free', '2025-11-02 13:43:01', '2025-11-02 15:23:29'),
(7, 3, 6, 0, 'room', '304', 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 15:23:45'),
(8, 3, 7, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(9, 3, 0, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(10, 3, 1, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(11, 3, 2, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(12, 3, 3, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(13, 3, 4, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(14, 3, 5, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(15, 3, 6, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(16, 3, 7, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(17, 3, 0, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(18, 3, 1, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(19, 3, 2, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(20, 3, 3, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(21, 3, 4, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(22, 3, 5, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(23, 3, 6, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(24, 3, 7, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(25, 3, 0, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(26, 3, 1, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(27, 3, 2, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(28, 3, 3, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(29, 3, 4, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(30, 3, 5, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(31, 3, 6, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(32, 3, 7, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(33, 3, 0, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(34, 3, 1, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(35, 3, 2, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(36, 3, 3, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(37, 3, 4, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(38, 3, 5, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(39, 3, 6, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(40, 3, 7, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(41, 4, 0, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(42, 4, 1, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(43, 4, 2, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(44, 4, 3, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(45, 4, 4, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(46, 4, 5, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(47, 4, 6, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(48, 4, 7, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(49, 4, 0, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(50, 4, 1, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(51, 4, 2, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(52, 4, 3, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(53, 4, 4, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(54, 4, 5, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(55, 4, 6, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(56, 4, 7, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(57, 4, 0, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(58, 4, 1, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(59, 4, 2, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(60, 4, 3, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(61, 4, 4, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(62, 4, 5, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(63, 4, 6, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(64, 4, 7, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(65, 4, 0, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(66, 4, 1, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(67, 4, 2, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(68, 4, 3, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(69, 4, 4, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(70, 4, 5, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(71, 4, 6, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(72, 4, 7, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(73, 4, 0, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(74, 4, 1, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(75, 4, 2, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(76, 4, 3, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(77, 4, 4, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(78, 4, 5, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(79, 4, 6, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(80, 4, 7, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(81, 5, 0, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(82, 5, 1, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(83, 5, 2, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(84, 5, 3, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(85, 5, 4, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(86, 5, 5, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(87, 5, 6, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(88, 5, 7, 0, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(89, 5, 0, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(90, 5, 1, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(91, 5, 2, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(92, 5, 3, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(93, 5, 4, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(94, 5, 5, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(95, 5, 6, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(96, 5, 7, 1, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(97, 5, 0, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(98, 5, 1, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(99, 5, 2, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(100, 5, 3, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(101, 5, 4, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(102, 5, 5, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(103, 5, 6, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(104, 5, 7, 2, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(105, 5, 0, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(106, 5, 1, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(107, 5, 2, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(108, 5, 3, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(109, 5, 4, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(110, 5, 5, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(111, 5, 6, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(112, 5, 7, 3, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(113, 5, 0, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(114, 5, 1, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(115, 5, 2, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(116, 5, 3, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(117, 5, 4, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(118, 5, 5, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(119, 5, 6, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01'),
(120, 5, 7, 4, 'empty', NULL, 0, 'disabled', '2025-11-02 13:43:01', '2025-11-02 13:43:01');

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
(2, 1, 'S1', 1, NULL, 'pending', NULL, '2025-11-02 15:20:43', '2025-11-02 15:20:43'),
(3, 2, 'S2', 1, 3, 'reserved', NULL, '2025-10-31 15:21:26', '2025-11-02 15:22:10');

-- --------------------------------------------------------

--
-- Table structure for table `reservation_history`
--

CREATE TABLE `reservation_history` (
  `id` bigint(20) NOT NULL,
  `reservation_id` bigint(20) NOT NULL,
  `cell_id` int(11) NOT NULL,
  `slot_id` varchar(4) NOT NULL,
  `requested_by` int(11) NOT NULL,
  `approver_id` int(11) DEFAULT NULL,
  `previous_status` enum('pending','reserved','rejected') DEFAULT NULL,
  `new_status` enum('pending','reserved','rejected') NOT NULL,
  `action` enum('created','updated','approved','rejected','cancelled') NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `changed_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reservation_history`
--

INSERT INTO `reservation_history` (`id`, `reservation_id`, `cell_id`, `slot_id`, `requested_by`, `approver_id`, `previous_status`, `new_status`, `action`, `note`, `changed_by`, `created_at`) VALUES
(1, 1, 1, 'S1', 1, 3, 'pending', 'rejected', 'rejected', 'test rejected', 3, '2025-11-01 15:17:43'),
(2, 2, 1, 'S1', 1, NULL, 'pending', 'reserved', 'created', NULL, 1, '2025-11-02 15:20:43');

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
-- Indexes for table `reservation_history`
--
ALTER TABLE `reservation_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_history_reservation` (`reservation_id`),
  ADD KEY `idx_history_cell` (`cell_id`),
  ADD KEY `idx_history_slot` (`slot_id`),
  ADD KEY `idx_history_requested_by` (`requested_by`),
  ADD KEY `idx_history_changed_by` (`changed_by`),
  ADD KEY `idx_history_created_at` (`created_at`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reservation_history`
--
ALTER TABLE `reservation_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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

--
-- Constraints for table `reservation_history`
--
ALTER TABLE `reservation_history`
  ADD CONSTRAINT `fk_history_reservation` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_history_cell` FOREIGN KEY (`cell_id`) REFERENCES `cells` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_history_slot` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_requester` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_history_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
