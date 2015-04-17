/*
	These are dummy data only.
	Dynamically rendered elements should be done in php.
*/

// structure the appliances object using revealing module design
var appliances = (function () {

	var obj = {}; // return object

	obj.pricePerKwh = 10.51;
	obj.maxConsumption = 300;

	obj.items = [
			{
				name : 'Aircon',
				location : 'Main',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'Aircon',
				location : 'Men\'s Room',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'Aircon',
				location : 'Ladie\'s Room',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'Television',
				location : 'Living Room',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'Refrigerator',
				location : 'Main',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'Heater',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'Water Heater',
				location : 'Main',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			},
			{
				name : 'CO (Convenience Outlet)',
				location : 'Kitchen',			
				consumption : Math.random()*obj.maxConsumption,
				info : 'Some info here'
			}
		];

	return obj;
})();


$(function () {

	var items = appliances.items;

	// compute for the cost of each appliance
	items.forEach(function (item,i) {

		var cost = (item.consumption * appliances.pricePerKwh).toString(),
			costBase = cost.replace(/[.].*$/g,'');

		var costFormatted = costBase.toString().split('').reverse().map(function (x,i) {
			return (i+1)%4 === 0 ? x+',' : x;
		}).reverse().join('');

		items[i].cost = costFormatted + '.' + cost.replace(/^.*[.]/g,'').substring(0,2);

	})

	// sort appliances according to consumption
	itemsSorted = items.sort(function (a,b) {
		return a.consumption < b.consumption
	});

	var tbl = $('#appliances').addClass('list-group'),
		rankList = $('.rank-list').addClass('clearfix'),
			rankRow = $('<div>',{class:'row'}).appendTo(rankList);

	itemsSorted.forEach(function (item,i) {

		// list all items to sidebar list
		var row = $('<tr style="cursor:pointer" data-parent="#'+tbl.attr('id')+'" data-toggle="collapse" data-target="#listItem_'+i+'">');
		row
			.append('<td><div>'+item.name+'</div></td>')
			.append('<td><div>'+item.cost+'</div></td>')
		tbl
			.append(row)
			.append('<tr><td colspan="2" ><div class="collapse panel-collapse" id="listItem_'+i+'"><div>'+item.info+'</div></div></td></tr>');
		
		// list the top 3
		if ( i < 3 )
		{
			var subInfoId = 'itemSubInfo_'+i,
				rowInner = $('<div>',{class:'col-sm-4'}).appendTo(rankRow)	,			
				itemPanel = $('<div>',{class:'panel panel-default clearfix rank-item'}).appendTo(rowInner),
					itemRankContainer = $('<div>',{class:'visible-xs col-xs-4'}).appendTo(itemPanel),
						itemRank = $('<div>',{class:'bg-primary rank-item-rank'})
							.append('<h3>TOP</h3><h1>'+(i+1)+'</h1>')
							.appendTo(itemRankContainer),
					itemImgContainer = $('<div>',{class:'hidden-xs col-sm-12'}).appendTo(itemPanel),
						itemImg = $('<img>',{src:(item.img ? item.img : 'img/thumbnail-default.jpg'),style:'max-width:100%'}).appendTo(itemImgContainer),
					itemMainInfoContainer = $('<div>',{class:'col-xs-6 col-sm-12'}).appendTo(itemPanel),
						itemMainInfo = $('<div>',{class:'rank-item-info'}).appendTo(itemMainInfoContainer)
							.append('<h3>'+item.name+'</h3>')
							.append((item.location ? '- '+item.location : ''));
		}


	});


});


