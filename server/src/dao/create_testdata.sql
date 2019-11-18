INSERT INTO TABLE kategori values("Sport")
INSERT INTO TABLE kategori values("Politikk")

INSERT INTO TABLE bruker values("Zanacion", "secret")

INSERT INTO TABLE sak values(DEFAULT,"Zanacion", "overskrift", "dette er et innhold", "04/11/2019 @18:00", 
"https://cdn.ymaws.com/www.itsmfusa.org/resource/resmgr/images/more_images/news-3.jpg",
"Sport",
1
)
INSERT INTO TABLE sak values(DEFAULT, "Zanacion", "overskrift2", "dette er et innhold2", "04/11/2019 @18:00", 
"https://cdn.ymaws.com/www.itsmfusa.org/resource/resmgr/images/more_images/news-3.jpg",
"Sport",
0
)
INSERT INTO TABLE kommentar values(DEFAULT, "bra aritkkel", "harald", 1)
INSERT INTO TABLE kommentar values(DEFAULT, "dårlig aritkkel", "harald", 2)

INSERT INTO TABLE rating values(3, 1, "Zanacion")
INSERT INTO TABLE rating values(DEFAULT, 2, 1);
