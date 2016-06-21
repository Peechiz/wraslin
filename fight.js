
$(function(){
  var round = 0;
  var keys = 'abcdefghij'.toUpperCase().split('');

  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx,{
    type: 'bar',
    data: {
      labels: keys,
      datasets: [{
        label: 'opponent move frequency',
        data: [0,0,0,0,0,0,0,0,0,0],
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

  var chartData = myChart.data.datasets[0].data;

  // only to be used in conjunction with moveData object
  function updateChart(arr){
    for (var i = 0; i < arr.length; i++) {
      chartData[i] = arr[i];
    }
    myChart.update()
  }

  // fill the moves reference chart
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
  });

  var moveData = {
    get: function(){
      var data = [];
      keys.forEach( key =>{
        data.push(moveData.opponent[key])
      })
      return data;
    },
    put: function(move){
      moveData.opponent[move]++
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

  function outcome(X,Y){
    if (X === Y) {
      return ''
    }
    var isSuccess = false;
    moves[X].beats.forEach(move =>{
      if (Y === move){
        isSuccess = true;
      }
    })
    if (isSuccess){
      return 'success'
    }
    else {
      return 'danger'
    }
  }

  function updateTable(playerMove,opponentMove){
    var rowClass = outcome(playerMove,opponentMove);
    $('#moveTable tbody').append(`<tr class="${rowClass}"><td>${round}</td><td>${playerMove}</td><td>${opponentMove}</td></tr>`);
    round++;
  }

  //console.log('opponent data',moveData.get());


  var game;
  var signature;
  var roundsRemain = $('#roundsRemaining');
  var score = $('#score');
  var fightType;

  $('#choose').click(ev=>{
    ev.preventDefault();
    fightType = $('#fight').val();
    var id = $('#opponent').val();
    var opponent = opponents[id].slug;

    $('#opponentName').text( opponents[id].name );

    $('#fight').attr('disabled','true');
    $('#opponent').attr('disabled','true');
    $('#choose').addClass('hidden');
    $('#controls').removeClass('hidden').addClass('show');

    // get initial game state
    $.ajax({
      method:"POST",
      url:`http://dax-cors-anywhere.herokuapp.com/https://umbelmania.umbel.com/${fightType}/`,
      dataType: 'json',
      data: {
        "player_name": "Chris Impicciche",
        "opponent": opponent,
        "email": "cimpicci@gmail.com"
      }
    }).done(function(data){
      console.log('initial state received');
      game = data.gamestate;
      roundsRemain.text(game.moves_remaining);
      score.text(game.total_score);
      signature = data.signature;
    });
  })


  function Pattern(pattern,gameState){
    if (pattern.length){
      console.log('Move:',pattern[0]);
      $.ajax({
        method:"POST",
        url:`http://dax-cors-anywhere.herokuapp.com/https://umbelmania.umbel.com/${fightType}/`,
        dataType: 'json',
        data: {
          gamestate: gameState,
          move: pattern[0],
          signature: signature
        }
      }).done(function(data){
        console.log('newGameState',data,'last signature:',signature);
        gameState = data.gamestate;
        signature = data.signature;

        // update headings
        roundsRemain.text(gameState.moves_remaining);
        score.text(gameState.total_score);

        // update table
        // update chart

        if (pattern) {
          return Pattern(pattern.slice(1), gameState)
        }
      });
    }
    else {
      console.log('Finished move pattern');
    }

  }

  $('#submit').click(ev=>{
    ev.preventDefault();
    //setup?
    console.log('signature: ',signature);
    console.log('initial gamestate: ', game);


    // get pattern
    var pattern = $('#pattern').val().toUpperCase().split('');
    var calls = parseInt($('#calls').val()) || 1;
    console.log('pattern: ',pattern);
    console.log('number of calls: ',calls);
    Pattern(pattern,game);
  })

})
