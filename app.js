//invocar express
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const app = express();
// const mysql =require("mysql2")


//invocando express session
// const session = require('express-session');

// app.use(session({
//   secret: 'tu_secretito',
//   resave: false,
//   saveUninitialized: false
// }));

// setear urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//invocar dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//recursos
// app.use('/resources', express.static('CSS'))
// app.use('/images', express.static('Image'))
// app.use('/javascript', express.static('index.js'))
app.use(express.static('Public'));

//estableciendo motor de plantillas
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');


//Destacar nav segun la vista que este actualmente
app.use((req, res, next) => {
    // Obtener la ruta actual sin la barra inicial
    const path = req.path.substring(1);

    // Establecer la página actual basada en la ruta
    res.locals.currentPage = path || 'index';

    next();
});

//invocando modulo para hah de las contraseñas (en resumen para poder encriptar las contraseñas...)
const bcryptjs = require('bcryptjs');

//configurando variables de sesion
const sesion = require('express-session');
app.use(sesion({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));



// middleware para compartir datos de sesión con todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.isLoggedIn = !!req.session.user
    next();
});


//invocando modulo de conección
const connection = require('./database/db.js');
const { name } = require('ejs');



// app.get('/', (req, res)=>{
//     res.send('HOLA MUNDOOOO ');
// });



//Estableciendo rutas (vistas)
// En tu archivo app.js
app.get("/", (req, res) => {
    // Obtener productos destacados u otra lógica que ya tengas
    connection.query("SELECT * FROM productos ORDER BY RAND() LIMIT 6", (error, productos) => {
      if (error) {
        console.error("Error al obtener productos:", error);
        return res.status(500).send("Error al cargar la página");
      }
  
      // Verificar si hay una alerta en la sesión
      const alert = req.session.alert || null;
      
      res.render("index", {
        title: "Inicio",
        user: req.session.user,
        productos: productos,
        // Pasar las variables de alerta con valores predeterminados si no existen
        // alertTitle: alert ? alert.alertTitle : null,
        // alertMessage: alert ? alert.alertMessage : null,
        // alertIcon: alert ? alert.alertIcon : null,
        // showConfirmButton: alert ? alert.showConfirmButton : true,
        // timer: alert ? alert.timer : null,
        // ruta: alert ? alert.ruta : ""
      });
      
      // Limpiar la alerta de la sesión después de usarla
      delete req.session.alert;
    });
  });


app.get('/productos', (req, res) => {
    obtenerProductos((error, productos) => {
        if (error) {
            console.error("Error al obtener productos", error)
            return res.status(500).send("Error al cargar la pagina")
        }

        res.render('productos', {
            title: 'Productos',
            user: req.session.user,
            alert: req.session.alert,
            productos: productos
        });
        delete req.session.alert;
    })
});

app.get('/404', (req, res) =>{
    res.render('404')
});

app.get('/celulares', (req, res) => {
    obtenerProductosPorCategoria("celulares", (error, productos) => {
        if (error) {
            console.error("Error al obtener los productos", error)
            return res.status(500).send("Error al cargar la pagina")
        }

        res.render('celulares', {
            title: 'Celulares',
            user: req.session.user,
            alert: req.session.alert,
            productos: productos
        });
        delete req.session.alert;
    })
});

app.get('/consolas', (req, res) => {
    obtenerProductosPorCategoria("consolas", (error, productos) => {
        if (error) {
            console.error("Error al obtener los productos", error)
            return res.status(500).send("Error al cargar la pagina")
        }

        res.render('consolas', {
            title: 'Consolas',
            user: req.session.user,
            alert: req.session.alert,
            productos: productos
        });
        delete req.session.alert;
    })
});

app.get('/portatiles', (req, res) => {
    obtenerProductosPorCategoria("portatiles", (error, productos) => {
        if (error) {
            console.error("Error al obtener los productos", error)
            return res.status(500).send("Error al cargar la pagina")
        }

        res.render('portatiles', {
            title: 'Portatiles',
            user: req.session.user,
            alert: req.session.alert,
            productos: productos
        });
        delete req.session.alert;
    })
});

app.get('/monitores', (req, res) => {
    obtenerProductosPorCategoria("monitores", (error, productos) => {
        if (error) {
            console.error("Error al obtener los productos", error)
            return res.status(500).send("Error al cargar la pagina")
        }

        res.render('monitores', {
            title: 'Monitores',
            user: req.session.user,
            alert: req.session.alert,
            productos: productos
        });
        delete req.session.alert
    })
});

app.get("/Carrito", (req, res) => {
    // Verificar si el usuario ha iniciado sesión
    if (!req.session.user) {
        // Si no ha iniciado sesión, redirigir a la página de inicio de sesión
        req.session.alert = {
            alertTitle: "Inicio de sesión requerido",
            alertMessage: "Debes iniciar sesión para ver tu carrito",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
        };
        return res.redirect("/");
    }

    // Si ha iniciado sesión, mostrar la página del carrito
    res.render("Carrito", {
        title: "Carrito de Compras",
        user: req.session.user,
        alert: req.session.alert,
    });
    delete req.session.alert;
});





app.get('/crudUser', (req, res) => {
    // Verificar si el usuario está autenticado y tiene permisos
    if (!req.session.user || req.session.user.rol !== 'adim') {
        return res.redirect('/');
    }

    // Obtener todos los usuarios de la base de datos
    connection.query('SELECT * FROM users', (error, users) => {
        if (error) {
            console.error('Error al obtener usuarios:', error);
            return res.status(500).send('Error al cargar la página');
        }

        const alertToShow = req.session.alert;
        delete req.session.alert;


        res.render('crudUser', {
            users: users,
            layout: false,
            alert: alertToShow
        });


    });
});



app.get('/user', (req, res) => {
    res.json(req.session.user || null);
});


//registrar usuarios
app.post('/register', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    //   const rol = req.body.rol;
    const pass = req.body.pass;


    if (!name || !email || !pass) {
        req.session.alert = {
            alertTitle: "Error",
            alertMessage: "Todos los campos son obligatorios",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'crudUser'
        };
        return res.redirect('/');
    }
    // Verificar si el email ya existe
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('index', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Error en el servidor",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }

        if (results.length > 0) {
            return res.render('index', {
                
                alert: true,
                alertTitle: "Error",
                alertMessage: "El email ya está registrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: ''
                
            });
        }

        // Si el email no existe, crear el usuario
        let passwordHash = await bcryptjs.hash(pass, 8);
        connection.query('INSERT INTO users SET ?', {
            name: name,
            email: email,
            password: passwordHash,
            //   rol: rol
        }, async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('index', {
                    
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al registrar usuario",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                    
                });
            }

            res.render('index', {
                
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Usuario registrado correctamente!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
                
            });
        });
    });
});



// REGISTRAR USUARIOS DESDE EL CRUD
app.post('/createUser', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const rol = req.body.rol;
    const pass = req.body.pass;

    //console.log('Datos recibidos:', { name, email, rol, pass });

    if (!name || !email || !pass || !rol) {
        req.session.alert = {
            alertTitle: "Error",
            alertMessage: "Todos los campos son obligatorios",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: ''
        };
        return res.redirect('/crudUser');
    }

    try {
        // Verificar si el email ya existe
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
                req.session.alert = {
                    alertTitle: "Error",
                    alertMessage: "Error en el servidor",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                };
                return res.redirect('/crudUser');
            }

            if (results.length > 0) {
                req.session.alert = {
                    alertTitle: "Error",
                    alertMessage: "El email ya está registrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                };
                return res.redirect('/crudUser');
            }

            // Si el email no existe, crear el usuario
            let passwordHash = await bcryptjs.hash(pass, 8);
            connection.query('INSERT INTO users SET ?', {
                name: name,
                email: email,
                password: passwordHash,
                rol: rol
            }, (error, results) => {
                if (error) {
                    console.log(error);
                    req.session.alert = {
                        alertTitle: "Error",
                        alertMessage: "Error al crear usuario",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: ''
                    };
                } else {
                    req.session.alert = {
                        alertTitle: "¡Éxito!",
                        alertMessage: "Usuario creado correctamente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    };
                }
                res.redirect('/crudUser');
            });
        });
    } catch (error) {
        console.log(error);
        req.session.alert = {
            alertTitle: "Error",
            alertMessage: "Error interno del servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'crudUser'
        };
        res.redirect('/crudUser');
    }
});

//autenticar y con mensajes usando Sweetalert2
app.post('/auth', async (req, res) => {
    const { email, pass } = req.body;

    if (email && pass) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) return res.send('Error en el servidor');

            if (results.length === 0) {
                return res.render('index', {
                   
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario no encontrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                    
                });
            }

            const user = results[0];
            const match = await bcryptjs.compare(pass, user.password);

            if (!match) {
                return res.render('index', {
                    
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                    
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                rol: user.rol
            };

            res.render('index', {
                
                    alert: true,
                    alertTitle: `¡Bienvenido!, ${user.name}`,
                    alertMessage: "Inicio de sesión correcto",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta: '',
                    user: req.session.user
                
            });
        });
    } else {
        res.render('index', {
                alert: true,
                alertTitle: "Campos vacíos",
                alertMessage: "Por favor completá usuario y contraseña",
                alertIcon: 'warning',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            
        });
    }
});


//Cerrar sesion 
app.get('/logout', (req, res) => {
    // Cerrar la sesión
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');

        }

        res.clearCookie('connect.sid');  // Limpiar la cookie de sesión
        res.redirect('/?logout=succes');   // Si ocurre un error, redirigir a la página principal

    });
});




// FUNCION PARA ELIMINAR USUARIOS
app.get('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;

    // Verificar si el usuario está autenticado y tiene permisos
    if (!req.session.user || req.session.user.rol !== 'adim') {
        req.session.alert = {
            alertTitle: "Error",
            alertMessage: "No tienes permisos para realizar esta acción",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: ""
        };
        return res.redirect('/');
    }

    connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            req.session.alert = {
                alertTitle: "Error",
                alertMessage: "Error al eliminar el usuario",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: "crudUser"
            };
        } else {
            req.session.alert = {
                alertTitle: "Eliminado",
                alertMessage: "Usuario eliminado correctamente",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ""
            };
        }

        res.redirect('/crudUser');

    });
});


// FUNCION EDITAR USUARIO
app.post('/updateUser/:id', async (req, res) => {
    const id = req.params.id;
    const { name, email, pass, rol } = req.body;

    // Verificar si el usuario está autenticado y tiene permisos
    if (!req.session.user || req.session.user.rol !== 'adim') {
        req.session.alert = {
            alertTitle: "Error",
            alertMessage: "No tienes permisos para realizar esta acción",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: ""
        };
        return res.redirect('/');
    }

    try {
        let query = 'UPDATE users SET name = ?, email = ?, rol = ?';
        const params = [name, email, rol];

        if (pass && pass.trim() !== '') {
            const hashedPassword = await bcryptjs.hash(pass, 8);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                req.session.alert = {
                    alertTitle: 'Error',
                    alertMessage: 'Hubo un problema al actualizar el usuario.',
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                };
            } else {
                req.session.alert = {
                    alertTitle: '¡Actualizado!',
                    alertMessage: 'Usuario actualizado correctamente.',
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta: 'crudUser'
                };
            }
            res.redirect('/crudUser');
        });
    } catch (err) {
        console.error('Error en el servidor:', err);
        req.session.alert = {
            alertTitle: 'Error',
            alertMessage: 'Error interno del servidor.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: ''
        };
        res.redirect('/crudUser');
    }
});




function obtenerProductos(callback) {
    connection.query("SELECT * FROM productos", callback)
}

function obtenerProductosPorCategoria(categoria, callback) {
    connection.query("SELECT * FROM productos WHERE categoria = ?", [categoria], callback)
}





app.get('/api/productos', (req, res) => {
    obtenerProductos((error, productos) => {
        if (error) {
            console.error("Error al obtener productos:", error);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(productos);
    });
});







// ========================PARTE CARRO DE COMPRAS==============================


const swalConfig = {
    position: 'center', // Centra la alerta en la pantalla
    customClass: {
        container: 'my-swal-container', // Clase personalizada para el contenedor
        popup: 'my-swal-popup' // Clase personalizada para el popup
    }
};

// Middleware que borra alert después de renderizar la página
// app.use((req, res, next) => {
//   res.locals.alert = req.session.alert;
//   delete req.session.alert;
//   next();
// });

app.use((req, res) => {
    res.status(404).render("404", { title: "Página no encontrada" })
  })


const PORT =  process.env.PORT || 4000
app.listen(PORT, (req, res) => {
    console.log('SERVER CORRIENDO EN http://localhost:4000');
});

module.exports = app