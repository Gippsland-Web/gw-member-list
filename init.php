<?php
/*
Plugin Name: GW Members Page
Plugin URI: /
Description: Custom member search page
Version: 1.3.1.1
Author: GippslandWeb
Author URI: http://www.gippslandweb.com.au
GitHub Plugin URI: Gippsland-Web/gw-member-list
*/


//register js/css for loading when shortcode is used
function gwmp_register_styles() {
	wp_register_style("vue-members",plugins_url('/css/app.css',__FILE__),array(),"1.0.0","all");
	wp_register_script('vue-m',plugins_url('/js/manifest.js',__FILE__),array(),"1.0.0",true);
	wp_register_script('vue-v',plugins_url('/js/vendor.js',__FILE__),array(),"1.0.0",true);

	wp_register_script('gw-vue',plugins_url('/js/app.js',__FILE__),array(),"1.0.0",true);

}
add_action( 'wp_enqueue_scripts', 'gwmp_register_styles' );

//render the vue element
function gwmp_full_page_shortcode() {
	wp_enqueue_style('vue-members');
	wp_enqueue_script('vue-m');
	wp_enqueue_script('vue-v');
    wp_localize_script("gw-vue","gwVue",array('Url' => site_url(), "nonce" => wp_create_nonce('gw-vue-search')));


	wp_enqueue_script('gw-vue');
	wp_dequeue_script('google-maps');
	return '<div id="app"></div>';
}
add_shortcode("gw-member-search",'gwmp_full_page_shortcode');


function gwmp_include() {

}

//Register some rest routes for vue to use
function gwmp_get_members($request) {
	 /*   bp_has_members("per_page=20000");
		$cnt = 0;
	while(bp_members()) {
		bp_the_member();
		global $members_template;
        global $wpdb;
        if($wpdb->get_row("SELECT * from wppl_friends_locator WHERE member_id = ".$members_template->member->ID) == null)
            $wpdb->insert('wppl_friends_locator',array("member_id" => $members_template->member->ID,'lat'=> -35.1 +randf(),'long'=> 142.1 + randf() ),array('%d','%f','%f'));
		$cnt += 1;
	}*/

	//echo($cnt);
	//return;

	
	//filter members and return data
	$query = "";
	$includes = NULL;
	global $wpdb;

	if($request["nearme"] == true) {
		//$me = $wpdb->get_row("SELECT * from wppl_friends_locator WHERE member_id = ".get_current_user_id());
		$me = new \stdClass();
		if(isset($_COOKIE['gmw_lat']) && isset($_COOKIE['gmw_lng'])){
			$me->lat = $_COOKIE['gmw_lat'];
			$me->long = $_COOKIE['gmw_lng'];
		}
		if($request['lat'] != -1 && $request['long'] != -1) {
			$me->lat = $request['lat'];
			$me->long = $request['long'];
		}

		$dist = $request["distance"];
		$q = $wpdb->prepare(
			"SELECT `member_id`, `lat`, `long`, ROUND( 6371 * acos( cos( radians( %f ) ) * cos( radians( wppl_friends_locator.lat ) ) * cos( radians( wppl_friends_locator.long ) - radians( %f ) ) + sin( radians( %f ) ) * sin( radians( wppl_friends_locator.lat) ) ),1 ) AS distance FROM `wppl_friends_locator`  
		HAVING `distance` < %d ORDER BY `distance` ASC",$me->lat,$me->long,$me->lat,$dist);
		
		$includes = $wpdb->get_col($q);
		if(count($includes) == 0)
		return;
	}


	if(strlen($request["farmmethod"]) > 3){
			if($includes == NULL)
				$includes = my_custom_ids("Farming methods",$request["farmmethod"]);	
				else {
					$res = array();
					foreach(my_custom_ids("Farming methods",$request["farmmethod"]) as $kv) {
						if(in_array($kv,$includes))
							array_push($res,$kv);
					}
					$includes = $res;
				}
			if($includes == NULL)
			return;
	}
	if(count($request["skillsreq"]) > 0){
			if($includes == NULL)
				$includes = my_custom_ids("Skills required",$request['skillsreq']);	
				else {
					$res = array();
					foreach(my_custom_ids("Skills required",$request['skillsreq']) as $kv) {
						if(in_array($kv,$includes))
							array_push($res,$kv);
					}
					$includes = $res;
				}
			if($includes == NULL)
				return;
	}
	if(count($request["diet"]) > 0){
			if($includes == NULL)
				$includes = my_custom_ids("Cater for",$request['diet']);	
				else {
					$res = array();
					foreach(my_custom_ids("Cater for",$request['diet']) as $kv) {
						if(in_array($kv,$includes))
							array_push($res,$kv);
					}
					$includes = $res;
				}
			if($includes == NULL)
				return;
	}
	if(count($request["staylength"]) > 0){
			if($includes == NULL)
				$includes = my_custom_ids("Preferred length of Stay",$request['staylength']);	
				else {
					$res = array();
					foreach(my_custom_ids("Preferred length of Stay",$request['staylength']) as $kv) {
						if(in_array($kv,$includes))
							array_push($res,$kv);
					}
					$includes = $res;
				}
			if($includes == NULL)
				return;
	}

	if(count($includes) > 0) {
		$query = 'include=' . implode(",", $includes);
	}


	if(strlen($request["q"]) > 3)
		$query = $query."search_terms=".$request["q"];
	


	$members = array();
	$q = "per_page=3000&page={$request['page']}&member_type={$request['type']}&{$query}";

	$hash = md5($q);
	$res = get_transient('gw_m'.$hash);
	if(!empty($res)) {
		$response = new WP_REST_Response(json_decode($res));//json_decode(file_get_contents(wp_upload_dir()['basedir'].'/'.$hash.'.json' )));
		//$response->header("Access-Control-Allow-Origin","http://localhost:8081");
		return $response;
	}

	if(!bp_has_members($q))
		return "No members for type {$q}";
	while(bp_members()) {
		bp_the_member();
		global $members_template;




		$displayed_user = $members_template->member->ID;
		$mem = new \stdClass();
		$mem->type = bp_get_member_type($displayed_user);
		
		if($mem->type =="host")
			$mem->desc = bp_get_profile_field_data(['field'=> 'Short Property Description', 'user_id' => $displayed_user]);
		else
			$mem->desc = bp_get_profile_field_data(['field'=> 'Why I joined WWOOF', 'user_id' => $displayed_user]);
		if(bp_get_profile_field_data(['field'=> 'Property Name', 'user_id' => $displayed_user]) != false)
			$mem->name = bp_get_profile_field_data(['field'=> 'Property Name', 'user_id' => $displayed_user]);
		else
			$mem->name = bp_get_member_name();// bp_get_profile_field_data("field='Property Name'")


		if(strlen($mem->desc) > 140)
			$mem->desc = substr($mem->desc,0,140);
		//$mem->farmmethod = bp_get_profile_field_data(['field'=> 'Farming methods', 'user_id' => $displayed_user]);
		//$mem->skillsreq = bp_get_profile_field_data(['field'=> 'Skills required', 'user_id' => $displayed_user]);
		//$mem->acomtype = bp_get_profile_field_data(['field'=> 'Accommodation', 'user_id' => $displayed_user]);
		$mem->url = bp_get_member_permalink();
		//$mem->avatar = bp_core_fetch_avatar( 'type=full&html=false&item_id=' . $members_template->member->ID );//bp_get_member_avatar("html=false");
		$mem->cover = bp_attachments_get_attachment('url', array(
          'object_dir' => 'members',
          'item_id' => $displayed_user,
        ));
		if(strlen($mem->cover) < 1 || $mem->cover == false || $mem->cover == "false"){
			$mem->cover = "/wp-content/uploads/2017/04/profile-banner-placeholder2.jpg";
		}
			

			

        //get the information of the user from database
		global $wpdb;
        $location       = $wpdb->get_row($wpdb->prepare( "SELECT * FROM wppl_friends_locator WHERE member_id = %s", $displayed_user ) );
		if(isset($location)) {
		$mem->position = new \stdClass();
		$mem->position->lat = $location->lat;
		$mem->position->lng = $location->long;
		}
/*BP_User_Reviews::calc_rating($members_template->member->ID);
            $rating = get_user_meta($members_template->member->ID, 'bp-user-reviews', true);

			if(isset($rating["result"], $rating["count"])) {
			$mem->result = $rating["result"];
			$mem->count = $rating["count"];
			}
			else {
				$mem->result = 0;
			$mem->count = 0;
			}


*/		
$mem->name = utf8ize($mem->name);
$mem->desc = utf8ize($mem->desc);
		if(isset($location))
		array_push($members,$mem);
	}
	$response = new WP_REST_Response($members);
	//$response->header("Access-Control-Allow-Origin","http://localhost:8081");


	set_transient('gw_m'.$hash,json_encode($members),60*60);
	return $response;// json_encode($members);
}

add_action('rest_api_init',function() {
	register_rest_route('gwmp/v1','/members',array('methods'=>'POST','callback' => 'gwmp_get_members',
	'permission_callback' => function () {
					return true;
	}
	));
});




function utf8ize($mixed) {
if (is_array($mixed)) {
    foreach ($mixed as $key => $value) {
        $mixed[$key] = utf8ize($value);
    }
} else if (is_string ($mixed)) {
    return utf8_encode($mixed);
}
return $mixed;
}


function my_custom_ids( $field_name, $field_value = '' ) {
	if ( empty( $field_name ) )
		return 'Empty Name';
	global $wpdb;
	$field_id = xprofile_get_field_id_from_name( $field_name ); 
	if ( !empty( $field_id ) ) 
		$query = "SELECT user_id FROM " . $wpdb->prefix . "bp_xprofile_data WHERE field_id = " . $field_id;
	else
		return 'Field not found';
	if ( $field_value != '' ) {
		if(is_array($field_value)){
			foreach($field_value as $fv) {
				$query .= " AND value LIKE '%" . $fv . "%'";
			}
		}
		else
			$query .= " AND value LIKE '%" . $field_value . "%'";

	} 
	/* 
	LIKE is slow. If you're sure the value has not been serialized, you can do this:
	$query .= " AND value = '" . $field_value . "'";
	*/

	$custom_ids = $wpdb->get_col( $query );
	if ( !empty( $custom_ids ) ) {
		return $custom_ids;
	// convert the array to a csv string
		$custom_ids_str = 'include=' . implode(",", $custom_ids);
		return $custom_ids_str;
	}
	else
		return NULL;

}