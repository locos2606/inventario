const form = document.getElementById("productForm");
const inventarioBody = document.getElementById("inventarioBody");

const API = "http://localhost:3000/api/productos";

function formatearNumero(num) {
  return Number(num).toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

async function mostrarInventario() {
  try {
    const res = await fetch(API);
    const inventario = await res.json();
    inventarioBody.innerHTML = "";

    inventario.forEach((producto) => {
      const fila = document.createElement("tr");
      const total = producto.cantidad * producto.precio;

      fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${formatearNumero(producto.cantidad)}</td>
        <td>$${formatearNumero(producto.precio)}</td>
        <td>$${formatearNumero(total)}</td>
        <td>
          <button class="editar" onclick="editarProducto(${producto.id})">✏️</button>
          <button class="eliminar" onclick="eliminarProducto(${producto.id})">🗑️</button>
        </td>
      `;
      inventarioBody.appendChild(fila);
    });
  } catch (err) {
    console.error("Error cargando inventario:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const precio = parseFloat(document.getElementById("precio").value);

  if (!nombre || cantidad <= 0 || precio < 0) {
    alert("Por favor completa los campos correctamente");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, cantidad, precio })
  });

  form.reset();
  mostrarInventario();
});

async function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  mostrarInventario();
}

async function editarProducto(id) {
  const nombre = prompt("Nuevo nombre:");
  const cantidad = prompt("Nueva cantidad:");
  const precio = prompt("Nuevo precio:");

  if (!nombre || !cantidad || !precio) return;

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, cantidad: parseFloat(cantidad), precio: parseFloat(precio) })
  });

  mostrarInventario();
}

// iniciar
mostrarInventario();
