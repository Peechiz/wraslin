
$(function(){
  var keys = 'abcdefghij'.toUpperCase().split('');

  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx,{
    type: 'bar',
    data: {
      labels: keys,
      datasets: [{
        label: 'opponent move frequency',
        data: [1,2,3,4,5,50,7,8,9,10],
        backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
        borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
        borderWidth: 1
      }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  })

  // TODO add function to check result of round, color tablerow appropriately

  var fightType = $('#fight').val()
  $('#fight').change( ev=>{
    ev.preventDefault();
    fightType = $('#fight').val();
  })


  keys.forEach(key => {
    $('#moveRef tbody').append(`<tr><td>${key}</td><td>${moves[key].name}</td><td>${moves[key].beats}</td></tr>`)
  })

  var post = {
    "opponent": opponents[0].name,
    "player_name": "Chris Impicciche",
    "email": "cimpicci@gmail.com"
  }

  function randoWord(){
    var letters = []
    var getIndex = () => {
      return Math.round(Math.random()*10)
    }
    for (var i = 0; i < keys.length; i++) {
      letters.push(keys[getIndex()])
    }
    return letters.join('');
  }

  $('#rando').click( (ev) => {
    ev.preventDefault();
    $('#pattern').attr('value', randoWord())
  })

  var moves = {
    get: function(player){
      var data: [];
      keys.forEach( key =>{
        data.push(this[player][key])
      })
      return data;
    },
    player: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0
    },
    opponent: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0
    },
  }

  $('#submit').click(ev=>{
    ev.preventDefault();

    // get pattern
    var pattern = $('#pattern').val().toUpperCase().split('');
    var calls = parseInt($('#calls').val()) || 1;
    console.log('pattern: ',pattern);
    console.log('number of calls: ',calls);

    for (var i = 0; i < calls; i++) {

      console.log('call#',i);
      for (var j = 0; j < pattern.length; j++) {
        var move = pattern[j]
        console.log(move);
      }
      // for each move in a pattern, make a post request with the associated player move

      //on receiving opponent move, update

    }

    // post = $.ajax({
    //   method:"GET",
    //   url:`https://umbelmania.umbel.com/${fightType}/`,
    // }).done(function(data){
    //   data.
    // });
  })


})
