# Python SRPC Server
# https://github.com/yzITI/srpc

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import threading, json

functions = {}
_hooks = {}

cors = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST'
}

class Handler(BaseHTTPRequestHandler):
    def respond(self, code, msg, ct="text/plain"):
        self.send_response(code)
        for k in cors:
            self.send_header(k, cors[k])
        self.send_header("Content-Type", ct)
        self.end_headers()
        self.wfile.write(bytes(msg, "utf-8"))
    def do_OPTIONS(self):
        self.respond(204, "")
    def do_GET(self):
        self.fail(400, "Method Error")
    def do_POST(self):
        try:
            L = int(self.headers.get("Content-Length"))
            raw = self.rfile.read(L).decode("UTF-8")
            body = json.loads(raw)
        except:
            return self.respond(400, "Body Error")
        try:
            if (type(body["N"]) != list) or (type(body["A"]) != list):
                raise Exception("")
        except:
            return self.respond(400, "Arguments Error")
        try:
            F = functions
            for n in body["N"]:
                F = F[n]
            if not callable(F):
                raise Exception("")
        except:
            return self.respond(404, "Function Not Found")
        try: # run function
            ctx = { "N": body["N"], "A": body["A"], "F": F }
            if self.headers.get("x-forwarded-for"):
                ctx["IP"] = str(self.headers.get("x-forwarded-for")).split(",")[0]
            else:
                ctx["IP"] = self.headers.get("x-real-ip") or self.address_string()
            if callable(_hooks.get("before")):
                _hooks["before"](ctx)
            if "R" in ctx: # abort
                return self.respond(200, json.dumps({ "R": ctx["R"] }), "application/json")
            ctx["R"] = ctx["F"](*ctx["A"])
            if callable(_hooks.get("after")):
                _hooks["after"](ctx)
            return self.respond(200, json.dumps({ "R": ctx["R"] }), "application/json")
        except:
            return self.respond(500, "Internal Error")
    def log_message(*args):
        pass # disable http server log

class SRPC:
    def __call__(self, hooks={}, port=11111):
        global _hooks
        _hooks = hooks
        server = ThreadingHTTPServer(("", port), Handler)
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.start()
    def __getitem__(self, key):
        return functions[key]
    def __setitem__(self, key, value):
        functions[key] = value
        return functions[key]

srpc = SRPC()

