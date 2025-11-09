function Header() {
  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          D&A
        </h1>

        <nav className="md:flex space-x-8">
          <ul className="flex space-x-6 items-center">
            <li>
              <a
                href="index.html"
                className="text-white hover:text-blue-400 font-medium transition hover:underline"
              >
                INICIO
              </a>
            </li>
            <li>
              <a
                href="carrito.html"
                className="text-white hover:text-blue-400 font-medium transition hover:underline"
              >
                CARRITO
              </a>
            </li>
            <li>
              <a
                href="contacto.html"
                className="text-white hover:text-blue-400 font-medium transition hover:underline"
              >
                CONTACTO
              </a>
            </li>
            <li>
              <a
                href="game.html"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg"
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

/* Componente para cada fila del carrito: maneja hooks localmente y notifica cambios al padre */
function CartItem({ item, index, getImageSrc, parsePrice, onEliminar, onCambiarCantidad }) {
  const [src, setSrc] = React.useState("");

  React.useEffect(() => {
    getImageSrc(item, setSrc);
  }, [item.imagen]);

  const precioNumerico = parsePrice(item.precio);
  const cantidad = item.cantidad || 1;
  const itemTotalNumero = precioNumerico * cantidad;
  const itemTotal = itemTotalNumero.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid grid-cols-3 items-center bg-gray-800 p-4 rounded-lg gap-4">
      <div className="flex items-center gap-4">
        {src ? (
          <img
            src={src}
            alt={item.nombre}
            className="w-20 h-20 object-cover rounded transition-opacity duration-500 opacity-100"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-700 rounded animate-pulse" />
        )}

        <div>
          <h3 className="font-bold">{item.nombre}</h3>
          <p>
            {item.moneda} {typeof item.precio === 'number' ? item.precio.toFixed(2) : item.precio}
          </p>
        </div>
      </div>

      <div className="justify-self-center flex-shrink-0">
        <div className="bg-green-600 text-white rounded min-w-[140px] h-20 flex flex-col justify-center items-center px-4">
          <div className="text-xs">Importe</div>
          <div className="font-bold">{item.moneda} {itemTotal}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onCambiarCantidad(-1)}
          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          -
        </button>

        <span>{cantidad}</span>

        <button
          onClick={() => onCambiarCantidad(1)}
          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          +
        </button>

        <button
          onClick={onEliminar}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function CarritoPage() {
  const [carrito, setCarrito] = React.useState(() => {
    const raw = JSON.parse(localStorage.getItem("carrito")) || [];
        // Merge duplicates by id: sum cantidad and normalize precio to number
        const map = {};
        raw.forEach((item) => {
          const id = String(item.id);
          const precioNum = typeof item.precio === 'number'
            ? item.precio
            : Number(String(item.precio || '').replace(/[^\d.,-]/g, '').replace(/,/g, '.')) || 0;
          const cantidad = item.cantidad || 1;

          if (!map[id]) {
            map[id] = { ...item, precio: precioNum, cantidad };
          } else {
            map[id].cantidad = (map[id].cantidad || 0) + cantidad;
            // keep the most recent numeric price
            map[id].precio = precioNum;
          }
        });

        return Object.values(map);
  });

  // Eliminar producto por índice (mantenemos por index en el render)
  const eliminarItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // Cambiar cantidad por índice — así actualizamos la UI inmediatamente
  const cambiarCantidadPorIndex = (index, delta) => {
    const nuevoCarrito = carrito.map((item, i) => {
      if (i === index) {
        const nuevaCantidad = Math.max((item.cantidad || 1) + delta, 1);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // Calcular total (usar parsePrice por si hay strings residuales)
  const total = carrito.reduce((acc, item) => acc + parsePrice(item.precio) * (item.cantidad || 1), 0);

  // Preload de imágenes sin parpadeo
  const preloadImage = (src, callback) => {
    const img = new Image();
    img.onload = () => callback(src);
    img.onerror = callback;
    img.src = src;
  };

  const getImageSrc = (item, setSrc) => {
    const rutas = [
      `imagenes/zapatillas/${item.imagen}`,
      `imagenes/camisetas/${item.imagen}`,
      `imagenes/accesorios/${item.imagen}`,
    ];

    const intentar = (i = 0) => {
      if (i >= rutas.length) return setSrc("imagenes/placeholder.png");

      preloadImage(rutas[i], (resultado) => {
        if (resultado === rutas[i]) setSrc(rutas[i]);
        else intentar(i + 1);
      });
    };

    intentar();
  };

  // Parsea un string de precio que puede contener emojis, símbolos o separadores
  function parsePrice(priceStr) {
    if (typeof priceStr === "number") return priceStr;
    if (!priceStr) return 0;

    // quitar todo lo que no sea dígito, coma, punto o signo menos
    let cleaned = String(priceStr).replace(/[^\d.,-]/g, "").trim();
    if (!cleaned) return 0;

    // si tiene punto y coma estadísticamente uno es separador de miles y otro decimal
    if (cleaned.indexOf(".") > -1 && cleaned.indexOf(",") > -1) {
      // si el punto aparece antes de la coma -> punto = miles, coma = decimal
      if (cleaned.indexOf(".") < cleaned.indexOf(",")) {
        cleaned = cleaned.replace(/\./g, "").replace(",", ".");
      } else {
        // caso contrario: coma = miles, punto = decimal
        cleaned = cleaned.replace(/,/g, "");
      }
    } else if (cleaned.indexOf(",") > -1) {
      // solo coma -> tratar coma como decimal
      cleaned = cleaned.replace(/,/g, ".");
    } else {
      // solo punto o ninguno -> dejar tal cual (punto será decimal)
    }

    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🛒 Carrito de Compras</h2>

        {carrito.length === 0 ? (
          <p className="text-gray-400">Tu carrito está vacío.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {carrito.map((item, index) => (
              <CartItem
                key={String(item.id) + "-" + index}
                item={item}
                index={index}
                getImageSrc={getImageSrc}
                parsePrice={parsePrice}
                onEliminar={() => eliminarItem(index)}
                onCambiarCantidad={(delta) => cambiarCantidadPorIndex(index, delta)}
              />
            ))}

            <div className="text-right font-bold text-xl mt-4">
              Total: {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.render(<CarritoPage />, document.getElementById("carrito-root"));
