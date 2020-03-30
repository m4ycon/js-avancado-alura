class Mensagem {

    constructor(texto) {
        this._texto = texto || ''; 
        // se o texto for undefined, recebe '' (uma forma de adaptar o código a navegadores que não aceitam parâmetros opcionais)
    }

    get texto() { return this._texto }

    set texto(texto) { this._texto = texto }

}