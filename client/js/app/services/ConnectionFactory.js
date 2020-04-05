var ConnectionFactory = (function () { 
  // module pattern, as variáveis daqui de dentro não podem ser acessadas, 
  // porem a classe sim, como ela está sendo retornada
  // esse function () {} seria uma função anônima, adaptamos ao js com a função auto-invocada

  // variáveis "globais" para fácil manutenção
  const stores = ['negociacoes'];
  const version = 4;
  const dbName = 'aluraframe';

  // restringindo a criação de novas conexões
  var connection = null; 

  // variável que irá receber o connection.close();
  var close = null;

  return class ConnectionFactory {

    constructor() {
      throw new Error('Não é possível criar instâncias de ConnectionFactory');
    }

    static getConnection() {
      return new Promise((resolve, reject) => {
        let openRequest = window.indexedDB.open(dbName, version);

        openRequest.onupgradeneeded = e => ConnectionFactory._createStores(e.target.result);

        openRequest.onsuccess = e => {
          if (!connection) {
            connection = e.target.result;
            close = connection.close.bind(connection);
            connection.close = function () {
              throw new Error('Você não pode fechar diretamente a conexão');
            };
          };
          resolve(connection);

        };

        openRequest.onerror = e => {
          console.log(e.target.error); // lança o erro no console
          reject(e.target.error.name); // lança uma string com o erro
        };

      });
    }

    static _createStores(connection) {
      stores.forEach(store => {
        if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
        // para atualizar a versão da store, deletamos ela, se ela existir

        connection.createObjectStore(store, { autoIncrement: true });
        // cria a store, autoIncrement dá um id único pra cada item que entrar nela
      });
    }

    static closeConnection() {
      if (connection) {
        close();
        // Reflect.apply(close, connection, []); // (método, contexto, parâmetros)
        // alternativa sem o bind()
        
        // deixando null, para passar no if do onsuccess
        connection = null;
      }
    };

  }

})(); // função auto-invocada