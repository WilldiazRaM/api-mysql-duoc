const axios = require('axios');

const createTransaction = async (buyOrder, sessionId, amount, returnUrl) => {
  const url = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions';
  const headers = {
    'Tbk-Api-Key-Id': process.env.TBK_API_KEY_ID,
    'Tbk-Api-Key-Secret': process.env.TBK_API_KEY_SECRET,
    'Content-Type': 'application/json'
  };

  const data = {
    buy_order: buyOrder,
    session_id: sessionId,
    amount: amount,
    return_url: returnUrl
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction', error);
    throw error;
  }
};

const confirmTransaction = async (token) => {
  const url = `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`;
  const headers = {
    'Tbk-Api-Key-Id': process.env.TBK_API_KEY_ID,
    'Tbk-Api-Key-Secret': process.env.TBK_API_KEY_SECRET,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.put(url, {}, { headers });
    return response.data;
  } catch (error) {
    console.error('Error confirming transaction', error);
    throw error;
  }
};

module.exports = {
  createTransaction,
  confirmTransaction
};
