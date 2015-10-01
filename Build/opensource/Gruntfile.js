module.exports = function(grunt) {
    var defaultConfig, packageFile;

    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('build_webword_init', 'Initialize build WebWord SDK.', function(){
        defaultConfig = './webword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebWord config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webexcel_init', 'Initialize build WebExcel SDK.', function(){
        defaultConfig = './webexcel.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebExcel config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webpowerpoint_init', 'Initialize build WebPowerPoint SDK.', function(){
        defaultConfig = './webpowerpoint.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebPowerPoint config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });
    
    grunt.registerTask('build_sdk', 'Build sdk.', function(){
        if (packageFile) {
            if (packageFile['tasks']['build'])
                grunt.task.run(packageFile['tasks']['build']);
            else
                grunt.log.error().writeln('Not found "build" task in configure'.red);
        } else {
            grunt.log.error().writeln('Is not load configure file.'.red);
        }
    });
    
    grunt.registerTask('build_webword',     ['build_webword_init', 'build_sdk']);
    grunt.registerTask('build_webexcel',  ['build_webexcel_init', 'build_sdk']);
    grunt.registerTask('build_webpowerpoint', ['build_webpowerpoint_init', 'build_sdk']);
    grunt.registerTask('build_all', ['build_webword_init', 'build_sdk', 'build_webexcel_init', 'build_sdk', 'build_webpowerpoint_init', 'build_sdk']);

    grunt.registerTask('compile_sdk_init', function() {
		var pkg = grunt.file.readJSON(defaultConfig);
		pkg.info.rev = "unknown";
		
		if(undefined !== process.env['BUILD_NUMBER'])
			pkg.info.build = parseInt(process.env['BUILD_NUMBER']);
			
		if(undefined !== process.env['SVN_REVISION'])
			pkg.info.rev = parseInt(process.env['SVN_REVISION']);*/
		
        grunt.initConfig({
            pkg: pkg,
            uglify: {
				options: {
				banner: '/*\n' +
						' * (c) Copyright Ascensio System SIA 2010-<%= grunt.template.today("yyyy") %>\n' +
						' *\n' +
						' * This program is a free software product. You can redistribute it and/or \n' +
						' * modify it under the terms of the GNU Affero General Public License (AGPL) \n' +
						' * version 3 as published by the Free Software Foundation. In accordance with \n' +
						' * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect \n' +
						' * that Ascensio System SIA expressly excludes the warranty of non-infringement\n' +
						' * of any third-party rights.\n' +
						' *\n' +
						' * This program is distributed WITHOUT ANY WARRANTY; without even the implied \n' +
						' * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For \n' +
						' * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html\n' +
						' *\n' +
						' * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,\n' +
						' * EU, LV-1021.\n' +
						' *\n' +
						' * The  interactive user interfaces in modified source and object code versions\n' +
						' * of the Program must display Appropriate Legal Notices, as required under \n' +
						' * Section 5 of the GNU AGPL version 3.\n' +
						' *\n' +
						' * Pursuant to Section 7(b) of the License you must retain the original Product\n' +
						' * logo when distributing the program. Pursuant to Section 7(e) we decline to\n' +
						' * grant you any rights under trademark law for use of our trademarks.\n' +
						' *\n' +
						' * All the Product\'s GUI elements, including illustrations and icon sets, as\n' +
						' * well as technical writing content are licensed under the terms of the\n' +
						' * Creative Commons Attribution-ShareAlike 4.0 International. See the License\n' +
						' * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode\n' +
						' *\n' +
						' * Version: <%= pkg.info.version %> (build:<%= pkg.info.build %>, rev:<%= pkg.info.rev %>)\n' +
						' */'
				},
                sdk: {
                    src: packageFile['compile']["sdk"]['src'],
                    dest: packageFile['compile']["sdk"]['dst']
                }
            }
        });
    });
    grunt.registerTask('compile_sdk', ['compile_sdk_init', 'uglify']);

    grunt.registerTask('default', 'build_all');
};