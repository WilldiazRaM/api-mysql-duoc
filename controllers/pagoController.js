const { createTransaction, confirmTransaction } = require('../utils/pagosUtils');
const { savePayment, getVentaById, createVenta, getUserById, getPaymentByToken, updatePaymentStatus } = require('../models/pagoModel');

const iniciarTransaccion = async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl, metodoPago, userId } = req.body;

  try {
    // Verificar que el usuario exista
    const usuario = await getUserById(userId);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que la venta exista o crear una nueva venta
    let venta = await getVentaById(buyOrder);
    let newBuyOrder = buyOrder;
    if (!venta) {
      // Crear una nueva venta si no existe
      venta = await createVenta({ id_usuario: userId, monto: amount });
      newBuyOrder = venta.id;
    }

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

      res.status(200).json({ token: transaction.token, url: transaction.url, buyOrder: newBuyOrder });
    } else {
      res.status(500).json({ message: 'Error iniciando transacción con Transbank' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error iniciando transacción', error: error.message });
  }
};

const confirmarTransaccion = async (req, res) => {
  const { token } = req.body;

  try {
    // Obtener el pago usando el token
    const payment = await getPaymentByToken(token);
    const buyOrder = payment.id_venta;

    // Confirmar la transacción con Transbank
    const transactionResult = await confirmTransaction(token);

    if (transactionResult.status === 'AUTHORIZED') {
      // Actualizar el estado del pago en la base de datos
      await updatePaymentStatus(buyOrder, 'confirmado');
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
