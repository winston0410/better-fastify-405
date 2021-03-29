# Better Fastify 405

A simple Fastify plugin for handling 405 gracefully.

[![Maintainability](https://api.codeclimate.com/v1/badges/23557cfcd9416cc4f098/maintainability)](https://codeclimate.com/github/winston0410/better-fastify-405/maintainability) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/a88113b4d6ac4acbb90be5864aacae27)](https://www.codacy.com/gh/winston0410/better-fastify-405/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=winston0410/better-fastify-405&amp;utm_campaign=Badge_Grade) [![Test Coverage](https://api.codeclimate.com/v1/badges/23557cfcd9416cc4f098/test_coverage)](https://codeclimate.com/github/winston0410/better-fastify-405/test_coverage) 

## Why do I need this?

By default [Fastify suppress error 405](https://github.com/fastify/fastify/issues/917) and with return 404 instead. A 405 error would improve the development experience.

[fastify-405](https://github.com/Eomm/fastify-405) was built to solve this issue, but it requires you to input a RegExp for the route you want to handle 405.

This plugin is meant to read from your current route setting, and create routes that return 405 automatically.

## Installation

```shell
npm add better-fastify-405
```

```shell
yarn add better-fastify-405
```

## Usage

```javascript
//app.js
import fastify, { FastifyRequest, FastifyReply, FastifyInstance, HookHandlerDoneFunction, RouteOptions } from 'fastify';

const app: FastifyInstance = fastify({
  logger: true
})

//Other plugins
app.register(import("fastify-etag"))
app.register(import('plugins/better-fastify-405'), {
  routes: [
		//Register all your route here, or else this plugin would not work.
    import('./routes/index'),
    import('./routes/protected')
		//All the route will be registered inside the plugin. Do not use app.register() here.
  ]
})
```
