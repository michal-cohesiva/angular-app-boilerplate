'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var middlewareConfig = function(connect, options) {

        var middlewares = [];
        var directory = options.directory || options.base[options.base.length - 1];

        if (!Array.isArray(options.base)) {
            options.base = [options.base];
        }

        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

        options.base.forEach(function(base) {
            middlewares.push(connect.static(base));
        });

        middlewares.push(connect.directory(directory));

        return middlewares;

    };

    grunt.initConfig({

        paths: {
            dev: 'app',
            dist: 'dist'
        },

        watch: {

            javascript: {

                files: [
                    'app/scripts/**/*.js'
                ],

                tasks: [
                    'jshint:appJS'
                ],

                options: {
                    livereload: true
                }

            },

            html: {

                files: [
                    '<%= paths.dev %>/**/*.html'
                ],

                options: {
                    livereload: true
                }

            }

        },

        jshint: {

            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },

            all: [
                'Gruntfile.js',
                '<%= paths.dev %>/scripts/**/*.js',
                '<%= paths.dist %>/scripts/**/*.js',
                '!<%= paths.dev %>/scripts/vendor/**'
            ],

            appJS: [
                '<%= paths.dev %>/scripts/**/*.js',
                '!<%= paths.dev %>/scripts/vendor/**'
            ]

        },

        clean: {

            options: {
                force: true
            },

            all: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= paths.dev %>/.tmp',
                        '<%= paths.dist %>/*'
                    ]
                }]
            }

        },

        connect: {

            options: {
                port: 9666,
                hostname: 'localhost',
                livereload: 35729
            },

            proxies: [{
                context: ['/example-context'],
                host: 'localhost',
                port: 8080,
                changeOrigin: true
            }],

            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= paths.dev %>'
                    ],
                    middlewares: middlewareConfig
                },
            }

        },

        filerev: {
            files: {
                src: [
                    '<%= paths.dist %>/scripts/**/*.js',
                    '<%= paths.dist %>/styles/**/*.css'
                ]
            }
        },

        uglify: {
            options: {
                mangle: false
            }
        },

        useminPrepare: {
            html: '<%= paths.dev %>/index.html',
            options: {
                dest: '<%= paths.dist %>'
            }
        },

        usemin: {

            html: ['<%= paths.dist %>/**/*.html'],
            css: ['<%= paths.dist %>/styles/**/*.css'],

            options: {
                assetsDirs: [
                    '<%= paths.dist %>'
                ]
            }

        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.dev %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        '*.html'
                    ]
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>',
                    src: [
                        '*.html'
                    ],
                    dest: '<%= paths.dist %>'
                }]
            }
        }

    });

    grunt.registerTask('serve', [
        'jshint:appJS',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('serve-proxy-backend', [
        'jshint:appJS',
        'configureProxies',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'useminPrepare',
        'jshint',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', ['serve']);

};
