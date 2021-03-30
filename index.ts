import {
  FastifyInstance,
  FastifyPluginOptions,
  HookHandlerDoneFunction,
  HTTPMethods
} from "fastify";
import fp from "fastify-plugin";

const HTTP_METHODS: Array<HTTPMethods> = [
  "GET",
  "POST",
  "HEAD",
  "PUT",
  "DELETE",
  "OPTIONS",
  "PATCH"
];

async function plugin(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
) {
  if(!opts.routes) return done()

  const routes = {};

  fastify.addHook("onRoute", function(opts) {
    const { method, routePath } = opts;
    if (routes[routePath]) {
      routes[routePath].push(method);
    } else {
      routes[routePath] = [method];
    }
  });

  await Promise.all(opts.routes.map(route => fastify.register(route)))

  for (const route in routes) {
    const methods = [...routes[route]]
    fastify.route({
      method: HTTP_METHODS
        .filter((v) => ! methods.includes(v))
        .filter((v) => (opts.filterCallback)
          ? opts.filterCallback({ route, method: v })
          : true
        ),
      url: route,
      handler: async (request, reply) => {
        reply
          .code(405)
          .header("allow", methods.join(','))
          .send();
      }
    });
  }
  done();
}

export default fp(plugin, {
  fastify: "^3.2.0",
  name: "better-fastify-405"
});

interface IAllowCORS {
  route: string,
  method: string
}

export function allowCORS({ route, method }: IAllowCORS){
  return method !== 'OPTIONS'
}
