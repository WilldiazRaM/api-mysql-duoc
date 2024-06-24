const { createTransaction, confirmTransaction } = require('../utils/pagosUtils');

const iniciarTransaccion = async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;

  try {
    const transaction = await createTransaction(buyOrder, sessionId, amount, returnUrl);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error iniciando transacción', error: error.message });
  }
};

const confirmarTransaccion = async (req, res) => {
  const { token } = req.params;

  try {
    const transactionResult = await confirmTransaction(token);
    res.status(200).json(transactionResult);
  } catch (error) {
    res.status(500).json({ message: 'Error confirmando transacción', error: error.message });
  }
};

module.exports = {
  iniciarTransaccion,
  confirmarTransaccion
};
