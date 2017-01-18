module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ["dist/app.js", "dist/vendor.js"],
        concat: {
            app: {
                src: [
                    [
                        "src/javascript/bpmn4tosca-modeler.js",
                        "src/javascript/helper/winery.js",
                        "src/javascript/model/element.js",
                        "src/javascript/collection/managementplan.js",
                        "src/javascript/view/canvas.js",
                        "src/javascript/view/canvas.toolbar.js",
                        "src/javascript/view/dialog.js",
                        "src/javascript/view/dialog.parameter.js",
                        "src/javascript/view/element.js",
                        "src/javascript/view/element/**/*",
                    ]
                ],
                dest: 'dist/app.js'
            },
            css: {
                src: [
                    "src/css/bootstrap.css",
                    "src/css/selectize.css",
                    "src/css/bpmn4tosca-modeler.css"
                ],
                dest: "dist/bpmn4tosca-modeler.css"
            },
            vendor: {
                src: [
                    [
                        'src/javascript/vendor/jquery.js',
                        'src/javascript/vendor/jquery.serialize-object.js',
                        'src/javascript/vendor/jquery-ui.js',
                        'src/javascript/vendor/jquery-ui.touch-punch.js',
                        'src/javascript/vendor/tocca.js',
                        'src/javascript/vendor/underscore.js',
                        'src/javascript/vendor/backbone.js',
                        'src/javascript/vendor/bootstrap.js',
                        'src/javascript/vendor/selectize.js',
                        'src/javascript/vendor/jquery.jsPlumb.js',
                    ]
                ],
                dest: 'dist/vendor.js'
            }
        },
        uglify: {
            
            options: {mangle: false, compress: false},

            javascript: {
                files: {
                    'dist/bpmn4tosca-modeler.js': ['dist/vendor.js', "dist/app.js"]
                }
            }

        },
        watch: {
            files: ['**/*'],
            tasks: ['default'],
        },

    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-serve');
    grunt.registerTask('default', ["concat:vendor", "concat:app", "concat:css", "uglify:javascript", "clean"]);
};
