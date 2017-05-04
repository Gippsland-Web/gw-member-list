<template>
<div class="membersloop">
     <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" crossorigin="anonymous"> -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" />
    <div class="r" style="height:100%">
        
        <div v-bind:class="{ 'col-md-6' : !mapOnly, 'col-md-12': mapOnly } " class=" " >

            <div class="holder hidden-md hidden-lg" style="position:relative;top:0;bottom:0;overflow-y:hidden;height:25vh;">
                <div class="panel panel-noblueforyou">
                    <div class="panel-heading">
                        
                        <div class="form-group form-inline">
                            <label for="q">Search</label> <input id="q" v-model="searchParams.textQuery" v-on:change="filterMembers" v-on:keyup="searchParams.textQuery = $event.target.value; filterMembers();">
                            
							                          
                            
					<div class="form-group">
					<br>
					<label v-show="!showNearBy">Please allow your browser to access your location for nearby search.</label>
						<label v-show="showNearBy">Near By Me</label>
						<input v-show="showNearBy" type="checkbox" v-model="searchParams.nearMe" v-on:change="filterMembers">
						<select v-show="searchParams.nearMe" v-model="searchParams.distance" v-on:change="filterMembers">
							<option value=50>50km</option>
							<option value=100>100km</option>
							<option value=250>250km</option>
							<option value=500>500km</option>
						</select>
					</div>
							</div>
                        
                    </div>
                </div>


 <div v-if="mapOnly" class="col-md-12" style="height:55vh;">
            <v-map :center="center" :zoom="zoom" v-on:l-moveend="filterByMapVis">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution="OpenStreetMap"></v-tilelayer>
                <v-cluster>
                    <v-marker v-for="(m, index) in markers" :lat-lng="m.position" @l-click="markerClick(index)">
                        <v-popup :content="m.title"> </v-popup>
                    </v-marker>
                </v-cluster>
								<v-circlemarker :radius="radius" :visible="searchParams.nearMe" :lat-lng="mypos" :draggable="true" @l-dragend="setPosition"> </v-circlemarker>
            </v-map>
            <!-- <gmap-map :center="center" :zoom="7" @bounds_changed="filterByMapVis($event)">
                <gmap-cluster>
                <gmap-marker v-for="m in markers" :position="m.position" :clickable="true" @click="m.ifw= !m.ifw">
                <gmap-info-window :opened="m.ifw" :content="m.ifw2text"></gmap-info-window>
                </gmap-marker>
                </gmap-cluster>
                </gmap-map> -->
  </div>
            </div>






            <div class="holder hidden-xs hidden-sm" style="position:relative;top:0;bottom:0;overflow-y:auto;height:85vh;">
                <div class="panel panel-noblueforyou">
                    <div class="panel-heading">
                        
                        <div class="form-group form-inline">
                            <label for="q">Search</label> <input id="q" v-model="searchParams.textQuery" v-on:change="filterMembers" v-on:keyup="searchParams.textQuery = $event.target.value; filterMembers();">
                            
							<label>Member Type</label>
                            <select v-model="searchParams.memberType" v-on:change="filterMembers">
                                <option value="host">Host</option>
                                <option value="wwoofer">WWOOFER</option>
                            </select>
                            <label>Farming Method</label>
                            <select v-model="searchParams.farmMethod" v-on:change="filterMembers">
                                <option value="">Any</option>
                                <option>Organic</option>
                                <option>Permaculture</option>
                                <option>Biodynamic</option>
                            </select>
                            <div class="form-group">
                                <label>Skills Required</label><br>
                                <div class="form-group" v-for="s in SkillTypes">
                                    <input type="checkbox" :id="s" :value="s" v-model="searchParams.skillsReq" v-on:change="filterMembers">
                                    <label :for="s">{{s}} &nbsp</label>
                                </div>
                            </div>
														<div class="form-group">
														<br>
														<label v-show="!showNearBy">Please allow your browser to access your location for nearby search.</label>
															<label v-show="showNearBy">Near By Me</label>
															<input v-show="showNearBy" type="checkbox" v-model="searchParams.nearMe" v-on:change="filterMembers">
															<select v-show="searchParams.nearMe" v-model="searchParams.distance" v-on:change="filterMembers">
																<option value=50>50km</option>
																<option value=100>100km</option>
																<option value=250>250km</option>
																<option value=500>500km</option>
															</select>
														</div>
                            <p>Found: {{totalCnt}} Filtered by Map: {{resultCnt}} </p>
														<button @click="mapOnly = !mapOnly">Toggle List</button>
							</div>
                        
                    </div>
                </div>
                <!--member loop -->
                <div class="col-md-12" v-show="progress < 100">
                    <div class="cssload-wrap">
                        <div class="cssload-container">
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                            <span class="cssload-dots"></span>
                        </div>
                    </div>
                </div>
                <div v-if="!mapOnly" class="col-md-6 col-sm-12 hidden-sm hidden-xs" v-for="(m, index) in membersFiltered" v-show="progress == 100">
                    
					<div class="hover panel panel-info mem-panel" v-bind:class="{selected: m.isSelected}">
                        <div class="panel-heading mem-profile-panel" v-bind:style="{ backgroundImage: 'url(' + m.cover + ')' }">
                        </div>
                        <div class="panel-body" style="height:120px;overflow:hidden;margin-bottom:30px">
							<a v-bind:href="m.url"> <h3 class="v-title" style="margin:0px;">{{m.name}}</h3></a>
                            <p v-show="m.desc != false" v-html="m.desc"></p>
                            <button v-bind:href="m.url" class="btn btn-success btn-view" style="position: absolute;bottom: 25px;right: 42%;">View</button>
                            <div class="active" v-bind:style="{width: m.result +'%'}">
                                <span v-for="n in m.count" class="fa star"></span>
                            </div>
                        </div>
					</div>

                </div>
                <div class="col-sm-12 form-group">
                    <button style="float:left;" v-show="paginationCur > 1" v-on:click="paginationCur -= 1;">Previous Page</button>
                    <span>Page: {{paginationCur}}</span>
                    <button style="float:right;" v-show="((paginationCur * 8) + 1) < resultCnt " v-on:click="paginationCur +=1 ; ">Next Page</button>
                </div>


 <div v-if="mapOnly" class="col-md-12" style="height:55vh;">
            <v-map :center="center" :zoom="zoom" v-on:l-moveend="filterByMapVis">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution="OpenStreetMap"></v-tilelayer>
                <v-cluster>
                    <v-marker v-for="(m, index) in markers" :lat-lng="m.position" @l-click="markerClick(index)">
                        <v-popup :content="m.title"> </v-popup>
                    </v-marker>
                </v-cluster>
								<v-circlemarker :radius="radius" :visible="searchParams.nearMe" :lat-lng="mypos" :draggable="true" @l-dragend="setPosition"> </v-circlemarker>
            </v-map>
            <!-- <gmap-map :center="center" :zoom="7" @bounds_changed="filterByMapVis($event)">
                <gmap-cluster>
                <gmap-marker v-for="m in markers" :position="m.position" :clickable="true" @click="m.ifw= !m.ifw">
                <gmap-info-window :opened="m.ifw" :content="m.ifw2text"></gmap-info-window>
                </gmap-marker>
                </gmap-cluster>
                </gmap-map> -->
  </div>
            </div>
        </div>
        


        <div v-if="!mapOnly" class="col-md-6" style="height:85vh;">
            <v-map :center="center" :zoom="zoom" v-on:l-moveend="filterByMapVis">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution="OpenStreetMap"></v-tilelayer>
                <v-cluster>
                    <v-marker v-for="(m, index) in markers" :lat-lng="m.position" @l-click="markerClick(index)">
                        <v-popup :content="m.title"> </v-popup>
                    </v-marker>
                </v-cluster>
								<v-marker :visible="searchParams.nearMe" :lat-lng="mypos" :draggable="true" @l-dragend="setPosition"> </v-marker>
								<v-circle :radius="radius" :visible="searchParams.nearMe" :lat-lng="mypos" > </v-circle>
            </v-map>
            <!-- <gmap-map :center="center" :zoom="7" @bounds_changed="filterByMapVis($event)">
                <gmap-cluster>
                <gmap-marker v-for="m in markers" :position="m.position" :clickable="true" @click="m.ifw= !m.ifw">
                <gmap-info-window :opened="m.ifw" :content="m.ifw2text"></gmap-info-window>
                </gmap-marker>
                </gmap-cluster>
                </gmap-map> -->
        </div>




    </div>
</div>
</template>
<style>
gmap-map {
  width:100%;
  height:100%;
  display:block;
}
.mem-profile-panel {
          height:150px;
          background-position:center;
          background-size:cover;
        }

</style>
<script>

//  import Cluster from './Cluster.vue';
  import _ from 'lodash';


  export default {
    name: 'membersloop',
    components: {
      //Cluster

    },
    data: function () {
      return {
        members: [],
        searchParams: { textQuery: "", memberType: "host", farmMethod: "Any",skillsReq:[], page: 1,nearMe: false,distance: 50 },
        center: { lat: -38, lng: 144 },
        markers: [],
        fullmembers: [],
        bounds: {},
        paginationCur: 1,
        progress: 1,
				mypos: { lat: -1,lng: -1 },
				SkillTypes: ["General Gardening","Weeding","Pruning","Animal Care"
				,"Building","Fencing","Dairy","Bee Keeping","Engineering","Mechanical"],
				selectedID: -1,

				mapOnly: false,
				listOnly: false,
				radius: 10,
				zoom: 5,
      };

    },
    mounted: function () {
      this.$nextTick(function () {
        var self = this;

        this.initialDownload();
      })
    },

    computed: {
		  showNearBy: function() {
				return true;
				/*if(this.$cookies.isKey('gmw_lat') && this.$cookies.isKey('gmw_lng'))
					return true;
				return false;*/
			},
      resultCnt: function () {
        return this.members.length;
      },
      totalCnt: function () {
        return this.fullmembers.length;
      },
      membersFiltered: function () {
        //filter by our dropdowns/checkboxes etc
        //console.log("computed " + this.searchParams.farmMethod);
        // var self = this;
        //var res = this.members.filter(function(b){ 
        // console.log("BBB: " + b.data);
        /* if(self.searchParams.textQuery.length > 3 && !JSON.stringify(b).toLowerCase().includes(self.searchParams.textQuery.toLowerCase()))
         return false;
         if(self.searchParams.farmMethod.length > 3)
           if(_.findIndex(b.farmmethod,(o) => { return o == self.searchParams.farmMethod; }) == -1)
             return false;*/
        //  return true;

        //  });
        // this.members = res;
        //this.rebuildMarkers();

var res = this.members.slice(this.paginationCur - 1, this.paginationCur + 7);
res.forEach((item,index) => {
	item.isSelected = false;
});
if(this.selectedID != -1) {
	var selectedMem = this.fullmembers[this.selectedID];
	if(_.indexOf(res,selectedMem) == -1) {
		res.splice(0,1);
		selectedMem.isSelected = true;
		res.splice(0,0,selectedMem);
	}
	else {
		res[_.indexOf(res,selectedMem)].isSelected = true;
	}
}

		return res;
				
				if(this.selectedID != -1 && (this.selectedID > this.paginationCur + 7 || this.selectedID < this.paginationCur -1)) {
					//add selected item to return results;
					var res = this.members.slice(this.paginationCur - 1, this.paginationCur + 6);
				//	console.log(res);
					res.splice(0,0,this.fullmembers[this.selectedID]);
				//	console.log(res);
					return res;
				}
        return this.members.slice(this.paginationCur - 1, this.paginationCur + 7);

      }
    },
    methods: {
				isItemSelected: function(index) {
					//console.log("checking : " + index + "against: " + this.selectedID);
				return ((this.selectedID == index) ? 'selected-item' : '');
			},
      filterByMapVis: function (event) {
        //console.log("woo");


        if (event != null && event.target != null) {
          //console.log(event.target.getBounds());
          // this.members = [];
          this.members = this.fullmembers.filter(function (item) {
            var pos = { lat: Number(item.position.lat), lng: Number(item.position.lng) };
            if (event.target.getBounds().contains([pos.lat, pos.lng]))
              return true;

            return false;

          });

        }
        else {

        }
        //console.log(this.fullmembers.length + " total");
        //console.log(this.members.length + " visible");
        //this.rebuildMarkers();

      },
      rebuildMarkers: function () {
        this.markers.length = 0;// = [];
        console.log("Doing markers");
        for (var i = 0; i < this.fullmembers.length; i++) {
					var locMember = this.fullmembers[i];
          var loc = locMember.position;

          var pos = { lat: Number(loc.lat), lng: Number(loc.lng) };

					var content = "<h3>" +locMember.name +"</h3><p>" + locMember.desc + "...</p><a href='" + locMember.url + "'>View</a>";
					if(locMember.cover != false)
						content = "<img src='" + locMember.cover + "'</img>" + content;
          this.markers.push({
            position: pos,
						title: content,
            //title: this.fullmembers[i].name,
						memberid: i
          });

          //console.log("added " + loc);
        }
      },
			markerClick: function(index) {
				console.log(index);
				this.selectedID = index;
			},
      initialDownload: function () {
        this.progress = 0;
        this.searchParams.page = 1;
				this.paginationCur = 1;
        this.$http.post(gwVue.Url + '/wp-json/gwmp/v1/members', { lat: this.mypos.lat,long: this.mypos.lng, nearme: this.searchParams.nearMe, distance: this.searchParams.distance, page: this.searchParams.page, type: this.searchParams.memberType, q: this.searchParams.textQuery, farmmethod: this.searchParams.farmMethod, skillsreq: this.searchParams.skillsReq }).then(function (response) {
          //console.log(response);
          // this.data.members = response.data;
          if (Array.isArray(response.data)) {
            this.fullmembers = response.data;
            this.members = response.data;
            this.rebuildMarkers();
          }
          else {
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
      filterMembers: function () {
				this.selectedID = -1;
				if(this.searchParams.nearMe) {
					this.radius = this.searchParams.distance * 1000;
				}

					if(this.searchParams.nearMe && this.mypos.lng == -1 && this.mypos.lat == -1 && navigator.geolocation) {
						var self = this;
						console.log("try and geo locate pos since loc is not set yet");
						navigator.geolocation.getCurrentPosition(
							function(pos){ console.log(pos); self.mypos.lat = pos.coords.latitude; self.mypos.lng = pos.coords.longitude;self.initialDownload(); }, function(err){ console.log("Geo error: " + err); this.initialDownload(); });

					}
					else {
						//this.mypos.lat = -1;
						//this.mypos.lng = -1;
						console.log("geoloc disabled, or location already set");
						this.initialDownload();
					} 
      },
			setPosition: function(ev) {
				this.mypos.lat = ev.target._latlng.lat;
				this.mypos.lng = ev.target._latlng.lng;
				console.log(this.mypos);
				this.initialDownload();
			}
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hover:hover {
background-color:#bce8f1;
}
.selected {
	border: 3px solid red;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

h3 {
	color:#D32F2F;
	font-size:15px;	
	text-transform: uppercase;
	font-weight: 700;
}
a:hover {
	text-decoration: none;
	color:#D32F2F;
}

.cssload-wrap {
	text-align: center;
	line-height: 195px;
}
	
.cssload-container {
	display: inline-block;
}

.cssload-dots {
	display: inline-block;
	position: relative;
}
.cssload-dots:not(:last-child) {
	margin-right: 9px;
}
.cssload-dots:before, .cssload-dots:after {
	content: "";
	display: inline-block;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	position: absolute;
}
.cssload-dots:nth-child(1):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -1.04s;
		-o-animation-delay: -1.04s;
		-ms-animation-delay: -1.04s;
		-webkit-animation-delay: -1.04s;
		-moz-animation-delay: -1.04s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(1):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -1.04s;
		-o-animation-delay: -1.04s;
		-ms-animation-delay: -1.04s;
		-webkit-animation-delay: -1.04s;
		-moz-animation-delay: -1.04s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(2):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -2.07s;
		-o-animation-delay: -2.07s;
		-ms-animation-delay: -2.07s;
		-webkit-animation-delay: -2.07s;
		-moz-animation-delay: -2.07s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(2):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -2.07s;
		-o-animation-delay: -2.07s;
		-ms-animation-delay: -2.07s;
		-webkit-animation-delay: -2.07s;
		-moz-animation-delay: -2.07s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(3):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -3.11s;
		-o-animation-delay: -3.11s;
		-ms-animation-delay: -3.11s;
		-webkit-animation-delay: -3.11s;
		-moz-animation-delay: -3.11s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(3):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -3.11s;
		-o-animation-delay: -3.11s;
		-ms-animation-delay: -3.11s;
		-webkit-animation-delay: -3.11s;
		-moz-animation-delay: -3.11s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(4):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -4.14s;
		-o-animation-delay: -4.14s;
		-ms-animation-delay: -4.14s;
		-webkit-animation-delay: -4.14s;
		-moz-animation-delay: -4.14s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(4):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -4.14s;
		-o-animation-delay: -4.14s;
		-ms-animation-delay: -4.14s;
		-webkit-animation-delay: -4.14s;
		-moz-animation-delay: -4.14s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(5):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -5.18s;
		-o-animation-delay: -5.18s;
		-ms-animation-delay: -5.18s;
		-webkit-animation-delay: -5.18s;
		-moz-animation-delay: -5.18s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(5):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -5.18s;
		-o-animation-delay: -5.18s;
		-ms-animation-delay: -5.18s;
		-webkit-animation-delay: -5.18s;
		-moz-animation-delay: -5.18s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(6):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -6.21s;
		-o-animation-delay: -6.21s;
		-ms-animation-delay: -6.21s;
		-webkit-animation-delay: -6.21s;
		-moz-animation-delay: -6.21s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(6):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -6.21s;
		-o-animation-delay: -6.21s;
		-ms-animation-delay: -6.21s;
		-webkit-animation-delay: -6.21s;
		-moz-animation-delay: -6.21s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(7):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -7.25s;
		-o-animation-delay: -7.25s;
		-ms-animation-delay: -7.25s;
		-webkit-animation-delay: -7.25s;
		-moz-animation-delay: -7.25s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(7):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -7.25s;
		-o-animation-delay: -7.25s;
		-ms-animation-delay: -7.25s;
		-webkit-animation-delay: -7.25s;
		-moz-animation-delay: -7.25s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(8):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -8.28s;
		-o-animation-delay: -8.28s;
		-ms-animation-delay: -8.28s;
		-webkit-animation-delay: -8.28s;
		-moz-animation-delay: -8.28s;
	background-color: rgb(255,0,0);
}
.cssload-dots:nth-child(8):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -8.28s;
		-o-animation-delay: -8.28s;
		-ms-animation-delay: -8.28s;
		-webkit-animation-delay: -8.28s;
		-moz-animation-delay: -8.28s;
	background-color: rgb(119,119,119);
}
.cssload-dots:nth-child(9):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -9.32s;
		-o-animation-delay: -9.32s;
		-ms-animation-delay: -9.32s;
		-webkit-animation-delay: -9.32s;
		-moz-animation-delay: -9.32s;
	background-color: #F00;
}
.cssload-dots:nth-child(9):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -9.32s;
		-o-animation-delay: -9.32s;
		-ms-animation-delay: -9.32s;
		-webkit-animation-delay: -9.32s;
		-moz-animation-delay: -9.32s;
	background-color: #777;
}
.cssload-dots:nth-child(10):before {
	transform: translateY(-200%);
		-o-transform: translateY(-200%);
		-ms-transform: translateY(-200%);
		-webkit-transform: translateY(-200%);
		-moz-transform: translateY(-200%);
	animation: cssload-animBefore 1.15s linear infinite;
		-o-animation: cssload-animBefore 1.15s linear infinite;
		-ms-animation: cssload-animBefore 1.15s linear infinite;
		-webkit-animation: cssload-animBefore 1.15s linear infinite;
		-moz-animation: cssload-animBefore 1.15s linear infinite;
	animation-delay: -10.35s;
		-o-animation-delay: -10.35s;
		-ms-animation-delay: -10.35s;
		-webkit-animation-delay: -10.35s;
		-moz-animation-delay: -10.35s;
	background-color: #F00;
}
.cssload-dots:nth-child(10):after {
	transform: translateY(200%);
		-o-transform: translateY(200%);
		-ms-transform: translateY(200%);
		-webkit-transform: translateY(200%);
		-moz-transform: translateY(200%);
	animation: cssload-animAfter 1.15s linear infinite;
		-o-animation: cssload-animAfter 1.15s linear infinite;
		-ms-animation: cssload-animAfter 1.15s linear infinite;
		-webkit-animation: cssload-animAfter 1.15s linear infinite;
		-moz-animation: cssload-animAfter 1.15s linear infinite;
	animation-delay: -10.35s;
		-o-animation-delay: -10.35s;
		-ms-animation-delay: -10.35s;
		-webkit-animation-delay: -10.35s;
		-moz-animation-delay: -10.35s;
	background-color: #777;
}




@keyframes cssload-animBefore {
	0% {
		transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	25% {
		transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	50% {
		transform: scale(1) translateY(200%);
		z-index: -1;
	}
	75% {
		transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	100% {
		transform: scale(1) translateY(-200%);
		z-index: -1;
	}
}

@-o-keyframes cssload-animBefore {
	0% {
		-o-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	25% {
		-o-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	50% {
		-o-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	75% {
		-o-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	100% {
		-o-transform: scale(1) translateY(-200%);
		z-index: -1;
	}
}

@-ms-keyframes cssload-animBefore {
	0% {
		-ms-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	25% {
		-ms-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	50% {
		-ms-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	75% {
		-ms-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	100% {
		-ms-transform: scale(1) translateY(-200%);
		z-index: -1;
	}
}

@-webkit-keyframes cssload-animBefore {
	0% {
		-webkit-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	25% {
		-webkit-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	50% {
		-webkit-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	75% {
		-webkit-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	100% {
		-webkit-transform: scale(1) translateY(-200%);
		z-index: -1;
	}
}

@-moz-keyframes cssload-animBefore {
	0% {
		-moz-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	25% {
		-moz-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	50% {
		-moz-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	75% {
		-moz-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	100% {
		-moz-transform: scale(1) translateY(-200%);
		z-index: -1;
	}
}

@keyframes cssload-animAfter {
	0% {
		transform: scale(1) translateY(200%);
		z-index: -1;
	}
	25% {
		transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	50% {
		transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	75% {
		transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	100% {
		transform: scale(1) translateY(200%);
		z-index: 1;
	}
}

@-o-keyframes cssload-animAfter {
	0% {
		-o-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	25% {
		-o-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	50% {
		-o-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	75% {
		-o-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	100% {
		-o-transform: scale(1) translateY(200%);
		z-index: 1;
	}
}

@-ms-keyframes cssload-animAfter {
	0% {
		-ms-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	25% {
		-ms-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	50% {
		-ms-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	75% {
		-ms-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	100% {
		-ms-transform: scale(1) translateY(200%);
		z-index: 1;
	}
}

@-webkit-keyframes cssload-animAfter {
	0% {
		-webkit-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	25% {
		-webkit-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	50% {
		-webkit-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	75% {
		-webkit-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	100% {
		-webkit-transform: scale(1) translateY(200%);
		z-index: 1;
	}
}

@-moz-keyframes cssload-animAfter {
	0% {
		-moz-transform: scale(1) translateY(200%);
		z-index: -1;
	}
	25% {
		-moz-transform: scale(0.7) translateY(0);
		z-index: -1;
	}
	50% {
		-moz-transform: scale(1) translateY(-200%);
		z-index: 1;
	}
	75% {
		-moz-transform: scale(1.3) translateY(0);
		z-index: 1;
	}
	100% {
		-moz-transform: scale(1) translateY(200%);
		z-index: 1;
	}
}
</style>