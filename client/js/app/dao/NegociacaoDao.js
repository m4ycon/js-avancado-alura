'use strict';

System.register(['../models/Negociacao'], function (_export, _context) {
  "use strict";

  var Negociacao, _createClass, NegociacaoDao;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_modelsNegociacao) {
      Negociacao = _modelsNegociacao.Negociacao;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('NegociacaoDao', NegociacaoDao = function () {
        function NegociacaoDao(connection) {
          _classCallCheck(this, NegociacaoDao);

          this._connection = connection;
          this._store = 'negociacoes';
        }

        _createClass(NegociacaoDao, [{
          key: 'adiciona',
          value: function adiciona(negociacao) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              var request = _this._connection
              // esses dois fazem a conexão com a lista/store do banco de dados
              .transaction([_this._store], 'readwrite').objectStore(_this._store)
              // adiciona a negociação na objectStore
              .add(negociacao);

              // MÉTODO ABORT
              // podemos abortar uma transação com o .abort
              // transaction.abort();
              // transaction.onabort = e => {
              //   console.log(e);
              //   console.log('Transação abortada');
              // };

              request.onsuccess = function (e) {
                return resolve();
              };

              request.onerror = function (e) {
                console.log(e.target.error);
                reject('Não foi possível adicionar a negociação');
              };
            });
          }
        }, {
          key: 'listaTodos',
          value: function listaTodos() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
              var cursor = _this2._connection.transaction([_this2._store], 'readwrite').objectStore(_this2._store).openCursor();

              var negociacoes = [];

              // é chamado de acordo com o número de itens na lista/store
              cursor.onsuccess = function (e) {
                // te dá um item para o qual está "apontando" (aponta para o primeiro item)
                var atual = e.target.result;

                if (atual) {
                  // se há um ponteiro válido

                  var dado = atual.value; // os dados do item

                  negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                  atual.continue(); // pula para o próximo item da lista
                } else {
                  // devolve todas as negociações que estavam na lista
                  resolve(negociacoes);
                }
              };

              cursor.onerror = function (e) {
                console.log(e.target.error.name);
                reject('Não foi possível listar as negociações');
              };
            });
          }
        }, {
          key: 'apagaTodos',
          value: function apagaTodos() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
              var request = _this3._connection.transaction([_this3._store], 'readwrite').objectStore(_this3._store).clear(); // limpa a store

              request.onsuccess = function (e) {
                return resolve('Negociações apagadas com sucesso');
              };

              request.onerror = function (e) {
                console.log(e.target.error);
                reject('Não foi possível apagar as negociações');
              };
            });
          }
        }]);

        return NegociacaoDao;
      }());

      _export('NegociacaoDao', NegociacaoDao);
    }
  };
});
//# sourceMappingURL=NegociacaoDao.js.map