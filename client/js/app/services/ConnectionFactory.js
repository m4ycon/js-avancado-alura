'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConnectionFactory = function () {
  // module pattern, as variáveis daqui de dentro não podem ser acessadas, 
  // porem a classe sim, como ela está sendo retornada
  // esse function () {} seria uma função anônima, adaptamos ao js com a função auto-invocada

  // variáveis "globais" para fácil manutenção
  var stores = ['negociacoes'];
  var version = 4;
  var dbName = 'aluraframe';

  // restringindo a criação de novas conexões
  var connection = null;

  // variável que irá receber o connection.close();
  var close = null;

  return function () {
    function ConnectionFactory() {
      _classCallCheck(this, ConnectionFactory);

      throw new Error('Não é possível criar instâncias de ConnectionFactory');
    }

    _createClass(ConnectionFactory, null, [{
      key: 'getConnection',
      value: function getConnection() {
        return new Promise(function (resolve, reject) {
          var openRequest = window.indexedDB.open(dbName, version);

          // cria ou altera um banco já existente, só é executado quando a version, é maior que a anterior
          openRequest.onupgradeneeded = function (e) {
            return ConnectionFactory._createStores(e.target.result);
          };

          // é executado se a conexão foi bem sucedida
          openRequest.onsuccess = function (e) {

            // a primeira conexão com esse banco é única
            if (!connection) {
              connection = e.target.result;
              // guardando a função close
              close = connection.close.bind(connection);
              connection.close = function () {
                // executado caso o dev tente criar a connection com um .close nela
                throw new Error('Você não pode fechar diretamente a conexão');
              };
            };

            resolve(connection);
          };

          // é executado se a conexão foi mal sucedida
          openRequest.onerror = function (e) {
            console.log(e.target.error); // lança o erro no console
            reject(e.target.error.name); // retorna uma string com o erro
          };
        });
      }
    }, {
      key: '_createStores',
      value: function _createStores(connection) {
        stores.forEach(function (store) {
          if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
          // para atualizar a versão da store, deletamos ela, se ela existir

          connection.createObjectStore(store, { autoIncrement: true });
          // cria a store, autoIncrement dá um id único pra cada item que entrar nela
        });
      }
    }, {
      key: 'closeConnection',
      value: function closeConnection() {
        if (connection) {
          close();
          // Reflect.apply(close, connection, []); // (método, contexto, parâmetros)
          // alternativa sem o bind()

          // deixando null, para passar no if do onsuccess
          connection = null;
        }
      }
    }]);

    return ConnectionFactory;
  }();
}(); // função auto-invocada
//# sourceMappingURL=ConnectionFactory.js.map