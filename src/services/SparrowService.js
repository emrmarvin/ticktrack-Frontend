import axios from 'axios'
import moment from 'moment'
import Store from "@/store";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
})

const adoClient = axios.create({
  
  baseURL:"https://dev.azure.com/EmersonAutomationSolutions/",
  //baseURL:'https://dev.azure.com/EmersonAutomationSolutions/8776a78c-cb76-4c95-9eda-c6f193d1afd7/_apis/wit/workItems/1751421',
  auth:{
    username:'Leonard.Viva@Emerson.com',
    password:sessionStorage.getItem("azurePAT")
  }
})  

const adoLogin = axios.create({
  baseURL:"https://vssps.dev.azure.com/EmersonAutomationSolutions/_apis/tokens/pats?api-version=7.1-preview.1"
})


export default {

  ///// Period Calculation //////
  pickPeriod(periods,date_completed){
    for(let p = 0 ; p < periods.length ; p++){
      if(moment(date_completed).format('YYYY-MM-DD') >= moment(periods[p].start_Date).format('YYYY-MM-DD') && 
         moment(date_completed).format('YYYY-MM-DD') <= moment(periods[p].end_Date).format('YYYY-MM-DD')){
        return periods[p].id;
      }
    }
  },
  pickPeriod_Label(periods,date_completed){
    for(let p = 0 ; p < periods.length ; p++){
      if(moment(date_completed).format('YYYY-MM-DD') >= moment(periods[p].start_Date).format('YYYY-MM-DD') && 
         moment(date_completed).format('YYYY-MM-DD') <= moment(periods[p].end_Date).format('YYYY-MM-DD')){
        return periods[p].abbreviation;
      }
    }
  },

  /////// Image Services ///////
  
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    binEncode(create,data,title,owner,id,onUploadProgress) {
      let formData = null
      if(create == true){
        formData = {
          "title":title,
          "image":data,
          "ticket_Owner_ID":owner
        }
        return apiClient.post("/ProfileImages", formData,{
          onUploadProgress
        })
      }
      else if(create == false){
        formData = { 
          "id":id,
          "title":title,
          "image":data,
          "ticket_Owner_ID":owner
        }
        return apiClient.put("/ProfileImages/"+ id, formData,{
          onUploadProgress
        })
      }
      
      
  },

  upload(create,file,title,userID,id,onUploadProgress) {
    let base64Data = null
    this.getBase64(file).then((res)=>{
      base64Data = res.replace(/data\:image\/(png|jpg|jpeg);base64,/, '')  
      this.binEncode(create,base64Data,title,userID,id,onUploadProgress)
    })
  },



  //////////////// API endpoints Services ////////////////////////


  getProfiles() {
    return apiClient.get("/ProfileImages");
  },
  getProfile(id) {
    return apiClient.get("/ProfileImages/User/" + id);
  },

  // BUs CRUD Endpoints
  getBusinessUnits() {
    return apiClient.get('/Business_Units')
  },
  getBusinessUnit(id) {
    return apiClient.get('/Business_Units/' + id)
  },
  getBusinessUnitByTeam(teamid) {
    return apiClient.get('/Business_Units/team/' + teamid);
  },
  postBusinessUnit(item) {
    return apiClient.post('/Business_Units', item)
  },
  putBusinessUnit(id,item) {
    return apiClient.put('/Business_Units/'+ id, item)
  },
  deleteBusinessUnit(id){
    return apiClient.delete('/Business_Units/'+ id)
  },

  // Roles CRUD Endpoints
  getRoles() {
    return apiClient.get('/Roles')
  },
  getRole(id) {
    return apiClient.get('/Roles/' + id)
  },
  postRole(item) {
    return apiClient.post('/Roles', item)
  },
  putRole(id, item){
     return apiClient.put('/Roles/'+ id, item)
  },
  deleteRole(id){
     return apiClient.delete('/Roles/' + id)
  },

  // Teams CRUD Endpoints
  getTeams() {
    return apiClient.get('/Teams')
  },
  getTeam(id) {
    return apiClient.get('/Teams/' + id)
  },
  getSupervisorTeams(supID) {
    return apiClient.get('/Teams/supervisor/' + supID)
  },
  postTeam(team){
    return apiClient.post('/Teams', team)
  },
  putTeam(id,team){
    return apiClient.put('/Teams/' + id, team)
  },
  deleteTeam(id){
    return apiClient.delete('/Teams/' + id)
  },

  // Users CRUD Endpoints
  getUsers() {
    return apiClient.get('Users')
  },
  getUser(id) {
    return apiClient.get('Users/' + id)
  },
  getUserByTeam(teamid) {
    return apiClient.get('Users/user/team/' + teamid)
  },
  getUserByTeams(supID) {
    return apiClient.get('Users/user/teams/supervisorID/' + supID)
  },
  postUsers(user){
    return apiClient.post('/Users', user)
  },
  putUsers(id,user){
    return apiClient.put('/Users/'+id, user)
  },

  //Shift Schedule CRUD Endpoints
  getShiftSchedules() {
    return apiClient.get('Shift_Schedules')
  },
  getShiftSchedule(id) {
    return apiClient.get('Shift_Schedules' + id)
  },
  postShiftSchedule(shift){
    return apiClient.post('/Shift_Schedules', shift)
  },


  // Tickets CRUD Endpoints
  getTicketClassifications() {
    return apiClient.get('/Classifications');
  },
  // getTicketClassificationsbyTeam(teamid) {
  //   return apiClient.get('/Classifications/team/'+ teamid);
  // },
  getTicketClassification(id) {
    return apiClient.get('/Classifications' + id);
  },
  postTicketClassification(classification) {
    return apiClient.post('/Classifications', classification)
  },

  getTicketComplexities() {
    return apiClient.get('/Complexities');
  },
  getTicketComplexitiesbyTeam(teamid) {
    return apiClient.get('/Complexities/team/'+ teamid);
  },
  getTicketComplexity(id) {
    return apiClient.get('/Complexities/' + id);
  },
  postTicketComplexity(complexity) {
    return apiClient.post('/Complexities', complexity)
  },
  putTicketComplexity(id,complexity) {
    return apiClient.put('/Complexities/'+ id, complexity)
  },
  deleteTicketComplexity(id) {
    return apiClient.delete('/Complexities/'+ id)
  },

//Quality Rating
  getQualityRatings(){
    return apiClient.get('/Quality_Rating')
  },
  postQualityRatings(qualityrating){
    return apiClient.get('/Quality_Rating', qualityrating)
  },

  getTicketMain_Categories() {
    return apiClient.get('/Main_Category');
  },
  getTicketMain_CategoryByTeam(teamid) {
    return apiClient.get('/Main_Category/team/' + teamid);
  },
  getTicketMain_Category(id) {
    return apiClient.get('/Main_Category/' + id);
  },
  postTicketMain_Category(main_Category) {
    return apiClient.post('/Main_Category', main_Category)
  },
  putTicketMain_Category(id,main_Category) {
    return apiClient.put('/Main_Category/'+id, main_Category)
  },
  deleteTicketTicketMain_Category(id) {
    return apiClient.delete('/Main_Category/'+ id)
  },

  //Sub1 Category
  getTicketSub1_Categories() {
    return apiClient.get('/Sub1_Category');
  },
  getTicketSub1_CategoryByMainCategory(main_category_id) {
    return apiClient.get('/Sub1_Category/GetByMainCategory/' + main_category_id);
  },
  getTicketSub1_CategoryByTeam(teamid) {
    return apiClient.get('/Sub1_Category/GetSub1CategoryByTeam/team/' + teamid);
  },
  getTicketSub1_Category(id) {
    return apiClient.get('/Sub1_Category/' + id);
  },
  postTicketSub1_Category(sub1_Category) {
    return apiClient.post('/Sub1_Category', sub1_Category);
  },
  putTicketSub1Cat(id, sub1_Category) {
    return apiClient.put('/Sub1_Category/'+id, sub1_Category);
  },
  deleteTicketTicketSub1_Category(id) {
    return apiClient.delete('/Sub1_Category/'+ id)
  },

  //Sub2 Category
  getTicketSub2_Categories() {
    return apiClient.get('/Sub2_Category');
  },
  getTicketSub2_Category(id) {
    return apiClient.get('/Sub2_Category' + id);
  },
  postTicketSub2_Category(sub2_Category) {
    return apiClient.post('/Sub2_Category', sub2_Category)
  },


  //Status
  getTicketTicket_StatusAll() {
    return apiClient.get('/Ticket_Status');
  },
  getTicketTicket_Status_By_Team(teamid) {
    return apiClient.get('/Ticket_Status/team/' + teamid);
  },
  getTicketTicket_Status(id) {
    return apiClient.get('/Ticket_Status/' + id);
  },
  postTicketTicket_Status(ticket_Status) {
    return apiClient.post('/Ticket_Status', ticket_Status)
  },
  putTicketTicket_Status(id,ticket_Status) {
    return apiClient.put('/Ticket_Status/'+ id, ticket_Status)
  },
  deleteTicketTicket_Status(id) {
    return apiClient.delete('/Ticket_Status/'+id)
  },

  //Ticket Information
  getTickets() {
    return apiClient.get('/Ticket_Info');
  },
  getTicketsByUser(UserId,currentFY) {
    return apiClient.get('/Ticket_Info/User/'+ UserId + '/FY/'+currentFY);
  },
  getTicket(id) {
    return apiClient.get('/Ticket_Info/' + id);
  },
  getTicketsByTeam(teamId) {
    return apiClient.get('/Ticket_Info/User/team/'+ teamId);
  },
  getTicketOpsDashboard(fyID,periodID,teamId,classificationID){
    return apiClient.get('/Ticket_Info/User/Ops/FY/'+fyID+'/period/'+periodID +'/team/'+teamId+'/classification/'+classificationID);
  },
  getTicketOpsDashboardByTeam(fyID,userID,teamId,classificationID){
    return apiClient.get('/Ticket_Info/User/'+ userID+ '/Ops/FY/'+fyID+'/team/'+teamId+'/classification/'+classificationID);
  },
  getTicketSupOpsDashboard(fyID,periodID,supID,classificationID){
    return apiClient.get('/Ticket_Info/User/Ops/FY/'+fyID+'/period/'+periodID +'/team/supervisor/'+supID+'/classification/'+classificationID);
  },
  postTicket(ticket_Info) {
    return apiClient.post('/Ticket_Info', ticket_Info)
  },
  putTicket(id, ticket_Info) {
    return apiClient.put('/Ticket_Info/'+id, ticket_Info)
  },
  deleteTicket(id){
    return apiClient.delete('/Ticket_Info/'+id)
  },
  getUserInfo(userMail){
    return apiClient.get( "/Users/GetByEmail/" + userMail)
  },

  // Notificaiton CRUD
  getNotificationsByUser(userID){
    return apiClient.get( "/Notifications/User/" + userID)
  },
  postNotification(notif) {
    return apiClient.post('/Notifications', notif)
  },
  putNotification(id, notif) {
    return apiClient.put('/Notifications/'+id, notif)
  },
  
  //Non-Functional Classification
  getNonFunctionalClassifications(){
    return apiClient.get( "/Non_Functional_Classification/")
  },
  
  //Non-Functional Activity
  getNonFunctionalTickets(id,fy){
    return apiClient.get( "/Non_Functional_Tickets/User/" + id + '/FY/'+ fy)
  },
  getNonFunctionalTicket(id){
    return apiClient.get( "/Non_Functional_Tickets/" + id)
  },
  postNonFunctionalTickets(nf_ticket) {
    return apiClient.post('/Non_Functional_Tickets', nf_ticket)
  },
  putNonFunctionalTickets(id, nf_ticket) {
    return apiClient.put('/Non_Functional_Tickets/'+id, nf_ticket)
  },
  deleteNonFunctionalTicketsA(id) {
    return apiClient.delete('/Non_Functional_Tickets/'+id)
  },

  // SLA INFO
  getTicketSLAs(){
    return apiClient.get( "/SLA_Info")
  },
  getTicketSLA(id){
    return apiClient.get( "/SLA_Info/" + id)
  },
  getTicketSLAbyTeam(team_id){
    return apiClient.get( "/SLA_Info/Team/" + team_id)
  },
  postTicketSLA(sla) {
    return apiClient.post('/SLA_Info', sla)
  },
  putTicketSLA(id, sla) {
    return apiClient.put('/SLA_Info/' + id, sla)
  },
  deleteTicket_SLA(id) {
    return apiClient.delete('/SLA_Info/'+id)
  },


  //Period
  getPeriods(){
    return apiClient.get( "/Periods")
  },
  getPeriod(id){
    return apiClient.get( "/Periods/" + id)
  },
  putPeriod(id, period) {
    return apiClient.put('/Periods/' + id, period)
  },

  //FY
  getFYs(){
    return apiClient.get( "/Fiscal_Year")
  },
  getFY(id){
    return apiClient.get( "/Fiscal_Year/" + id)
  },
  putFY(id, fy) {
    return apiClient.put('/Fiscal_Year/' + id, fy)
  },

  //World Area
  getWorldAreas(){
    return apiClient.get( "/World_Area")
  },
  getWorldArea(id){
    return apiClient.get( "/World_Area/" + id)
  },
  putWorldArea(id, world_area) {
    return apiClient.put('/World_Area/' + id, world_area)
  },

  // Requester CRUD Endpoints
  getRequesters() {
    return apiClient.get('/Requesters')
  },
  getRequester(id) {
    return apiClient.get('/Requesters/' + id)
  },
  getRequesterByTeam(teamid) {
    return apiClient.get('/Requesters/team/' + teamid);
  },
  postRequester(item) {
    return apiClient.post('/Requesters', item)
  },
  putRequester(id,item) {
    return apiClient.put('/Requesters/'+ id, item)
  },
  deleteRequestert(id){
    return apiClient.delete('/Requesters/'+ id)
  },

  //Change Shift
  getChangeShifts() {
    return apiClient.get('/ChangeshiftInfoes')
  },
  getChangeShift(id) {
    return apiClient.get('/ChangeshiftInfoes/' + id)
  },
  getChangeShiftByUser(user_id) {
    return apiClient.get('/ChangeshiftInfoes/team/' + user_id);
  },
  postChangeShift(item) {
    return apiClient.post('/ChangeshiftInfoes', item)
  },
  putChangeShift(id,item) {
    return apiClient.put('/ChangeshiftInfoes/'+ id, item)
  },
  deleteChangeShift(id){
    return apiClient.delete('/ChangeshiftInfoes/'+ id)
  },

  getAzureRequests(){
    return adoClient.get('EMR-ENT-MSOL-DCX-WebProjectExecution/_apis/wit/wiql/22950ab7-7ee5-43fd-a9ae-4b639f8dde30?api-version=7.1-preview.2')
    //return adoClient.get('EMR-ENT-MSOL-DCX-WebProjectExecution/_apis/wit/wiql/f6ef807a-22e3-4586-a0b0-1dbc114278e5?api-version=7.1-preview.2')
  },
  getAzureWorkItemDetails(workitem_id){
    return adoClient.get('8776a78c-cb76-4c95-9eda-c6f193d1afd7/_apis/wit/workItems/'+ workitem_id)
  }

}