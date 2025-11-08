function Header() {
  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          D&A
        </h1>

        <nav id="menu" className="md:flex space-x-8">
          <ul className="flex space-x-6 items-center">
            <li>
              <a
                href="inicio.html"
                className="text-white hover:text-blue-400 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                INICIO
              </a>
            </li>
            <li>
              <a
                href="carrito.html"
                className="text-white hover:text-blue-400 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                CARRITO
              </a>
            </li>
            <li>
              <a
                href="contacto.html"
                className="text-white hover:text-blue-400 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                CONTACTO
              </a>
            </li>
            <li>
              <a
                href="game.html"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                JUEGO
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

ReactDOM.render(<Header />, document.getElementById("header"));
