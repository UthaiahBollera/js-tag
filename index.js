(function() {
  "use strict";
  class Observer {
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
        events[eventKey] = events[eventKey] || [];
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
  var Utils = {
    addClassName: function(className) {
      this.className = className;
    },
    createEle: function(TagName) {
      TagName = TagName || "div";
      return document.createElement(TagName);
    },
    getNextCount: (function() {
      var c = 0;
      return function() {
        return c++;
      };
    })()
  };
  class Tag extends Observer {
    constructor(params) {
      super();
      var { root } = params;
      if (!root) {
        throw "root not defined";
      } else {
        this.$root = document.getElementById(root);
        window.$tags = this.$tags = [{ text: "tag1", id: 3333 }];
      }
      this.$tagList = this.cachElements();
      this.renderTags();
      this.subscribeEvents(params);
      this.subscribe("onTagAdded", () => {
        this.renderTags();
      });
    }

    renderTags() {
      this.$tagList.innerHTML = "";
      this.$tags.forEach(_tag => {
        console.log("tag", tag);
        var tag = Utils.createEle("div");
        Utils.addClassName.call(tag, "tag");
        var closeSpan = Utils.createEle("span");
        Utils.addClassName.call(closeSpan, "close");
        closeSpan.innerText = "×";
        var contentSpan = Utils.createEle("span");
        Utils.addClassName.call(contentSpan, "content");
        contentSpan.innerHTML = _tag.text;
        contentSpan.setAttribute("id", _tag.id);
        closeSpan.setAttribute("id", _tag.id);
        tag.appendChild(closeSpan);
        tag.appendChild(contentSpan);
        this.$tagList.appendChild(tag);
      });
    }

    cachElements() {
      var tagContainer = Utils.createEle();
      Utils.addClassName.call(tagContainer, "tag-container");
      var tagList = Utils.createEle();
      Utils.addClassName.call(tagList, "tag-list");
      var tagInput = Utils.createEle();
      Utils.addClassName.call(tagInput, "tag-input");
      var input = Utils.createEle("input");
      Utils.addClassName.call(input, "input");
      input.setAttribute("type", "text");
      tagInput.appendChild(input);
      tagContainer.appendChild(tagList);
      tagContainer.appendChild(tagInput);
      this.$root.appendChild(tagContainer);
      return tagList;
    }
    subscribeEvents(params) {
      Object.keys(params).map(k => {
        debugger;
        if (k.indexOf("on") === 0 && typeof params[k] === "function") {
          this.subscribe(k, params[k]);
        }
      });
      this.$tagList.addEventListener("click", e => {
        var { target } = e;
        if (target.className === "close") {
          debugger;
          this.$tags = this.$tags.filter(d => {
            return d.id != target.getAttribute("id");
          });
          console.log("After ", this.$tags);
          this.dispatch("onTagAdded", this.$tags);
        }
      });

      this.$root
        .querySelector(".tag-input>input")
        .addEventListener("keyup", e => {
          var { value } = e.target;
          this.dispatch("onInputChange", { data: value });
          if (e.keyCode === 13) {
            let tag = {
              text: value,
              id: Utils.getNextCount()
            };
            this.$tags.push(tag);
            e.target.value = "";
            this.dispatch("onTagAdded", { data: this.$tags, tag: tag });
          }
        });
    }
  }
  window.Tag = Tag;
})();
