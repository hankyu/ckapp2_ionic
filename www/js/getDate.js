var MyUtil = MyUtil || {};

MyUtil.namespace =  function() {
	return({
		getDate: getDate
	});



	function getDate() {
		var thisDay = new Date();
	  	var badgeDefultDate = thisDay.getFullYear().toString() + '/' + (thisDay.getMonth()+1).toString() + '/' + thisDay.getDate().toString() + ' ' +
			thisDay.getHours() + ':' + thisDay.getMinutes() + ':' + thisDay.getSeconds();

		return badgeDefultDate;
	}
};
