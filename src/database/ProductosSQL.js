import knexLib from "knex";

class ProductosSQL {
  constructor(config) {
    this.knex = knexLib(config);
  }

  createTable() {
    return this.knex.schema.hasTable('productos').then((exists) => {
      if (!exists) {
        return this.knex.schema.createTable("productos", (table) => {
          table.increments("id").primary();
          table.string("nombre", 50).notNullable();
          table.float("precio").notNullable();
          table.string("imagenUrl").notNullable();
        })
      }
    });

  }
  insertar(data) {
    return this.knex("productos").insert(data)
  }
  consultar() {
    return this.knex("productos").select("*")
  }
  borrarTodo() {
    return this.knex("productos").del("*")
  }


}

export default ProductosSQL;


