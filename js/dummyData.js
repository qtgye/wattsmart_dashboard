/*
    DUMMY DATA TO BE USED FOR THE CHARTS
*/

/*
    SET UP HISTORY DATA
*/
var historyData = {
    start : new Date(Date.parse('2013 Nov 12')),
    current : [], // set of dummy series ( year | month | year )
    previous : []
};

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
        data : (function () {
                var arr = [],
                    maxKwh = 10, // maximum consumption today
                    thisHour = today.getHours(),
                    thisMinute = today.getMinutes()
                    multiplier = 1/24;

                for ( var i = 1; i < 24 ; i++ ) {
                    var time = i === 12 ? 12 : ( i < 12 ? i : i-12 ),
                        suffix = i < 12 ? ' am' :  'pm',
                        xVal = time + suffix,
                        consumed = i < 5 ? (maxKwh/24)*0.2 : Math.random() * maxKwh * multiplier;
                     arr.push([
                            xVal,
                            i < thisHour ? consumed : ( i == thisHour ? consumed*(thisMinute/60) : 0 )
                         ]);
                     }            
                return arr;
            })(),
        pointFormatter : function (point) {
            return '<b><h3>'+point.y.toFixed(2)+' kWh</h3></b> <br>consumed on <br>'+point.name;
        },
        chartTitle : 'Your Energy Consumption for Today'
    });

    // setup data for this month
    seriesData.push({
       // data for this month
       data : (function () {
                var arr = [],
                    dateToday = today.getDate(),
                    lastDate = new Date(today.getFullYear(),today.getMonth()+1,0).getDate(),
                    totalthisMonth = seriesData[0].data.reduce(function (s,x) {
                                    return s + x; 
                                });

                for ( var i = 0; i < lastDate ; i++ ) {
                     arr.push([
                            (i+1).toString(),
                            i < dateToday ? (Math.random() * 4) + 3 : ( i == dateToday -1 ? totalToday : 0 )                                
                         ]);
                     }            
                return arr;
            })(),
        pointFormatter : function (point) {
            return '<b><h3>'+point.y.toFixed(2)+' kWh</h3></b> <br>consumed on <br>'+months[new Date().getMonth()]+' '+point.name;
        },
        chartTitle : 'Your Energy Consumption for this Month'
    });

    // setup data for this year
    seriesData.push({
        // data for this year
        data : (function () {
                var arr = [],
                    maxPerMonth = 200,
                    minPerMonth = 100,
                    thisMonth = today.getMonth(),
                    totalThisMonth = 0;

                    seriesData[1].data.forEach(function (s) { 
                        totalThisMonth += s[1];
                    });

                for ( var i = 0; i < months.length ; i++ ) {
                     arr.push([
                            months[i],
                            i < thisMonth ? Math.random() * (maxPerMonth-minPerMonth+1)+minPerMonth : ( i == thisMonth ? totalThisMonth : 0 )
                         ]);
                     }            
                return arr;
            })(),
        pointFormatter : function (point) {
            console.log(Date);
            return '<b><h3>'+point.y.toFixed(2)+' kWh</h3></b> <br>consumed on <br>'+point.name+' '+new Date().getFullYear();
        },
        chartTitle : 'Your Energy Consumption for this Year'
    });

})();


/*
    SETUP DATA FOR PREVIOUS 
    encapsulated within IIFE to prevent global conflict and mess
*/
;(function () {
    
})();