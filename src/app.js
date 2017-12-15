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

class Tag extends Event {
  constructor(props = {}) {
    super(props);
    this.props = props;
    if (this.props.tags && !Array.isArray(this.props.tags)) {
      throw TypeError("Tags should be an array!");
    }
    this.$tags = props.tags.map((tag, index) => {
      return {
        tag: tag,
        id: this.getNextNumber()
      };
    });
    this.$tagsContainerId = "tag" + this.getNextNumber();
    this.getInitialHTML(this.props.id);
    this.$rootDiv = document.getElementById(this.$tagsContainerId);
    window.root = this.$rootDiv;
    this.initEvents();
    this.dispatch("on:render");
    window.tags = this;
  }
  isExists(tag) {
    tag = tag || {};
    return !this.$tags.filter(t => t.tag === tag.tag).length === 0;
  }

  initEvents() {
    this.subscribe("on:render", () => {
      this.render();
    });
    let input = document
      .querySelector("#" + this.$tagsContainerId)
      .parentElement.querySelector("input");

    input.onkeyup = evt => {
      if (evt.keyCode === 13) {
        let { value } = evt.target;
        let tag = {
          tag: value,
          id: this.getNextNumber()
        };
        if (value && !this.isExists(tag)) {
          this.$tags.push(tag);
          this.dispatch("on:render");
          input.value = "";
        }
      }
    };
  }
  getNextNumber() {
    let count = 0;
    return function() {
      return count++;
    }.call();
  }

  renderinnerTags() {
    this.$rootDiv.innerHTML = "";
    this.$tags.forEach(tag => {
      var li = document.createElement("li");
      li.className = "tags ui-sortable-handle";
      li.innerText = tag.tag;
      var a = document.createElement("a");
      a.className = "close";
      // alert(tag.id);
      a.setAttribute("id", tag.id);
      a.onclick = (evt)=>{
        // alert(evt.target.id);
      }
      li.appendChild(a);
      this.$rootDiv.appendChild(li);
    });
  }
  render() {
    this.renderinnerTags();
  }

  getInitialHTML(id) {
    var div = document.getElementById(id);
    div.innerHTML = `<div>
    <ul class="tag-box ui-sortable">      
      <div id=${this.$tagsContainerId}>
      </div>
      <li class="new-tag">
        <input class="input-tag" type="text">
      </li>
    </ul>
    </div>`;
    return div;
  }
}
window.Tag = Tag;
