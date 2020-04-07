// variáveis "globais" para fácil manutenção
const stores = ['negociacoes'];
const version = 4;
const dbName = 'aluraframe';

// restringindo a criação de novas conexões
let connection = null;

// variável que irá receber o connection.close();
let close = null;

export class ConnectionFactory {

  constructor() {
    throw new Error('Não é possível criar instâncias de ConnectionFactory');
  }

  static getConnection() {
    return new Promise((resolve, reject) => {
      let openRequest = window.indexedDB.open(dbName, version);

      // cria ou altera um banco já existente, só é executado quando a version, é maior que a anterior
      openRequest.onupgradeneeded = e => ConnectionFactory._createStores(e.target.result);

      // é executado se a conexão foi bem sucedida
      openRequest.onsuccess = e => {

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
      openRequest.onerror = e => {
        console.log(e.target.error); // lança o erro no console
        reject(e.target.error.name); // retorna uma string com o erro
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