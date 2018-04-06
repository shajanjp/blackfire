# Blackfire

## Install BlackFire globally
Installing blackfire globally will help you do the magic anywhere. Blackfire is designed to work anywhere. You can just fire up the command and do pretty amazing things just like that.
```bash
npm install blackfire -g
```

## Create new project
There are so many things happening under the hood to make an API up and running from scratch, environment management, middlewares, request parsing, wiring up routes, models and controllers, we know all these pain, thats why we built this. Bootstrapping a project has never been this easy! Just one command.. boom.. your API structure is ready!
```bash
blackfire new zoo
```

## Install dependencies
Its time to invite all your package.json mentioned friends to node_modules folder. Lets throw a party!
```bash
npm install
```

## Create module
Now lets get into serious stuff, what kind of API are you making? stores? products? or even animals? Its easy to make modules in blackfire. blackfire module <singular> <plural>
```bash
blackfire module cat cats
```

## Start application
So far so good. You just made an API for your next dream project. Lets see what we have made.
```bash
npm run development
```
