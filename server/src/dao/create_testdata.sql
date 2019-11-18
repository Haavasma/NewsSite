INSERT INTO kategori(kategori) values("Sport");
INSERT INTO kategori(kategori) values("Politikk");

INSERT INTO bruker(brukernavn, passord) values("Zanacion", "secret");

INSERT INTO sak values(1,"Zanacion", "overskrift", "dette er et innhold", "04/11/2019 @18:00", 
"https://cdn.ymaws.com/www.itsmfusa.org/resource/resmgr/images/more_images/news-3.jpg",
"Sport",
1
);
INSERT INTO sak values(2, "Zanacion", "overskrift2", "dette er et innhold2", "04/11/2019 @18:00", 
"https://cdn.ymaws.com/www.itsmfusa.org/resource/resmgr/images/more_images/news-3.jpg",
"Sport",
0
);
INSERT INTO kommentar values(DEFAULT, "bra aritkkel", "harald", 1);
INSERT INTO kommentar values(DEFAULT, "dårlig aritkkel", "harald", 1);

INSERT INTO rating values(3, 1, "Zanacion");
INSERT INTO rating values(DEFAULT, 2, 1);
