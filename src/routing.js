class RouteMatcher {
    constructor(routes = {}) {
        this.routes = routes;
    }

    findRoute(path) {
        for (const [storedPath, handler] of Object.entries(this.routes)) {
            if (this._pathsMatch(storedPath, path)) {
                return {
                    handler,
                    params: this._extractParamsFromPaths(storedPath, path)
                };
            }
        }
        return null;
    }

    hasMatch(path) {
        return this.findRoute(path) !== null;
    }

    getHandler(path) {
        const route = this.findRoute(path);
        return route?.handler ?? null;
    }

    extractParams(path) {
        const route = this.findRoute(path);
        return route?.params ?? null;
    }

    _pathsMatch(storedPath, testPath) {
        const storedParts = storedPath.split('/');
        const testParts = testPath.split('/');

        if (storedParts.length !== testParts.length) {
            return false;
        }

        return storedParts.every((part, index) => {
            return part.startsWith(':') || part === testParts[index];
        });
    }

    _extractParamsFromPaths(storedPath, testPath) {
        const storedParts = storedPath.split('/');
        const testParts = testPath.split('/');
        const params = {};

        storedParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                params[part.slice(1)] = testParts[index];
            }
        });

        return params;
    }
}
export default RouteMatcher;

/*
// Example usage
const routes = {
    '/users/:id': () => 'User handler',
    '/products/:category/:id': () => 'Product handler'
};

const matcher = new RouteMatcher(routes);

console.log(matcher.hasMatch('users/123')); 
// Output: true

console.log(matcher.getHandler('users/123')); 
// Output: [Function]

console.log(matcher.extractParams('users/123')); 
// Output: { id: '123' }
*/
