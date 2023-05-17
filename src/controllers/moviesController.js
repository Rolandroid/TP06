const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment")

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
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async function (req, res) {
        try {
            let allGenres = await Genres.findAll({order:["name"]})
            res.render("moviesAdd", { allGenres })
        } catch (error) {
            console.log(error)
        }
    },


    create: async function (req, res) {
      /*   let { title, rating, awards, release_date, length,  genre_id } = req.body */
        try {
            await Movies.create({
                ...req.body,
            })

            res.redirect('/movies')
        } catch (error) {
            console.log(error)
        }
    },
    /* edit: async function (req, res) {
        try {
          
          let allGenres = await Genres.findAll({order:["name"]});
          let movie = await Movies.findByPk(req.params.id,);
          res.render('moviesEdit', { movie, allGenres });
        } catch (error) {
          console.log(error);
        }
      } */
      
      edit: function(req,res) {
        let movie = db.Movie.findByPk(req.params.id)
        let allGenres = db.Genre.findAll({
            order:['name']
        });
        Promise.all([movie,allGenres])
        
            .then(([movie,allGenres])=>{
                return res.render('moviesEdit',{
                    Movie:movie,
                    allGenres,
                    moment
                })
            })
            .catch(error=>console.log(error))
    }
,
    update: async function (req, res) {
        let { title, rating, awards, release_date, length, genre_id } = req.body

        try {
            await Movies.update({
                title, rating, awards, release_date, length, genre_id
            },
             { where: {id : req.params.id} },
             { include: ['genre', 'actors'] })
            res.redirect('/movies')
        }
        catch (error) {
            console.log(error)
        }
    },
    delete: async function (req, res) {
        try {
            let Movie =await Movies.findByPk(req.params.id)
            console.log("Movie")
            res.render("moviesDelete", { Movie })

        } catch (error) {
            console.log(error)
        }

    },
    destroy: async function (req, res) {
        
        try {
            Movies.destroy({
                where: {
                    id : req.params.id
                }
            })
            res.redirect("/movies")
        } catch (error) {

        }

    }
}

module.exports = moviesController;