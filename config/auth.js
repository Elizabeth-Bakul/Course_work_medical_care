module.exports={

    ensureAuthenticated: function(req, res, next) {
        if( req.isAuthenticated()) { return next();}
        req.flash('danger',req.isAuthenticated());
        req.flash('danger', 'Please log in');
    res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
        if(!req.isAuthenticated()){ return next()}
        res.redirect('/account');
    }
}
