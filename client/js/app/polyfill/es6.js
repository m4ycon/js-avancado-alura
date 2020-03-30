if (!Array.prototype.includes) {
  // Se não existir, adiciona

  console.log('Polyfill para Array.includes aplicado');

  Array.prototype.includes = (elemento) => {
    return this.indexOf(elemento) != -1;
  };
}