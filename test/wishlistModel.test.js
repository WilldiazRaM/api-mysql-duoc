const pool = require('../database');
const Wishlist = require('../models/wishlistModel');

jest.mock('../database');

describe('Wishlist Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createWishlist', () => {
        it('should throw an error if user or product is missing', async () => {
            await expect(Wishlist.createWishlist({ id_usuario: 1 })).rejects.toThrow('Usuario y Producto son obligatorios');
        });

        it('should throw an error if user does not exist', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });
            await expect(Wishlist.createWishlist({ id_usuario: 999, id_producto: 1 })).rejects.toThrow('El usuario no existe');
        });

        it('should throw an error if product does not exist', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 0 });
            await expect(Wishlist.createWishlist({ id_usuario: 1, id_producto: 999 })).rejects.toThrow('El producto no existe');
        });

        it('should create a wishlist successfully', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rows: [{ id: 1, id_usuario: 1, id_producto: 1 }] });

            const result = await Wishlist.createWishlist({ id_usuario: 1, id_producto: 1 });
            expect(result).toEqual({ id: 1, id_usuario: 1, id_producto: 1 });
        });
    });

    describe('getAllWishlists', () => {
        it('should return all wishlists', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
            const result = await Wishlist.getAllWishlists();
            expect(result).toHaveLength(2);
        });
    });

    describe('getWishlistById', () => {
        it('should return a wishlist by ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
            const result = await Wishlist.getWishlistById(1);
            expect(result).toEqual({ id: 1 });
        });

        it('should return undefined for non-existing wishlist', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });
            const result = await Wishlist.getWishlistById(999);
            expect(result).toBeUndefined();
        });
    });

    describe('updateWishlist', () => {
        it('should throw an error if user or product is missing', async () => {
            await expect(Wishlist.updateWishlist(1, { id_usuario: 1 })).rejects.toThrow('Usuario y Producto son obligatorios');
        });

        it('should throw an error if user does not exist', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });
            await expect(Wishlist.updateWishlist(1, { id_usuario: 999, id_producto: 1 })).rejects.toThrow('El usuario no existe');
        });

        it('should throw an error if product does not exist', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 0 });
            await expect(Wishlist.updateWishlist(1, { id_usuario: 1, id_producto: 999 })).rejects.toThrow('El producto no existe');
        });

        it('should update a wishlist successfully', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rows: [{ id: 1, id_usuario: 1, id_producto: 1 }] });

            const result = await Wishlist.updateWishlist(1, { id_usuario: 1, id_producto: 1 });
            expect(result).toEqual({ id: 1, id_usuario: 1, id_producto: 1 });
        });
    });

    describe('deleteWishlist', () => {
        it('should delete a wishlist and return it', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
            const result = await Wishlist.deleteWishlist(1);
            expect(result).toEqual({ id: 1 });
        });

        it('should return undefined for non-existing wishlist', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });
            const result = await Wishlist.deleteWishlist(999);
            expect(result).toBeUndefined();
        });
    });
});
