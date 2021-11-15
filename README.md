## Universities REST API

Projeto desenvolvido com base no test de back-end da Integra.do.

## Sobre o Projecto


Esse projecto foi desenvolvido baseado no teste de back-end da Intregra.do para analise de meus conhecimentos e habilidades com Node.js, MongoDB e solução RESTful.

Embora não tenha experiencia nas tecnologias mencionadas, meu desejo de entrar no mundo da programção me incentivou a me desafiar e tentar realizar o teste proposto.

Acredito que consegui cumprir todos os requisitos com um estrutura de arquivos bem organizada e com código simples e legível.



### Tecnologias

Nesse projeto foram utilizadas as seguintes tecnologias:

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://mongodb.github.io/node-mongodb-native/4.1/)
* [Axios](https://axios-http.com/)
* [Config](https://github.com/lorenwest/node-config)
* [Consign](https://github.com/jarradseers/consign)



## Usage

Instruções iniciais para instalação da aplicação.

### Requisitos

Instalação da ultima versão do npm.
* npm
  ```sh
  npm install -g npm
  ```

### Instalação

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```




## Utilização

Abaixo estão listados exemplos de cada funcionalidade disponível nessa aplicação.

1. Listar todas as universidades cadastradas no MongoDB.
    ```json
    "List universities [GET]": "localhost:8000/universities",
2. Listar universidades por ID.
    ```json
    "Filter universities by id [GET]": [
        "localhost:8000/universities/61900f52b9df8a3753bf1911",
        "localhost:8000/universities?id=61900f52b9df8a3753bf1911"
    ],
3. Listar universidades por país e lista de paises. Os resultados são paginados em grupos de 20 iniciando pela página 0.
    ```json
    "Filter universities by countries [GET]": [
        "localhost:8000/universities?country=brazil&page=5",
        "localhost:8000/universities?country=brazil,peru&page=5",
        "localhost:8000/universities/brazil/5",
        "localhost:8000/universities/brazil,peru/5"
    ],
4. Paginação disponível para todas as buscas.
    ```json
    "Pagination [GET]": "localhost:8000/universities?page=0",
5. Cadastros de universidade através do método POST.
    ```json
    "Insert university [POST]": [
        "localhost:8000/universities",
        {
            "alpha_two_code": "required",
            "web_pages": "required, separated by ','",
            "name": "required",
            "country": "required",
            "domains": "required, separated by ','",
            "state-province": "optional"
        }
    ],
6. Atualização dos campos web_pages, name e domains por ID através do método PUT.
    ```json
    "Update university [PUT]": [
        "localhost:8000/universities/61900f52b9df8a3753bf1911",
        {
            "web_pages": "required, separated by ','",
            "name": "required",
            "domains": "required, separated by ','"
        }
    ],
7. Exclusão de universidade do banco de dados através do método DELETE.
    ```json
    "Delete university [DELETE]": "localhost:8000/universities/61900f52b9df8a3753bf1912"



## Licença

Distribuido pela licença MIT.



## Contato

Anderson Luis Pereira - anderson.logica@gmail.com