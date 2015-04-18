/*
    DUMMY DATA TO BE USED FOR THE CHARTS
*/

/*
    SET UP HISTORY DATA
*/
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],            
    historyData = {
        start : new Date(Date.parse('2013 Nov 12')),
        current : [], // set of dummy series ( year | month | year )
        months : [],
        years : [],
        dataMatrix : {},
        data : [],
        getByYear : function (year) {        
            var historyData = this,
                data = [];

            if ( !historyData.dataMatrix[year] )
            {
                return null
            }

            for ( month in historyData.dataMatrix[year] )
            {
                data[month] = (function () {
                    var consumption = 0;
                    for ( day in historyData.dataMatrix[year][month] )
                    {
                        for ( hour in historyData.dataMatrix[year][month][day] )
                        {
                            consumption += historyData.data[historyData.dataMatrix[year][month][day][hour].dataIndex].consumption;
                        }
                    }
                    return consumption;
                })();
            }

            return data.length > 0 ? {
                year : year,
                data : data
            } : null;
        },
        getByMonth : function (month,year) {        
            var historyData = this,
                data = [];
            if ( !historyData.dataMatrix[year][month] )
            {
                return null
            }

            for ( day in historyData.dataMatrix[year][month] )
            {
                data[day] = (function () {
                    var consumption = 0;
                    for ( hour in historyData.dataMatrix[year][month][day] )
                    {
                        consumption += historyData.data[historyData.dataMatrix[year][month][day][hour].dataIndex].consumption;
                    }
                    return consumption;
                })();
            }
            return data.length > 0 ? {
                year : year,
                month : months[month],
                data : data
            } : null;
        },
        getByDate : function (day,month,year) {        
            var historyData = this,
                data = [];

            if ( !historyData.dataMatrix[year][month][day] )
            {
                return null
            }

            for ( hour in historyData.dataMatrix[year][month][day] )
            {
                data[hour] = historyData.data[historyData.dataMatrix[year][month][day][hour].dataIndex].consumption;
            }
            return data.length > 0 ? {
                year : year,
                month : months[month],
                day : day,
                data : data
            } : null;
        }
};

// populate historyData.data
;(function(){
    for (var i = Date.parse(historyData.start); i <= Date.now(); i += 3600000) {
        var timestamp = new Date(i),
            obj = {
                unix : i,
                timestamp : timestamp,
                year : timestamp.getFullYear(),
                month : timestamp.getMonth(),
                day : timestamp.getDate(),
                hour : timestamp.getHours()                
            };
        obj.consumption = obj.hour < 5 || obj.hour > 20 ? Math.random()*(5/24) : Math.random()*(8/24)+(5/24)
        
        if ( !historyData.dataMatrix[obj.year] )
        {
            historyData.dataMatrix[obj.year] = {}
        }
        if ( !historyData.dataMatrix[obj.year][obj.month] )
        {
            historyData.dataMatrix[obj.year][obj.month] = {}
        }
        if ( !historyData.dataMatrix[obj.year][obj.month][obj.day] )
        {
            historyData.dataMatrix[obj.year][obj.month][obj.day] = {}
        }
        if ( !historyData.dataMatrix[obj.year][obj.month][obj.day][obj.hour] )
        {
            historyData.dataMatrix[obj.year][obj.month][obj.day][obj.hour] = {dataIndex:historyData.data.length}
        }

        historyData.data.push(obj);

    };
})();

// console.log(historyData.getByYear(2013).data);
// console.log(historyData.getByMonth(3,2015));
// console.log(historyData.getByDate(30,3,2014));
// console.log(historyData.dataMatrix);

/*
    SETUP DATA FOR CURRENT 
    encapsulated within IIFE to prevent global conflict and mess
*/
;(function () {
    var today = new Date(Date.now()),
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    seriesData = historyData.current;

    // setup data for today
    seriesData.push({                
        data : historyData.getByDate(today.getDate(),today.getMonth(),today.getFullYear()).data.map(function (data,i) {
            var time = i === 12 ? 12 : ( i < 12 ? i : i-12 ),
                suffix = i < 12 ? ' am' :  'pm',
                xVal = time + suffix;            
            return [
                    xVal,
                    data
                ]
        }),
        pointFormatter : function (point) {
            return '<b><h3>'+point.y.toFixed(2)+' kWh</h3></b> <br>consumed on <br>'+point.name;
        },
        chartTitle : 'Your Energy Consumption for Today'
    });

    // setup data for this month
    seriesData.push({
       // data for this month
       data : (function () {
           var arr = [];
            historyData.getByMonth(today.getMonth(),today.getFullYear()).data.forEach(function (data,i) {
                arr.push([
                        (i).toString(),
                        data
                    ]) ;
            });
            return arr;
       })(),
       // data : (function () {
       //          var arr = [],
       //              dateToday = today.getDate(),
       //              lastDate = new Date(today.getFullYear(),today.getMonth()+1,0).getDate(),
       //              totalthisMonth = seriesData[0].data.reduce(function (s,x) {
       //                              return s + x; 
       //                          });

       //          for ( var i = 0; i < lastDate ; i++ ) {
       //               arr.push([
       //                      (i+1).toString(),
       //                      i < dateToday ? (Math.random() * 4) + 3 : ( i == dateToday -1 ? totalToday : 0 )                                
       //                   ]);
       //               }


       //          return arr;
       //      })(),
        pointFormatter : function (point) {
            return '<b><h3>'+point.y.toFixed(2)+' kWh</h3></b> <br>consumed on <br>'+months[new Date().getMonth()]+' '+point.name;
        },
        chartTitle : 'Your Energy Consumption for this Month'
    });

    // setup data for this year
    seriesData.push({
        // data for this year
        data : (function () {
            var arr = [];
            historyData.getByYear(today.getFullYear()).data.forEach(function (data,i) {
                arr.push([
                        months[i],
                        data
                    ]) ;
            });
        })(),

        // (function () {
        //         var arr = [],
        //             maxPerMonth = 200,
        //             minPerMonth = 100,
        //             thisMonth = today.getMonth(),
        //             totalThisMonth = 0;

        //             seriesData[1].data.forEach(function (s) { 
        //                 totalThisMonth += s[1];
        //             });

        //         for ( var i = 0; i < months.length ; i++ ) {
        //              arr.push([
        //                     months[i],
        //                     i < thisMonth ? Math.random() * (maxPerMonth-minPerMonth+1)+minPerMonth : ( i == thisMonth ? totalThisMonth : 0 )
        //                  ]);
        //              }            
        //         return arr;
        //     })(),
        pointFormatter : function (point) {
            console.log(Date);
            return '<b><h3>'+point.y.toFixed(2)+' kWh</h3></b> <br>consumed on <br>'+point.name+' '+new Date().getFullYear();
        },
        chartTitle : 'Your Energy Consumption for this Year'
    });

    console.log(seriesData[1]);

})();


/*
    SETUP DATA FOR PREVIOUS 
    encapsulated within IIFE to prevent global conflict and mess
*/
;(function () {
    
})();