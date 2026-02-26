import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    id : Principal;
    name : Text;
    phone : Text;
    highestRating : Nat;
    followers : Nat;
    location : Text;
    verified : Bool;
    profilePicUrl : ?Text;
    createdAt : Time.Time;
  };

  type ListingId = Nat;
  type MessageId = Nat;
  type TransactionId = Nat;
  type ReviewId = Nat;
  type ReportId = Nat;

  // Categories
  public type ListingCategory = {
    #carsAndTrucks;
    #motorcycles;
    #bicycles;
    #spareParts;
    #electronics;
    #phones;
    #laptops;
    #furniture;
    #appliances;
    #clothing;
    #shoes;
    #fashion;
    #beauty;
    #health;
    #services;
    #pets;
    #realEstate;
    #other;
  };

  public type RealEstateSubCategory = {
    #landAndProperties;
    #apartmentsAndFlats;
    #housesForSale;
    #housesForRent;
    #commercialSpaces;
    #shortLetHolidayRentals;
  };

  // Internal (non-shared) listing type.
  type InternalListing = {
    id : ListingId;
    sellerId : Principal;
    title : Text;
    description : Text;
    category : ListingCategory;
    subCategory : ?RealEstateSubCategory;
    price : Nat;
    condition : Text;
    photos : [Storage.ExternalBlob];
    location : Text;
    status : Text;
    isBoosted : Bool;
    createdAt : Time.Time;
    boostExpiry : ?Time.Time;
    likedBy : Set.Set<Principal>;
    propertySize : ?Nat;
    numBedrooms : ?Nat;
    isFurnished : ?Bool;
  };

  type PublicListing = {
    id : ListingId;
    sellerId : Principal;
    title : Text;
    description : Text;
    category : ListingCategory;
    subCategory : ?RealEstateSubCategory;
    price : Nat;
    condition : Text;
    photos : [Storage.ExternalBlob];
    location : Text;
    status : Text;
    isBoosted : Bool;
    createdAt : Time.Time;
    boostExpiry : ?Time.Time;
    propertySize : ?Nat;
    numBedrooms : ?Nat;
    isFurnished : ?Bool;
  };

  type Message = {
    id : MessageId;
    listingId : ListingId;
    senderId : Principal;
    receiverId : Principal;
    content : Text;
    timestamp : Time.Time;
    isEdited : Bool;
    isDeleted : Bool;
  };

  type Transaction = {
    id : TransactionId;
    listingId : ListingId;
    buyerId : Principal;
    sellerId : Principal;
    paymentMethod : Text;
    amount : Nat;
    status : Text;
  };

  type Review = {
    id : ReviewId;
    reviewerId : Principal;
    revieweeId : Principal;
    listingId : ListingId;
    stars : Nat;
    comment : Text;
    createdAt : Time.Time;
  };

  type Report = {
    id : ReportId;
    reporterId : Principal;
    reportedId : Principal;
    reason : Text;
    status : Text;
  };

  type BoostOption = {
    durationDays : Nat;
    priceGMD : Nat;
  };

  type AnonMessage = {
    id : MessageId;
    listingId : ListingId;
    senderId : ?Principal;
    senderName : Text;
    receiverId : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  // State variables
  let users = Map.empty<Principal, UserProfile>();
  let followersMap = Map.empty<Principal, Set.Set<Principal>>();
  let listings = Map.empty<ListingId, InternalListing>();
  var nextListingId = 1;
  let messages = Map.empty<MessageId, Message>();
  var nextMessageId = 1;
  let transactions = Map.empty<TransactionId, Transaction>();
  var nextTransactionId = 1;
  let reviews = Map.empty<ReviewId, Review>();
  var nextReviewId = 1;
  let reports = Map.empty<ReportId, Report>();
  var nextReportId = 1;
  let anonMessages = Map.empty<MessageId, AnonMessage>();

  let allowedCategories = Set.empty<Text>();

  // ─── User Profile (required by instructions) ──────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Public: anyone can view a user profile
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(name : Text, phone : Text, location : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let highestRating = getHighestRatingForReviewee(caller);
    let existing = users.get(caller);
    let createdAt = switch (existing) {
      case (?p) { p.createdAt };
      case (null) { Time.now() };
    };
    let verified = switch (existing) {
      case (?p) { p.verified };
      case (null) { false };
    };
    let profilePicUrl = switch (existing) {
      case (?p) { p.profilePicUrl };
      case (null) { null };
    };
    let followerCount = switch (existing) {
      case (?p) { p.followers };
      case (null) { 0 };
    };
    let profile : UserProfile = {
      id = caller;
      name;
      phone;
      highestRating;
      location;
      verified;
      profilePicUrl;
      followers = followerCount;
      createdAt;
    };
    users.add(caller, profile);
  };

  public shared ({ caller }) func createOrUpdateUserProfile(name : Text, location : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update their profile");
    };
    let highestRating = getHighestRatingForReviewee(caller);
    let existing = users.get(caller);
    let createdAt = switch (existing) {
      case (?p) { p.createdAt };
      case (null) { Time.now() };
    };
    let phone = switch (existing) {
      case (?p) { p.phone };
      case (null) { "" };
    };
    let verified = switch (existing) {
      case (?p) { p.verified };
      case (null) { false };
    };
    let followerCount = switch (existing) {
      case (?p) { p.followers };
      case (null) { 0 };
    };
    let profilePicUrl = switch (existing) {
      case (?p) { p.profilePicUrl };
      case (null) { null };
    };
    let profile : UserProfile = {
      id = caller;
      name;
      phone;
      highestRating;
      location;
      verified;
      profilePicUrl;
      followers = followerCount;
      createdAt;
    };
    users.add(caller, profile);
  };

  // ─── Listings ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func createListing(
    title : Text,
    description : Text,
    category : ListingCategory,
    subCategory : ?RealEstateSubCategory,
    price : Nat,
    condition : Text,
    photos : [Storage.ExternalBlob],
    location : Text,
    propertySize : ?Nat,
    numBedrooms : ?Nat,
    isFurnished : ?Bool,
  ) : async ListingId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };
    let listingId = nextListingId;
    nextListingId += 1;
    let newListing : InternalListing = {
      id = listingId;
      sellerId = caller;
      title;
      description;
      category;
      subCategory;
      price;
      condition;
      photos;
      location;
      status = "Active";
      isBoosted = false;
      createdAt = Time.now();
      boostExpiry = null;
      likedBy = Set.empty<Principal>();
      propertySize;
      numBedrooms;
      isFurnished;
    };
    listings.add(listingId, newListing);
    listingId;
  };

  public query ({ caller }) func getListing(listingId : ListingId) : async ?PublicListing {
    // Public: anyone can view a listing
    let mutableL = listings.get(listingId);
    switch (mutableL) {
      case (null) { null };
      case (?l) { ?convertToPublicListing(l) };
    };
  };

  public query ({ caller }) func getAllListings() : async [PublicListing] {
    // Public: anyone can browse listings
    let internalArray = listings.values().toArray();
    let publicArray = internalArray.map(func(listing) { convertToPublicListing(listing) });
    publicArray;
  };

  public shared ({ caller }) func updateListing(
    listingId : ListingId,
    title : Text,
    description : Text,
    category : ListingCategory,
    subCategory : ?RealEstateSubCategory,
    price : Nat,
    condition : Text,
    photos : [Storage.ExternalBlob],
    location : Text,
    propertySize : ?Nat,
    numBedrooms : ?Nat,
    isFurnished : ?Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update listings");
    };
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        if (existing.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or an admin can update this listing");
        };
        let updated : InternalListing = {
          existing with
          title;
          description;
          category;
          subCategory;
          price;
          condition;
          photos;
          location;
          propertySize;
          numBedrooms;
          isFurnished;
        };
        listings.add(listingId, updated);
      };
    };
  };

  public shared ({ caller }) func deleteListing(listingId : ListingId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete listings");
    };
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        if (existing.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or an admin can delete this listing");
        };
        listings.remove(listingId);
      };
    };
  };

  public shared ({ caller }) func setListingBoosted(listingId : ListingId, isBoosted : Bool, durationDays : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can boost listings");
    };
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        if (existing.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or an admin can boost this listing");
        };
        let expiry = if (isBoosted) {
          ?(Time.now() + durationDays * 24 * 60 * 60 * 1_000_000_000);
        } else { null };
        let updated : InternalListing = { existing with isBoosted; boostExpiry = expiry };
        listings.add(listingId, updated);
      };
    };
  };

  public shared ({ caller }) func updateListingStatus(listingId : ListingId, status : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update listing status");
    };
    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        if (existing.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the seller or an admin can update this listing's status");
        };
        let updated : InternalListing = { existing with status };
        listings.add(listingId, updated);
      };
    };
  };

  // ─── Messaging ────────────────────────────────────────────────────────────

  public shared ({ caller }) func sendMessage(listingId : ListingId, receiverId : Principal, content : Text) : async MessageId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let messageId = nextMessageId;
    nextMessageId += 1;
    let newMessage : Message = {
      id = messageId;
      listingId;
      senderId = caller;
      receiverId;
      content;
      timestamp = Time.now();
      isEdited = false;
      isDeleted = false;
    };
    messages.add(messageId, newMessage);
    messageId;
  };

  public shared ({ caller }) func sendMessageAnon(senderName : Text, messageText : Text, listingId : ListingId, receiverId : Principal) : async MessageId {
    // Anonymous users can send anon messages — no auth check required
    let anonMessageId = nextMessageId;
    nextMessageId += 1;

    let newAnonMessage : AnonMessage = {
      id = anonMessageId;
      listingId;
      senderId = null;
      senderName;
      receiverId;
      content = messageText;
      timestamp = Time.now();
    };

    anonMessages.add(anonMessageId, newAnonMessage);
    anonMessageId;
  };

  public query ({ caller }) func getMessagesForListing(listingId : ListingId) : async [Message] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can read messages");
    };
    let filtered = messages.toArray().filter(
      func((_, m) : (MessageId, Message)) : Bool {
        m.listingId == listingId and (m.senderId == caller or m.receiverId == caller or AccessControl.isAdmin(accessControlState, caller));
      }
    );
    filtered.map(func((_, m) : (MessageId, Message)) : Message { m });
  };

  public shared ({ caller }) func editMessage(messageId : MessageId, newContent : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can edit messages");
    };
    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?existing) {
        if (existing.senderId != caller) {
          Runtime.trap("Unauthorized: Only the sender can edit this message");
        };
        if (existing.isDeleted) {
          Runtime.trap("Cannot edit a deleted message");
        };
        let updated : Message = { existing with content = newContent; isEdited = true };
        messages.add(messageId, updated);
      };
    };
  };

  public shared ({ caller }) func deleteMessage(messageId : MessageId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete messages");
    };
    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?existing) {
        if (existing.senderId != caller) {
          Runtime.trap("Unauthorized: Only the sender can delete this message");
        };
        if (existing.isDeleted) {
          Runtime.trap("Message already deleted");
        };
        let updated : Message = { existing with isDeleted = true };
        messages.add(messageId, updated);
      };
    };
  };

  public query ({ caller }) func getAnonymousMessageById(messageId : MessageId) : async ?AnonMessage {
    // Public: anyone can retrieve an anon message by ID
    switch (anonMessages.get(messageId)) {
      case (?message) { ?message };
      case (null) { null };
    };
  };

  public query ({ caller }) func getMyConversations() : async [Message] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };
    let filtered = messages.toArray().filter(
      func((_, m) : (MessageId, Message)) : Bool {
        m.senderId == caller or m.receiverId == caller;
      }
    );
    filtered.map(func((_, m) : (MessageId, Message)) : Message { m });
  };

  // ─── Transactions ─────────────────────────────────────────────────────────

  public shared ({ caller }) func createTransaction(listingId : ListingId, sellerId : Principal, paymentMethod : Text, amount : Nat) : async TransactionId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create transactions");
    };
    let txId = nextTransactionId;
    nextTransactionId += 1;
    let tx : Transaction = {
      id = txId;
      listingId;
      buyerId = caller;
      sellerId;
      paymentMethod;
      amount;
      status = "Pending";
    };
    transactions.add(txId, tx);
    txId;
  };

  public shared ({ caller }) func updateTransactionStatus(txId : TransactionId, status : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update transactions");
    };
    switch (transactions.get(txId)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?existing) {
        if (existing.buyerId != caller and existing.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only transaction participants or an admin can update this transaction");
        };
        let updated : Transaction = { existing with status };
        transactions.add(txId, updated);
      };
    };
  };

  public query ({ caller }) func getTransaction(txId : TransactionId) : async ?Transaction {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (transactions.get(txId)) {
      case (null) { null };
      case (?tx) {
        if (tx.buyerId != caller and tx.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only transaction participants or an admin can view this transaction");
        };
        ?tx;
      };
    };
  };

  // ─── Reviews ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func createReview(revieweeId : Principal, listingId : ListingId, stars : Nat, comment : Text) : async ReviewId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create reviews");
    };
    if (stars < 1 or stars > 5) {
      Runtime.trap("Stars must be between 1 and 5");
    };
    let reviewId = nextReviewId;
    nextReviewId += 1;
    let review : Review = {
      id = reviewId;
      reviewerId = caller;
      revieweeId;
      listingId;
      stars;
      comment;
      createdAt = Time.now();
    };
    reviews.add(reviewId, review);
    updateUserProfileHighestRating(revieweeId);
    reviewId;
  };

  public query ({ caller }) func getReviewsForUser(userId : Principal) : async [Review] {
    // Public: anyone can view reviews for a user
    let filtered = reviews.toArray().filter(
      func((_, r) : (ReviewId, Review)) : Bool {
        r.revieweeId == userId;
      }
    );
    filtered.map(func((_, r) : (ReviewId, Review)) : Review { r });
  };

  // ─── Reports ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func createReport(reportedId : Principal, reason : Text) : async ReportId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit reports");
    };
    let reportId = nextReportId;
    nextReportId += 1;
    let report : Report = {
      id = reportId;
      reporterId = caller;
      reportedId;
      reason;
      status = "Pending";
    };
    reports.add(reportId, report);
    reportId;
  };

  public query ({ caller }) func getAllReports() : async [Report] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all reports");
    };
    reports.values().toArray();
  };

  public shared ({ caller }) func updateReportStatus(reportId : ReportId, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update report status");
    };
    switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?existing) {
        let updated : Report = { existing with status };
        reports.add(reportId, updated);
      };
    };
  };

  // ─── Categories (admin-managed) ───────────────────────────────────────────

  public shared ({ caller }) func addAllowedCategory(category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    allowedCategories.add(category);
  };

  public shared ({ caller }) func removeAllowedCategory(category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove categories");
    };
    allowedCategories.remove(category);
  };

  public query ({ caller }) func getAllCategories() : async [Text] {
    // Public: anyone can view categories
    allowedCategories.toArray();
  };

  // ─── Boost helpers ────────────────────────────────────────────────────────

  public query ({ caller }) func getBoostedListings() : async [PublicListing] {
    // Public: anyone can view boosted listings
    let internalArray = listings.values().toArray();
    let filteredInternal = internalArray.filter(
      func(listing : InternalListing) : Bool {
        if (listing.isBoosted) {
          switch (listing.boostExpiry) {
            case (?expiry) { Time.now() < expiry };
            case (null) { false };
          };
        } else { false };
      }
    );
    filteredInternal.map(func(listing) { convertToPublicListing(listing) });
  };

  public query ({ caller }) func getBoostOptions() : async [BoostOption] {
    // Public: anyone can view boost options
    [
      { durationDays = 3; priceGMD = 100 },
      { durationDays = 7; priceGMD = 250 },
      { durationDays = 30; priceGMD = 600 },
    ];
  };

  // ─── Search ───────────────────────────────────────────────────────────────

  public query ({ caller }) func searchListings(searchText : Text) : async [PublicListing] {
    // Public: anyone can search listings
    let lowerSearch = searchText.toLower();
    let internalArray = listings.values().toArray();
    let filtered = internalArray.filter(
      func(listing : InternalListing) : Bool {
        let titleMatches = listing.title.toLower().contains(#text lowerSearch);
        let descMatches = listing.description.toLower().contains(#text lowerSearch);
        titleMatches or descMatches;
      }
    );
    filtered.map(func(listing) { convertToPublicListing(listing) });
  };

  public query ({ caller }) func getListingsByCategory(category : ListingCategory) : async [PublicListing] {
    // Public: anyone can browse by category
    let internalArray = listings.values().toArray();
    let filtered = internalArray.filter(
      func(listing : InternalListing) : Bool {
        listing.category == category and listing.status == "Active";
      }
    );
    filtered.map(func(listing) { convertToPublicListing(listing) });
  };

  public query ({ caller }) func getMyListings() : async [PublicListing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their own listings");
    };
    let internalArray = listings.values().toArray();
    let filtered = internalArray.filter(
      func(listing : InternalListing) : Bool {
        listing.sellerId == caller;
      }
    );
    filtered.map(func(listing) { convertToPublicListing(listing) });
  };

  // ─── "Like" and Follow system ─────────────────────────────────────────────

  public shared ({ caller }) func likeListingAnon(listingId : ListingId) : async Bool {
    // Anonymous users can like listings without authentication
    switch (listings.get(listingId)) {
      case (?listing) {
        let anonPrincipal = Principal.fromText("2vxsx-fae"); // well-known anonymous principal
        let newLikes = listing.likedBy.clone();
        let existed = newLikes.contains(anonPrincipal);
        if (existed) {
          newLikes.remove(anonPrincipal);
        } else {
          newLikes.add(anonPrincipal);
        };
        let updatedListing = { listing with likedBy = newLikes };
        listings.add(listingId, updatedListing);
        not existed;
      };
      case (null) {
        Runtime.trap("Listing not found");
      };
    };
  };

  public shared ({ caller }) func likeListing(listingId : ListingId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can like listings");
    };
    switch (listings.get(listingId)) {
      case (?listing) {
        let newLikes = listing.likedBy.clone();
        let existed = newLikes.contains(caller);
        if (existed) {
          newLikes.remove(caller);
        } else {
          newLikes.add(caller);
        };
        let updatedListing = { listing with likedBy = newLikes };
        listings.add(listingId, updatedListing);
        not existed;
      };
      case (null) {
        Runtime.trap("Listing not found");
      };
    };
  };

  public shared ({ caller }) func followSeller(sellerId : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can follow sellers");
    };
    let currentFollowers = switch (followersMap.get(sellerId)) {
      case (?existing) { existing };
      case (null) {
        let empty = Set.empty<Principal>();
        followersMap.add(sellerId, empty);
        empty;
      };
    };
    currentFollowers.add(caller);
    followersMap.add(sellerId, currentFollowers);

    // Update followers count in profile.
    switch (users.get(sellerId)) {
      case (?profile) {
        let updatedProfile = { profile with followers = currentFollowers.size() };
        users.add(sellerId, updatedProfile);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func unfollowSeller(sellerId : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can unfollow sellers");
    };
    switch (followersMap.get(sellerId)) {
      case (?currentFollowers) {
        currentFollowers.remove(caller);
        followersMap.add(sellerId, currentFollowers);

        // Update followers count in profile.
        switch (users.get(sellerId)) {
          case (?profile) {
            let updatedProfile = { profile with followers = currentFollowers.size() };
            users.add(sellerId, updatedProfile);
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getFollowing() : async [Principal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their following list");
    };
    let following = List.empty<Principal>();
    followersMap.keys().forEach(func(sellerId) {
      switch (followersMap.get(sellerId)) {
        case (?followerSet) {
          if (followerSet.contains(caller)) { following.add(sellerId) };
        };
        case (null) {};
      };
    });
    following.toArray();
  };

  public query ({ caller }) func getFollowers(sellerId : Principal) : async [Principal] {
    // Public: anyone can view a seller's followers
    switch (followersMap.get(sellerId)) {
      case (?currentFollowers) { currentFollowers.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getLikedListings() : async [ListingId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their liked listings");
    };
    let liked = List.empty<ListingId>();
    listings.keys().forEach(
      func(id) {
        switch (listings.get(id)) {
          case (null) {};
          case (?listing) {
            if (listing.likedBy.contains(caller)) { liked.add(id) };
          };
        };
      }
    );
    liked.toArray();
  };

  // ─── Profile photo management ─────────────────────────────────────────────

  public shared ({ caller }) func updateProfilePic(url : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update their profile picture");
    };
    switch (users.get(caller)) {
      case (?profile) {
        let updatedProfile = { profile with profilePicUrl = ?url };
        users.add(caller, updatedProfile);
      };
      case (null) {
        Runtime.trap("User profile not found; please create a profile first");
      };
    };
  };

  // ─── Admin utilities ──────────────────────────────────────────────────────

  public shared ({ caller }) func updateAllUserProfilesWithHighestRating() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can trigger bulk profile rating updates");
    };
    users.keys().forEach(updateUserProfileHighestRating);
  };

  // ─── Internal helpers ─────────────────────────────────────────────────────

  func getHighestRatingForReviewee(revieweeId : Principal) : Nat {
    let revieweeReviews = reviews.values().toArray().filter(
      func(review : Review) : Bool {
        review.revieweeId == revieweeId;
      }
    );
    let reviewCount = revieweeReviews.size();
    if (reviewCount == 0) { return 0 };
    var highestRating = revieweeReviews[0].stars;
    let reviewIter = revieweeReviews.values();
    ignore reviewIter.next();
    reviewIter.forEach(func(review : Review) {
      if (review.stars > highestRating) { highestRating := review.stars };
    });
    highestRating;
  };

  func updateUserProfileHighestRating(userId : Principal) {
    let highestRating = getHighestRatingForReviewee(userId);
    switch (users.get(userId)) {
      case (?profile) {
        if (profile.highestRating != highestRating) {
          let updatedProfile = { profile with highestRating };
          users.add(userId, updatedProfile);
        };
      };
      case (null) {};
    };
  };

  func convertToPublicListing(internal : InternalListing) : PublicListing {
    {
      id = internal.id;
      sellerId = internal.sellerId;
      title = internal.title;
      description = internal.description;
      category = internal.category;
      subCategory = internal.subCategory;
      price = internal.price;
      condition = internal.condition;
      photos = internal.photos;
      location = internal.location;
      status = internal.status;
      isBoosted = internal.isBoosted;
      createdAt = internal.createdAt;
      boostExpiry = internal.boostExpiry;
      propertySize = internal.propertySize;
      numBedrooms = internal.numBedrooms;
      isFurnished = internal.isFurnished;
    };
  };
};
