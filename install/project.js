#!/usr/bin/env node

// echo "# relay-simple" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git remote add origin https://github.com/akatebi/relay-simple.git
// git push -u origin master

const projects = [
                    'akatebi/todo',
                    'akatebi/relay-treasurehunt',
                    'akatebi/relay-starter-kit',
                    'BerndWessels/react-webpack',
                    'relay-tools/relay-local-schema',
                    'relay-tools/react-router-relay',
                    'chentsulin/koa-graphql',
                    'chentsulin/koa-graphql-relay-example',
                    'facebook/relay',
                    'facebook/graphql',
                    'graphql/graphql-js',
                    'graphql/graphql-relay-js',
                    'graphql/swapi-graphql',
                    'matthewmueller/graph.ql',
                    'clayallsopp/graphql-intro',
                    'kadirahq/graphql-blog-schema',
                    'taion/relay-todomvc',
                    'akatebi/redux-form',
                    // 'rackt/react-autocomplete',
                    // 'rackt/react-router',
                ];


const names = projects.map( project => project.split('/').reverse().join('.'));

var fs = require('fs');
var path = require('path');

require('shelljs/global');

var target = path.join(__dirname, '../../project');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

// rm('-rf', target);
mkdir('-p', target);

projects.forEach(project => {
    var name = project.split('/').reverse().join('.');
    // console.log(folder);
    var folder = path.join(target, name);
    if(fs.existsSync(folder)) {
        cd(folder);
        console.log('==>>>', project);
        exec('git pull');
    } else {
        var clone = 'git clone https://github.com/'+project+'.git';
        // console.log(clone);
        cd(target)
        exec(clone+' '+name);
    }
});

fs.readdirSync(target).forEach( folder => {
    if(names.indexOf(folder) === -1) {
        folder = path.join(target, folder);
        console.log('removing', folder);
        rm('-rf', folder);
    }
});
