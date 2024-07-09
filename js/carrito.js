const carrito = JSON.parse(localStorage.getItem("carrito")) ?? []

const tablaBody = document.querySelector("table tbody")
const carritoCantidad = document.querySelector("#carritoNmr")
const importeTotal = document.querySelector("td#totalCarrito")
const botonComprar = document.querySelector("#bttnComprar")
const botonCancelar = document.querySelector("#bttnCancelar")


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
    } else {
        calcularTotal();
    }
}

function incrementarCarrito(){
    carritoCantidad.textContent = carrito.length
}

function calcularTotal() {
    if (carrito.length > 0) {
        let totalCarrito = carrito.reduce((acc, prod)=> acc + prod.precio, 0)
        importeTotal.textContent = `$ ${totalCarrito.toLocaleString("es-AR")}`
    } else {
        importeTotal.textContent = "$ 0";
    }
}

function quitarEventoAdd(){
    const iconosQuitar = document.querySelectorAll(".iconoQuitar")
        if (iconosQuitar.length > 0){
            iconosQuitar.forEach((icono)=>{
                icono.addEventListener("click", ()=> {
                    const indiceProductoEliminado = carrito.findIndex((producto)=> producto.id == icono.id)
                    carrito.splice(indiceProductoEliminado, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    incrementarCarrito();
                    cargarCarrito();
                })
            })
        }
}

function comprarEventoAdd(){
    botonComprar.addEventListener("click", ()=>{
        if(carrito.length > 0){
            Swal.fire({
                title: "Completa los datos para finalizar la compra",
                icon: "warning",
                iconColor: "#009879",
                html: `
                    <input id="swal-input1" class="swal2-input" placeholder="Correo Electrónico">
                    <input id="swal-input2" class="swal2-input" placeholder="Dirección">
                `,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "Finalizar Compra",
                confirmButtonColor: "#009879",
                cancelButtonText: "Cancelar",
                cancelButtonColor: "#B22222",
                preConfirm: () => {
                    const email = Swal.getPopup().querySelector('#swal-input1').value
                    const direccion = Swal.getPopup().querySelector('#swal-input2').value
                    if (!email || !direccion) {
                        Swal.showValidationMessage("Por favor completa ambos campos")
                    }
                    return { email: email, direccion: direccion }
                }

              }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Datos enviados",
                        html: `
                            <p>Correo Electrónico: ${result.value.email}</p>
                            <p>Dirección: ${result.value.direccion}</p>
                            <p>Compra finalizada correctamente.</p>
                        `,
                        icon: "success",
                        iconColor: "#009879"
                    });
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Algo salió mal",
                text: "Añada al menos un producto al carrito",
                footer: '<a href="busqueda.html">¿Volver a comprar?</a>',
                iconColor: "#B22222",
                confirmButtonColor: "#009879",
                color: "fff"
            })
        }
    })
}

function borrarTodoEventoAdd(){
    botonCancelar.addEventListener("click", ()=>{
        if(carrito.length > 0){
            console.log("click detectadoo")
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger"
                },
                buttonsStyling: true
              });
              swalWithBootstrapButtons.fire({
                title: "¿Estas seguro?",
                text: "Esta accion no se puede revertir",
                icon: "warning",
                iconColor: "#009879",
                showCancelButton: true,
                cancelButtonColor: "#B22222",
                confirmButtonColor: "#009879",
                confirmButtonText: "Si, ¡Quiero borrarlo!",
                cancelButtonText: "No, ¡Quiero cancelar!",
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {
                    carrito.length = 0
                    localStorage.removeItem("carrito")
                    cargarCarrito()
                    incrementarCarrito()
                    swalWithBootstrapButtons.fire({
                        title: "Carrito Borrado :(",
                        icon: "success",
                        iconColor: "#009879",
                        confirmButtonColor: "#009879"
                    });
                } else if (
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                  swalWithBootstrapButtons.fire({
                    title: "Cancelado",
                    text: "Tu carrito sigue aquí :)",
                    icon: "error",
                    iconColor: "#B22222",
                    confirmButtonColor: "#009879"
                  });
                }
              });
        }
    })
}

incrementarCarrito()
cargarCarrito()

comprarEventoAdd()
borrarTodoEventoAdd()