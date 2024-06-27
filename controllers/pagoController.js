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
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} = require('../models/pagoModel');

// Iniciar transacción
const iniciarTransaccion = async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl, metodoPago, userId } = req.body;

  try {
      console.log('Inicio de transacción con:', req.body);

      // Verificar que el usuario exista
      const usuario = await getUserById(userId);
      if (!usuario) {
          return res.status(400).json({ message: 'Usuario no encontrado' });
      }

      // Intentar obtener la venta por ID
      let venta;
      try {
          venta = await getVentaById(buyOrder);
          console.log('Venta encontrada:', venta);
      } catch (error) {
          if (error.message === 'Venta no encontrada') {
              // Crear una nueva venta si no existe
              venta = await createVenta({ id_usuario: userId, monto: amount });
              console.log('Venta creada:', venta);
          } else {
              throw error;
          }
      }

      const newBuyOrder = venta.id;

      // Iniciar transacción con Transbank
      const transaction = await createTransaction(newBuyOrder, sessionId, amount, returnUrl);

      if (transaction.token) {
          // Guardar el pago con el token en la base de datos
          const paymentData = {
              id_venta: newBuyOrder,
              monto: amount,
              metodo_pago: metodoPago,
              estado_pago: 'iniciado',
              token: transaction.token,
          };
          await savePayment(paymentData);
          console.log('Pago guardado:', paymentData);

          res.status(200).json({ token: transaction.token, url: transaction.url, buyOrder: newBuyOrder });
      } else {
          res.status(500).json({ message: 'Error iniciando transacción con Transbank' });
      }
  } catch (error) {
      console.error('Error iniciando transacción', error);
      res.status(500).json({ message: 'Error iniciando transacción', error: error.message });
  }
};

// Confirmar transacción
const confirmarTransaccion = async (req, res) => {
  const { token } = req.body;

  try {
      console.log('Confirmación de transacción con token:', token);

      // Obtener el pago usando el token
      const payment = await getPaymentByToken(token);
      if (!payment) {
          console.error('Pago no encontrado para el token:', token);
          return res.status(404).json({ message: 'Pago no encontrado' });
      }

      const buyOrder = payment.id_venta;

      console.log('Pago encontrado:', payment);

      // Validar que el estado actual del pago sea 'iniciado'
      if (payment.estado_pago !== 'iniciado') {
          return res.status(400).json({ message: 'El estado del pago no permite la confirmación' });
      }

      // Actualizar el estado del pago en la base de datos a 'confirmado'
      const updatedPayment = await updatePaymentStatus(buyOrder, 'confirmado');
      console.log('Pago actualizado:', updatedPayment);

      res.status(200).json({ message: 'Transacción confirmada y guardada' });
  } catch (error) {
      console.error('Error confirmando transacción', error);
      res.status(500).json({ message: 'Error confirmando transacción', error: error.message });
  }
};

// CRUD Operations
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

const createPago = async (req, res) => {
  try {
      const newPago = await createPayment(req.body);
      res.status(201).json(newPago);
  } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'Error creating payment', error: error.message });
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
  confirmarTransaccion,
  getAllPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago
};
