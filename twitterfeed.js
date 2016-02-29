/*
 *  Project: Twitter Feed
 *  Description: Twiiter Feed 
 *  Author: @a2ad
 *  License: MIT
 */

;(function ( $, window, document, undefined ) {

	// Cria as propriedades padrão
	var pluginName = "twitterfeed",
		defaults = {
			displaylimit: 1,
			twitterprofile: "somosa2ad",			
			showretweets: true,
			showtweetlinks: true,
			showprofilepic: false,
			showbuttons: false,
			showinfos: false,
			showdirecttweets: true
		};

	// O verdadeiro construtor do plugin
	function Plugin( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {

		init: function() {
			
			var displaylimit = this.options.displaylimit;
			var twitterprofile = this.options.twitterprofile;
			var screenname = this.options.screenname;
			var showdirecttweets = this.options.showdirecttweets;
			var showretweets = this.options.showretweets;
			var showtweetlinks = this.options.showtweetlinks;
			var showprofilepic = this.options.showprofilepic;
			var showbuttons = this.options.showbuttons;
			var showinfos = this.options.showinfos;

			var twitterfeedid = this.element.id;

			$.ajaxSetup({ cache: true });	
			$.getJSON('http://lab.a2comunicacao.com.br/twitter-api/tweets.php?user='+twitterprofile+'&limit='+displaylimit, function(feeds) {
					var feedHTML = '';
					var displayCounter = 1;
					for (var i=0; i<feeds.length; i++) {

						var tweetscreenname = feeds[i].user.name;
						var tweetusername = feeds[i].user.screen_name;
						var profileimage = feeds[i].user.profile_image_url_https;
						var text = feeds[i].text;
						var isaretweet = true;
						var isdirect = false;
						var tweetid = feeds[i].id_str;
						var following = feeds[i].user.friends_count;
                	var followers = feeds[i].user.followers_count;
                	var tweets = feeds[i].user.statuses_count;
                	var list = feeds[i].user.listed_count;


						//If the tweet has been retweeted, get the profile pic of the tweeter
						if(typeof feeds[i].retweeted_status != 'undefined'){
							profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
							tweetscreenname = feeds[i].retweeted_status.user.name;
							tweetusername = feeds[i].retweeted_status.user.screen_name;
							tweetid = feeds[i].retweeted_status.id_str
							isaretweet = true;
						};

						//Check to see if the tweet is a direct message
						if (feeds[i].text.substr(0,1) == "@") {
							isdirect = true;
						}

						if (((showretweets == true) || ((isaretweet == false) && (showretweets == false))) && ((showdirecttweets == true) || ((showdirecttweets == false) && (isdirect == false)))) {
							if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {
								if (showtweetlinks == true) {
									text = addlinks(text);
								}
									feedHTML += '<div class="tweet-item">';

								if (showinfos == true && displayCounter == 1){
									feedHTML += '<div class="infos">';
									feedHTML += '<span class="username"><a href="http://twitter.com/'+tweetusername+'">@'+tweetusername+'</a></span><span class="tweets">'+tweets+' tweets</span><span class="following">'+following+' seguindo</span><span class="followers">'+followers+' seguidores</span><span class="list">'+list+' listas</span>';
									feedHTML += '</div>';
								}	

								if (showprofilepic == true) {
									feedHTML += '<div class="image"><img src="'+profileimage+'" ></div>';
								}
									feedHTML += '<div class="text"><p>'+text+'</p></div>';

								if (showbuttons == true) {
									feedHTML += '<span class="buttons"><a class="reply" href="https://twitter.com/intent/tweet?in_reply_to='+tweetid+'">Reply</a>';
									feedHTML +=	'		 <a class="retweet" href="https://twitter.com/intent/retweet?tweet_id='+tweetid+'">Retweet</a>';
									feedHTML += '		 <a class="favorite" href="https://twitter.com/intent/favorite?tweet_id='+tweetid+'">Favorite</a></span>';
								}			
									feedHTML += '</div>';					
								displayCounter++;
							}
						}
					}

					$('#'+twitterfeedid).html(feedHTML);
				});


			//Function modified from Stack Overflow
			function addlinks(data) {
				//Add link to all http:// links within tweets
				data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
					return '<a href="'+url+'" >'+url+'</a>';
				});

				//Add link to @usernames used within tweets
				data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
					return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" >'+reply.charAt(0)+reply.substring(1)+'</a>';
				});
				return data;
			}

			function relative_time(time_value) {
				var values = time_value.split(" ");
				time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
				var parsed_date = Date.parse(time_value);
				var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
				var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
				var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
				delta = delta + (relative_to.getTimezoneOffset() * 60);

				if (delta < 60) {
					return '1m';
				} else if(delta < 120) {
					return '1m';
				} else if(delta < (60*60)) {
					return (parseInt(delta / 60)).toString() + 'm';
				} else if(delta < (120*60)) {
					return '1h';
				} else if(delta < (24*60*60)) {
					return (parseInt(delta / 3600)).toString() + 'h';
				} else if(delta < (48*60*60)) {
				//return '1 day';
				return shortdate;
				} else {
					return shortdate;
				}
			}



		},

		yourOtherFunction: function(el, options) {
		}
	};

	// Um invólucro realmente leve em torno do construtor,
	// prevenindo contra criação de múltiplas instâncias
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin( this, options ));
			}
		});
	};

})( jQuery, window, document );