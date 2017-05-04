webpackJsonp([2,0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(8);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _vue = __webpack_require__(2);

	var _vue2 = _interopRequireDefault(_vue);

	var _App = __webpack_require__(16);

	var _App2 = _interopRequireDefault(_App);

	var _vueResource = __webpack_require__(22);

	var _vueResource2 = _interopRequireDefault(_vueResource);

	var _vue2Leaflet = __webpack_require__(23);

	var Vue2Leaflet = _interopRequireWildcard(_vue2Leaflet);

	var _vue2LoadingBar = __webpack_require__(24);

	var _vue2LoadingBar2 = _interopRequireDefault(_vue2LoadingBar);

	var _vueCookies = __webpack_require__(15);

	var _vueCookies2 = _interopRequireDefault(_vueCookies);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.use(_vueCookies2.default);
	_vue2.default.component('v-progress', _vue2LoadingBar2.default);

	_vue2.default.component('v-map', Vue2Leaflet.Map);
	_vue2.default.component('v-tilelayer', Vue2Leaflet.TileLayer);
	_vue2.default.component('v-marker', Vue2Leaflet.Marker);
	_vue2.default.component('v-group', Vue2Leaflet.LayerGroup);
	_vue2.default.component('v-popup', Vue2Leaflet.Popup);
	_vue2.default.component('v-cluster', Vue2Leaflet.Cluster);
	_vue2.default.component('v-circle', Vue2Leaflet.Circle);
	_vue2.default.filter('json', function (x) {
	  return (0, _stringify2.default)(x);
	});
	_vue2.default.use(_vueResource2.default);

	var app = new _vue2.default({
	  el: '#app',
	  template: '<App/>',
	  components: { App: _App2.default }
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Hello = __webpack_require__(17);

	var _Hello2 = _interopRequireDefault(_Hello);

	var _MembersLoop = __webpack_require__(18);

	var _MembersLoop2 = _interopRequireDefault(_MembersLoop);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'app',
	  components: {
	    MembersLoop: _MembersLoop2.default

	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  name: 'hello',
	  data: function data() {
	    return {
	      msg: 'Welcome to Your Vue.js App'
	    };
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'membersloop',
	  components: {},
	  data: function data() {
	    return {
	      members: [],
	      searchParams: { textQuery: "", memberType: "host", farmMethod: "Any", skillsReq: [], page: 1, nearMe: false, distance: 50 },
	      center: { lat: -38, lng: 144 },
	      markers: [],
	      fullmembers: [],
	      bounds: {},
	      paginationCur: 1,
	      progress: 1,
	      mypos: { lat: -1, lng: -1 },
	      SkillTypes: ["General Gardening", "Weeding", "Pruning", "Animal Care", "Building", "Fencing", "Dairy", "Bee Keeping", "Engineering", "Mechanical"],
	      selectedID: -1,

	      mapOnly: false,
	      listOnly: false,
	      radius: 10,
	      zoom: 5
	    };
	  },
	  mounted: function mounted() {
	    this.$nextTick(function () {
	      var self = this;

	      this.initialDownload();
	    });
	  },

	  computed: {
	    showNearBy: function showNearBy() {
	      return true;
	    },
	    resultCnt: function resultCnt() {
	      return this.members.length;
	    },
	    totalCnt: function totalCnt() {
	      return this.fullmembers.length;
	    },
	    membersFiltered: function membersFiltered() {

	      var res = this.members.slice(this.paginationCur - 1, this.paginationCur + 7);
	      res.forEach(function (item, index) {
	        item.isSelected = false;
	      });
	      if (this.selectedID != -1) {
	        var selectedMem = this.fullmembers[this.selectedID];
	        if (_lodash2.default.indexOf(res, selectedMem) == -1) {
	          res.splice(0, 1);
	          selectedMem.isSelected = true;
	          res.splice(0, 0, selectedMem);
	        } else {
	          res[_lodash2.default.indexOf(res, selectedMem)].isSelected = true;
	        }
	      }

	      return res;

	      if (this.selectedID != -1 && (this.selectedID > this.paginationCur + 7 || this.selectedID < this.paginationCur - 1)) {
	        var res = this.members.slice(this.paginationCur - 1, this.paginationCur + 6);

	        res.splice(0, 0, this.fullmembers[this.selectedID]);

	        return res;
	      }
	      return this.members.slice(this.paginationCur - 1, this.paginationCur + 7);
	    }
	  },
	  methods: {
	    isItemSelected: function isItemSelected(index) {
	      return this.selectedID == index ? 'selected-item' : '';
	    },
	    filterByMapVis: function filterByMapVis(event) {

	      if (event != null && event.target != null) {
	        this.members = this.fullmembers.filter(function (item) {
	          var pos = { lat: Number(item.position.lat), lng: Number(item.position.lng) };
	          if (event.target.getBounds().contains([pos.lat, pos.lng])) return true;

	          return false;
	        });
	      } else {}
	    },
	    rebuildMarkers: function rebuildMarkers() {
	      this.markers.length = 0;
	      console.log("Doing markers");
	      for (var i = 0; i < this.fullmembers.length; i++) {
	        var locMember = this.fullmembers[i];
	        var loc = locMember.position;

	        var pos = { lat: Number(loc.lat), lng: Number(loc.lng) };

	        var content = "<h3>" + locMember.name + "</h3><p>" + locMember.desc + "...</p><a href='" + locMember.url + "'>View</a>";
	        if (locMember.cover != false) content = "<img src='" + locMember.cover + "'</img>" + content;
	        this.markers.push({
	          position: pos,
	          title: content,

	          memberid: i
	        });
	      }
	    },
	    markerClick: function markerClick(index) {
	      console.log(index);
	      this.selectedID = index;
	    },
	    initialDownload: function initialDownload() {
	      this.progress = 0;
	      this.searchParams.page = 1;
	      this.paginationCur = 1;
	      this.$http.post(gwVue.Url + '/wp-json/gwmp/v1/members', { lat: this.mypos.lat, long: this.mypos.lng, nearme: this.searchParams.nearMe, distance: this.searchParams.distance, page: this.searchParams.page, type: this.searchParams.memberType, q: this.searchParams.textQuery, farmmethod: this.searchParams.farmMethod, skillsreq: this.searchParams.skillsReq }).then(function (response) {
	        if (Array.isArray(response.data)) {
	          this.fullmembers = response.data;
	          this.members = response.data;
	          this.rebuildMarkers();
	        } else {
	          console.log("Invalid response : " + response.data);
	          this.fullmembers = [];
	          this.members = [];
	          this.rebuildMarkers();
	        }
	        this.progress = 100;
	      }, function (error) {
	        console.log(error);
	        this.progress = 100;
	      });
	    },
	    filterMembers: function filterMembers() {
	      this.selectedID = -1;
	      if (this.searchParams.nearMe) {
	        this.radius = this.searchParams.distance * 1000;
	      }

	      if (this.searchParams.nearMe && this.mypos.lng == -1 && this.mypos.lat == -1 && navigator.geolocation) {
	        var self = this;
	        console.log("try and geo locate pos since loc is not set yet");
	        navigator.geolocation.getCurrentPosition(function (pos) {
	          console.log(pos);self.mypos.lat = pos.coords.latitude;self.mypos.lng = pos.coords.longitude;self.initialDownload();
	        }, function (err) {
	          console.log("Geo error: " + err);this.initialDownload();
	        });
	      } else {
	        console.log("geoloc disabled, or location already set");
	        this.initialDownload();
	      }
	    },
	    setPosition: function setPosition(ev) {
	      this.mypos.lat = ev.target._latlng.lat;
	      this.mypos.lng = ev.target._latlng.lng;
	      console.log(this.mypos);
	      this.initialDownload();
	    }
	  }

	};

/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 12 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 14 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__
	var __vue_styles__ = {}

	/* styles */
	__webpack_require__(11)

	/* script */
	__vue_exports__ = __webpack_require__(5)

	/* template */
	var __vue_template__ = __webpack_require__(19)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__
	var __vue_styles__ = {}

	/* styles */
	__webpack_require__(14)

	/* script */
	__vue_exports__ = __webpack_require__(6)

	/* template */
	var __vue_template__ = __webpack_require__(21)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
	__vue_options__._scopeId = "data-v-f5779618"

	module.exports = __vue_exports__


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__
	var __vue_styles__ = {}

	/* styles */
	__webpack_require__(12)
	__webpack_require__(13)

	/* script */
	__vue_exports__ = __webpack_require__(7)

	/* template */
	var __vue_template__ = __webpack_require__(20)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
	__vue_options__._scopeId = "data-v-c80fc302"

	module.exports = __vue_exports__


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
	  return _c('div', {
	    attrs: {
	      "id": "app"
	    }
	  }, [_c('MembersLoop')])
	},staticRenderFns: []}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
	  return _c('div', {
	    staticClass: "membersloop"
	  }, [_c('link', {
	    attrs: {
	      "rel": "stylesheet",
	      "href": "https://unpkg.com/leaflet@1.0.2/dist/leaflet.css"
	    }
	  }), _vm._v(" "), _c('div', {
	    staticClass: "r",
	    staticStyle: {
	      "height": "100%"
	    }
	  }, [_c('div', {
	    staticClass: " ",
	    class: {
	      'col-md-6': !_vm.mapOnly, 'col-md-12': _vm.mapOnly
	    }
	  }, [_c('div', {
	    staticClass: "holder hidden-md hidden-lg",
	    staticStyle: {
	      "position": "relative",
	      "top": "0",
	      "bottom": "0",
	      "overflow-y": "hidden",
	      "height": "25vh"
	    }
	  }, [_c('div', {
	    staticClass: "panel panel-noblueforyou"
	  }, [_c('div', {
	    staticClass: "panel-heading"
	  }, [_c('div', {
	    staticClass: "form-group form-inline"
	  }, [_c('label', {
	    attrs: {
	      "for": "q"
	    }
	  }, [_vm._v("Search")]), _vm._v(" "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.textQuery),
	      expression: "searchParams.textQuery"
	    }],
	    attrs: {
	      "id": "q"
	    },
	    domProps: {
	      "value": _vm._s(_vm.searchParams.textQuery)
	    },
	    on: {
	      "change": _vm.filterMembers,
	      "keyup": function($event) {
	        _vm.searchParams.textQuery = $event.target.value;
	        _vm.filterMembers();
	      },
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.searchParams.textQuery = $event.target.value
	      }
	    }
	  }), _vm._v(" "), _c('div', {
	    staticClass: "form-group"
	  }, [_c('br'), _vm._v(" "), _c('label', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (!_vm.showNearBy),
	      expression: "!showNearBy"
	    }]
	  }, [_vm._v("Please allow your browser to access your location for nearby search.")]), _vm._v(" "), _c('label', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.showNearBy),
	      expression: "showNearBy"
	    }]
	  }, [_vm._v("Near By Me")]), _vm._v(" "), _c('input', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.showNearBy),
	      expression: "showNearBy"
	    }, {
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.nearMe),
	      expression: "searchParams.nearMe"
	    }],
	    attrs: {
	      "type": "checkbox"
	    },
	    domProps: {
	      "checked": Array.isArray(_vm.searchParams.nearMe) ? _vm._i(_vm.searchParams.nearMe, null) > -1 : _vm._q(_vm.searchParams.nearMe, true)
	    },
	    on: {
	      "change": [function($event) {
	        var $$a = _vm.searchParams.nearMe,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _vm._i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_vm.searchParams.nearMe = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_vm.searchParams.nearMe = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _vm.searchParams.nearMe = $$c
	        }
	      }, _vm.filterMembers]
	    }
	  }), _vm._v(" "), _c('select', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.searchParams.nearMe),
	      expression: "searchParams.nearMe"
	    }, {
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.distance),
	      expression: "searchParams.distance"
	    }],
	    on: {
	      "change": [function($event) {
	        _vm.searchParams.distance = Array.prototype.filter.call($event.target.options, function(o) {
	          return o.selected
	        }).map(function(o) {
	          var val = "_value" in o ? o._value : o.value;
	          return val
	        })[0]
	      }, _vm.filterMembers]
	    }
	  }, [_c('option', {
	    attrs: {
	      "value": "50"
	    }
	  }, [_vm._v("50km")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "100"
	    }
	  }, [_vm._v("100km")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "250"
	    }
	  }, [_vm._v("250km")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "500"
	    }
	  }, [_vm._v("500km")])])])])])]), _vm._v(" "), (_vm.mapOnly) ? _c('div', {
	    staticClass: "col-md-12",
	    staticStyle: {
	      "height": "55vh"
	    }
	  }, [_c('v-map', {
	    attrs: {
	      "center": _vm.center,
	      "zoom": _vm.zoom
	    },
	    on: {
	      "l-moveend": _vm.filterByMapVis
	    }
	  }, [_c('v-tilelayer', {
	    attrs: {
	      "url": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
	      "attribution": "OpenStreetMap"
	    }
	  }), _vm._v(" "), _c('v-cluster', _vm._l((_vm.markers), function(m, index) {
	    return _c('v-marker', {
	      attrs: {
	        "lat-lng": m.position
	      },
	      on: {
	        "l-click": function($event) {
	          _vm.markerClick(index)
	        }
	      }
	    }, [_c('v-popup', {
	      attrs: {
	        "content": m.title
	      }
	    })])
	  })), _vm._v(" "), _c('v-circlemarker', {
	    attrs: {
	      "radius": _vm.radius,
	      "visible": _vm.searchParams.nearMe,
	      "lat-lng": _vm.mypos,
	      "draggable": true
	    },
	    on: {
	      "l-dragend": _vm.setPosition
	    }
	  })]), _vm._v(" ")]) : _vm._e()]), _vm._v(" "), _c('div', {
	    staticClass: "holder hidden-xs hidden-sm",
	    staticStyle: {
	      "position": "relative",
	      "top": "0",
	      "bottom": "0",
	      "overflow-y": "auto",
	      "height": "85vh"
	    }
	  }, [_c('div', {
	    staticClass: "panel panel-noblueforyou"
	  }, [_c('div', {
	    staticClass: "panel-heading"
	  }, [_c('div', {
	    staticClass: "form-group form-inline"
	  }, [_c('label', {
	    attrs: {
	      "for": "q"
	    }
	  }, [_vm._v("Search")]), _vm._v(" "), _c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.textQuery),
	      expression: "searchParams.textQuery"
	    }],
	    attrs: {
	      "id": "q"
	    },
	    domProps: {
	      "value": _vm._s(_vm.searchParams.textQuery)
	    },
	    on: {
	      "change": _vm.filterMembers,
	      "keyup": function($event) {
	        _vm.searchParams.textQuery = $event.target.value;
	        _vm.filterMembers();
	      },
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.searchParams.textQuery = $event.target.value
	      }
	    }
	  }), _vm._v(" "), _c('label', [_vm._v("Member Type")]), _vm._v(" "), _c('select', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.memberType),
	      expression: "searchParams.memberType"
	    }],
	    on: {
	      "change": [function($event) {
	        _vm.searchParams.memberType = Array.prototype.filter.call($event.target.options, function(o) {
	          return o.selected
	        }).map(function(o) {
	          var val = "_value" in o ? o._value : o.value;
	          return val
	        })[0]
	      }, _vm.filterMembers]
	    }
	  }, [_c('option', {
	    attrs: {
	      "value": "host"
	    }
	  }, [_vm._v("Host")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "wwoofer"
	    }
	  }, [_vm._v("WWOOFER")])]), _vm._v(" "), _c('label', [_vm._v("Farming Method")]), _vm._v(" "), _c('select', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.farmMethod),
	      expression: "searchParams.farmMethod"
	    }],
	    on: {
	      "change": [function($event) {
	        _vm.searchParams.farmMethod = Array.prototype.filter.call($event.target.options, function(o) {
	          return o.selected
	        }).map(function(o) {
	          var val = "_value" in o ? o._value : o.value;
	          return val
	        })[0]
	      }, _vm.filterMembers]
	    }
	  }, [_c('option', {
	    attrs: {
	      "value": ""
	    }
	  }, [_vm._v("Any")]), _vm._v(" "), _c('option', [_vm._v("Organic")]), _vm._v(" "), _c('option', [_vm._v("Permaculture")]), _vm._v(" "), _c('option', [_vm._v("Biodynamic")])]), _vm._v(" "), _c('div', {
	    staticClass: "form-group"
	  }, [_c('label', [_vm._v("Skills Required")]), _c('br'), _vm._v(" "), _vm._l((_vm.SkillTypes), function(s) {
	    return _c('div', {
	      staticClass: "form-group"
	    }, [_c('input', {
	      directives: [{
	        name: "model",
	        rawName: "v-model",
	        value: (_vm.searchParams.skillsReq),
	        expression: "searchParams.skillsReq"
	      }],
	      attrs: {
	        "type": "checkbox",
	        "id": s
	      },
	      domProps: {
	        "value": s,
	        "checked": Array.isArray(_vm.searchParams.skillsReq) ? _vm._i(_vm.searchParams.skillsReq, s) > -1 : _vm._q(_vm.searchParams.skillsReq, true)
	      },
	      on: {
	        "change": [function($event) {
	          var $$a = _vm.searchParams.skillsReq,
	            $$el = $event.target,
	            $$c = $$el.checked ? (true) : (false);
	          if (Array.isArray($$a)) {
	            var $$v = s,
	              $$i = _vm._i($$a, $$v);
	            if ($$c) {
	              $$i < 0 && (_vm.searchParams.skillsReq = $$a.concat($$v))
	            } else {
	              $$i > -1 && (_vm.searchParams.skillsReq = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	            }
	          } else {
	            _vm.searchParams.skillsReq = $$c
	          }
	        }, _vm.filterMembers]
	      }
	    }), _vm._v(" "), _c('label', {
	      attrs: {
	        "for": s
	      }
	    }, [_vm._v(_vm._s(s) + "  ")])])
	  })], true), _vm._v(" "), _c('div', {
	    staticClass: "form-group"
	  }, [_c('br'), _vm._v(" "), _c('label', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (!_vm.showNearBy),
	      expression: "!showNearBy"
	    }]
	  }, [_vm._v("Please allow your browser to access your location for nearby search.")]), _vm._v(" "), _c('label', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.showNearBy),
	      expression: "showNearBy"
	    }]
	  }, [_vm._v("Near By Me")]), _vm._v(" "), _c('input', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.showNearBy),
	      expression: "showNearBy"
	    }, {
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.nearMe),
	      expression: "searchParams.nearMe"
	    }],
	    attrs: {
	      "type": "checkbox"
	    },
	    domProps: {
	      "checked": Array.isArray(_vm.searchParams.nearMe) ? _vm._i(_vm.searchParams.nearMe, null) > -1 : _vm._q(_vm.searchParams.nearMe, true)
	    },
	    on: {
	      "change": [function($event) {
	        var $$a = _vm.searchParams.nearMe,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _vm._i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_vm.searchParams.nearMe = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_vm.searchParams.nearMe = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _vm.searchParams.nearMe = $$c
	        }
	      }, _vm.filterMembers]
	    }
	  }), _vm._v(" "), _c('select', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.searchParams.nearMe),
	      expression: "searchParams.nearMe"
	    }, {
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.searchParams.distance),
	      expression: "searchParams.distance"
	    }],
	    on: {
	      "change": [function($event) {
	        _vm.searchParams.distance = Array.prototype.filter.call($event.target.options, function(o) {
	          return o.selected
	        }).map(function(o) {
	          var val = "_value" in o ? o._value : o.value;
	          return val
	        })[0]
	      }, _vm.filterMembers]
	    }
	  }, [_c('option', {
	    attrs: {
	      "value": "50"
	    }
	  }, [_vm._v("50km")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "100"
	    }
	  }, [_vm._v("100km")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "250"
	    }
	  }, [_vm._v("250km")]), _vm._v(" "), _c('option', {
	    attrs: {
	      "value": "500"
	    }
	  }, [_vm._v("500km")])])]), _vm._v(" "), _c('p', [_vm._v("Found: " + _vm._s(_vm.totalCnt) + " Filtered by Map: " + _vm._s(_vm.resultCnt) + " ")]), _vm._v(" "), _c('button', {
	    on: {
	      "click": function($event) {
	        _vm.mapOnly = !_vm.mapOnly
	      }
	    }
	  }, [_vm._v("Toggle List")])])])]), _vm._v(" "), _vm._v(" "), _c('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.progress < 100),
	      expression: "progress < 100"
	    }],
	    staticClass: "col-md-12"
	  }, [_vm._m(0)]), _vm._v(" "), _vm._l((_vm.membersFiltered), function(m, index) {
	    return (!_vm.mapOnly) ? _c('div', {
	      directives: [{
	        name: "show",
	        rawName: "v-show",
	        value: (_vm.progress == 100),
	        expression: "progress == 100"
	      }],
	      staticClass: "col-md-6 col-sm-12 hidden-sm hidden-xs"
	    }, [_c('div', {
	      staticClass: "hover panel panel-info mem-panel",
	      class: {
	        selected: m.isSelected
	      }
	    }, [_c('div', {
	      staticClass: "panel-heading mem-profile-panel",
	      style: ({
	        backgroundImage: 'url(' + m.cover + ')'
	      })
	    }), _vm._v(" "), _c('div', {
	      staticClass: "panel-body",
	      staticStyle: {
	        "height": "120px",
	        "overflow": "hidden",
	        "margin-bottom": "30px"
	      }
	    }, [_c('a', {
	      attrs: {
	        "href": m.url
	      }
	    }, [_c('h3', {
	      staticClass: "v-title",
	      staticStyle: {
	        "margin": "0px"
	      }
	    }, [_vm._v(_vm._s(m.name))])]), _vm._v(" "), _c('p', {
	      directives: [{
	        name: "show",
	        rawName: "v-show",
	        value: (m.desc != false),
	        expression: "m.desc != false"
	      }],
	      domProps: {
	        "innerHTML": _vm._s(m.desc)
	      }
	    }), _vm._v(" "), _c('button', {
	      staticClass: "btn btn-success btn-view",
	      staticStyle: {
	        "position": "absolute",
	        "bottom": "25px",
	        "right": "42%"
	      },
	      attrs: {
	        "href": m.url
	      }
	    }, [_vm._v("View")]), _vm._v(" "), _c('div', {
	      staticClass: "active",
	      style: ({
	        width: m.result + '%'
	      })
	    }, _vm._l((m.count), function(n) {
	      return _c('span', {
	        staticClass: "fa star"
	      })
	    }))])])]) : _vm._e()
	  }), _vm._v(" "), _c('div', {
	    staticClass: "col-sm-12 form-group"
	  }, [_c('button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.paginationCur > 1),
	      expression: "paginationCur > 1"
	    }],
	    staticStyle: {
	      "float": "left"
	    },
	    on: {
	      "click": function($event) {
	        _vm.paginationCur -= 1;
	      }
	    }
	  }, [_vm._v("Previous Page")]), _vm._v(" "), _c('span', [_vm._v("Page: " + _vm._s(_vm.paginationCur))]), _vm._v(" "), _c('button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (((_vm.paginationCur * 8) + 1) < _vm.resultCnt),
	      expression: "((paginationCur * 8) + 1) < resultCnt "
	    }],
	    staticStyle: {
	      "float": "right"
	    },
	    on: {
	      "click": function($event) {
	        _vm.paginationCur += 1;
	      }
	    }
	  }, [_vm._v("Next Page")])]), _vm._v(" "), (_vm.mapOnly) ? _c('div', {
	    staticClass: "col-md-12",
	    staticStyle: {
	      "height": "55vh"
	    }
	  }, [_c('v-map', {
	    attrs: {
	      "center": _vm.center,
	      "zoom": _vm.zoom
	    },
	    on: {
	      "l-moveend": _vm.filterByMapVis
	    }
	  }, [_c('v-tilelayer', {
	    attrs: {
	      "url": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
	      "attribution": "OpenStreetMap"
	    }
	  }), _vm._v(" "), _c('v-cluster', _vm._l((_vm.markers), function(m, index) {
	    return _c('v-marker', {
	      attrs: {
	        "lat-lng": m.position
	      },
	      on: {
	        "l-click": function($event) {
	          _vm.markerClick(index)
	        }
	      }
	    }, [_c('v-popup', {
	      attrs: {
	        "content": m.title
	      }
	    })])
	  })), _vm._v(" "), _c('v-circlemarker', {
	    attrs: {
	      "radius": _vm.radius,
	      "visible": _vm.searchParams.nearMe,
	      "lat-lng": _vm.mypos,
	      "draggable": true
	    },
	    on: {
	      "l-dragend": _vm.setPosition
	    }
	  })]), _vm._v(" ")]) : _vm._e()], true)]), _vm._v(" "), (!_vm.mapOnly) ? _c('div', {
	    staticClass: "col-md-6",
	    staticStyle: {
	      "height": "85vh"
	    }
	  }, [_c('v-map', {
	    attrs: {
	      "center": _vm.center,
	      "zoom": _vm.zoom
	    },
	    on: {
	      "l-moveend": _vm.filterByMapVis
	    }
	  }, [_c('v-tilelayer', {
	    attrs: {
	      "url": "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
	      "attribution": "OpenStreetMap"
	    }
	  }), _vm._v(" "), _c('v-cluster', _vm._l((_vm.markers), function(m, index) {
	    return _c('v-marker', {
	      attrs: {
	        "lat-lng": m.position
	      },
	      on: {
	        "l-click": function($event) {
	          _vm.markerClick(index)
	        }
	      }
	    }, [_c('v-popup', {
	      attrs: {
	        "content": m.title
	      }
	    })])
	  })), _vm._v(" "), _c('v-marker', {
	    attrs: {
	      "visible": _vm.searchParams.nearMe,
	      "lat-lng": _vm.mypos,
	      "draggable": true
	    },
	    on: {
	      "l-dragend": _vm.setPosition
	    }
	  }), _vm._v(" "), _c('v-circle', {
	    attrs: {
	      "radius": _vm.radius,
	      "visible": _vm.searchParams.nearMe,
	      "lat-lng": _vm.mypos
	    }
	  })]), _vm._v(" ")]) : _vm._e()])])
	},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
	  return _c('div', {
	    staticClass: "cssload-wrap"
	  }, [_c('div', {
	    staticClass: "cssload-container"
	  }, [_c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  }), _vm._v(" "), _c('span', {
	    staticClass: "cssload-dots"
	  })])])
	}]}

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
	  return _c('div', {
	    staticClass: "hello"
	  }, [_c('h1', [_vm._v(_vm._s(_vm.msg))]), _vm._v(" "), _c('h2', [_vm._v("Essential Links")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('h2', [_vm._v("Ecosystem")]), _vm._v(" "), _vm._m(1)])
	},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
	  return _c('ul', [_c('li', [_c('a', {
	    attrs: {
	      "href": "https://vuejs.org",
	      "target": "_blank"
	    }
	  }, [_vm._v("Core Docs")])]), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "https://forum.vuejs.org",
	      "target": "_blank"
	    }
	  }, [_vm._v("Forum")])]), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "https://gitter.im/vuejs/vue",
	      "target": "_blank"
	    }
	  }, [_vm._v("Gitter Chat")])]), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "https://twitter.com/vuejs",
	      "target": "_blank"
	    }
	  }, [_vm._v("Twitter")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "http://vuejs-templates.github.io/webpack/",
	      "target": "_blank"
	    }
	  }, [_vm._v("Docs for This Template")])])])
	},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
	  return _c('ul', [_c('li', [_c('a', {
	    attrs: {
	      "href": "http://router.vuejs.org/",
	      "target": "_blank"
	    }
	  }, [_vm._v("vue-router")])]), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "http://vuex.vuejs.org/",
	      "target": "_blank"
	    }
	  }, [_vm._v("vuex")])]), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "http://vue-loader.vuejs.org/",
	      "target": "_blank"
	    }
	  }, [_vm._v("vue-loader")])]), _vm._v(" "), _c('li', [_c('a', {
	    attrs: {
	      "href": "https://github.com/vuejs/awesome-vue",
	      "target": "_blank"
	    }
	  }, [_vm._v("awesome-vue")])])])
	}]}

/***/ }
]);