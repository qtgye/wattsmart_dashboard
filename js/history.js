$(function () {

    var seriesData = historyData.current;

    // function to set colors of each data marker in a series
    // this should be called by .apply() with Chart as the parameter
    function updateColors() {        
        var series = this.series[0];
        // update colors
        series.data.forEach(function (data, i) {
            var RG = Math.floor(230*(1-(data.y/series.dataMax)));
            data.update({
                color : 'rgb('+RG+','+RG+',230)'
            })
        });
    }

    // function to update chart on data fetch
    // Data fetch is initiated either by chart button clicks or by period select (data picker)
    // param chart = the Chart object
    // param s =  the custom series object containing the data
    function updateChart(chart,s) {

        chart.showLoading();

        // update tooltip format
        chart.series[0].update({
            tooltip : {
                pointFormatter : function () {
                    return s.pointFormatter(this);
                }
            }
        });

        // set timeout to allow loading text to fade in
        setTimeout(function () {
            var series = chart.series[0];            

            // change data
            series.setData(s.data,true,true);

            // update colors 
            updateColors.apply(chart);

            // change chart title
            chart.setTitle({
                text : s.chartTitle
            }, {}, true);

            chart.hideLoading();
        },500);
    }



    // initiate chart
    var historyChart = new Highcharts.Chart({
            chart: {
                type: 'column',
                events : {
                    load : updateColors
                },
                renderTo : $('#history-chart')[0]
            },            
            title : {
                text : 'Your Energy Consumption for this Month'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Energy in kWh'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormatter : function(){
                    return seriesData[1].pointFormatter(this);
                },
                animation: true,
                shadow: true,
                headerFormat : '',
                backgroundColor : '#000',   
                border : 'none',
                style : {
                    color : '#eee',                
                    fontSize : '16px'
                }
            },
            loading: {
                labelStyle: {
                    color: 'blue'
                },
                style: {
                    backgroundColor: 'white'
                },
                showDuration : 500
            },
            series: [{
                name: 'Energy Consumption History',
                data: seriesData[1].data,
                colorByPoint: true         
            }]
        },function(){

            /* callback */

            var chart = this;

            // button click handler for changing series
            seriesData.forEach(function(s, i){
                $('.history-chart-buttons .btn').eq(i).click(function () {
                    updateChart(chart,s);
                });
            });  

            // handle click for selectPeriod button

        });
    
    
    
    
    
    
});