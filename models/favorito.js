'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const FavoritoSchema = Schema({
	title: String,
	description: String,
	url: String
})

FavoritoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Favorito',FavoritoSchema);
