class NegociacaoDao {
  constructor(connection) {

    this._connection = connection;
    this._store = 'negociacoes';

  }

  adiciona(negociacao) {
    return new Promise((resolve, reject) => {
      let request = this._connection
        // esses dois fazem a conexão com a lista/store do banco de dados
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        // adiciona a negociação na objectStore
        .add(negociacao);

      // MÉTODO ABORT
      // podemos abortar uma transação com o .abort
      // transaction.abort();
      // transaction.onabort = e => {
      //   console.log(e);
      //   console.log('Transação abortada');
      // };

      request.onsuccess = e => resolve();

      request.onerror = e => {
        console.log(e.target.error);
        reject('Não foi possível adicionar a negociação');
      };
    });
  }

  listaTodos() {
    return new Promise((resolve, reject) => {
      let cursor = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .openCursor();

      let negociacoes = [];

      // é chamado de acordo com o número de itens na lista/store
      cursor.onsuccess = e => {
        // te dá um item para o qual está "apontando" (aponta para o primeiro item)
        let atual = e.target.result;

        if (atual) { // se há um ponteiro válido

          let dado = atual.value; // os dados do item

          negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
          atual.continue(); // pula para o próximo item da lista
        } else {
          // devolve todas as negociações que estavam na lista
          resolve(negociacoes);
        }
      };

      cursor.onerror = e => {
        console.log(e.target.error.name);
        reject('Não foi possível listar as negociações');
      };
    });
  }

  apagaTodos() {
    return new Promise((resolve, reject) => {
      let request = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .clear(); // limpa a store

      request.onsuccess = e => resolve('Negociações apagadas com sucesso');

      request.onerror = e => {
        console.log(e.target.error);
        reject('Não foi possível apagar as negociações');
      };

    })
  }


}