'use strict'
const Favorito = require('../models/favorito');
var path = require("path");

function saludar(req,res){
	const nombre = req.params.name;
	const apellido = req.params.lastname;
	res.send('Hola '+nombre + " " + apellido);
	console.log("Peticion realizada!");
}

function getFavorito(req,res){
	const favoritoId = req.params.id;

	Favorito.findById(favoritoId,function(err,favorito){
		
		if(err){
			res.status(500).send({message:"error al devolver marcador"});
		}else{
			res.render('show.pug',{favorito:favorito , title:'Favorito'});
		}

	})

}

function saveFavorito(req,res){
	var favorito = new Favorito();
	var params = req.body;
	
	favorito.title = params.title;
	favorito.description = params.description;
	favorito.url = params.url;

	favorito.save((err,favoritoStored)=>{
		if(err){
			console.log(err);
			res.send({message: "No se pudo guardar el registro"});	
		}else{
			//res.send({message:favoritoStored});
			res.redirect("/api/favoritos")
		}
	})

}

function updateFavorito(req,res){
	
	var params = req.body;
	const favoritoId = req.params.id;

	Favorito.findByIdAndUpdate(favoritoId,params,function(err,favoritoUpdated){
		if(err){
			res.status(500).send({message:"error al devolver marcador"});
		}else{
			res.status(200).send({favoritoUpdated});
		}

	})	

}

function deleteFavorito(req, res){
    var favoritoId = req.params.id;
    Favorito.findById(favoritoId, function (err,favorito) {
        if (err){
            res.status(500).send({message:"Error al devolver favorito"});
        }

        if(!favorito){
            res.status(404).send({message:"No hay favorito"});

        }else{
            favorito.remove(err => {
                if(err){
                    res.status(500).send({message:"No se ha podido eliminar"});

                }else{
                    res.redirect("/api/favoritos")
                //res.status(200).send({message:"Marcador eliminado correctamente"});

            }
                
            });
            
        }
        
    });
    
}

function getFavoritos(req,res){

	const page = req.params.page;

	Favorito.paginate({},{page: page, limit: 5}, function(err,favoritos){
		if(err){
			res.status(500).send({message: "Hubo en error en el server"});
		}
		if(!favoritos){
			res.status(404).send({message: "No hay registros para mostrar"});
		}

	}).then(response =>{
			res.render('index.pug',{favoritos:response.docs, pagina:response.pages, active:response.page,title:'Mis favoritos'});
	})

	/*
	Favorito.find({}).collation({locale:"en"}).sort({title:-1}).exec((err,favoritos)=>{
		
		if(err){
			res.status(500).send({message: "Hubo en error en el server"});
		}
		if(!favoritos){
			res.status(404).send({message: "No hay registros para mostrar"});
		}

		//res.status(200).send({favoritos});
		res.render('index.pug',{favoritos:favoritos , title:'Mis favoritos'});

	});
	*/

}

function newFavorito(req,res){
	res.render('new.pug',{ title:'Nuevo Favorito'});	
}

function getwebpage(req,res){
	res.sendFile(path.join(__dirname+'../../views/prueba.html'));
}

function getListFavoritosMobile(req,res){
	Favorito.find({}).collation({locale:"en"}).sort({title:-1}).exec((err,favoritos)=>{

	if(err){
		res.status(500).send({message: "Hubo en error en el server"});
	}
	if(!favoritos){
		res.status(404).send({message: "No hay registros para mostrar"});
	}

	res.status(200).send({favoritos});

	});
}

module.exports = {
	saludar,
	getFavorito,
	getFavoritos,
	saveFavorito,
	updateFavorito,
	deleteFavorito,
	newFavorito,
	getwebpage,
	getListFavoritosMobile
}