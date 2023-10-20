import Vue from 'vue'
import Vuex, {
   Store
} from 'vuex'
import SparrowService from '@/services/SparrowService'
import AuthService from "./services/AuthService";
import GraphService from "./services/GraphService";
import axios from "axios";
import moment from 'moment';


Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      roles: [],
      bus: [],
      teams: [],
      supervior_teams: [],
      business_units: [],
      business_units_by_team: [],
      requesters_by_team: [],
      shift_schedules: [],
      roles: [],
      classifications: [],
      classificationsByTeam: [],
      complexities: [],
      complexitiesByTeam: [],
      qualityRatings: [],
      main_Categories: [],
      main_Categories_by_team: [],
      sub1_Categories: [],
      sub1_Categories_By_Main_Category: [],
      sub1_Categories_By_Team: [],
      ticket_statuses: [],
      ticket_Status_by_team: [],
      tickets: [],
      allTickets: [],
      isAdmin: false,
      isLogIn: false,
      isAlsoTeamLead:false,
      Sup_TLTeams:[],
      isRegistered: false,
      isTeamLead: false,
      isSupervisor: false,
      isManager: false,
      userName: "",
      sub1_Category: [],
      userID: 0,
      teamID: 0,
      showTimer:false,
      inProgressStatus: "",
      filterValue: "",
      inProgressID: 0,
      completedID: 0,
      completedStatus: "",
      userInfo: [],
      user_shift: null,
      userTickets: [],
      teamTickets: [],
      world_area_support: "",
      users: [],
      users_count : 0,
      usersByTeam: [],
      notifications: [],
      notif_count: 0,
      non_functional_classifications: [],
      non_functional_tickets: [],
      all_non_functional_tickets:[],
      allNFTickets: [],
      current_non_functional_tickets: [],
      ongoingNonFunctional: 0,
      SLAs: [],
      SLAByTeam: [],
      user_CS:[],

      activeTickectsCount: 0,
      activeTickets: [],
      totalTicketCount: 0,
      completedTickets: 0,

      runningTickets: [],

      ticket_loader: true,
      no_ticket_data: false,
      nf_loader: true,
      no_nf_data: false,

      world_areas: [],
      periods: [],
      fiscalYears: [],
      activePeriod: [],
      activeFY: [],
      imageInfos: [],
      image: "",
      profilePictureID: 0,
      alt: "",
      userImages: [],
      IsNew: null,

      OpsDashboard_Transactionals: [],
      OpsDashboard_Projects: [],


      OpsDashboard_Transactionals_Per_Team_Member: [],
      OpsDashboard_Projects_Per_Team_Member: [],
      OpsDashboard_Total_Count: 0,
      TeamMember_Count: 0,

      Sup_OpsDashboard_Transactionals: [],
      Sup_OpsDashboard_Projects: [],

      dynamicExportReport:{},

      opsManagerTeams:[],

      isOnline:""

   },
   getters: {
      allSub1_Categories: (state) => {
         return state.sub1_Categories
      }
   },
   actions: {
      // ROLE ACTIONS
      addRole({
         commit
      }, role) {
         SparrowService.postRole(role)
         commit('ADD_ROLE', role)
      },
      fetchRoles({
         commit
      }) {
         SparrowService.getRoles()
            .then(response => {
               commit('SET_ROLES', response.data)
            })
      },

      // TEAM ACTIONS
      fetchSuperviorTeams({commit,state}, supID) {
         SparrowService.getSupervisorTeams(supID)
            .then(response => {
               commit('SET_SUPERVISOR_TEAMS', response.data)
               for(let t = 0; t < response.data.length; t++){
                  if(response.data[t].team_Lead_User_ID == supID){
                     state.isAlsoTeamLead = true
                     state.Sup_TLTeams.push(response.data[t])
                     
                  }
               }
               
            })
      },
      fetchTeams({commit},userID) {
         SparrowService.getTeams()
            .then(response => {
               let teams = response.data
               commit('SET_TEAMS', {teams,userID});
            })
      },
      addTeam({
         commit
      }, team) {
         SparrowService.postTeam(team)
            .then(response => {
               commit('ADD_TEAM', team)
            })
      },

      // BUSINESS UNIT ACTIONS
      addBusinessUnits({
         commit
      }, business_unit) {
         SparrowService.postBusinessUnit(business_unit)
            .then(response => {
               commit('ADD_BU', business_unit)
            })
      },
      fetchBusinessUnits({
         commit
      }) {
         SparrowService.getBusinessUnits()
            .then(response => {
               commit('SET_BU', response.data)
            })
      },
      fetchBusinessUnitsByTeam({
         commit
      }, teamID) {
         SparrowService.getBusinessUnitByTeam(teamID)
            .then(response => {
               commit('SET_BU_BY_TEAM', response.data)
            })
      },

      // REQUESTER ACTIONS
      addRequester({
         commit
      }, requester) {
         SparrowService.postRequester(requester)
            .then(response => {
               //commit('ADD_REQUESTER',requester)
            })
      },
      fetchRequester({
         commit
      }) {
         SparrowService.getRequesters()
            .then(response => {
               commit('SET_REQUESTER', response.data)
            })
      },
      fetchRequesterByTeam({
         commit
      }, teamID) {
         SparrowService.getRequesterByTeam(teamID)
            .then(response => {
               commit('SET_REQUESTER_BY_TEAM', response.data)
            })
      },

      // SHIFT SCHEDULE ACTIONS
      fetchShiftSchedules({
         commit
      }) {
         SparrowService.getShiftSchedules()
            .then(response => {
               commit('SET_SHIFTSCHEDULES', response.data)
            })
      },

      // CLASSIFICATION ACTIONS
      fetchTicketClassifications({
         commit
      }) {
         SparrowService.getTicketClassifications()
            .then(response => {
               commit('SET_TICKETCLASSIFICATIONS', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      addClassification({
         commit
      }, classification) {
         SparrowService.postTicketClassification(classification)
         commit('ADD_TICKETCLASSIFICATION', classification)
      },

      // COMPLEXITIES ACTIONS
      fetchTicketComplexities({
         commit
      }) {
         SparrowService.getTicketComplexities()
            .then(response => {
               commit('SET_TICKETCOMPLEXITIES', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchTicketComplexitiesbyTeam({
         commit
      }, teamid) {
         SparrowService.getTicketComplexitiesbyTeam(teamid)
            .then(response => {
               commit('SET_TICKETCOMPLEXITIESBYTEAM', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      addComplexity({
         commit
      }, complexity) {
         SparrowService.postTicketComplexity(complexity)
         commit('ADD_TICKETCOMPLEXITY', complexity)
      },


      // QUALITY RATING ACTIONS
      fetchQualityRatings({
         commit
      }) {
         var arrangeQR = []
         SparrowService.getQualityRatings()
            .then(response => {
               for (var p = 0; p < response.data.length; p++) {
                  if (response.data[p].active == true) {
                     state.activePeriod = response.data[p]
                  }
               }
               arrangeQR = response.data.sort(function (a, b) {
                  var periodA = parseInt(a.abbreviation);
                  var periodB = parseInt(b.abbreviation);
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
               commit('SET_QUALITYRATINGS', arrangeQR)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },

      //WORLD AREA
      fetchWorldAreas({
         commit
      }) {
         SparrowService.getWorldAreas()
            .then(response => {
               commit('SET_WORLD_AREA', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },


      //PERIODS
      fetchPeriods({
         commit,
         state
      }) {
         var arrangePeriods = []
         SparrowService.getPeriods()
            .then(response => {
               for (var p = 0; p < response.data.length; p++) {
                  if (response.data[p].active == true) {
                     state.activePeriod = response.data[p]
                  }
               }
               arrangePeriods = response.data.sort(function (a, b) {
                  var periodA = a.id;
                  var periodB = b.id;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
               commit('SET_PERIODS', arrangePeriods)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      //FY
      fetchFY({
         commit,
         state
      }) {
         var arrangeFY = []
         SparrowService.getFYs()
            .then(response => {
               for (var p = 0; p < response.data.length; p++) {
                  if (response.data[p].active == true) {
                     state.activeFY = response.data[p]
                  }
               }
               arrangeFY = response.data.sort(function (a, b) {
                  var periodA = a.id;
                  var periodB = b.id;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
               commit('SET_FY', arrangeFY)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },


      // MAIN CATEGORY ACTIONS
      addTicketMainCategory({
         commit
      }, main_Category) {
         SparrowService.postTicketMain_Category(main_Category)
         commit('ADD_TICKETMAINCATEGORY', main_Category)
      },
      fetchTicketMainCategories({
         commit
      }) {
         SparrowService.getTicketMain_Categories()
            .then(response => {
               commit('SET_TICKETMAINCATEGORY', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchTicketMainCategoriesByTeam({
         commit
      }, teamid) {
         SparrowService.getTicketMain_CategoryByTeam(teamid)
            .then(response => {
               commit('SET_TICKETMAINCATEGORY_BY_TEAM', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },

      // SUB 1 CATEGORY ACTIONS
      addTicketSub1Category({
         commit
      }, sub1_Category) {
         SparrowService.postTicketSub1_Category(sub1_Category)
         commit('ADD_TICKETSUB1CATEGORY', sub1_Category)
      },
      fetchTicketSub1Category({
         commit
      }) {
         SparrowService.getTicketSub1_Categories()
            .then(response => {
               commit('SET_TICKETSUB1CATEGORY', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchTicketSub1CategoryByMainCategory({
         commit
      }, main_category_id) {
         SparrowService.getTicketSub1_CategoryByMainCategory(main_category_id)
            .then(response => {
               commit('SET_TICKETSUB1CATEGORYBYMAINCATEGORY', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchTicketSub1CategoryByTeam({
         commit
      }, teamID) {
         SparrowService.getTicketSub1_CategoryByTeam(teamID)
            .then(response => {
               commit('SET_TICKETSUB1CATEGORYBYTEAM', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      editTicketSub1Category({
         commit
      }, sub1_Category) {
         SparrowService.putTicketSub1Cat(sub1_Category);
         commit('EDIT_TICKETSUB1CATEGORY', sub1_Category);
      },

      // STATUS ACTIONS
      fetchTicketStatus({
         commit
      }) {
         SparrowService.getTicketTicket_StatusAll()
            .then(response => {
               commit('SET_TICKETSTATUS', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchTicketStatusByTeam({
         commit
      }, teamid) {
         SparrowService.getTicketTicket_Status_By_Team(teamid)
            .then(response => {
               commit('SET_TICKETSTATUSBYTEAM', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      addTicketStatus({
         commit
      }, ticket_Status) {
         SparrowService.postTicketTicket_Status(ticket_Status)
         commit('ADD_TICKETSTATUS', ticket_Status)
      },


      // TICKET ACTIONS
      fetchTeamTickets({
         commit
      }, teamId) {
         SparrowService.getTicketsByTeam(teamId)
            .then(response => {
               commit('SET_TEAMTICKETS', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      addTicket({
         commit
      }, ticket_Info) {
         SparrowService.postTicket(ticket_Info)
         commit('ADD_TICKET', ticket_Info)
      },
      editTicket({
         commit
      }, id, ticket_Info) {
         SparrowService.putTicket(id, ticket_Info)
         commit('EDIT_TICKET', ticket_Info)
      },

      // USER  ACTIONS
      addUser({
         commit,
         state
      }, user) {
         SparrowService.postUsers(user)
         state.isRegistered = true
         commit('ADD_USER', user)
      },
      fetchUsers({
         commit,state
      }) {
         let appendImagePromise = []
         SparrowService.getUsers()
            .then(response => {
               for (let p = 0; p < response.data.length; p++) {
                  appendImagePromise.push(
                     SparrowService.getProfile(response.data[p].id).then(res => {
                        if (res.data.length != 0) {
                           response.data[p]["image"] = res.data[0].image
                        }
                     })
                     .catch(error => {  
                        commit('SET_USERS', response.data)           
                        console.log(error.response)
                     })
                  )
               }
               Promise.all(appendImagePromise).then(() => {
                  commit('SET_USERS', response.data)
               })

            })
      },
      fetchUsersByTeam({commit,state}, teamid) {
         let appendImagePromise = []
         SparrowService.getUserByTeam(teamid)
            .then(response => {
               state.TeamMember_Count = response.data.length
               for (let p = 0; p < response.data.length; p++) {

                  //Getting User Image
                  appendImagePromise.push(
                     SparrowService.getProfile(response.data[p].id).then(res => {
                        if (res.data.length != 0) {
                           response.data[p]["image"] = res.data[0].image
                        }
                     })
                  )

                  //Get Dashboard per Team Member
                  var transactional_per_team_member = []
                  var transactional_per_team_member_promise = []

                  var project_per_team_member = []
                  var project_per_team_member_promise = []

                  transactional_per_team_member_promise.push(
                     SparrowService.getTicketOpsDashboardByTeam(state.activeFY.id, response.data[p].id, state.userInfo[0][0].teamID, 1)
                     .then(res => {
                        res.data["userID"] = response.data[p].id
                        res.data["userName"] = response.data[p].first_Name + " " + response.data[p].last_Name
                        transactional_per_team_member.push(res.data)
                     })
                  )
                  project_per_team_member_promise.push(
                     SparrowService.getTicketOpsDashboardByTeam(state.activeFY.id, response.data[p].id, state.userInfo[0][0].teamID, 2)
                     .then(res => {
                        res.data["userID"] = response.data[p].id
                        res.data["userName"] = response.data[p].first_Name + " " + response.data[p].last_Name
                        project_per_team_member.push(res.data)
                     })

                  )
                  Promise.all(transactional_per_team_member_promise).then(() => {
                     state.OpsDashboard_Transactionals_Per_Team_Member = transactional_per_team_member.sort(function (a, b) {
                        var periodA = a.userID;
                        var periodB = b.userID;
                        return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
                     });
                     state.OpsDashboard_Total_Count = state.OpsDashboard_Transactionals_Per_Team_Member.length
                  })
                  Promise.all(project_per_team_member_promise).then(() => {
                     state.OpsDashboard_Projects_Per_Team_Member = project_per_team_member.sort(function (a, b) {
                        var periodA = a.userID;
                        var periodB = b.userID;
                        return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
                     });
                  })
               }

               Promise.all(appendImagePromise).then(() => {
                  commit('SET_USERS', response.data)
               })

            })
      },
      fetchUsersByTeams({
         commit,
         state
      }, supID) {
         let appendImagePromise = []
         SparrowService.getUserByTeams(supID)
            .then(response => {
               for (let p = 0; p < response.data.length; p++) {
                  appendImagePromise.push(
                     SparrowService.getProfile(response.data[p].id).then(res => {
                        if (res.data.length != 0) {
                           response.data[p]["image"] = res.data[0].image
                        }
                     })
                  )
               }
               Promise.all(appendImagePromise).then(() => {
                  commit('SET_USERS', response.data)
               })

            })
      },
      fetchUserTickets({
         state,
         commit
      }, {UserId,FY}) {
         var active_tickets = []
         state.activeTickectsCount = 0
         state.completedTickets = 0
         state.no_ticket_data = false
         SparrowService.getTicketsByUser(UserId,FY)
            .then(response => {
               if (response.data.length == 0) {
                  state.no_ticket_data = true
                  state.ticket_loader = false
               }
               state.userTickets = []
               state.runningTickets = []
               for (let i = 0; i < response.data.length; i++) {
                  state.ticket_loader = false
                  if (response.data[i].ticket_Status.status.toLowerCase() == "in-progress" ||
                     response.data[i].ticket_Status.status.toLowerCase() == "in progress" ||
                     response.data[i].ticket_Status.status.toLowerCase() == "started" ||
                     response.data[i].ticket_Status.status.toLowerCase() == "current") {
                     active_tickets.push(response.data[i])
                     state.activeTickectsCount += 1
                     state.runningTickets.push({
                        "id": response.data[i].id,
                        "time": response.data[i].running_time.substr(0,5),
                        "isStarted": true,
                        "isStopped": false,
                        "counter": 0,
                        "runClock": null,
                        "save_Ticket": null,
                        "hour": response.data[i].running_time.substr(0, 2),
                        "minute": response.data[i].running_time.substr(3, 2),
                     })
                  } else if (response.data[i].ticket_Status.status.toLowerCase() == "completed" ||
                     response.data[i].ticket_Status.status.toLowerCase() == "closed" ||
                     response.data[i].ticket_Status.status.toLowerCase() == "done") {
                     state.completedTickets += 1
                  }
               }
               state.allTickets = response.data
               if (active_tickets.length == 0) {
                  state.no_ticket_data = true
               }
               state.activeTickets = active_tickets
               commit('SET_USERTICKETS', active_tickets)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      filterTickets({
         state,
         commit
      }, status) {
         var tickets = []
         state.userTickets = []
         for (let t = 0; t < state.allTickets.length; t++) {
            if (state.allTickets[t] != null) {
               if (state.allTickets[t].ticket_Status.status == status) {
                  if (status.toLowerCase() == state.completedStatus.toLowerCase()) {
                     tickets = []
                  } else {
                     state.no_ticket_data = false
                     tickets.push(state.allTickets[t])
                  }
               }
            } else {
               tickets = []
            }
         }
         if (tickets.length == 0) {
            state.no_ticket_data = true
         }
         commit('SET_USERTICKETS', tickets)
      },
      filterCompletedTickets({
         state,
         commit
      }, periods) {
         var tickets = []
         state.userTickets = []
         for (let p = 0; p < periods.length; p++) {
            for (let t = 0; t < state.allTickets.length; t++) {

               if (state.allTickets[t] != null) {
                  if (state.allTickets[t].period != null) {
                     if (state.allTickets[t].period.id == periods[p]) {
                        state.no_ticket_data = false
                        tickets.push(state.allTickets[t])
                     }
                  }
               } else {
                  tickets = []
                  state.no_ticket_data = true
               }
            }
         }
         if (tickets.length == 0) {
            state.no_ticket_data = true
         }
         commit('SET_USERTICKETS', tickets)
      },

      //User Profile
      fetchUserProfilePicture({
         state,
         commit
      }, id) {
         SparrowService.getProfile(id).then(response => {
            if (response.data.length != 0) {
               state.imageInfos = response.data;
               state.image = 'data:image/jpeg;base64,' + response.data[0].image
               state.alt = response.data[0].title
               state.IsNew = false
               state.profilePictureID = response.data[0].id
            } else if (response.data.length == 0) {
               state.alt = "No Image"
               state.IsNew = true
            }
         });
      },
      fetchUserInfo({
         state,
         dispatch,
         commit
      }) {
         var authService = new AuthService();
         var graphService = new GraphService();
         authService.getToken().then(
            (token) => {
               if (token) {
                  graphService.getUserInfo(token).then(
                     (data) => {
                        SparrowService.getUserInfo(data.mail)
                           .then(response => {
                              commit("GET_USER_INFO", response.data)      
                                 dispatch({type:'fetchUserTickets', UserId:response.data[0].id,FY:state.activeFY.label})
                                 dispatch('fetchUserNotifications', response.data[0].id)
                                 dispatch({type:'fetchNonFunctionalActivities',id:response.data[0].id,fy:state.activeFY.label})
                                 dispatch('fetchTicketComplexitiesbyTeam', response.data[0].teamID)
                                 dispatch('fetchTicketMainCategoriesByTeam', response.data[0].teamID)
                                 dispatch('fetchTicketSub1CategoryByTeam', response.data[0].teamID)
                                 dispatch('fetchTicketStatusByTeam', response.data[0].teamID)
                                 dispatch('fetchSLAInfoByTeam', response.data[0].teamID)
                                 dispatch('fetchUserProfilePicture', response.data[0].id)
                                 dispatch('fetchBusinessUnitsByTeam', response.data[0].teamID)
                                 dispatch('fetchRequesterByTeam', response.data[0].teamID)
                                 dispatch('fetchUserChangeShift', response.data[0].id)
                              if (response.data[0].roleID == 1) {
                                 //Admin
                                 dispatch('fetchUsers')
                                 dispatch('fetchTeams',response.data[0].id)
                              } else if (response.data[0].roleID == 2) {
                                 //Team Lead
                                 dispatch('fetchUsersByTeam', response.data[0].teamID)
                                 dispatch('fetchUserNotifications', response.data[0].id)
                              } else if (response.data[0].roleID == 3) {
                                 //Supervisor
                                 dispatch('fetchUserProfilePicture', response.data[0].id)
                                 dispatch('fetchUserNotifications', response.data[0].id)
                                 dispatch('fetchUsersByTeams', response.data[0].team.supervisor_User_ID)
                                 dispatch('fetchSuperviorTeams', response.data[0].team.supervisor_User_ID)
                              }else if(response.data[0].roleID == 8){
                                 //Manager
                                 dispatch('fetchTeams', response.data[0].id)  
                              }
                           
                           })
                           .catch(error => {
                              console.log(error.response)
                           })
                     },
                     (error) => {
                        console.error(error);
                     }
                  );
               }
               console.log();
            },
            (error) => {
               console.error(error);
            }
         );

      },

      // Notification
      fetchUserNotifications({
         commit
      }, UserId) {
         SparrowService.getNotificationsByUser(UserId).then(response => {
               commit('SET_USER_NOTIFICATIONS', response.data)
            })
            .catch(error => {
               console.log(error.response)
            })
      },
      addNotification({
         commit
      }, notif) {
         SparrowService.postNotification(notif)
         commit('ADD_NOTIF', notif)
      },

      // Non-Functional Classification
      fetchNonFunctionalClassifications({
         commit
      }) {
         SparrowService.getNonFunctionalClassifications().then(response => {
               commit('SET_NON_FUNCTIONAL_CLASSIFICATION', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      // Non-Functional Activity
      fetchNonFunctionalActivities({
         state,
         commit
      }, {id,fy}) {
         state.ongoingNonFunctional = 0
         let activeNonFunctional = []
         SparrowService.getNonFunctionalTickets(id,fy).then(response => {
               state.allNFTickets = response.data
               if (response.data.length == 0) {
                  state.no_nf_data = true
                  state.nf_loader = false
               }
               for (let i = 0; i < response.data.length; i++) {
                  state.nf_loader = false

                  if (response.data[i].status == true) {
                     activeNonFunctional.push(response.data[i])
                     state.ongoingNonFunctional += 1
                  }

               }
               if (activeNonFunctional.length == 0) {
                  state.no_nf_data = true
               }
               commit('SET_NON_FUNCTIONAL_ACTIVITIES', activeNonFunctional)
               commit('SET_ALL_NON_FUNCTIONAL_ACTIVITIES',response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      addNonFunctionalActivities({
         commit
      }, nf_activity) {
         SparrowService.postNonFunctionalTickets(nf_activity).then(response => {
               commit('ADD_NON_FUNCTIONAL_ACTIVITIES', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      filterNonFunctionalActivitiesByStatus({
         state,
         commit
      }, status) {
         var nf_tickets = []
         state.non_functional_tickets = []
         for (let t = 0; t < state.allNFTickets.length; t++) {
            if (state.allNFTickets[t] != null) {
               if (state.allNFTickets[t].status == status) {
                  if (status == false) {
                     state.no_nf_data = true
                     nf_tickets = []
                  } else {
                     state.no_nf_data = false
                     nf_tickets.push(state.allNFTickets[t])
                  }
               }
            } else {
               nf_tickets = []
            }
         }
         if (nf_tickets.length == 0) {
            state.no_nf_data = true
         }
         commit('SET_NON_FUNCTIONAL_ACTIVITIES', nf_tickets)
      },
      filterNonFunctionalActivitiesByperiod({
         state,
         commit
      }, periods) {
         var nf_tickets = []
         state.non_functional_tickets = []
         for (let p = 0; p < periods.length; p++) {
            for (let t = 0; t < state.allNFTickets.length; t++) {

               if (state.allNFTickets[t] != null) {
                  if (state.allNFTickets[t].period != null) {

                     if (state.allNFTickets[t].period.id == periods[p]) {
                        if (state.allNFTickets[t].status == false) {
                           state.no_nf_data = false
                           nf_tickets.push(state.allNFTickets[t])
                        }
                     }
                  }
               } else {
                  nf_tickets = []
                  state.no_nf_data = true
               }
            }
         }
         if (nf_tickets.length == 0) {
            state.no_nf_data = true
         }
         commit('SET_NON_FUNCTIONAL_ACTIVITIES', nf_tickets)
      },

      // SLA INFO
      addSLAInfo({
         commit
      }, sla) {
         SparrowService.postTicketSLA(sla).then(response => {
               commit('ADD_SLA_INFO', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchSLAInfo({
         commit
      }) {
         SparrowService.getTicketSLAs().then(response => {
               commit('SET_SLA_INFO', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      fetchSLAInfoByTeam({
         commit
      }, team_id) {
         SparrowService.getTicketSLAbyTeam(team_id).then(response => {
               commit('SET_SLA_INFO_BY_TEAM', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },
      //Change Shift
      fetchUserChangeShift({
         commit
      }, UserId) {
         let CS = []
         SparrowService.getChangeShiftByUser(UserId).then(response => {
            var currentYear = moment().year();
            for(var cs_fy = 0; response.data.length > cs_fy; cs_fy++ ){
               var csYear = response.data[cs_fy].cS_Start_Time.split("-")
               if(csYear[0] != currentYear){
                  response.data.splice(cs_fy,1)
               }
            }
            CS =  response.data.sort(function(a, b) {
               var CSA = a.cS_Start_Time;
               var CSB = b.cS_Start_Time;
               return (CSA < CSB) ? -1 : (CSA > CSB) ? 1 : 0;
           });
               commit('SET_USER_CHANGE_SHIFT', CS)
              
            })
            .catch(error => {
               console.log(error.response)
            })
      },
      addChangeShift({
         commit
      }, change_shift) {
         SparrowService.postChangeShift(change_shift).then(response => {
               commit('ADD_CHANGE_SHIFT', response.data)
            })
            .catch(error => {
               
               console.log(error.response)
            })
      },

   },
   mutations: {
      ADD_ROLE(state, role) {
         state.roles.push(role)
      },
      // EDIT_ROLE (state, role) {
      //    state.roles.push(role)
      // },
      ADD_TICKETCLASSIFICATION(state, classification) {},
      ADD_TICKETCOMPLEXITY(state, complexity) {},
      ADD_TICKETMAINCATEGORY(state, main_Category) {},
      ADD_TICKETSUB1CATEGORY(state, sub1_Category) {},
      ADD_TICKETSTATUS(state, ticket_Status) {},
      ADD_BU(state, business_unit) {

      },
      ADD_TEAM(state, team) {

      },
      ADD_TICKET(state) {

      },
      EDIT_TICKET(state) {

      },
      ADD_USER(state) {

      },
      ADD_NOTIF(state) {

      },
      ADD_NON_FUNCTIONAL_ACTIVITIES(state) {

      },
      ADD_SLA_INFO(state){},
      ADD_CHANGE_SHIFT(state){},
      SET_USERS(state, users) {
         state.users.push(users)
         state.users_count = users.length

      },
      SET_USERSBYTEAM(state, users) {
         state.usersByTeam.push(users)
      },
      SET_SUPERVISOR_TEAMS(state, teams) {
         state.supervior_teams.push(teams)
      },
      SET_TEAMS(state, {teams,userID}) {
         state.teams.push(teams)
         for(var i = 0; i < teams.length; i++){
            //195 - Vivs ID
            //259 - James ID
            if(teams[i].manager_User_ID ==  userID ){
               state.opsManagerTeams.push(teams[i])
            }
         }
      },
      SET_SHIFTSCHEDULES(state, shift_schedules) {
         state.shift_schedules.push(shift_schedules)
      },
      SET_ROLES(state, roles) {
         state.roles.push(roles)
      },
      SET_BU(state, business_units) {
         state.business_units.push(business_units)
      },
      SET_BU_BY_TEAM(state, business_units) {
         state.business_units_by_team.push(business_units)
      },
      SET_REQUESTER_BY_TEAM(state, requesters) {
         state.requesters_by_team.push(requesters)
      },
      SET_TICKETCLASSIFICATIONS(state, classification) {
         state.classifications.push(classification)
      },
      SET_TICKETCLASSIFICATIONSBYTEAM(state, classificationsByTeam) {
         state.classificationsByTeam.push(classsificationsByTeam)
      },
      SET_TICKETCOMPLEXITIES(state, complexities) {
         state.complexities.push(complexities)
      },
      SET_TICKETCOMPLEXITIESBYTEAM(state, complexitiesByTeam) {
         state.complexitiesByTeam.push(complexitiesByTeam)
      },
      SET_WORLD_AREA(state, world_area) {
         state.world_areas.push(world_area)
      },
      SET_PERIODS(state, periods) {
         state.periods.push(periods)
      },
      SET_FY(state, fy) {
         state.fiscalYears.push(fy)
      },
      SET_TICKETMAINCATEGORY(state, main_Categories) {
         state.main_Categories.push(main_Categories)
      },
      SET_QUALITYRATINGS(state, quality_ratings) {
         state.qualityRatings.push(quality_ratings)
      },
      SET_TICKETMAINCATEGORY_BY_TEAM(state, main_category_by_team) {
         state.main_Categories_by_team.push(main_category_by_team)
      },
      SET_TICKETSUB1CATEGORY(state, sub1_Categories) {
         state.sub1_Categories.push(sub1_Categories)
      },
      SET_TICKETSUB1CATEGORYBYMAINCATEGORY(state, sub1_categories) {
         state.sub1_Categories_By_Main_Category.push(sub1_categories)
      },
      SET_TICKETSUB1CATEGORYBYTEAM(state, sub1_categories) {
         state.sub1_Categories_By_Team.push(sub1_categories)
      },
      SET_TICKETSTATUS(state, ticket_statuses) {
         state.ticket_statuses.push(ticket_statuses)
      },
      SET_TICKETSTATUSBYTEAM(state, status_by_team) {
         state.ticket_Status_by_team.push(status_by_team)
         for (let i = 0; i < status_by_team.length; i++) {
            if (status_by_team[i].status.toLowerCase() == "in-progress" ||
               status_by_team[i].status.toLowerCase() == "in progress" ||
               status_by_team[i].status.toLowerCase() == "started" ||
               status_by_team[i].status.toLowerCase() == "current") {
               state.inProgressID = status_by_team[i].id
               state.inProgressStatus = status_by_team[i].status
               state.filterValue = status_by_team[i].status
            } else if (status_by_team[i].status.toLowerCase() == "completed" ||
               status_by_team[i].status.toLowerCase() == "closed" ||
               status_by_team[i].status.toLowerCase() == "done") {
               state.completedID = status_by_team[i].id
               state.completedStatus = status_by_team[i].status
            }
         }
      },
      SET_USERTICKETS(state, UserTickets) {
         state.userTickets.push(UserTickets)
         state.totalTicketCount = UserTickets.length
         //console.log("totalTicketCount",UserTickets.length);
      },
      SET_TEAMTICKETS(state, TeamTickets) {
         state.teamTickets.push(TeamTickets)
      },
      EDIT_TICKETSUB1CATEGORY(state, sub1_Category) {
         state.sub1_Category.forEach(sub1_Category => {
            if (sub1_Category.id == sub1_Category.id) {
               sub1_Category = sub1_Category;
            }
         })
      },
      SET_USER_NOTIFICATIONS(state, notification) {
         state.notifications.push(notification)
         state.notif_count = state.notifications[0].length
      },
      SET_NON_FUNCTIONAL_CLASSIFICATION(state, non_functional_classifications) {
         state.non_functional_classifications.push(non_functional_classifications)
      },
      SET_NON_FUNCTIONAL_ACTIVITIES(state, non_functional_activities) {
         state.non_functional_tickets.push(non_functional_activities)
      },
      SET_ALL_NON_FUNCTIONAL_ACTIVITIES(state, non_functional_activities){
         state.all_non_functional_tickets.push(non_functional_activities)
      },
      SET_SLA_INFO(state, SLAs) {
         state.SLAs.push(SLAs)
      },
      SET_SLA_INFO_BY_TEAM(state, SLAs) {
         state.SLAByTeam.push(SLAs)
      },
      SET_USER_CHANGE_SHIFT(state,ChangeShifts){
         state.user_CS.push(ChangeShifts)
      },

      GET_USER_INFO(state, UserInfo) {
         state.userInfo.push(UserInfo)
         state.userName = UserInfo[0].first_Name + " " + UserInfo[0].last_Name
         state.userID = UserInfo[0].id
         state.teamID = UserInfo[0].teamID
         state.showTimer = UserInfo[0].team.showTimer
         state.user_shift = UserInfo[0].shift_Schedule
         state.world_area_support = UserInfo[0].world_Area.abbreviation
         state.isLogIn = true
         if (UserInfo[0].length != 0) {
            if (UserInfo[0].status == false) {
               state.isRegistered = true
            }
         } else if (UserInfo[0].length == 0) {
            state.isRegistered = false
         }

         if (UserInfo[0].length != 0 && UserInfo[0].status == true && UserInfo[0].roleID == 1) {
            state.isAdmin = true
         } else if (UserInfo[0].length != 0 && UserInfo[0].status == true && state.userInfo[0][0].roleID == 8) {
            state.isManager = true
         } else if (UserInfo[0].length != 0 && UserInfo[0].status == true && UserInfo[0].roleID == 2) {
            state.isTeamLead = true
            var project = []
            var project_promise = []

            var transactional = []
            var transactional_promise = []


            SparrowService.getTicketsByTeam(state.userInfo[0][0].teamID)
               .then(response => {
                  state.teamTickets.push(response.data)
               })

            //Transactional
            for (let t = 0; t < state.periods[0].length; t++) {
               transactional_promise.push(
                  SparrowService.getTicketOpsDashboard(state.activeFY.id, state.periods[0][t].id, state.userInfo[0][0].teamID, 1)
                  .then(response => {
                     response.data["periodID"] = state.periods[0][t].id
                     response.data["period"] = state.periods[0][t].abbreviation
                     transactional.push(response.data)
                  })
               )
            }

            Promise.all(transactional_promise).then(() => {
               state.OpsDashboard_Transactionals = transactional.sort(function (a, b) {
                  var periodA = a.periodID;
                  var periodB = b.periodID;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
            })

            //Projects
            for (let t = 0; t < state.periods[0].length; t++) {
               project_promise.push(
                  SparrowService.getTicketOpsDashboard(state.activeFY.id, state.periods[0][t].id, state.userInfo[0][0].teamID, 2)
                  .then(response => {
                     response.data["periodID"] = state.periods[0][t].id
                     response.data["period"] = state.periods[0][t].abbreviation
                     project.push(response.data)

                  })
               )

            }
            Promise.all(project_promise).then(() => {
               state.OpsDashboard_Projects = project.sort(function (a, b) {
                  var periodA = a.periodID;
                  var periodB = b.periodID;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
            })
         } else if (state.userInfo[0][0].length != 0 && state.userInfo[0][0].status == true && state.userInfo[0][0].roleID == 3) {
            state.isSupervisor = true
            var project = []
            var project_promise = []

            var transactional = []
            var transactional_promise = []

            //Transactional
            for (let t = 0; t < state.periods[0].length; t++) {
               transactional_promise.push(
                  SparrowService.getTicketSupOpsDashboard(state.activeFY.id, state.periods[0][t].id, state.userInfo[0][0].team.supervisor_User_ID, 1)
                  .then(response => {
                     response.data["periodID"] = state.periods[0][t].id
                     response.data["period"] = state.periods[0][t].abbreviation
                     transactional.push(response.data)
                  })
               )
            }

            Promise.all(transactional_promise).then(() => {
               state.Sup_OpsDashboard_Transactionals = transactional.sort(function (a, b) {
                  var periodA = a.periodID;
                  var periodB = b.periodID;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
            })

            //Projects
            for (let t = 0; t < state.periods[0].length; t++) {
               project_promise.push(
                  SparrowService.getTicketSupOpsDashboard(state.activeFY.id, state.periods[0][t].id, state.userInfo[0][0].team.supervisor_User_ID, 2)
                  .then(response => {
                     response.data["periodID"] = state.periods[0][t].id
                     response.data["period"] = state.periods[0][t].abbreviation
                     project.push(response.data)

                  })
               )

            }
            Promise.all(project_promise).then(() => {
               state.Sup_OpsDashboard_Projects = project.sort(function (a, b) {
                  var periodA = a.periodID;
                  var periodB = b.periodID;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
            })


         }
      }

   },
})