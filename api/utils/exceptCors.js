import pathToRegexp from 'path-to-regexp'

const path = ['/api/oauth/authgoogle/callback', '/api/oauth/authgh/callback', '/api/oauth/authintra/callback', '/api/oauth/authfb/callback']

export const excludeOauth = (fn) => {
    var regexp = pathToRegexp(path)
    return (req, res, next) => {
         return (regexp.test(req.path)) ? next() : fn(req, res, next);
    }
}