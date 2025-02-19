# TECH-CHALLENGE-MOBILE

Tech Challenge Mobile é uma interface gráfica em React Native desenvolvida como atividade que integra os conhecimentos adquiridos durante o módulo de Mobile, Fase 4 da Pós Tech FIAP Full Stack Development, do Grupo 1, Turma 2FSDT.

Membros do grupo 1 - 2FSDT:

- RM: 357717 Cristiano Gomes da Rocha,
- RM: 357154 Diego da Silva Gervasio,
- RM: 357480 Douglas Yogi Yokomizo,
- RM: 356535 João Vitor dos Santos Correa,
- RM: 357920 Marcos Alberto Herrera Bordalo.

## Objetivo

O objetivo desta interface gráfica mobile é fornecer uma aplicação blogging robusta, intuitiva e eficiente. A aplicação deve ser acessível e fácil de usar, permitindo que os docentes e alunos(as) possam interagir com os diversos endpoints REST já implementados no back-end, utilizando login e autenticação para gerenciar as postagens do blog por meio das operações de criação, edição, deleção e listagens de post.

---

## Video de apresentação

[Link do video de apresentação](https://drive.google.com)

---

## Tecnologias utilizadas no frontend

- React Native

---

## Instalação da aplicação



```bash
npm install
npm run proxy
npm run web

npx expo start
```

---

## Usúarios de testes

```bash
user: professor@fiap.com
key:  password1234

user: aluno@fiap.com
key:  password1234
```

---

## Telas da aplicação

Tela 1: Home - Listagem de Posts

- Exibe uma lista de todos os posts disponíveis,
- Permite que todos usuários naveguem para as páginas de visualização de um post,
- Permite que todos usuários façam a busca de um post pelo campo de busca,
- Permite que o professor e o aluno faça login.

![Home](public/assets/images/home.png)

Tela 2: Login

- Exibe o formulário para fazer a autenticação e gestão do conteúdo.

![Login](public/assets/images/login.png)

Tela 3: Página de administração

- Exibe o conteúdo detalhado de um post selecionado,
- Oferece opções para criação, edição ou exclusão de um post somente para professores logados,
- Oferece opção de logout para o professor que estiver logado.

![CRUD](public/assets/images/crud.png)

Tela 4: Criação de Post

- Permite que o professor crie um novo post, inserindo título, conteúdo, imagem  e outras informações relevantes.

![Create](public/assets/images/create.png)

Tela 5: Edição de Post

- Permite que o professor edite um post existente.

![Edit/Update](public/assets/images/edit.png)

Tela 6: Exclusão de Post

- Permite que o professor exclua um post existente.

![Delete](public/assets/images/delete.png)

Tela 7: Criação de Professores

- Permite que o administrador cadastre um novo professor.

![Create](public/assets/images/create-professor.png)

Tela 8: Edição de Professor

- Permite que o administrador edite um professor existente.

![Edit/Update](public/assets/images/edit-professor.png)

Tela 9: Listagem de Professores

- Exibe uma lista de todos os professores cadastrados.

![Index](public/assets/images/index-professor.png)

---

## Back-End utilizado

Este repositório contém a implementação do back-end do **Tech Challenge 3** com algumas adaptações.

O sistema está em produção e foi desenvolvido com base nas especificações fornecidas, utilizando o front-end do **Tech Challenge Mobile**

A API está totalmente documentada usando o Swagger. Você pode acessar a documentação interativa da API através do seguinte link:

[Documentação da API (Swagger)](https://tech-challenge-back-end.vercel.app/api-docs#/)

### Tecnologias utilizadas no backend

- Linguagem: Node.js
- Framework: Express
- Banco de Dados:  MongoDB
- Documentação: Swagger
- Deploy: Vercel

---

## Relato de experiências e desafios

Desde o início, o grupo decidiu versionar o código diretamente no GitHub, o que permitiu uma organização eficiente da estrutura inicial e dos padrões do projeto. A cada etapa da implementação da interface, todos os integrantes eram notificados sobre novos Pull Requests (PRs) abertos na branch principal, garantindo a colaboração contínua e a revisão conjunta do código.

As aulas da Fase 4 foram fundamentais para o desenvolvimento do projeto, fornecendo a base necessária para avançarmos com confiança. Sempre que surgiam dúvidas ou obstáculos, reassistir as aulas ou buscar soluções na internet tornou o processo de resolução de problemas mais ágil e eficaz.

Além disso, os encontros semanais de todo o grupo desempenharam um papel crucial, promovendo discussões e alinhamentos que contribuíram para o progresso contínuo e a conclusão bem-sucedida do projeto.
