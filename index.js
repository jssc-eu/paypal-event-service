'use strict';
const Boom = require('boom');
const Hapi=require('hapi');

const separator = require('./separator')

// Create a server with a host and port
const server=Hapi.server({
    host:'0.0.0.0',
	port: 8000
});

// Add the route
server.route({
    method:'POST',
	path:'/separate',
	options: {
		cors: true,
		payload: {
			maxBytes: 2097152,
			allow: 'text/csv'
		},
	},
    handler: async function (request, h) {
		try {
			const result = await separator(request.payload)
			return result
		} catch(e) {
			return Boom.badRequest(e.message, e)
		}
    }
});

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();