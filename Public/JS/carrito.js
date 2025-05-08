// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrito.js cargado correctamente');
    
    // Inicializar el carrito en localStorage si no existe
    if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', JSON.stringify([]));
    }
    
    // Configurar solo los enlaces al carrito
    const enlacesCarrito = document.querySelectorAll('a[href="/Carrito"]');
    
    enlacesCarrito.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            // Verificar si el usuario ha iniciado sesión
            const userLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
            
            if (!userLoggedIn) {
                e.preventDefault(); // Prevenir la navegación
                
                // Mostrar mensaje de que debe iniciar sesión
                Swal.fire({
                    title: 'Inicio de sesión requerido',
                    text: 'Debes iniciar sesión para acceder al carrito',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
            }
        });
    });
    
    // Configurar los botones "Agregar al carrito" en los modales de productos
    function configurarBotonesAgregar() {
        // Seleccionar todos los botones de agregar al carrito en los modales
        const botonesAgregar = document.querySelectorAll('.modalCard a.btn-success');
        
        // Primero, eliminar todos los event listeners existentes clonando los botones
        botonesAgregar.forEach(boton => {
            const nuevoBoton = boton.cloneNode(true);
            boton.parentNode.replaceChild(nuevoBoton, boton);
        });
        
        //añadir los nuevos event listeners a los botones clonados
        document.querySelectorAll('.modalCard a.btn-success').forEach(boton => {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Verificar si el usuario ha iniciado sesión
                const userLoggedIn = document.body.getAttribute('data-user-logged-in') === 'true';
                
                if (!userLoggedIn) {
                    // Mostrar mensaje de que debe iniciar sesión
                    Swal.fire({
                        title: 'Inicio de sesión requerido',
                        text: 'Debes iniciar sesión para agregar productos al carrito',
                        icon: 'warning',
                        confirmButtonText: 'Entendido'
                    });
                    return;
                }
                
                // Obtener el modal que contiene este botón
                const modal = this.closest('.modalCard');
                
                // Obtener datos del producto desde el modal
                const nombre = modal.querySelector('#modal-title').textContent;
                const imagen = modal.querySelector('#modal-image').src;
                const precioTexto = modal.querySelector('#modal-price').textContent;
                
                // Extraer el valor numérico del precio
                const precioMatch = precioTexto.match(/\d[\d\.,]*/);
                const precioStr = precioMatch ? precioMatch[0].replace(/\./g, '').replace(',', '.') : '0';
                const precio = parseFloat(precioStr);
                
                // Crear un ID único para el producto basado en su nombre
                const productoId = nombre.toLowerCase().replace(/\s+/g, '-');
                
                // Obtener el carrito actual
                const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                
                // Verificar si el producto ya está en el carrito
                const productoExistente = carrito.find(item => item.productoId === productoId);
                
                if (productoExistente) {
                    // Incrementar la cantidad si ya existe
                    productoExistente.cantidad += 1;
                    productoExistente.subtotal = productoExistente.precioUnitario * productoExistente.cantidad;
                } else {
                    // Añadir nuevo producto al carrito
                    carrito.push({
                        productoId: productoId,
                        nombre: nombre,
                        imagen: imagen,
                        cantidad: 1,
                        precioUnitario: precio,
                        subtotal: precio
                    });
                }
                
                // Guardar el carrito actualizado
                localStorage.setItem('carrito', JSON.stringify(carrito));
                
                // Mostrar mensaje de confirmación con SweetAlert2
                Swal.fire({
                    title: '¡Producto añadido!',
                    text: `${nombre} ha sido añadido al carrito`,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    timer: 2000,
                    timerProgressBar: true,
                    position: 'center'
                });
                
                // Cerrar el modal
                modal.classList.remove('active');
                const cardContent = document.querySelector('.cardContent');
                if (cardContent) {
                    cardContent.classList.remove('active');
                }
                
                console.log('Carrito actualizado:', carrito);
            });
        });
    }
    
    // Variable para controlar si ya se configuraron los botones
    let botonesConfigurados = false;
    
    // Ejecutar la configuración inicial solo una vez
    if (!botonesConfigurados) {
        configurarBotonesAgregar();
        botonesConfigurados = true;
    }
    

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('det-modal')) {
            // Esperar a que el modal se abra completamente
            setTimeout(configurarBotonesAgregar, 100);
        }
    });
});





