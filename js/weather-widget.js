function WeatherWidget(container, location) {

    this.container = container;
    this.location = location;

    this.apiUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%22'+this.location+'%22&format=json';
    this.el = $('#'+this.container);

    this.erroMsg = 'Sorry, the weather conditions and the weather forecast are not available at this time';

    this.loadWeather();
}

WeatherWidget.prototype.loadWeather = function() {

    //just sanity check - if nowhere to display results, don't even call the api
    if (!this.el) {
        return;
    }

    //uncomment this to put loader in
    //this.el.html('<div id="loader"><img src="img/loader.gif" width="80" height="80" alt="" /></div>');

    $.ajax({
        type: 'GET',
        url:  this.apiUrl,
        dataType: 'json',
        contentType: 'text/plain',
        context: this,
        success: this.processApiCallResults,
        error: this.displayErrorMsg,
        global: false
    });
}

WeatherWidget.prototype.processApiCallResults = function(result) {
    //$('#loader').fadeOut();
    if (result) {
        try {
            if (result.query.results.channel.item) {
                var html = this.createHtml(result.query.results.channel.item);
                //this.el.append(html).fadeIn(); //if still had the loader
                this.el.html(html);
            } else {
                this.displayErrorMsg();
            }
        } catch (ex) {
            this.displayErrorMsg();
        }
    }
}

WeatherWidget.prototype.displayErrorMsg = function(error) {
    //$('#loader').fadeOut();
    //console.log(error); //normally would log error in dev env
    this.el.html('<div class="weather-error">'+this.erroMsg+'</div>');

}

//in 'real' application I would normally have templates (handlebars, etc) and compile a template here
//but that seemed like an overkill for this exercise
WeatherWidget.prototype.createHtml = function(weatherInfo) {
    var labelStart = 'Condition for '.length;
    var title = weatherInfo.title.substr(labelStart);
    var labelEnd = title.indexOf(',') + 4;
    title = title.substr(0, labelEnd);

    var imgTagStart = weatherInfo.description.indexOf('<img');
    var imgTagEnd = weatherInfo.description.indexOf('/>') + 1;
    var img = weatherInfo.description.substr(imgTagStart, imgTagEnd);

    var htmlTop = '<div class="weather-widget-top">'+title+'</div>';
    var htmlMiddle =    '<div class="weather-widget-middle">'+
                            '<div class="ww-temp">'+weatherInfo.condition.temp+'&deg;</div>'+
                            '<div class="ww-cond-icon">'+
                                img+
                                '<div class="ww-cond-text">'+weatherInfo.condition.text+'</div>'+
                            '</div>'+
                        '</div>';
    var htmlBottom = '<div class="weather-widget-bottom">';
    $.each(weatherInfo.forecast, function(i, forecast) {
        htmlBottom +=   '<div class="forecast">'+
                            '<div class="forecast-day">'+forecast.day+'</div>'+
                            '<div class="forecast-temp">'+forecast.high+'&deg; / '+forecast.low+'&deg;</div>'+
                        '</div>';
    });
    htmlBottom += '</div>';


    return htmlTop+htmlMiddle +htmlBottom;

}

