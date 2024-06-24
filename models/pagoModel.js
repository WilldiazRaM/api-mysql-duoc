const pool = require('../database');

// Guardar un nuevo pago
async function savePayment(paymentData) {
    const { id_venta, monto, metodo_pago, estado_pago } = paymentData;
    const query = `
      INSERT INTO "Pagos" (id_venta, monto, metodo_pago, estado_pago)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id_venta, monto, metodo_pago, estado_pago];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error guardando el pago:', error);
      throw error;
    }
  }
  
  // Actualizar el estado del pago
  async function updatePaymentStatus(buyOrder, estado_pago) {
    const query = `
      UPDATE "Pagos"
      SET estado_pago = $1
      WHERE id_venta = $2
      RETURNING *;
    `;
    const values = [estado_pago, buyOrder];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando el estado del pago:', error);
      throw error;
    }
  }
  


// Obtener todos los pagos
async function getAllPagos() {
    try {
        const result = await pool.query('SELECT * FROM "Ventas"');
        return result.rows;
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        throw error;
    }
}

// Obtener un pago por su ID
async function getPagoById(id) {
    try {
        const result = await pool.query('SELECT * FROM "Ventas" WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error("Pago no encontrado");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener el pago:", error);
        throw error;
    }
}

module.exports = {
    getAllPagos,
    getPagoById,
    savePayment,
    updatePaymentStatus
};
