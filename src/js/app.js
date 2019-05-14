import $ from 'jquery';

// import jqueryStarRatingWatchers from './base';

/* eslint-disable import/prefer-default-export */
/* eslint-disable func-names */
/* eslint-disable no-mixed-spaces-and-tabs */
$(document).ready(() => {
	/* 1. Visualizing things on Hover - See next part for action on click */
	$('#ratingsRecipe li').on('mouseover', function () {
	  const onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

	  console.log(this);
	  // Now highlight all the stars that's not after the current hovered star
	  $(this).parent().children('li.star').each(function (e) {
			if (e < onStar) {
		  $(this).addClass('hover');
			} else {
		  $(this).removeClass('hover');
			}
	  });
	}).on('mouseout', function () {
	  $(this).parent().children('li.star').each(function (e) {
			$(this).removeClass('hover');
	  });
	});

	/* 2. Action to perform on click */
	$('#ratingsRecipe li').on('click', function () {
	  const onStar = parseInt($(this).data('value'), 10); // The star currently selected
	  const stars = $(this).parent().children('li.star');
	  let i;

	  for (i = 0; i < stars.length; i++) {
			$(stars[i]).removeClass('selected');
	  }

	  for (i = 0; i < onStar; i++) {
			$(stars[i]).addClass('selected');
	  }

	  // JUST RESPONSE (Not needed)
	  const ratingValue = parseInt($('#ratingsRecipe li.selected').last().data('value'), 10);
	  console.log(ratingValue);
	});
});
