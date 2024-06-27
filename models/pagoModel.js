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
        console.log('Saving payment with values:', values); // Log values
        const result = await pool.query(query, values);
        console.log('Payment saved:', result.rows[0]); // Log result
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
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Pago no encontrado');
        }
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
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Usuario no encontrado');
        }
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
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Venta no encontrada');
        }
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
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creando la venta:', error);
        throw error;
    }
}

// Obtener todos los pagos
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

// Obtener pago por ID
async function getPaymentById(id) {
    const query = 'SELECT * FROM "Pagos" WHERE id = $1';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Pago no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error obteniendo el pago por ID:', error);
        throw error;
    }
}

// Crear un nuevo pago
async function createPayment(paymentData) {
    const { id_venta, monto, metodo_pago, estado_pago } = paymentData;
    console.log('Creating payment with data:', paymentData); // Log the payment data
    const query = `
        INSERT INTO "Pagos" (id_venta, monto, metodo_pago, estado_pago)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [id_venta, monto, metodo_pago, estado_pago];
    try {
        console.log('Query for creating payment:', query); // Log query
        const result = await pool.query(query, values);
        console.log('Payment created:', result.rows[0]); // Log result
        return result.rows[0];
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}


// Actualizar un pago
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
            throw new Error('Pago no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el pago:', error);
        throw error;
    }
}

// Eliminar un pago
async function deletePayment(id) {
    const query = 'DELETE FROM "Pagos" WHERE id = $1 RETURNING *';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Pago no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error eliminando el pago:', error);
        throw error;
    }
}

module.exports = {
    savePayment,
    getPaymentByToken,
    getUserById,
    getVentaById,
    createVenta,
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};
