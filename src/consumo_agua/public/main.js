const URL_BASE = "http://localhost:3002"

function callAPI(url, method, callback, data) {
    const options = {
        method: method,
        headers: {}
    };

    if (method === 'POST') {
        options.headers["Content-Type"] = "application/json;charset=UTF-8";
        options.body = JSON.stringify(data);
    }

    fetch(url, options)
        .then(response => response.json().then(json => ({
            status: response.status,
            json: json.resultado || json
        })))
        .then(({ status, json }) => callback(status, json))
        .catch(error => console.error('Error:', error));
}

document.querySelector("#formCadastrar").addEventListener("submit", registerConsumption)
document.querySelector("#formConsult").addEventListener("submit", consultConsumption)


async function registerConsumption(event) {
    event.preventDefault();
    const user = {
        userId: document.getElementById('id-user').value,
        consumption: document.getElementById('water-consum').value,
        date: new Date(document.getElementById('date-consum').value)
    }

    const url = URL_BASE + "/consumo-agua";

    callAPI(url, "POST", function(status, response){
        console.log('Resposta da API:', response);
        if(status === 200 || status === 201){
            console.log("Dados enviados", user)
            document.getElementById('response').innerHTML = "Registrado com sucesso";
            clear()
        }else{
            alert('Ocorreu um erro: ' + status)
        }
    }, user);
}

async function consultConsumption(event){
    event.preventDefault();
    const userId = document.getElementById('id-user-consum').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    console.log(`Consultando consumo para o usuário ${userId}, de ${startDate} até ${endDate}`);

    const url = `${URL_BASE}/consumo-agua/${userId}/${startDate}/${endDate}`;

    callAPI(url, "GET", function(status, response) {
        console.log("Resposta API:", response)
        if (status === 200 || status === 201) {
            console.log("Dados recebidos: ", response);
            consumptionHistory(response);
            clear();
        }else{
            console.error("Erro ao buscar dados", status);
        }
    });
}

function consumptionHistory(data){
    const responseElement = document.getElementById('response-consum');
    responseElement.innerHTML = '';

    if (data && data.length >= 2){
        data.forEach(element => {
            const createDiv = document.createElement('div');
            createDiv.innerHTML = `
            <p>Data: ${new Date(element.date).toLocaleDateString()}</p>
            <p>Consumo: ${element.consumption} (m³)</p>
            <hr>`;
            responseElement.appendChild(createDiv);
        });
    }else if(data && data.length < 2){
        responseElement.innerHTML = '<p>Consumos insuficiente</p>';
    }else{
        responseElement.innerHTML = '<p>Nenhum consumo encontrado no intervalo</p>';
    }
}


// function showUser(user){
//     var artc = "<article>";

//     artc += "<h1>" + user.userId + "</h1>";
//     artc += "<p>" + "Consumo: " + user.consumption + "</p>"
//     artc += "<p>" + "Data: " + new Date(user.date).toLocaleDateString() + "</p>"
//     artc += "</article>";  

//     return artc;
// }

function clear() {
    document.getElementById('id-user').value = "";
    document.getElementById('water-consum').value = "";
    document.getElementById('date-consum').value = "";
    document.getElementById('start-date').value = "";
    document.getElementById('end-date').value = "";
    document.getElementById('id-user-consum').value = "";
}