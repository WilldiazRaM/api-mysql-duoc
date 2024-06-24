const pool = require('../database');

// Guardar un nuevo pago
async function savePayment(paymentData) {
    const { id_venta, monto, metodo_pago, estado_pago, token } = paymentData;
    const query = `
      INSERT INTO "Pagos" (id_venta, monto, metodo_pago, estado_pago, token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [id_venta, monto, metodo_pago, estado_pago, token];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error guardando el pago:', error);
      throw error;
    }
}

// Obtener el pago por token
async function getPaymentByToken(token) {
    const query = `
      SELECT * FROM "Pagos" WHERE token = $1;
    `;
    const values = [token];
  
    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        throw new Error('Pago no encontrado');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo el pago por token:', error);
      throw error;
    }
}

// Obtener usuario por ID
async function getUserById(id) {
    const query = `
      SELECT * FROM "Usuarios" WHERE id = $1;
    `;
    const values = [id];
  
    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo el usuario por ID:', error);
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

module.exports = {
    savePayment,
    getPaymentByToken,
    getUserById,
    updatePaymentStatus
};
