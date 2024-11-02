-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: nonprofitgroup.mysql.database.azure.com    Database: vol-group
-- ------------------------------------------------------
-- Server version	8.0.39-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `login_id` int unsigned NOT NULL,
  `events_hosted` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`admin_id`),
  KEY `admin_login_id_foreign` (`login_id`),
  CONSTRAINT `admin_login_id_foreign` FOREIGN KEY (`login_id`) REFERENCES `login` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,3,0);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `event_id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` int unsigned NOT NULL,
  `vol_id` int unsigned NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `skills` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `urgency` char(255) NOT NULL DEFAULT 'm',
  PRIMARY KEY (`event_id`),
  KEY `event_admin_id_foreign` (`admin_id`),
  KEY `event_vol_id_foreign` (`vol_id`),
  CONSTRAINT `event_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `event_vol_id_foreign` FOREIGN KEY (`vol_id`) REFERENCES `volunteer` (`vol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (2,1,2,'Broomstick Cleanup','Organizing witches and wizards to clean up the the Quidditch field of fallen brooms','Quidditch Field','Leadership','2024-12-05','m');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `login_id` int unsigned NOT NULL AUTO_INCREMENT,
  `login_user` varchar(255) NOT NULL,
  `login_pass` varchar(255) NOT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'ron_weasley','levi_o_sa'),(2,'hairy_pot','voldemort'),(3,'admin_user','admin_pass');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer` (
  `vol_id` int unsigned NOT NULL AUTO_INCREMENT,
  `login_id` int unsigned NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zipcode` varchar(255) NOT NULL,
  `skills` varchar(255) NOT NULL,
  `preferences` text,
  `availability` varchar(255) NOT NULL,
  PRIMARY KEY (`vol_id`),
  KEY `vounteer_login_id_foreign` (`login_id`),
  CONSTRAINT `vounteer_login_id_foreign` FOREIGN KEY (`login_id`) REFERENCES `login` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer`
--

LOCK TABLES `volunteer` WRITE;
/*!40000 ALTER TABLE `volunteer` DISABLE KEYS */;
INSERT INTO `volunteer` VALUES (1,1,'Ronald Weasley','Hogwarts','Gryff Dorm M','city','UK','69420','magic','hermione','weekends'),(2,2,'Hairy Potter','Hogwarts','Gryff Dorm M','city','UK','69420','leadership','bald men','all day');
/*!40000 ALTER TABLE `volunteer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer history`
--

DROP TABLE IF EXISTS `volunteer history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer history` (
  `vol_h_id` int unsigned NOT NULL AUTO_INCREMENT,
  `vol_id` int unsigned NOT NULL,
  `events_attended` int NOT NULL DEFAULT '0',
  `events_ongoing` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`vol_h_id`),
  KEY `volunteer history_vol_id_foreign` (`vol_id`),
  CONSTRAINT `volunteer history_vol_id_foreign` FOREIGN KEY (`vol_id`) REFERENCES `volunteer` (`vol_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer history`
--

LOCK TABLES `volunteer history` WRITE;
/*!40000 ALTER TABLE `volunteer history` DISABLE KEYS */;
/*!40000 ALTER TABLE `volunteer history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'vol-group'
--

--
-- Dumping routines for database 'vol-group'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-01 14:52:15
