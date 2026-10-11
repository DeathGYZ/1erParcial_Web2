const carrito = document.querySelector('#carrito');
const listaConferencias = document.querySelector('#lista-conferencias');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const procesarPagoBtn = document.querySelector('#procesar-pago');

const modalPago = document.querySelector('#modal-pago');
const modalConfirmar = document.querySelector('#modal-confirmar');
const cerrarModalBtn = document.querySelector('.cerrar-modal');
const modalTotalTexto = document.querySelector('#modal-total-texto');
const btnConfirmarCompra = document.querySelector('#btn-confirmar-compra');

let articulosCarrito = [];
let tarjetaSeleccionada = '';

cargarEventListeners();

function cargarEventListeners() {
    listaConferencias.addEventListener('click', agregarConferencia);
    carrito.addEventListener('click', eliminarConferencia);
    vaciarCarritoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        articulosCarrito = [];
        limpiarHtml();
    });

    procesarPagoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (articulosCarrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        calcularTotalModal();
        modalPago.style.display = 'flex';
    });

    cerrarModalBtn.addEventListener('click', () => {
        modalPago.style.display = 'none';
    });

    const botonesTarjetas = document.querySelectorAll('.btn-tarjeta');
    botonesTarjetas.forEach(boton => {
        boton.addEventListener('click', (e) => {
            tarjetaSeleccionada = e.target.getAttribute('data-banco');
            modalPago.style.display = 'none';
            modalConfirmar.style.display = 'flex';
        });
    });

    btnConfirmarCompra.addEventListener('click', () => {
        alert(`¡Compra exitosa procesada con ${tarjetaSeleccionada}!`);
        articulosCarrito = [];
        limpiarHtml();
        modalConfirmar.style.display = 'none';
    });
}

function agregarConferencia(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const conferenciaSeleccionada = e.target.parentElement.parentElement;
        leerDatosConferencia(conferenciaSeleccionada);
    }
}

function eliminarConferencia(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const conferenciaId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(conferencia => conferencia.id !== conferenciaId);
        carritoHtml();
    }
}

function leerDatosConferencia(conferencia) {
    const infoConferencia = {
        titulo: conferencia.querySelector('h4').textContent,
        precio: conferencia.querySelector('.precio span').textContent,
        lugar: conferencia.querySelector('.lugar').textContent,
        hora: conferencia.querySelector('.hora').textContent,
        id: conferencia.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    const existe = articulosCarrito.some(conferencia => conferencia.id === infoConferencia.id);
    if (existe) {
        const conferencias = articulosCarrito.map(conferencia => {
            if (conferencia.id === infoConferencia.id) {
                conferencia.cantidad++;
                return conferencia;
            } else {
                return conferencia;
            }
        });
        articulosCarrito = [...conferencias];
    } else {
        articulosCarrito = [...articulosCarrito, infoConferencia];
    }

    carritoHtml();
}

function carritoHtml() {
    limpiarHtml();

    articulosCarrito.forEach(conferencia => {
        const { titulo, precio, lugar, hora, cantidad, id } = conferencia;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${titulo}</td>
            <td>${precio}</td>
            <td><small>${lugar}<br>${hora}</small></td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}" style="color: #002B49; font-weight: bold; text-decoration: none;">X</a></td>
        `;
        contenedorCarrito.appendChild(row);
    });
}

function calcularTotalModal() {
    let total = 0;
    articulosCarrito.forEach(conferencia => {
        let precioLimpio = parseFloat(conferencia.precio.replace('$', ''));
        total += precioLimpio * conferencia.cantidad;
    });
    modalTotalTexto.textContent = `Total a pagar: $${total.toFixed(2)}`;
}

function limpiarHtml() {
    contenedorCarrito.innerHTML = '';
}