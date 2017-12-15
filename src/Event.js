class Event {
  constructor(props) {
    var events = {};
    this.subscribe = function(eventKey, callback) {
      if (events[eventKey] === undefined) {
        events[eventKey] = [];
      }
      if (typeof callback !== "function") {
        return false;
      }
      events[eventKey].push(callback);
    };
    this.dispatch = function(eventKey, data) {
      data = data || null;
      if (eventKey === undefined) {
        return false;
      }
      events[eventKey].forEach(eCallback => {
        eCallback(data);
      });
    };
    this.remove = function(eventkey) {
      if (eventkey !== undefined) {
        events[eventkey] = [];
      }
    };
    this.removeAll = function() {
      events = [];
    };
  }
}

module.exports = Event;
