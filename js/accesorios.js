/* URL del archivo JSON donde se almacenan los datos de los accesorios */
const ACCESORIOS_URL = "data/accesoriosdb.json";

/* 🏷️ Componente que representa una tarjeta individual de accesorio */
function AccesoriosCard({ accesorios, onSelectAccesorio }) {
  return (
    <div
      onClick={() => onSelectAccesorio(accesorios)}
      className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-300 overflow-hidden 
                  group cursor-pointer w-full"
    >
      {/* Contenedor de la imagen principal */}
      <div className="relative overflow-hidden h-64">
        <img
          src={`imagenes/accesorios/${accesorios.imagen}`} // Ruta dinámica
          alt={accesorios.nombre}
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
          {accesorios.nombre}
        </h3>

        <p className="text-gray-300 text-sm mb-4 leading-relaxed min-h-[48px]">
          {accesorios.descripcion}
        </p>

        {/* Etiquetas */}
        <div className="flex flex-col gap-3">
          {/* 🔹 Bloque superior: Marca, Colores y Popularidad */}
          <div className="flex flex-wrap gap-2">
            {/* Marca */}
            <span className="bg-red-900 text-red-200 px-3 py-1 rounded-full text-xs font-medium">
              {accesorios.marca}
            </span>

            {/* Colores */}
            {accesorios.color.map((col, i) => {
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
                <span key={i} className={`${bgColor} px-3 py-1 rounded-full text-xs font-medium`}>
                  {col}
                </span>
              );
            })}

            {/* Popularidad */}
            <div className="flex items-center bg-yellow-900 px-3 py-1 rounded-full">
              <span className="text-yellow-300 text-sm font-semibold">
                {accesorios.popularidad}
              </span>
            </div>
          </div>

          {/* 🔹 Bloque inferior: Precio, Moneda y Talla */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-700">
            <span className="bg-green-900 text-white px-3 py-1 rounded-full text-xs font-medium">
              {accesorios.precios}
            </span>

            <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
              {accesorios.moneda}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🧱 GRID GENERAL: organiza las tarjetas en filas y columnas */
function AccesoriosGrid({ accesorios, onSelectAccesorio }) {
  // 🟦 En este caso solo hay 5 accesorios
  const primeraParte = accesorios.slice(0, 3); // 3 PRIMEROS ACCESORIOS
  const ultimas = accesorios.slice(3); // 2 ULTIMOS ACCESORIOS

  return (
    <div className="grid grid-cols-3 gap-10 justify-items-center p-10 max-w-[1700px] mx-auto auto-rows-fr">
      {/* 🔹 Fila 1 → 3 accesorios */}
      {primeraParte.map((c, i) => (
        <div key={i} className="w-full h-[470px] flex">
          <AccesoriosCard accesorios={c} onSelectAccesorio={onSelectAccesorio} />
        </div>
      ))}

      {/* 🔹 Fila 2 → centrada con las 2 restantes */}
      <div className="col-span-3 flex justify-center gap-10 w-full">
        {ultimas.map((c, i) => (
          <div key={i + 3} className="flex-1 max-w-[500px]">
            <AccesoriosCard accesorios={c} onSelectAccesorio={onSelectAccesorio} />
          </div>
        ))}
      </div>
    </div>
  );
}


/* 🌙 Componente principal solo con modo oscuro fijo */
function App() {
  const [accesorios, setAccesorios] = React.useState([]);
  const [selectedAccesorio, setSelectedAccesorio] = React.useState(null); // ✅ para el modal

  // Cargar JSON
  React.useEffect(() => {
    fetch(ACCESORIOS_URL)
      .then((res) => res.json())
      .then((data) => setAccesorios(data))
      .catch((error) => console.error("Error al cargar accesorios:", error));
  }, []);

  return (
    <div style={{ backgroundColor: "#010e30ff", color: "white", minHeight: "100vh" }}>
      {/* ENCABEZADO */}
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-white">🛍️ Tienda Colección</h1>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-6">
        <h3
          className="text-4xl font-bold text-center mb-8 
                     bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          ACCESORIOS
        </h3>

        {/* GRID DE ACCESORIOS */}
        <AccesoriosGrid accesorios={accesorios} onSelectAccesorio={setSelectedAccesorio} />

        {/* MODAL DETALLES */}
        {selectedAccesorio && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedAccesorio(null);
            }}
          >
            <div className="bg-gray-800 rounded-2xl p-8 w-[90%] max-w-5xl max-h-[90vh] shadow-2xl relative overflow-y-auto">
              {/* Botón de cerrar */}
              <button
                onClick={() => setSelectedAccesorio(null)}
                className="close-btn absolute top-2 right-2 text-red-500 hover:text-white text-2xl font-bold"
              >
                &times;
              </button>

              {/* 🌆 Galería interactiva */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={`imagenes/accesorios/${selectedAccesorio.imagenSeleccionada || selectedAccesorio.imagen}`}
                  alt={selectedAccesorio.nombre}
                  className="w-full max-h-[400px] object-contain rounded-lg mb-4 transition-transform duration-300"
                />

                {selectedAccesorio.galeria && selectedAccesorio.galeria.length > 1 && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {selectedAccesorio.galeria.map((img, idx) => (
                      <img
                        key={idx}
                        src={`imagenes/accesorios/${img}`}
                        alt={`Vista ${idx + 1}`}
                        className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-300 ${
                          selectedAccesorio.imagenSeleccionada === img
                            ? "border-blue-500 scale-105"
                            : "border-gray-600 hover:border-blue-400"
                        }`}
                        onClick={() =>
                          setSelectedAccesorio({
                            ...selectedAccesorio,
                            imagenSeleccionada: img,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Información */}
              <h3 className="text-2xl font-bold mb-2">{selectedAccesorio.nombre}</h3>
              <p className="text-gray-300 mb-3">{selectedAccesorio.descripcion}</p>

              {/* Etiquetas */}
              <div className="flex flex-wrap gap-2 text-sm mb-3">
                <span className="bg-red-900 text-red-200 px-3 py-1 rounded-full">
                  {selectedAccesorio.marca}
                </span>
                <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full">
                  {selectedAccesorio.precios}
                </span>
                <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full">
                  {selectedAccesorio.moneda}
                </span>
                <span className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full">
                  Popularidad: {selectedAccesorio.popularidad}
                </span>
              </div>

              {/* Colores */}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedAccesorio.color.map((col, i) => {
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
                    <span key={i} className={`${bgColor} px-3 py-1 rounded-full text-sm font-medium`}>
                      {col}
                    </span>
                  );
                })}
              </div>

              {/* Controles de Cantidad y Añadir al Carrito */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {/* Selector de Cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccesorio((prev) => ({
                        ...prev,
                        cantidad: Math.max((prev.cantidad || 1) - 1, 1),
                      }));
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    -
                  </button>

                  <span className="text-white font-medium px-2">
                    {selectedAccesorio.cantidad || 1}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccesorio((prev) => ({
                        ...prev,
                        cantidad: (prev.cantidad || 1) + 1,
                      }));
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Botón Añadir al Carrito */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
                    const index = carritoActual.findIndex(
                      (item) => item.id === selectedAccesorio.id
                    );
                    if (index >= 0) {
                      carritoActual[index].cantidad += selectedAccesorio.cantidad || 1;
                    } else {
                      carritoActual.push({
                        id: selectedAccesorio.id,
                        nombre: selectedAccesorio.nombre,
                        imagen: selectedAccesorio.imagen,
                        precio: selectedAccesorio.precios,
                        moneda: selectedAccesorio.moneda,
                        cantidad: selectedAccesorio.cantidad || 1,
                      });
                    }
                    localStorage.setItem("carrito", JSON.stringify(carritoActual));
                    alert(`¡Has añadido ${selectedAccesorio.cantidad || 1} de ${selectedAccesorio.nombre} al carrito!`
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
ReactDOM.render(<App />, document.getElementById("accesoriosgrid"));
