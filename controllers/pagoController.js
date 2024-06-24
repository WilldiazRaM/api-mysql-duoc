const { createTransaction, confirmTransaction } = require('../utils/pagosUtils');
const { savePayment, updatePaymentStatus, getVentaById, createVenta } = require('../models/pagoModel');

const iniciarTransaccion = async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl, metodoPago } = req.body;

  try {
    // Verificar que la venta exista
    let venta = await getVentaById(buyOrder);
    if (!venta) {
      // Crear una nueva venta si no existe
      venta = await createVenta({ id_usuario: 1, monto: amount });  // Asigna un id_usuario válido
    }

    // Iniciar transacción con Transbank
    const transaction = await createTransaction(venta.id, sessionId, amount, returnUrl);

    if (transaction.token) {
      // Guardar información del pago en la base de datos
      const paymentData = {
        id_venta: venta.id,
        monto: amount,
        metodo_pago: metodoPago,
        estado_pago: 'iniciado',
      };
      await savePayment(paymentData);

      res.status(200).json(transaction);
    } else {
      res.status(500).json({ message: 'Error iniciando transacción con Transbank' });
    }
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
