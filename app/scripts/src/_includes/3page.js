(function(){
	$('#calendar').clndr({
		daysOfTheWeek: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
	});
	$.get("http://api.apixu.com/v1/current.json?key=3abb9fdca0e74c8495071745180204&q=ann arbor", function(payload) {
		console.log(payload)
		$('#icons').css("background-image", "url(" + payload.current.condition.icon + ")")
		$('#temp').text(payload.current.temp_f+"°F")
		$('#condition').text(payload.current.condition.text)
	})
})()