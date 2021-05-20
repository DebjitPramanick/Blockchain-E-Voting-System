pragma solidity >=0.4.22 <0.8.0;

contract Election{

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    
    mapping (address => bool) public voters;
    mapping (uint => Candidate) public candidates;
    uint public candidateCounts;
    
    constructor() public {
        addCandidate("Debjit");
        addCandidate("Rohan");
    }
    
    function addCandidate(string memory _name) public {
        candidateCounts++;
        candidates[candidateCounts] = Candidate(candidateCounts, _name, 0);
    }
    
    function getCandidate(uint _id) view public returns (uint, string memory, uint){
        return (candidates[_id].id, candidates[_id].name, candidates[_id].voteCount);
    }
    
    function giveVote(uint _id) public {
        require(!voters[msg.sender]);
        require(_id > 0 && _id <= candidateCounts);
        voters[msg.sender] = true;
        candidates[_id].voteCount++;
    }
}