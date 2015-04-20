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
    // return val: true if success
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
            series.setData(s.data,true);

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

        var chart = this,
            selectPeriodBtn = $('#selectPeriodBtn'),
            yearSelect = $('#yearSelected'),
            errorModal = $('#periodError');

            // initialise tooltip
            $('[data-toggle="tooltip"]').tooltip();

            // initialise datepickers
            $('#dateSelected').datepicker({
                format : 'dd/mm/yyyy',
                onRender: function(date) {
                    // console.log(date.valueOf());
                    return date.valueOf() >= Date.now() || date.valueOf() < historyData.start.valueOf() ? 'disabled' : '';
                }
            });
            $('#monthSelected').datepicker({
                format : 'mm/yyyy',
                viewMode:'months',
                minViewMode : 'months'                
            });
            for ( var y = historyData.start.getFullYear(); y <= new Date(Date.now()).getFullYear(); y++  )
            {
                yearSelect.append('<option value="'+y+'">'+y+'</option>')
            }


            // button click handler for changing series
            seriesData.forEach(function(s, i){
                $('.history-chart-buttons .btn').eq(i).click(function () {
                    selectPeriodBtn.removeClass('btn-dark');
                    updateChart(chart,s);
                });
            });  


            // handle modal interface
            var modal = $('#selectPeriodModal'),
                panels = modal.find('.historyPeriodSelect');

            panels.each(function () {

                var panel = $(this),
                    formGroup = panel.find('.form-group'),
                    btn = panel.find('.periodSelectBtn'),
                    period = panel.attr('data-period'),
                    input = panel.find('.input'),
                    errorMessage = panel.find('.error-message');

                btn.click(function () {
                    var val = input.val();
                    // check if valid input value
                    if ( validVal(period,val) === null )
                    {
                        formGroup.addClass('has-error');
                        errorMessage.collapse('show');
                    }
                    else
                    {
                        modal.find('.has-error').removeClass('has-error');
                        modal.find('.error-message').collapse({toggle:false});                        
                        // process valid value 
                        renderPeriodChart(period,val.split('/').map(function (x) { return Number(x) }))
                    }
                });

            // function to validate input
            function validVal (period,val) {
                switch (period)
                {
                    case 'date':
                        return val.match(/\d\d\/\d\d\/\d\d\d\d/g);
                        break;
                    case 'month':
                        return val.match(/\d\d\/\d\d\d\d/g);
                        break;
                    case 'year':
                        return val.match(/\d\d\d\d/g);
                        break;
                }
            };

            // function to load chart according to period
            function renderPeriodChart (period,valsArr) {
                var seriesData;
                switch (period)
                {
                    case 'date':
                        seriesData = historyData.getByDate.apply(window,valsArr);
                        break;
                    case 'month':
                        seriesData = historyData.getByMonth.apply(window,valsArr);
                        break;
                    case 'year':
                        seriesData = historyData.getByYear.apply(window,valsArr);
                        break;
                }


                if (seriesData)
                {
                    $('.history-chart-buttons').find('input[type="radio"]').prop('checked',false);
                    modal.modal('hide');
                    selectPeriodBtn.addClass('btn-dark');
                    updateChart(historyChart,seriesData);
                }
                else
                {
                    errorModal.modal('show');
                }
            };


        });

    });

});