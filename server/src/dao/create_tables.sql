DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS kommentar;
DROP TABLE IF EXISTS sak;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS bruker;

CREATE TABLE `bruker` (
 `brukernavn` varchar(255) NOT NULL,
 `passord` varchar(255) DEFAULT NULL,
 PRIMARY KEY (`brukernavn`),
 UNIQUE KEY `brukernavn` (`brukernavn`),
 UNIQUE KEY `brukernavn_2` (`brukernavn`),
 UNIQUE KEY `brukernavn_3` (`brukernavn`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `kategori` (
 `kategori` varchar(255) NOT NULL,
 PRIMARY KEY (`kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sak` (
 `sak_id` int(11) NOT NULL AUTO_INCREMENT,
 `brukernavn` varchar(255) DEFAULT NULL,
 `overskrift` varchar(255) NOT NULL,
 `innhold` varchar(10000) NOT NULL,
 `tidspunkt` varchar(300) NOT NULL,
 `bilde` varchar(255) DEFAULT NULL,
 `kategori` varchar(255) NOT NULL,
 `viktighet` int(1) NOT NULL,
 PRIMARY KEY (`sak_id`),
 KEY `kategori` (`kategori`),
 KEY `brukernavn` (`brukernavn`),
 CONSTRAINT `sak_ibfk_1` FOREIGN KEY (`kategori`) REFERENCES `kategori` (`kategori`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `sak_ibfk_2` FOREIGN KEY (`brukernavn`) REFERENCES `bruker` (`brukernavn`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

CREATE TABLE `kommentar` (
 `kommentar_id` int(11) NOT NULL AUTO_INCREMENT,
 `kommentar` varchar(500) DEFAULT NULL,
 `brukernavn` varchar(255) DEFAULT NULL,
 `sak_id` int(11) DEFAULT NULL,
 PRIMARY KEY (`kommentar_id`),
 KEY `sak_id` (`sak_id`),
 CONSTRAINT `kommentar_ibfk_1` FOREIGN KEY (`sak_id`) REFERENCES `sak` (`sak_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;


CREATE TABLE `rating` (
 `rating` int(11) NOT NULL,
 `sak_id` int(11) NOT NULL,
 `brukernavn` varchar(255) NOT NULL,
 PRIMARY KEY (`sak_id`,`brukernavn`),
 KEY `sak_id` (`sak_id`),
 KEY `brukernavn` (`brukernavn`),
 CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`sak_id`) REFERENCES `sak` (`sak_id`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`brukernavn`) REFERENCES `bruker` (`brukernavn`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;






