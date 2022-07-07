import mongoose from 'mongoose'

const ProductoSchema = mongoose.Schema({
    /* id: {
        type: String,
        required: true
    }, */
    title: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: String,
        required: true
    }
});

const ProductoModel = mongoose.model('productos', ProductoSchema);

export default ProductoModel;