import ProductosSQL from "../../ProductosSQL.js";
import options from "../database/config.js";


const prodSql = new ProductosSQL(options)

const saveProduct = async (data) => {
  try {
    /* const response = await fetch("http://localhost:8080/api/productos", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json(); */
    console.log(data);
    prodSql.insertar(data).then((data)=>{
      console.log("Producto guardado ==>", data);
    })
    
  } catch (error) {
    let err = new Error(error);
    return err;
  }
};

export {saveProduct}