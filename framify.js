/*
 * framify 0.7.1
 * -----------------
 * Turns basic HTML and layout CSS into wireframes
 *
 * http://www.framify.com/
 *
 *
 * Copyright (c) 2012 Art Lawry
 * Licensed under the MIT licenses.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($){
	
	$.framify = function(method){
		$(document).framify(method);
	};

	var colors = [ 'grey', 'blue', 'green', 'yellow', 'orange', 'red', 'purple' ];
	
	var getElementOffset = function(element) {
		
		var obj = element;
		
		var offsetLeft = obj.offsetLeft;
		var offsetTop = obj.offsetTop;
		
		if (obj.tagName.toLowerCase() === 'img') {
			offsetLeft += parseInt($(obj).css('padding-left'),10);
			offsetTop += parseInt($(obj).css('padding-top'),10);
		}
		
		if (obj.offsetParent) {
			while (obj.offsetParent) {
				obj = obj.offsetParent;
				if (obj.tagName.toLowerCase() === 'body' || $(obj).css('position').toLowerCase() === 'absolute' || $(obj).css('position').toLowerCase() === 'relative') {
					break;
				} else {
					offsetLeft += obj.offsetLeft;
					offsetTop += obj.offsetTop;
				}
			}
		}
		
		return [offsetLeft, offsetTop];
	};
	
	var methods = {
	
		init : function(options){
		
			var defaultOptions = {
				'toggle': 1,
				'toggle-class': 'styled',
				
				'color': 1,
				
				'grid': 'body',
				'columns': 0,
				'gutter': 0,
				
				'sections': 'div, nav, section, article, header, footer, aside',
				
				'table': 1,
				'video': 1,
				'audio': 1,
				'canvas': 1,
				'image': 1,
				'form' : 1,
				
				'table-exclude' : '',
				'video-exclude': '',
				'audio-exclude': '',
				'canvas-exclude': '',
				'image-exclude': '',
				'form-exclude': ''
			};
			
			if (typeof(options) != 'undefined') {
				// validate argument values
				
				var validClass = /^[\w\-]+$/;
				var validNumber = /^(0|[1-9][0-9]?)$/;
				var numberTooLarge = 100;
				var validUnit = /^(0|[1-9][0-9]?)(\.[0-9]+)?(px|em|rem|%)$/;
				
				if (typeof(options.toggle) != 'undefined') {
					options.toggle = options.toggle ? 1 : 0;
				}
				
				if (typeof(options['toggle-class']) != 'undefined') {
					if (! options['toggle-class'].match(validClass)) {
						options['toggle-class'] = defaultOptions.toggleClass;
					}
				}
				
				if ( typeof(options.color) != 'undefined') {
					options.color = options.color ? 1 : 0;
				}
				
				if (typeof(options.grid) != 'undefined') {
					if (! $(options.grid).length || $(options.grid).length > 1) {
						options.grid = defaultOptions.grid;
					}
				}
				
				if ( typeof(options.columns) != 'undefined') {
					if (! options.columns.match(validNumber) || parseInt(options.columns,10) >= numberTooLarge) {
						options.columns = defaultOptions.columns;
					}
				}
				
				if ( typeof(options.gutter) != 'undefined') {
					if (! options.gutter.match(validUnit)) {
						options.gutter = defaultOptions.gutter;
					}
				}
				
				// no need to test sections
				
				if (typeof(options.table) != 'undefined') {
					options.table = options.table ? 1 : 0;
				}
				
				if (typeof(options.video) != 'undefined') {
					options.video = options.video ? 1 : 0;
				}
				
				if (typeof(options.audio) != 'undefined') {
					options.audio = options.audio ? 1 : 0;
				}
				
				if (typeof(options.canvas) != 'undefined') {
					options.canvas = options.canvas ? 1 : 0;
				}
				
				if (typeof(options.image) != 'undefined') {
					options.image = options.image ? 1 : 0;
				}
				
				if (typeof(options.form) != 'undefined') {
					options.form = options.form ? 1 : 0;
				}
				
				// no need to test *-exclude
			}
		
			var settings = $.extend(defaultOptions, options);
			
			if (! $('#framify-styles').length) {
				//base 64 styles to prevent need for linking to an external stylesheet
				$('head').append('<link rel="stylesheet" href="data:text/css;base64,LmZyYW1pZnktY29sdW1ucy1iYWNrZ3JvdW5kLA0KLmZyYW1pZnktaW1hZ2Utd2lyZWZyYW1lLA0KLmZyYW1pZnktdmlkZW8td2lyZWZyYW1lLA0KLmZyYW1pZnktYXVkaW8td2lyZWZyYW1lLA0KLmZyYW1pZnktY2FudmFzLXdpcmVmcmFtZSwNCi5mcmFtaWZ5LXJhZGlvLXdpcmVmcmFtZSwNCi5mcmFtaWZ5LWNoZWNrYm94LXdpcmVmcmFtZSwNCi5mcmFtaWZ5LXNlY3Rpb24taWRlbnRpZmllciB7DQogIGRpc3BsYXk6IG5vbmU7IH0NCg0KLmZyYW1pZnktdWksICNmcmFtaWZ5LXRvZ2dsZSwgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWlkZW50aWZpZXIgew0KICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOw0KICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7DQogIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7DQogIC1tcy11c2VyLXNlbGVjdDogbm9uZTsNCiAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7DQogIHVzZXItc2VsZWN0OiBub25lOw0KICB0b3A6IC0xcHg7DQogIGRpc3BsYXk6IGJsb2NrOw0KICBib3JkZXItb2Zmc2V0OiAtMXB4Ow0KICBvdmVyZmxvdzogaGlkZGVuOw0KICB0ZXh0LWFsaWduOiBjZW50ZXI7DQogIHotaW5kZXg6IDEwMDA7DQogIGZvbnQtc2l6ZTogMTZweDsNCiAgYm94LXNoYWRvdzogMCAwIDJweCAjMDAwOw0KICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBUUFBQUFFQ0FZQUFBQ3A4WjUrQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5UnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUUxaFkybHVkRzl6YUNJZ2VHMXdUVTA2U1c1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNE16ZzBOMFUyT1RNMk5EUXhNVVV4UWpaQ05UaERRVE5GUlRjNU1USTJNaUlnZUcxd1RVMDZSRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG80TXpnME4wVTJRVE0yTkRReE1VVXhRalpDTlRoRFFUTkZSVGM1TVRJMk1pSStJRHg0YlhCTlRUcEVaWEpwZG1Wa1JuSnZiU0J6ZEZKbFpqcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPamd6T0RRM1JUWTNNelkwTkRFeFJURkNOa0kxT0VOQk0wVkZOemt4TWpZeUlpQnpkRkpsWmpwa2IyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qZ3pPRFEzUlRZNE16WTBOREV4UlRGQ05rSTFPRU5CTTBWRk56a3hNall5SWk4K0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4K1Z0MkRXd0FBQUNKSlJFRlVlTnBpWUdCZ2FBQmlodi8vLzRPb0JrWUdCR2hnUU9NMFlPVUFCQmdBSGxnR2Z5ODBVTWNBQUFBQVNVVk9SSzVDWUlJPSk7DQogIGJhY2tncm91bmQtcmVwZWF0OiByZXBlYXQ7DQogIGJhY2tncm91bmQtY29sb3I6ICNlNWU1ZTU7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsNCiAgYm9yZGVyOiAxcHggc29saWQgIzRkNGQ0ZDsNCiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjcpOw0KICBjb2xvcjogIzRkNGQ0ZDsNCiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsNCiAgY3Vyc29yOiBwb2ludGVyOw0KICBjdXJzb3I6IGhhbmQ7IH0NCg0KI2ZyYW1pZnktdG9nZ2xlIHsNCiAgd2lkdGg6IDQwcHg7DQogIGhlaWdodDogNDBweDsNCiAgcG9zaXRpb246IGZpeGVkOw0KICAtd2Via2l0LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAyMHB4Ow0KICAta2h0bWwtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDIwcHg7DQogIC1tb3otYm9yZGVyLXJhZGl1cy1ib3R0b21yaWdodDogMjBweDsNCiAgLW1zLWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAyMHB4Ow0KICAtby1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMjBweDsNCiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDIwcHg7DQogIC13ZWJraXQtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMjBweDsNCiAgLWtodG1sLWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDIwcHg7DQogIC1tb3otYm9yZGVyLXJhZGl1cy1ib3R0b21sZWZ0OiAyMHB4Ow0KICAtbXMtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMjBweDsNCiAgLW8tYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMjBweDsNCiAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMjBweDsNCiAgbGluZS1oZWlnaHQ6IDQycHg7IH0NCiAgI2ZyYW1pZnktdG9nZ2xlIHNwYW4gew0KICAgIHdpZHRoOiAzMHB4Ow0KICAgIGhlaWdodDogMzBweDsNCiAgICBsaW5lLWhlaWdodDogMzJweDsNCiAgICBkaXNwbGF5OiBibG9jazsNCiAgICBtYXJnaW46IDVweDsNCiAgICBjb2xvcjogI2IzYjNiMzsNCiAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpOw0KICAgIGJhY2tncm91bmQtY29sb3I6ICM0ZDRkNGQ7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpOw0KICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAta2h0bWwtYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDIwcHg7DQogICAgLW1zLWJvcmRlci1yYWRpdXM6IDIwcHg7DQogICAgLW8tYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICBib3JkZXItcmFkaXVzOiAyMHB4OyB9DQogICNmcmFtaWZ5LXRvZ2dsZTpob3ZlciB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogIzMzMzMzMzsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7DQogICAgYm9yZGVyOiAxcHggc29saWQgIzFhMWExYTsNCiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuOSk7DQogICAgY29sb3I6ICMxYTFhMWE7DQogICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTsgfQ0KICAgICNmcmFtaWZ5LXRvZ2dsZTpob3ZlciBzcGFuIHsNCiAgICAgIGNvbG9yOiAjZTVlNWU1Ow0KICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxYTFhMWE7DQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7IH0NCg0KLmZyYW1pZmllZCB7DQogIGJhY2tncm91bmQtY29sb3I6ICNmZmY7DQogIGNvbG9yOiAjYjNiM2IzOw0KICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjMpOyB9DQogIC5mcmFtaWZpZWQgYSB7DQogICAgY29sb3I6ICM0ZDRkNGQ7DQogICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsgfQ0KICAgIC5mcmFtaWZpZWQgYTpsaW5rLCAuZnJhbWlmaWVkIGE6dmlzaXRlZCB7DQogICAgICBjb2xvcjogIzRkNGQ0ZDsNCiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNyk7IH0NCiAgICAuZnJhbWlmaWVkIGE6aG92ZXIsIC5mcmFtaWZpZWQgYTphY3RpdmUgew0KICAgICAgY29sb3I6ICMxYTFhMWE7DQogICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1pZGVudGlmaWVyIHsNCiAgICB3aWR0aDogMzBweDsNCiAgICBoZWlnaHQ6IDMwcHg7DQogICAgcG9zaXRpb246IGFic29sdXRlOw0KICAgIHRvcDogLTFweDsNCiAgICBsZWZ0OiAtMXB4Ow0KICAgIC13ZWJraXQtYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogICAgLWtodG1sLWJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAgIC1tb3otYm9yZGVyLXJhZGl1cy10b3ByaWdodDogMTVweDsNCiAgICAtbXMtYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogICAgLW8tYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogICAgLXdlYmtpdC1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAta2h0bWwtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDE1cHg7DQogICAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbXJpZ2h0OiAxNXB4Ow0KICAgIC1tcy1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAtby1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAtd2Via2l0LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDE1cHg7DQogICAgLWtodG1sLWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDE1cHg7DQogICAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbWxlZnQ6IDE1cHg7DQogICAgLW1zLWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDE1cHg7DQogICAgLW8tYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMTVweDsNCiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxNXB4Ow0KICAgIGxpbmUtaGVpZ2h0OiAzMnB4OyB9DQogICAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWlkZW50aWZpZXIgc3BhbiB7DQogICAgICB3aWR0aDogMjBweDsNCiAgICAgIGhlaWdodDogMjBweDsNCiAgICAgIGxpbmUtaGVpZ2h0OiAyMnB4Ow0KICAgICAgZGlzcGxheTogYmxvY2s7DQogICAgICBtYXJnaW46IDVweDsNCiAgICAgIGNvbG9yOiAjYjNiM2IzOw0KICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KTsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0ZDRkNGQ7DQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNyk7DQogICAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDIwcHg7DQogICAgICAta2h0bWwtYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAgIC1tb3otYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAgIC1tcy1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgICAgLW8tYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1jb2x1bW5zLWJhY2tncm91bmQgew0KICAgIGRpc3BsYXk6IGJsb2NrOw0KICAgIHBvc2l0aW9uOiBmaXhlZDsNCiAgICB0b3A6IDA7DQogICAgei1pbmRleDogLTE7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1pbWFnZSwNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS12aWRlbywNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1hdWRpbywNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1jYW52YXMsDQogIC5mcmFtaWZpZWQgLmZyYW1pZnktcmFkaW8taW5wdXQsDQogIC5mcmFtaWZpZWQgLmZyYW1pZnktY2hlY2tib3gtaW5wdXQgew0KICAgIHZpc2liaWxpdHk6IGhpZGRlbjsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWltYWdlLXdpcmVmcmFtZSwNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS12aWRlby13aXJlZnJhbWUsDQogIC5mcmFtaWZpZWQgLmZyYW1pZnktYXVkaW8td2lyZWZyYW1lLA0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWNhbnZhcy13aXJlZnJhbWUsDQogIC5mcmFtaWZpZWQgLmZyYW1pZnktcmFkaW8td2lyZWZyYW1lLA0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWNoZWNrYm94LXdpcmVmcmFtZSB7DQogICAgZGlzcGxheTogYmxvY2s7DQogICAgcG9zaXRpb246IGFic29sdXRlOw0KICAgIHotaW5kZXg6IDEwMDA7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsNCiAgICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50Ow0KICAgIGJveC1zaGFkb3c6IDAgMCAwIDFweCAjYjNiM2IzIGluc2V0Ow0KICAgIGJveC1zaGFkb3c6IDAgMCAwIDFweCByZ2JhKDAsIDAsIDAsIDAuMykgaW5zZXQ7IH0NCiAgICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24gLmZyYW1pZnktc2VjdGlvbiB7DQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1ncmV5IHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24tcmVkIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZlNWU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjEpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1vcmFuZ2Ugew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmYzZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDE0MCwgMCwgMC4xKTsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24teWVsbG93IHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDAsIDAuMSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWdyZWVuIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVmZmU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMjU1LCAwLCAwLjEpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1ibHVlIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWZmOw0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMjU1LCAwLjEpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1wdXJwbGUgew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNmNWU4ZmQ7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjAsIDMyLCAyNDAsIDAuMSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1idXR0b24gew0KICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTsNCiAgICAta2h0bWwtYXBwZWFyYW5jZTogbm9uZTsNCiAgICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7DQogICAgLW1zLWFwcGVhcmFuY2U6IG5vbmU7DQogICAgLW8tYXBwZWFyYW5jZTogbm9uZTsNCiAgICBhcHBlYXJhbmNlOiBub25lOw0KICAgIGJhY2tncm91bmQtY29sb3I6ICNlNWU1ZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOw0KICAgIGNvbG9yOiAjNGQ0ZDRkOw0KICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNyk7DQogICAgYm9yZGVyLW9mZnNldDogLTFweDsNCiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDVweDsNCiAgICAta2h0bWwtYm9yZGVyLXJhZGl1czogNXB4Ow0KICAgIC1tb3otYm9yZGVyLXJhZGl1czogNXB4Ow0KICAgIC1tcy1ib3JkZXItcmFkaXVzOiA1cHg7DQogICAgLW8tYm9yZGVyLXJhZGl1czogNXB4Ow0KICAgIGJvcmRlci1yYWRpdXM6IDVweDsNCiAgICBib3JkZXI6IDFweCBzb2xpZCAjNGQ0ZDRkOw0KICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC43KTsgfQ0KICAgIC5mcmFtaWZpZWQgLmZyYW1pZnktYnV0dG9uOmhvdmVyIHsNCiAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTsNCiAgICAgIC1raHRtbC1hcHBlYXJhbmNlOiBub25lOw0KICAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lOw0KICAgICAgLW1zLWFwcGVhcmFuY2U6IG5vbmU7DQogICAgICAtby1hcHBlYXJhbmNlOiBub25lOw0KICAgICAgYXBwZWFyYW5jZTogbm9uZTsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7DQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7DQogICAgICBib3JkZXI6IDFweCBzb2xpZCAjMWExYTFhOw0KICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjkpOw0KICAgICAgY29sb3I6ICMxYTFhMWE7DQogICAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktdGV4dC1pbnB1dCB7DQogICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lOw0KICAgIC1raHRtbC1hcHBlYXJhbmNlOiBub25lOw0KICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZTsNCiAgICAtbXMtYXBwZWFyYW5jZTogbm9uZTsNCiAgICAtby1hcHBlYXJhbmNlOiBub25lOw0KICAgIGFwcGVhcmFuY2U6IG5vbmU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTVlNTsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7DQogICAgYm9yZGVyLW9mZnNldDogLTFweDsNCiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjNiM2IzOw0KICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4zKTsNCiAgICBjb2xvcjogI2IzYjNiMzsNCiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjMpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktdGFibGUgew0KICAgIHBhZGRpbmc6IDA7DQogICAgbWFyZ2luOiAwOw0KICAgIGJvcmRlcjogMXB4IHNvbGlkICNiM2IzYjM7DQogICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjMpOw0KICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7DQogICAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTVlNTsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7IH0NCiAgICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXRhYmxlIHRyIHsNCiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNiM2IzYjM7DQogICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMyk7IH0NCiAgICAgIC5mcmFtaWZpZWQgLmZyYW1pZnktdGFibGUgdHIgdGggew0KICAgICAgICBwYWRkaW5nOiAwIDEwcHg7DQogICAgICAgIG1hcmdpbjogMDsNCiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTVlNTsNCiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOw0KICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjYjNiM2IzOw0KICAgICAgICBib3JkZXI6IDFweCBkb3R0ZWQgcmdiYSgwLCAwLCAwLCAwLjMpOw0KICAgICAgICBmb250LXdlaWdodDogbm9ybWFsOw0KICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0OyB9DQogICAgICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXRhYmxlIHRyIHRkIHsNCiAgICAgICAgcGFkZGluZzogMCAxMHB4Ow0KICAgICAgICBtYXJnaW46IDA7DQogICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNiM2IzYjM7DQogICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCByZ2JhKDAsIDAsIDAsIDAuMyk7DQogICAgICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7DQogICAgICAgIHRleHQtYWxpZ246IGxlZnQ7IH0NCg%3D%3D">');
			}
			$('#framify-toggle').remove();
			$('body').addClass('framified').removeClass(settings['toggle-class']);
			
			$('.framify-columns').removeClass('framify-columns').children('.framify-columns-background').remove();
			$('.framify-section-identifier').remove();
			for (var color in colors) {
				$('.framify-section-' + colors[color]).removeClass('framify-section-' + colors[color]);
			}
			$('.framify-section').removeClass('framify-section');
			$('.framify-table').removeClass('framify-table');
			$('.framify-video').removeClass('framify-video').next('.framify-video-wireframe').remove();
			$('.framify-audio').removeClass('framify-audio').next('.framify-audio-wireframe').remove();
			$('.framify-image').removeClass('framify-image').next('.framify-image-wireframe').remove();
			$('.framify-button').removeClass('framify-button');
			$('.framify-text-input').removeClass('framify-text-input');
			$('.framify-radio-input').removeClass('framify-radio-input').next('.framify-radio-wireframe').remove();
			$('.framify-checkbox-input').removeClass('framify-checkbox-input').next('.framify-checkbox-wireframe').remove();
			
			if (settings.canvas) {
				$('canvas').not(settings['canvas-exclude']).addClass('framify-canvas');
			}
			$('.framify-canvas').each(function(){
				var $origin = $(this);
				if (! $origin.next().hasClass('framify-canvas-wireframe')) {
					$origin.after('<canvas class="framify-canvas-wireframe"></canvas>');
					$origin.unbind('load').load(function(){
						$.framify('redraw');
					});
				}
			});
			
			if (settings.grid && settings.columns) {
				$(settings.grid).addClass('framify-columns').append('<canvas class="framify-columns-background" data-columns="' + settings.columns + '" data-gutter="' + settings.gutter + '"></canvas>');
			}
			
			var $sections = this[0] === document ? $(settings.sections) : this;
			var sectionNumber = 0;
			$sections.not('[id^="framify"]').each(function(){
				var $origin = $(this);
				$origin.addClass('framify-section');
				if (! $origin.parents('.framify-section').length) {
					var colorIndex = sectionNumber % colors.length;
					sectionNumber ++;
					var thisColor = 'grey';
					if (settings.color) {
						thisColor = colors[colorIndex];
					}
					$origin.addClass('framify-section-' + thisColor);
					$origin.after('<div class="framify-section-identifier"><span>' + sectionNumber + '</span></div>');
				}
			});
			
			if (settings.toggle) {
				if (! $('#framify-toggle').length) {
					$('body').append('<div id="framify-toggle"><span>&fnof;</span></div>');
					$('#framify-toggle').click(function(){
						$('body').toggleClass('framified').toggleClass(settings['toggle-class']);
					});
				}
			}
			
			if (settings.table) {
				$('table').not(settings['table-exclude']).addClass('framify-table');
			}
			
			if (settings.video) {
				$('video, embed, object').not(settings['video-exclude']).addClass('framify-video');
				$('.framify-video .framify-video').removeClass('framify-video');
			}
			$('.framify-video').each(function(){
				var $origin = $(this);
				if (! $origin.next().hasClass('framify-video-wireframe')) {
					$origin.after('<canvas class="framify-video-wireframe"></canvas>');
				}
			});
			
			if (settings.audio) {
				$('audio[controls]').not(settings['audio-exclude']).addClass('framify-audio');
			}
			$('.framify-audio').each(function(){
				var $origin = $(this);
				if (! $origin.next().hasClass('framify-audio-wireframe')) {
					$origin.after('<canvas class="framify-audio-wireframe"></canvas>');
				}
			});
			
			if (settings.image) {
				$('img').not(settings['image-exclude']).addClass('framify-image');
			}
			$('.framify-image').each(function(){
				var $origin = $(this);
				if (! $origin.next().hasClass('framify-image-wireframe')) {
					$origin.after('<canvas class="framify-image-wireframe"></canvas>');
				}
			});
			
			if (settings.form) {
				$('button, input[type="button"], input[type="submit"], input[type="reset"]').not(settings['form-exclude']).not('[id^="framify"] *').addClass('framify-button');
				$('input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="number"], input[type="file"], input[type="url"], input[type="search"], input[type="color"], input[type="range"], input[type="date"], input[type="datetime"], select, textarea').not(settings['form-exclude']).not(settings['form-exclude']).not('[id^="framify"] *').addClass('framify-text-input');
				$('input[type="radio"]').not(settings['form-exclude']).not(settings['form-exclude']).not('[id^="framify"] *').addClass('framify-radio-input');
				$('.framify-radio-input').each(function(){
					var $origin = $(this);
					if (! $origin.next().hasClass('framify-radio-wireframe')) {
						$origin.after('<canvas class="framify-radio-wireframe"></canvas>');
					}
				});
				$('input[type="checkbox"]').not(settings['form-exclude']).not(settings['form-exclude']).not('[id^="framify"] *').addClass('framify-checkbox-input');
				$('.framify-checkbox-input').each(function(){
					var $origin = $(this);
					if (! $origin.next().hasClass('framify-checkbox-wireframe')) {
						$origin.after('<canvas class="framify-checkbox-wireframe"></canvas>');
					}
				});
			}
			
			$.framify('redraw');
			
			$('img, video, audio').unbind('load').load(function(){
				$.framify('redraw');
			});
			$('video, audio').unbind('loadedmetadata').bind('loadedmetadata',function(){
				$.framify('redraw');
			});
			$('audio').unbind('MozAudioAvailable').bind('MozAudioAvailable',function(){
				$.framify('redraw');
			});
			$('input[type="radio"], input[type="checkbox"]').unbind('change').change(function(){
				$.framify('redraw');
			});
			$(window).load(function(){
				$.framify('redraw');
			});
			
			$(window).unbind('resize', methods.redraw).resize(methods.redraw);
			
			$('body').addClass('framified');
			
			return true;
		},
		
		redraw : function(){
			
			$('#framify-toggle').css({'left':(($('body').width()-42)/2) + 'px'});
			
			$('canvas').each(function(){
				$(this).replaceWith($(this).clone());
			});
					
			$('.framify-columns-background').each(function(){
						
				var $canvas = $(this);
				var $origin = $canvas.parent();
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = $origin.width() + parseInt($origin.css('padding-left'),10) + parseInt($origin.css('padding-right'),10);
				$canvas[0].height = $(window).height();
				
				$canvas.css({'left': offset[0] + 'px'});
				
				var columns = $canvas.attr('data-columns');
				var gutter = $canvas.attr('data-gutter').replace(/px/,'');
								
				if (gutter.match(/rem/)) {
					gutter = gutter.replace(/rem/,'');
					gutter = gutter * parseInt($('body').css('font-size'),10);
				} else if (gutter.match(/em/)) {
					gutter = gutter.replace(/em/,'');
					gutter = gutter * parseInt($origin.css('font-size'),10);
				} else if (gutter.match(/%/)) {
					gutter = gutter.replace(/%/,'');
					gutter = gutter / 100 * $canvas.width();
				}
				
				gutter = parseInt(gutter,10);
												
				var column = $canvas.width() / columns - gutter;
								
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.05)';
				for (var i = 0; i < columns; i ++) {
					var columnOffset = i * (column + gutter);
					ctx.fillRect(columnOffset + (gutter / 2), 0, column, $canvas.height());
				}
			});
			
			$('.framify-video-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = $origin.width();
				$canvas[0].height = $origin.height();
				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.strokeRect(0.5, 0.5, $canvas.width()-1, $canvas.height()-1);
				ctx.moveTo(0, 0);
				ctx.lineTo($canvas.width(), $canvas.height());
				ctx.moveTo(0, $canvas.height());
				ctx.lineTo($canvas.width(), 0);
				ctx.stroke();
				if ($origin.attr('controls') === 'controls'){
					ctx.moveTo(0, $canvas.height()-30.5);
					ctx.lineTo($canvas.width(), $canvas.height()-30.5);
					ctx.stroke();
					ctx.moveTo(9.5, $canvas.height()-25);
					ctx.beginPath();
					ctx.lineTo(9.5, $canvas.height()-5);
					ctx.lineTo(24.5, $canvas.height()-15);
					ctx.lineTo(9.5, $canvas.height()-25);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
					ctx.fillRect(34.5, $canvas.height()-20.5, $canvas.width()-45, 10);
					ctx.strokeRect(34.5, $canvas.height()-20.5, $canvas.width()-45, 10);
				}
				ctx.moveTo($canvas.width()/2-$canvas.width()/15, $canvas.height()/2-$canvas.width()/10);
				ctx.beginPath();
				ctx.lineTo($canvas.width()/2-$canvas.width()/15, $canvas.height()/2+$canvas.width()/10);
				ctx.lineTo($canvas.width()/2+$canvas.width()/10, $canvas.height()/2);
				ctx.lineTo($canvas.width()/2-$canvas.width()/15, $canvas.height()/2-$canvas.width()/10);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = 'rgba(0,0,0,.2)';
				ctx.font = 'bold 24px serif';
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'center';
				ctx.fillText('VIDEO', $canvas.width()/2, $canvas.height()/2);
			});
			
			$('.framify-audio-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = $origin.width();
				$canvas[0].height = 30; //$origin.height();
				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.strokeRect(0.5, 0.5, $canvas.width()-1, $canvas.height()-1);
				ctx.moveTo(9.5, $canvas.height()/2-10);
				ctx.beginPath();
				ctx.lineTo(9.5, $canvas.height()/2+10);
				ctx.lineTo(24.5, $canvas.height()/2);
				ctx.lineTo(9.5, $canvas.height()/2-10);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				ctx.fillRect(34.5, $canvas.height()/2-5.5, $canvas.width()-45, 10);
				ctx.strokeRect(34.5, $canvas.height()/2-5.5, $canvas.width()-45, 10);
				ctx.fillStyle = 'rgba(0,0,0,.2)';
				ctx.font = 'bold 24px serif';
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'center';
				ctx.fillText('AUDIO', $canvas.width()/2, $canvas.height()/2);
			});
			
			$('.framify-image-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = $origin.width();
				$canvas[0].height = $origin.height();
				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.strokeRect(0.5, 0.5, $canvas.width()-1, $canvas.height()-1);
				ctx.moveTo(0, 0);
				ctx.lineTo($canvas.width(), $canvas.height());
				ctx.moveTo(0, $canvas.height());
				ctx.lineTo($canvas.width(), 0);
				ctx.stroke();
				ctx.fillStyle = 'rgba(0,0,0,.3)';
				ctx.font = 'bold 24px serif';
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'center';
				ctx.fillText('IMAGE', $canvas.width()/2, $canvas.height()/2);
			});
			
			$('.framify-canvas-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = $origin.width();
				$canvas[0].height = $origin.height();
				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.strokeRect(0.5, 0.5, $canvas.width()-1, $canvas.height()-1);
				ctx.moveTo(0, 0);
				ctx.lineTo($canvas.width(), $canvas.height());
				ctx.moveTo(0, $canvas.height());
				ctx.lineTo($canvas.width(), 0);
				ctx.stroke();
				ctx.fillStyle = 'rgba(0,0,0,.3)';
				ctx.font = 'bold 24px serif';
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'center';
				ctx.fillText('CANVAS', $canvas.width()/2, $canvas.height()/2);
			});
			
			$('.framify-radio-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				var checked = $origin.is(':checked');
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = 12; //$origin.width() + parseInt($origin.css('padding-left'),10) + parseInt($origin.css('padding-right'),10);
				$canvas[0].height = 12; //$origin.height() + parseInt($origin.css('padding-top'),10) + parseInt($origin.css('padding-bottom'),10);

				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.beginPath();
				ctx.arc($canvas.width()/2, $canvas.width()/2, $canvas.width()/2-0.5, 0, Math.PI*2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				if (checked) {
					ctx.fillStyle = 'rgba(0,0,0,.3)';
					ctx.beginPath();
					ctx.arc($canvas.width()/2, $canvas.width()/2, $canvas.width()/2-3, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.fill();
				}
			});
			
			$('.framify-checkbox-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				var checked = $origin.is(':checked');
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = 12; //$origin.width() + parseInt($origin.css('padding-left'),10) + parseInt($origin.css('padding-right'),10);
				$canvas[0].height = 12; //$origin.height() + parseInt($origin.css('padding-top'),10) + parseInt($origin.css('padding-bottom'),10);
				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.strokeRect(0.5, 0.5, $canvas.width()-1, $canvas.height()-1);
				if (checked) {
					ctx.moveTo(0, 0);
					ctx.lineTo($canvas.width(), $canvas.height());
					ctx.moveTo(0, $canvas.height());
					ctx.lineTo($canvas.width(), 0);
					ctx.stroke();
				}
			});
			
			$('.framify-section-identifier').each(function(){
				var $identifier = $(this);
				var $origin = $identifier.prev();
				
				var offset = getElementOffset($origin[0]);
				
				$identifier.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
			});

			return true;
		}
		
	};
	
	$.fn.framify = function(method){
		
		if (methods[method]) {
		
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			
		} else if (typeof method === 'object' || ! method) {
		
			return methods.init.apply(this, arguments);
			
		} else {
		
			$.error('Method ' +  method + ' does not exist on jQuery.framify');
			
		}
				
		return this;
	
	};
	
})(jQuery);