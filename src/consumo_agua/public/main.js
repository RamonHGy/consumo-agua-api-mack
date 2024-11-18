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

document.querySelector("#formRegister").addEventListener("submit", registerConsumption);
document.querySelector("#formConsult").addEventListener("submit", consultConsumption);
document.querySelector("#formAlert").addEventListener("submit", alertConsumption );


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
        const responseElement = document.getElementById('response')
        if(status === 200 || status === 201){
            console.log("Dados enviados", user)
            responseElement.innerHTML = "Registrado com sucesso";
            responseElement.style.display = "block"
            clear();

            setTimeout(() => {
                responseElement.style.display = "none";
            }, 3000);
        }else{
            alert('Ocorreu um erro: ' + status);
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

    if (data && data.length){
        data.forEach(element => {
            const createDiv = document.createElement('div');
            createDiv.innerHTML = `<article>
            <p>Código do suário: ${element.userId}</p>
            <p>Data: ${new Date(element.date).toLocaleDateString()}</p>
            <p>Consumo: ${element.consumption} (m³)</p>
            <hr></article>`;
            responseElement.appendChild(createDiv);
            responseElement.style.display = "flex"
            setTimeout(() => {
                responseElement.style.display = "none";
            }, 20000);
        });
        
        }else{
        responseElement.innerHTML = '<p>Nenhum consumo encontrado no intervalo</p>';
        responseElement.style.display = "block"; 
        setTimeout(() => { 
            responseElement.style.display = "none"; 
        }, 4000);
    }
}

async function alertConsumption(event) {
    event.preventDefault();
    const userId = document.getElementById('id-user-alert').value;
    console.log(event);
    const url = (`${URL_BASE}/consumo-agua/alert/${userId}`);

    callAPI(url, "GET", function(status, response){
        if(status === 200 || status === 201){
            console.log(response);
            showAlert(response)
            clear()
        }else{
            console.error("Erro ao buscar", status)
        }
    });
}

function showAlert(user){
    const alertMessage = document.getElementById('alert-message-consum');
    alertMessage.innerHTML = '';

    if(user.alerts.message){
        alertMessage.style.display = 'block'
        alertMessage.innerHTML = `<p>${user.alerts.message}</p>`
    }else{
        alertMessage.style.display = 'block'
        alertMessage.innerHTML = `<p>Consumo dentro dos limites</p>`
    }
}

function clear() {
    document.getElementById('id-user').value = "";
    document.getElementById('water-consum').value = "";
    document.getElementById('date-consum').value = "";
    document.getElementById('start-date').value = "";
    document.getElementById('end-date').value = "";
    document.getElementById('id-user-consum').value = "";
    document.getElementById('id-user-alert').value = ""
}

// Seleciona os elementos de formulário
const formCadastro = document.getElementById('formCadastro');
const formConsumption = document.getElementById('formConsumption');
const formAlerta = document.getElementById('formAlerta');

// Seleciona os links do menu
const linkRegister = document.getElementById('linkRegister');
const linkConsult = document.getElementById('linkConsult');
const linkAlert = document.getElementById('linkAlert');

// Função para mostrar o formulário de cadastro e esconder os outros
linkRegister.addEventListener('click', () => {
    formCadastro.style.display = 'block';
    formConsumption.style.display = 'none';
    formAlerta.style.display = 'none';
});

// Função para mostrar o formulário de consulta e esconder os outros
linkConsult.addEventListener('click', () => {
    formCadastro.style.display = 'none';
    formConsumption.style.display = 'block';
    formAlerta.style.display = 'none';
});

// Função para mostrar o formulário de alerta e esconder os outros
linkAlert.addEventListener('click', () => {
    formCadastro.style.display = 'none';
    formConsumption.style.display = 'none';
    formAlerta.style.display = 'block';
});

// Caso a página seja carregada, exibe o formulário de cadastro como padrão
document.addEventListener('DOMContentLoaded', () => {
    formCadastro.style.display = 'block'; // Exibe o cadastro inicialmente
    formConsumption.style.display = 'none'; // Esconde consulta
    formAlerta.style.display = 'none'; // Esconde alerta
});

