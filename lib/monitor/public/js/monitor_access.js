function drawGraph(){
             chart = new Highcharts.Chart({
                 chart: {
                     renderTo: 'container',
                     defaultSeriesType: 'spline',
                     events: {
                        // load: requestData
                     }
                 },
                 title: {
                     text: 'System Memory Usage'
                 },
                 xAxis: {
                     type: 'datetime',
                     tickPixelInterval: 150,
                     maxZoom: 20 * 1000
                 },
                 yAxis: {
                     minPadding: 0.2,
                     maxPadding: 0.2,
                     title: {
                         text: 'MB',
                         margin: 80
                     }
                 },
                 tooltip: {
                           formatter: function() {
                                      return '<b>'+ this.series.name +'</b><br/>'+
                                      Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                                      Highcharts.numberFormat(this.y, 2);
                                      }
                         },
                 series: [{
                     name: 'System Memory',
                     data: []
                 }]
             });
             
             
             chart2 = new Highcharts.Chart({
                 chart: {
                     renderTo: 'psgrapgh',
                     defaultSeriesType: 'spline',
                     events: {
                        // load: requestData
                     }
                 },
                 title: {
                     text: 'Heap Size'
                 },
                 xAxis: {
                     type: 'datetime',
                     tickPixelInterval: 150,
                     maxZoom: 20 * 1000
                 },
                 yAxis: {
                     minPadding: 0.2,
                     maxPadding: 0.2,
                     title: {
                         text: 'MB',
                         margin: 80
                     }
                 },
                 tooltip: {
                           formatter: function() {
                                      return '<b>'+ this.series.name +'</b><br/>'+
                                      Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                                      Highcharts.numberFormat(this.y, 2);
                                      }
                         },
                 series: [{
                     name: 'Heap Size',
                     data: []
                     },
                     {
                     name: 'Used Heap',
                 data: []
                 }   
                  
                 ]
             });
}

function setValues(){
        setInterval( function()
                {
                  $.ajax({
                    url: "/memory",
                    dataType:"json",
                    error:function(jqXHR,status,err){
                                 alert(err.message);
                          },
                    success:function(data,status,jqXHR){
                               var date = (new Date()).getTime();
                               
                           shift = chart.series[0].data.length > 20; 
                           chart.series[0].addPoint({x:date,y:data.sysmemory}, true, shift);
                           
                           shift = chart2.series[0].data.length > 20; 
                           chart2.series[0].addPoint({x:date,y:data.heapTotal}, true, shift);
                           shift = chart2.series[1].data.length > 20; 
                           chart2.series[1].addPoint({x:date,y:data.heapUsed}, true, shift);
                         }
                  });
    }, 6000);
}

function getRquestInfo(){
        setInterval( function()
                {
                  $.ajax({
                    url: "/requestInfo?data",
                    dataType:"json",
                    error:function(jqXHR,status,err){
                                 alert(err.message);
                          },
                    success:function(data,status,jqXHR){
                           $('#req').text(data.requests);
                           $('#post').text(data.post_count);
                           $('#get').text(data.get_count);
                           $('#resTime').text(data.avr_resp_time);
                           $('#minTime').text(data.min_resp_time);
                           $('#maxTime').text(data.max_resp_time);
                           $('#bread').text(data.bytes_read);
                           $('#bwrite').text(data.bytes_written);
                         }
                  });
    }, 6000);
}


function updateConfig(url,content){
        $.ajax({
                  type: "POST",
                  url: url,
                  data: {"config":content},
                  success: function(data, textStatus, jqXHR){
                                 alert(textStatus);
                           },
                  dataType:"text"
                });
}