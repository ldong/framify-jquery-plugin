/*
 * framify 0.6.0
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

;

(function($){
	
	$.framify = function(method){
		$(document).framify(method);
	};

	var colors = [ 'grey', 'blue', 'green', 'yellow', 'orange', 'red', 'purple' ];
	
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
				
				var validClass = /^[\w-]+$/;
				var validNumber = /^(0|[1-9][0-9]?)$/;
				var numberTooLarge = 100;
				var validUnit = /^(0|[1-9][0-9]?)(\.[0-9]+)?(px|em|rem|%)$/
				
				if (typeof(options.toggle) != 'undefined') {
					options.toggle = options.toggle ? 1 : 0;
				}
				
				if (typeof(options['toggle-class']) != 'undefined') {
					if (! options['toggle-class'].match(validClass)) {
						options['toggle-class'] = defaultOptions['toggleClass'];
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
					if (! options.columns.match(validNumber) || parseInt(options.columns) >= numberTooLarge) {
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
				$('head').append('<link rel="stylesheet" href="data:text/css;charset=utf-8;base64,LyogQmFzZSBTdHlsZXMNCiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovDQouZnJhbWlmeS1jb2x1bW5zLWJhY2tncm91bmQsDQouZnJhbWlmeS1pbWFnZS13aXJlZnJhbWUsDQouZnJhbWlmeS12aWRlby13aXJlZnJhbWUsDQouZnJhbWlmeS1hdWRpby13aXJlZnJhbWUsDQouZnJhbWlmeS1jYW52YXMtd2lyZWZyYW1lLA0KLmZyYW1pZnktcmFkaW8td2lyZWZyYW1lLA0KLmZyYW1pZnktY2hlY2tib3gtd2lyZWZyYW1lLA0KLmZyYW1pZnktc2VjdGlvbi1pZGVudGlmaWVyIHsNCiAgZGlzcGxheTogbm9uZTsgfQ0KDQouZnJhbWlmeS11aSwgI2ZyYW1pZnktdG9nZ2xlLCAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24taWRlbnRpZmllciB7DQogIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7DQogIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTsNCiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsNCiAgLW1zLXVzZXItc2VsZWN0OiBub25lOw0KICAtby11c2VyLXNlbGVjdDogbm9uZTsNCiAgdXNlci1zZWxlY3Q6IG5vbmU7DQogIHRvcDogLTFweDsNCiAgZGlzcGxheTogYmxvY2s7DQogIGJvcmRlci1vZmZzZXQ6IC0xcHg7DQogIG92ZXJmbG93OiBoaWRkZW47DQogIHRleHQtYWxpZ246IGNlbnRlcjsNCiAgei1pbmRleDogMTAwMDsNCiAgZm9udC1zaXplOiAxNnB4Ow0KICBib3gtc2hhZG93OiAwIDAgMnB4ICMwMDA7DQogIGJhY2tncm91bmQtaW1hZ2U6IHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFRQUFBQUVDQVlBQUFDcDhaNStBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlScFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRTFoWTJsdWRHOXphQ0lnZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80TXpnME4wVTJPVE0yTkRReE1VVXhRalpDTlRoRFFUTkZSVGM1TVRJMk1pSWdlRzF3VFUwNlJHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzRNemcwTjBVMlFUTTJORFF4TVVVeFFqWkNOVGhEUVRORlJUYzVNVEkyTWlJK0lEeDRiWEJOVFRwRVpYSnBkbVZrUm5KdmJTQnpkRkpsWmpwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZ3pPRFEzUlRZM016WTBOREV4UlRGQ05rSTFPRU5CTTBWRk56a3hNall5SWlCemRGSmxaanBrYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2pnek9EUTNSVFk0TXpZME5ERXhSVEZDTmtJMU9FTkJNMFZGTnpreE1qWXlJaTgrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrVnQyRFd3QUFBQ0pKUkVGVWVOcGlZR0JnYUFCaWh2Ly8vNE9vQmtZR0JHaGdRT00wWU9VQUJCZ0FIbGdHZnk4MFVNY0FBQUFBU1VWT1JLNUNZSUk9KTsNCiAgYmFja2dyb3VuZC1yZXBlYXQ6IHJlcGVhdDsNCiAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTVlNTsNCiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOw0KICBib3JkZXI6IDFweCBzb2xpZCAjNGQ0ZDRkOw0KICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuNyk7DQogIGNvbG9yOiAjNGQ0ZDRkOw0KICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpOw0KICBjdXJzb3I6IHBvaW50ZXI7DQogIGN1cnNvcjogaGFuZDsgfQ0KDQojZnJhbWlmeS10b2dnbGUgew0KICB3aWR0aDogNDBweDsNCiAgaGVpZ2h0OiA0MHB4Ow0KICBwb3NpdGlvbjogZml4ZWQ7DQogIC13ZWJraXQtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDIwcHg7DQogIC1raHRtbC1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMjBweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbXJpZ2h0OiAyMHB4Ow0KICAtbXMtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDIwcHg7DQogIC1vLWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAyMHB4Ow0KICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMjBweDsNCiAgLXdlYmtpdC1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICAta2h0bWwtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMjBweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbWxlZnQ6IDIwcHg7DQogIC1tcy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICAtby1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICBsaW5lLWhlaWdodDogNDJweDsgfQ0KICAjZnJhbWlmeS10b2dnbGUgc3BhbiB7DQogICAgd2lkdGg6IDMwcHg7DQogICAgaGVpZ2h0OiAzMHB4Ow0KICAgIGxpbmUtaGVpZ2h0OiAzMnB4Ow0KICAgIGRpc3BsYXk6IGJsb2NrOw0KICAgIG1hcmdpbjogNXB4Ow0KICAgIGNvbG9yOiAjYjNiM2IzOw0KICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNyk7DQogICAgYmFja2dyb3VuZC1jb2xvcjogIzRkNGQ0ZDsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNyk7DQogICAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgIC1raHRtbC1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgIC1tb3otYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAtbXMtYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAtby1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7IH0NCiAgI2ZyYW1pZnktdG9nZ2xlOmhvdmVyIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzMzMzOw0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTsNCiAgICBib3JkZXI6IDFweCBzb2xpZCAjMWExYTFhOw0KICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC45KTsNCiAgICBjb2xvcjogIzFhMWExYTsNCiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpOyB9DQogICAgI2ZyYW1pZnktdG9nZ2xlOmhvdmVyIHNwYW4gew0KICAgICAgY29sb3I6ICNlNWU1ZTU7DQogICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpOw0KICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzFhMWExYTsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTsgfQ0KDQouZnJhbWlmaWVkIHsNCiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsNCiAgY29sb3I6ICNiM2IzYjM7DQogIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMyk7IH0NCiAgLmZyYW1pZmllZCBhIHsNCiAgICBjb2xvcjogIzRkNGQ0ZDsNCiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpOyB9DQogICAgLmZyYW1pZmllZCBhOmxpbmssIC5mcmFtaWZpZWQgYTp2aXNpdGVkIHsNCiAgICAgIGNvbG9yOiAjNGQ0ZDRkOw0KICAgICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsgfQ0KICAgIC5mcmFtaWZpZWQgYTpob3ZlciwgLmZyYW1pZmllZCBhOmFjdGl2ZSB7DQogICAgICBjb2xvcjogIzFhMWExYTsNCiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWlkZW50aWZpZXIgew0KICAgIHdpZHRoOiAzMHB4Ow0KICAgIGhlaWdodDogMzBweDsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgdG9wOiAtMXB4Ow0KICAgIGxlZnQ6IC0xcHg7DQogICAgLXdlYmtpdC1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAta2h0bWwtYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogICAgLW1vei1ib3JkZXItcmFkaXVzLXRvcHJpZ2h0OiAxNXB4Ow0KICAgIC1tcy1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAtby1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAtd2Via2l0LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAgIC1raHRtbC1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgICAtbW96LWJvcmRlci1yYWRpdXMtYm90dG9tcmlnaHQ6IDE1cHg7DQogICAgLW1zLWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAgIC1vLWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAgIC13ZWJraXQtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMTVweDsNCiAgICAta2h0bWwtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMTVweDsNCiAgICAtbW96LWJvcmRlci1yYWRpdXMtYm90dG9tbGVmdDogMTVweDsNCiAgICAtbXMtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMTVweDsNCiAgICAtby1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxNXB4Ow0KICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDE1cHg7DQogICAgbGluZS1oZWlnaHQ6IDMycHg7IH0NCiAgICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24taWRlbnRpZmllciBzcGFuIHsNCiAgICAgIHdpZHRoOiAyMHB4Ow0KICAgICAgaGVpZ2h0OiAyMHB4Ow0KICAgICAgbGluZS1oZWlnaHQ6IDIycHg7DQogICAgICBkaXNwbGF5OiBibG9jazsNCiAgICAgIG1hcmdpbjogNXB4Ow0KICAgICAgY29sb3I6ICNiM2IzYjM7DQogICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpOw0KICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzRkNGQ0ZDsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsNCiAgICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMjBweDsNCiAgICAgIC1raHRtbC1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgICAgLW1vei1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgICAgLW1zLWJvcmRlci1yYWRpdXM6IDIwcHg7DQogICAgICAtby1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAgICAgYm9yZGVyLXJhZGl1czogMjBweDsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWNvbHVtbnMtYmFja2dyb3VuZCB7DQogICAgZGlzcGxheTogYmxvY2s7DQogICAgcG9zaXRpb246IGZpeGVkOw0KICAgIHRvcDogMDsNCiAgICB6LWluZGV4OiAtMTsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWltYWdlLA0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXZpZGVvLA0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWF1ZGlvLA0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWNhbnZhcywNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1yYWRpby1pbnB1dCwNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1jaGVja2JveC1pbnB1dCB7DQogICAgdmlzaWJpbGl0eTogaGlkZGVuOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktaW1hZ2Utd2lyZWZyYW1lLA0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXZpZGVvLXdpcmVmcmFtZSwNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1hdWRpby13aXJlZnJhbWUsDQogIC5mcmFtaWZpZWQgLmZyYW1pZnktY2FudmFzLXdpcmVmcmFtZSwNCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1yYWRpby13aXJlZnJhbWUsDQogIC5mcmFtaWZpZWQgLmZyYW1pZnktY2hlY2tib3gtd2lyZWZyYW1lIHsNCiAgICBkaXNwbGF5OiBibG9jazsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgei1pbmRleDogMTAwMDsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24gew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNlNWU1ZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOw0KICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7DQogICAgb3V0bGluZS1vZmZzZXQ6IC0xcHg7DQogICAgb3V0bGluZTogMXB4IHNvbGlkICNiM2IzYjM7DQogICAgb3V0bGluZTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4zKTsgfQ0KICAgIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbiAuZnJhbWlmeS1zZWN0aW9uIHsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlNWU1ZTU7DQogICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWdyZXkgew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNlNWU1ZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1yZWQgew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmU1ZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuMSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLW9yYW5nZSB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjNlNTsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMTQwLCAwLCAwLjEpOyB9DQogIC5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi15ZWxsb3cgew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMCwgMC4xKTsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24tZ3JlZW4gew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNlNWZmZTU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAyNTUsIDAsIDAuMSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWJsdWUgew0KICAgIGJhY2tncm91bmQtY29sb3I6ICNlNWU1ZmY7DQogICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAyNTUsIDAuMSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLXB1cnBsZSB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZThmZDsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE2MCwgMzIsIDI0MCwgMC4xKTsgfQ0KICAuZnJhbWlmaWVkIC5mcmFtaWZ5LWJ1dHRvbiB7DQogICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lOw0KICAgIC1raHRtbC1hcHBlYXJhbmNlOiBub25lOw0KICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZTsNCiAgICAtbXMtYXBwZWFyYW5jZTogbm9uZTsNCiAgICAtby1hcHBlYXJhbmNlOiBub25lOw0KICAgIGFwcGVhcmFuY2U6IG5vbmU7DQogICAgYmFja2dyb3VuZC1jb2xvcjogI2U1ZTVlNTsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7DQogICAgY29sb3I6ICM0ZDRkNGQ7DQogICAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsNCiAgICBib3JkZXItb2Zmc2V0OiAtMXB4Ow0KICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNXB4Ow0KICAgIC1raHRtbC1ib3JkZXItcmFkaXVzOiA1cHg7DQogICAgLW1vei1ib3JkZXItcmFkaXVzOiA1cHg7DQogICAgLW1zLWJvcmRlci1yYWRpdXM6IDVweDsNCiAgICAtby1ib3JkZXItcmFkaXVzOiA1cHg7DQogICAgYm9yZGVyLXJhZGl1czogNXB4Ow0KICAgIGJvcmRlcjogMXB4IHNvbGlkICM0ZDRkNGQ7DQogICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjcpOyB9DQogICAgLmZyYW1pZmllZCAuZnJhbWlmeS1idXR0b246aG92ZXIgew0KICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lOw0KICAgICAgLWtodG1sLWFwcGVhcmFuY2U6IG5vbmU7DQogICAgICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7DQogICAgICAtbXMtYXBwZWFyYW5jZTogbm9uZTsNCiAgICAgIC1vLWFwcGVhcmFuY2U6IG5vbmU7DQogICAgICBhcHBlYXJhbmNlOiBub25lOw0KICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2NjY2NjYzsNCiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTsNCiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICMxYTFhMWE7DQogICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuOSk7DQogICAgICBjb2xvcjogIzFhMWExYTsNCiAgICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOSk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS10ZXh0LWlucHV0IHsNCiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7DQogICAgLWtodG1sLWFwcGVhcmFuY2U6IG5vbmU7DQogICAgLW1vei1hcHBlYXJhbmNlOiBub25lOw0KICAgIC1tcy1hcHBlYXJhbmNlOiBub25lOw0KICAgIC1vLWFwcGVhcmFuY2U6IG5vbmU7DQogICAgYXBwZWFyYW5jZTogbm9uZTsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsNCiAgICBib3JkZXItb2Zmc2V0OiAtMXB4Ow0KICAgIGJvcmRlcjogMXB4IHNvbGlkICNiM2IzYjM7DQogICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjMpOw0KICAgIGNvbG9yOiAjYjNiM2IzOw0KICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMyk7IH0NCiAgLmZyYW1pZmllZCAuZnJhbWlmeS10YWJsZSB7DQogICAgcGFkZGluZzogMDsNCiAgICBtYXJnaW46IDA7DQogICAgYm9yZGVyOiAxcHggc29saWQgI2IzYjNiMzsNCiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMyk7DQogICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsgfQ0KICAgIC5mcmFtaWZpZWQgLmZyYW1pZnktdGFibGUgdHIgew0KICAgICAgYm9yZGVyOiAxcHggc29saWQgI2IzYjNiMzsNCiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4zKTsgfQ0KICAgICAgLmZyYW1pZmllZCAuZnJhbWlmeS10YWJsZSB0ciB0aCB7DQogICAgICAgIHBhZGRpbmc6IDAgMTBweDsNCiAgICAgICAgbWFyZ2luOiAwOw0KICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7DQogICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNiM2IzYjM7DQogICAgICAgIGJvcmRlcjogMXB4IGRvdHRlZCByZ2JhKDAsIDAsIDAsIDAuMyk7DQogICAgICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7DQogICAgICAgIHRleHQtYWxpZ246IGxlZnQ7IH0NCiAgICAgIC5mcmFtaWZpZWQgLmZyYW1pZnktdGFibGUgdHIgdGQgew0KICAgICAgICBwYWRkaW5nOiAwIDEwcHg7DQogICAgICAgIG1hcmdpbjogMDsNCiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2IzYjNiMzsNCiAgICAgICAgYm9yZGVyOiAxcHggZG90dGVkIHJnYmEoMCwgMCwgMCwgMC4zKTsNCiAgICAgICAgZm9udC13ZWlnaHQ6IG5vcm1hbDsNCiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDsgfQ0K" />');
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
					var offset = i * (column + gutter);
					ctx.fillRect(offset + (gutter / 2), 0, column, $canvas.height());
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
				if ($origin.attr('controls') == 'controls'){
					ctx.moveTo(0, $canvas.height()-30.5);
					ctx.lineTo($canvas.width(), $canvas.height()-30.5);
					ctx.stroke();
					ctx.moveTo(9.5, $canvas.height()-25);
					ctx.beginPath()
					ctx.lineTo(9.5, $canvas.height()-5);
					ctx.lineTo(24.5, $canvas.height()-15);
					ctx.lineTo(9.5, $canvas.height()-25);
					ctx.closePath()
					ctx.fill();
					ctx.stroke();
					ctx.fillRect(34.5, $canvas.height()-20.5, $canvas.width()-45, 10);
					ctx.strokeRect(34.5, $canvas.height()-20.5, $canvas.width()-45, 10);
				}
				ctx.moveTo($canvas.width()/2-$canvas.width()/15, $canvas.height()/2-$canvas.width()/10);
				ctx.beginPath()
				ctx.lineTo($canvas.width()/2-$canvas.width()/15, $canvas.height()/2+$canvas.width()/10);
				ctx.lineTo($canvas.width()/2+$canvas.width()/10, $canvas.height()/2);
				ctx.lineTo($canvas.width()/2-$canvas.width()/15, $canvas.height()/2-$canvas.width()/10);
				ctx.closePath()
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
				ctx.beginPath()
				ctx.lineTo(9.5, $canvas.height()/2+10);
				ctx.lineTo(24.5, $canvas.height()/2);
				ctx.lineTo(9.5, $canvas.height()/2-10);
				ctx.closePath()
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
	
	var getElementOffset = function(element) {
		
		var obj = element;
		
		var offsetLeft = obj.offsetLeft;
		var offsetTop = obj.offsetTop;
		
		if (obj.tagName.toLowerCase() === 'img') {
			offsetLeft += parseInt($(obj).css('padding-left'),10);
			offsetTop += parseInt($(obj).css('padding-top'),10);
		}
		
		if (obj.offsetParent) {
			while (obj = obj.offsetParent) {
				if (obj.tagName.toLowerCase() === 'body'
				 || $(obj).css('position').toLowerCase() === 'absolute' 
				 || $(obj).css('position').toLowerCase() === 'relative') {
					break;
				} else {
					offsetLeft += obj.offsetLeft;
					offsetTop += obj.offsetTop;
				}
			}
		}
		
		return [offsetLeft, offsetTop];
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