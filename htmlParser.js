var cheerio = require("cheerio");
var $ = null;

var htmlParser = function () {
	 this._markdown = "";
	
}
htmlParser.prototype = {
	handle:function(html){
		$ = cheerio.load(html);
		var self = this;
		this.els = $.root().children();

		this.els.each(function(idx, el){
			switch(el.name){
				 case 'p':
				  self.handle_p(el);
				 	break;
				 case 'hr':
				  self.handle_hr(el);
				  break;
				 case 'h1':
				  self.handle_h1(el);
				  break;
				 case 'h2':
				  self.handle_h2(el);
				  break;
				 case 'h3':
				  self.handle_h3(el);
				  break;
				 case 'h4':
				  self.handle_h4(el);
				  break;
				 case 'h5':
				  self.handle_h5(el);
				  break;
				 case 'h6':
				  self.handle_h6(el);
				  break;
				 case 'pre':
				  self.handle_pre(el);
				  break;
				 case 'strong':
				  self.handle_strong(el);
				  break;
				 case 'b':
				  self.handle_strong(el);
				  break;
				 case 'em':
				  self.handle_em(el);
				  break;
				 case 'i':
				  self.handle_em(el);
				  break;
				 case 'ul':
				  self.handle_ul(el);
				  break;
				 case 'ol':
				  self.handle_ol(el);
				  break;
				 case 'blockquote':
				  self.handle_blockquote(el);
				  break;
				 case 'a':
				  self.handle_a(el);
				  break;
			}
		});
		return this._markdown;
	},
	handle_a:function( el, isinner ){
		var title = $(el).attr("title") == "" ? "" : '"'+ $(el).attr("title") +'"';
		var output = '['+ $(el).text() +']('+ $(el).attr("href") +' '+ title +')';
		if(!isinner){
			this.concat( output );
		} else{
			return output;
		}
	},
	handle_p:function( el ){
		this.concat( $(el).text() +"  \n" );
	},
	handle_hr: function(){
		this.concat(" * * *");
	},
	handle_h1: function(el){
		this.concat( "#" + $(el).text().trim("\n") );
	},
	handle_h2: function(el){
		this.concat( "##" + $(el).text().trim("\n") );
	},
	handle_h3: function(el){
		this.concat( "###" + $(el).text().trim("\n") );
	},
	handle_h4: function(el){
		this.concat( "####" + $(el).text().trim("\n") );
	},
	handle_h5: function(el){
		this.concat( "#####" + $(el).text().trim("\n"));
	},
	handle_h6: function(el){
		this.concat( "######" + $(el).text().trim("\n") );
	},
	handle_pre: function(el){
		var contents = $(el).text().split("\n");
		var self = this;
		self.concat("\n");
		contents.forEach(function(line){
			 self.concat("	" + line );
		});
	},
	handle_strong: function(el){
		this.concat("** " + $(el).text() +" **");
	},
	handle_em: function(el){
		this.concat("* " + $(el).text() +" *");
	},
	handle_ol: function(el){
		var lis = $(el).find("li");
		var self = this;
		lis.each(function(ele, idx){
			self.concat((idx+1)+". " + $(ele).text());
		});
	},
	handle_ul: function(el){
		var lis = $(el).find("li");
		var self = this;
		lis.each(function(ele, idx){
			self.concat("* " + $(ele).text());
		});
	},
	handle_blockquote: function(el){
		var contents = $(el).html().split("\n");
		var self = this;
		contents.forEach(function(ele, idx){
			self.concat("> " + $(ele).text());
		});

	},
	concat:function( content ){
		this._markdown += content + "\n";
	}
};

module.exports = htmlParser;