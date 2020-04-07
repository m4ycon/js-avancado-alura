export class DateHelper {

  constructor() {
    throw new Error('Esta classe não pode ser instanciada');
  }

  static dataParaTexto(data) {
    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  }

  static textoParaData(texto) {

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto))
      throw new Error('Deve estar no formato dd/mm/aaaa');

    return new Date(...texto.split('/').reverse().map((item, index) => item - index % 2));
    // esse map é porque o Date conta os mêses de 0 a 11, e não de 1 a 12, por isso fazemos - 1 nele
  }
}