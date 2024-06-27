const pool = require('../database');
const { 
  createTransaction, 
  confirmTransaction 
} = require('../utils/pagosUtils');

const { 
  savePayment, 
  getVentaById, 
  createVenta, 
  getUserById, 
  getPaymentByToken, 
  updatePaymentStatus,
  getAllPayments, // Make sure this is imported
  getPaymentById, // Make sure this is imported
  createPayment,  // Make sure this is imported
  updatePayment,  // Make sure this is imported
  deletePayment   // Make sure this is imported
} = require('../models/pagoModel');
const { iniciarTransaccion } = require('../controllers/pagoController');







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
const createPago = async (req, res) => {
  try {
      const newPago = await createPayment(req.body);
      res.status(201).json(newPago);
  } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

const getAllPagos = async (req, res) => {
  try {
      const pagos = await getAllPayments();
      res.status(200).json(pagos);
  } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

const getPagoById = async (req, res) => {
  try {
      const pago = await getPaymentById(req.params.id);
      if (!pago) {
          return res.status(404).json({ message: 'Pago not found' });
      }
      res.status(200).json(pago);
  } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};

const updatePago = async (req, res) => {
  try {
      const updatedPago = await updatePayment(req.params.id, req.body);
      if (!updatedPago) {
          return res.status(404).json({ message: 'Pago not found' });
      }
      res.status(200).json(updatedPago);
  } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
};

const deletePago = async (req, res) => {
  try {
      const deletedPago = await deletePayment(req.params.id);
      if (!deletedPago) {
          return res.status(404).json({ message: 'Pago not found' });
      }
      res.status(200).json({ message: 'Pago deleted' });
  } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
};


module.exports = {
  iniciarTransaccion,
  confirmTransaction,
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago
};