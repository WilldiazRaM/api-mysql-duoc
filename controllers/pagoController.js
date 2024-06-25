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

    // Intentar obtener la venta por ID
    let venta;
    try {
      venta = await getVentaById(buyOrder);
    } catch (error) {
      if (error.message === 'Venta no encontrada') {
        // Crear una nueva venta si no existe
        venta = await createVenta({ id_usuario: userId, monto: amount });
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

      res.status(200).json({ token: transaction.token, url: transaction.url, buyOrder: newBuyOrder });
    } else {
      res.status(500).json({ message: 'Error iniciando transacción con Transbank' });
    }
  } catch (error) {
    console.error('Error iniciando transacción', error);
    res.status(500).json({ message: 'Error iniciando transacción', error: error.message });
  }
};

const confirmarTransaccion = async (req, res) => {
  const { token } = req.body;

  try {
    // Obtener el pago usando el token
    const payment = await getPaymentByToken(token);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    const buyOrder = payment.id_venta;

    // Aquí puedes añadir lógica adicional para validar la transacción, por ejemplo:
    // Validar que el estado actual del pago sea 'iniciado'
    if (payment.estado_pago !== 'iniciado') {
      return res.status(400).json({ message: 'El estado del pago no permite la confirmación' });
    }

    // Actualizar el estado del pago en la base de datos a 'confirmado'
    await updatePaymentStatus(buyOrder, 'confirmado');

    res.status(200).json({ message: 'Transacción confirmada y guardada' });
  } catch (error) {
    console.error('Error confirmando transacción', error);
    res.status(500).json({ message: 'Error confirmando transacción', error: error.message });
  }
};


module.exports = {
  iniciarTransaccion,
  confirmarTransaccion
};
