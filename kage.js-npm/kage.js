#!/usr/bin/env node
var args = process.argv.splice(2);

if(args.length < 1) {
    console.log("\nUsage: kagejs [init|model|section|view] [<name>]\n");
    process.exit();
}

if(args[0] !== 'init' && args.length < 2) {
    console.log("\nUsage: kagejs [model|section|view] <name>\n");
    process.exit();
}

var allowedTypes = {
    'model': {
        suffix: 'Model',
        path: process.cwd() + '/public_html/js/app/models/',
        ext: '.js'
    }, 
    'section': {
        suffix: 'Section',
        path: process.cwd() + '/public_html/js/app/sections/',
        ext: '.js'
    },
    
    'view': {
        suffix: null,
        path: process.cwd() + '/public_html/js/app/templates/',
        ext: '.ejs'
    }
};

var generate = function(type, filename) {
    if(!allowedTypes[type]) {
        throw new TypeError("Undefined type: " + type);
    }
    
    var fs = require('fs');
    var typeSuffix = allowedTypes[type].suffix;
    var filePath = allowedTypes[type].path;
    var extension = allowedTypes[type].ext;
    
    
    var template = fs.readFileSync(__dirname + '/templates/' + type + '.tpl',{
        encoding: 'utf8'
    });
    
    var fileName = filename;
    if(fileName.indexOf('/') !== -1) {
        var path = filename.split('/');
        fileName = path[path.length - 1];
        for(var i = 0; i < path.length - 1; i++) {
            filePath += path[i] + '/';
            if(!fs.existsSync(filePath)) {
                fs.mkdir(filePath);
            }
        }
    }

    if(typeSuffix !== null && !(new RegExp(typeSuffix+'$')).test(fileName)) {
        fileName += typeSuffix;
    }
    
    template = template.replace(/\$\(name\)/g, fileName);
    var generatedFile = filePath + fileName + extension;
    
    if(fs.existsSync(generatedFile)) {
        throw new Error('File exists: ' + generatedFile);
    }
    
    fs.writeFileSync(generatedFile, template);
    
    console.log(generatedFile + ' - Created');
};

switch (args[0]) {
    case 'init':
        var wrench = require('wrench');
        var fs = require('fs');
        wrench.copyDirSyncRecursive(__dirname + '/templates/project/', process.cwd()+'/public_html', 
        {
            forceDelete: true
        });
        
        fs.mkdir(process.cwd() + '/tests');
        fs.mkdir(process.cwd() + '/config');
        
        console.log('Root/');
        console.log('  |');
        console.log("  +--css/");
        console.log('  |');
        console.log("  +--js/");
        console.log('  |  |');
        console.log("  |  +--app/");
        console.log('  |  |  |');
        console.log("  |  |  +--helpers/");
        console.log('  |  |  |');
        console.log("  |  |  +--models/");
        console.log('  |  |  |  |');
        console.log("  |  |  |  +--BaseModel.js");
        console.log('  |  |  |');
        console.log("  |  |  +--sections/");
        console.log('  |  |  |  |');
        console.log("  |  |  |  +--BaseSection.js");
        console.log('  |  |  |  |');
        console.log("  |  |  |  +--Main.js");
        console.log('  |  |  |');
        console.log("  |  |  +--templates/");
        console.log('  |  |');
        console.log("  |  +--config/");
        console.log('  |  |  |');
        console.log("  |  |  +--application.js");
        console.log('  |  |');
        console.log("  |  +--libs/");
        console.log('  |  |  |');
        console.log("  |  |  +--jquery.js");
        console.log('  |  |  |');
        console.log("  |  |  +--kage.js");
        console.log('  |  |  |');
        console.log("  |  |  +--require.js");
        console.log('  |  |');
        console.log("  |  +--vendor/");
        console.log('  |  |');
        console.log("  |  +--main.js");
        console.log('  |');
        console.log("  +--resources/");
        console.log('  |');
        console.log("  +--scss/");
        console.log('  |');
        console.log("  +--index.html");
        console.log('kage.js Project Generated.');
        break;
    default:
        generate(args[0], args[1]);
        break;
}

