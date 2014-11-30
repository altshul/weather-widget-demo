function WeatherWidget(container, location) {

    this.parentContainer = container;
    this.location = location;

    //22102 - McLean zip code

    this.apiUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%22'+this.location+'%22&format=json';
}

WeatherWidget.prototype.loadWeather = function() {

    $.ajax({
        type: 'GET',
        url:  this.apiUrl,
        dataType: 'json',
        contentType: 'text/plain',
        context: this,
        success: this.processApiCallResults,
        error: function(error) {
            console.log(error);
        }
    });
}

WeatherWidget.prototype.processApiCallResults = function(result) {
    if (result) {
        console.log(result.query.results.channel.item);
        console.log(this);
        try {
            if (result.query.results.channel.item) {
                var html = this.createHtml(result.query.results.channel.item);
                //var html = 'test';
                $('#weather-widget-wrapper').append(html).fadeIn();
            } else {
                console.log('cannot update');
            }
        } catch (ex) {
            console.log(ex);
            console.log('catch - cannot update');
        }
    }
}

WeatherWidget.prototype.createHtml = function(weatherInfo) {
    var labelStart = 'Condition for '.length;
    var title = weatherInfo.title.substr(labelStart);
    var labelEnd = title.indexOf(',') + 4;
    title = title.substr(0, labelEnd);

    var imgTagEnd = weatherInfo.description.indexOf('/>') +2;
    var img = weatherInfo.description.substr(0, imgTagEnd);

    var htmlTop = '<div class="weather-widget-top">'+title+'</div>';
    var htmlMiddle =    '<div class="weather-widget-middle">'+
                            '<div class="ww-temp">'+weatherInfo.condition.temp+'&deg;</div>'+
                            '<div class="ww-cond-icon">'+
                                img+
                                '<div>'+weatherInfo.condition.text+'</div>'+
                            '</div>'+
                        '</div>';
    var htmlBottom = '<div class="weather-widget-bottom">';
    $.each(weatherInfo.forecast, function(i, forecast) {
        htmlBottom +=   '<div class="forecast">'+
                            '<div class="forecast-day">'+forecast.day+'</div>'+
                            '<div class="forecast-temp">'+forecast.high+'&deg;/'+forecast.low+'&deg;</div>'+
                        '</div>';
    });
    htmlBottom += '</div>';


    return htmlTop+htmlMiddle +htmlBottom;

}

$( document ).ready(function() {
    var ww = new WeatherWidget('weather-widget-wrapper', '22102');
    ww.loadWeather();
});

$(document).ajaxStart(function() {
	$('#loader').show();
});
$(document).ajaxSuccess(function() {
	$('#loader').fadeOut();
});
$(document).ajaxError(function() {
    $('#loader').fadeOut();
});