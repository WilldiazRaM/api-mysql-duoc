const { validarNombreCategoria } = require('../models/CategoriasProductos');

describe('CategoriasProductos', () => {
    describe('validarNombreCategoria', () => {
        it('debería validar correctamente un nombre de categoría válido', () => {
            expect(validarNombreCategoria('Electrónica')).toBeNull();
        });

        it('debería devolver un error para un nombre de categoría inválido', () => {
            expect(validarNombreCategoria('')).toBe('Nombre de categoría no válido');
        });
    });
});
