const carrito = JSON.parse(localStorage.getItem("carrito")) ?? []

const tablaBody = document.querySelector("table tbody")
const tablaFoot = document.querySelector("td#importeTotalCarrito")
const carritoCantidad = document.querySelector("#carritoNmr")
const importeTotal = document.querySelector("td#totalCarrito")


function armarTabla({modelo, precio, id}) {
    return `<tr>
                <td>${modelo}</td>
                <td>$ ${precio.toLocaleString("es-AR")}</td>
                <td><i class="fa-solid fa-xmark iconTable iconoQuitar" id="${id}"></i></td>
               
            </tr>`
}

function cargarCarrito() {
tablaBody.innerHTML = ""
    if (carrito.length > 0) {
        carrito.forEach((producto)=>  tablaBody.innerHTML += armarTabla(producto))
        calcularTotal()
        quitarEventoAdd()
    }
}

function incrementarCarrito(){
    carritoCantidad.textContent = carrito.length
}

function calcularTotal() {
    if (carrito.length > 0) {
        let totalCarrito = carrito.reduce((acc, prod)=> acc + prod.precio, 0)
        importeTotal.textContent = `$ ${totalCarrito.toLocaleString("es-AR")}`
    }
}

function quitarEventoAdd(){
    const iconosQuitar = document.querySelectorAll(".iconoQuitar")
        if (iconosQuitar.length > 0){
            iconosQuitar.forEach((icono)=>{
                icono.addEventListener("click", ()=> {
                    console.log("Boton quitar detectado:)")
                    const indiceProductoEliminado = carrito.findIndex((producto)=> producto.id == icono.id)
                    carrito.splice(indiceProductoEliminado, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    incrementarCarrito();
                    cargarCarrito();
                })
            })
        }
}

incrementarCarrito()
cargarCarrito()