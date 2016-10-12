app.factory('DateHelper', [function(){
	var DateHelper = function(date) {
		var dateArr, dateObj, month, day;

		dateArr = date.split('-');
		dateObj = new Date(date);

		this.year = dateArr[0];
		this.month = {num: 0, name: ''};
		this.day = {num: 0, name: ''};
		this.months = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"];
  		this.days = ["Sunday", "Monday", "Teusday", "Wednesday", "Thursday", "Friday", "Saturday"];

		this.init(dateObj, dateArr);
	}

	DateHelper.prototype.init = function(date, dateArr) {
		day = dateArr[2].split('T').shift();

		this.setMonth(date.getMonth());
		this.setDay(day, date.getDay());

	}

	DateHelper.prototype.setMonth = function(monthNum) {
		this.month.num = monthNum + 1;
		this.month.name = this.getMonthName(monthNum);
	}

	DateHelper.prototype.setDay = function(day, dayNum) {
		this.day.num = day;
		this.day.name = this.getDayName(dayNum);
	}

	DateHelper.prototype.getMonthName = function(monthNum) {
		return this.months[monthNum];
	}

	DateHelper.prototype.getDayName = function(dayNum) {
		return this.days[dayNum];
	}

	return DateHelper;
}]);