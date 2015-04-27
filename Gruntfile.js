var
LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({
        port: LIVERELOAD_PORT
    }),
    mountFolder = function(connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        banner : 'E-Meeting V<%= pkg.version %> Build On <%= grunt.template.today("yyyy-mm-dd HH:MM") %> By hu.feige@gmail.com\n'+
                    '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　\n'+
                    '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　丶丶亅亅亅丶　　　　　　　　\n'+
                    '　　　　　　　　　　　丶乙瓦瓦十丶　　　　　　　　　乙車鬼毋車毋己毋車毋車乙　　　　　\n'+
                    '　　　　　　　　　亅日馬馬龠車己瓦乙亅十十十十十乙日鬼鬼日乙己瓦車車毋毋車車亅　　　　\n'+
                    '　　　丶丶　　十己鬼馬鬼乙己己日己己日日日日瓦毋日瓦鬼車毋日毋瓦毋馬瓦瓦日毋己　　　　\n'+
                    '　　毋龠馬瓦車龠龠車乙　　己己日日毋車毋瓦瓦瓦車瓦毋車龠龍鬼毋毋日日乙亅己毋亅　　　　\n'+
                    '　亅龍毋己己己乙亅　　　　己瓦瓦車毋車毋日瓦毋瓦車車鬼鬼瓦馬毋瓦瓦己　　　　　　　　　\n'+
                    '　丶丶　　　　　　亅十亅乙瓦毋己毋毋乙毋車瓦毋毋毋車車十十馬車乙瓦車亅　　　　　　　　\n'+
                    '　　　　　　　　丶己毋瓦瓦毋日毋車龠十亅己車車毋瓦日乙亅十日鬼毋己己己亅　　　　　　　\n'+
                    '　　　　丶日十亅十車瓦瓦日瓦毋車鬼己　　　亅十己瓦日己亅　亅毋鬼瓦日己日己十丶　　　　\n'+
                    '　　　　亅毋瓦乙瓦乙丶丶亅日車己丶　　　　　　　　丶　　　　　亅己己十日車鬼己十亅亅丶\n'+
                    '　　　　　　己亅丶　　　　　　　　　　　　　　　　　　　　　　　　　　　丶十乙毋日日亅\n'+
        '',
        targethtml: {
            options: {
                curlyTags: {
                    appname:'<%=pkg.name%>',
                    version:'<%=pkg.version%>',
                    rlsdate: '<%= grunt.template.today("yyyymmddHHMM") %>',
                    rlsdate2:'<%= grunt.template.today("yyyy.mm.dd HH:MM") %>',
                    banner: '<!-- <%= banner %> -->',
                    //svgstore : '<%= grunt.file.read("src/svgstore.svg") %>'
                }
            },
            dist: {
                files: {
                    'dist/index.html': 'index.tpl'
                }
            },
            dev : {
                files: {
                    'src/index.html': 'index.tpl'
                }
            }
        },
        requirejs: {
            options: {
                optimize: 'uglify',
                logLevel: 0,
                inlineText: true,
                preserveLicenseComments:true,
                wrap: {
                  start: '/** <%= banner %> **/\n'
                }
            },
            dist: {
                options: {
                    mainConfigFile: 'src/script/main.js',
                    name: 'main',
                    out: 'dist/script/<%=pkg.name%>.min.js',
                    preserveLicenseComments:false,
                    locale:false
                }
            }
        },

        uglify: {
            options: {
                compress: true
            },
            dist: {
                src: 'src/vendors/require/require.js',
                dest: 'dist/script/require.min.js'
            }
        },
        
        connect: {
            options: {
                port: 1881,
                hostname: '0.0.0.0',
                open: false,
                
            },
            
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'src')
                        ];
                    }
                }
            },
            dist:{
                options: {
                    port: 1882,
                    keepalive: true,
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }

        },
        clean: {
            css:['src/style/css/app.css'],
            build:['em-app/www/*'],
            dist:['dist/*']
          
        },
        watch: {
            
            options: {
                livereload: LIVERELOAD_PORT
            },
            script: {
                files: ['src/script/*.js','src/**.html'],
            },
            controllermodule:{
                files:['src/script/controller/**'],
                tasks:["concatmodule:controllermodule"],
                options: {
                  event: ['added', 'deleted'],
                }
            },
            viewmodule:{
                files:['src/script/view/**'],
                tasks:["concatmodule:viewmodule"],
                options: {
                  event: ['added', 'deleted'],
                }
            },
            storemodule:{
                files:['src/script/store/**'],
                tasks:["concatmodule:storemodule"],
                options: {
                  event: ['added', 'deleted'],
                }
            },
            less : {
                files: ['src/style/less/**'],
                tasks: ['clean:css','less:development']
            },
            lesspage:{
                files:['src/style/less/page/**'],
                tasks:["lesspage"],
                options: {
                  event: ['added', 'deleted'],
                }
            },
            lesspage2:{
                files:['src/style/less/page/**'],
                tasks:['clean:css','less:development'],
                options: {
                  event: ['changed'],
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**','!**/less/**','!**/res/**','!**/script/**','!**/*.less','!index.html','!index.tmp','!svgstore.svg','!**/app.css'],
                    dest: 'dist/'
                }]
            },
            nls:{
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['script/nls/**'],
                    dest: 'dist/'
                }]
            },
            build : {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: 'em-app/www/'
                }]
            }
        },
        less: {
            development: {
                options: {
                    strictImports:false
                },
                files: {
                    'src/style/css/app.css' : 'src/style/less/app.less'
                }
            },
            dist:{
                options: {
                    cleancss: true,
                    strictImports:false,
                    report: 'min'
                },
                files: {
                    'dist/style/css/<%=pkg.name%>.min.css': 'src/style/less/app.less'
                }
            }
        },
        concatmodule: {
            viewmodule: {
                options: {
                    src: 'src/script/view/',
                    prefix: 'view/',
                    dest: 'src/script/viewmodule.js'
                }

            },
            controllermodule: {
                options: {
                    src: 'src/script/controller/',
                    prefix: 'controller/',
                    dest: 'src/script/controllermodule.js'
                }
            },
            storemodule: {
                options: {
                    src: 'src/script/store/',
                    prefix: 'store/',
                    dest: 'src/script/storemodule.js'
                }
            },
            options: {
                banner: '/** <%= banner %> **/\n'
            }
        },
        lesspage : {
            main : {
                files:['src/style/less/page/**.less'],
                src : 'src/style/less/page/',
                dest : 'src/style/less/app.less'
            }
        },
        shell: {
            build: {
                command: 'cd em-app && cordova build'
            }
        },
        cordovaversion:{
            options:{
                cwd:'em-app'
            }
        }
    });


    grunt.registerTask('default', ['targethtml:dev','connect:livereload', 'watch']);
    grunt.registerTask('dist',['buildversion','clean:dist','requirejs','less:dist','uglify','targethtml:dist','copy:dist','copy:nls']);
    grunt.registerTask('build',['dist','clean:build','copy:build','cordovaversion','shell:build']);
    grunt.registerTask('buildversion',function(){
        var pkg = grunt.file.readJSON('package.json');
        var version = pkg.version;
        var date = grunt.template.today("yymmdd");
        var last;
        version = version.split('.');
        last = version[version.length-1];
        if(last.indexOf(date) > -1){
            last = parseInt(last.slice(6));
            last ++ ;
        }else{
            last = '1';
        }
        version[version.length-1] = date + last;
        pkg.version = version.join('.');
        grunt.file.write('package.json',JSON.stringify(pkg));
        grunt.config.set('pkg',pkg);
        grunt.log.writeln('buildversion Task : update version to '+ pkg.version);
    });
    grunt.registerTask('cordovaversion',function(){
        var path   = require('path');
        var libxmljs = require("libxmljs");
        var options = this.options();
        var src      = path.resolve(options.cwd);
        var xmlDoc;
        var pkg = grunt.file.readJSON('package.json');
        src = path.join(src,'config.xml');
        xmlDoc = libxmljs.parseXml(grunt.file.read(src));
        
        xmlDoc.root().attr('version').value(pkg.version);
        grunt.file.write(src,xmlDoc.toString());
        options    = null;
        src        = null;
        xmlDoc     = null;
        grunt.log.writeln('cordovaversion Task : update version to '+ pkg.version);
        
    });

    grunt.registerMultiTask('lesspage',function(){
        var fs     = require('fs');
        //var util   = require('util');
        var path   = require('path');

        //var options = this.options();
        var data      = this.data;
        var src       = data.src;
        var dest      = data.dest;

        var done = this.async();
        var text = '';
        src      = path.resolve(src);
        dest     = path.resolve(dest);
        fs.readdir(src,function(error,files){
            
            if(files.length){
                text = '@import "page/'+files.join('";\n@import "page/')+'";\n';
            }
            fs.readFile(dest, function (err, data) {
              if (err){
                done();
              };
              data = data.toString();
              data = data.replace(/\/\/autoadd[\s\S]*?\/\/endautoadd/,'//autoadd\n'+text+'//endautoadd\n');
              fs.writeFile(dest,data,function(err){
                if(err){
                    done();
                }
                done();
              })
            });
        });
    });
    grunt.registerMultiTask('concatmodule',function(){
        var fs     = require('fs');
        var util   = require('util');
        var path   = require('path');
        var config = grunt.config(this.name);
        var options =taskConfig= this.options();

        var log  = (function(name,msg){
            grunt.log.writeln(name + ' ' + msg);
        }).bind(this,this.name);
        
        var src, prefix, dest;
        var files = [];
        var js;
        if(options && 'src' in options && 'dest' in options){
            
        }else{
            return true;
        }
        src    = options.src;
        prefix = options.prefix;
        dest   = options.dest;

        src    = path.resolve(src);
        prefix = prefix ? (prefix.slice(-1) === '/' ? prefix : prefix + '/') : '';
        //log(src);
        
        fs.readdirSync(src).forEach(function(file) {

            if (fs.statSync(src + '/' + file).isDirectory()) {

            } else if (/(.+)\.js$/.test(file)) {
                // 读出所有的文件
                //log('文件名:' + src + '/' + file);
                files.push(file.replace(/\.js$/, ''));
            }
        });
        //log(files.join(','));
        js = options.banner ? options.banner + '\n' : '';
        js += "define([\n";
        js += "'" + prefix;
        js += files.join("',\n'" + prefix);
        js += "'],function(";
        js += files.join(",");
        js += "){\n";
        js += "var module = {};\n";
        files.forEach(function(file) {
            js += "module['" + file + "']=" + file + ";\n";
        });
        js += "module.module = function(m){return module[m];}\n";
        js += "return module;\n});";
        fs.writeFileSync(path.resolve(dest), js);
        log('task write file : ' + path.resolve(dest));
    });
}