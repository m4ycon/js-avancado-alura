class HttpService {

  _handleErrors(res) {
    // res.ok retorna true ou false, de acordo com o status da requisição 200>x>299
    // res.statusText retorna a mensagem do status ex:'200->ok',
    // que cairá no catch de quem chamou se for algum erro
    if (!res.ok) throw new Error(res.statusText);
    return res;
  }

  get(url) {
    // api do es2016 - FETCH, simplifica a comunicação com um servidor
    return fetch(url)
      .then(res => this._handleErrors(res))
      // retorna em js, a resposta lida em json
      .then(res => res.json());

    // MÉTODO TRADICIONAL
    // return new Promise((resolve, reject) => {
    //   let xhr = new XMLHttpRequest();
    //   xhr.open('GET', url);

    //   xhr.onreadystatechange = () => {
    //     if (xhr.readyState == 4) {
    //       if (xhr.status == 200) {
    //         resolve(JSON.parse(xhr.responseText));
    //       } else {
    //         reject(xhr.responseText);
    //       }
    //     }
    //   };
    //   xhr.send();
    // });
  }

  post(url, dado) {
    // post com o fetch api
    return fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      body: JSON.stringify(dado)
    })
    .then(res => this._handleErrors(res));


    // MÉTODO TRADICIONAL
    // return new Promise((resolve, reject) => {
    //   let xhr = new XMLHttpRequest();
    //   xhr.open('POST', url, true);
    //   xhr.setRequestHeader('Content-Type', 'application/json');

    //   xhr.onreadystatechange = () => {
    //     if (xhr.readyState == 4) {
    //       if (xhr.status == 200) {
    //         resolve(JSON.parse(xhr.responseText));
    //       } else {
    //         reject(xhr.responseText);
    //       }
    //     }
    //   }
    //   xhr.send(JSON.stringify(dado));
    // });
  }

}