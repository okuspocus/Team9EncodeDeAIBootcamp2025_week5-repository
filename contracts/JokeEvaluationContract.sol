// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title JokeEvaluationContract
 * @dev Implements a zero-knowledge offensive joke penalty system using the Optimistic ML approach
 * Based on concepts from Encode Club AI Bootcamp DeAI course (Lessons 17-20)
 */
contract JokeEvaluationContract {
    // Token for reputation and penalties
    string public name = "Joke Evaluation Token";
    string public symbol = "JET";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18; // 1 million tokens

    // Mapping of address to token balance
    mapping(address => uint256) public balanceOf;
    
    // Mapping of address to reputation score (0-100)
    mapping(address => uint256) public reputationOf;
    
    // Mapping of joke hash to evaluation status
    mapping(bytes32 => JokeStatus) public jokeStatus;
    
    // Mapping of joke hash to stake amount
    mapping(bytes32 => uint256) public jokeStake;
    
    // Mapping of joke hash to creator address
    mapping(bytes32 => address) public jokeCreator;
    
    // Mapping of joke hash to challenge status
    mapping(bytes32 => bool) public jokeChallenged;
    
    // Challenge period duration in seconds (1 day)
    uint256 public constant CHALLENGE_PERIOD = 1 days;
    
    // Minimum stake required to submit a joke
    uint256 public minStake = 10 * 10**18; // 10 tokens
    
    // Structure to track joke status
    struct JokeStatus {
        bool exists;
        uint256 timestamp;
        bool finalized;
        bool offensive;
    }
    
    // Events
    event JokeSubmitted(bytes32 indexed jokeHash, address indexed creator, uint256 stake);
    event JokeChallenged(bytes32 indexed jokeHash, address indexed challenger);
    event JokeFinalized(bytes32 indexed jokeHash, bool offensive);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    
    /**
     * @dev Constructor that gives the deployer all initial tokens
     */
    constructor() {
        balanceOf[msg.sender] = totalSupply;
        reputationOf[msg.sender] = 50; // Start with neutral reputation
    }
    
    /**
     * @dev Submit a joke hash with a stake
     * @param jokeHash The hash of the joke content (created off-chain)
     * @param proofHash The hash of the zero-knowledge proof that the joke is not offensive
     */
    function submitJoke(bytes32 jokeHash, bytes32 proofHash) external {
        // Require minimum stake based on reputation
        uint256 requiredStake = getRequiredStake(msg.sender);
        require(balanceOf[msg.sender] >= requiredStake, "Insufficient balance for stake");
        
        // Ensure joke doesn't already exist
        require(!jokeStatus[jokeHash].exists, "Joke already submitted");
        
        // Transfer stake from user to contract
        balanceOf[msg.sender] -= requiredStake;
        
        // Record joke submission
        jokeStatus[jokeHash] = JokeStatus({
            exists: true,
            timestamp: block.timestamp,
            finalized: false,
            offensive: false
        });
        
        jokeStake[jokeHash] = requiredStake;
        jokeCreator[jokeHash] = msg.sender;
        
        emit JokeSubmitted(jokeHash, msg.sender, requiredStake);
    }
    
    /**
     * @dev Challenge a joke as offensive during the challenge period
     * @param jokeHash The hash of the joke being challenged
     * @param challengeProofHash The hash of the zero-knowledge proof that the joke is offensive
     */
    function challengeJoke(bytes32 jokeHash, bytes32 challengeProofHash) external {
        // Ensure joke exists and is within challenge period
        require(jokeStatus[jokeHash].exists, "Joke does not exist");
        require(!jokeStatus[jokeHash].finalized, "Joke already finalized");
        require(block.timestamp <= jokeStatus[jokeHash].timestamp + CHALLENGE_PERIOD, "Challenge period expired");
        
        // Require challenger to have minimum reputation
        require(reputationOf[msg.sender] >= 20, "Insufficient reputation to challenge");
        
        // Mark joke as challenged
        jokeChallenged[jokeHash] = true;
        
        emit JokeChallenged(jokeHash, msg.sender);
    }
    
    /**
     * @dev Finalize a joke after challenge period or after verification
     * @param jokeHash The hash of the joke to finalize
     * @param isOffensive Whether the joke was determined to be offensive
     * @param verificationProof The proof of verification (can be empty for unchallenged jokes)
     */
    function finalizeJoke(bytes32 jokeHash, bool isOffensive, bytes memory verificationProof) external {
        // Ensure joke exists and is not finalized
        require(jokeStatus[jokeHash].exists, "Joke does not exist");
        require(!jokeStatus[jokeHash].finalized, "Joke already finalized");
        
        // If joke was not challenged and challenge period expired, finalize as not offensive
        if (!jokeChallenged[jokeHash] && block.timestamp > jokeStatus[jokeHash].timestamp + CHALLENGE_PERIOD) {
            _finalizeJoke(jokeHash, false);
            return;
        }
        
        // If joke was challenged, require verification proof
        require(jokeChallenged[jokeHash], "Joke not challenged");
        require(verificationProof.length > 0, "Verification proof required for challenged joke");
        
        // In a real implementation, we would verify the proof here
        // For this example, we'll accept the provided offensive status
        
        _finalizeJoke(jokeHash, isOffensive);
    }
    
    /**
     * @dev Internal function to finalize a joke
     * @param jokeHash The hash of the joke to finalize
     * @param isOffensive Whether the joke was determined to be offensive
     */
    function _finalizeJoke(bytes32 jokeHash, bool isOffensive) internal {
        // Update joke status
        jokeStatus[jokeHash].finalized = true;
        jokeStatus[jokeHash].offensive = isOffensive;
        
        address creator = jokeCreator[jokeHash];
        uint256 stake = jokeStake[jokeHash];
        
        // Handle reputation and stake based on outcome
        if (isOffensive) {
            // Joke is offensive: creator loses stake and reputation
            // Stake is distributed to challengers or burned
            
            // Update creator's reputation (decrease)
            uint256 newReputation = reputationOf[creator] > 10 ? reputationOf[creator] - 10 : 0;
            reputationOf[creator] = newReputation;
            emit ReputationUpdated(creator, newReputation);
            
            // In a full implementation, we would distribute stake to challengers
            // For simplicity, we'll just burn the tokens by not reassigning them
        } else {
            // Joke is not offensive: return stake to creator and increase reputation
            balanceOf[creator] += stake;
            
            // Update creator's reputation (increase)
            uint256 newReputation = reputationOf[creator] < 90 ? reputationOf[creator] + 5 : 100;
            reputationOf[creator] = newReputation;
            emit ReputationUpdated(creator, newReputation);
        }
        
        emit JokeFinalized(jokeHash, isOffensive);
    }
    
    /**
     * @dev Calculate required stake based on user's reputation
     * @param user The address of the user
     * @return The required stake amount
     */
    function getRequiredStake(address user) public view returns (uint256) {
        uint256 reputation = reputationOf[user];
        
        // Higher reputation = lower stake requirement
        if (reputation >= 80) return minStake / 2;      // 5 tokens
        if (reputation >= 50) return minStake;          // 10 tokens
        if (reputation >= 30) return minStake * 2;      // 20 tokens
        return minStake * 4;                            // 40 tokens
    }
    
    /**
     * @dev Transfer tokens to another address
     * @param to The address to transfer to
     * @param value The amount to be transferred
     * @return success Whether the transfer was successful
     */
    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        
        return true;
    }
    
    /**
     * @dev Get a user's current reputation level description
     * @param user The address of the user
     * @return The reputation level description
     */
    function getReputationLevel(address user) public view returns (string memory) {
        uint256 reputation = reputationOf[user];
        
        if (reputation >= 80) return "Trusted";
        if (reputation >= 50) return "Established";
        if (reputation >= 30) return "Neutral";
        if (reputation >= 10) return "Questionable";
        return "Untrusted";
    }
}
