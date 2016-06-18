
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

  $('#choose').click(ev=>{
    ev.preventDefault();
    fightType = $('#fight').val();
    $('#fight').attr('disabled','true');
    $('#choose').addClass('hidden');
    $('#controls').removeClass('hidden').addClass('show');
    // get initial game state
    var game = $.ajax({
      method:"POST",
      url:`https://umbelmania.umbel.com/${fightType}/`,
      body: post
    }).done(function(data){

    });
  })

  $('#submit').click(ev=>{
    ev.preventDefault();

    // get pattern
    var pattern = $('#pattern').val().toUpperCase().split('');
    var calls = parseInt($('#calls').val()) || 1;
    console.log('pattern: ',pattern);
    console.log('number of calls: ',calls);

    // define promise array?

    for (var i = 0; i < calls; i++) {

      console.log('call#',i);
      for (var j = 0; j < pattern.length; j++) {
        var move = pattern[j]
        console.log(move);
        // for each move in a pattern, make a post request with the associated player move
      }

      //on receiving opponent move, update the graph and the #moveTable
      //
      //  ^ updateChart( moveData.get() )

    }

    // post = $.ajax({
    //   method:"GET",
    //   url:`https://umbelmania.umbel.com/${fightType}/`,
    // }).done(function(data){
    //   data.
    // });
  })

  // console.log('updating table A G, B E, J C');
  // updateTable('A','G');
  // updateTable('B','B');
  // updateTable('J','C');

})
