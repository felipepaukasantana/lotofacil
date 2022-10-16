var db = require("../data/db");
const https = require("https");
const axios = require("axios");
const baseURL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });


const felipao = ["01", "02", "03", "06", "07", "08", "11", "12", "13", "16", "17", "18", "21", "22", "23"];
const felipin = ["02", "03", "05", "08", "09", "10", "13", "14", "15", "18", "19", "21", "23", "24", "25"];
const rodolfo = ["02", "03", "05", "07", "09", "11", "12", "13", "17", "18", "20", "22", "23", "24", "25"];
const raul = ["01", "02", "04", "06", "07", "08", "10", "11", "14", "17", "18", "20", "22", "23", "24"];
const thiago = ["01", "03", "04", "09", "11", "12", "13", "15", "16", "17", "18", "19", "21", "23", "24"];
const vini = ["01", "02", "03", "04", "06", "08", "09", "10", "13", "15", "16", "17", "20", "21", "24"];
const will = ["01", "04", "05", "08", "09", "10", "12", "13", "14", "16", "17", "20", "21", "24", "25"];

class ConcursoService {
    async atualizarConcursos() {
        const ConcursosDB = db.Mongoose.model('consurso', db.ConcursoSchema, 'consursos');

        var lotofacil = await this.fetchLotofacil();

        const concursos = await ConcursosDB.find({
            id: lotofacil.numero
        }).lean().exec();

        if (concursos.length > 0) {
            return;
        }

        var acertos = [];

        acertos.push(this.percorrerAposta(felipao, "Felipão", lotofacil.listaDezenas, lotofacil.listaRateioPremio));
        acertos.push(this.percorrerAposta(felipin, "Felipin", lotofacil.listaDezenas, lotofacil.listaRateioPremio));
        acertos.push(this.percorrerAposta(rodolfo, "Rodolfo", lotofacil.listaDezenas, lotofacil.listaRateioPremio));
        acertos.push(this.percorrerAposta(raul, "Raul", lotofacil.listaDezenas, lotofacil.listaRateioPremio));
        acertos.push(this.percorrerAposta(will, "Will", lotofacil.listaDezenas, lotofacil.listaRateioPremio));
        acertos.push(this.percorrerAposta(vini, "Vini", lotofacil.listaDezenas, lotofacil.listaRateioPremio));
        acertos.push(this.percorrerAposta(thiago, "Thiago", lotofacil.listaDezenas, lotofacil.listaRateioPremio));

        var concurso = new ConcursosDB({
            id: lotofacil.numero,
            data: lotofacil.dataApuracao,
            listaDezenas: lotofacil.listaDezenas,
            acertos: acertos
        });

        await concurso.save();
    }

    async fetchLotofacil() {
        var url = baseURL;
        const response = await axios.default.get(url, {
            httpsAgent
        });

        return response.data;
    };

    percorrerAposta(aposta, nome, listaDezenas, listaRateioPremio) {
        var acertos = [];
        var contador = 0;
        aposta.forEach(element => {
            if (listaDezenas.includes(element)) {
                contador += 1;
                acertos.push(element);
            }
        });

        var valorPremio = 0;
        var premiada = false;
        if (contador > 10) {
            listaRateioPremio.forEach(element => {
                if (element.faixa == 1 && contador == 15) {
                    premiada = true;
                    valorPremio = element.valorPremio;
                    return;
                }

                if (element.faixa == 2 && contador == 14) {
                    premiada = true;
                    valorPremio = element.valorPremio;
                    return;
                }

                if (element.faixa == 3 && contador == 13) {
                    premiada = true;
                    valorPremio = element.valorPremio;
                    return;
                }

                if (element.faixa == 4 && contador == 12) {
                    premiada = true;
                    valorPremio = element.valorPremio;
                    return;
                }

                if (element.faixa == 5 && contador == 11) {
                    premiada = true;
                    valorPremio = element.valorPremio;
                    return;
                }
            });
        }

        return {
            aposta: nome,
            quantidade: contador,
            numeros: acertos,
            premiada: premiada,
            valorPremio: valorPremio
        };
    }
    async atual() {
        const ConcursosDB = db.Mongoose.model('consurso', db.ConcursoSchema, 'consursos');

        const concurso = await ConcursosDB.find({}).sort({_id:-1}).limit(1).lean().exec();

        return concurso;
    }

    async dashboard() {
        const ConcursosDB = db.Mongoose.model('consurso', db.ConcursoSchema, 'consursos');

        const concursos = await ConcursosDB.find({}).lean().exec();

        var acertosFelipao = {
            nome: "Felipão",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };
        var acertosFelipin = {
            nome: "Felipin",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };
        var acertosDolfo = {
            nome: "Dolfo",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };
        var acertosRaul = {
            nome: "Raul",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };
        var acertosWill = {
            nome: "Will",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };
        var acertosVini = {
            nome: "Vini",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };
        var acertosThiago = {
            nome: "Thiago",
            somaAcertos: 0,
            somaValores: 0,
            //acertos: []
        };

        var totalPremio = 0;
        var acertos = [];
        concursos.forEach((concurso) => {
            concurso.acertos.forEach((acerto) => {
                if (acerto.aposta == "Felipão") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosFelipao.somaAcertos = acertosFelipao.somaAcertos + acerto.quantidade;
                    acertosFelipao.somaValores = acertosFelipao.somaValores + acerto.valorPremio;
                    //acertosFelipao.acertos.push(acerto);
                }

                if (acerto.aposta == "Felipin") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosFelipin.somaAcertos = acertosFelipin.somaAcertos + acerto.quantidade;
                    acertosFelipin.somaValores = acertosFelipin.somaValores + acerto.valorPremio;
                    //acertosFelipin.acertos.push(acerto);
                }

                if (acerto.aposta == "Rodolfo") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosDolfo.somaAcertos = acertosDolfo.somaAcertos + acerto.quantidade;
                    acertosDolfo.somaValores = acertosDolfo.somaValores + acerto.valorPremio;
                    //acertosDolfo.acertos.push(acerto);
                }

                if (acerto.aposta == "Raul") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosRaul.somaAcertos = acertosRaul.somaAcertos + acerto.quantidade;
                    acertosRaul.somaValores = acertosRaul.somaValores + acerto.valorPremio;
                    //acertosRaul.acertos.push(acerto);
                }

                if (acerto.aposta == "Will") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosWill.somaAcertos = acertosWill.somaAcertos + acerto.quantidade;
                    acertosWill.somaValores = acertosWill.somaValores + acerto.valorPremio;
                    //acertosWill.acertos.push(acerto);
                }

                if (acerto.aposta == "Vini") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosVini.somaAcertos = acertosVini.somaAcertos + acerto.quantidade;
                    acertosVini.somaValores = acertosVini.somaValores + acerto.valorPremio;
                    //acertosVini.acertos.push(acerto);
                }

                if (acerto.aposta == "Thiago") {
                    totalPremio = totalPremio + acerto.valorPremio;
                    acertosThiago.somaAcertos = acertosThiago.somaAcertos + acerto.quantidade;
                    acertosThiago.somaValores = acertosThiago.somaValores + acerto.valorPremio;
                    //acertosThiago.acertos.push(acerto);
                }
            })
        });
        acertos.push(acertosFelipao);
        acertos.push(acertosFelipin);
        acertos.push(acertosDolfo);
        acertos.push(acertosRaul);
        acertos.push(acertosWill);
        acertos.push(acertosVini);
        acertos.push(acertosThiago);

        var acertosOrdenados = acertos.sort((a, b) => b.somaValores - a.somaValores);
        return {
            totalPremio: totalPremio,
            acertos: acertosOrdenados
        }
    }
}

module.exports = new ConcursoService();