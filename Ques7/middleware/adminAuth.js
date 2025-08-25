// Admin authentication middleware
const adminAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', { 
            message: 'Access denied. Admin privileges required.',
            user: req.session.user 
        });
    }
    
    next();
};

// User authentication middleware
const userAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    next();
};

module.exports = { adminAuth, userAuth };
