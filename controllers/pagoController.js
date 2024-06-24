const { createTransaction, confirmTransaction } = require('../utils/pagosUtils');
const { savePayment, updatePaymentStatus, getVentaById } = require('../models/pagoModel');

const iniciarTransaccion = async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl, metodoPago } = req.body;

  try {
    // Verificar que la venta exista
    const venta = await getVentaById(buyOrder);
    if (!venta) {
      return res.status(400).json({ message: 'Venta no encontrada' });
    }

    const transaction = await createTransaction(buyOrder, sessionId, amount, returnUrl);

    // Guardar información del pago en la base de datos
    const paymentData = {
      id_venta: buyOrder, // asumiendo que buyOrder es el id de la venta
      monto: amount,
      metodo_pago: metodoPago,
      estado_pago: 'iniciado',
    };
    await savePayment(paymentData);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error iniciando transacción', error: error.message });
  }
};

const confirmarTransaccion = async (req, res) => {
  const { token } = req.params;

  try {
    const transactionResult = await confirmTransaction(token);
    
    // Actualizar estado del pago en la base de datos
    const { buy_order, status } = transactionResult;
    const estado_pago = status === 'AUTHORIZED' ? 'confirmado' : 'fallido';
    await updatePaymentStatus(buy_order, estado_pago);

    res.status(200).json(transactionResult);
  } catch (error) {
    res.status(500).json({ message: 'Error confirmando transacción', error: error.message });
  }
};

module.exports = {
  iniciarTransaccion,
  confirmarTransaccion
};
