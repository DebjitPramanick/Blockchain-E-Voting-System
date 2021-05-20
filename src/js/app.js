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
    window.ethereum.enable().then(accounts => {
      App.account = accounts[0]
    })

    return App.initContract();
  },

  initContract: async function () {
    const election = await (await fetch('Election.json')).text()
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

      var candidatesRow = document.getElementById('candidatesRow')
      var candidateTemplate = document.getElementById('candidateTemplate')

      for (var i = 1; i <= candidateCounts; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var votes = candidate[2];

          let cndTmplt = candidateTemplate.cloneNode(true)

          let fields = cndTmplt.querySelectorAll(".field")
          fields[0].innerHTML = name
          fields[1].innerHTML = id
          fields[2].innerHTML = name
          fields[3].innerHTML = votes
          fields[4].setAttribute("data-id", id);

          cndTmplt.style.display = "block"

          candidatesRow.append(cndTmplt);
        })
      }
      return electionInstance.voters(App.accout);
    }).then(function (hasVoted) {
      if (hasVoted) {
        let btn = cndTmplt.querySelectorAll(".btn-vote")
        btn[0].style.display = "none"
      }
    })
  },

  vote: async function (e) {
    var candId = Number(e.target.dataset['id'])
    App.contracts.Election.deployed().then(function (instance) {
      return instance.giveVote(candId, { from: App.account });
    }).then(function (res) {
      console.log(res)
      window.location.reload()
    }).catch(function (err) {
      console.log(err)
    })
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
