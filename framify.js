/*
 * framify 0.0.0
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
		
			var settings = $.extend( {
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
			}, options);
			
			if (! $('#framify-styles').length) {
				//base 64 styles to prevent need for linking to an external stylesheet
				$('head').append('<link rel="stylesheet" href="data:text/css;charset=utf-8;base64,LyogQmFzZSBTdHlsZXMNCiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovDQouZnJhbWlmaWVkIHsNCiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgfQ0KDQojZnJhbWlmeS10b2dnbGUsDQouZnJhbWlmaWVkIC5mcmFtaWZ5LXNlY3Rpb24taWRlbnRpZmllciB7DQogIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7DQogIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTsNCiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsNCiAgLW1zLXVzZXItc2VsZWN0OiBub25lOw0KICAtby11c2VyLXNlbGVjdDogbm9uZTsNCiAgdXNlci1zZWxlY3Q6IG5vbmU7DQogIHRvcDogLTFweDsNCiAgZGlzcGxheTogYmxvY2s7DQogIGJvcmRlci1vZmZzZXQ6IC0xcHg7DQogIG92ZXJmbG93OiBoaWRkZW47DQogIHRleHQtYWxpZ246IGNlbnRlcjsNCiAgei1pbmRleDogMTAwMDsNCiAgZm9udC1zaXplOiAxNnB4Ow0KICBib3gtc2hhZG93OiAwIDAgMnB4ICMwMDA7DQogIGJhY2tncm91bmQ6IHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFRQUFBQUVDQVlBQUFDcDhaNStBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlScFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRTFoWTJsdWRHOXphQ0lnZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80TXpnME4wVTJPVE0yTkRReE1VVXhRalpDTlRoRFFUTkZSVGM1TVRJMk1pSWdlRzF3VFUwNlJHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzRNemcwTjBVMlFUTTJORFF4TVVVeFFqWkNOVGhEUVRORlJUYzVNVEkyTWlJK0lEeDRiWEJOVFRwRVpYSnBkbVZrUm5KdmJTQnpkRkpsWmpwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZ3pPRFEzUlRZM016WTBOREV4UlRGQ05rSTFPRU5CTTBWRk56a3hNall5SWlCemRGSmxaanBrYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2pnek9EUTNSVFk0TXpZME5ERXhSVEZDTmtJMU9FTkJNMFZGTnpreE1qWXlJaTgrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrVnQyRFd3QUFBQ0pKUkVGVWVOcGlZR0JnYUFCaWh2Ly8vNE9vQmtZR0JHaGdRT00wWU9VQUJCZ0FIbGdHZnk4MFVNY0FBQUFBU1VWT1JLNUNZSUk9KSByZXBlYXQgcmdiYSgwLCAwLCAwLCAwLjEpOw0KICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuNyk7DQogIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNyk7DQogIGN1cnNvcjogcG9pbnRlcjsNCiAgY3Vyc29yOiBoYW5kOyB9DQoNCiNmcmFtaWZ5LXRvZ2dsZSB7DQogIGxpbmUtaGVpZ2h0OiA0MnB4Ow0KICB3aWR0aDogNDBweDsNCiAgaGVpZ2h0OiA0MHB4Ow0KICBwb3NpdGlvbjogZml4ZWQ7DQogIC13ZWJraXQtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDIwcHg7DQogIC1raHRtbC1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMjBweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbXJpZ2h0OiAyMHB4Ow0KICAtbXMtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDIwcHg7DQogIC1vLWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAyMHB4Ow0KICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMjBweDsNCiAgLXdlYmtpdC1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICAta2h0bWwtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMjBweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbWxlZnQ6IDIwcHg7DQogIC1tcy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICAtby1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4Ow0KICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4OyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1pZGVudGlmaWVyIHsNCiAgbGluZS1oZWlnaHQ6IDMycHg7DQogIHdpZHRoOiAzMHB4Ow0KICBoZWlnaHQ6IDMwcHg7DQogIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgdG9wOiAtMXB4Ow0KICBsZWZ0OiAtMXB4Ow0KICAtd2Via2l0LWJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAta2h0bWwtYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogIC1tb3otYm9yZGVyLXJhZGl1cy10b3ByaWdodDogMTVweDsNCiAgLW1zLWJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICAtby1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDE1cHg7DQogIC13ZWJraXQtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDE1cHg7DQogIC1raHRtbC1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbXJpZ2h0OiAxNXB4Ow0KICAtbXMtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDE1cHg7DQogIC1vLWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxNXB4Ow0KICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTVweDsNCiAgLXdlYmtpdC1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxNXB4Ow0KICAta2h0bWwtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMTVweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzLWJvdHRvbWxlZnQ6IDE1cHg7DQogIC1tcy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxNXB4Ow0KICAtby1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxNXB4Ow0KICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxNXB4OyB9DQoNCiNmcmFtaWZ5LXRvZ2dsZSBzcGFuLA0KLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWlkZW50aWZpZXIgc3BhbiB7DQogIGRpc3BsYXk6IGJsb2NrOw0KICBtYXJnaW46IDVweDsNCiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KTsNCiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjcpOw0KICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDIwcHg7DQogIC1raHRtbC1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAtbW96LWJvcmRlci1yYWRpdXM6IDIwcHg7DQogIC1tcy1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICAtby1ib3JkZXItcmFkaXVzOiAyMHB4Ow0KICBib3JkZXItcmFkaXVzOiAyMHB4OyB9DQoNCiNmcmFtaWZ5LXRvZ2dsZSBzcGFuIHsNCiAgd2lkdGg6IDMwcHg7DQogIGhlaWdodDogMzBweDsNCiAgbGluZS1oZWlnaHQ6IDMycHg7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWlkZW50aWZpZXIgc3BhbiB7DQogIHdpZHRoOiAyMHB4Ow0KICBoZWlnaHQ6IDIwcHg7DQogIGxpbmUtaGVpZ2h0OiAyMnB4OyB9DQoNCiNmcmFtaWZ5LXRvZ2dsZTpob3ZlciB7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTsNCiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjkpOw0KICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpOyB9DQoNCiNmcmFtaWZ5LXRvZ2dsZTpob3ZlciBzcGFuLA0KLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWlkZW50aWZpZXI6aG92ZXIgc3BhbiB7DQogIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOSk7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTsgfQ0KDQouZnJhbWlmaWVkIHsNCiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zKTsNCiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgfQ0KDQouZnJhbWlmaWVkIGEsDQouZnJhbWlmaWVkIGE6bGluaywNCi5mcmFtaWZpZWQgYTp2aXNpdGVkIHsNCiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsgfQ0KDQouZnJhbWlmaWVkIGE6aG92ZXIsDQouZnJhbWlmaWVkIGE6YWN0aXZlIHsNCiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTsgfQ0KDQouZnJhbWlmeS1jb2x1bW5zLWJhY2tncm91bmQgew0KICBkaXNwbGF5OiBub25lOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktY29sdW1ucy1iYWNrZ3JvdW5kIHsNCiAgZGlzcGxheTogYmxvY2s7DQogIHBvc2l0aW9uOiBmaXhlZDsNCiAgdG9wOiAwOw0KICB6LWluZGV4OiAtMTsgfQ0KDQouZnJhbWlmaWVkIC5mcmFtaWZ5LWltYWdlLA0KLmZyYW1pZmllZCAuZnJhbWlmeS12aWRlbywNCi5mcmFtaWZpZWQgLmZyYW1pZnktYXVkaW8sDQouZnJhbWlmaWVkIC5mcmFtaWZ5LWNhbnZhcywNCi5mcmFtaWZpZWQgLmZyYW1pZnktcmFkaW8taW5wdXQsDQouZnJhbWlmaWVkIC5mcmFtaWZ5LWNoZWNrYm94LWlucHV0IHsNCiAgdmlzaWJpbGl0eTogaGlkZGVuOyB9DQoNCi5mcmFtaWZ5LWltYWdlLXdpcmVmcmFtZSwNCi5mcmFtaWZ5LXZpZGVvLXdpcmVmcmFtZSwNCi5mcmFtaWZ5LWF1ZGlvLXdpcmVmcmFtZSwNCi5mcmFtaWZ5LWNhbnZhcy13aXJlZnJhbWUsDQouZnJhbWlmeS1yYWRpby13aXJlZnJhbWUsDQouZnJhbWlmeS1jaGVja2JveC13aXJlZnJhbWUgew0KICBkaXNwbGF5OiBub25lOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktaW1hZ2Utd2lyZWZyYW1lLA0KLmZyYW1pZmllZCAuZnJhbWlmeS12aWRlby13aXJlZnJhbWUsDQouZnJhbWlmaWVkIC5mcmFtaWZ5LWF1ZGlvLXdpcmVmcmFtZSwNCi5mcmFtaWZpZWQgLmZyYW1pZnktY2FudmFzLXdpcmVmcmFtZSwNCi5mcmFtaWZpZWQgLmZyYW1pZnktcmFkaW8td2lyZWZyYW1lLA0KLmZyYW1pZmllZCAuZnJhbWlmeS1jaGVja2JveC13aXJlZnJhbWUgew0KICBkaXNwbGF5OiBibG9jazsNCiAgcG9zaXRpb246IGFic29sdXRlOw0KICB6LWluZGV4OiAxMDAwOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbiB7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsNCiAgb3V0bGluZS1vZmZzZXQ6IC0xcHg7DQogIG91dGxpbmU6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMyk7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLWdyZXkgew0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLXJlZCB7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjEpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1vcmFuZ2Ugew0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMTQwLCAwLCAwLjEpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi15ZWxsb3cgew0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAwLCAwLjEpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1ncmVlbiB7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMjU1LCAwLCAwLjEpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbi1ibHVlIHsNCiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAyNTUsIDAuMSk7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS1zZWN0aW9uLXB1cnBsZSB7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTYwLCAzMiwgMjQwLCAwLjEpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktc2VjdGlvbiAuZnJhbWlmeS1zZWN0aW9uIHsNCiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpOyB9DQoNCi5mcmFtaWZ5LXNlY3Rpb24taWRlbnRpZmllciB7DQogIGRpc3BsYXk6IG5vbmU7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS1idXR0b24gew0KICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7DQogIC1raHRtbC1hcHBlYXJhbmNlOiBub25lOw0KICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7DQogIC1tcy1hcHBlYXJhbmNlOiBub25lOw0KICAtby1hcHBlYXJhbmNlOiBub25lOw0KICBhcHBlYXJhbmNlOiBub25lOw0KICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDVweDsNCiAgLWtodG1sLWJvcmRlci1yYWRpdXM6IDVweDsNCiAgLW1vei1ib3JkZXItcmFkaXVzOiA1cHg7DQogIC1tcy1ib3JkZXItcmFkaXVzOiA1cHg7DQogIC1vLWJvcmRlci1yYWRpdXM6IDVweDsNCiAgYm9yZGVyLXJhZGl1czogNXB4Ow0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7DQogIGJvcmRlci1vZmZzZXQ6IC0xcHg7DQogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC43KTsNCiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC43KTsgfQ0KDQouZnJhbWlmaWVkIC5mcmFtaWZ5LWJ1dHRvbjpob3ZlciB7DQogIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTsNCiAgLWtodG1sLWFwcGVhcmFuY2U6IG5vbmU7DQogIC1tb3otYXBwZWFyYW5jZTogbm9uZTsNCiAgLW1zLWFwcGVhcmFuY2U6IG5vbmU7DQogIC1vLWFwcGVhcmFuY2U6IG5vbmU7DQogIGFwcGVhcmFuY2U6IG5vbmU7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4yKTsNCiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjkpOw0KICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjkpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktdGV4dC1pbnB1dCB7DQogIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTsNCiAgLWtodG1sLWFwcGVhcmFuY2U6IG5vbmU7DQogIC1tb3otYXBwZWFyYW5jZTogbm9uZTsNCiAgLW1zLWFwcGVhcmFuY2U6IG5vbmU7DQogIC1vLWFwcGVhcmFuY2U6IG5vbmU7DQogIGFwcGVhcmFuY2U6IG5vbmU7DQogIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTsNCiAgYm9yZGVyLW9mZnNldDogLTFweDsNCiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjMpOw0KICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjMpOyB9DQoNCi5mcmFtaWZpZWQgLmZyYW1pZnktdGV4dCB7DQogIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOw0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS10YWJsZSB7DQogIHBhZGRpbmc6IDA7DQogIG1hcmdpbjogMDsNCiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjMpOw0KICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlOw0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS10YWJsZSB0ciB7DQogIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4zKTsgfQ0KDQouZnJhbWlmaWVkIC5mcmFtaWZ5LXRhYmxlIHRkIHsNCiAgcGFkZGluZzogMCAxMHB4Ow0KICBtYXJnaW46IDA7DQogIGZvbnQtd2VpZ2h0OiBub3JtYWw7DQogIHRleHQtYWxpZ246IGxlZnQ7DQogIGJvcmRlcjogMXB4IGRvdHRlZCByZ2JhKDAsIDAsIDAsIDAuMyk7IH0NCg0KLmZyYW1pZmllZCAuZnJhbWlmeS10YWJsZSB0aCB7DQogIGZvbnQtd2VpZ2h0OiBub3JtYWw7DQogIHRleHQtYWxpZ246IGxlZnQ7DQogIHBhZGRpbmc6IDAgMTBweDsNCiAgbWFyZ2luOiAwOw0KICBib3JkZXI6IDFweCBkb3R0ZWQgcmdiYSgwLCAwLCAwLCAwLjMpOw0KICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7IH0NCg%3D%3D" />');
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
				$('audio').not(settings['audio-exclude']).addClass('framify-audio');
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
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = 12; //$origin.width() + parseInt($origin.css('padding-left'),10) + parseInt($origin.css('padding-right'),10);
				$canvas[0].height = 12; //$origin.height() + parseInt($origin.css('padding-top'),10) + parseInt($origin.css('padding-bottom'),10);

				$canvas.css({'left': offset[0] + 'px', 'top': offset[1] + 'px'});
				
				var ctx = $canvas[0].getContext("2d");
				ctx.fillStyle = 'rgba(0,0,0,.1)';
				ctx.strokeStyle = 'rgba(0,0,0,.3)';
				ctx.beginPath();
				ctx.arc($canvas.width()/2, $canvas.width()/2, $canvas.width()/2-1, 0, Math.PI*2, true); 
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			});
			
			$('.framify-checkbox-wireframe').each(function(){
				var $canvas = $(this);
				var $origin = $canvas.prev();
				
				var offset = getElementOffset($origin[0]);
				
				$canvas[0].width = 12; //$origin.width() + parseInt($origin.css('padding-left'),10) + parseInt($origin.css('padding-right'),10);
				$canvas[0].height = 12; //$origin.height() + parseInt($origin.css('padding-top'),10) + parseInt($origin.css('padding-bottom'),10);
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