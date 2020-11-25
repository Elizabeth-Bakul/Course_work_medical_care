module.exports={

    ensureAuthenticated: function(req, res, next) {
        if( req.isAuthenticated()) { return next()}
        req.flash('danger', 'Please log in');
    res.redirect('/routes/login');
    }
    forwardAuthenticated: function(req, res, next) {
        if(!req.isAuthenticated()){ return next()}
        res.redirect('/account');
    }
}
