import {jest} from '@jest/globals'
import fastify, {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyRequest,
	FastifyReply
} from 'fastify'
import fastify405, { allowCORS } from '../index'

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

describe('when a route is registered through better-fastify-405', function (){
	describe('when a custom callback is used to filter out a method', function (){
		describe('when a route is accessed with a filter out method', function (){
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
				],
				filterCallback: ({ route, method }) => {
					return method !== 'POST'
				}
			})
			it('should not return 405', async function (){
				const response = await app.inject({
					method: 'POST',
					url: '/'
				})

				expect(response.statusCode).toBe(404)
			})
		})
	})
})

describe('when a route is registered through better-fastify-405', function (){
	describe('when a custom callback is used to filter out a route', function (){
		describe('when the route is accessed', function (){
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
				],
				filterCallback: ({ route, method }) => {
					return route !== '/'
				}
			})
			it('should not return 405', async function (){
				const postResponse = await app.inject({
					method: 'POST',
					url: '/'
				})

				const deleteResponse = await app.inject({
					method: 'DELETE',
					url: '/'
				})

				const optionsResponse = await app.inject({
					method: 'OPTIONS',
					url: '/'
				})

				expect(postResponse.statusCode).toBe(404)
				expect(deleteResponse.statusCode).toBe(404)
				expect(optionsResponse.statusCode).toBe(404)
			})
		})
	})
})

describe('when a route is registered through better-fastify-405', function (){
	describe('when a allowCORS is used to filter out all OPTIONS method for 405', function (){
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
			],
			filterCallback: allowCORS
		})

		describe('when the route is accessed with method other than OPTIONS', function (){
			it('should return 405', async function (){
				const postResponse = await app.inject({
					method: 'POST',
					url: '/'
				})

				expect(postResponse.statusCode).toBe(405)
			})
		})

		describe('when the route is accessed with OPTIONS', function (){
			it('should not return 405', async function (){
				const optionsResponse = await app.inject({
					method: 'OPTIONS',
					url: '/'
				})
				expect(optionsResponse.statusCode).toBe(404)
			})
		})
	})
})
