import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { router } from "./src/router/routes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// SOCKET
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const messages = [];

//HANDLEBARS
import { engine } from "express-handlebars";
import ProductosSQL from "./ProductosSQL.js";


const options ={
  client: "mysql",
  connection:{
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'deganutti'
  }
}
const prodSql = new ProductosSQL(options)

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/Handlebars/views");

app.get("/", (req, res) => {
  res.render("datos");
});

app.use("/api/productos", router);

io.on("connection", async (socket) => {
  console.log("a user connected");


  prodSql.createTable().then((data)=>{
    console.log(data);
  })


/*   socket.emit("todosLosProductos", productos);
 */
/*   const chatINFO = await readChat();
 */
/*   socket.emit("todosLosMensajes", chatINFO);
 */
  /* socket.on("productoGuardado", async (data) => {
    await saveProduct(data);
    io.sockets.emit("todosLosProductos", productos);
  }); */

  /* socket.on("nuevoMensaje", async (data) => {
    await insertChat(data);
    io.sockets.emit("todosLosMensajes", await readChat());
  }); */
});

const PORT = process.env.PORT || 8080;

const connectedServer = httpServer.listen(PORT, () => {
  console.log("Servidor http con web sockets listo");
});

connectedServer.on("error", (error) => console.log);
