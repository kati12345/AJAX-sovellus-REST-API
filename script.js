
window.onload = haeXML();

function haeXML() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/", true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {

        // Latauksen aikana
        if (xmlhttp.readyState === 1) {
            document.getElementById("vaihtoehdot").innerHTML = "Wait while I'm loading...";
        }
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var xmlDoc = xmlhttp.responseXML;
            console.log(xmlDoc);
            var leffat = xmlDoc.getElementsByTagName("Name");
            var id = xmlDoc.getElementsByTagName("ID");
            var teatteri = document.getElementById("city");

            for (var i = 0; i < leffat.length; i++) {
                var option = document.createElement('option');
                option.text = leffat[i].innerHTML;
                option.value = id[i].innerHTML;
                teatteri.add(option);
            }
        }
    }

    var dates = document.getElementById("pvm"); // päivämäärien pudotuslaatikko

    var d = new Date(); // haetaan tähän aina uusin päivämäärä

    // Hae viiden seuraavan päivän päiväykset pudotuslaatikkoon
    for (var i = 0; i < 5; i++) {
        if ((d.getDate() + i) >= 10) {
            var datestring = (d.getDate() + i) + "." + (d.getMonth() + 1) + "." + d.getFullYear();
        } else {
            datestring = "0" + (d.getDate() + i) + "." + (d.getMonth() + 1) + "." + d.getFullYear()
        }
        var option = document.createElement('option'); 
        option.text = option.value = datestring;
        dates.add(option); 
    }
};

function valitseTeatteri() {
    var api = 'https://www.finnkino.fi/xml/Schedule/?area=';
    var theatre = document.getElementById("city").value;
    var date = document.getElementById("pvm").value;
    var url = api + theatre + "&" + "&dt=" + date;

    var xmlhttp = new XMLHttpRequest(); 
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
    console.log(url);

    xmlhttp.onreadystatechange = function () {

        // Latauksen aikana
        if (xmlhttp.readyState === 1) {
            document.getElementById("vaihtoehdot").innerHTML = "Wait while I'm loading...";
        }
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var xmlDoc = xmlhttp.responseXML; /
            var shows = xmlDoc.getElementsByTagName("Show"); //Etsitään documentista "Show" tagit
            var table = "<table>"; // Luodaan taulukkoa elokuville
            table += '<th>' + "" + '</th>';
            table += '<th>' + "Elokuva" + '</th>';
            table += '<th>' + "Teatteri" + '</th>';
            table += '<th>' + "Esitysaika" + '</th>';

            // Loopilla documentin läpi etsitään nimi, teatteri, kuvat and ja elokuvien esitysaika
            for (var i = 0; i < shows.length; i++) {
                var showName = shows[i].getElementsByTagName("OriginalTitle")[0].innerHTML;
                var movieTheatre = shows[i].getElementsByTagName("Theatre")[0].innerHTML;
                var image = shows[i].getElementsByTagName("Images")[0].getElementsByTagName("EventSmallImagePortrait")[0].innerHTML;
                var startTime = shows[i].getElementsByTagName("dttmShowStart")[0].innerHTML;
                var date = new Date(startTime).toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric" });

                //Lisätään haetut tiedot taulukkoon
                table += '<tr>';
                table += '<td>' + "<img src=" + image + ">" + '</td>';
                table += '<td>' + showName + '</td>';
                table += '<td>' + movieTheatre + '</td>';
                table += '<td>' + date + '</td>';
                table += '</tr>';

                document.getElementById("taulukko").innerHTML = table; // Näytetään taulukko

            }
        }
    }
    
};