//file json
var serverData;
function tabellaCodice() {
  var righe = "";
  $.each(serverData["_embedded"]["employees"], function (key, value) {
    righe = righe + "<tr>";
    righe = righe + "<th>" + value.id + "</th>";
    righe = righe + "<td id = 'firstname-" + value.id + "'>" + value.first_name + "</td>";
    righe = righe + "<td id = 'lastname-" + value.id + "'>" + value.last_name + "</td>";
    righe = righe + "<td id = 'gender-" + value.id + "'>" + value.gender + "</td>";
    righe = righe + "<td>" + "<input type='button' class='btn btn-outline-warning' onclick = 'impostaModal(" + value.id + ")' value='MODIFICA' data-bs-toggle='modal' data-bs-target='#exampleModal1' data-bs-whatever='@mdo' >";
    righe = righe + "<input type='button' class='btn btn-danger ms-3' value='RIMUOVI' onclick='elimina(" + value.id + ")' id='" + value.id + "'>";
    righe = righe + "</tr>";
  });
  $("#tbody").html(righe);

}

$(document).ready(function () {
  leggiDalServer("http://localhost:8080/backEnd/index.php");

  $('#btn').click(function () {

    var fName = $("#name").val();
    var lName = $("#lastname").val();
    var sesso = $("#gender").val();
    var json = { first_name: fName, last_name: lName, gender: sesso };

    $('#name').val('');
    $('#lastname').val('');
    //aggiungi 
    $.ajax({
      method: "POST",
      url: "http://localhost:8080/backEnd/index.php",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(json)

    })
      .done(function (msg) {
        leggiDalServer("http://localhost:8080/backEnd/index.php?page=" + serverData.page.number + "&size=20");
      });

  });

});

function leggiDalServer(url) {
  $.get(url, function (msg) {
    //console.log(msg["_embedded"]["employees"]);
    serverData = msg;
    tabellaCodice();

  });
}

function elimina(id) {

  $.ajax({
    url: "http://localhost:8080/backEnd/index.php?id=" + id,
    type: 'DELETE',
    success: function (result) {
      $("#" + id).closest("tr").remove();
    }
  });
}

function linkA() {
  $.get(serverData["_links"]["next"]["href"], function (msg) {
    serverData = msg;
    tabellaCodice();
    aggiornaNumPagina(msg.pages.number);

  });
};

function linkI() {
  $.get(serverData["_links"]["prev"]["href"], function (msg) {
    serverData = msg;
    tabellaCodice();
    aggiornaNumPagina(msg.pages.number);

  });
};

function linkF() {
  $.get(serverData["_links"]["first"]["href"], function (msg) {
    serverData = msg;
    tabellaCodice();
    aggiornaNumPagina(msg.pages.number);

  });
};

function linkL() {
  $.get(serverData["_links"]["last"]["href"], function (msg) {
    serverData = msg;
    tabellaCodice();
    aggiornaNumPagina(msg.pages.number);

  });
};

function aggiornaNumPagina(n) { 
  
  $("#Pcorrente").text(n);

}


function impostaModal(id) {
  $("#idM").text(id);
  $("#nameM").prop("placeholder", $("#firstname-" + id).text());
  $("#lastnameM").prop("placeholder", $("#lastname-" + id).text());
  $("#genderM").val($("#gender-" + id).text());

}

function salvaDati() {

  let id = $("#idM").text();

  let FName = $("#nameM").val().trim();
  let LName = $("#lastnameM").val().trim();
  let sessoM = $("#genderM").val();
  let assunzioneM = null;
  let compleM = null;

  if (FName == "") {
    FName = $("#firstname-" + id).text();

  }
  if (LName == "") {
    LName = $("#lastname-" + id).text();

  }

  let data = { first_name: FName, birthDate: compleM, hireDate: assunzioneM, last_name: LName, gender: sessoM };

  $.ajax({
    method: "PUT",
    url: "http://localhost:8080/backEnd/index.php?id=" + id,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(data),
    
  })
    .done(function (msg) {
      leggiDalServer("http://localhost:8080/backEnd/index.php?page=" + serverData.pages.number + "&size=20");
      $('#nameM').val('');
      $('#lastnameM').val('');
      $("#genderM").val("M");
    });

}


