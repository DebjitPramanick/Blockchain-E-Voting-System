pragma solidity >=0.4.22 <0.8.0;

contract Election{

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    
    mapping (uint => Candidate) public candidates;
    uint public candidateCounts;
    
    constructor() public {
        addCandidate("Debjit");
        addCandidate("Rohan");
    }
    
    function addCandidate(string memory _name) public {
        candidates[candidateCounts] = Candidate(candidateCounts, _name, 0);
        candidateCounts++;
    }
    
    function getCandidate(uint _id) view public returns (uint, string memory, uint){
        return (candidates[_id].id, candidates[_id].name, candidates[_id].voteCount);
    }
    
    function giveVote(uint _id) public {
        uint vt = candidates[_id].voteCount;
        vt += 1;
        candidates[_id].voteCount = vt;
    }
}