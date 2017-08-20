// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
//import * as VueGoogleMaps from 'vue2-google-maps'
import * as Vue2Leaflet from 'vue2-leaflet'
import LoadingBar from 'vue2-loading-bar';
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);
Vue.component('v-progress',LoadingBar);
/*Vue.use(VueGoogleMaps,{ 
  load: {
    key: "AIzaSyAPssS3qIlI3v98pncz082mpwYgCTP4iUU",
    //v: "3.2.6",
    libraries: 'places'
  }
});*/
Vue.component('v-map',Vue2Leaflet.Map);
Vue.component('v-tilelayer',Vue2Leaflet.TileLayer);
Vue.component('v-marker',Vue2Leaflet.Marker);
Vue.component('v-group',Vue2Leaflet.LayerGroup);
Vue.component('v-popup',Vue2Leaflet.Popup);
Vue.component('v-cluster',Vue2Leaflet.Cluster)
Vue.component('v-circle',Vue2Leaflet.Circle);
Vue.filter('json', x=> JSON.stringify(x));
Vue.use(VueResource);
/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
