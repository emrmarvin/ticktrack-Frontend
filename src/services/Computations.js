import moment from 'moment'
import Store from "@/store";
export default {
  TimeSpentCalculation(date_started,date_completed){
    let formatStartDate= moment(date_started).format("YYYY-MM-DD HH:mm:ss")
    let formatCompletedDate = moment(date_completed).format("YYYY-MM-DD HH:mm:ss")

    let timespent = 0
    let working_hours = 0
    let working_days = 0
    let duration_timespent_difference = 0

    let shift_start_time_when_ticket_is_completed = 0
    let shift_end_time_when_ticket_is_completed = 0

    let shift_start_time_when_ticket_is_started = 0
    let shift_end_time_when_ticket_is_started = 0

    let start_time = 0

    // If the User Changed Shift when the ticket is started
    let cs_start_shift = Store.state.user_CS[0].findIndex((obj => obj.cS_Start_Time.substr(0, 10) == moment(date_started).format("YYYY-MM-DD")));
    if(Store.state.user_CS[0][cs_start_shift] == null){
      shift_start_time_when_ticket_is_started = Store.state.user_shift.start_Time
      shift_end_time_when_ticket_is_started =  Store.state.user_shift.end_Time
    }else{
    shift_start_time_when_ticket_is_started = parseInt(Store.state.user_CS[0][cs_start_shift].cS_Start_Time.substr(11, 13))
    shift_end_time_when_ticket_is_started = parseInt(Store.state.user_CS[0][cs_start_shift].cS_End_Time.substr(11, 13))
    }

    // If the User Changed Shift when the ticket is closed
    let cs_end_shift = Store.state.user_CS[0].findIndex((obj => obj.cS_End_Time.substr(0, 10) == moment(date_completed).format("YYYY-MM-DD")));
    if(Store.state.user_CS[0][cs_end_shift] == null){
      shift_start_time_when_ticket_is_completed = Store.state.user_shift.start_Time
      shift_end_time_when_ticket_is_completed =  Store.state.user_shift.end_Time
    }else{
      shift_start_time_when_ticket_is_completed = parseInt(Store.state.user_CS[0][cs_end_shift].cS_Start_Time.substr(11, 13))
      shift_end_time_when_ticket_is_completed = parseInt(Store.state.user_CS[0][cs_end_shift].cS_End_Time.substr(11, 13))
    }

    // If ticket is received on weekend (Add 2 days)
    if(Store.state.world_area_support == "MEA"){
            if(moment(formatStartDate).format('dddd') == "Friday")
              {
              formatStartDate =  moment(formatStartDate).add(2,'days')
              formatCompletedDate =  moment(formatCompletedDate).add(2,'days')
              } 
            else if(moment(formatStartDate).format('dddd') == "Saturday")
              {  
              formatStartDate =  moment(formatStartDate).add(1,'days')
              formatCompletedDate =  moment(formatCompletedDate).add(1,'days')
              }
    }else{
            if(moment(formatStartDate).format('dddd') == "Saturday")
              {
                formatStartDate =  moment(formatStartDate).add(2,'days')
                formatCompletedDate =  moment(formatCompletedDate).add(2,'days')
              } 
            else if(moment(formatStartDate).format('dddd') == "Sunday")
              {
                formatStartDate =  moment(formatStartDate).add(1,'days')
                formatCompletedDate =  moment(formatCompletedDate).add(1,'days')
              }
    }

    // Get Initial time difference
    timespent = moment(formatCompletedDate,"YYYY/MM/DD HH:mm").diff(moment(formatStartDate,"YYYY/MM/DD HH:mm"));
    duration_timespent_difference = moment.duration(timespent);
    working_days = duration_timespent_difference.asDays()
    // Initial Time (Hours) Difference Between Start and End date of Ticket
    working_hours = duration_timespent_difference.asHours()
   
    if(parseInt(moment(formatStartDate).format('HH')) == 0 )
      {
        start_time = 24
      }else{
        start_time = parseInt(moment(formatStartDate).format('HH'))
      }

    // If ticket is opened/closed the same shift 
    if(working_hours <= 9)
    {  
        // If ticket is received prior to the start of shift (adjust the Start time to the start of shift schedule)
        //if(start_time <= shift_start_time_when_ticket_is_started && start_time >= shift_end_time_when_ticket_is_started)
        // { 
        //   let hours_to_adjust = shift_start_time_when_ticket_is_started - parseInt(moment(formatStartDate).format('HH'))
        //   working_hours = working_hours - hours_to_adjust
        //   console.log("start_time",start_time)
        //   console.log("hours_to_adjust",hours_to_adjust)
        //   console.log("working_hours",working_hours)
        // }       
    }
    // If ticket is consumed more than 1 shift
    else if(working_hours > 9){
        // If ticket is received prior to start of shift (adjust the Start time to the start of shift schedule)
        // if(start_time <= shift_start_time_when_ticket_is_started && start_time >= shift_end_time_when_ticket_is_started)
        // { 
        //   let hours_to_adjust = shift_start_time_when_ticket_is_started - parseInt(moment(formatStartDate).format('HH'))
        //   working_hours = working_hours - hours_to_adjust
        // } 

        // Take off Non_Working Hours (-15 in every 24 hours to get 9hrs shift only)
        working_hours = working_hours - ((working_hours/24)*15)

        // Take off the Weekends 
          for(let i = 0 ; i < working_days ;i++){
            if(Store.state.world_area_support == "MEA"){
              
              if(moment(formatStartDate).add(i+1, 'days').format('dddd') == "Friday" || moment(formatStartDate).add(i+1, 'days').format('dddd') == "Saturday")
                {
                  working_hours = working_hours - 9
                } 
            }else{
              if(moment(formatStartDate).add(i+1, 'days').format('dddd') == "Saturday" || moment(formatStartDate).add(i+1, 'days').format('dddd') == "Sunday")
                {
                if(moment(formatCompletedDate).format('YYYY/MM/DD') > moment(formatStartDate).add(i+1, 'days').format('YYYY/MM/DD')){
                    working_hours = working_hours - 9       
                } 
                } 
            }
          }
    }
    //console.log("working_hours",working_hours)
    return parseFloat(working_hours.toFixed(1));
  },
  serviceRatingComputation(time_spent,sla){
    console.log()
    var timespent_over_sla = (time_spent/sla).toFixed(2)
    var service_rating = null
      if(timespent_over_sla < 0.25)
        {
          service_rating = 1.00
        }
      else if (timespent_over_sla <= 0.50)
        {
        service_rating = timespent_over_sla / 0.25;
        }
      else if(timespent_over_sla <= 1.5)
        {
        service_rating = (timespent_over_sla / 0.5)+1;
        }
      else if (timespent_over_sla <= 1.74)
        {
        service_rating = (timespent_over_sla / 0.25)-2;
        }
      else
        {
        service_rating = 5;
        }
    return service_rating;
  },
  ProjectSLAComputation(start,end){
    let project_SLA = null
    let formatStartDate = moment(start).format("YYYY-MM-DD HH:mm:ss")
    let formatEndDate = moment(end).format("YYYY-MM-DD HH:mm:ss")

    var ms =  moment(formatEndDate,"YYYY/MM/DD HH:mm").diff(moment(formatStartDate,"YYYY/MM/DD HH:mm"));
    var d = moment.duration(ms);
    var working_hours = Math.round(d.asHours())
    var consumed_hours = 0
    // GETTING 9 HOURS / DAY 
     if(Math.floor(working_hours) >= 24){
       consumed_hours = Math.floor(working_hours) - ((Math.floor(working_hours)/24)*15)
       //consumed_hours = consumed_hours + (Store.state.user_shift.end_Time - parseInt(moment(formatStartDate).format('HH')))
     }else if(Math.floor(working_hours) >= 9){
       consumed_hours = Math.floor(working_hours) - 15
     }else{
       consumed_hours = Math.floor(working_hours)
     } 

     var duration = Math.floor(consumed_hours) + moment.utc(ms).format(":mm");
     let hours_and_min = duration.substr(0,5)
     var hoursMinutes  = hours_and_min.split(/[.:]/);
     var hours = parseInt(hoursMinutes [0], 10);
     var minutes = hoursMinutes [1] ? parseInt(hoursMinutes [1], 10) : 0;
     project_SLA = hours + minutes/60
     
     return parseFloat(project_SLA.toFixed(1));
 },
}