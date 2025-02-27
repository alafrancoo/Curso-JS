const carrito = JSON.parse(localStorage.getItem("carrito")) ?? []
const productos = []
const URLproductos = "products.json"

const containerCards = document.querySelector("#containerCards")
const carritoCantidad = document.querySelector("#carritoNmr")
const searchInput = document.querySelector("#barraDeBusqueda")

function obtenerProductos(){
    fetch(URLproductos)
    .then((response) => response.json())
    .then((data) => productos.push(...data))
    .then(() => cargarProductos(productos))
    .catch(() => containerCards.innerHTML = retornarCardError())
}

function cargarProductos(array) {
    if (array.length > 0) {
        containerCards.innerHTML = ""
        array.forEach((producto)=> {
            containerCards.innerHTML += retornarCardHTML(producto)
        })
        escucharEventoAdd()
        carrito.length > 0 && incrementarCarrito()
    } 
}

function retornarCardHTML(producto) {
    return `<div class="divCard">
                <div><img src="${producto.imagen}" alt="${producto.modelo}" class="imagenCard"></div>
                <div class="productoCard">${producto.modelo}</div>
                <div class="importeCard">$ ${producto.precio}</div>
                <button id="${producto.id}" class="botonCard">Agregar al carrito</button>
            </div>`
}

function retornarCardError() {
    return `<div class="div-card-error">
                <h2>Se ha producido un error</h2>
            </div>`
} 

function escucharEventoAdd(){
    const botonesAdd = document.querySelectorAll(".botonCard")
    if (botonesAdd.length > 0) {
        botonesAdd.forEach((boton)=> {
            boton.addEventListener("click", ()=> {
                const productoSeleccionado = productos.find((producto)=> producto.id == boton.id)
                carrito.push(productoSeleccionado)
                const productoModelo = JSON.stringify(productoSeleccionado.modelo)
                localStorage.setItem("carrito", JSON.stringify(carrito))
                incrementarCarrito()
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "success",
                    iconColor: "#009879",
                    title: `${productoModelo} añadidas al carrito`
                  });
            })
        })
    }
}

function incrementarCarrito(){
    carritoCantidad.textContent = carrito.length
}
obtenerProductos()
console.log("hola")

searchInput.addEventListener("keyup", (e)=> { // 
    if (e.key === "Enter") {
        let busqueda = productos.filter((producto)=> producto.modelo.toLowerCase().includes(searchInput.value.toLowerCase()))
        localStorage.setItem("ultimaBusqueda", searchInput.value)
        if (busqueda.length > 0) {
            cargarProductos(busqueda)
        }
    }
})

