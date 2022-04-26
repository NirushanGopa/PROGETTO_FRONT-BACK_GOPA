<?php
    $method = $_SERVER['REQUEST_METHOD'];
    header('Content-Type: application/json');
    require("db.php");

    $inviaJason = array ();

    $inviaJason['_embedded'] = array(
        "employees" => array()
    );

    $id = @$_GET["id"] ?? 0;
    $pagina = @$_GET["page"] ?? 0;
    $lunghezzaPagina = @$_GET["size"] ?? 20;

    $q= "SELECT count(*) FROM employees";
    $result = $mysqli-> query($q);
    $row = $result-> fetch_row();
    $totPagine = $row[0];

    $ultimaPagina = ceil($totPagine/$lunghezzaPagina) -1;
    
    $url = "http://localhost:8080/backEnd/index.php";

    function href($url, $pagina, $lunghezzaPagina){
        return $url . "?page=" . $pagina . "&size=" . $lunghezzaPagina;
    }

    function impaginazione($pagina, $lunghezzaPagina, $ultimaPagina, $url){
        $links = array(
            "first" => array ( "href" => href($url, 0, $lunghezzaPagina)),
            "self" => array ( "href" => href($url, $pagina, $lunghezzaPagina), "templated" => true),
            "last" => array ( "href" => href($url, $ultimaPagina, $lunghezzaPagina))
        );
        
        if($pagina > 0){
            $links["prev"] = array( "href" => href($url, $pagina - 1, $lunghezzaPagina));
        }
        
        if($pagina < $ultimaPagina){
            $links["next"] = array ( "href" => href($url, $pagina + 1, $lunghezzaPagina));
        }
        
        return $links;
    }

    $inviaJason['_links'] = impaginazione($pagina, $lunghezzaPagina, $ultimaPagina, $url);

    $inviaJason['pages'] = array (
        "size" => $lunghezzaPagina,
        "totalElements" => $totPagine,
        "totalPages" => $ultimaPagina,
        "number" => $pagina
    );

    switch($method){

        case 'GET':
            $inviaJason['_embedded']['employees'] = GET($pagina*$lunghezzaPagina, $lunghezzaPagina);
            echo json_encode($inviaJason);
            break;

        case 'POST':
            $ricevi = json_decode(file_get_contents('php://input'), true);
            POST($ricevi["first_name"], $ricevi["last_name"], $ricevi["gender"]);

            echo json_encode($ricevi);
            break;

        case 'PUT':
            $ricevi = json_decode(file_get_contents('php://input'), true);
            PUT($ricevi["first_name"], $ricevi["last_name"], $ricevi["gender"], $id);

            echo json_encode($ricevi);
            break;

        case 'DELETE':
            DELETE($id);
            
            echo json_encode($inviaJason);
            break;
        
        default:
            header("HTTP/1.1 400 BAD REQUEST");
            break;
    }

    function GET($first, $lenght){
        require("db.php");
        $q = "SELECT * FROM employees ORDER BY id LIMIT $first, $lenght";
        $rows = array();

        if($result = $mysqli-> query($q)){
            while($row = $result-> fetch_assoc()){
                $rows[] = $row;
            }
        }

        return $rows;
    }

    function POST($nome, $cognome, $sesso){
        require("db.php");
        $q = "INSERT INTO employees (first_name, last_name, gender) VALUES ('$nome', '$cognome', '$sesso')";
        $result = $mysqli-> query($q);
    }

    function PUT($nome, $cognome, $sesso, $id)
    {
        require("db.php");
        $q = "UPDATE employees SET first_name = '$nome', gender = '$sesso', last_name = '$cognome' WHERE id = '$id'";
        $result = $mysqli-> query($q); 
    }

    function DELETE($id){
        require("db.php");
        $q = "DELETE FROM employees WHERE id = $id";
        $result = $mysqli-> query($q);
    }

?>