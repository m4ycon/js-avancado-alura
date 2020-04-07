import { ListaNegociacoes } from '../models/ListaNegociacoes';
import { Mensagem } from '../models/Mensagem';
import { Negociacao } from '../models/Negociacao';
import { NegociacoesView } from '../views/NegociacoesView';
import { MensagemView } from '../views/MensagemView';
import { NegociacaoService } from '../services/NegociacaoService';
import { DateHelper } from '../helpers/DateHelper';
import { Bind } from '../helpers/Bind';
// import {  } from '';

class NegociacaoController {

  constructor() {

    let $ = document.querySelector.bind(document);
    this._inputData = $('#data');
    this._inputQuantidade = $('#quantidade');
    this._inputValor = $('#valor');

    this._listaNegociacoes = new Bind(
      new ListaNegociacoes(),
      new NegociacoesView($('#negociacoesView')),
      'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

    this._mensagem = new Bind(
      new Mensagem(),
      new MensagemView($('#mensagemView')),
      'texto');

    this._ordemAtual = '';

    this._service = new NegociacaoService();

    // função init criada, porque é recomendado só deixar propriedades no constructor
    this._init();

  }

  _init() {

    // atualiza a lista com as negociacoes gravadas no indexedDB
    this._service
      .lista()
      .then(negociacoes =>
        negociacoes.forEach(negociacao =>
          this._listaNegociacoes.adiciona(negociacao)))
      .catch(erro => this._mensagem.texto = erro);

    // na inicialização e a cada 3 segundos, as negociações serão atualizadas
    this.importaNegociacoes();
    setInterval(() => {
      this.importaNegociacoes();
    }, 3000);

  }

  adiciona(event) {
    event.preventDefault();

    let negociacao = this._criaNegociacao();

    this._service
      .cadastra(negociacao)
      .then(mensagem => {
        this._listaNegociacoes.adiciona(negociacao);
        this._mensagem.texto = mensagem;
        this._limpaFormulario();
      })
      .catch(erro => this._mensagem.texto = erro);

  }

  apaga() {

    this._service
      .apaga()
      .then(mensagem => {
        this._mensagem.texto = mensagem;
        this._listaNegociacoes.esvazia();
      })
      .catch(erro => this._mensagem.texto = erro)

  }

  importaNegociacoes() {

    this._service
      .importa(this._listaNegociacoes.negociacoes)
      .then(negociacoes => {
        negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
      })
      .catch(erro => this._mensagem.texto = erro);
  }

  ordena(coluna) {
    if (this._ordemAtual == coluna) {
      this._listaNegociacoes.inverteOrdem();
    } else {
      this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
    }
    this._ordemAtual = coluna;
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textoParaData(this._inputData.value),
      parseInt(this._inputQuantidade.value),
      parseFloat(this._inputValor.value));
  }

  _limpaFormulario() {
    this._inputData.value = "";
    this._inputQuantidade.value = 1;
    this._inputValor.value = 0;

    this._inputData.focus();
  }
}

// Desse modo, o nosso app, só terá uma instância do controller
// ou seja, quando importarmos essa instância não estaríamos
// criando uma nova, e sim buscando uma única
let negociacaoController = new NegociacaoController();
export function currentInstance() {
  return negociacaoController;
}