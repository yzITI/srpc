from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import threading, json

functions = {}

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
            f = functions
            for n in body["N"]:
                f = f[n]
            if not callable(f):
                raise Exception("")
        except:
            return self.respond(404, "Function Not Found")
        try:
            R = f(*body["A"])
            return self.respond(200, json.dumps({ "R": R }), "application/json")
        except:
            return self.respond(500, "Internal Error")
    def log_message(*args):
        pass

class SRPC:
    def __call__(self, port=11111):
        server = ThreadingHTTPServer(("", port), Handler)
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.start()
    def __getitem__(self, key):
        return functions[key]
    def __setitem__(self, key, value):
        functions[key] = value
        return functions[key]

srpc = SRPC()

