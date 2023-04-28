const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async function (req, res) {
       try {
        let allGenres = await Genres.findAll()
        res.render("moviesAdd",{allGenres})
       } catch (error) {
        console.log(error)
       } 
    },
       
       
    create: async function (req,res) {
        let{title,rating,awards,release_date,length}=req.body
        try { await Movies.create({
            title,rating,awards,release_date,length
        })
        
             res.redirect('/movies')
        } catch (error) {
            console.log(error)
        }
    },
    edit: async function(req,res) {
        try {
          let Movie = Movies.findByPk(req.params.id)
        res.render('moviesEdit',{Movie})  
        } catch (error) {
            console.log(error)
        }
        

    },
    update: async function (req,res) {
        let{title,rating,awards,release_date,length}=req.body
        try {            
            await Movies.update({
                title,rating,awards,release_date,length
            },{ where: { id: req.params.id }},{include:['genre','actors']})
            res.redirect('/movies')
            }
        catch (error) {
            console.log(error)
        }
    },
    delete: async function (req,res) {
        try {
            let Movie = Movies.findByPk(req.params.id)
            res.render("moviesDelete",{Movie})
            
        } catch (error) {
            console.log(error)
        }

    },
    destroy: async function (req,res) {
        let {id} =req.params.id
        try {
          Movies.destroy({
            where : {
              id
            }})  
        } catch (error) {
            
        }
        
    }
}

module.exports = moviesController;