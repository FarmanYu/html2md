var request = require("request");
var cheerio = require("cheerio");
var toMarkdown = require("to-markdown").toMarkdown;
var commander = require("commander");
var pinyin = require("pinyin");
var fs = require("fs");
var util = require("./lib/util");
var _ = require("underscore");

var log = util.log;
var error = util.error;

var config = {
	"author": "html2md",
	"beforeDoc": "---\nlayout: post\ntitle: <%=title%>\ndescription: <%=description%>\nkeywords: <%=keywords%>\nauthor: <%=author%>\n---",
	"afterDoc": ""
};

function createMarkdown(options) {
	var data = _.extend(config, options);
	var beforeDoc = _.template(config.beforeDoc)(data);
	var afterDoc = _.template(config.afterDoc)(data);
	
	//content ready.	
	var markContent = [
			beforeDoc, "\n", 
			options.content, '\n',
			afterDoc
	].join("");

	//name ready.
	var localFile = util.getDate() + options.title + ".md";

	log(localFile);
	//create file.
	try{
		fs.writeFileSync(localFile, markContent);
		log("Create document success!");
	} catch(e){
		error("Create document failed!");
		throw e;
	}
}

exports.run = function(command){
	
	var slice = Array.prototype.slice;
	var args = [],
		rUrl = /http:\/\/([\w-]+\.)+[\w-]+(\[\w- .\?%&=]*)?/i,
		url = "", 
		container;
	if(command[0].toLowerCase() == "node"){
		args = slice.call(command, 2);
	} else{
		args = slice.call(command, 1);
	}

	if(args.length == 0 /*|| rUrl.test(args[0])*/){
		log("Commander: html2md [url] <container>");
		return;
	} else{
		url = args[0];
		container = args[1] || "body";
	}

	log("It's ready to start download document. <" + url + ">");

	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			log("Start parse html document");
			var allHtml = cheerio.load(body).root();

			var title = allHtml.find("title").text();
				title = util.getPinYin(title);
			
			var content = allHtml.find(container || "body").html();

			var data = {
				title : util.escapeReg(title.join("-")),
				content : toMarkdown( content ),
				description: allHtml.find("meta[name='description']").attr("content"),
				keywords: allHtml.find("meta[name='keywords']").attr("content")
			};
			createMarkdown( data );
		} else{
			error( "Get html document failed!! Please check url!!");
		}
	});
}

exports.run(process.argv);