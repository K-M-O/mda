// npm modules.

const mongoose = require('mongoose')

// create schema and proprties.

const documetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    barCode: {
        type: String,
        required: true
    },
    archive: {
        type: String,
        required: true
    },
    col: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    keywords: {
        publisher: {
            type: String,
            required: true
        },
        period: {
            type: String,
            required: true
        },
        civilization: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        font: {
            type: String,
            required: true
        },
        classification: {
            type: String,
            required: true
        },
        form: {
            type: String,
            required: true
        },
        digital: {
            type: Boolean,
            required: true,
            default: true
        }
    }
})

// export the module

module.exports = mongoose.model('Document', documetSchema)