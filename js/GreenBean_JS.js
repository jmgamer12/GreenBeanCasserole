/* 
 * GreenBean_JS.JS
 * 
 */
 
/******************************************************************************
 * 
 * Object Definitions
 * 
 ******************************************************************************/

/* constructor for goals_t objects */

window.onload=function(){Update_Stuff();};
/* constructor for goals_t objects */
function goal_t(hot_high, high, low, in_area, points)
{
	this.hot_high = hot_high;
    this.high = high;
    this.low = low;
    this.in_area = in_area;
    this.points = points;
}

/* global variables */

/* Penalty Variables */
    var penalty = 0;
    var technical = 0;
    
    var penalty_stack = new Array();

/* autonomous */
    var auto_goals = new Array();
    auto_goals[0] = new goal_t(0,0,0,0,0);
    auto_goals[1] = new goal_t(0,0,0,0,0);

    var auto_starting_ball = 0;
    var auto_floor_ball = 0;
    var auto_in_area = 0;
    
    var auto_score_stack = new Array();

/* teleoperated */
    var tele_goals = new Array();
    tele_goals[0] = new goal_t(0,0,0,0,0);
    tele_goals[1] = new goal_t(0,0,0,0,0);
    
    var tele_front_court = 0;
    var tele_full_court = 0;
    var tele_human_loading = 0;    
    var tele_floor_loading = 0;
    
    var tele_driving = 0;
    var tele_robot_block = 0;
    var tele_robot_block_time = 0;
    var tele_pass_effectiveness_display = 0;
    var tele_truss_throw_effectiveness_display = 0;
    var tele_truss_catch_effectiveness = 0;
    
    var tele_score_stack = new Array();

/******************************************************************************
 * Internal Functions
 *      These functions are to be handled internally in this .js file. Do not 
 *      call these externally.
 ******************************************************************************/

/*
 * Update Scoring Data
 */
function update_data()
{ 
	   /* autonomous data */
        auto_starting_ball = document.getElementById('starting_ball').checked;
        auto_floor_ball = document.getElementById('floor_pickup').checked;
        auto_in_area = document.getElementById('in_area').checked;
    
    /* teleop data */
        tele_front_court = document.frm_shooting_location.shooting_location[0];
        tele_full_court = document.frm_shooting_location.shooting_location[1];

        tele_human_loading = document.frm_loading_location.loading_location[0];
        tele_floor_loading = document.frm_loading_location.loading_location[1];
        
        tele_driving = document.getElementById('driving_ability').value;
        tele_robot_block = document.getElementById('robot_block').value;
        tele_robot_block_time = document.getElementById('robot_block_time').value;
        tele_pass_effectiveness = document.getElementById('robot_pass_effectiveness').value;
        tele_truss_throw_effectiveness = document.getElementById('robot_truss_throw_effectiveness').value;
        tele_truss_catch_effectiveness = document.getElementById('robot_truss_catch_effectiveness').value;

    /* update points */
    update_points();
    
    /* update display */
    disp_update();
}

/* 
 * Updates the page displays
 */
function disp_update()
{
    /* autonomous */
    document.getElementById("auto_pts_display").innerHTML = auto_goals[0].points;   /* points made in auton */
    document.getElementById("auto_miss_display").innerHTML = auto_goals[1].points;  /* points missed in auton */
    
    /* teleop */
    document.getElementById("tele_pts_display").innerHTML = tele_goals[0].points;   /* points made in teleop */
    document.getElementById("tele_miss_display").innerHTML = tele_goals[1].points;  /* points missed in teleop */
    
    
    switch(tele_driving)
    {
        case '0':
            document.getElementById("tele_driving_display").innerHTML = "Little or No Movement";
            break;
        case '1':
            document.getElementById("tele_driving_display").innerHTML = "Poor Driving";
            break;
        case '2':
            document.getElementById("tele_driving_display").innerHTML = "Good Driving";
            break;
        case '3':
            document.getElementById("tele_driving_display").innerHTML = "Exceptional Driving";
            break;
    }
    
    document.getElementById("tele_robot_block_time_display").innerHTML = tele_robot_block_time;
    document.getElementById("tele_pass_effectiveness_display").innerHTML = tele_pass_effectiveness + "%";
    document.getElementById("tele_truss_throw_effectiveness_display").innerHTML = tele_truss_throw_effectiveness + "%";
    document.getElementById("tele_truss_catch_effectiveness_display").innerHTML = tele_truss_catch_effectiveness + "%";
    
    switch(tele_robot_block)
    {
        case '0':
            document.getElementById("tele_robot_block_display").innerHTML = "Awful / None";
            break;
        case '1':
            document.getElementById("tele_robot_block_display").innerHTML = "Not Very Effective";
            break;
        case '2':
            document.getElementById("tele_robot_block_display").innerHTML = "Good";
            break;
        case '3':
            document.getElementById("tele_robot_block_display").innerHTML = "It's Super Effective!";
            break;
    }
    
    /* penalty */
    document.getElementById("penalty_display1").innerHTML = penalty;
    document.getElementById("technical_display1").innerHTML = technical;
    document.getElementById("penalty_display2").innerHTML = penalty;
    document.getElementById("technical_display2").innerHTML = technical;
}

/*
 * Updates the points values
 */
function update_points()
{
    /* update the autonomous point total */
    sum_points(auto_goals[0]);
    sum_points(auto_goals[1]);
    /* update the teleop point total */
    sum_points(tele_goals[0]);
    sum_points(tele_goals[1]);
}

/* 
 * summation of points
 */
function sum_points(var_config)
{
    /* hot goal in auton */
    if (var_config === auto_goals[0] || var_config === auto_goals[1] )
    {
    	var_config.points = 20 * var_config.hot_high +
    						15 * var_config.high +
                        	6 * var_config.low +
                        	5 * var_config.in_area;
    }
    else
    {
		var_config.points = 10 * var_config.high +
                        	1 * var_config.low;
    }
}

// Replaced new_ball_score so that an undo score function could be easily added
function new_ball_score(period, status, goal)
{
    score_change(period, status, goal, 1);
}

/* 
 * new_ball_score
 */
function score_change(period, status, goal, change)
{
    var status_l;
    
    switch(status)
    {
    case 'make':
        status_l = 0; break;
    case 'miss':
        status_l = 1; break;
    }
            
    /* autonomous */
    if ( period === 'autonomous')
    {
        if(change > 0)
            auto_score_stack.push([status, goal]);
        auto_goals[status_l][goal]=auto_goals[status_l][goal]+change;
    }
    
    /* teleoperated */
    if ( period === 'teleop')
    {
        if(change > 0)
            tele_score_stack.push([status, goal]);
        tele_goals[status_l][goal]=tele_goals[status_l][goal]+change;
    }

}            

/*
 * Assess a penalty
 */
function new_penalty(type)
{
    switch(type)
    {
        case 'penalty':
            penalty =++ penalty; penalty_stack.push('penalty');break;
        case 'technical':
            technical =++ technical; penalty_stack.push('technical'); break;
    }
    
}

function save_data()
{
    var matchData = document.getElementById("scout_name_in").value + ",";
    matchData += document.getElementById("team_number_in").value + ",";
    matchData += document.getElementById("match_number_in").value + ",";
    matchData += document.getElementById("match_type").value + ",";
    matchData += document.getElementById("drive_type").value + ",";
    matchData += document.getElementById("drive_speed").value + ",";
    matchData += document.getElementById("number_wheels").value + ",";
    matchData += document.getElementById("passing").value + ",";
    matchData += document.getElementById("scoring").value + ",";
    matchData += document.getElementById("truss_throw").value + ",";
    matchData += document.getElementById("catching").value + ",";
    matchData += document.getElementById("defense").value + ",";
    matchData += document.getElementById("match_number_in").value + ",";
    matchData += (document.getElementById("starting_ball").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("floor_pickup").checked ? "T" : "F") + ",";
    matchData += document.getElementById("auto_pts_display").innerHTML + ",";
    matchData += document.getElementById("auto_miss_display").innerHTML + ",";
    matchData += document.getElementById("Location").value + ",";
    matchData += (document.getElementById("Front_shoot").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Full_shoot").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Human_load").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Floor_load").checked ? "T" : "F") + ",";
    matchData += document.getElementById("tele_pts_display").innerHTML + ",";
    matchData += document.getElementById("tele_miss_display").innerHTML + ",";
    matchData += tele_driving + ",";
    matchData += tele_robot_block + ",";
    matchData += tele_robot_block_time + ",";
    matchData += penalty + ",";
    matchData += technical + ",";
    var comments = document.getElementById("Comments").value;
    comments = comments.replace(",","_"); //Get rid of commas so we don't mess up CSV
    comments = comments.replace("\n","   ");
    matchData += comments + "\n";
    var existingData = localStorage.getItem("MatchData");
    if(existingData == null)
        localStorage.setItem("MatchData",matchData);
    else
        localStorage.setItem("MatchData",existingData + matchData);
    document.getElementById("HistoryCSV").value = localStorage.getItem("MatchData");
}

//Clears all data in the form.  
//Do not call this unless it is ok to actually clear all data.
//This only resets stuff Nick felt should be reset
function reset_form()
{
    document.getElementById("team_number_in").value = "";
    document.getElementById("match_number_in").value = "";
    document.getElementById("starting_ball").value = 0;
    document.getElementById("floor_pickup").value = 0;
    
    auto_score_stack = new Array();
    document.getElementById("Location").value = "A";
    auto_goals[0] = new goal_t(0,0,0,0,0);
    auto_goals[1] = new goal_t(0,0,0,0,0);
    auto_starting_ball = false;
    auto_floor_ball = false;
    auto_in_area = false;
    auto_hot_goal = false;
    
    tele_score_stack = new Array();
    document.getElementById("Front_shoot").checked = false;
    document.getElementById("Full_shoot").checked = false;
    document.getElementById("Human_load").checked = false;
    document.getElementById("Floor_load").checked = false;
    tele_goals[0] = new goal_t(0,0,0,0,0);
    tele_goals[1] = new goal_t(0,0,0,0,0);
    tele_front_court = 0;
    tele_full_court = 0;
    tele_human_loading = 0;    
    tele_driving = 0;
    tele_robot_block_time = 0;
    document.getElementById("driving_ability").value = 0;
    document.getElementById("robot_block").value = 0;
    document.getElementById("robot_block_time").value = 0;
   
    penalty_stack = new Array();
    penalty = 0;
    technical = 0;
    document.getElementById("Comments").value="";
    
    
    update_data();
}


/* 
 * functions to be called from outside this .js file
 * 
 */

/*
 * Call when inputs change
 */
function Update_Stuff()
{
    update_data();
}

/*
 * Ball scored.
 */
function Ball_Score(period, status, goal)
{
    /* a ball is scored */
    new_ball_score(period, status, goal);
    
    /* update point totals */
    Update_Stuff();                 
}

function Mobility_Score()
{
	Update_Stuff();
	
	if(auto_in_area)
	{
		Ball_Score('autonomous', 'make', 'in_area');
	}
	else
	{
		Undo_Score('autonomous');
	}
}
            
/*
 * Penalty comitted
 */
function Penalty(type)
{
    new_penalty(type);
 
    /* update point totals */
    Update_Stuff();
}

//Undo a score if possible
function Undo_Score(period)
{
    switch(period)
    {
        case 'autonomous':
            if(auto_score_stack.length > 0)
            {
                var scoreData = auto_score_stack.pop();
                score_change(period, scoreData[0], scoreData[1], -1);
            }
            break;
        case 'teleop':
            if(tele_score_stack.length > 0)
            {
                var scoreData = tele_score_stack.pop();
                score_change(period, scoreData[0], scoreData[1], -1);
            }
            break;
    }
    update_data();
}

//Undo a penalty if possible
function Undo_Penalty()
{
    if(penalty_stack.length > 0)
    {
        var type = penalty_stack.pop();
        switch(type)
        {
        case 'penalty':
            penalty--; break;
        case 'technical':
            technical--; break;
        }
    }
    update_data();
}

function Submit_Report()
{
    save_data();
    reset_form();
}

function Clear_History()
{
    if(document.getElementById("history_password").value == "Beans")
    {
        localStorage.clear();
        document.getElementById("HistoryCSV").value = "";
        $("#HistoryPass").hide(100,null);
    }
    else
    {
        document.getElementById("history_password").value = "Incorrect Password";
    }
}