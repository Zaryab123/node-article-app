const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const User = require('../models/user')

//Home page
router.get('/', (req, res) => {

    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: 'Article',
                articles: articles
            })
        }
    })

})

//Add route
router.get('/add', checkAuthentication, (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Saving the articles
router.post('/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.user._id

    article.body = req.body.body

    article.save()
        .then(result => {
            req.flash('success', 'Article Added')
            res.redirect('/article')
        })
        .catch(err => {
            console.log(err)
        })

})

//get single article
router.get("/:id", (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
            User.findById(article.author)
                .then(user => {
                    res.render('article',
                        {
                            article: article,
                            author: user.name
                        }
                    )
                })
        })
        .catch(err => {
            console.log(err)
        })
})


//Edit get route
router.get('/edit/:id', checkAuthentication, (req, res) => {
    Article.findById(req.params.id)
        .then(result => {
            if(result.author != req.user._id){
                req.flash('danger','Unauthorized')
                res.redirect('/article')
            }else{
                res.render('edit_article', {
                    title: 'Edit Article',
                    article: result
                })
            }
           
        })
        .catch(err => {
            console.log(err)
            return
        })
})

//Edit post route
router.post('/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.body = req.body.body

    const query = 0

    Article.updateOne({ _id: req.params.id }, article)
        .then(result => {
            req.flash('success', 'Article Updated')
            res.redirect('/article')
        })
        .catch(err => {
            console.log(err)
        })
})


//Delete article
router.delete('/:id', checkAuthentication, (req, res) => {
    const query = { _id: req.params.id }

    Article.deleteOne(query)
        .then(result => {
            res.send('success')
        })
        .catch(err => {
            console.log(err)
        })
})

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('danger', 'please login to access')
        res.redirect('/users/login')
    }
}

module.exports = router;