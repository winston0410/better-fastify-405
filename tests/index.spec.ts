import {jest} from '@jest/globals'
import fastify, {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyRequest,
	FastifyReply
} from 'fastify'
import fastify405 from '../index'

describe('when no routes is registered through better-fastify-405', function (){
	it('should return early and become a noop', function (){
		const app: FastifyInstance = fastify({
			logger: false
		})
		
		const addHookMock = jest.spyOn(app, 'addHook');

		app.register(fastify405)

		expect(addHookMock).toBeCalledTimes(0)
	})
})

describe('when a route is registered through better-fastify-405', function() {
	describe('when a route is accessed by its defined method', function() {
    const app: FastifyInstance = fastify({
      logger: false
    })

    app.register(fastify405, {
      routes: [
        async function routes(
          instance: FastifyInstance,
          options: FastifyPluginOptions
        ) {
          instance.get(
            '/',
            async (request: FastifyRequest, reply: FastifyReply) => {
              return { hello: 'world' }
            }
          )
        }
      ]
    })

		it('should return its defined status', async function() {
			const response = await app.inject({
				method: 'GET',
				url: '/'
			})

      expect(response.statusCode).toBe(200)
		})

    it('should return a body with payload', async function (){
      const response = await app.inject({
        method: 'GET',
        url: '/'
      })

      expect(response.json()).toStrictEqual({
        hello: 'world'
      })
    })
	})
})

describe('when a route is registered through better-fastify-405', function() {
	describe('when a route is not accessed by its defined method', function() {
    const app: FastifyInstance = fastify({
      logger: false
    })

    app.register(fastify405, {
      routes: [
        async function routes(
          instance: FastifyInstance,
          options: FastifyPluginOptions
        ) {
          instance.get(
            '/',
            async (request: FastifyRequest, reply: FastifyReply) => {
              return { hello: 'world' }
            }
          )
        }
      ]
    })

		it('should return 405', async function() {
      const response = await app.inject({
        method: 'POST',
        url: '/'
      })

      expect(response.statusCode).toBe(405)
    })

		it('should return an accept header', async function() {
      const response = await app.inject({
        method: 'POST',
        url: '/'
      })

      expect(response.headers.allow).toBe('GET')
    })

    it('should return an empty body', async function (){
      const response = await app.inject({
        method: 'POST',
        url: '/'
      })

      expect(response.body).toBe('')
    })
	})
})
