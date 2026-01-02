<div align="center">

<img alt="npm" src="angular-client-side/src/assets/images/logo.png">
WebApp para a gestão de torneios de eSports


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

Is it just me or is curl a little too complicated?
Want something simpler in life? something made for humans? Try quaeso -- A Python program that reads a json/yml file for request data and sends the request

## Features

# Get Started

Fork repository

## Installation

```sh
git clone https://github.com/jaques214/rift-arena.git
```

(or)

```sh
git clone git@github.com:jaques214/rift-arena.git
```

## Run server side

```sh
cd backend-api
dotnet run --project RiftARENA
```

## Run client side

```sh
cd angular-client-side
npm start
```

## Usage example



## Sample request file (`myrequest.yml`)

### GET

```yaml
url: https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=4658
method: get
params:
  offset: 2
  limit: 100
headers:
  accept: text/xml
  accept-language: en
timeout: 5000
```

#### File Download (`quaeso -f "some/folder/myrequest.yml" > book.pdf`)

```yaml
url: http://do1.dr-chuck.com/pythonlearn/EN_us/pythonlearn.pdf
method: get
```

### POST

```yaml
url: https://jsonplaceholder.typicode.com/todos/
method: POST
headers:
  Authorization: Basic bXl1c2VybmFtZTpteXBhc3N3b3Jk
  content-type: application/json
data:
  title: walk the dog
  completed: false
timeout: 5000
```

### PUT

```yaml
url: https://jsonplaceholder.typicode.com/todos/1
method: PUT
headers:
  content-type: application/json
data:
  title: walk the dog
  completed: true
timeout: 5000
```

### DELETE

```yaml
url: https://jsonplaceholder.typicode.com/todos/1
method: DELETE
```

## Complete request file with all available fields (`myrequest.yml`)

```yaml
method: XXX # (REQUIRED) GET, OPTIONS, HEAD, POST, PUT, PATCH, or DELETE
url: XXX # (REQUIRED) must be prefixed with http:// or https://

params: # url query parameters. have as many as you like
  offset: 0
  limit: 10

data: # data for POST
  name: john
  age: 22
  hobbies:
    - running
    - eating
    - sleeping

# you can also type data in json format instead of yaml
data: |
  {
    "name": "john",
    "age": 22,
    "hobbies": ["running", "eating", "sleeping"]
  }

headers: # have as many as you like
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c


cookies: # have as many as you like
  mycookie: cookievalue
  myothercookie: othercookievalue

timeout: 3.14 # seconds

allow_redirects: true # true or false

proxies: # have as many as you like
  http: http://10.10.1.10:3128
  https: https://10.10.1.11:1080
  ftp: ftp://10.10.1.10:3128

# EITHER verify server's TLS certificate. true or false
verify: true
# OR path to a CA bundle to use
verify: some/folder/cacert.crt

# EITHER path to single ssl client cert file (*.pem)
cert: some/folder/client.pem
# OR (*.cert), (*.key) pair.
cert:
  - some/folder/client.cert
  - some/folder/client.key

```

## Development setup

Clone this repo and install packages listed in requirements.txt

```sh
pip3 install -r requirements.txt
```

## Meta

M. Zahash – zahash.z@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/zahash/](https://github.com/zahash/)

## Contributing

1. Fork it (<https://github.com/zahash/quaeso/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

# AngularClientSide

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

