import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import Text "mo:core/Text";
import List "mo:core/List";

// Apply migration for upgrading persistent backend data structures

actor {
  // Types
  type RoseDayWish = {
    id : Nat;
    senderName : Text;
    recipientName : Text;
    message : Text;
    bouquetId : ?Nat;
    note : ?Text;
    gifUrl : ?Text;
  };

  type Flower = {
    flowerType : Text;
    color : Text;
    quantity : Nat;
  };

  type Bouquet = {
    id : Nat;
    flowers : [Flower];
    wrappingStyle : Text;
    ribbonStyle : Text;
    cardMessage : ?Text;
    creatorName : ?Text;
    secret : ?BouquetSecret;
  };

  type BouquetSecret = {
    flowerType : Text;
    secretMessage : ?Text;
    secretImageUrl : ?Text;
  };

  type CoupleGif = {
    id : Nat;
    name : Text;
    url : Text;
  };

  // Persistent storage
  let wishes = Map.empty<Nat, RoseDayWish>();
  let bouquets = Map.empty<Nat, Bouquet>();
  var nextWishId = 1;
  var nextBouquetId = 1;

  // In-memory collection of couple GIFs
  let coupleGifs : List.List<CoupleGif> = List.empty<CoupleGif>();

  module RoseDayWish {
    public func compareByRecipientName(wish1 : RoseDayWish, wish2 : RoseDayWish) : Order.Order {
      switch (Text.compare(wish1.recipientName, wish2.recipientName)) {
        case (#equal) { Nat.compare(wish1.id, wish2.id) };
        case (order) { order };
      };
    };
  };

  module Bouquet {
    public func compareByCreatorName(bouquet1 : Bouquet, bouquet2 : Bouquet) : Order.Order {
      switch (compareOptionalText(bouquet1.creatorName, bouquet2.creatorName)) {
        case (#equal) { Nat.compare(bouquet1.id, bouquet2.id) };
        case (order) { order };
      };
    };

    func compareOptionalText(a : ?Text, b : ?Text) : Order.Order {
      switch (a, b) {
        case (null, null) { #equal };
        case (null, _) { #less };
        case (_, null) { #greater };
        case (?textA, ?textB) { Text.compare(textA, textB) };
      };
    };
  };

  // Wish Management
  public shared ({ caller }) func createWish(
    senderName : Text,
    recipientName : Text,
    message : Text,
    bouquetId : ?Nat,
    note : ?Text,
    gifUrl : ?Text,
  ) : async Nat {
    let wish : RoseDayWish = {
      id = nextWishId;
      senderName;
      recipientName;
      message;
      bouquetId;
      note;
      gifUrl;
    };
    wishes.add(nextWishId, wish);
    nextWishId += 1;
    wish.id;
  };

  public query ({ caller }) func getWish(id : Nat) : async RoseDayWish {
    switch (wishes.get(id)) {
      case (null) { Runtime.trap("Wish with id " # id.toText() # " does not exist!") };
      case (?wish) { wish };
    };
  };

  public query ({ caller }) func getAllWishes() : async [RoseDayWish] {
    wishes.values().toArray().sort(RoseDayWish.compareByRecipientName);
  };

  public shared ({ caller }) func editWish(id : Nat, senderName : Text, recipientName : Text, message : Text, bouquetId : ?Nat, note : ?Text, gifUrl : ?Text) : async () {
    switch (wishes.get(id)) {
      case (null) { Runtime.trap("Wish with id " # id.toText() # " does not exist!") };
      case (?existing) {
        let updatedWish : RoseDayWish = {
          id = existing.id;
          senderName;
          recipientName;
          message;
          bouquetId;
          note;
          gifUrl;
        };
        wishes.add(id, updatedWish);
      };
    };
  };

  // Bouquet Management
  public shared ({ caller }) func createBouquet(flowers : [Flower], wrappingStyle : Text, ribbonStyle : Text, cardMessage : ?Text, creatorName : ?Text, secret : ?BouquetSecret) : async Nat {
    let bouquet : Bouquet = {
      id = nextBouquetId;
      flowers;
      wrappingStyle;
      ribbonStyle;
      cardMessage;
      creatorName;
      secret;
    };
    bouquets.add(nextBouquetId, bouquet);
    nextBouquetId += 1;
    bouquet.id;
  };

  public query ({ caller }) func getBouquet(id : Nat) : async Bouquet {
    switch (bouquets.get(id)) {
      case (null) { Runtime.trap("Bouquet with id " # id.toText() # " does not exist!") };
      case (?bouquet) { bouquet };
    };
  };

  public query ({ caller }) func getAllBouquets() : async [Bouquet] {
    bouquets.values().toArray().sort(Bouquet.compareByCreatorName);
  };

  // Couple GIF Management
  public shared ({ caller }) func addCoupleGif(name : Text, url : Text) : async Nat {
    let gifId = coupleGifs.size() + 1;
    let gif : CoupleGif = {
      id = gifId;
      name;
      url;
    };
    coupleGifs.add(gif);
    gifId;
  };

  public query ({ caller }) func getCoupleGif(id : Nat) : async CoupleGif {
    switch (coupleGifs.toArray().find(func(gif) { gif.id == id })) {
      case (?gif) { gif };
      case (null) { Runtime.trap("Couple GIF with id " # id.toText() # " does not exist!") };
    };
  };

  public query ({ caller }) func getAllCoupleGifs() : async [CoupleGif] {
    coupleGifs.toArray();
  };

  public query ({ caller }) func filterCoupleGifsByName(substring : Text) : async [CoupleGif] {
    coupleGifs.toArray().filter(
      func(gif) {
        gif.name.toLower().contains(#text(substring.toLower()));
      }
    );
  };
};
