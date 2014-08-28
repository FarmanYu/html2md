var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");
var htmlParser = require("./htmlParser.js");
var config = require("./config.js");
var fs = require("fs");
var path = require("path");
var _ = require("underscore");

if (!config.url) {
	throw new Error("there have not the url.");
}


function createMarkdown(options) {
	var data = _.extend( config, options);
	var beforeDoc = _.template(config.beforeDoc)(data);
	var afterDoc = _.template(config.afterDoc)(data);

	var markContent = [
			beforeDoc, "\n", 
			options.content, '\n', 
			afterDoc
	].join("");

	var today = new Date();
	var lastPointIndex = path.basename(config.url).lastIndexOf(".");
	var basename = lastPointIndex == -1 ? path.basename(config.url) : path.basename(config.url).substring(lastPointIndex, -1) ;
	var filename = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	filename += '-' + basename + ".md";

	fs.writeFileSync(filename, markContent);
}

request(config.url, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log("get html document....");
		var html = cheerio.load(body).root();
		var contenthtml = html.find(config.container || "body").html();

		var html2md = new htmlParser();

		var opts = {
			title : html.find("title").html(),
			content : html2md.handle( contenthtml ),
			description: html.find("meta[name='description']").attr("content"),
			keywords: html.find("meta[name='keywords']").attr("content")
		}
		console.log( "parse html document...." );
		createMarkdown( opts );
	}
});