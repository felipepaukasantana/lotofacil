var express = require('express');
var db = require("../data/db");
const axios = require("axios");
const https = require("https");
const baseURL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
var consursoService = require("../services/concurso-service");
var router = express.Router();

router.get('/', async function (req, res, next) {
  const Concursos = db.Mongoose.model('consurso', db.ConcursoSchema, 'consursos');

  const docs = await Concursos.find({}).lean().exec();

  res.send(docs);
});

router.get('/atualizar', async function (req, res, next) { 
  await consursoService.atualizarConcursos();
  res.send(true);
});

router.get('/dashboard', async function (req, res, next) { 
  var retorno = await consursoService.dashboard();
  res.send(retorno);
});

router.get('/atual', async function (req, res, next) { 
  var retorno = await consursoService.atual();
  res.send(retorno);
});


module.exports = router;
