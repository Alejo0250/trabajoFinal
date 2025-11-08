/* URL del archivo JSON donde se almacenan los datos de las zapatillas */
const ZAPATILLAS_URL = "data/zapatillasdb.json";

/* 🏷️ Componente que representa una tarjeta individual de zapatilla */
function ZapatillasCard({ zapatilla, onSelectZapatilla }) {
  return (
    <div
      onClick={() => onSelectZapatilla(zapatilla)}
      className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-300 overflow-hidden 
                  group cursor-pointer w-full"
    >
      {/* Contenedor de la imagen principal */}
      <div className="relative overflow-hidden h-64">
        <img
          src={`imagenes/zapatillas/${zapatilla.imagen}`} // Ruta dinámica
          alt={zapatilla.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{ zIndex: 1 }}
        />
        <div
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ zIndex: 2 }}
        ></div>
      </div>

      {/* Sección inferior */}
      <div className="p-6">
        <h3
          className="text-xl font-bold text-white mb-2 
                     hover:text-blue-400 transition-colors"
        >
          {zapatilla.nombre}
        </h3>

        <p className="text-gray-300 text-sm mb-4 leading-relaxed min-h-[48px]">
          {zapatilla.descripcion}
        </p>

        {/* Etiquetas */}
        <div className="flex flex-col gap-3">
          {/* 🔹 Bloque superior: Marca, Colores y Popularidad */}
          <div className="flex flex-wrap gap-2">
            {/* Marca */}
            <span className="bg-red-900 text-red-200 px-3 py-1 rounded-full text-xs font-medium">
              {zapatilla.marca}
            </span>

            {/* Colores */}
            {zapatilla.color.map((col, i) => {
              let bgColor = "bg-gray-700 text-gray-100";
              if (col.includes("Celeste")) bgColor = "bg-blue-900 text-blue-200";
              else if (col.includes("Azul")) bgColor = "bg-blue-800 text-blue-300";
              else if (col.includes("Dorado")) bgColor = "bg-yellow-700 text-yellow-200";
              else if (col.includes("Verde")) bgColor = "bg-green-800 text-green-200";
              else if (col.includes("Rojo")) bgColor = "bg-red-800 text-red-200";
              else if (col.includes("Rosado")) bgColor = "bg-pink-800 text-pink-200";
              else if (col.includes("Negro")) bgColor = "bg-gray-900 text-white";
              else if (col.includes("Blanco")) bgColor = "bg-gray-200 text-gray-900";

              return (
                <span
                  key={i}
                  className={`${bgColor} px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {col}
                </span>
              );
            })}

            {/* Popularidad */}
            <div className="flex items-center bg-yellow-900 px-3 py-1 rounded-full">
              <span className="text-yellow-300 text-sm font-semibold">
                {zapatilla.popularidad}
              </span>
            </div>
          </div>

          {/* 🔹 Bloque inferior: Precio, Moneda y Talla */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-700">
            <span className="bg-green-900 text-white px-3 py-1 rounded-full text-xs font-medium">
              {zapatilla.precios}
            </span>

            <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
              {zapatilla.moneda}
            </span>

            <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
              {zapatilla.talla}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🧱 GRID GENERAL */
function ZapatillasGrid({ zapatillas, onSelectZapatilla }) {
  const primeraParte = zapatillas.slice(0, 6);
  const ultimas = zapatillas.slice(6);

  return (
    <div className="grid grid-cols-3 gap-10 justify-items-center p-10 max-w-[1700px] mx-auto auto-rows-fr">
      {/* Primeras 6 */}
      {primeraParte.map((z, i) => (
        <div key={i} className="w-full h-[470px] flex">
          <ZapatillasCard zapatilla={z} onSelectZapatilla={onSelectZapatilla} />
        </div>
      ))}

      {/* Fila final */}
      <div className="col-span-3 flex justify-center gap-10 w-full">
        {ultimas.map((z, i) => (
          <div key={i + 6} className="flex-1 max-w-[800px]">
            <ZapatillasCard zapatilla={z} onSelectZapatilla={onSelectZapatilla} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🌙 Componente principal */
function App() {
  const [zapatillas, setZapatillas] = React.useState([]);
  const [selectedZapatilla, setSelectedZapatilla] = React.useState(null);

  // Cargar JSON
  React.useEffect(() => {
    fetch(ZAPATILLAS_URL)
      .then((res) => res.json())
      .then((data) => setZapatillas(data))
      .catch((error) => console.error("Error al cargar zapatillas:", error));
  }, []);

  return (
    <div
      style={{ backgroundColor: "#010e30ff", color: "white", minHeight: "100vh" }}
    >
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-white">🛍️ Tienda Colección</h1>
      </header>

      <main className="p-6">
        <h3
          className="text-4xl font-bold text-center mb-8 
                     bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          ZAPATILLAS
        </h3>

        <ZapatillasGrid
          zapatillas={zapatillas}
          onSelectZapatilla={setSelectedZapatilla}
        />

        {/* MODAL */}
        {selectedZapatilla && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedZapatilla(null);
            }}
          >
            <div className="bg-gray-800 rounded-2xl p-8 w-[90%] max-w-5xl max-h-[90vh] shadow-2xl relative overflow-y-auto">
              <button
                onClick={() => setSelectedZapatilla(null)}
                className="absolute top-2 right-2 text-red-500 hover:text-white text-2xl font-bold"
              >
                &times;
              </button>

              {/* Galería */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={`imagenes/zapatillas/${selectedZapatilla.imagenSeleccionada || selectedZapatilla.imagen}`}
                  alt={selectedZapatilla.nombre}
                  className="w-full max-h-[400px] object-contain rounded-lg mb-4"
                />

                {selectedZapatilla.galeria && selectedZapatilla.galeria.length > 1 && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {selectedZapatilla.galeria.map((img, idx) => (
                      <img
                        key={idx}
                        src={`imagenes/zapatillas/${img}`}
                        alt={`Vista ${idx + 1}`}
                        className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-300 ${
                          selectedZapatilla.imagenSeleccionada === img
                            ? "border-blue-500 scale-105"
                            : "border-gray-600 hover:border-blue-400"
                        }`}
                        onClick={() =>
                          setSelectedZapatilla({
                            ...selectedZapatilla,
                            imagenSeleccionada: img,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-2xl font-bold mb-2">
                {selectedZapatilla.nombre}
              </h3>
              <p className="text-gray-300 mb-3">
                {selectedZapatilla.descripcion}
              </p>

              <div className="flex flex-wrap gap-2 text-sm mb-3">
                <span className="bg-red-900 text-red-200 px-3 py-1 rounded-full">
                  {selectedZapatilla.marca}
                </span>
                <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full">
                  {selectedZapatilla.precios}
                </span>
                <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full">
                  {selectedZapatilla.moneda}
                </span>
                <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full">
                  Talla {selectedZapatilla.talla}
                </span>
                <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full">
                  Popularidad: {selectedZapatilla.popularidad}
                </span>
              </div>

              {/* Controles */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {/* Cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedZapatilla((prev) => ({
                        ...prev,
                        cantidad: Math.max((prev.cantidad || 1) - 1, 1),
                      }))
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    -
                  </button>

                  <span className="text-white font-medium px-2">
                    {selectedZapatilla.cantidad || 1}
                  </span>

                  <button
                    onClick={() =>
                      setSelectedZapatilla((prev) => ({
                        ...prev,
                        cantidad: (prev.cantidad || 1) + 1,
                      }))
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>

                {/* Añadir al carrito */}
                <button
                  onClick={() => {
                    const carritoActual =
                      JSON.parse(localStorage.getItem("carrito")) || [];

                    const precioLimpio = parseFloat(
                      (selectedZapatilla.precios || "0").replace(/[^\d.]/g, "")
                    );

                    const nuevoItem = {
                      id: selectedZapatilla.id,
                      nombre: selectedZapatilla.nombre,
                      imagen: selectedZapatilla.imagen,
                      precio: precioLimpio,
                      moneda: selectedZapatilla.moneda,
                      cantidad: selectedZapatilla.cantidad || 1,
                    };

                    carritoActual.push(nuevoItem);
                    localStorage.setItem("carrito", JSON.stringify(carritoActual));

                    alert(
                      `🛒 Añadiste ${
                        selectedZapatilla.cantidad || 1
                      } × ${selectedZapatilla.nombre} al carrito`
                    );
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* Renderiza la app */
ReactDOM.render(<App />, document.getElementById("zapatillasgrid"));
