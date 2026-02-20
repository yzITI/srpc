# Python SRPC Client
# https://github.com/yzITI/srpc

import requests

class SRPC:
    def __init__(self, url='', N=[]):
        self.url = url
        self.N = N
    def __call__(self, *A):
        if len(self.N) == 0:
            self.url = A[0]
            return self.url
        try:
            res = requests.post(self.url, json={ 'N': self.N, 'A': A })
            res.raise_for_status()
        except requests.exceptions.HTTPError as e:
            raise Exception(f"HTTP Error {e.response.status_code}: {e.response.content.decode()}")
        return res.json()['R']
    def __getattr__(self, key):
        return SRPC(self.url, self.N + [key])
    def __getitem__(self, key):
        return SRPC(self.url, self.N + [key])

srpc = SRPC()

