/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7  3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7  3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
module.exports = function(grunt) {
	require('google-closure-compiler').grunt(grunt, ['-Xms2048m']);
    var defaultConfig, packageFile;
	var path = grunt.option('src') || './configs';
	var level = grunt.option('level') || 'ADVANCED';
	var formatting = grunt.option('formatting') || '';
	var nomap = grunt.option('nomap') || '';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-replace');
	
	grunt.registerTask('build_webword_init', 'Initialize build WebWord SDK.', function(){
        defaultConfig = path + '/webword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebWord config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

	grunt.registerTask('build_nativeword_init', 'Initialize build NativeWord SDK.', function(){
        defaultConfig = path + '/nativeword.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('nativeword config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });
	
    grunt.registerTask('build_webexcel_init', 'Initialize build WebExcel SDK.', function(){
        defaultConfig = path + '/webexcel.json';
        packageFile = require(defaultConfig);

        if (packageFile)
            grunt.log.ok('WebExcel config loaded successfully'.green);
        else
            grunt.log.error().writeln('Could not load config file'.red);
    });

    grunt.registerTask('build_webpowerpoint_init', 'Initialize build WebPowerPoint SDK.', function(){
        defaultConfig = path + '/webpowerpoint.json';
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
	grunt.registerTask('build_nativeword', ['build_nativeword_init', 'build_sdk']);
	grunt.registerTask('build_webexcel',  ['build_webexcel_init', 'build_sdk']);
	grunt.registerTask('build_webpowerpoint', ['build_webpowerpoint_init', 'build_sdk']);

	grunt.registerTask('build_all', ['build_webword_init', 'build_sdk', 'build_webexcel_init', 'build_sdk', 'build_webpowerpoint_init', 'build_sdk']);
	
	grunt.registerTask('compile_sdk_init', function(compilation_level) {
		grunt.file.mkdir( packageFile['compile']['sdk']['log'] );
		var map_file_path = packageFile['compile']['sdk']['dst'] + '.map';
		var map_record_file_path = map_file_path + '.tmp';
		var tmp_sdk_path = packageFile['compile']['sdk']['dst'] + '.tmp';
		var concat_src = [
			packageFile['compile']['sdk']['dst'],
			packageFile['compile']['defines']['dst'],
			map_record_file_path ];
		var concat_src_with_banner_file = [];
		var srcFiles = packageFile['compile']['sdk']['common'];
		var sdkOpt = {
			compilation_level: compilation_level,
			warning_level: 'QUIET',
			externs: packageFile['compile']['sdk']['externs']
		};
		var definesOpt = {
			compilation_level: 'ADVANCED' === compilation_level ? 'SIMPLE' : compilation_level,
			warning_level: 'QUIET'
		};
		if (formatting) {
			definesOpt['formatting'] = sdkOpt['formatting'] = formatting;
		}
		if (!nomap) {
			sdkOpt['variable_renaming_report'] = packageFile['compile']['sdk']['log'] + '/variable.map';
			sdkOpt['property_renaming_report'] = packageFile['compile']['sdk']['log'] + '/property.map';
		}		
		
		if (grunt.option('mobile')) {
			var excludeFiles = packageFile['compile']['sdk']['exclude_mobile']
			srcFiles = srcFiles.filter(function(item) {
				return -1 === excludeFiles.indexOf(item);
			});		
			var mobileFiles = packageFile['compile']['sdk']['mobile'];
			if(mobileFiles){
				srcFiles = mobileFiles.concat(srcFiles);
			}
			concat_src_with_banner_file = concat_src_with_banner_file.concat(packageFile['compile']['sdk']['mobile_banners']);
		}
		
		if (!grunt.option('noprivate')) {
			srcFiles = srcFiles.concat(packageFile['compile']['sdk']['private']);
		}
		if (grunt.option('desktop')) {
			srcFiles = srcFiles.concat(packageFile['compile']['sdk']['desktop']);
		}
		
		concat_src_with_banner_file = concat_src_with_banner_file.concat(tmp_sdk_path)

		grunt.initConfig({
			pkg: packageFile,
			'closure-compiler': {
				sdk: {
					files: {
						'<%= pkg.compile.sdk.dst %>': srcFiles
					},
					options: sdkOpt
				},
				defines: {
					files: {
						'<%= pkg.compile.defines.dst %>': packageFile['compile']['defines']['src']
					},
					options: definesOpt
				}
			},
			concat: {
				sdk: {
					options: {
						banner: '(function(window, undefined) {',
						footer: '})(window);'
					},
					src: concat_src,
					dest: tmp_sdk_path
				},
				bannerFile: {
					src: concat_src_with_banner_file,
					dest: '<%= pkg.compile.sdk.dst %>'
				}
			},
			clean: [ 
				packageFile['compile']['defines']['dst'],
				map_record_file_path,
				tmp_sdk_path
			],
			replace: {
				version: {
					options: {
						variables: {
							Version: process.env['PRODUCT_VERSION'],
							Build: process.env['BUILD_NUMBER']
						}
					},
					files: {
						'<%= pkg.compile.sdk.dst %>': '<%= pkg.compile.sdk.dst %>'
					}
				}
			}
		});
	});
	
	grunt.registerTask('compile_sdk', ['compile_sdk_init:' + level, 'closure-compiler', 'concat', 'replace', 'clean']);
	grunt.registerTask('compile_sdk_native', ['compile_sdk_init:' + level, 'closure-compiler:sdk', 'concat', 'replace', 'clean']);
		 
	grunt.registerTask('default', ['build_webpowerpoint']);
};