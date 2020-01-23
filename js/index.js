$(document).ready(function() {
	const $app = $('.app');
	const $img = $('.app__img');
	const $pageNav1 = $('.app__text--1');
	const $pageNav2 = $('.app__text--2');
	let animation = true;
	let curSlide = 1;
	let scrolledUp, nextSlide;
	
	let pagination = function(slide, target) {
		animation = true;
		if (target === undefined) {
			nextSlide = scrolledUp ? slide - 1 : slide + 1;
		} else {
			nextSlide = target;
		}
		console.log(".app__text--" + slide)
		$('.app__text--' + nextSlide).addClass('page__item-active');
		$('.app__text--' + nextSlide).removeClass('none');
		$('.app__text--' + slide).removeClass('page__item-active');
		$('.app__text--' + slide).addClass('none');
		if(nextSlide == 2){
			$('#a').addClass('animated');
			$('#a').addClass('zoomInDown');
			$('#a').addClass('delay-3s');
		}
		
		$app.toggleClass('active');
		setTimeout(function() {
			animation = false;
		}, 3000)
	}
	
	let navigateDown = function() {
		if (curSlide > 1) return;
		scrolledUp = false;
		pagination(curSlide);
		curSlide++;
	}

	let navigateUp = function() {
		if (curSlide === 1) return;
		scrolledUp = true;
		pagination(curSlide);
		curSlide--;
	}

	setTimeout(function() {
		$app.addClass('initial');
	}, 1500);

	setTimeout(function() {
		animation = false;
	}, 4500);
	
	$(document).on('mousewheel DOMMouseScroll', function(e) {
		var delta = e.originalEvent.wheelDelta;
		if (animation) return;
		if (delta > 0 || e.originalEvent.detail < 0) {
			navigateUp();
		} else {
			navigateDown();
		}
	});

	$(document).on("click", ".app__text:not(.page__item-active)", function() {
		if (animation) return;
		let target = +$(this).attr('data-target');
		pagination(curSlide, target);
		curSlide = target;
	});
});