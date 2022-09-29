const express = require("express");
const axios = require("axios");
const https = require("https");

const baseURL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });


const server = express();

const felipao = ["01", "02", "03", "06", "07", "08", "11", "12", "13", "16", "17", "18", "21", "22", "23"];
const felipin = ["02", "03", "05", "08", "09", "10", "13", "14", "15", "18", "19", "21", "23", "24", "25"];
const rodolfo = ["02", "03", "05", "07", "09", "11", "12", "13", "17", "18", "20", "22", "23", "24", "25"];
const raul    = ["01", "02", "04", "06", "07", "08", "10", "11", "14", "17", "18", "20", "22", "23", "24"];
const thiago  = ["01", "03", "04", "09", "11", "12", "13", "15", "16", "17", "18", "19", "21", "23", "24"];
const vini    = ["01", "02", "03", "04", "06", "08", "09", "10", "13", "15", "16", "17", "20", "21", "24"];
const will    = ["01", "04", "05", "08", "09", "10", "12", "13", "14", "16", "17", "20", "21", "24", "25"];

const texto = "{0}: Acertou {1} números, {2}";

server.get('/ricos/sera', async (req, res) => {
    var lotofacil = await fetchLotofacil();
    var listaDezenas = lotofacil.listaDezenas;
    return res.send(
        `Data sorteio ${lotofacil.dataApuracao}` + "<br>" +
        `Lista de Dezenas: ${listaDezenas}` + "<br>" +
        "Resultados:" + "<br>" +
        percorrerAposta(felipao, "Felipão", listaDezenas) + "<br>" +
        percorrerAposta(felipin, "Felipin", listaDezenas) + "<br>" +
        percorrerAposta(rodolfo, "Rodolfo", listaDezenas) + "<br>" +
        percorrerAposta(raul, "Raul", listaDezenas) + "<br>" +
        percorrerAposta(will, "Will", listaDezenas) + "<br>" +
        percorrerAposta(vini, "Vini", listaDezenas) + "<br>" +
        percorrerAposta(thiago, "Thiago", listaDezenas)
    )
})

const percorrerAposta = (aposta, nome, listaDezenas) => {
    var acertos = [];
    var contador = 0;
    aposta.forEach(element => {

        if (listaDezenas.includes(element)) {
            contador += 1;
            acertos.push(element);
        }        
    });
    return texto.replace("{0}", nome).replace("{1}", contador).replace("{2}", acertos);
}

const fetchLotofacil = async () => {
    const response = await axios.get(baseURL, {
        httpsAgent
    });
    return response.data;
};

server.listen(3000);