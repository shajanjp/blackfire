# Blackfire
![BlackFire](https://img.shields.io/npm/v/blackfire.svg)

[![Express Logo](http://shajanjacob.com/blackfire/img/blackfire-example.png)](http://shajanjacob.com/blackfire)

Easy to use, modular, REST API boilerplate and generator CLI using [Node](http://nodejs.org), [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

## Everything you need for your API in seconds!
Yeah, blackfire usually takes only less than a second. Generating REST API for your dream application has never been this easy. Blackfire generates everything from basic routes, controller, schema and even swagger docs!

## Install BlackFire globally
Installing blackfire globally will help you do the magic anywhere. Blackfire is designed to work anywhere. You can just fire up the command and do pretty amazing things just like that.

```sh
npm install blackfire -g
```

## Create new project
There are so many things happening under the hood to make an API up and running from scratch, environment management, middlewares, request parsing, wiring up routes, models and controllers, we know all these pain, thats why we built this. Bootstrapping a project has never been this easy! Just one command.. boom.. your API structure is ready!

```sh
blackfire new zoo
```

## Install dependencies
Its time to invite all your package.json mentioned friends to node_modules folder. Lets throw a party!

```sh
npm install
```

## Create module
Now lets get into serious stuff, what kind of API are you making? stores? products? or even animals? Its easy to make modules in blackfire. 

```sh
blackfire module <singular> <plural>
```

```sh
blackfire module cat cats
```

## Start application
So far so good. You just made an API for your next dream project. Lets see what we have made.

```sh
npm run development
```