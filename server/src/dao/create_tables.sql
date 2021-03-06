DROP TABLE IF EXISTS supertestdb.rating;
DROP TABLE IF EXISTS supertestdb.kommentar;
DROP TABLE IF EXISTS supertestdb.sak;
DROP TABLE IF EXISTS supertestdb.bruker;
DROP TABLE IF EXISTS supertestdb.kategori;

CREATE TABLE `kategori` (
 `kategori` varchar(255) NOT NULL,
 PRIMARY KEY (`kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `bruker` (
 `brukernavn` varchar(255) NOT NULL,
 `passord` varchar(255) NOT NULL,
 PRIMARY KEY (`brukernavn`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sak` (
 `sak_id` int(11) NOT NULL AUTO_INCREMENT,
 `brukernavn` varchar(255) NOT NULL,
 `overskrift` varchar(255) NOT NULL,
 `innhold` varchar(10000) NOT NULL,
 `tidspunkt` varchar(300) NOT NULL,
 `bilde` varchar(255) DEFAULT NULL,
 `kategori` varchar(255) NOT NULL,
 `viktighet` int(1) NOT NULL,
 PRIMARY KEY (`sak_id`),
 KEY `kategori` (`kategori`),
 KEY `brukernavn` (`brukernavn`),
 CONSTRAINT `sak_ibfk_1` FOREIGN KEY (`kategori`) REFERENCES `kategori` (`kategori`) ON DELETE CASCADE,
 CONSTRAINT `sak_ibfk_2` FOREIGN KEY (`brukernavn`) REFERENCES `bruker` (`brukernavn`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;

CREATE TABLE `kommentar` (
 `kommentar_id` int(11) NOT NULL AUTO_INCREMENT,
 `kommentar` varchar(500) DEFAULT NULL,
 `brukernavn` varchar(255) DEFAULT NULL,
 `sak_id` int(11) NOT NULL,
 PRIMARY KEY (`kommentar_id`),
 KEY `sak_id` (`sak_id`),
 CONSTRAINT `kommentar_ibfk_1` FOREIGN KEY (`sak_id`) REFERENCES `sak` (`sak_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;

CREATE TABLE `rating` (
 `rating` int(11) NOT NULL,
 `sak_id` int(11) NOT NULL,
 `brukernavn` varchar(255) NOT NULL,
 PRIMARY KEY (`sak_id`,`brukernavn`),
 KEY `sak_id` (`sak_id`),
 KEY `brukernavn` (`brukernavn`),
 CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`sak_id`) REFERENCES `sak` (`sak_id`) ON DELETE CASCADE,
 CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`brukernavn`) REFERENCES `bruker` (`brukernavn`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
