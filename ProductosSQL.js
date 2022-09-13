import knexLib from "knex";

class ProductosSQL {
  constructor(config) {
    this.knex = knexLib(config);
  }

  createTable() {
    return this.knex.schema.dropTableIfExists("productos").finally(() => {
      return (
        this.knex.schema.createTable("productos"),
        (table) => {
          table.increments("id").primary();
          table.string("nombre", 50).notNullable();
          table.float("precio").notNullable();
          table.string("urlImagen").notNullable();
        }
      );
    });
  }
}

export default ProductosSQL;
