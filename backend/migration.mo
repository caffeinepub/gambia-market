import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    id : Principal;
    name : Text;
    phone : Text;
    highestRating : Nat;
    location : Text;
    verified : Bool;
    createdAt : Int;
  };

  type OldListing = {
    id : Nat;
    sellerId : Principal;
    title : Text;
    description : Text;
    category : Text;
    price : Nat;
    condition : Text;
    photos : [Storage.ExternalBlob];
    location : Text;
    status : Text;
    isBoosted : Bool;
    createdAt : Int;
    boostExpiry : ?Int;
  };

  type OldActor = {
    users : Map.Map<Principal, OldUserProfile>;
    listings : Map.Map<Nat, OldListing>;
  };

  type NewUserProfile = {
    id : Principal;
    name : Text;
    phone : Text;
    highestRating : Nat;
    followers : Nat;
    location : Text;
    verified : Bool;
    profilePicUrl : ?Text;
    createdAt : Int;
  };

  type NewListing = {
    id : Nat;
    sellerId : Principal;
    title : Text;
    description : Text;
    category : Text;
    price : Nat;
    condition : Text;
    photos : [Storage.ExternalBlob];
    location : Text;
    status : Text;
    isBoosted : Bool;
    createdAt : Int;
    boostExpiry : ?Int;
    likedBy : Set.Set<Principal>;
  };

  type NewActor = {
    users : Map.Map<Principal, NewUserProfile>;
    listings : Map.Map<Nat, NewListing>;
  };

  public func run(old : OldActor) : NewActor {
    let newUsers = old.users.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldUser) {
        {
          oldUser with
          followers = 0;
          profilePicUrl = null;
        };
      }
    );

    let newListings = old.listings.map<Nat, OldListing, NewListing>(
      func(_id, oldListing) {
        {
          oldListing with
          likedBy = Set.empty<Principal>();
        };
      }
    );

    {
      old with
      users = newUsers;
      listings = newListings;
    };
  };
};
