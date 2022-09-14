import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { router } from "./src/router/routes.js";
import { engine } from "express-handlebars";
import ProductosSQL from "./src/database/ProductosSQL.js";
import options from "./src/options/mariaDb.js";
import { saveProduct } from "./src/utils/saveProduct.js";
import ChatSQL from "./src/database/chatDb.js";
import optionsChat from "./src/options/sqlite3.js";


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// SOCKET
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const messages = [];

//HANDLEBARS

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/Handlebars/views");

app.get("/", (req, res) => {
  res.render("datos");
});

app.use("/api/productos", router);


const prodSql = new ProductosSQL(options)
const chatSql = new ChatSQL(optionsChat)


io.on("connection", async (socket) => {
  console.log("a user connected");


  prodSql.createTable().then((data) => {
    console.log("Tabla Productos creada");
    prodSql.consultar().then((data) => {
      socket.emit("todosLosProductos", data);
    })
  })


  /*   socket.emit("todosLosProductos", productos);
   */
  const chatINFO = await chatSql.consultar()
  if (chatINFO === []) {
    await chatSql.createTable()
  }

  console.log(chatINFO);
  socket.emit("todosLosMensajes", chatINFO);

  socket.on("productoGuardado", async (data) => {
    await saveProduct(data).then((data) => {
      prodSql.consultar().then((productos) => {
        console.log("Consultando todos los productos");
        io.sockets.emit("todosLosProductos", productos);
      })
    })


  });

  socket.on("nuevoMensaje", async (data) => {
    await chatSql.insertar(data)
    const chatINFO = await chatSql.consultar()
    io.sockets.emit("todosLosMensajes", chatINFO);
  });
});

const PORT = process.env.PORT || 8080;

const connectedServer = httpServer.listen(PORT, () => {
  console.log("Servidor http con web sockets listo");
});

connectedServer.on("error", (error) => console.log);
