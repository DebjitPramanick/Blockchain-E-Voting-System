App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider);
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  // init: async function() {
  //   // Load pets.
  //   $.getJSON('../pets.json', function(data) {
  //     var petsRow = $('#petsRow');
  //     var petTemplate = $('#petTemplate');

  //     for (i = 0; i < data.length; i ++) {
  //       petTemplate.find('.panel-title').text(data[i].name);
  //       petTemplate.find('img').attr('src', data[i].picture);
  //       petTemplate.find('.pet-breed').text(data[i].breed);
  //       petTemplate.find('.pet-age').text(data[i].age);
  //       petTemplate.find('.pet-location').text(data[i].location);
  //       petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

  //       petsRow.append(petTemplate.html());
  //     }
  //   });

  //   return await App.initWeb3();
  // },

  initContract: async function () {
    const election = await(await fetch('Election.json')).text()
    console.log(JSON.parse(election))
    App.contracts.Election = TruffleContract(JSON.parse(election))
    App.contracts.Election.setProvider(App.web3Provider)
    App.election = await App.contracts.Election.deployed()
    return App.render();
  },

  render: async function () {
    var electionInstance;

    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance
      return electionInstance.candidateCounts()
    }).then(function (candidateCounts) {
      // var candidatesResults = document.getElementById('candidateResults')

      var candidatesRow = document.getElementById('candidatesRow')
      var candidateTemplate = document.getElementById('candidateTemplate')

      for (var i = 0; i < candidateCounts; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var votes = candidate[2];

          let title = document.getElementById('panel-title')
          title.innerText = name
          // candidateTemplate.childNodes.item('.cand-ID').innerText(id)
          // candidateTemplate.childNodes.item('.cand-name').innerText(name)
          // candidateTemplate.childNodes.item('.cand-votes').innerText(votes)

          candidatesRow.append(candidateTemplate);


        })
      }
    })
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
