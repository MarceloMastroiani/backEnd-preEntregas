//ADMIN
export function privateAccess (req, res, next) {
    if(!req.session.user) {
        console.log('No estas logueado')
        return res.redirect('/login')
    }
    next();
}