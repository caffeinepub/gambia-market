import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
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

  type NewUserProfile = {
    id : Principal;
    name : Text;
    phone : Text;
    highestRating : Nat;
    followers : Nat;
    location : Text;
    verified : Bool;
    profilePic : ?Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  type OldActor = {
    users : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    users : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUsers = old.users.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        { oldProfile with profilePic = null : ?Storage.ExternalBlob };
      }
    );
    { users = newUsers };
  };
};
