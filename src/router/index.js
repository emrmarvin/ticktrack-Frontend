import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AuthService from "../services/AuthService";
import GraphService from "../services/GraphService";
import SparrowService from "@/services/SparrowService.js";
import axios from "axios";

Vue.use(VueRouter)

const routes = [
  {
    path: '/change-shift',
    name: 'ChangeShift',
    component: () => import('../views/ChangeShift.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },

  {
    path: '/tl-dashboard',
    name: 'HomeTL',
    component: () => import('../views/HomeTL.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/sup-dashboard',
    name: 'HomeSup',
    component: () => import('../views/HomeSup.vue')
  },
  {
    path: '/manager-dashboard',
    name: 'DashboardManager',
    component: () => import('../components/Dashboards/DashboardManager.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/group-management',
    name: 'Groups-Settings',
    component: () => import('../views/GroupsSettings.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: () => import('../views/UserSettings.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('../views/Roles.vue')
  },
  {
    path: '/ticket-settings',
    name: 'TicketSettings',
    component: () => import('../views/TicketSettings.vue')
  },
  {
    path: '/sup-tl-ticket-settings',
    name: 'SupTLTicketSettings',
    component: () => import('../views/Sup_TL_TeamTicketSettings.vue')
  },

  {
    path: '/ticket-requests',
    name: 'Tickets',
    component: () => import('../views/Tickets.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/tickets-table',
    name: 'TicketsTable',
    component: () => import('../components/Tickets/TicketsTable.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/import',
    name: 'ImportTicket',
    component: () => import('../components/Import/ImportTicket.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                      if(response.data[0].status == false){
                        next('/pending-approval')
                      }
                      else{
                        if(response.data[0].roleID == 3){
                          next('/sup-dashboard')
                        }else if(response.data[0].roleID == 8){
                          next('/manager-dashboard')
                        }
                        else{
                          next()
                        }
                      }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next()
                   }else if(response.data.length != 0) {
                    if(response.data[0].status == false){
                      next('/pending-approval')
                     }
                     else{
                      next({name:'Home'})
                     }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/pending-approval',
    name: 'PendingApproval',
    component: () => import('../components/Users/PendingUserApproval.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      var graphService = new GraphService();
      authService.getToken().then(
        (token) => {
          if (token) {
            graphService.getUserInfo(token).then(
              (data) => {
                SparrowService.getUserInfo(data.mail)
                .then(response =>{
                   if(response.data.length == 0){
                    next('/register')
                   }else if(response.data.length != 0) {
                    if(response.data[0].status == false){
                      next()
                     }
                     else{
                      next({name:'Home'})
                     }
                   } 
                })
                .catch(error => {
                  console.log(error.response)
               })
              },
              (error) => {
                console.error(error);
              }
            )
            
          }
          else next({name:'Log-In'})
        })
    }
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: () => import('../views/404NotFound.vue')
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/Maintenance.vue')
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/ErrorPage.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../components/Users/UserCards.vue')
  },
  {
    path: '/user-profile',
    name: 'User-profile',
    component: () => import('../components/Users/UserProfile.vue')
  },
  {
    path: '/*',
    name: 'Log-In',
    component: () => import('../views/LogIn.vue'),
    beforeEnter: (to, from, next) => {
      var authService = new AuthService();
      authService.getToken().then(
        (token) => {
          if (!token) {
            next()
          }
          else next('/home') ;
        })
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
