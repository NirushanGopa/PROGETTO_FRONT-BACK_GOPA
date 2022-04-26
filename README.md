# PROGETTO_FRONT-BACK_GOPA

Per avviare il progetto basterà semplicemente seguire questi passaggi:

    --> installare docker(https://www.docker.com/products/docker-desktop/)

successivamente avviare il server con docker 

    --> docker run -d -p 8080:80 --name my-apache-php-app -v percorso:/var/www/html zener79/php:7.4-apache

successivamente avviare mysql-server mettendo il percorso deL PROGETTO e un percorso per i dati contenuti nella cartella DUMP 

    
    docker run --name my-mysql-server -v percorso_progetto/mysqldata:/var/lib/mysql -v percorso_dati/dump:/dump -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest
    
dopodichè avviare una BASH per importare il dump

    docker exec -it my-mysql-server bash
    
infine IMPORTARE il dump 

    mysql -u root -p < /dump/create_employee.sql; exit;
    
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

METODI UTILIZZATI NEL BACKEND 

GET --> mostra dipendente
POST --> aggiunge dipendente
PUT --> modifica dipendente
DELETE --> elimina dipendente


