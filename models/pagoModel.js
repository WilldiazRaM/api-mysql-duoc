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
    console.log('Ejecutando query savePayment con valores:', values);
    const result = await pool.query(query, values);
    console.log('Resultado de savePayment:', result.rows[0]);
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
    console.log('Ejecutando query getPaymentByToken con token:', token);
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      console.log('Pago no encontrado para el token:', token);
      throw new Error('Pago no encontrado');
    }
    console.log('Resultado de getPaymentByToken:', result.rows[0]);
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
    console.log('Ejecutando query getUserById con ID:', id);
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      console.log('Usuario no encontrado para el ID:', id);
      throw new Error('Usuario no encontrado');
    }
    console.log('Resultado de getUserById:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error obteniendo el usuario por ID:', error);
    throw error;
  }
}

// Obtener venta por ID
async function getVentaById(id) {
  const query = `
    SELECT * FROM "Ventas" WHERE id = $1;
  `;
  const values = [id];

  try {
    console.log('Ejecutando query getVentaById con ID:', id);
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      console.log('Venta no encontrada para el ID:', id);
      throw new Error('Venta no encontrada');
    }
    console.log('Resultado de getVentaById:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error obteniendo la venta por ID:', error);
    throw error;
  }
}

// Crear una nueva venta
async function createVenta(ventaData) {
  const { id_usuario, monto } = ventaData;
  const query = `
    INSERT INTO "Ventas" (id_usuario, monto)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [id_usuario, monto];

  try {
    console.log('Ejecutando query createVenta con valores:', values);
    const result = await pool.query(query, values);
    console.log('Resultado de createVenta:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creando la venta:', error);
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
    console.log('Ejecutando query updatePaymentStatus con valores:', values);
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      console.log('Pago no encontrado para la orden de compra:', buyOrder);
      throw new Error('Pago no encontrado para la orden de compra proporcionada');
    }
    console.log('Resultado de updatePaymentStatus:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error actualizando el estado del pago:', error);
    throw error;
  }
}

async function getAllPayments() {
  const query = 'SELECT * FROM "Pagos"';
  try {
      const result = await pool.query(query);
      return result.rows;
  } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
  }
}

async function getPaymentById(id) {
  const query = 'SELECT * FROM "Pagos" WHERE id = $1';
  const values = [id];
  try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
          throw new Error('Pago not found');
      }
      return result.rows[0];
  } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
  }
}

async function createPayment(paymentData) {
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
      console.error('Error creating payment:', error);
      throw error;
  }
}

async function updatePayment(id, paymentData) {
  const { id_venta, monto, metodo_pago, estado_pago } = paymentData;
  const query = `
      UPDATE "Pagos"
      SET id_venta = $1, monto = $2, metodo_pago = $3, estado_pago = $4
      WHERE id = $5
      RETURNING *;
  `;
  const values = [id_venta, monto, metodo_pago, estado_pago, id];
  try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
          throw new Error('Pago not found');
      }
      return result.rows[0];
  } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
  }
}

async function deletePayment(id) {
  const query = 'DELETE FROM "Pagos" WHERE id = $1 RETURNING *';
  const values = [id];
  try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
          throw new Error('Pago not found');
      }
      return result.rows[0];
  } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
  }
}

module.exports = {
  savePayment,
  getPaymentByToken,
  getUserById,
  getVentaById,
  createVenta,
  updatePaymentStatus,
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
};