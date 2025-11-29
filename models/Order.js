/*
  Order.js — Native MongoDB driver version
  NO Mongoose used
*/

import { ObjectId } from "mongodb";

export default class Order {
  
  static collection(db) {
    return db.collection("orders");
  }

  // Save a new order
  static async create(db, orderData) {
    return await this.collection(db).insertOne(orderData);
  }

  // Find all orders (if needed)
  static async findAll(db) {
    return await this.collection(db).find().toArray();
  }

  // Find one by ID
  static async findById(db, id) {
    return await this.collection(db).findOne({ _id: new ObjectId(id) });
  }
}
