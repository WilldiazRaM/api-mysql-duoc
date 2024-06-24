const { createTransaction, confirmTransaction } = require('../utils/pagosUtils');
const { savePayment, getVentaById, createVenta } = require('../models/pagoModel');

const iniciarTransaccion = async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl, metodoPago } = req.body;

  try {
    // Verificar que la venta exista o crear una nueva venta
    let venta = await getVentaById(buyOrder);
    if (!venta) {
      // Crear una nueva venta si no existe, asegurando un id_usuario válido
      venta = await createVenta({ id_usuario: 1, monto: amount });  // Cambia 1 por un id_usuario válido
      buyOrder = venta.id;
    }

    // Iniciar transacción con Transbank
    const transaction = await createTransaction(buyOrder, sessionId, amount, returnUrl);

    if (transaction.token) {
      res.status(200).json(transaction);
    } else {
      res.status(500).json({ message: 'Error iniciando transacción con Transbank' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error iniciando transacción', error: error.message });
  }
};

const confirmarTransaccion = async (req, res) => {
  const { token, buyOrder } = req.body;

  try {
    const transactionResult = await confirmTransaction(token);

    if (transactionResult.status === 'AUTHORIZED') {
      // Guardar información del pago en la base de datos
      const paymentData = {
        id_venta: buyOrder,
        monto: transactionResult.amount,
        metodo_pago: 'webpay',
        estado_pago: 'confirmado',
      };
      await savePayment(paymentData);

      res.status(200).json({ message: 'Transacción confirmada y guardada', transactionResult });
    } else {
      res.status(500).json({ message: 'Transacción no autorizada', transactionResult });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error confirmando transacción', error: error.message });
  }
};

module.exports = {
  iniciarTransaccion,
  confirmarTransaccion
};
