const mysql = require("mysql");
require("dotenv").config();

class DataBase {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  /**
   * Insert new row into a table
   * @param {String} tableName Name of the table where we want to add data
   * @param {*} post Values of the new row
   * @returns Result of the function
   */
  async insertInto(tableName, post) {
    const insertion = new Promise((resolve, reject) => {
      this.pool.query(
        `INSERT INTO ${tableName} SET ?`,
        post,
        (error, results) => {
          if (error) {
            console.log(error);
            reject({
              msg: "Insertion failed.",
            });
          } else {
            resolve({
              msg: "New row inserted successfully",
              insertedId: results.insertId,
            });
          }
        }
      );
    });
    return insertion;
  }

  /**
   * Select specific rows from a table
   * @param {String} tablename Name of the table we want to get a specific row
   * @param {String} column Name of the column which identify the row
   * @param {*} value Column value that identifies the row
   * @returns The row asked
   */
  async selectBySingleColumn(tablename, column, value) {
    const selection = new Promise((resolve, reject) => {
      this.pool.query(
        `SELECT * FROM ?? WHERE ?? = ?`,
        [tablename, column, value],
        (error, results) => {
          if (error) {
            console.log(error);
            reject({
              msg: "Select failed.",
            });
          } else {
            resolve({
              msg: "Data fetch successfully",
              data: results,
            });
          }
        }
      );
    });
    return selection;
  }

  /**
   * Select all the data from a table
   * @param {String} tablename Name of the table we want to get its data
   * @returns All the rows of the table
   */
  async selectAllTable(tablename) {
    const selection = new Promise((resolve, reject) => {
      this.pool.query(`Select * FROM ${tablename}`, (error, results) => {
        if (error) {
          console.log(error);
          reject({
            msg: "Select failed",
          });
        } else {
          resolve({
            msg: "Data fetch successfully",
            data: results,
          });
        }
      });
    });
    return selection;
  }

  /**
   * Delete specific rows where a condition accomplishes
   * @param {String} tablename Name of the table where row will be deleted
   * @param {String} column Name of the column which value gives the row to be deleted
   * @param {*} value Value of the column to find the row or rows to be deleted
   * @returns Result of the function
   */
  async deleteRow(tablename, column, value) {
    const deleted = new Promise((resolve, reject) => {
      this.pool.query(
        `DELETE FROM ?? WHERE ?? = ?`,
        [tablename, column, value],
        (error) => {
          if (error) {
            console.log(error);
            reject({
              msg: "Delete failed",
            });
          } else {
            resolve({
              msg: "Delete succeed",
            });
          }
        }
      );
    });
    return deleted;
  }

  /**
   * Update values of a row
   * @param {String} tablename Name of the table where the values of a row will be updated
   * @param {Post} columnValues Array of pairs type {"column": "value"} for sql syntax SET "column" = "value"
   * @param {String} column Name of the column which value gives the row to be updated
   * @param {*} value Value of the column to find the row to be updated
   * @returns Result of the function
   */
  async updateValue(tablename, columnValues, column, value) {
    var updateStatement = "";
    var updateValues = [];
    Object.keys(columnValues).forEach((key) => {
      updateStatement += `${key} = ?,`;
      updateValues.push(columnValues[key]);
    });
    updateStatement = updateStatement.substring(0, updateStatement.length - 1);
    updateValues.push(value);
    const updated = new Promise((resolve, reject) => {
      this.pool.query(
        `UPDATE ${tablename} SET ${updateStatement} WHERE ${column} = ?`,
        updateValues,
        (error) => {
          if (error) {
            console.log(error);
            reject({
              msg: "Update failed",
            });
          } else {
            resolve({
              msg: "Update succeed",
            });
          }
        }
      );
    });
    return updated;
  }
}

module.exports = DataBase;
