function popUp(URL) {
var day = new Date();
var id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=400,height=400,left = 520,top = 250');");
}

jQuery(document).ready(function($){

  console.log(stickyH);
  announcementBar = $('#announcement-bar');
  announcementBarHeight = Number(stickyH['announcementH']);
  isAnnounceSticky = stickyH['isAnnounceSticky'];
  navBarHeight = Number(stickyH['navH']);
  booknowH = Number(stickyH['booknowbarH']);
  pageNavH = Number(stickyH['pageNavH']);

  // Component Same Height
  function sameHeightComps() {
    $('.wp-block-column').each(function(index,col){
      var h = $(col).height() - 20;
      var tH = $(col).find('h3').outerHeight(true);
      var iH = $(col).find('.featured-image').height();

      var newCopyH = h-tH-iH;

      console.log(h,tH,iH,newCopyH);
      $(col).find('.component-copy').outerHeight(newCopyH);
    })
  }

  // sameHeightComps();
  //
  // $(window).scroll(() => {
  //   sameHeightComps();
  // })

  // Shrink Font Sizes to fit
  function shrinkToFit(targetContainer,targetEl,targetSize, callback) {
    var numOfEls = $(targetEl).length;
    var completed = 0;

    function isCompleted() { // checks num of completed loops against total # of elements
      completed++;
      if ( completed == numOfEls) { callback() }
    }

    $(targetEl).each(function(index,el){
      var h = $(this).innerHeight();
      if (h > targetSize) { // compares height against target height
        var fontSize = $(el).css('font-size');
        fLength = fontSize.length;
        fontSize = fontSize.substr(0,fLength-2);

        function shrinkMe(oldSize) { // shrinks font by 1, checks new height against target
          var newSize = oldSize - 1;
          $(el).css('font-size',newSize+'px');
          h = $(el).innerHeight();

          if (h > targetSize) {
            setTimeout(function(){ shrinkMe(newSize) },5); // reruns if not small enough
          } else {
            isCompleted();
          }
        }

        shrinkMe(fontSize);
      } else { isCompleted(); }
    });
  }

  function wideToFit(targetContainer,targetEl,targetSize,callback) {
    var numOfEls = $(targetEl).length;
    var completed = 0;

    function isCompleted() { // checks num of completed loops against total # of elements
      completed++;
      if ( completed == numOfEls) { callback() }
    }

    $(targetEl).each(function(index,el){
      var h = $(this).innerHeight();
      if (h > targetSize) { // compares height against target height
        var fontSize = $(el).css('font-size');
        fLength = fontSize.length;
        fontSize = fontSize.substr(0,fLength-2);
        var w = $(targetContainer).width();

        function fitMe(oldWidth) { // shrinks font by 1, checks new height against target
          var newWidth = oldWidth + 10;
          $(el).css('width',newWidth+'px');
          h = $(el).innerHeight();

          if (h > targetSize) {
            setTimeout(function(){ fitMe(newWidth) },5); // reruns if not small enough
          } else {
            isCompleted();
          }
        }

        fitMe(w);
      } else { isCompleted(); }
    });
  }

  function exitRB() {
    function exit() {
      var stopVideo = function ( element ) {
      	var iframe = element.querySelector( 'iframe');
      	var video = element.querySelector( 'video' );
      	if ( iframe ) {
      		var iframeSrc = iframe.src;
      		iframe.src = iframeSrc;
      	}
      	if ( video ) {
      		video.pause();
      	}
      };

      $('#roadblock').animate({'opacity':0},200);
      $('body').removeClass('noScroll');
      setTimeout(() => {
        $('#roadblock').css('display','none');
        stopVideo(document.getElementById('roadblock'));
      },200)
    }

    $('#roadblock,#rb-exit').click((e) => {
      exit();
    });

    $('#rb-inner').click((e) => {
      e.stopPropagation();
    })
  }

  function mobileButtons(){
    if ($(window).width() >= 768) {
      $('.button-container').removeClass('mobile');
    } else {
      $('.button-container').addClass('mobile');
    }
  }

  // Header Functions

  function sticky() {

    if (announcementBar.length > 0 && isAnnounceSticky) {
      var announcementSticky = new Waypoint.Sticky({
        element: $('#announcement-bar')[0],
        offset: $('#announcement-bar').offset().top
      });
    }

    var navOffset = isAnnounceSticky ? $('#nav-bar').offset().top : 0;
    var navSticky = new Waypoint.Sticky({
      element: $('#nav-bar')[0],
      offset: navOffset
    });

    var infoOffset = isAnnounceSticky ? announcementBarHeight + navBarHeight + booknowH : navBarHeight + booknowH;
    if ($('#info-pages').length > 0) {
      if ($(window).width() > 768) {

      }
      var infoSticky = new Waypoint.Sticky({
        element: $('#info-sidebar')[0],
        offset: infoOffset
      });
      // var searchSticky = new Waypoint.Sticky({
      //   element: $('#info-pages .search-form')[0],
      //   offset: announcementBarHeight + navBarHeight + booknowH
      // })
    }

    if ($('#book-now-button').length > 0) {
      var booknowOffset = isAnnounceSticky ? announcementBarHeight + navBarHeight : navBarHeight;
      console.log(booknowOffset);
      var booknowSticky = new Waypoint.Sticky({
        element: $('#book-now-button')[0],
        offset:booknowOffset
      });

      // var searchSticky = new Waypoint.Sticky({
      //   element: $('#info-pages .search-form')[0],
      //   offset: $('#info-pages .search-form').offset().top
      // })
    }

    var contentTop = $('section#content').offset().top;
    $(window).scroll(function(){
      if ($(window).scrollTop() > contentTop) {
        $('#social-bar-customer-support').addClass('slideIn')
      } else {
        $('#social-bar-customer-support').removeClass('slideIn')
      }
    })

    var pageNavOffset = isAnnounceSticky ? announcementBarHeight + navBarHeight + booknowH : navBarHeight + booknowH;
    var pageNav = $('#page-nav');
    if (pageNav.length > 0) {
      var pageNavSticky = new Waypoint.Sticky({
        element: $('#page-nav')[0],
        offset:announcementBarHeight + navBarHeight + booknowH
      });
    }

  }

  function navScripts() {
    $('a').click(function(e){
      if ($(this).attr('href').endsWith("#")) {
        e.preventDefault();
      }
    })

    // page navigation
    $('nav.component-nav a').click(function(e){
      e.preventDefault();
      var anchor = $(this).attr('href');
      var target = $(anchor).offset().top;
      $("html, body").animate({ scrollTop: target - (announcementBarHeight + navBarHeight + booknowH + pageNavH) }, 500);
    })

    // page navigation dropdown on mobile
    $('#page-nav-title').click(function(e){
      if ($(window).width() <= 768) {
        if ($(this).hasClass('active') ) {
          $('#page-nav-inner').slideUp();
        } else {
          $('#page-nav-inner').slideDown();
        }

        $(this).toggleClass('active');
      }
    });

    if ($(window).width() < 768) {
      $(window).scroll(function() {
        if ($('#page-nav-title').hasClass('active') ) {
          $('#page-nav-inner').slideUp();
          $('#page-nav-title').removeClass('active');
        }
      })
    }

    $('#nav-main .menu-item-has-children').click(function(e){
      e.stopPropagation();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').find('ul').css('display','none').css('opacity','0');
      } else {
        $(this).siblings('.menu-item-has-children').removeClass('active').find('ul').css('display','none').css('opacity','0');
        $(this).addClass('active').find('ul').fadeTo(300,1);
      }
    });

    $('body').click(function(){
      var navItem = $('#nav-main .menu-item-has-children');
      if (navItem.hasClass('active')) {
        navItem.removeClass('active').find('ul').css('display','none').css('opacity','0');
      }
    });

    $('footer .menu-item-has-children').hover(function(){
      $(this).find('ul').css('display','block').fadeTo(300,1);
    }, function(){
      $(this).find('ul').fadeTo(300,0).css('display','none');
    })

    $('#footer-menu').find('ul').first().hover(function(){
      // $(this).addClass('dropdown');
      $(this).find('li').hover( function(){
        if ($(this).hasClass('menu-item-has-children') == false) {
          $(this).closest('ul').removeClass('dropdown');
        } else { $(this).closest('ul').addClass('dropdown'); }
      });
    }, function(){
      $(this).removeClass('dropdown');
    })

    $('.side-menu-bttn').click(function(){
        // $('#side-menu').show(300);
        $('#side-menu').toggleClass('slideOut');
        $('body').toggleClass('lock');
    });

    // $('#side-menu-close').click(function(){
    //   $('#side-menu').hide(300);
    //   $('body').css('overflow','scroll');
    // })

    $('#side-menu .menu-item-has-children').click(function(){
      $(this).find('ul').slideToggle();
      $(this).find('a').first().toggleClass('active');
      // $(this).siblings('.menu-item-has-children').find('ul').slideToggle();
    })
    //
    // $('#side-menu .menu-item-has-children a:first').append('<i class="fas fa-caret-down"></i>');
  }

  // Newsletter Functions
  function formatSignup() {
    $('footer .mc4wp-form input[type="email"]').attr('placeholder','Sign Up For Our Email Newsletter');
    $('header .mc4wp-form input[type="email"]').attr('placeholder','Your Email');
    $('#fp-midbar .mc4wp-form input[type="email"]').attr('placeholder','');
    // $('#fp-midbar .mc4wp-form i').append('<br>');

  }

  // Format Videos
  function formatVideos(){
    $('.video-embed').each(function(index,el){
      $(el).find('iframe').attr('width',null).attr('height',null);
    })
  }


  // Format Buttons
  function formatButtons() {
    // $('.button').each(function(index,el){
    //   if ($(el).hasClass('no-resize') == false) {
    //     if ($(el).hasClass('lg-bttn')) {
    //       wideToFit('.lg-bttn','.lg-bttn',48,function(){ $('.lg-bttn').addClass('lg-after-resize').fadeTo(300,1) });
    //     }
    //     if ($(el).hasClass('small-bttn')) {
    //       wideToFit('.small-bttn','.small-bttn',40,function(){ $('.small-bttn').addClass('sm-after-resize').fadeTo(300,1) });
    //     }
    //   }
    // })

  }


  // Component content format
  function formatComponents(){
    if ($(window).width() >= 850) {
      $('.wp-block-columns').each(function(index,row){
        var contentHeight = 0;
        $(this).find('.component .component-inner').each(function(index,com){
          var h = $(com).innerHeight();
          if (h > contentHeight) { contentHeight = h}
        })

        $(this).find('.component .component-inner').each(function(index,com){
          if ($(com).innerHeight() != contentHeight) {
            $(com).css('min-height',contentHeight + 'px');
          }
        })
      })
    } else {
      $('.component .component-inner').css('min-height',0);
    }

    if ($('.components').first().css('opacity') == 0) {
      setTimeout(function(){$('.components').fadeTo(200,1)},200);
    }
  }

  // Slick galleries
  $('.gallery-block').slick({
    // autoplay: true,
    infinite: true
  });

  $('.carousel-inner').slick({
    infinite: true
  })



  if ($('body').hasClass('elementor-page') == false) {
    // console.log('POPUPS should work');
    $('.popout-img').magnificPopup({
      // delegate: 'a',
      type: 'image',
      tLoading: 'Loading image',
      mainClass: 'mfp-img-mobile',
      // gallery: {
      //   enabled: true,
      //   navigateByImgClick: true,
      //   preload: [0,1] // Will preload 0 - before current, and 1 after the current image
      // },
      image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
      }
    });
  }


  $('.popout-gallery').each(function(index,el){
    $(this).find('a').magnificPopup({
      type: 'image',
      tLoading: 'Loading image',
      mainClass: 'mfp-img-mobile',
      gallery: {
        enabled: true,
        navigateByImgClick: true
      },
      image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
      }
    })
  });

  $('.popout-gallery-bttn').click(function(e){
    e.preventDefault();
    var target = $(this).attr('data-gallery');
    $('#gallery-'+target).find('a').magnificPopup('open');
  })


  // Countdown
  function countdown() {
    if ($('.countdown-start').length > 0) {

      const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

      var then = $('.countdown-start').attr('data-time');
      var countDown = new Date(then).getTime();
      var now = new Date().getTime();
      distance = countDown - now;

      $('.countdown-start').text( Math.floor(distance / (day)) + ' DAYS');
    }

    if ($('body').hasClass('home') ) {
      $(window).scroll(function(){
        if ($(window).scrollTop() + (announcementBarHeight + booknowH + pageNavH + 50) > $('.countdown').offset().top  ) {
          $('.countdown-inner').addClass('zoomMe');
        }
      })
    }

  }

  // CTAs
  function cta_rollOver(){
    $('.cta-inner').each(function(index,el){
      $(el).hover(function(){
        $(el).find('.cta-rollOver').fadeTo(400,1);
      }, function(){
        $(el).find('.cta-rollOver').fadeTo(400,0);
      })
    })
  }

  // Frontpage News More Info
  function loadMoreNews(){
    $('#fp-loadMoreNews').click(function(e){
      e.preventDefault();
      $('.news-excerpt-wrap tr').fadeTo(300,1);
    })
  }

  // Highlight Gallery Accordian
  $('.photographer-name').click(function(){
    if ($(this).hasClass('isActive')) {
      $(this).removeClass('isActive').siblings('.highlight-gallery').slideUp(1000);
    } else {
      $(this).addClass('isActive').siblings('.highlight-gallery').slideDown(600);
    }
  })

  // Lineup Cards
  function lineupCard() {
    $('.lineup-artist').click(function(e){
      $('#lineup-cards').show();
      $('html').addClass('noScroll');

      buildCard($(this).attr('data-index'));

      $('#lineup-cards .card,#lineup-card-nav-top').click(function(e){
        e.stopPropagation();
      })

      $('.prev-artist,.next-artist').click(function(e){
        e.stopPropagation();
        var target = $(this).attr('data-target');
        if (target != null){
          buildCard(target);
          $('#lineup-cards').animate({scrollTop:0},400);
        }
      });

      $('#lineup-cards,#lineup-card-exit').click(function(event){
        $('#lineup-cards').hide();
        $('html').removeClass('noScroll');
        $('.prev-artist,.next-artist').unbind();
      })

    })
  }

  // Lineup Font Adjust
  function lineupFontSizes() {
    shrinkToFit('.lineup-box-container','.lineup-box-container h3',26);
  }

  function buildCard(index){
    console.log(index);
    // build variables
    // var slug = $(this).attr('data-slug');
    var slug = "";
    var target;
    var sets = [];
    var indexTotal = $('#totalArtists').attr('data-indexTotal');

    var target = $('.lineup-artist[data-index="' + index +'"]').attr('data-slug');
    console.log('Target should be: ',target)

    var artist = $('.artist-data span[data-slug="' + target + '"]');
    slug = artist.attr('data-slug');
    name = artist.attr('data-artist');
    img = artist.attr('data-img');
    bio = artist.attr('data-bio');
    video = artist.attr('data-video');
    fb = artist.attr('data-fb');
    twitter = artist.attr('data-twitter');
    insta = artist.attr('data-insta');
    yt = artist.attr('data-yt');
    spotify = artist.attr('data-spotify');

    console.log('Target is:',name);


    $('.sets-data span').each(function(index,el){
      if ($(el).attr('data-slug') == slug) {
        var set = $(el);
          thisSet = {
            start: $(el).attr('data-start'),
            stage: $(el).attr('data-stage'),
            day: $(el).attr('data-day')
          }
        sets.push(thisSet);
      }
    })

    // Populate card
    var card = $('.card');
    card.find('.main-img').css('background-image','url('+img+')');
    card.find('.title').text(name);
    card.find('.bio').html(bio);
    card.find('.video-embed').empty();

    if (video != '') {
      $video = $(video);
      $video.attr('width',null).attr('height',null);
      card.find('.video-embed').append($video);
    }

    if (fb != '' ) {
      card.find('.fb').addClass('show').attr('href',fb);
    }
    if (twitter != '' ) {
      card.find('.twitter').addClass('show').attr('href',twitter);
    }
    if (insta != '' ) {
      card.find('.insta').addClass('show').attr('href',insta);
    }
    if (yt != '' ) {
      card.find('.yt').addClass('show').attr('href',yt);
    }
    if (spotify != '' ) {
      card.find('.spotify').addClass('show').attr('href',spotify);
    }

    var setTimes = '';
    if (sets.length == 0) {
      card.find('.set-times').addClass('hide');
    } else {
      sets.forEach(function(set){
        var markup = '<h5 class="set-info"><span class="day">'+set.day+'</span><span class="time">'+set.start+'</span><span class="stage">'+set.stage+'</span></h5>'
        setTimes += markup;
      })
      card.find('.set-times-inner').html(setTimes);
      card.find('.set-times').removeClass('hide');
    }

    index = Number(index);

    if (index - 1 > 0) {
      $('.prev-artist').attr('data-target',index - 1).removeClass('disabled');
    } else { $('.prev-artist').attr('data-target',null).addClass('disabled') ;}

    if (index + 1 <= indexTotal) {
      $('.next-artist').attr('data-target',index + 1).removeClass('disabled');
    } else { $('.next-artist').attr('data-target',null).addClass('disabled') ;}
  }

  // Pricing Functions

  function pricingModule() {

    function dynamicLoad(row) {
      return new Promise ((res,rej) => {
        var $thisSlide = $('.slideout-inner[data-row="'+row+'"]');

        $thisSlide.find('.dynamic-load').each(function(i,el){
          if ($(el).css('background-image') == 'none') {
            var bg = $(el).attr('data-bg');
            $(el).css('background-image','url("'+bg+'")');
          }
        });

        res();

      } );
    }

    // setTimeout(() => { 
    //   setInterval(() => {
    //     $('.slideout-inner').each(function(index,el){
    //       dynamicLoad(index);
    //     })
    //   },200)
    // },3000)

    function slideOut() {
      if ( $(window).width() < 600) {
        $('.pt-cell').click( function() {
          const row = $(this).attr('data-row');
          const mID = $(this).closest('.pricing-table').attr('data-mid');
          console.log(row,mID);
          $('body').addClass('noScroll');
          $('section#content').addClass('toFront');

          dynamicLoad(row).then((res) => {

            var $slideout = $('.pricing-slideouts[data-mid="'+mID+'"]');
            $slideout.closest('.pricing-slideout').addClass('slideIn');

            $slideout.find('.slideout-inner[data-row="'+row+'"]').addClass('active').find('.gallery').slick({
              autoplay: true,
              autoplaySpeed: 2000,
            });

            $slideout.find('.exit-slideout').click(function() {
              $slideout.closest('.pricing-slideout').removeClass('slideIn');
              $('body').removeClass('noScroll');
              $('section#content').removeClass('toFront');

              setTimeout(function(){
                $('.slideout-inner.active').removeClass('active').find('.gallery').slick('unslick');
              },400)
            } );
          })

        })
      }
    }

    slideOut();

    function priceTableDD() {

      $('.pricing-table .dropdown-container').find('.gallery').slick({
        autoplay: true,
        autoplaySpeed:2000
      })

      $('.slick-arrow,.slick-list').click((e) => {
        e.stopPropagation();
      })

      if($(window).width() > 600) {
        $('.pricing-table .cat-type-cell').click(function(){
          var row = $(this).attr('data-row');
          var mid = $(this).closest('.pricing-table').attr('data-mID');
          var active = $(this).attr('data-active');

          var target = $('.pricing-table[data-mID="'+mid+'"]');

          target.find('.dropdown-container').each(function(index,el){
            var dataRow = $(el).attr('data-row');
            if (dataRow == row) {
              if (active == 'yes') {
                $(el).slideUp();
                target.find('.pt-cell[data-row="'+row+'"]').attr('data-active','no');
                target.find('.cat-type-cell[data-row="'+row+'"] .fa-plus').removeClass('active');
              } else {
                dynamicLoad(dataRow)
                $(el).slideDown();
                target.find('.pt-cell[data-row="'+row+'"]').attr('data-active','yes');
                target.find('.cat-type-cell[data-row="'+row+'"] .fa-plus').addClass('active');
              }
            }
          })
        })
      }
    }

    function priceGridDD() {

      $('.moreInfo-bttn').click(function(e){
        e.preventDefault();
        var cat = $(this).closest('.grid-item').attr('data-cat');
        var targetInner = $(this).closest('.pricing-grid').find('.dropdown-inner[data-cat='+cat+']');
        var targetWrap = targetInner.closest('.dropdown-container');

        // Dropdown is already active with current category
        if (targetWrap.attr('data-active-cat') == cat) {
          targetWrap.slideUp().attr('data-active-cat',null);
          targetInner.hide();
        }

        // Dropdown is already active with other category in same row
        else if (targetWrap.attr('data-active-cat') != cat && targetWrap.attr('data-active-cat') != null ) {
          targetWrap.slideUp(400);
          setTimeout(function(){
            targetWrap.find('.dropdown-inner').hide();
            targetInner.show();
            targetWrap.slideDown().attr('data-active-cat',cat);
          },400);
        }

        // Dropdown is not active
        else if (targetWrap.attr('data-active-cat') == null) {
          targetInner.show().siblings().hide();
          targetWrap.slideDown().attr('data-active-cat',cat);
        }
      })
    }

    priceTableDD();
    priceGridDD();

    $('.pricing-grid').find('.gallery').slick({
      autoPlay:true,
      autoplaySpeed:2000
    });

    $('.bookNow-bttn').each(function(index,el){
      if ($(el).closest('a').attr('href') == '#') {
        $(el).addClass('no-link');
      }
    });

    // $('.pricing-grid .grid-item').each(function(index,item){
    //   $(item).find('.button-container a').each(function(index,bttn){
    //     if ($(bttn).height() > 45) {
    //       $(item).find('.button-container').addClass('two-rows');
    //       return 2;
    //     }
    //   })
    // })
  }

  // Highlight Filters
  $('#highlights-filter .button').click(function(){
    var active = $(this).hasClass('isActive');
    if (!active) {
      $(this).addClass('isActive').siblings('ul').slideDown();
    } else {
      $(this).removeClass('isActive').siblings('ul').slideUp();
    }
  })

  $('#highlights-filter a').click(function(){
    var target = $(this).find('li').text();
    $('#highlights-filter .button').html(target + ' <i class="far fa-arrow-alt-circle-right"></i>').removeClass('isActive');
    $('#highlights-filter ul').slideUp();
  })

  function galleryDropdown(){
    var target;
    $('.photographer').click(function(e){
      target = $(this).attr('data-photographer');

      $('.dropdown-container').each(function(index,el){
        if ($(el).attr('data-photographer') == target) {
          if ($(el).hasClass('active')) {
            $(el).removeClass('active').slideUp();
          } else {
            $(el).addClass('active').slideDown();
          }
        }
        else {
          $(el).removeClass('active').slideUp();
        }
      })
    });
  }

  // Smugmug gallery
  function smugmugGallery(){

    var api = 'JFvmsDjtXM4qGfpbhFsMh4sz5CBBqXnw';
    if ($('.smugmug-gallery').length > 0) { // if galleries exist
      $('.smugmug-gallery').each(function(index,el){
        var key = $(this).attr('data-key');
        var grid = $('[data-key="'+key+'"]');
        var data = $('#grid-data-'+key);
        var imageUrls = [];

        data.find('span').each(function(index,imageData){
          var url = $(imageData).attr('data-imgurl');
          imageUrls.push(url);
        });

        function lightboxInit() {
          $(el).find('.grid-item a').click(function(e){
            e.preventDefault();
            var index = $(this).attr('data-index');

            var swipboxArr = [];
            var i=0;
            imageUrls.forEach(function(item){
              swipboxArr[i] = { href:item, title:'' };
              i++;
            });

            $.swipebox(swipboxArr, {
              initialIndexOnArray: index
            });
          })
        }

        function buildMarkup(start,end) {
          var i=start;
          data.find('span').each(function(index,img){
            if (i<= end && index==i){
              var url = $(img).attr('data-imgUrl');
              var gridItem = '<div class="grid-item"><a href="'+url+'" data-index="'+index+'" rel="gallery-'+key+'"><div class="grid-item-image" style="background-image:url('+url+')"></div></a></div>';
              grid.append(gridItem);
              i++;
            } else {grid.attr('data-imageCount',end+1)}
          });

          lightboxInit();
        }

        function buildData() {
          var dataMarkup = $('<div class="data" id="grid-data-'+key+'"></div>');
          imageUrls.forEach(function(imageUrl){
            $(dataMarkup).append('<span data-imgUrl="'+imageUrl+'"></span>');
          });

          $(el).append(dataMarkup);
          buildMarkup(0,8);
        }

        $(el).siblings('a').click(function(e){
          e.preventDefault();
          var start = $(el).attr('data-imageCount');
          var end = Number(start) + 8;
          if (end >= imageUrls.length) {
            $(this).css('display','none');
          }
          buildMarkup(start,end);
        })

        buildMarkup(0,8);

      });
    }
  }

  // FAQs
  function faqInit() {
    $('.faq-row').click(function(){
      var slug = $(this).attr('data-slug');
      if ($(this).hasClass('active')) {
        $(this).find('.dropdown-container').slideUp(300);
      } else {
        $(this).find('.dropdown-container').slideDown(300);
      }
      $(this).toggleClass('active');
    })

    function toggleFAQ(slug) {
      $('.faq-row').each(function(index,el){
        var cats = $(el).attr('data-category').split(',');
        var i; for (i=0;i<cats.length;i++) {
          fadeMe = true;
          cats[i] = cats[i].trim().replace(' ','-').toLowerCase();
          if (cats[i] == slug) { fadeMe = false; }
        }
        if (fadeMe == true) {
          if ($(el).css('display') != 'none') {
            $(el).fadeTo(300,0);
            setTimeout(function(){$(el).css('display','none') },300);
          }
        } else { setTimeout(function(){ $(el).css('display','block').fadeTo(300,1); },300) }
      });
    }

    function getDefault() {
      var slug = $('#faq-filters a').first().attr('data-slug');
      $('#faq-filters a').first().addClass('active');
      return slug;
    }

    $('#faq-filters a').click(function(e){
      e.preventDefault();
      var slug = $(this).attr('data-slug');
      $(this).addClass('active').siblings('a').removeClass('active');
      toggleFAQ(slug);
    })

    toggleFAQ(getDefault() );
  }

  function formsInit() {
    $('form label').each(function(index,el){
      var text = $(el).text();
      $(el).text(text.replace('(required)','*'));
    })
  }

  function instaLightbox() {
    $('#sbi_images').click(function(e){
      e.preventDefault();
    });

    var instaImg = [];

    function setLightbox() {
      if ($('.sbi_photo').length > 0) {

        $('.sbi_photo').each(function(index,el){
          var img = $(el).css('background-image');
          img = img.replace('url("','').replace('")','');
          instaImg.push(img);
        })
      } else {
        setTimeout(function(){ setLightbox() },100);
      }
    }

    function doLightbox() {
      // $('.sbi-photo').click(function(){
      //   if (instaImg.length > 0) {
      //     $.swipebox(instaImg);
      //   }
      // })
    }

    setLightbox();
    doLightbox();

  }

  function gdprInit() {
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }

    if (getCookie('c9_gdpr_accept') != 'yes' && getCookie('c9_gdpr_accept') != 'no') {
      setTimeout(function(){
        $('#gdpr-wrap').addClass('slide');
      },1000);
    }

    $('#accept-gdpr').click(function(){
      setCookie('c9_gdpr_accept','yes', 30);
      $('#gdpr-wrap').removeClass('slide');

      $.ajax({
        type:'POST',
        url: ajax_object.ajax_url,
        data: {
          action:'get_gdpr_scripts',
          nonce: ajax_object.gdpr_nonce
        },
        success: function(res) {
          console.log(res);
         $('head').append(res.data.gdpr_head);
         $('body').prepend(res.data.gdpr_body_end);
        },
        error: function(err) {
          console.log('AJAX FAILED:',err);
        }
      })
    });

    $('#decline-gdpr').click(function(){
      setCookie('c9_gdpr_accept','no', 1);
      $('#gdpr-wrap').removeClass('slide');
    })
  }

  function deckPlansInit() {

    if ($('.deck-map-data').length > 0 ) {

      var $cross = $('#deck-cross-section-inner');
      var $map = $('#deck-map-inner');
      var $mapImg = $('#deck-map-img img');
      var $first = $('.deck-map-data').first();

      const map = document.getElementById('deck-map-inner')
      const zoomMap = Panzoom(map, {
        maxScale:5
      });

      function makeActive(num) {
        $('.deck-plans-nav-box').each(function(index,el){
          if ($(el).attr('data-number') == num) {
            $(el).addClass('active');
            $(el).siblings().removeClass('active');

            $('.deck-map-data').each(function(index,el){
              if ( $(el).attr('data-number') == num) {
                $cross.css('background-image','url("'+$(el).attr('data-cross')+'")');
                $map.css('background-image','url("'+$(el).attr('data-map')+'")');
                $mapImg.attr('src',$(el).attr('data-map-mobile'));
                if (typeof zoomMap !== 'undefined') {
                  zoomMap.reset({ animmate: false })
                }
              }
            })
          }
        });
      }

      makeActive($first.attr('data-number'));

      var $zoomInBttn = $('#deck-map-nav .fa-plus-square');
      var $zoomOutBttn = $('#deck-map-nav .fa-minus-square');
      var $panLeft = $('#deck-map-nav-pan .fa-caret-square-left');
      var $panUp = $('#deck-map-nav-pan .fa-caret-square-up');
      var $panDown = $('#deck-map-nav-pan .fa-caret-square-down');
      var $panRight = $('#deck-map-nav-pan .fa-caret-square-right');

      console.log($('#deck-map-inner'));

      // $('#deck-map-inner').panzoom({
      //   $zoomIn: $zoomInBttn,
      //   $zoomOut: $zoomOutBttn
      // });

      $panRight.click(function(){
        zoomMap.pan(-50,0,{animate:true,relative:true});
        // $map.panzoom('pan',-50,0,{animate:true,relative:true})
      });

      $panLeft.click(function(){
        zoomMap.pan(50,0,{animate:true,relative:true});
      });

      $panDown.click(function(){
        zoomMap.pan(0,-50,{animate:true,relative:true});
      });

      $panUp.click(function(){
        zoomMap.pan(0,50,{animate:true,relative:true});
      });

      $zoomInBttn.click(function(){
        zoomMap.zoomIn();
      });

      $zoomOutBttn.click(function(){
        zoomMap.zoomOut();
      });

      $('.deck-plans-nav-box').click(function(){
        var num = $(this).find('span').text();
        makeActive(num);
      })

      $('#deck-plans-nav-mobile .button').click(function(){
        if ($(this).hasClass('active') == false ) {
          $(this).siblings('ul').slideDown();
          $(this).addClass('active');

          $(this).siblings('ul').find('li').click(function(){
            var newNum = $(this).attr('data-number')
            makeActive(newNum);
            $('#deck-plans-nav-mobile .button').html('Deck '+newNum+' <i class="far fa-arrow-alt-circle-right"></i>');
            $('#deck-plans-nav-mobile .button').removeClass('active').siblings('ul').slideUp();
          })
        } else {
          $(this).siblings('ul').slideUp();
          $(this).removeClass('active');
        }
      })

      // $(window).resize(function(){
      //   if ($(window).width() < 756) {
      //     $map.panzoom({
      //       disablePan:true,
      //       disableZoom:true
      //     })
      //   }
      // })
    }
  }

  function buildSchedule() {

    if ($('.schedule').length > 0){
      $('.schedule').each(function(index,el){
        if ($(el).find('.step').length > 0) {
          // get step height for schedule
          var step = $(el).find('.step').first().css('height').slice(0,2);
          var border = $(el).find('.step').first().css('border-top-width').slice(0,1);
          // console.log(border);
          // build blocks

          if ($(el).find('.schedule-block').length > 0) {
            $(el).find('.schedule-block').each(function(b,block){
              var top = $(block).attr('data-top');
              var height = $(block).attr('data-height');

              $(block).css('height',(step * height) + Number(border) + 'px').css('top',(step * top) - Number(border) + 'px');
            })
          }
        }
      })
    }
  }

  function toggleSchedules() {
    var fadeTime = 150;

    $('.schedule-tab').click(function(){
      var id = $(this).attr('data-schedule');

      $('.schedule').each(function(index,el){
        // tests if schedule matches and isn't active
        if ($(el).attr('data-schedule') == id && $(el).css('display') != 'flex') {

          // searches for active schedule and fades out
          $(el).siblings('.schedule').each(function(index,sib){
            if ($(sib).css('display') == 'flex') {
              $(sib).removeClass('active-sched');
              $(sib).fadeTo(fadeTime,0);
              setTimeout(function(){ $(sib).css('display','none')},fadeTime);
            }
          })

          // fades in newly active schedule
          setTimeout(function(){
            $(el).addClass('active-sched').css('display','flex').fadeTo(fadeTime,0.97);
          },fadeTime)
        }
      })

      $('.schedule-header').each(function(index,el){
        // tests if schedule matches and isn't active
        if ($(el).attr('data-schedule') == id && $(el).css('display') != 'block') {

          // searches for active schedule and fades out
          $(el).siblings('.schedule-header').each(function(index,sib){
            if ($(sib).css('display') == 'block') {
              $(sib).fadeTo(fadeTime,0);
              setTimeout(function(){ $(sib).css('display','none')},fadeTime);
            }
          })

          // fades in newly active schedule
          setTimeout(function(){
            $(el).css('display','block').fadeTo(fadeTime,1);
          },fadeTime)
        }
      })
    })
  }

  function filterSchedule() {

    function doFilter(){
      // init empty array of blocks to filter
      var filters = [];

      // determines filter params
      $('.schedule-filter').each(function(index,el){
        if ($(el).attr('checked')) {
          filters.push($(el).attr('name'));
        }
      });

      var $blocks = $('.schedule-block');
      // init empty array of blocks to fade in
      var $toFadeIn = [];

      filters.forEach(function(f){
        $blocks.each(function(index,el){
          if ($(el).attr(f) == 1) {
            $toFadeIn.push($(el).attr('id'));
          }
        })
      });

      // init array of all blocks to compare against "fade out" array
      var $toFadeOut = [];
      $blocks.each(function(index,el){
        $toFadeOut.push($(el).attr('id'));
      })

      // compare arrays, yields array of blocks to NOT fade in ie fade out
      $toFadeIn.forEach(function(el){
        for (i=0;i<$toFadeOut.length;i++) {
          if ($toFadeOut[i] == el) {
            $toFadeOut.splice(i,1);
            // console.log('Removed from array');
          }
        }
      });

      // do fades
      $toFadeOut.forEach(function(el){
        $('#' + el).fadeTo(300,0);
      });

      $toFadeIn.forEach(function(el){
        $('#'+el).fadeTo(300,0.97);
      });
    }

    $('.schedule-filter').change(function(){
      doFilter();
    });

    doFilter();

  }

  function scheduleMobile() {
    var ul = $('.schedule-col-dropdown ul');
    var li = $('.schedule-dropdown-item');
    var button = $('.dropdown-button');

    button.click(() => {
      if (ul.css('display') == 'block') {
        ul.slideUp();
      } else { ul.slideDown() }
    })

    li.click(function(){
      var target = $(this).attr('data-col');
      var text = $(this).text();
      var cols = $('.active-sched').find('.schedule-col');

      button.find('span').html(text + '<i class="fas fa-caret-down"></i>');
      cols.each(function(index,el){
        if ($(el).attr('data-col') == target && $(el).css('display') != 'block') {

          $(el).siblings().fadeTo(100,0);

          setTimeout(function(){
            $(el).siblings().css('display','none');
            $(el).css('display','block').fadeTo(100,0.97);
          },100);
        }
      })

      ul.slideUp();

    });

    // show all cols if screen is returned back to desktop view
    var flag = false;
    var cols = $('.schedule-col');

    $(window).resize(function(){
      var w = $(window).width();

      if (w < 800) { flag = true; cols.removeClass('showMe'); }
      if (flag == true && w > 800) {
        cols.addClass('showMe');
        flag = false;
      }
    })
  }

  // Animations
  function animations() {
    // $(window).scroll(function(){
    //   var scrollTop = $(window).scrollTop();
    //
    //   var countdown = $('#fp-countdown-inner');
    //   if (countdown.length > 0) {
    //     // console.log(scrollTop + 50,countdown.offset().top);
    //     if (scrollTop + 300 >= countdown.offset().top) {
    //       countdown.addClass('zoomMe');
    //     }
    //   }
    // })

    if ($('.parallax-window').length > 0) {
      var img = $('.parallax-window').attr('data-image-src');
      $('#parallax-mirror').css('background-image','url("' + img + '")');
    }
  }

  function getRoadblock() {
    if ($('#rb-inner').children().length == 0) {
      console.log('fired');
      $.ajax({
        url:window.location.href + '/roadblock/'
      }).done(function(data){
        console.log('ajax success');
        var $content = $(data);
        console.log($content);
        $('#rb-inner').append($content);
      }).fail(function(jw,textStatus){
        $('#rb-inner').html('<h3>Whoops. There was an error: '+textStatus+'</h3>');
      })
    }
  }

  function info__search() {
    $('form.search-form').submit(function(e){
      e.preventDefault();
    });

    var inputTimer = true;
    $('form.search-form').on('input',function(e){
      e.preventDefault();

      var info_s = $('input.search-field').val().trim().toLowerCase();

      var found = false;

      $('#no-search-found').addClass('hideMe');

      var parent = [];
      $('.component').each(function(index,component) {
          var title = $(component).find('.component-title').text().toLowerCase();
          var copy = $(component).find('.component-copy').text().toLowerCase();

          // console.log(title,copy,info_s);

          if (title.indexOf(info_s) == -1 && copy.indexOf(info_s) == -1 ) {
            $(component).hide(200);
            console.log('Not Found: ',info_s)
          } else {
            $(component).show(200);
            var thisParent = $(component).parents('article').attr('data-info-page');
            // console.log(thisParent);
            parent.push(thisParent);
            found = true;
          }
      } );

      // console.log(parent);

      $('main h3').each(function(index,el){
        var thisParent = $(el).parents('article').attr('data-info-page');
        if (parent.includes(thisParent) ) {
          $(this).show(200);
        } else {
          $(this).hide(200);
        }
      });

      $('main article').each(function(index,el){
        if (parent.includes($(this).attr('data-info-page') ) ) {
          $(this).show();
        } else {
          $(this).hide();
        }
      })

      // $('.component').not('.hideMe').fadeIn(300);

      if (!found) {
        // $('#no-search-found').fadeIn(300);
        $('#no-search-found').removeClass('hideMe');
      }

    });

    $('#info-sidebar .menu-title').click(function(e){
      if ($(this).find('h3').hasClass('active') ) {
        $(this).siblings('ul').slideUp();
      } else {
        $(this).siblings('ul').slideDown();
      }

      $(this).find('h3').toggleClass('active');
    })

    if ($(window).width() < 768) {
      $(window).scroll(function() {
        $title = $('#info-sidebar .menu-title h3');
        if ($('#info-sidebar .menu-title h3').hasClass('active') ) {
          $title.parent().siblings('ul').slideUp();
          $title.removeClass('active');
        }
      })
    }



    $('.info-item-has-children').click(function(e){
      var title = $(this).text();
      if ($(this).hasClass('active') ) {
        $(this).siblings('.info-sub-menu[data-parent="' + title + '"]').slideUp();
      } else {
        $(this).siblings('.info-sub-menu[data-parent="' + title + '"]').slideDown();
      }

      $(this).toggleClass('active');

    })

    if ($('.page-template-infopages main article').length > 0) {

      var infoMainOffset = $('.page-template-infopages main article').first().offset().top;
      announcementBarHeight = Number(stickyH['announcementH']);
      navBarHeight = Number(stickyH['navH']);
      booknowH = Number(stickyH['booknowbarH']);

      $('.info-sub-menu .info-item a').click(function(e) {
        e.preventDefault();
        var anchor = $(this).attr('href');
        $('main .component').show(200);
        $('input.search-field').attr('value','');

        setTimeout(function(){
          var target = $(anchor).offset().top;
          $("html, body").animate({ scrollTop: target - (announcementBarHeight + navBarHeight + booknowH + 60) }, 500);
        },200);
      });
    }
  }

  $('.gallery .slick-arrow').click(function(e){
    e.stopPropagation();
  })

  if ($('.mc4wp-response').length > 0) {
    setTimeout(function(){
      $('.mc4wp-response').fadeTo(400,0)
    },5000);
  }

  if ($('#roadblock').length > 0) {
    formatVideos();
    // getRoadblock();
    exitRB();
  } else {
    faqInit();
    // instaLightbox();
    gdprInit();
    // lineupCard();
    formatVideos();
    // formatButtons();
    galleryDropdown();
    // smugmugGallery()
    sticky();
    // navElVisibility();
    loadMoreNews();
    pricingModule();
    mobileButtons();
    countdown();
    cta_rollOver();
    formatSignup();
    formatComponents();
    navScripts();
    deckPlansInit();
    buildSchedule();
    toggleSchedules();
    filterSchedule();
    scheduleMobile();
    animations();
    info__search();
  }

  if ($('.overlay').length > 0) {
    $('body').addClass('noScroll');
  }

  // if ($('#announcement-bar').length > 0 ) {
  //   var h = $('#announcement-bar').height();
  //   $("#social-bar").css('top',h).css('min-height',h);
  // }

  $(window).resize(function(){
      // centerButtons();
      mobileButtons();
      formatComponents();
      // navElVisibility();
  })

  // $('#testMe').modal();
  $('.modal .btn-nav').click(function(e){
    var target = $(this).attr('data-bs-target');
    $('.modal.show').modal('hide').on('hidden.bs.modal',function(e) {
      $(target).modal();
      $(this).off('hidden.bs.modal');
    })
  })

})
