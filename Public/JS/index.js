
// =============================MODO OSCURO ORIGINAL==============================
// document.addEventListener("DOMContentLoaded", function() {
//     var icon = document.getElementById("DarkMode");

//     icon.addEventListener("click", function() {
//         document.body.classList.toggle("dark-theme");
//         if (document.body.classList.contains("dark-theme")) {
//             icon.classList.remove("fa-moon");
//             icon.classList.add("fa-sun");
//         } else {
//             icon.classList.remove("fa-sun");
//             icon.classList.add("fa-moon");
//         }
//     });
// });
// =============================MODO OSCURO ORIGINAL==============================

document.addEventListener("DOMContentLoaded", function() {
    // ===== MODO OSCURO =====
    const darkModeIcon = document.getElementById("DarkMode");
    
    // Cargar el estado del tema desde localStorage
    if (localStorage.getItem('theme') === 'dark-theme') {
        document.body.classList.add("dark-theme");
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
    }
    
    if (darkModeIcon) {
        darkModeIcon.addEventListener("click", function() {
            document.body.classList.toggle("dark-theme");
            
            if (document.body.classList.contains("dark-theme")) {
                darkModeIcon.classList.remove("fa-moon");
                darkModeIcon.classList.add("fa-sun");
                localStorage.setItem('theme', 'dark-theme');
            } else {
                darkModeIcon.classList.remove("fa-sun");
                darkModeIcon.classList.add("fa-moon");
                localStorage.setItem('theme', 'light-theme');
            }
        });
    }
});


//===============================FUNCION SEARCH================================
// Lista de productos con sus enlaces correspondientes
const productos = [
    { nombre: "Samsung S22 Ultra", enlace: "/celulares" },
    { nombre: "Iphone 14", enlace: "/celulares" },
    { nombre: "Motorola G60", enlace: "/celulares" },
    { nombre: "Play Station 5 Standar", enlace: "/consolas" },
    { nombre: "ps5", enlace:"/consolas"},
    { nombre: "Xbox Serie X", enlace: "/consolas" },
    { nombre: "Nintendo Switch", enlace: "/consolas" },
    { nombre: "Notebook Acer", enlace: "/portatiles" },
    { nombre: "Notebook Hp Gamer", enlace: "/portatiles" },
    { nombre: "Monitor Master G", enlace: "/monitores" },
    { nombre: "Monitor Caixun", enlace: "/monitores" },
    { nombre: "Monitor ELSA", enlace: "/monitores" },
    { nombre: "Productos", enlace: "/Productos"},
    { nombre: "Celulares", enlace: "/celulares"},
    { nombre: "Consolas", enlace: "/consolas"},
    { nombre: "Portatiles", enlace: "/portatiles"},
    { nombre: "Computadoras", enlace: "/ortatiles"},
    { nombre: "Monitores", enlace: "/monitores"},
    { nombre: "Pantallas", enlace:"/monitores"}
];

// Función para buscar coincidencias
function buscar() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const suggestionsList = document.getElementById('resultList');

    // Limpiar la lista de sugerencias
    suggestionsList.innerHTML = '';

    //Limpiar lista de sugerencias si en el input se borra lo escrito
    if(input === ''){
        suggestionsList.style.display='none';
        return
    }

    // Buscar productos que coincidan con lo ingresado en el input
    const resultados = productos.filter(producto => producto.nombre.toLowerCase().includes(input));

    // Mostrar sugerencias con lo ingresado
    resultados.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result.nombre;
        li.onclick = function() {
            window.location.href = result.enlace; // Redirigir al enlace correspondiente
        };
        suggestionsList.appendChild(li);
    });

    // Mostrar u ocultar la lista según si hay resultados
    if (resultados.length === 0) {
        suggestionsList.style.display = 'none';
    } else {
        suggestionsList.style.display = 'block';
    }
}


//=====================MODAL LOGIN================


const abrirModal = document.getElementById('myBtn');
    const modall = document.getElementById('myModal');
    const contModal = document.getElementById('cont-todo');
    const cerrarModal = document.getElementById('close');
    const cerrarModal2 = document.getElementById('closes');
    
    // Verificar si el usuario está logueado
    fetch('/user')
        .then(response => response.json())
        .then(user => {
            if (abrirModal && modall && contModal) {
                abrirModal.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    if (!user || Object.keys(user).length === 0) {
                        // Si NO hay sesión iniciada, abre el modal normalmente
                        modall.classList.add('active');
                        contModal.classList.add('active');
                        modall.style.display = 'block';
                    } else {
                        // Si hay sesión, muestra un SweetAlert
                        Swal.fire({
                            title: 'Hola, ' + user.name,
                            text: '¿Querés cerrar sesión?',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Cerrar sesión',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '/logout';
                            }
                        });
                    }
                });
            }
        })
        .catch(error => console.log('Error obteniendo el usuario:', error));
    
    // Cerrar modal de login/register
    if (cerrarModal) {
        cerrarModal.addEventListener('click', function() {
            modall.classList.remove('active');
            contModal.classList.remove('active');
            modall.style.display = 'none';
        });
    }
    
    if (cerrarModal2) {
        cerrarModal2.addEventListener('click', function() {
            modall.classList.remove('active');
            contModal.classList.remove('active');
            modall.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === modall) {
            modall.style.display = 'none';
            modall.classList.remove('active');
            contModal.classList.remove('active');
        }
    });
    
    // Cambiar entre login y registro
    const btnIniciarSesion = document.getElementById("btn-iniciar-sesion");
    const btnRegistrarse = document.getElementById("btn-iniciar-registrarse");
    const contLoginRegister = document.querySelector(".contenedorLogin-Register");
    const formularioLogin = document.querySelector(".formulario-Login");
    const formularioRegister = document.querySelector(".formulario-Register");
    const cajaTraseraLogin = document.querySelector(".cajaTrasera-login");
    const cajaTraseraRegister = document.querySelector(".cajaTrasera-register");
    
    // Función para ajustar según el ancho de la pantalla
    function anchoPagina() {
        if (window.innerWidth > 720) {
            if (cajaTraseraLogin) cajaTraseraLogin.style.display = "block";
            if (cajaTraseraRegister) cajaTraseraRegister.style.display = "block";
        } else {
            if (cajaTraseraRegister) {
                cajaTraseraRegister.style.display = "block";
                cajaTraseraRegister.style.opacity = "1";
            }
            if (cajaTraseraLogin) cajaTraseraLogin.style.display = "none";
            if (formularioLogin) formularioLogin.style.display = "block";
            if (formularioRegister) formularioRegister.style.display = "none";
            if (contLoginRegister) contLoginRegister.style.left = "0px";
        }
    }
    
    // Ejecutar al cargar
    anchoPagina();
    
    // Función para mostrar el formulario de inicio de sesión
    function iniciarSesion() {
        if (!formularioRegister || !contLoginRegister || !formularioLogin || 
            !cajaTraseraRegister || !cajaTraseraLogin) return;
            
        if (window.innerWidth > 720) {
            formularioRegister.style.display = "none";
            contLoginRegister.style.left = "10px";
            formularioLogin.style.display = "block";
            cajaTraseraRegister.style.opacity = "1";
            cajaTraseraLogin.style.opacity = "0";
        } else {
            formularioRegister.style.display = "none";
            contLoginRegister.style.left = "0px";
            formularioLogin.style.display = "block";
            cajaTraseraRegister.style.display = "block";
            cajaTraseraLogin.style.display = "none";
        }
    }
    
    // Función para mostrar el formulario de registro
    function register() {
        if (!formularioRegister || !contLoginRegister || !formularioLogin || 
            !cajaTraseraRegister || !cajaTraseraLogin) return;
            
        if (window.innerWidth > 720) {
            formularioRegister.style.display = "block";
            contLoginRegister.style.left = "410px";
            formularioLogin.style.display = "none";
            cajaTraseraRegister.style.opacity = "0";
            cajaTraseraLogin.style.opacity = "1";
        } else {
            formularioRegister.style.display = "block";
            contLoginRegister.style.left = "0px";
            formularioLogin.style.display = "none";
            cajaTraseraRegister.style.display = "none";
            cajaTraseraLogin.style.display = "block";
            cajaTraseraLogin.style.opacity = "1";
        }
    }
    
    // Asignar eventos a los botones
    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener("click", iniciarSesion);
    }
    
    if (btnRegistrarse) {
        btnRegistrarse.addEventListener("click", register);
    }
    
    // Ajustar al cambiar el tamaño de la ventana
    window.addEventListener("resize", anchoPagina);


//=====================MODAL LOGIN================






// ====================MODALCRUD=================

// ======================MODAL CREATE USER=============
const ModalCreate = document.getElementById("createModal");
    const contModalCreate = document.getElementById("createContent");
    const openModal = document.getElementById("newUser");
    const closeCreate = document.getElementById("closeCreate");
    
    if (openModal && ModalCreate && contModalCreate) {
        openModal.addEventListener('click', function(e) {
            e.preventDefault();
            ModalCreate.classList.add('active');
            contModalCreate.classList.add('active');
            ModalCreate.style.display = 'block';
        });
    }
    
    if (closeCreate && ModalCreate && contModalCreate) {
        closeCreate.addEventListener('click', function() {
            ModalCreate.classList.remove('active');
            contModalCreate.classList.remove('active');
            ModalCreate.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (ModalCreate && contModalCreate) {
        window.addEventListener('click', function(event) {
            if (event.target === ModalCreate) {
                ModalCreate.style.display = 'none';
                ModalCreate.classList.remove('active');
                contModalCreate.classList.remove('active');
            }
        });
    }



// ================MODAL EDIT USER================



const ModalUpdate = document.getElementById("updateModal");
    const contModalUpdate = document.getElementById("updateContent");
    const UpdateClose = document.getElementById("closeUpdate");
    const openModalUpdateButtons = document.querySelectorAll(".funciones-edit");
    
    if (openModalUpdateButtons.length > 0) {
        openModalUpdateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                const userNombre = this.getAttribute('data-name');
                const userEmail = this.getAttribute('data-email');
                const userRol = this.getAttribute('data-rol');
                
                const updateNombre = document.getElementById('updateNombre');
                const updateEmail = document.getElementById('updateEmail');
                const updateRol = document.getElementById('updateRol');
                const updateForm = document.getElementById('updateForm');
                
                if (updateNombre) updateNombre.value = userNombre;
                if (updateEmail) updateEmail.value = userEmail;
                if (updateRol) updateRol.value = userRol;
                
                if (updateForm) updateForm.action = `/updateUser/${userId}`;
                
                if (ModalUpdate && contModalUpdate) {
                    ModalUpdate.classList.add('active');
                    contModalUpdate.classList.add('active');
                    ModalUpdate.style.display = 'block';
                }
            });
        });
    }
    
    if (UpdateClose && ModalUpdate && contModalUpdate) {
        UpdateClose.addEventListener('click', function() {
            ModalUpdate.classList.remove('active');
            contModalUpdate.classList.remove('active');
            ModalUpdate.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (ModalUpdate && contModalUpdate) {
        window.addEventListener('click', function(event) {
            if (event.target === ModalUpdate) {
                ModalUpdate.style.display = 'none';
                ModalUpdate.classList.remove('active');
                contModalUpdate.classList.remove('active');
            }
        });
    }









    
// =============MODAL DE CARDS=====================

document.addEventListener("DOMContentLoaded", () => {
    var abrirCard = document.querySelectorAll(".det-modal"),
      modal = document.getElementById("modalCard"),
      modalCardImg = document.getElementById("modal-image"),
      modalTitle = document.getElementById("modal-title"),
      modalDetail = document.getElementById("modal-details-list"),
      modalPrice = document.getElementById("modal-price"),
      cerrarCard = document.getElementById("closeCard")
  
    abrirCard.forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault()
  
        var card = this.closest(".card")
  
        var tittleProd = card.getAttribute("data-product")
        var productImg = card.getAttribute("data-image")
        var productDescription = card.getAttribute("data-description")
        var productPrice = card.getAttribute("data-price")
  
        var dataRAM = card.getAttribute("data-memoria")
        var dataAlmaC = card.getAttribute("data-almacenamiento")
        var dataCamara = card.getAttribute("data-camara")
        var dataColor = card.getAttribute("data-color")
        var dataJuegos = card.getAttribute("data-juegos")
        var dataProce = card.getAttribute("data-proce")
        var dataPantalla = card.getAttribute("data-pantalla")
        var dataImagen = card.getAttribute("data-imagen")
        var dataDimencion = card.getAttribute("data-dimenciones")
  
        modalTitle.textContent = tittleProd
        modalCardImg.src = productImg
  
        modalDetail.innerHTML = ""
  
        var details = [`Descripción: ${productDescription}`]
  
        if (dataRAM) details.push(`Memoria RAM: ${dataRAM}`)
        if (dataAlmaC) details.push(`Almacenamiento: ${dataAlmaC}`)
        if (dataCamara) details.push(`Camara: ${dataCamara}`)
        if (dataColor) details.push(`Color: ${dataColor}`)
        if (dataJuegos) details.push(`Juegos incluidos: ${dataJuegos}`)
        if (dataProce) details.push(`Procesador: ${dataProce}`)
        if (dataPantalla) details.push(`Tamaño de pantalla: ${dataPantalla}`)
        if (dataImagen) details.push(`Velocidad de imagen: ${dataImagen}`)
        if (dataDimencion) details.push(`Dimenciones: ${dataDimencion}`)
  
        details.forEach((detail) => {
          var li = document.createElement("li")
          li.textContent = detail
          modalDetail.appendChild(li)
        })
  
        modalPrice.innerHTML = `<strong>Precio: $${productPrice}</strong>`
  
        modal.classList.add("active")
        document.getElementById("cardContentt").classList.add("active")
      })
    })
  
    cerrarCard.addEventListener("click", () => {
      modal.classList.remove("active")
      document.getElementById("cardContentt").classList.remove("active")
    })
  
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.classList.remove("active")
        document.getElementById("cardContentt").classList.remove("active")
      }
    })
  })




// var abrirCard = document.querySelectorAll('.det-modal'),
//     modal = document.getElementById('modalCard'),
//     modalCardImg = document.getElementById('modal-image'),
//     modalTitle = document.getElementById('modal-title'),
//     modalDetail=document.getElementById('modal-details-list'),
//     modalPrice=document.getElementById('modal-price'),
//     cerrarCard = document.getElementById('closeCard')

    

// abrirCard.forEach(function(button){
//     button.addEventListener('click', function(event){
//         event.preventDefault();

//         var card = this.closest('.card');

//         var tittleProd = card.getAttribute('data-product');
//         var productImg = card.getAttribute('data-image');
//         var productDescription = card.getAttribute('data-description');
//         var productPrice = card.getAttribute('data-price');


//         var dataRAM=card.getAttribute('data-memoria');
//         var dataAlmaC=card.getAttribute('data-almacenamiento');
//         var dataCamara=card.getAttribute('data-camara');
//         var dataColor=card.getAttribute('data-color');
//         var dataJuegos=card.getAttribute('data-juegos');
//         var dataProce=card.getAttribute('data-proce');
//         var dataPantalla=card.getAttribute('data-pantalla');
//         var dataImagen=card.getAttribute('data-imagen');
//         var dataDimencion=card.getAttribute('data-dimenciones');

//         modalTitle.textContent = tittleProd;
//         modalCardImg.src= productImg;

//         modalDetail.innerHTML='';

//         var details=[
//             `Descripción: ${productDescription}`  
//         ];

//         if (dataRAM) details.push(`Memoria RAM: ${dataRAM}`);
//         if (dataAlmaC) details.push(`Almacenamiento: ${dataAlmaC}`);
//         if (dataCamara) details.push(`Camara: ${dataCamara}`);
//         if (dataColor) details.push(`Color: ${dataColor}`);
//         if (dataJuegos) details.push(`Juegos incluidos: ${dataJuegos}`);
//         if (dataProce) details.push(`Procesador: ${dataProce}`);
//         if (dataPantalla) details.push(`Tamaño de pantalla: ${dataPantalla}`);
//         if (dataImagen) details.push(`Velocidad de imagen: ${dataImagen}`);
//         if (dataDimencion) details.push(`Dimenciones: ${dataDimencion}`);
        

//         details.forEach(function(detail){
//             var li = document.createElement('li');
//             li.textContent=detail;
//             modalDetail.appendChild(li);
//         });

//         modalPrice.innerHTML= `<strong style="font-size:24px; color:#0074c7;">Precio: $${productPrice}</strong>`;
        
//         modal.classList.add('active');
//         document.querySelector('.cardContent').classList.add('active');
//     });
// });

// cerrarCard.onclick = function(){
//     modal.classList.remove('active');
//     document.querySelector('.cardContent').classList.remove('active');
// };




window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove('active');
        document.querySelector('.cardContent').classList.remove('active');
    }
};




// ALERTA PARA ELIMINAR USUARIO
function deleteUser(id) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirige a la ruta que elimina el usuario
        window.location.href = `/deleteUser/${id}`;
      }
    });
  }