import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include core functionality
  include MixinStorage();

  // Initialize authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserRole = {
    #Junior;
    #Senior;
  };

  public type UserProfile = {
    name : Text;
    role : UserRole;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to check if user is Junior
  func isJunior(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#Junior) { true };
          case (#Senior) { false };
        };
      };
    };
  };

  // Helper function to check if user is Senior
  func isSenior(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.role) {
          case (#Senior) { true };
          case (#Junior) { false };
        };
      };
    };
  };

  // Point tracking for Seniors
  let seniorPoints = Map.empty<Principal, Nat>();

  // Doubt type and storage
  public type Doubt = {
    author : Principal;
    description : Text;
    attachment : ?Storage.ExternalBlob;
    timestamp : Int;
  };

  // Answer type and storage
  public type Answer = {
    responder : Principal;
    doubtId : Principal;
    text : Text;
    notes : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    rating : Float;
    numRatings : Nat;
  };

  // Storage
  let doubts = Map.empty<Principal, Doubt>();
  let answers = Map.empty<Principal, Answer>();

  // Doubt Management
  public shared ({ caller }) func postDoubt(description : Text, attachment : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post doubts");
    };
    if (not isJunior(caller)) {
      Runtime.trap("Unauthorized: Only Juniors can post doubts");
    };
    let doubt : Doubt = {
      author = caller;
      description;
      attachment;
      timestamp = Time.now();
    };
    doubts.add(caller, doubt);
  };

  public query func getAllDoubts() : async [(Principal, Doubt)] {
    // Public access - anyone can view doubts
    doubts.toArray();
  };

  // Answer Management
  public shared ({ caller }) func postAnswer(doubtId : Principal, text : Text, notes : ?Storage.ExternalBlob, video : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post answers");
    };
    if (not isSenior(caller)) {
      Runtime.trap("Unauthorized: Only Seniors can post answers");
    };
    let answer : Answer = {
      responder = caller;
      doubtId;
      text;
      notes;
      video;
      rating = 0.0;
      numRatings = 0;
    };
    answers.add(caller, answer);

    // Add initial points for answering
    let currentPoints = switch (seniorPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
    seniorPoints.add(caller, currentPoints + 5);
  };

  public query func getAnswersForDoubt(doubtId : Principal) : async [(Principal, Answer)] {
    // Public access - anyone can view answers
    let filteredAnswers = answers.filter(func(key, a) { a.doubtId == doubtId });
    filteredAnswers.toArray();
  };

  public shared ({ caller }) func rateAnswer(answerer : Principal, doubtId : Principal, rating : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can rate answers");
    };
    if (not isJunior(caller)) {
      Runtime.trap("Unauthorized: Only Juniors can rate answers");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Invalid rating: Must be between 1 and 5");
    };

    // Find answers for the doubt posted by the answerer
    let filteredAnswers = answers.filter(func(key, a) { a.doubtId == doubtId and a.responder == answerer });

    for ((answerKey, answer) in filteredAnswers.entries()) {
      let totalRating = answer.rating * answer.numRatings.toFloat() + rating.toFloat();
      let newNumRatings = answer.numRatings + 1;
      let updatedAnswer = {
        answer with
        rating = totalRating / newNumRatings.toFloat();
        numRatings = newNumRatings;
      };
      answers.add(answerKey, updatedAnswer);

      // Add points for rating
      let currentPoints = switch (seniorPoints.get(answerer)) {
        case (null) { 0 };
        case (?points) { points };
      };
      seniorPoints.add(answerer, currentPoints + rating);
      return;
    };
  };

  // Leaderboard Management
  public type LeaderboardEntry = {
    userId : Principal;
    points : Nat;
  };

  module LeaderboardEntry {
    public func compare(entry1 : LeaderboardEntry, entry2 : LeaderboardEntry) : Order.Order {
      if (entry1.points > entry2.points) {
        #less;
      } else if (entry1.points < entry2.points) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public query func getLeaderboard() : async [LeaderboardEntry] {
    // Public access - anyone can view leaderboard
    let entries = seniorPoints.toArray();
    let mappedEntries = entries.map(
      func((userId, points)) { { userId; points } }
    );
    let sortedEntries = mappedEntries.sort();
    sortedEntries;
  };
};
