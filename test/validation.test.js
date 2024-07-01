const { validateEmail, validatePassword } = require('../utils/validation');

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('debería devolver null para un email válido', () => {
      expect(validateEmail('test@example.com')).toBeNull();
    });

    test('debería devolver "Email inválido" para un email inválido', () => {
      expect(validateEmail('test@com')).toBe('Email inválido');
    });
  });

  describe('validatePassword', () => {
    test('debería devolver null para una contraseña válida', () => {
      expect(validatePassword('password123')).toBeNull();
    });

    test('debería devolver un error para una contraseña corta', () => {
      expect(validatePassword('123')).toBe('La contraseña debe tener al menos 6 caracteres');
    });
  });
});


function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email) ? null : 'Email inválido';
}

function validatePassword(password) {
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
}

/* FUNCION validation
const validarCamposCupon = (data) => {
  const { codigo, descuento, fecha_expiracion, usos_restantes } = data;
  if (!codigo || !descuento || !fecha_expiracion || !usos_restantes) {
    return 'Todos los campos son obligatorios';
  }
  return null;
}; */