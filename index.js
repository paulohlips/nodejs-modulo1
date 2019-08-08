const express = require("express");

const server = express();
server.use(express.json());

const users = ["Diego", "Paulo", "Henrique"];

//middleware de log
server.use((req, res, next) => {
  console.log(`Method: ${req.method}, URL: ${req.url} `);

  return next();
});

//middleware de verificação de id de usuário
function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "User dosn't exist." });
  }
}

//middleware de verificação nome de usuário
function checkUserExist(req, res, next) {
  if (!req.body.nome) {
    return res
      .status(400)
      .json({ error: "Username not found on request body." });
  }

  return next();
}

//lista usuários
server.get("/users", (req, res) => {
  return res.json(users);
});
//lista o usuário na posição [index]
server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  return res.json(users[index]);
});
//cria usuário
server.post("/users", checkUserExist, (req, res) => {
  const { nome } = req.body;
  users.push(nome);

  return res.json(users);
});
//edita usuário
server.put("/users/:index", checkUserExist, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { nome } = req.body;

  users[index] = nome;

  return res.json(users);
});
//deleta usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
