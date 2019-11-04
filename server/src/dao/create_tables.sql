DROP TABLE IF EXISTS sak;
DROP TABLE IF EXISTS kommentar;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS rating;

CREATE TABLE `sak` (
 `sak_id` int(11) NOT NULL AUTO_INCREMENT,
 `overskrift` varchar(255) NOT NULL,
 `innhold` varchar(10000) NOT NULL,
 `tidspunkt` varchar(300) NOT NULL,
 `bilde` varchar(255) DEFAULT NULL,
 `kategori` varchar(255) NOT NULL,
 `viktighet` int(1) NOT NULL,
 PRIMARY KEY (`sak_id`),
 KEY `kategori` (`kategori`),
 CONSTRAINT `sak_ibfk_1` FOREIGN KEY (`kategori`) REFERENCES `kategori` (`kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

CREATE TABLE `kommentar` (
 `kommentar_id` int(11) NOT NULL AUTO_INCREMENT,
 `kommentar` varchar(500) DEFAULT NULL,
 `brukernavn` varchar(255) DEFAULT NULL,
 `sak_id` int(11) DEFAULT NULL,
 PRIMARY KEY (`kommentar_id`),
 KEY `sak_id` (`sak_id`),
 CONSTRAINT `kommentar_ibfk_1` FOREIGN KEY (`sak_id`) REFERENCES `sak` (`sak_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

CREATE TABLE `kategori` (
 `kategori` varchar(255) NOT NULL,
 PRIMARY KEY (`kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `rating` (
 `rating_id` int(11) NOT NULL AUTO_INCREMENT,
 `rating` int(11) NOT NULL,
 `sak_id` int(11) NOT NULL,
 PRIMARY KEY (`rating_id`),
 KEY `sak_id` (`sak_id`),
 CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`sak_id`) REFERENCES `sak` (`sak_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;






